import { IBlockUnBlockUser, IFollowData, IFollower, IFollowers, IUser } from '@interfaces/index';
import { Dispatch } from '@reduxjs/toolkit';
import { followerService } from '@services/api/followers/follower.service';
import { Utils } from './utils.service';
import { socketService } from '@services/socket/socket.service';
import { addToSuggestions } from '@redux-toolkit/reducers/suggestions/suggestions.reducer';
import { addUser } from '@redux-toolkit/reducers/user/user.reducer';

export class FollowersUtils {
  static async followUser(userId: string, dispatch: Dispatch) {
    const response = await followerService.followUser(userId);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }
  static async unFollowUser(userId: string, dispatch: Dispatch) {
    const response = await followerService.unFollowUser(userId);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }
  static async blockUser(userId: string, dispatch: Dispatch) {
    const response = await followerService.blockUser(userId);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }
  static async unBlockUser(userId: string, dispatch: Dispatch) {
    const response = await followerService.unBlockUser(userId);
    Utils.dispatchNotification(response.data.message, 'success', dispatch);
  }

  static socketIOFollowAndUnFollow(
    users: IUser[],
    followers: IFollowData[],
    setFollowers: (followers: IFollowData[]) => void,
    setUsers: (users: IUser[]) => void
  ) {
    socketService.socket.on('add follower', (data: IFollowData) => {
      const userData = users.find((user) => user._id === data._id);
      if (userData) {
        const updatedFollowers = [...followers, data];
        setFollowers(updatedFollowers);
        FollowersUtils.updateSingleUser(users, userData, data, setUsers);
      }
    });

    socketService.socket.on('remove follower', (data: IFollowData) => {
      const userData = users.find((user) => user._id === data._id);
      if (userData) {
        const updatedFollowers = followers.filter((follower) => follower._id !== data._id);
        setFollowers(updatedFollowers);
        FollowersUtils.updateSingleUser(users, userData, data, setUsers);
      }
    });
  }

  static socketIORemoveFollowing(following: IFollowData[], setFollowing: (following: IFollowData[]) => void) {
    socketService.socket.on('remove follower', (data: IFollowers) => {
      const updatedFollowing = following.filter((user) => user._id !== data.userId);
      setFollowing(updatedFollowing);
    });
  }
  static socketIOBlockAndUnblock(profile: IUser, token: string, setBlockedUser: (blockedUser: string[]) => void, dispatch: Dispatch) {
    socketService.socket.on('blocked user id', (data: IBlockUnBlockUser) => {
      const user = FollowersUtils.addBlockedUser(profile, data);
      setBlockedUser(profile.blocked);
      dispatch(addUser({ token, profile: user }));
    });

    socketService.socket.on('unblock user id', (data: IBlockUnBlockUser) => {
      const user = FollowersUtils.removeBlockedUser(profile, data);
      setBlockedUser(profile.blocked);
      dispatch(addUser({ token, profile: user }));
    });
  }
  static socketIOBlockedAndUnblockCard(user: IUser, setUser: (user: IUser) => void) {
    socketService.socket.on('blocked user id', (data: IBlockUnBlockUser) => {
      const userData = FollowersUtils.addBlockedUser(user, data);
      setUser(userData);
    });
    socketService.socket.on('unblock user id', (data: IBlockUnBlockUser) => {
      const userData = FollowersUtils.removeBlockedUser(user, data);
      setUser(userData);
    });
  }
  static addBlockedUser(user: IUser, data: IBlockUnBlockUser) {
    user = JSON.parse(JSON.stringify(user));
    if (user._id === data.blockedBy) {
      user.blocked.push(data.blockedUser);
    }
    if (user._id === data.blockedUser) {
      user.blockedBy.push(data.blockedBy);
    }
    return user;
  }
  static removeBlockedUser(profile: IUser, data: IBlockUnBlockUser) {
    profile = JSON.parse(JSON.stringify(profile));
    if (profile._id === data.blockedBy) {
      profile.blocked = [...Utils.removeUserFromList(profile.blocked, data.blockedUser)];
    }
    if (profile._id === data.blockedUser) {
      profile.blockedBy = [...Utils.removeUserFromList(profile.blockedBy, data.blockedBy)];
    }
    return profile;
  }
  static updateSingleUser(users: IUser[], userData: IUser, followerData: IFollowData, setUsers: (users: IUser[]) => void) {
    users = JSON.parse(JSON.stringify(users));
    userData.followersCount = followerData.followersCount;
    userData.followingCount = followerData.followingCount;
    userData.postsCount = followerData.postCount;
    const index = users.findIndex((user) => (user._id = userData._id));
    if (index > -1) {
      users.splice(index, 1, userData);
      setUsers(users);
    }
  }
}
