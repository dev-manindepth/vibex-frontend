import React, { useEffect, useState } from 'react';
import '@components/posts/Posts.scss';
import { IPostData } from '@interfaces/index';
import { useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import { Utils } from '@services/utils/utils.service';
import Post from './post/Post';
import { PostUtils } from '@services/utils/post-utils.service';

interface IPosts {
  allPosts: IPostData[];
  userFollowing: [];
  postsLoading: boolean;
}

const Posts: React.FC<IPosts> = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState<IPostData[] | []>([]);
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading]);

  return (
    <div className="posts-container">
      {posts.map((post) => {
        return (
          <div key={Utils.generateString(10)}>
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
            <Post showIcons={false} post={post} />
          </div>
        );
      })}
    </div>
  );
};

export default Posts;
