import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Suggestions from '@components/suggestions/Suggestions';
import { getUserSuggestions } from '@redux-toolkit/api/suggestion';

import '@pages/social/vibes/Vibes.scss';
import useEffectOnce from '@hooks/useEffectOnce';
import { PayloadAction, ThunkDispatch } from '@reduxjs/toolkit';
import { RootState } from '@redux-toolkit/store';
import PostForm from '@components/posts/post-form/PostForm';
import Posts from '@components/posts/Posts';
import { Utils } from '@services/utils/utils.service';
import { postService } from '@services/api/post/post.service';
import { IPostData } from '@interfaces/index';
import { getPosts } from '@redux-toolkit/api/posts';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import { PostUtils } from '@services/utils/post-utils.service';
import useLocalStorage from '@hooks/useLocalStorage';
import { addReactions } from '@redux-toolkit/reducers/post/user-post-reaction';
import { followerService } from '@services/api/followers/follower.service';

const Vibes = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  let appPosts = useRef<IPostData[]>([]);
  let PAZE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, PayloadAction>>();
  const allPosts = useSelector((state: RootState) => state.allPosts);
  const [posts, setPosts] = useState<IPostData[]>([]);
  const [following, setFollowing] = useState([]);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const storedUsername = useLocalStorage('username', 'get');
  const [deleteStoredPostId] = useLocalStorage('selectedPostId', 'remove');
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);

  const getAllPosts = async () => {
    try {
      const response = await postService.getAllPosts(1);
      if (response.data.posts.length) {
        appPosts.current = [...posts, ...response.data.posts];
        const allPosts = Utils.removeDuplicates(appPosts.current, '_id');
        const orderedPost = Utils.orderBy(allPosts, ['createdAt'], ['desc']);
        setPosts(orderedPost);
        setPosts(allPosts);
      }
      setLoading(false);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  function fetchPostData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalPostsCount / PAZE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllPosts();
    }
  }
  const getReactionsByUsername = async () => {
    try {
      const response = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data.reactions));
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  useEffectOnce(() => {
    getUserFollowing();
    getReactionsByUsername();
    deleteStoredPostId();
    dispatch(getUserSuggestions());
    dispatch(getPosts());
  });

  useEffect(() => {
    setLoading(allPosts.isLoading);
    const orderedPost = Utils.orderBy(allPosts.posts, ['createdAt'], ['desc']);
    setPosts(orderedPost);
    setTotalPostsCount(allPosts.totalPostsCount);
  }, [allPosts]);
  useEffect(() => {
    PostUtils.soketIOPost(posts, setPosts);
  }, [posts, setPosts]);

  return (
    <div className="vibes">
      <div className="vibes-content">
        <div className="vibes-post" ref={bodyRef}>
          <PostForm />
          <Posts allPosts={posts} postsLoading={loading} userFollowing={following} />
          <div ref={bottomLineRef} style={{ marginBottom: '50px', height: '50px' }}>
            P
          </div>
        </div>
        <div className="vibes-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Vibes;
