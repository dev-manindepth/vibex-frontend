import PostWrapper from '@components/posts/modal-wrapper/PostWrapper';
import { RootState } from '@redux-toolkit/store';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@components/posts/post-modal/post-add/AddPost.scss';
import ModalBoxContent from '../modal-box-content/ModalBoxContent';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { bgColors } from '@services/utils/static.data';
import ModalBoxSelection from '../modal-box-content/ModalBoxSelection';
import Button from '@components/button/Button';
import { PostUtils } from '@services/utils/post-utils.service';
import { IPostFormData } from '@interfaces/index';
import { closeModal, toggleGifModal } from '@redux-toolkit/reducers/modal/modal.reducer';
import Giphy from '@components/giphy/Giphy';
import { ImageUtils } from '@services/utils/image-utils.service';
import { postService } from '@services/api/post/post.service';
import Spinner from '@components/spinner/Spinner';

interface IAddPost {
  selectedImage: File | undefined;
}
const AddPost: React.FC<IAddPost> = ({ selectedImage }) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { gifModalIsOpen, feeling } = useSelector((state: RootState) => state.modal);
  const { gifUrl, image, privacy } = useSelector((state: RootState) => state.post);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string>();
  const [postImage, setPostImage] = useState('');
  const [allowedNoOfChars] = useState('100/100');
  const [textAreaBackground, setTextAreaBackground] = useState('#ffffff');
  const [postData, setPostData] = useState<IPostFormData>({
    post: '',
    bgColor: textAreaBackground,
    privacy: '',
    feelings: '',
    gifUrl: '',
    profilePicture: '',
    image: ''
  });
  const [disable, setDisable] = useState(true);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLDivElement | null>(null);
  const [selectedPostImage, setSelectedPostImage] = useState<File | null>();
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const selectBackground = (bgColor: string) => {
    PostUtils.selectBackground(bgColor, postData, setTextAreaBackground, setPostData);
  };
  const MAX_NO_OF_CHARACTER = 100;
  const postInputEditable = (event: React.SyntheticEvent, textContent: string) => {
    const currentTextLength = (event.target as HTMLElement).textContent?.length || 0;
    const counter = MAX_NO_OF_CHARACTER - currentTextLength;
    if (counterRef.current) {
      counterRef.current.textContent = `${counter}/100`;
    }
    setDisable(currentTextLength <= 0 && !postImage);
    PostUtils.postInputEditable(textContent, postData, setPostData);
  };
  const onKeyDown = (event: React.KeyboardEvent) => {
    const currentTextLength = (event.target as HTMLElement).textContent?.length || 0;
    if (currentTextLength === MAX_NO_OF_CHARACTER && event.keyCode !== 8) {
      event.preventDefault();
    }
  };
  const closePostModal = () => {
    PostUtils.clostPostModal(dispatch);
  };
  const removeSelectedImage = () => {
    PostUtils.removeSelectedImage(postData, '', inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData);
  };
  const createPost = async () => {
    setLoading(!loading);
    setDisable(!disable);

    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling.name!;
      }
      postData.privacy = privacy || 'Public';
      postData.gifUrl = gifUrl;
      postData.profilePicture = profile?.profilePicture;
      if (selectedPostImage || selectedImage) {
        let result;
        if (selectedPostImage) {
          result = await ImageUtils.readAsBase64(selectedPostImage);
        }
        const response = await PostUtils.sendPostWithImageRequest(result, postData, imageInputRef, setApiResponse, setLoading, dispatch);
        if (response && response.data.message) {
          PostUtils.clostPostModal(dispatch);
        }
      } else {
        const response = await postService.createPost(postData);
        if (response) {
          setApiResponse('success');
          setLoading(false);
          PostUtils.clostPostModal(dispatch);
        }
      }
    } catch (error: any) {
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
    }
  };
  useEffect(() => {
    if (gifUrl) {
      setPostImage(gifUrl);
      PostUtils.postInputData(imageInputRef, postData, '', setPostData);
    } else if (image) {
      setPostImage(image);
      PostUtils.postInputData(imageInputRef, postData, '', setPostData);
    }
  }, [gifUrl, image, postData]);

  useEffect(() => {
    if (!loading && apiResponse === 'success') {
      dispatch(closeModal());
    }
    setDisable(postData.post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, postData, postImage]);
  useEffect(() => {
    PostUtils.positionCursor('editable');
  });
  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen && (
          <div
            className="modal-box"
            style={{ height: selectedPostImage || gifUrl || image || postData.gifUrl || postData.image ? '700px' : 'auto' }}
          >
            {loading && (
              <div className="modal-box-loading">
                <span>Posting...</span>
                <Spinner />
              </div>
            )}
            <div className="modal-box-header">
              <h2>Create Post</h2>
              <button className="modal-box-header-cancel" onClick={closePostModal}>
                X
              </button>
            </div>
            <hr />
            <ModalBoxContent />
            {!postImage && (
              <>
                <div className="modal-box-form" style={{ background: `${textAreaBackground}` }}>
                  <div className="main" style={{ margin: textAreaBackground !== '#ffffff' ? '0 auto' : '' }}>
                    <div className="flex-row">
                      <div
                        contentEditable={true}
                        id="editable"
                        data-name="post"
                        ref={(el) => {
                          inputRef.current = el;
                          inputRef.current?.focus();
                        }}
                        className={`editable flex-item ${textAreaBackground !== '#ffffff' ? 'textInputColor' : ''} ${
                          postData.post.length == 0 && textAreaBackground != '#ffffff' ? 'defaultInputTextColor' : ''
                        }`}
                        data-placeholder="What's on your mind?..."
                        onInput={(event: React.SyntheticEvent) => postInputEditable(event, event.currentTarget.textContent!)}
                        onKeyDown={onKeyDown}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {postImage && (
              <>
                <div className="modal-box-image-form">
                  <div
                    contentEditable={true}
                    id="editable"
                    data-name="post"
                    className="post-input flex-item"
                    ref={(el) => {
                      imageInputRef.current = el;
                      imageInputRef.current?.focus();
                    }}
                    data-placeholder="What's on your mind?..."
                    onInput={(event: React.SyntheticEvent) => postInputEditable(event, event.currentTarget.textContent!)}
                    onKeyDown={onKeyDown}
                  ></div>
                  <div className="image-display">
                    <div className="image-delete-btn" onClick={removeSelectedImage}>
                      <FaTimes />
                    </div>
                    <img src={postImage} className="post-image" alt="" />
                  </div>
                </div>
              </>
            )}

            <div className="modal-box-bg-colors">
              <ul>
                {bgColors.map((bgColor, index) => (
                  <li
                    key={index}
                    className={`${bgColor === '#ffffff' ? 'whiteColorBorder' : ''}`}
                    style={{ backgroundColor: `${bgColor}` }}
                    onClick={() => {
                      PostUtils.positionCursor('editable');
                      selectBackground(bgColor);
                    }}
                  ></li>
                ))}
              </ul>
            </div>
            <span className="char_count" ref={counterRef}>
              {allowedNoOfChars}
            </span>
            <ModalBoxSelection setSelectedPostImage={(file: File) => setSelectedPostImage(file)} />
            <div className="modal-box-button">
              <Button label="Post" className="post-button" disabled={disable} handleClick={createPost} />
            </div>
          </div>
        )}
        {gifModalIsOpen && (
          <div className="modal-giphy">
            <div className="modal-giphy-header">
              <Button
                label={<FaArrowLeft />}
                className="back-button"
                disabled={false}
                handleClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}
              />
              <h2>Choose a GIF</h2>
            </div>
            <hr />
            <Giphy />
          </div>
        )}
      </PostWrapper>
    </>
  );
};

export default AddPost;
