import React, { useState } from 'react';
import '@components/comments/comment-modal/CommentModal.scss';
import ReactionWrapper from '@components/posts/modal-wrapper/reaction-wrapper/ReactionWrapper';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import { postService } from '@services/api/post/post.service';
import { ICommentData } from '@interfaces/index';
import useEffectOnce from '@hooks/useEffectOnce';
import Avatar from '@components/avatar/Avatar';
import { closeModal } from '@redux-toolkit/reducers/modal/modal.reducer';
import { clearPost } from '@redux-toolkit/reducers/post/post.reducer';

const CommentModal = () => {
  const { post, _id } = useSelector((state: RootState) => state.post);
  const [postComments, setPostComments] = useState<ICommentData[]>([]);
  const dispatch = useDispatch();

  const getPostComments = async () => {
    try {
      const response = await postService.getPostComments(_id);
      setPostComments(response.data.comments);
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };
  const closeCommentsModal = () => {
    dispatch(closeModal());
    dispatch(clearPost());
  };
  useEffectOnce(() => {
    getPostComments();
  });
  return (
    <>
      <ReactionWrapper closeModal={closeCommentsModal}>
        <div className="modal-comments-header">
          <h2>Comments</h2>
        </div>
        <div className="modal-comments-container">
          <ul className="modal-comments-container-list">
            {postComments.map((data) => (
              <li className="modal-comments-container-list-item" key={data?._id} data-testid="modal-list-item">
                <div className="modal-comments-container-list-item-display">
                  <div className="user-img">
                    <Avatar
                      name={data?.username}
                      bgColor={data?.avatarColor}
                      textColor="#ffffff"
                      size={45}
                      avatarSrc={data?.profilePicture}
                    />
                  </div>
                  <div className="modal-comments-container-list-item-display-block">
                    <div className="comment-data">
                      <h1>{data?.username}</h1>
                      <p>{data?.comment}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </ReactionWrapper>
    </>
  );
};

export default CommentModal;
