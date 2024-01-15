import { addUser, clearUser } from '@redux-toolkit/reducers/user/user.reducer';
import { avatarColors } from './static.data';
import { APP_ENVIRONMENT } from '@services/axios';
import { ISettings, ToastType } from '@interfaces/index';
import { addNotifications, clearNotification } from '@redux-toolkit/reducers/notifications/notification.reducer';
import { Dispatch } from '@reduxjs/toolkit';

export type DeepCloneable = { [key: string]: any } | any[];

export class Utils {
  static avatarColor() {
    return avatarColors[Math.floor(Math.random() * avatarColors.length)];
  }
  static generateAvatar(text: string, backgroundColor: string, foregroundColor: string = 'white') {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;

    canvas.width = 200;
    canvas.height = 200;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = 'normal 80px sans-serif';
    context.fillStyle = foregroundColor;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL('image/png');
  }

  static dispatchUser(result: any, pageReload: (value: boolean) => void, dispatch: Dispatch, setUser: (user: any) => void) {
    pageReload(true);
    dispatch(addUser({ token: result.data.token, profile: result.data.user }));
    setUser(result.data.user);
  }

  static clearStore({
    dispatch,
    deleteStorageUsername,
    deleteSessionPageReload,
    setLoggedIn
  }: {
    dispatch: Dispatch;
    deleteStorageUsername: () => void;
    deleteSessionPageReload: () => void;
    setLoggedIn: (value: boolean) => void;
  }) {
    dispatch(clearUser());
    dispatch(clearNotification());
    deleteStorageUsername();
    deleteSessionPageReload();
    setLoggedIn(false);
  }

  static dispatchNotification(message: string, type: ToastType, dispatch: Dispatch) {
    dispatch(addNotifications({ message, type }));
  }
  static dispatchClearNotification(dispatch: Dispatch) {
    dispatch(clearNotification());
  }
  static appEnvironment() {
    if (APP_ENVIRONMENT === 'local') {
      return 'LOCAL';
    } else if (APP_ENVIRONMENT === 'development') {
      return 'DEV';
    } else if (APP_ENVIRONMENT === 'staging') {
      return 'STG';
    }
  }

  static generateString(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  static mapSettingsDropdownItems(setSettings: (settings: ISettings[]) => void) {
    const items = [];
    const item = {
      topText: 'My Profile',
      subText: 'View personal profile'
    };
    items.push(item);
    setSettings(items);
    return items;
  }
  static appImageUrl(imageVersion: string | number, imgId: string | number) {
    if (typeof imageVersion === 'string' && typeof imgId === 'string') {
      imageVersion = imageVersion.replace(/['"]+/g, '');
      imgId = imgId.replace(/['"]+/g, '');
    }
    return `https://res.clodinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/v${imageVersion}/${imgId}`;
  }
}
