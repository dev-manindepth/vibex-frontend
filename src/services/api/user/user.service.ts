import axios from '@services/axios';

class UserService {
  async getUserSuggestions() {
    const response = await axios.get('/user/profile/user/suggestions');
    return response;
  }

  async logoutUser() {
    const response = await axios.get('/signout');
    return response;
  }
  async checkCurrentUser() {
    const response = await axios.get('/currentuser');
    return response;
  }
  async getAllUsers(page: number) {
    const response = await axios.get(`/user/all/${page}`);
    return response;
  }
  async searchUsers(query: string) {
    const response = await axios.get(`/user/profile/search/${query}`);
    return response;
  }
  async getUserProfileByUserId(userId: string) {
    const response = await axios.get(`/user/profile/${userId}`);
    return response;
  }
  async getUserProfileByUsername(username: string, userId: string, uId: string) {
    const response = await axios.get(`/user/profile/posts/${username}/${userId}/${uId}`);
    return response;
  }
}

export const userService: UserService = new UserService();
