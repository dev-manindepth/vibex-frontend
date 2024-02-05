import React from 'react';
import '@components/chat/image-preview/ImagePreview.scss';
import { FaTimes } from 'react-icons/fa';

interface IImagePreview {
  image: string;
  onRemoveImage: () => void;
}
const ImagePreview: React.FC<IImagePreview> = ({ image, onRemoveImage }) => {
  return (
    <div className="image-preview-container">
      <div className="image-preview">
        <img src={image} alt="" className="img" />
        <FaTimes className="icon" onClick={onRemoveImage} />
      </div>
    </div>
  );
};

export default ImagePreview;
