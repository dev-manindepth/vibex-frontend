import { addUser, clearUser } from '@redux-toolkit/reducers/user/user.reducer';
import { avatarColors } from './static.data';
import { APP_ENVIRONMENT } from '@services/axios';
import { IReactions, ISettings, OrderByIteratee, ToastType } from '@interfaces/index';
import { addNotifications, clearNotification } from '@redux-toolkit/reducers/notifications/notification.reducer';
import { Dispatch } from '@reduxjs/toolkit';
import millify from 'millify';

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

  static appImageUrl(imageVersion: string, imgId: string) {
    imageVersion = imageVersion.replace(/['"]+/g, '');
    imgId = imgId.replace(/['"]+/g, '');

    return `https://res.cloudinary.com/${process.env.REACT_APP_CLOUD_NAME}/image/upload/v${imageVersion}/${imgId}`;
  }

  static removeDuplicates(array: any[], key: string) {
    const seen = new Set();
    return array.filter((item) => {
      const value = item[key];
      if (!seen.has(value)) {
        seen.add(value);
        return true;
      }
      return false;
    });
  }

  static checkIfUserIsBlocked(blocked: string[] | undefined, userId: string) {
    return blocked && blocked.some((blockedId) => blockedId === userId);
  }
  static checkIfUserIsFollowed(userFolloweers: any[], postCreatorId: string, userId: string) {
    return userFolloweers.some((user) => user._id === postCreatorId || postCreatorId === userId);
  }

  static firstLetterUpperCase(word: string) {
    if (!word) return '';
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  static formattedReactions(reactions: IReactions) {
    const postReactions = [];
    for (const [key, value] of Object.entries(reactions)) {
      if (value > 0) {
        const reactionsObject = {
          type: key,
          value: value
        };
        postReactions.push(reactionsObject);
      }
    }
    return postReactions;
  }

  static shortenLargeNumbers(data: number) {
    if (data === undefined) {
      return 0;
    } else {
      return millify(data);
    }
  }

  static getImage(imgId: string, version: string) {
    return imgId && version ? this.appImageUrl(version, imgId) : '';
  }
  static orderBy<T>(collection: T[], iteratees: OrderByIteratee<T>[], orders?: ('asc' | 'desc')[]): T[] {
    return collection.slice().sort((a, b) => {
      for (let i = 0; i < iteratees.length; i++) {
        const iteratee = iteratees[i];
        const order = orders && orders[i] === 'desc' ? -1 : 1;

        if (typeof iteratee === 'function') {
          const resultA = iteratee(a);
          const resultB = iteratee(b);

          if (resultA < resultB) return -1 * order;
          if (resultA > resultB) return 1 * order;
        } else if (Array.isArray(iteratee)) {
          const resultA = a[iteratee[0]];
          const resultB = b[iteratee[0]];

          if (resultA < resultB) return -1 * order;
          if (resultA > resultB) return 1 * order;

          // If the values are equal, continue to the next level of sorting
          if (resultA === resultB) {
            const subOrder = iteratee[1] === 'desc' ? -1 : 1;
            if (a[iteratee[0]] < b[iteratee[0]]) return -1 * subOrder;
            if (a[iteratee[0]] > b[iteratee[0]]) return 1 * subOrder;
          }
        } else {
          if (a[iteratee] < b[iteratee]) return -1 * order;
          if (a[iteratee] > b[iteratee]) return 1 * order;
        }
      }

      return 0;
    });
  }
}
