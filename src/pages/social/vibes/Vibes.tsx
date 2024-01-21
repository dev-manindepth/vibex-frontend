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

const Vibes = () => {
  const bodyRef = useRef(null);
  const bottomLineRef = useRef(null);
  let appPosts = useRef<IPostData[]>([]);
  let PAZE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, PayloadAction>>();
  const allPosts = useSelector((state: RootState) => state.allPosts);
  const [posts, setPosts] = useState<IPostData[]>([]);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);

  const getAllPosts = async () => {
    try {
      const response = await postService.getAllPosts(1);
      if (response.data.posts.length) {
        appPosts.current = [...posts, ...response.data.posts];
        const allPosts = Utils.removeDuplicates(appPosts.current, '_id');
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
  useEffectOnce(() => {
    dispatch(getUserSuggestions());
  });

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);
  useEffect(() => {
    setLoading(allPosts.isLoading);
    setPosts(allPosts.posts);
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
          <Posts allPosts={posts} postsLoading={loading} userFollowing={[]} />
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
