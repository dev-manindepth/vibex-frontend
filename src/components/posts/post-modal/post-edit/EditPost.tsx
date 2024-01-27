import PostWrapper from '@components/posts/modal-wrapper/PostWrapper';
import { RootState } from '@redux-toolkit/store';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '@components/posts/post-modal/post-edit/EditPost.scss';
import ModalBoxContent from '../modal-box-content/ModalBoxContent';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { bgColors, feelingsList } from '@services/utils/static.data';
import ModalBoxSelection from '../modal-box-content/ModalBoxSelection';
import Button from '@components/button/Button';
import { PostUtils } from '@services/utils/post-utils.service';
import { IPostFormData } from '@interfaces/index';
import { addPostFeeling, closeModal, toggleGifModal } from '@redux-toolkit/reducers/modal/modal.reducer';
import Giphy from '@components/giphy/Giphy';
import { ImageUtils } from '@services/utils/image-utils.service';
import { postService } from '@services/api/post/post.service';
import Spinner from '@components/spinner/Spinner';
import { Utils } from '@services/utils/utils.service';

const EditPost = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { gifModalIsOpen, feeling } = useSelector((state: RootState) => state.modal);
  const { _id, gifUrl, image, privacy, post, feelings, bgColor, imgId, imgVersion } = useSelector((state: RootState) => state.post);
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
    image: '',
    imgId: '',
    imgVersion: ''
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
    PostUtils.removeSelectedImage(postData, post, inputRef, dispatch, setSelectedPostImage, setPostImage, setPostData);
  };
  const updatePost = async () => {
    setLoading(!loading);
    setDisable(!disable);

    try {
      if (Object.keys(feeling).length) {
        postData.feelings = feeling.name!;
      }
      if (postData.gifUrl || (postData.imgId && postData.imgVersion)) {
        postData.bgColor = '#ffffff';
      }
      postData.privacy = privacy || 'Public';
      postData.profilePicture = profile?.profilePicture;
      if (selectedPostImage) {
        const result = await ImageUtils.readAsBase64(selectedPostImage);
        await PostUtils.sendUpdatePostWithImageRequest(result, _id, postData, setApiResponse, setLoading, dispatch);
      } else {
        await PostUtils.sendUpdatePostRequest(_id, postData, setApiResponse, setLoading, dispatch);
      }
    } catch (error: any) {
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResponse, setLoading, dispatch);
    }
  };

  const getFeeling = useCallback(
    (name: string) => {
      const feeling = feelingsList.find((feeling) => feeling.name === name);
      dispatch(addPostFeeling({ feeling }));
    },
    [dispatch]
  );
  const postInputData = useCallback(() => {
    setTimeout(() => {
      if (imageInputRef.current) {
        postData.post = post;
        imageInputRef.current.textContent = post;
        setPostData(postData);
      }
    });
  }, [post, postData]);
  const editableFields = useCallback(() => {
    if (feelings) {
      getFeeling(feelings);
    }
    if (bgColor) {
      postData.bgColor = bgColor;
      setPostData(postData);
      setTextAreaBackground(bgColor);
      setTimeout(() => {
        if (inputRef.current) {
          postData.post = post;
          inputRef.current.textContent = post;
          setPostData(postData);
        }
      });
    }
    if (gifUrl && !imgId) {
      postData.gifUrl = gifUrl;
      setPostImage(gifUrl);
      postInputData();
    }
    if (imgId && !gifUrl) {
      postData.imgId = imgId;
      postData.imgVersion = imgVersion;
      const imageUrl = Utils.getImage(imgId, imgVersion);
      setPostImage(imageUrl);
      postInputData();
    }
  }, [post, postData, getFeeling, postInputData]);
  useEffect(() => {
    if (gifUrl) {
      postData.image = '';
      setSelectedPostImage(null);
      setPostImage(gifUrl);
      PostUtils.postInputData(imageInputRef, postData, post, setPostData);
    } else if (image) {
      setPostImage(image);
      PostUtils.postInputData(imageInputRef, postData, post, setPostData);
    }
    editableFields();
  }, [gifUrl, image, postData, editableFields]);

  useEffect(() => {
    if (!loading && apiResponse === 'success') {
      dispatch(closeModal());
    }
    setDisable(post.length <= 0 && !postImage);
  }, [loading, dispatch, apiResponse, post, postImage]);
  useEffect(() => {
    PostUtils.positionCursor('editable');
  });
  useEffect(() => {
    setTimeout(() => {
      if (imageInputRef.current && imageInputRef.current.textContent?.length) {
        if (counterRef.current) {
          counterRef.current.textContent = `${MAX_NO_OF_CHARACTER - imageInputRef.current.textContent?.length}/100`;
        }
      } else if (inputRef.current && inputRef.current.textContent?.length) {
        if (counterRef.current) {
          counterRef.current.textContent = `${MAX_NO_OF_CHARACTER - inputRef.current.textContent?.length}/100`;
        }
      }
    });
  }, []);
  return (
    <>
      <PostWrapper>
        <div></div>
        {!gifModalIsOpen && (
          <div className="modal-box" style={{ height: selectedPostImage || gifUrl || image || imgId ? '700px' : 'auto' }}>
            {loading && (
              <div className="modal-box-loading">
                <span>Updating...</span>
                <Spinner />
              </div>
            )}
            <div className="modal-box-header">
              <h2>Edit Post</h2>
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
                          postData.post.length === 0 && textAreaBackground != '#ffffff' ? 'defaultInputTextColor' : ''
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
              <Button label="Update Post" className="post-button" disabled={disable} handleClick={updatePost} />
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

export default EditPost;
