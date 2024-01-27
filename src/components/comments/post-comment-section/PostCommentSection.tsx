import React from 'react';
import '@components/comments/post-comment-section/PostCommentSection.scss';
import { IPostData } from '@interfaces/index';
import CommentArea from '../comment-area/CommentArea';
import ReactionsAndCommentsDisplay from '@components/posts/reactions/reactions-and-comments-display/ReactionsAndCommentsDisplay';

interface IPostCommentSection {
  post: IPostData;
}
const PostCommentSection: React.FC<IPostCommentSection> = ({ post }) => {
  return (
    <div id="comment-section">
      <ReactionsAndCommentsDisplay post={post} />
      <CommentArea post={post} />
    </div>
  );
};

export default PostCommentSection;
