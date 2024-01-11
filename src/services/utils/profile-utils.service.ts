import { IUser } from '@interfaces/index';
import { NavigateFunction, createSearchParams } from 'react-router-dom';

export class ProfileUtils {
  static navigateToProfile(data: IUser | null, navigate: NavigateFunction) {
    const searchParams = new URLSearchParams({
      id: data?._id || '',
      uId: data?.uId || ''
    });

    const url = `/app/social/profile/${data?.username}?${searchParams.toString()}`;
    navigate(url);
  }
}
