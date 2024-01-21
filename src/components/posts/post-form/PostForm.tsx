import React, { useRef, useState } from 'react';
import '@components/posts/post-form/PostForm.scss';
import Avatar from '@components/avatar/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import Input from '@components/input/Input';
import photo from '@assets/images/photo.png';
import gif from '@assets/images/gif.png';
import felling from '@assets/images/feeling.png';
import { openModal, toggleFeelingModal, toggleGifModal, toggleImageModal } from '@redux-toolkit/reducers/modal/modal.reducer';
import AddPost from '../post-modal/post-add/AddPost';
import { ImageUtils } from '@services/utils/image-utils.service';

const PostForm = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { type, isOpen, openFileDialog, gifModalIsOpen, feelingIsOpen } = useSelector((state: RootState) => state.modal);
  const { post } = useSelector((state: RootState) => state.post);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const [selectedPostImage, setSelectedPostImage] = useState<File>();
  const openPostModal = () => {
    dispatch(openModal({ type: 'add' }));
  };
  const openImageModal = () => {
    fileInputRef.current?.click();
    dispatch(openModal({ type: 'add' }));
    dispatch(toggleImageModal(!openFileDialog));
  };
  const openGifModal = () => {
    dispatch(openModal({ type: 'add' }));
    dispatch(toggleGifModal(!gifModalIsOpen));
  };
  const openFeelingsComponent = () => {
    dispatch(openModal({ type: 'add' }));
    dispatch(toggleFeelingModal(!feelingIsOpen));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ImageUtils.addFileToReduxStore(e, post, setSelectedPostImage, dispatch);
  };
  return (
    <>
      <div className="post-form" data-testid="post-form">
        <div className="post-form-row">
          <div className="post-form-header">
            <h4 className="post-form-title">Create Post</h4>
          </div>
          <div className="post-form-body">
            <div className="post-form-input-body" data-testid="input-body" onClick={openPostModal}>
              <Avatar
                name={profile?.username}
                bgColor={profile?.avatarColor}
                textColor="#ffffff"
                size={50}
                avatarSrc={profile?.profilePicture}
              />
              <div className="post-form-input" data-placeholder="Write something here..."></div>
            </div>
            <hr />
            <ul className="post-form-list" data-testid="list-item">
              <li className="post-form-list-item image-select" onClick={openImageModal}>
                <Input
                  name="image"
                  ref={fileInputRef}
                  type="file"
                  className="file-input"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                  handleChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e)}
                />
                <img src={photo} alt="" /> Photo
              </li>
              <li className="post-form-list-item" onClick={openGifModal}>
                <img src={gif} alt="" /> Gif
              </li>
              <li className="post-form-list-item" onClick={openFeelingsComponent}>
                <img src={felling} alt="" /> Feeling
              </li>
            </ul>
          </div>
        </div>
      </div>
      {isOpen && type == 'add' && <AddPost selectedImage={selectedPostImage} />}
    </>
  );
};

export default PostForm;
