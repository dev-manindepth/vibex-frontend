import React, { useEffect, useState } from 'react';
import '@pages/social/notifications/Notifications.scss';
import Avatar from '@components/avatar/Avatar';
import { FaCircle, FaRegCircle, FaRegTrashAlt } from 'react-icons/fa';
import { notificationService } from '@services/api/notifications/notification.service';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from '@hooks/useEffectOnce';
import { INotificationDialog, INotifications } from '@interfaces/index';
import { NotificationUtils } from '@services/utils/notification-utils.service';
import { RootState } from '@redux-toolkit/store';
import NotificationPreview from '@components/notification-preview/NotificationPreview';

const Notifications = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [notificationDialogContent, setNotificationDialogContent] = useState<INotificationDialog>({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      setNotifications(response.data.notifications);
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.messaage, 'error', dispatch);
    } finally {
      setLoading(false);
    }
  };
  const markAsRead = (notification: INotifications) => {
    try {
      NotificationUtils.markMessageAsRead(notification._id!, notification, setNotificationDialogContent);
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };
  const deleteNotification = async (event: React.SyntheticEvent, messageId: string) => {
    event.stopPropagation();
    try {
      const response = await notificationService.deleteNotification(messageId);
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };
  useEffectOnce(() => {
    getUserNotifications();
  });
  useEffect(() => {
    NotificationUtils.socketIONofication(profile!, notifications, setNotifications, 'notificationPage');
  }, [profile, notifications]);
  return (
    <>
      {notificationDialogContent?.senderName && (
        <NotificationPreview
          title="Your Post"
          post={notificationDialogContent.post}
          imgUrl={notificationDialogContent.imgUrl!}
          comment={notificationDialogContent.comment}
          reaction={notificationDialogContent.reaction}
          senderName={notificationDialogContent.senderName}
          secondButtonText="Close"
          secondBtnHandler={() => {
            setNotificationDialogContent({ post: '', imgUrl: '', comment: '', reaction: '', senderName: '' });
          }}
        />
      )}
      <div className="notifications-container">
        <div className="notifications">Notifications</div>
        {notifications.length > 0 && (
          <div className="notifications-box">
            {notifications.map((notification, index) => (
              <div className="notification-box" data-testid="notification-box" key={index} onClick={() => markAsRead(notification)}>
                <div className="notification-box-sub-card">
                  <div className="notification-box-sub-card-media">
                    <div className="notification-box-sub-card-media-image-icon">
                      <Avatar
                        name={notification?.userFrom?.username}
                        bgColor={notification?.userFrom?.avatarColor}
                        textColor="#ffffff"
                        size={40}
                        avatarSrc={notification?.userFrom?.profilePicture}
                      />
                    </div>
                    <div className="notification-box-sub-card-media-body">
                      <h6 className="title">
                        {notification?.message}
                        <small
                          data-testid="subtitle"
                          className="subtitle"
                          onClick={(event) => deleteNotification(event, notification._id!)}
                        >
                          <FaRegTrashAlt className="trash" />
                        </small>
                      </h6>
                      <div className="subtitle-body">
                        <small className="subtitle">
                          {!notification?.read ? <FaCircle className="icon" /> : <FaRegCircle className="icon" />}
                        </small>
                        <p className="subtext">1 hr ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {loading && !notifications.length && <div className="notifications-box"></div>}
        {!loading && !notifications.length && (
          <h3 className="empty-page" data-testid="empty-page">
            You have no notification
          </h3>
        )}
      </div>
    </>
  );
};

export default Notifications;
