import Avatar from '@components/avatar/Avatar';
import { IPostData } from '@interfaces/index';
import DateTimeUtil from '@services/utils/date-time.service';
import { emptyPostData, feelingsList, privacyList } from '@services/utils/static.data';
import React, { useEffect, useState } from 'react';
import { FaPencilAlt, FaRegTrashAlt } from 'react-icons/fa';
import '@components/posts/post/Post.scss';
import PostCommentSection from '@components/comments/post-comment-section/PostCommentSection';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import ReactionModal from '../reactions/reactions-modal/ReactionModal';
import { Utils } from '@services/utils/utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import CommentInput from '@components/comments/comment-input/CommentInput';
import CommentModal from '@components/comments/comment-modal/CommentModal';
import ImageModal from '@components/image-modal/ImageModal';
import { openModal, toggleDeleteDialog } from '@redux-toolkit/reducers/modal/modal.reducer';
import { clearPost, updatePostItem } from '@redux-toolkit/reducers/post/post.reducer';
import Dialog from '@components/dialog/Dialog';
import { postService } from '@services/api/post/post.service';
import { ImageUtils } from '@services/utils/image-utils.service';

interface IPost {
  post: IPostData;
  showIcons: boolean;
}
const Post: React.FC<IPost> = ({ post, showIcons }) => {
  const { reactionModalIsOpen, commentModalIsOpen, deleteDialogIsOpen } = useSelector((state: RootState) => state.modal);
  const { _id } = useSelector((state: RootState) => state.post);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [backgroundImageColor, setBackgroundImageColor] = useState('');
  const selectedPostId = useLocalStorage('selectedPostId', 'get');
  const dispatch = useDispatch();

  const getFeeling = (name: string) => {
    const feeling = feelingsList.find((feeling) => feeling.name === name);
    return feeling?.image;
  };
  const getPrivacy = (type: string) => {
    const privacy = privacyList.find((privacy) => privacy.topText === type);
    return privacy?.icon;
  };
  const openPostModal = () => {
    dispatch(openModal({ type: 'edit' }));
    dispatch(updatePostItem(post));
  };
  const openDeleteDialog = () => {
    dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
    dispatch(updatePostItem(post));
  };
  const deletePost = async () => {
    try {
      const response = await postService.deletePost(_id);
      if (response) {
        dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
        dispatch(clearPost());
        Utils.dispatchNotification(response.data.message, 'success', dispatch);
      }
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  const getBackgroundImageColor = async (post: IPostData) => {
    let imageUrl = '';
    if (post.imgId && !post.gifUrl && post.bgColor === '#ffffff') {
      imageUrl = Utils.getImage(post.imgId, post.imgVersion);
    } else if (post.gifUrl && post.bgColor === '#ffffff') {
      imageUrl = post.gifUrl;
    }
    const bgColor = (await ImageUtils.getBackgroundColor(imageUrl)) as string;
    setBackgroundImageColor(bgColor);
  };
  useEffect(() => {
    getBackgroundImageColor(post);
  }, [post]);
  return (
    <>
      {reactionModalIsOpen && <ReactionModal />}
      {commentModalIsOpen && <CommentModal />}
      {showImageModal && <ImageModal image={`${imageUrl}`} onCancel={() => setShowImageModal(!showImageModal)} showArrow={false} />}
      {deleteDialogIsOpen && (
        <Dialog
          title="Are you sure you want to delete this post ?"
          firstButtonText="Delete"
          secondButtonText="Cancel"
          firstBtnHandler={() => deletePost()}
          secondBtnHandler={() => {
            dispatch(toggleDeleteDialog({ toggle: !deleteDialogIsOpen }));
            dispatch(clearPost());
          }}
        />
      )}
      <div className="post-body" data-testid="post">
        <div className="user-post-data">
          <div className="user-post-data-wrap">
            <div className="user-post-image">
              <Avatar name={post?.username} bgColor={post?.avatarColor} textColor="#ffffff" size={50} avatarSrc={post?.profilePicture} />
            </div>
            <div className="user-post-info">
              <div className="inline-title-display">
                <h5 data-testid="username">
                  {post?.username}
                  {post?.feelings && (
                    <div className="inline-display" data-testid="inline-display">
                      is feeling <img className="feeling-icon" src={getFeeling(post.feelings)} alt="" /> <div>{post?.feelings}</div>
                    </div>
                  )}
                </h5>
                {showIcons && (
                  <div className="post-icons" data-testid="post-icons">
                    <FaPencilAlt className="pencil" onClick={openPostModal} />
                    <FaRegTrashAlt className="trash" onClick={openDeleteDialog} />
                  </div>
                )}
              </div>

              {post?.createdAt && (
                <p className="time-text-display" data-testid="time-display">
                  {DateTimeUtil.transform(post?.createdAt)} &middot; {getPrivacy(post.privacy)}
                </p>
              )}
            </div>
            <hr />
            <div className="user-post" style={{ marginTop: '1rem', borderBottom: '' }}>
              {post?.post && post?.bgColor === '#ffffff' && (
                <p className="post" data-testid="user-post">
                  {post?.post}
                </p>
              )}
              {post?.post && post?.bgColor !== '#ffffff' && (
                <div data-testid="user-post-with-bg" className="user-post-with-bg" style={{ backgroundColor: `${post?.bgColor}` }}>
                  {post?.post}
                </div>
              )}

              {post?.imgId && !post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  data-testid="post-image"
                  className="image-display-flex"
                  onClick={() => {
                    setImageUrl(Utils.getImage(post.imgId, post.imgVersion));
                    setShowImageModal(!showImageModal);
                  }}
                  style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }}
                >
                  <img
                    className="post-image"
                    src={`${Utils.getImage(post.imgId, post.imgVersion)}`}
                    alt=""
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              )}

              {post?.gifUrl && post.bgColor === '#ffffff' && (
                <div
                  className="image-display-flex"
                  onClick={() => {
                    setImageUrl(post.gifUrl);
                    setShowImageModal(!showImageModal);
                  }}
                  style={{ height: '600px', backgroundColor: `${backgroundImageColor}` }}
                >
                  <img className="post-image" src={`${post?.gifUrl}`} alt="" style={{ objectFit: 'contain' }} />
                </div>
              )}
              {(post?.reactions || post?.commentsCount > 0) && <hr />}
              <PostCommentSection post={post} />
            </div>
          </div>
          {selectedPostId === post._id && <CommentInput post={post} />}
        </div>
      </div>
    </>
  );
};

export default Post;
