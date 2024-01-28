import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@pages/social/people/People.scss';
import { Utils } from '@services/utils/utils.service';
import { IUser } from '@interfaces/index';
import { FaCircle } from 'react-icons/fa';
import Avatar from '@components/avatar/Avatar';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import CardElementStats from '@components/card-element/CardElementStats';
import CardElementButtons from '@components/card-element/CardElementButtons';
import { useDispatch } from 'react-redux';
import { userService } from '@services/api/user/user.service';
import useEffectOnce from '@hooks/useEffectOnce';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import { useNavigate } from 'react-router-dom';

const People = () => {
  const [users, setUsers] = useState<IUser[]>([]);
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
      console.log(respone.data);
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

  const followUser = async () => {};
  const unFollowUser = async () => {};
  useEffectOnce(() => {
    getAllUsers();
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
                isChecked={Utils.checkIfUserIsFollowed([], user._id)}
                btnTextOne="Follow"
                btnTextTwo="Unfollow"
                onClickBtnOne={() => {}}
                onClickBtnTwo={() => {}}
                onNavigateToProfile={() => ProfileUtils.navigateToProfile(user, navigate)}
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
