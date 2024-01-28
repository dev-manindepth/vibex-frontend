import { IUser } from '@interfaces/index';
import { NavigateFunction, createSearchParams } from 'react-router-dom';

export class ProfileUtils {
  static navigateToProfile(userId: string, uId: string, username: string, navigate: NavigateFunction) {
    const searchParams = new URLSearchParams({
      id: userId,
      uId: uId
    });

    const url = `/app/social/profile/${username}?${searchParams.toString()}`;
    navigate(url);
  }
}
