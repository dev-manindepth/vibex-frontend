import axios from '@services/axios';

class FollowerService {
  async getUserFollowing() {
    const response = await axios.get('/user/following');
    return response;
  }
  async getUserFollowers() {
    const response = await axios.get('/user/followers');
    return response;
  }
  async followUser(followeeId: string) {
    const response = await axios.put(`/user/follow/${followeeId}`);
    return response;
  }
  async unFollowUser(followeeId: string) {
    const response = await axios.put(`/user/unfollow/${followeeId}`);
    return response;
  }
  async blockUser(userToBlockId: string) {
    const response = await axios.put(`/user/block/${userToBlockId}`);
    return response;
  }
  async unBlockUser(userToUnblockId: string) {
    const response = await axios.put(`/user/unblock/${userToUnblockId}`);
    return response;
  }
}
export const followerService = new FollowerService();
