import { useCallback, useEffect, useState } from 'react';
import '@pages/social/followers/Followers.scss';
import { Utils } from '@services/utils/utils.service';
import { IFollow, IFollowData, IUser } from '@interfaces/index';
import Avatar from '@components/avatar/Avatar';
import CardElementStats from '@components/card-element/CardElementStats';
import CardElementButtons from '@components/card-element/CardElementButtons';
import { useDispatch, useSelector } from 'react-redux';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@redux-toolkit/store';
import { followerService } from '@services/api/followers/follower.service';
import { socketService } from '@services/socket/socket.service';
import { FollowersUtils } from '@services/utils/followers-utils.service';

const Followers = () => {
  const { profile, token } = useSelector((state: RootState) => state.user);
  const [followers, setFollowers] = useState<IFollowData[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserFollowers = useCallback(async () => {
    try {
      if (profile) {
        const respone = await followerService.getUserFollowers();
        setFollowers(respone.data.followers);
      }
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const blockUser = async (userId: string) => {
    try {
      socketService.socket.emit('block user', { blockedUser: userId, blockedBy: profile?._id });
      FollowersUtils.blockUser(userId, dispatch);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  const unblockUser = async (userId: string) => {
    try {
      socketService.socket.emit('unblock user', { blockedUser: userId, blockedBy: profile?._id });
      FollowersUtils.unBlockUser(userId, dispatch);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  useEffect(() => {
    getUserFollowers();
    setBlockedUsers(profile?.blocked!);
  }, [getUserFollowers, profile]);
  useEffect(() => {
    FollowersUtils.socketIOBlockAndUnblock(profile!, token, setBlockedUsers, dispatch);
  }, [dispatch, profile, token]);
  return (
    <div className="card-container">
      <div className="followers">Followers</div>
      {followers && followers.length > 0 && (
        <div className="card-element">
          {followers.map((user, index) => (
            <div className="card-element-item" key={index}>
              <div className="card-element-header">
                <div className="card-element-header-bg"></div>
                <Avatar name={user.username} bgColor={user.avatarColor} textColor="#ffffff" size={120} avatarSrc={user.profilePicture} />
                <div className="card-element-header-text">
                  <span className="card-element-header-name">{user.username}</span>
                </div>
              </div>
              <CardElementStats postsCount={user.postCount} followersCount={user.followersCount} followingCount={user.followingCount} />
              <CardElementButtons
                isChecked={Utils.checkIfUserIsBlocked(blockedUsers, user._id!)!}
                btnTextOne="Block"
                btnTextTwo="UnBlock"
                onClickBtnOne={() => blockUser(user._id!)}
                onClickBtnTwo={() => unblockUser(user._id!)}
                onNavigateToProfile={() => ProfileUtils.navigateToProfile(user._id!, user.uId!, user.username!, navigate)}
              />
            </div>
          ))}
        </div>
      )}
      {loading && !followers.length && <div className="card-element" style={{ height: '350px' }}></div>}
      {!loading && !followers.length && <div className="empty-page"> You have no followers</div>}
      <div style={{ marginBottom: '80px', height: '50px' }}></div>
    </div>
  );
};

export default Followers;
