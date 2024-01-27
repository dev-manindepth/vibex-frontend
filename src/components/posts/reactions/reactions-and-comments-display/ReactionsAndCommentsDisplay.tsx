import { ICommentNameList, IFormattedReaction, IPostData, IReactionData, IReactions } from '@interfaces/index';
import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import like from '@assets/reactions/like.png';
import '@components/posts/reactions/reactions-and-comments-display/ReactionsAndCommentsDisplay.scss';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { postService } from '@services/api/post/post.service';
import { reactionsMap } from '@services/utils/static.data';
import { updatePostItem } from '@redux-toolkit/reducers/post/post.reducer';
import { RootState } from '@redux-toolkit/store';
import { toggleCommentsModal, toggleReactionsModal } from '@redux-toolkit/reducers/modal/modal.reducer';

interface IReactionsAndCommentsDisplay {
  post: IPostData;
}
const ReactionsAndCommentsDisplay: React.FC<IReactionsAndCommentsDisplay> = ({ post }) => {
  const { reactionModalIsOpen, commentModalIsOpen } = useSelector((state: RootState) => state.modal);
  const [postReactions, setPostReactions] = useState<IReactionData[]>([]);
  const [reactions, setReactions] = useState<IFormattedReaction[]>();
  const [postCommentNames, setPostCommentNames] = useState<string[]>([]);
  const dispatch = useDispatch();
  const getPostReactions = async () => {
    try {
      const response = await postService.getPostReactions(post._id);
      setPostReactions(response.data.reactions);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  const sumAllReactions = (reactions: IFormattedReaction[]) => {
    if (reactions.length) {
      const result = reactions.map((reaction) => reaction.value).reduce((prev, next) => prev + next);
      return Utils.shortenLargeNumbers(result);
    }
  };
  const openReactionsComponent = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleReactionsModal(!reactionModalIsOpen));
  };
  const openCommentsComponent = () => {
    dispatch(updatePostItem(post));
    dispatch(toggleCommentsModal(!commentModalIsOpen));
  };
  const getPostCommentNames = async () => {
    try {
      const response = await postService.getPostCommentsNames(post._id);
      setPostCommentNames([...new Set(response.data.comments.names as string[])]);
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };
  useEffect(() => {
    setReactions(Utils.formattedReactions(post.reactions));
  }, [post]);

  return (
    <div className="reactions-display">
      <div className="reaction">
        <div className="likes-block">
          <div className="likes-block-icons reactions-icon-display">
            {reactions &&
              reactions.length > 0 &&
              reactions.map((reaction) => (
                <div className="tooltip-container" key={Utils.generateString(10)}>
                  <img
                    data-testid="reaction-img"
                    className="reaction-img"
                    src={`${reactionsMap[reaction.type]}`}
                    alt=""
                    onMouseEnter={getPostReactions}
                  />
                  <div className="tooltip-container-text tooltip-container-bottom" data-testid="reaction-tooltip">
                    <p className="title">
                      <img className="title-img" src={`${reactionsMap[reaction.type]}`} alt="" />
                      {reaction.type.toUpperCase()}
                    </p>
                    <div className="likes-block-icons-list">
                      {postReactions.length === 0 && <FaSpinner className="circle-notch" />}
                      {postReactions.length && (
                        <>
                          {postReactions.slice(0, 19).map((postReaction) => (
                            <div key={Utils.generateString(10)}>
                              {postReaction.type === reaction.type && <span key={postReaction._id}>{postReaction.username}</span>}
                            </div>
                          ))}
                          {postReactions.length > 20 && <span>and {postReactions.length - 20} others...</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <span
            data-testid="reactions-count"
            className="tooltip-container reactions-count"
            onMouseEnter={getPostReactions}
            onClick={openReactionsComponent}
          >
            {reactions && reactions.length > 0 && sumAllReactions(reactions)}
            <div className="tooltip-container-text tooltip-container-likes-bottom" data-testid="tooltip-container">
              <div className="likes-block-icons-list">
                {postReactions.length === 0 && <FaSpinner className="circle-notch" />}
                {postReactions.length && (
                  <>
                    {postReactions.slice(0, 19).map((postReaction) => (
                      <span key={Utils.generateString(10)}>{postReaction.username}</span>
                    ))}
                    {postReactions.length > 20 && <span>and {postReactions.length - 20} others...</span>}
                  </>
                )}
              </div>
            </div>
          </span>
        </div>
      </div>
      <div className="comment tooltip-container" data-testid="comment-container" onClick={openCommentsComponent}>
        {post.commentsCount > 0 && (
          <span data-testid="comment-count" onMouseEnter={getPostCommentNames}>
            {Utils.shortenLargeNumbers(post.commentsCount)} {`${post.commentsCount === 1 ? 'Comment' : 'Comments'}`}
          </span>
        )}
        <div className="tooltip-container-text tooltip-container-comments-bottom" data-testid="comment-tooltip">
          <div className="likes-block-icons-list">
            {postCommentNames.length === 0 && <FaSpinner className="circle-notch" />}
            {postCommentNames.length && (
              <>
                {postCommentNames.slice(0, 19).map((name) => (
                  <span key={Utils.generateString(10)}>{name}</span>
                ))}
                {postCommentNames.length > 20 && <span>and {postCommentNames.length - 20} others...</span>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionsAndCommentsDisplay;
