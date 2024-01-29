import React from 'react';
import '@components/gallery-image/GalleryImage.scss';
import { IPostData } from '@interfaces/index';
import { FaTrash } from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import DateTimeUtil from '@services/utils/date-time.service';

interface IGalleryImage {
  post: IPostData;
  showCaption: boolean;
  showDelete: boolean;
  imgSrc: string;
  onClick: () => void;
  onRemoveImage?: () => void;
}
const GalleryImage: React.FC<IGalleryImage> = ({ post, showCaption, showDelete, imgSrc, onClick, onRemoveImage }) => {
  return (
    <>
      <figure className="gallery-image" onClick={onClick}>
        <div className="gallery-image__crop">
          <img src={imgSrc} alt="" className="gallery-image__media" />
          {showDelete && (
            <span className="gallery-image__delete" onClick={onRemoveImage}>
              <FaTrash />
            </span>
          )}
          {showCaption && (
            <figcaption className="gallery-image__caption">
              <div className="figure-header">
                <Avatar name={post.username} bgColor={post.bgColor} textColor="#ffffff" size={40} avatarSrc={post.profilePicture} />
                <div className="figure-body">
                  <span className="figure-title">{post.username}</span>
                  <span className="figure-date">{DateTimeUtil.transform(post.createdAt)}</span>
                </div>
              </div>
            </figcaption>
          )}
        </div>
      </figure>
    </>
  );
};

export default GalleryImage;
