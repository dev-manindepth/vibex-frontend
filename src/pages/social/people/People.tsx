import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@pages/social/people/People.scss';
import { Utils } from '@services/utils/utils.service';
import { IFollowData, IUser } from '@interfaces/index';
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

const People = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [users, setUsers] = useState<IUser[]>([]);
  const [following, setFollowing] = useState<IFollowData[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useInfiniteScroll(bodyRef, bottomRef, fetchData);

  const PAZE_SIZE = 12;
  function fetchData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalUsersCount / PAZE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllUsers();
    }
  }

  const getAllUsers = useCallback(async () => {
    try {
      const respone = await userService.getAllUsers(currentPage);
      if (respone.data.users.length > 0) {
        setUsers((data: IUser[]) => {
          const result = [...data, ...respone.data.users];
          const allUsers = Utils.removeDuplicates(result, '_id');
          return allUsers;
        });
      }
      setTotalUsersCount(respone.data.totalUsers);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    } finally {
      setLoading(false);
    }
  }, [currentPage, dispatch]);

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
  const unFollowUser = async (user: IUser) => {
    try {
      const userData = user;
      userData.followersCount -= 1;
      socketService.socket.emit('unfollow user', userData);
      FollowersUtils.unFollowUser(user._id, dispatch);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  useEffectOnce(() => {
    getAllUsers();
    getUserFollowing();
  });
  useEffect(() => {
    FollowersUtils.socketIOFollowAndUnFollow(users, following, setFollowing, setUsers);
  });
  return (
    <div className="card-container" ref={bodyRef}>
      <div className="people">People</div>
      {users && users.length > 0 && (
        <div className="card-element">
          {users.map((user, index) => (
            <div className="card-element-item" key={index}>
              {Utils.checkIfUserIsOnline(user.username!, onlineUsers) && (
                <div>
                  <FaCircle className="onlie-indicator" />
                </div>
              )}
              <div className="card-element-header">
                <div className="card-element-header-bg"></div>
                <Avatar name={user.username} bgColor={user.avatarColor} textColor="#ffffff" size={120} avatarSrc={user.profilePicture} />
                <div className="card-element-header-text">
                  <span className="card-element-header-name">{user.username}</span>
                </div>
              </div>
              <CardElementStats postsCount={user.postsCount} followersCount={user.followersCount} followingCount={user.followingCount} />
              <CardElementButtons
                isChecked={Utils.checkIfUserIsFollowed(following, user._id)}
                btnTextOne="Follow"
                btnTextTwo="Unfollow"
                onClickBtnOne={() => followUser(user._id)}
                onClickBtnTwo={() => unFollowUser(user)}
                onNavigateToProfile={() => ProfileUtils.navigateToProfile(user._id, user.uId!, user.username!, navigate)}
              />
            </div>
          ))}
        </div>
      )}
      {loading && !users.length && <div className="card-element" style={{ height: '350px' }}></div>}
      {!loading && !users.length && <div className="empty-page"> No user available</div>}
      <div style={{ marginBottom: '80px', height: '50px' }} ref={bottomRef}></div>
    </div>
  );
};

export default People;
