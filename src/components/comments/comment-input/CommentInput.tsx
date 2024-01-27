import React, { ChangeEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import '@components/comments/comment-input/CommentInput.scss';
import { ICommentData, IPostData } from '@interfaces/index';
import Input from '@components/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import { Utils } from '@services/utils/utils.service';
import { socketService } from '@services/socket/socket.service';
import { postService } from '@services/api/post/post.service';

interface ICommentInput {
  post: IPostData;
}
const CommentInput: React.FC<ICommentInput> = ({ post }) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [comment, setComment] = useState('');
  const commentInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const submitComment = async (event: SyntheticEvent) => {
    event.preventDefault();
    try {
      post = JSON.parse(JSON.stringify(post));
      post.commentsCount += 1;
      const socketCommentBody: ICommentData = {
        userTo: post.userId,
        username: profile?.username!,
        avatarColor: profile?.avatarColor!,
        postId: post._id,
        comment: comment.trim(),
        commentsCount: post.commentsCount,
        profilePicture: profile?.profilePicture!
      };
      const commentBody = {
        userTo: post.userId,
        postId: post._id,
        profilePicture: profile?.profilePicture,
        comment: comment.trim()
      };
      socketService.socket.emit('comment', socketCommentBody);
      await postService.addComment(commentBody);
      setComment('');
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    if (commentInputRef.current) {
      commentInputRef.current?.focus();
    }
  }, []);
  return (
    <div className="comment-container">
      <form className="comment-form" onSubmit={submitComment}>
        <Input
          ref={commentInputRef}
          name="comment"
          type="text"
          value={comment}
          labelText=""
          className="comment-input"
          placeholder="Write a comment..."
          handleChange={(event) => setComment(event.target.value)}
        />
      </form>
    </div>
  );
};

export default CommentInput;
