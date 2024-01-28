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

export interface IPostData {
  _id: string;
  post: any;
  bgColor: string;
  privacy: string;
  feelings: string;
  gifUrl: string;
  profilePicture: string;
  image: string;
  userId: string;
  username: string;
  email: string;
  avatarColor: string;
  commentsCount: number;
  reactions: IReactions;
  imgVersion: string;
  imgId: string;
  createdAt: string;
}
export interface IPostFormData {
  post: string;
  bgColor: string;
  privacy: string;
  feelings: string | undefined;
  gifUrl: string | undefined;
  profilePicture: string | undefined;
  image: string;
  imgId?: string;
  imgVersion?: string;
}
export interface IFeelingData {
  index?: number;
  name?: string;
  image?: string;
}

export interface IPrivacy {
  topText: string;
  subText: string;
  icon: React.ReactNode;
}

export interface IReactionData {
  _id?: string;
  postId: string;
  username?: string;
  avatarColor?: string;
  type: string;
  profilePicture: string;
  previousReaction?: string;
  createdAt?: string;
  userTo?: string;
  comment?: string;
}
export interface IReactions {
  like: number;
  love: number;
  happy: number;
  wow: number;
  sad: number;
  angry: number;
}
export interface IReaction {
  senderName: string;
  type: string;
}

export interface IFormattedReaction {
  type: string;
  value: number;
}
export type OrderByIteratee<T> = ((item: T) => any) | keyof T | [keyof T, 'asc' | 'desc'];

export interface ICommentData {
  _id?: string;
  username?: string;
  avatarColor: string;
  postId: string;
  profilePicture: string;
  comment: string;
  commentsCount?: number;
  createdAt?: Date;
  userTo?: string;
}
export interface ICommentNameList {
  count: number;
  names: string[];
}