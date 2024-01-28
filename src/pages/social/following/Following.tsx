import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@pages/social/following/Following.scss';
import { Utils } from '@services/utils/utils.service';
import { IFollowData, IFollowers, IUser } from '@interfaces/index';
import { FaCircle } from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import CardElementStats from '@components/card-element/CardElementStats';
import CardElementButtons from '@components/card-element/CardElementButtons';
import { useDispatch, useSelector } from 'react-redux';
import { userService } from '@services/api/user/user.service';
import useEffectOnce from '@hooks/useEffectOnce';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@redux-toolkit/store';
import { socketService } from '@services/socket/socket.service';
import { FollowersUtils } from '@services/utils/followers-utils.service';
import { followerService } from '@services/api/followers/follower.service';

const Following = () => {
  const [following, setFollowing] = useState<IFollowData[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserFollowing = async () => {
    try {
      const respone = await followerService.getUserFollowing();
      setFollowing(respone.data.following);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    } finally {
      setLoading(false);
    }
  };
  const followUser = async (userId: string) => {
    try {
      FollowersUtils.followUser(userId, dispatch);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  const unFollowUser = async (userId: string) => {
    try {
      socketService.socket.emit('unfollow user', userId);
      FollowersUtils.unFollowUser(userId, dispatch);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  useEffectOnce(() => {
    getUserFollowing();
  });
  useEffect(() => {
    FollowersUtils.socketIORemoveFollowing(following, setFollowing);
  });
  return (
    <div className="card-container">
      <div className="people">Following</div>
      {following && following.length > 0 && (
        <div className="card-element">
          {following.map((user, index) => (
            <div className="card-element-item" key={index}>
              <div className="card-element-header">
                <div className="card-element-header-bg"></div>
                <Avatar name={user.username} bgColor={user.avatarColor} textColor="#ffffff" size={120} avatarSrc={user.profilePicture} />
                <div className="card-element-header-text">
                  <span className="card-element-header-name">{user.username}</span>
                </div>
              </div>
              <CardElementStats
                postsCount={user.followersCount}
                followersCount={user.followersCount}
                followingCount={user.followingCount}
              />
              <CardElementButtons
                isChecked={Utils.checkIfUserIsFollowed(following, user._id)}
                btnTextOne="Follow"
                btnTextTwo="Unfollow"
                onClickBtnOne={() => followUser(user._id!)}
                onClickBtnTwo={() => unFollowUser(user._id!)}
                onNavigateToProfile={() => ProfileUtils.navigateToProfile(user._id!, user.uId, user.username, navigate)}
              />
            </div>
          ))}
        </div>
      )}
      {loading && !following.length && <div className="card-element" style={{ height: '350px' }}></div>}
      {!loading && !following.length && <div className="empty-page"> You have no following</div>}
      <div style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};

export default Following;
