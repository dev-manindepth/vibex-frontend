import { RootState } from '@redux-toolkit/store';
import { ThunkAction } from '@reduxjs/toolkit';

export interface IUser {
  _id: string;
  authId: string;
  username?: string;
  email?: string;
  password?: string;
  avatarColor?: string;
  uId?: string;
  postsCount: number;
  work: string;
  school: string;
  quote: string;
  location: string;
  blocked: string[];
  blockedBy: string[];
  followersCount: number;
  followingCount: number;
  notifications: INotificationSettings;
  social: ISocialLinks;
  bgImageVersion: string;
  bgImageId: string;
  profilePicture: string;
  createdAt?: Date;
}
export interface INotificationSettings {
  messages: boolean;
  reactions: boolean;
  comments: boolean;
  follows: boolean;
}
export interface ISocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface IMessageData {
  _id: string;
  conversationId: string;
  receiverId: string;
  receiverUsername: string;
  receiverAvatarColor: string;
  receiverProfilePicture: string;
  senderUsername: string;
  senderId: string;
  senderAvatarColor: string;
  senderProfilePicture: string;
  body: string;
  isRead: boolean;
  gifUrl: string;
  selectedImage: string;
  reaction: IReaction[];
  createdAt: Date | string;
  deleteForMe: boolean;
  deleteForEveryone: boolean;
}
export interface IReaction {
  senderName: string;
  type: string;
}

export interface ISettings {
  topText: string;
  subText: string;
}

export interface IToastData {
  id: number;
  description: string;
  type: 'success' | 'error' | 'info' | 'warning';
  icon: string;
  backgroundColor: string;
}
export interface IToast {
  toastList: IToastData[];
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  autoDelete: boolean;
  autoDeleteTime?: number;
}

export interface INotificationData {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export type ToastIcons = {
  [key in ToastType]: {
    icon: string;
    color: string;
  };
};

export interface INotifications {
  _id?: string;
  topText?: string;
  subText?: string;
  username?: string;
  avatarColor: string;
  imgUrl?: string;
  profilePicture?: string;
  senderName?: string;
  userTo: string;
  userFrom: IUserFrom;
  message: string;
  notificationType?: string;
  entityId?: string;
  createdItemId?: string;
  comment: string;
  reaction: string;
  post: string;
  imgId?: string;
  imgVersion?: string;
  gifUrl?: string;
  read?: boolean;
  createdAt?: Date;
}

interface IUserFrom {
  profilePicture: string;
  username: string;
  avatarColor: string;
  uId: string;
}

export interface IComment {
  _id?: string;
  username: string;
  avatarColor: string;
  postId: string;
  profilePicture: string;
  comment: string;
  createdAt?: Date;
  userTo?: string;
}

export interface ICommentUser {
  postId: string;
  userTo: string;
  userFrom: string;
  username: string;
  comment: IComment;
}

export interface INotificationDialog {
  createdAt?: Date;
  post: string;
  comment: string;
  imgUrl?: string;
  reaction: string;
  senderName: string;
}
