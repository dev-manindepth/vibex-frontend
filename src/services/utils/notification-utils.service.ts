import { ICommentUser, IMessageData, INotificationDialog, INotifications, IUser } from '@interfaces/index';
import { notificationService } from '@services/api/notifications/notification.service';
import { socketService } from '@services/socket/socket.service';
import { Utils } from './utils.service';
import DateTimeUtil from './date-time.service';
import { Dispatch } from '@reduxjs/toolkit';

export class NotificationUtils {
  static socketIONofication(
    profile: IUser,
    notifications: INotifications[],
    setNotifications: (notifications: INotifications[]) => void,
    type: string,
    setNotificationsCount?: (count: number) => void
  ) {
    socketService?.socket.on('insert notification', (data: INotifications[], userToData: ICommentUser) => {
      if (profile._id === userToData.userTo) {
        notifications = [...data];
        if (type === 'notificationPage') {
          setNotifications(notifications);
        }
      } else {
        const mappedNotification =
          setNotificationsCount && NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount);
        setNotifications(mappedNotification!);
      }
    });

    socketService?.socket.on('update notification', (notificationId: string) => {
      notifications = JSON.parse(JSON.stringify(notifications));
      const notificationData = notifications.find((notification) => notification._id === notificationId);
      if (notificationData) {
        const notificationIndex = notifications.findIndex((notification) => notification._id === notificationId);
        notificationData.read = true;
        notifications.splice(notificationIndex, 1, notificationData);
        if (type === 'notificationPage') {
          setNotifications(notifications);
        } else {
          const mappedNotification =
            setNotificationsCount && NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount);
          setNotifications(mappedNotification!);
        }
      }
    });

    socketService?.socket.on('delete notification', (notificationId: string) => {
      notifications = JSON.parse(JSON.stringify(notifications));
      notifications = notifications.filter((notification) => notification._id !== notificationId);
      if (type === 'notificationPage') {
        setNotifications(notifications);
      } else {
        const mappedNotification =
          setNotificationsCount && NotificationUtils.mapNotificationDropdownItems(notifications, setNotificationsCount);
        setNotifications(mappedNotification!);
      }
    });
  }

  static mapNotificationDropdownItems(
    notificationData: INotifications[],
    setNotificationsCount: (count: number) => void
  ): INotifications[] {
    const items = [];
    for (const notification of notificationData) {
      const item = {
        _id: notification?._id,
        topText: notification.message,
        subText: DateTimeUtil.transform(notification.createdAt!),
        createdAt: notification.createdAt,
        username: notification.userFrom.username,
        avatarColor: notification.userFrom.profilePicture,
        read: notification?.read,
        post: notification?.post,
        imgUrl: notification.imgId
          ? Utils.appImageUrl(notification.imgVersion!, notification.imgId)
          : notification.gifUrl
          ? notification.gifUrl
          : notification.imgUrl,
        comment: notification.comment,
        reaction: notification.reaction,
        senderName: notification.userFrom.username,
        notificationType: notification.notificationType,
        userTo: notification.userTo,
        userFrom: notification.userFrom,
        message: notification.message
      };
      items.push(item);
    }
    const count = items.reduce((sum, selectedNotification) => {
      return sum + (!selectedNotification.read ? 1 : 0);
    }, 0);
    setNotificationsCount(count);
    return items;
  }
  static async markMessageAsRead(
    messageId: string,
    notification: INotifications,
    setNotificationDialogContent: (data: INotificationDialog) => void
  ) {
    if (notification.notificationType !== 'follows') {
      const notificationDialog = {
        createdAt: notification.createdAt,
        post: notification.post,
        imgUrl: notification.imgId
          ? Utils.appImageUrl(notification.imgVersion!, notification.imgId)
          : notification.gifUrl
          ? notification.gifUrl
          : notification.imgUrl,
        comment: notification.comment,
        reaction: notification.reaction,
        senderName: notification.userFrom.username
      };
      setNotificationDialogContent(notificationDialog);
    }
    await notificationService.markNotificationAsRead(messageId);
  }
  static socketIOMessageNotification(
    profile: IUser,
    messageNotifications: Partial<IMessageData>[],
    setMessageNotifications: (messageNotification: Partial<IMessageData>[]) => void,
    setMessageCount: (messageCount: number) => void,
    dispatch: Dispatch,
    location: Location
  ) {
    socketService.socket.on('chat list', (data: IMessageData) => {
      messageNotifications = JSON.parse(JSON.stringify(messageNotifications));
      if (data.receiverUsername === profile.username) {
        const notificationData = {
          senderId: data.senderId,
          senderUsername: data.senderUsername,
          senderAvatarColor: data.senderAvatarColor,
          senderProfilePicture: data.senderProfilePicture,
          receiverId: data.receiverId,
          receiverUsername: data.receiverUsername,
          receiverAvatarColor: data.receiverAvatarColor,
          receiverProfilePicture: data.receiverProfilePicture,
          messageId: data._id,
          conversationId: data.conversationId,
          body: data.body,
          isRead: data.isRead
        };
        const messageIndex = messageNotifications.findIndex((notification) => notification.conversationId === data.conversationId);
        if (messageIndex > -1) {
          messageNotifications = messageNotifications.filter((notificationData) => notificationData.conversationId !== data.conversationId);
          messageNotifications = [notificationData, ...messageNotifications];
        } else {
          messageNotifications = [notificationData, ...messageNotifications];
        }
        const count = messageNotifications.reduce((sum, notification) => {
          if (!notification.isRead) {
            return sum + 1;
          }
          return sum;
        }, 0);
        if (!Utils.checkUrl(location.pathname, '/chat/')) {
          Utils.dispatchNotification('You have a new message', 'success', dispatch);
        }
        setMessageCount(count);
        setMessageNotifications(messageNotifications);
      }
    });
  }
}
