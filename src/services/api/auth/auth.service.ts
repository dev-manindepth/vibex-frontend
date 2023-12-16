import axios from '@services/axios';

interface ISignupRequestBody {
  username: string;
  password: string;
  email: string;
  avatarColor: string;
  avatarImage: string;
}
interface ISigninRequestBody {
  username: string;
  password: string;
}
class AuthService {
  async signup(body: ISignupRequestBody) {
    const response = await axios.post('/signup', body);
    return response;
  }
  async signin(body: ISigninRequestBody) {
    const response = await axios.post('/signin', body);
    return response;
  }
  async forgotPassword(body: { email: string }) {
    const response = await axios.post('/forgot-password', body);
    return response;
  }
  async resetPassword(token: string, body: { password: string; confirmPassword: string }) {
    const response = await axios.post(`/reset-password/${token}`, body);
    return response;
  }
  async signout() {
    const response = await axios.get('/signout');
  }

  // Generic fn
  // async authPostData(url: string, data?: any, token?: string) {
  //   const response = await axios.post(`/${url}/${token}`, data);
  // }
}

export const authService: AuthService = new AuthService();
