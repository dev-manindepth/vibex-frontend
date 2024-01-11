import doubleCheckmark from '@assets/images/double-checkmark.png';
import Avatar from '@components/avatar/Avatar';
import PropTypes from 'prop-types';
import { FaCheck, FaCircle } from 'react-icons/fa';

import '@components/message-sidebar/MessageSidebar.scss';
import { Utils } from '@services/utils/utils.service';
import { IMessageData, IUser } from '@interfaces/index';
import React from 'react';

interface IMessageSidebar {
  profile: IUser | null;
  messageCount: number;
  messageNotifications: IMessageData[];
  openChatPage: () => void;
}
const MessageSidebar: React.FC<IMessageSidebar> = ({ profile, messageCount, messageNotifications, openChatPage }) => {
  return (
    <div className="message-dropdown" data-testid="message-sidebar">
      <div className="message-card">
        <div className="message-card-body">
          <div className="message-bg-primary">
            <h5 className="text-white">
              Messages
              {messageCount > 0 && <small className="message-count">{messageCount}</small>}
            </h5>
          </div>

          <div className="message-card-body-info">
            <div data-testid="info-container" className="message-card-body-info-container">
              {messageNotifications.map((notification) => (
                <div className="message-sub-card" key={Utils.generateString(10)} onClick={() => openChatPage()}>
                  <div className="content-avatar">
                    <Avatar
                      name={notification.receiverUsername === profile?.username ? profile?.username : notification?.senderUsername}
                      bgColor={
                        notification.receiverUsername === profile?.username
                          ? notification.receiverAvatarColor
                          : notification?.senderAvatarColor
                      }
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={
                        notification.receiverUsername !== profile?.username
                          ? notification.receiverProfilePicture
                          : notification?.senderProfilePicture
                      }
                    />
                  </div>
                  <div className="content-body">
                    <h6 className="title">
                      {notification.receiverUsername !== profile?.username ? notification.receiverUsername : notification.senderUsername}
                    </h6>
                    <p className="subtext">{notification?.body ? notification?.body : ''}</p>
                  </div>
                  <div className="content-icons">
                    {!notification?.isRead ? (
                      <>
                        {notification.receiverUsername === profile?.username ? (
                          <FaCircle className="circle" />
                        ) : (
                          <FaCheck className="circle not-read" />
                        )}
                      </>
                    ) : (
                      <>
                        {notification.senderUsername === profile?.username && <img src={doubleCheckmark} alt="" className="circle read" />}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageSidebar;
