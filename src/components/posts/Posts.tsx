import React, { useEffect, useState } from 'react';
import '@components/posts/Posts.scss';
import { IPostData, IUser } from '@interfaces/index';
import { useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import { Utils } from '@services/utils/utils.service';
import Post from './post/Post';
import { PostUtils } from '@services/utils/post-utils.service';
import PostSkeleton from './post/PostSkeleton';
import useLocalStorage from '@hooks/useLocalStorage';

interface IPosts {
  allPosts: IPostData[];
  userFollowing: IUser[];
  postsLoading: boolean;
}

const Posts: React.FC<IPosts> = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState<IPostData[] | []>([]);
  const [following, setFollowing] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading]);

  return (
    <div className="posts-container">
      {!loading &&
        posts.length > 0 &&
        posts.map((post) => {
          return (
            <div key={post._id}>
              {!Utils.checkIfUserIsBlocked(profile?.blockedBy, post.userId) ||
                (post.userId === profile?._id && (
                  <>
                    {PostUtils.checkPrivacy(post, profile, following) && (
                      <>
                        <Post post={post} showIcons={false} />
                      </>
                    )}
                  </>
                ))}
              <Post showIcons={true} post={post} />
            </div>
          );
        })}
      {loading &&
        !posts.length &&
        [1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index}>
            <PostSkeleton />
          </div>
        ))}
    </div>
  );
};

export default Posts;
