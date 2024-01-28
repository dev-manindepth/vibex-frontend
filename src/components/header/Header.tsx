import { FaCaretDown, FaCaretUp, FaRegBell, FaRegEnvelope } from 'react-icons/fa';

import '@components/header/Header.scss';
import { useEffect, useRef, useState } from 'react';
import { Utils } from '@services/utils/utils.service';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import MessageSidebar from '@components/message-sidebar/MessageSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import Avatar from '@components/avatar/Avatar';
import Dropdown from '@components/dropdown/Dropdown';
import useEffectOnce from '@hooks/useEffectOnce';
import { INotificationDialog, INotifications, ISettings } from '@interfaces/index';
import { ProfileUtils } from '@services/utils/profile-utils.service';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { userService } from '@services/api/user/user.service';
import HeaderSkeleton from './HeaderSkeleton';
import { notificationService } from '@services/api/notifications/notification.service';
import { NotificationUtils } from '@services/utils/notification-utils.service';
import NotificationPreview from '@components/notification-preview/NotificationPreview';
import { socketService } from '@services/socket/socket.service';

const Header = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [environment, setEnvironment] = useState<string | null | undefined>('');
  const messageRef = useRef(null);
  const notificationRef = useRef(null);
  const settingRef = useRef(null);
  const [isMessageActive, setIsMessageActive] = useDetectOutsideClick({ ref: messageRef, initialState: false });
  const [isNotificationActive, setIsNotificationActive] = useDetectOutsideClick({ ref: notificationRef, initialState: false });
  const [notifications, setNotifications] = useState<INotifications[]>([]);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [notificationDialogContent, setNotificationDialogContent] = useState<INotificationDialog>({
    post: '',
    imgUrl: '',
    comment: '',
    reaction: '',
    senderName: ''
  });
  const [settings, setSettings] = useState<ISettings[]>([]);
  const [isSettingActive, setIsSettingActive] = useDetectOutsideClick({ ref: settingRef, initialState: false });
  const navigate = useNavigate();
  const storedUsername = useLocalStorage('username', 'get');
  const [deleteStorageUsername] = useLocalStorage('username', 'remove');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'remove');
  const dispatch = useDispatch();
  const backgroundColor = `${environment === 'DEV' || 'LOCAL' ? '#50B5FF' : environment === 'STG' ? '#e9710f' : ''}`;

  const getUserNotifications = async () => {
    try {
      const response = await notificationService.getUserNotifications();
      const mappedNotifications = NotificationUtils.mapNotificationDropdownItems(response.data.notifications, setNotificationCount);
      setNotifications(mappedNotifications);
      socketService?.socket.emit('setup', { userId: storedUsername });
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.messaage, 'error', dispatch);
    }
  };
  const onMarkAsRead = (notification: INotifications) => {
    try {
      NotificationUtils.markMessageAsRead(notification._id!, notification, setNotificationDialogContent);
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };
  const onDeleteNotification = async (messageId: string) => {
    try {
      const response = await notificationService.deleteNotification(messageId);
      Utils.dispatchNotification(response.data.message, 'success', dispatch);
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };

  const openChatPage = () => {};
  const onLogout = async () => {
    try {
      setLoggedIn(false);
      Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn });
      await userService.logoutUser();
      navigate('/');
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
  }, []);
  useEffectOnce(() => {
    Utils.mapSettingsDropdownItems(setSettings);
    getUserNotifications();
  });
  useEffect(() => {
    NotificationUtils.socketIONofication(profile!, notifications, setNotifications, 'header', setNotificationCount);
  }, [profile, notifications]);
  return (
    <>
      {!profile ? (
        <HeaderSkeleton />
      ) : (
        <div className="header-nav-wrapper" data-testid="header-wrapper">
          {isMessageActive && (
            <div ref={messageRef}>
              <MessageSidebar messageCount={0} openChatPage={openChatPage} profile={profile} messageNotifications={[]} />
            </div>
          )}
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
          <div className="header-navbar">
            <div className="header-image" data-testid="header-image" onClick={() => navigate('/app/social/vibes')}>
              <div className="app-name">
                VibeX
                <span className="environment" style={{ backgroundColor }}>
                  {environment}
                </span>
              </div>
            </div>
            <div className="header-menu-toggle">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <ul className="header-nav">
              <li
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(true);
                }}
              >
                <span className="header-list-name">
                  <FaRegBell className="header-list-icon" />
                  {notificationCount > 0 && (
                    <span className="bg-danger-dots dots" data-testid="notification-dots">
                      {notificationCount}
                    </span>
                  )}
                </span>
                {isNotificationActive && (
                  <ul className="dropdown-ul" ref={notificationRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: '250px', top: '20px' }}
                        data={notifications}
                        notificationCount={notificationCount}
                        title={'Notifications'}
                        onMarkAsRead={onMarkAsRead}
                        onDeleteNotification={onDeleteNotification}
                      />
                    </li>
                  </ul>
                )}
                &nbsp;
              </li>
              <li
                className="header-nav-item active-item"
                onClick={() => {
                  setIsMessageActive(true);
                  setIsNotificationActive(false);
                  setIsSettingActive(false);
                }}
              >
                <span className="header-list-name">
                  <FaRegEnvelope className="header-list-icon" />
                  <span className="bg-danger-dots dots" data-testid="messages-dots"></span>
                </span>
                &nbsp;
              </li>
              <li
                className="header-nav-item"
                onClick={() => {
                  setIsMessageActive(false);
                  setIsNotificationActive(false);
                  setIsSettingActive(!isSettingActive);
                }}
              >
                <span className="header-list-name profile-image">
                  <Avatar
                    name={profile?.username}
                    bgColor={profile?.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={profile?.profilePicture}
                  />
                </span>
                <span className="header-list-name profile-name">
                  {profile?.username}
                  {!isSettingActive ? <FaCaretDown className="header-list-icon caret" /> : <FaCaretUp className="header-list-icon caret" />}
                </span>
                {isSettingActive && (
                  <ul className="dropdown-ul" ref={settingRef}>
                    <li className="dropdown-li">
                      <Dropdown
                        height={300}
                        style={{ right: '150px', top: '40px' }}
                        data={settings}
                        notificationCount={0}
                        title={'Settings'}
                        onLogout={onLogout}
                        onNavigate={() => ProfileUtils.navigateToProfile(profile._id, profile.uId!, profile.username!, navigate)}
                      />
                    </li>
                  </ul>
                )}
                <ul className="dropdown-ul">
                  <li className="dropdown-li"></li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};
export default Header;
