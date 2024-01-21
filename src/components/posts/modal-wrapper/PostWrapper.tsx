import React, { ReactNode } from 'react';
import '@components/posts/modal-wrapper/PostWrapper.scss';

const PostWrapper: React.FC<{ children: ReactNode[] }> = ({ children }) => {
  return (
    <div className="modal-wrapper">
      {children[1]}
      {children[2]}
      {children[3]}
      <div className="modal-bg"></div>
    </div>
  );
};

export default PostWrapper;
