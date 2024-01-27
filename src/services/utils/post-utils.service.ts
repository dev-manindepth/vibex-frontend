import { IPostData, IPostFormData, IUser, ToastType } from '@interfaces/index';
import { closeModal } from '@redux-toolkit/reducers/modal/modal.reducer';
import { clearPost, updatePostItem } from '@redux-toolkit/reducers/post/post.reducer';
import { Dispatch } from '@reduxjs/toolkit';
import { Ref } from 'react';
import { Utils } from './utils.service';
import { postService } from '@services/api/post/post.service';
import { socketService } from '@services/socket/socket.service';

export class PostUtils {
  static selectBackground(
    bgColor: string,
    postData: IPostFormData,
    setTextAreaBackground: (bgColor: string) => void,
    setPostData: (post: IPostFormData) => void
  ) {
    postData.bgColor = bgColor;
    setTextAreaBackground(bgColor);
    setPostData(postData);
  }
  static postInputEditable(textContent: string, postData: IPostFormData, setPostData: (post: IPostFormData) => void) {
    postData.post = textContent;
    setPostData(postData);
  }
  static clostPostModal(dispatch: Dispatch) {
    dispatch(closeModal());
    dispatch(clearPost());
  }
  static removeSelectedImage(
    postData: IPostFormData,
    post: string,
    inputRef: React.RefObject<HTMLDivElement>,
    dispatch: Dispatch,
    setSelectedPostImage: (image: File | null) => void,
    setPostImage: (image: string) => void,
    setPostData: (post: IPostFormData) => void
  ) {
    postData.gifUrl = '';
    postData.image = '';
    setSelectedPostImage(null);
    setPostImage('');
    setTimeout(() => {
      if (inputRef?.current) {
        inputRef.current.textContent = !post ? postData.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
      }
      PostUtils.positionCursor('editable');
    });
    dispatch(updatePostItem({ gifUrl: '', image: '', imgId: '', imgVersion: '' }));
  }

  static postInputData(
    imageInputRef: React.RefObject<HTMLDivElement>,
    postData: IPostFormData,
    post: string,
    setPostData: (post: IPostFormData) => void
  ) {
    setTimeout(() => {
      if (imageInputRef.current) {
        imageInputRef.current.textContent = !post ? postData.post : post;
        if (post) {
          postData.post = post;
        }
        setPostData(postData);
        PostUtils.positionCursor('editable');
      }
    });
  }

  static dispatchNotification(
    message: any,
    type: ToastType,
    setApiResponse: (response: any) => void,
    setLoading: (loading: boolean) => void,
    dispatch: Dispatch
  ) {
    setApiResponse(type);
    setLoading(false);
    Utils.dispatchNotification(message, type, dispatch);
  }
  static async sendPostWithImageRequest(
    fileResult: any,
    postData: IPostFormData,
    imageInputRef: React.RefObject<HTMLDivElement>,
    setApiResonse: (response: any) => void,
    setLoading: (loading: boolean) => void,
    dispatch: Dispatch
  ) {
    try {
      postData.image = fileResult;
      if (imageInputRef.current) {
        imageInputRef.current.textContent = postData.post;
      }
      const response = await postService.createPostWithImage(postData);
      if (response) {
        setApiResonse('success');
        setLoading(false);
      }
      return response;
    } catch (err: any) {
      PostUtils.dispatchNotification(err.response.data.message, 'error', setApiResonse, setLoading, dispatch);
    }
  }
  static async sendUpdatePostWithImageRequest(
    fileResult: any,
    postId: string,
    postData: IPostFormData,
    setApiResonse: (response: any) => void,
    setLoading: (loading: boolean) => void,
    dispatch: Dispatch
  ) {
    try {
      postData.image = fileResult;
      postData.gifUrl = '';
      (postData.imgId = ''), (postData.imgVersion = '');
      const response = await postService.updatePostWithImage(postId, postData);
      if (response) {
        PostUtils.dispatchNotification(response.data.message, 'success', setApiResonse, setLoading, dispatch);
        setTimeout(() => {
          setApiResonse('success');
          setLoading(false);
        }, 3000);
        PostUtils.clostPostModal(dispatch);
      }
    } catch (error: any) {
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResonse, setLoading, dispatch);
    }
  }

  static async sendUpdatePostRequest(
    postId: string,
    postData: IPostFormData,
    setApiResonse: (response: any) => void,
    setLoading: (loading: boolean) => void,
    dispatch: Dispatch
  ) {
    try {
      const response = await postService.updatePost(postId, postData);
      if (response) {
        PostUtils.dispatchNotification(response.data.message, 'success', setApiResonse, setLoading, dispatch);
        setTimeout(() => {
          setApiResonse('success');
          setLoading(false);
        }, 3000);
        PostUtils.clostPostModal(dispatch);
      }
    } catch (error: any) {
      PostUtils.dispatchNotification(error.response.data.message, 'error', setApiResonse, setLoading, dispatch);
    }
  }
  static checkPrivacy(post: IPostData, profile: IUser, following: any[]) {
    const isPrivate = post.privacy === 'Private' && post.userId === profile._id;
    const isPublic = post.privacy === 'Public';
    const isFollower = post.privacy === 'Followers' && Utils.checkIfUserIsFollowed(following, post.userId, profile._id);
    return isPrivate || isPublic || isFollower;
  }
  static positionCursor(elementId: string) {
    const element = document.getElementById(`${elementId}`) as HTMLElement;
    const selection = window.getSelection();
    const range = document.createRange();
    selection?.removeAllRanges();
    range.selectNodeContents(element);
    range.collapse(false);
    selection?.addRange(range);
    element.focus();
  }
  static soketIOPost(posts: IPostData[], setPosts: (posts: IPostData[]) => void) {
    posts = JSON.parse(JSON.stringify(posts));
    socketService.socket.on('add post', (post: IPostData) => {
      posts = [post, ...posts];
      setPosts(posts);
    });

    socketService.socket.on('update post', (post: IPostData) => {
      PostUtils.updateSinglePost(posts, post, setPosts);
    });

    socketService.socket.on('delete post', (postId: string) => {
      const index = posts.findIndex((post) => post._id === postId);
      if (index > -1) {
        posts = posts.filter((post) => post._id !== postId);
        setPosts(posts);
      }
    });
    socketService.socket.on('update like', (post: IPostData) => {
      PostUtils.updateSinglePost(posts, post, setPosts);
    });
  }
  static updateSinglePost(posts: IPostData[], singlePost: IPostData, setPosts: (posts: IPostData[]) => void) {
    posts = JSON.parse(JSON.stringify(posts));
    const index = posts.findIndex((post) => post._id === singlePost._id);
    if (index > -1) {
      posts.splice(index, 1, singlePost);
      setPosts(posts);
    }
  }
}
