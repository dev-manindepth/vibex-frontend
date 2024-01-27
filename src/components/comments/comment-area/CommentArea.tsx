import '@components/comments/comment-area/CommentArea.scss';
import Reactions from '@components/posts/reactions/Reactions';
import { IPostData, IReactionData, IReactions } from '@interfaces/index';
import React, { useCallback, useEffect, useState } from 'react';
import { FaRegCommentAlt } from 'react-icons/fa';
import { Utils } from '@services/utils/utils.service';
import { reactionsMap } from '@services/utils/static.data';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import { postService } from '@services/api/post/post.service';
import { addReactions } from '@redux-toolkit/reducers/post/user-post-reaction';
import { socketService } from '@services/socket/socket.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { clearPost, updatePostItem } from '@redux-toolkit/reducers/post/post.reducer';

interface ICommentArea {
  post: IPostData;
}

const CommentArea: React.FC<ICommentArea> = ({ post }) => {
  const { profile } = useSelector((state: RootState) => state.user);
  let { reactions } = useSelector((state: RootState) => state.userPostReactions);
  const [userSelectedReaction, setUserSelectedReaction] = useState('');
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const [setSelectedPostId] = useLocalStorage('selectedPostId', 'set');

  const dispatch = useDispatch();

  const selectedUserReaction = useCallback(
    (reactions: IReactionData[]) => {
      const userReaction = reactions.find((reaction) => reaction.postId === post._id);
      const reaction = userReaction ? Utils.firstLetterUpperCase(userReaction.type) : '';
      setUserSelectedReaction(reaction);
    },
    [post]
  );

  const toggleCommentInput = () => {
    if (!selectedPostId) {
      setSelectedPostId(post._id);
      dispatch(updatePostItem(post));
    } else {
      removeSelectedPostId();
    }
  };
  const removeSelectedPostId = () => {
    if (selectedPostId === post._id) {
      setSelectedPostId('');
      dispatch(clearPost());
    } else {
      setSelectedPostId(post._id);
      dispatch(updatePostItem(post));
    }
  };

  useEffect(() => {
    selectedUserReaction(reactions);
  }, [selectedUserReaction, reactions]);
  const addReactionToPost = async (reaction: string) => {
    try {
      const response = await postService.getSinglePostReactionByUsername(post._id, profile?.username!);
      post = updatePostReactions(reaction, Object.keys(response.data.reactions).length > 0, response.data.reactions.type);

      const postReactions = addNewReaction(reaction, Object.keys(response.data.reactions).length > 0, response.data.reactions.type);
      reactions = [...postReactions];
      dispatch(addReactions(reactions));
      sendSocketIOReactions(post, reaction, Object.keys(response.data.reactions).length > 0, response.data.reactions.type);

      const reactionsData = {
        userTo: post.userId,
        postId: post._id,
        type: reaction,
        postReactions: post.reactions,
        profilePicture: profile?.profilePicture!,
        previousReaction: Object.keys(response.data.reactions).length ? (response.data.reactions.type as string) : ''
      };
      if (!Object.keys(response.data.reactions).length) {
        await postService.addReaction(reactionsData);
      } else {
        reactionsData.previousReaction = response.data.reactions.type;
        if (reaction === reactionsData.previousReaction) {
          await postService.removeReaction(post._id, reactionsData.previousReaction, post.reactions);
        } else {
          await postService.addReaction(reactionsData);
        }
      }
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };
  const updatePostReactions = (newReaction: string, hasResponse: boolean, previousReaction: string) => {
    post = JSON.parse(JSON.stringify(post));
    if (!hasResponse) {
      post.reactions[newReaction as keyof IReactions] += 1;
    } else {
      if (post.reactions[previousReaction as keyof IReactions] > 0) {
        post.reactions[previousReaction as keyof IReactions] -= 1;
      }
      if (previousReaction !== newReaction) {
        post.reactions[newReaction as keyof IReactions] += 1;
      }
    }
    return post;
  };
  const addNewReaction = (newReaction: string, hasResponse: boolean, previousReaction: string) => {
    const postReaction = reactions.filter((reaction) => reaction.postId !== post._id);

    const newPostReaction: IReactionData = {
      avatarColor: profile?.avatarColor!,
      createdAt: `${new Date()}`,
      postId: post._id,
      profilePicture: profile?.profilePicture!,
      username: profile?.username!,
      type: newReaction
    };
    if ((hasResponse && previousReaction !== newReaction) || !hasResponse) {
      postReaction.push(newPostReaction);
    }
    return postReaction;
  };
  const sendSocketIOReactions = (post: IPostData, reaction: string, hasResponse: boolean, previousReaction: string) => {
    const socketReactionData = {
      userTo: post.userId,
      postId: post._id,
      username: profile?.username,
      avatarColor: profile?.avatarColor,
      type: reaction,
      profilePicture: profile?.profilePicture,
      previousReaction: hasResponse ? previousReaction : ''
    };
    socketService.socket.emit('reaction', socketReactionData);
  };

  return (
    <div className="comment-area" data-testid="comment-area">
      <div className="like-icon reactions">
        <div className="likes-block" onClick={() => addReactionToPost('like')}>
          <div className={`likes-block-icons reaction-icon ${userSelectedReaction.toLowerCase()}`}>
            {userSelectedReaction && (
              <div className={`reaction-display ${userSelectedReaction.toLowerCase()}`} data-testid="selected-reaction">
                <img className="reaction-img" src={reactionsMap[userSelectedReaction.toLowerCase()]} alt="like" />
                <span>{userSelectedReaction}</span>
              </div>
            )}
            {!userSelectedReaction && (
              <div className="reaction-display" data-testid="default-reaction">
                <img className="reaction-img" src={reactionsMap['like']} alt="" /> <span>Like</span>
              </div>
            )}
          </div>
        </div>
        <div className="reactions-container app-reactions">
          <Reactions handleClick={addReactionToPost} />
        </div>
      </div>
      <div className="comment-block" onClick={toggleCommentInput}>
        <span className="comments-text">
          <FaRegCommentAlt className="comment-alt" /> <span>Comments</span>
        </span>
      </div>
    </div>
  );
};

export default CommentArea;
