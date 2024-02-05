import { fontAwesomeIcons, sideBarItems } from '@services/utils/static.data';
import React, { useCallback, useEffect, useState } from 'react';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import '@components/sidebar/Sidebar.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import { getPosts } from '@redux-toolkit/api/posts';
import { Utils } from '@services/utils/utils.service';
import { socketService } from '@services/socket/socket.service';
import { ChatUtils } from '@services/utils/chat-utils.service';
import { IMessageData } from '@interfaces/index';
import { chatService } from '@services/api/chat/chat.service';

interface ISideBarItems {
  index: number;
  name: string;
  url: string;
  iconName: string;
}
const Sidebar: React.FC = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { chatList } = useSelector((state: RootState) => state.chat);
  const [sidebar, setSidebar] = useState<ISideBarItems[]>([]);
  const [chatPageName, setChatPageName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkUrlPath = (name: string) => {
    return location.pathname.includes(name.toLowerCase());
  };
  const navigateToPage = (name: string, url: string) => {
    if (name === 'Profile') {
      const params = new URLSearchParams();
      params.append('id', profile?._id || ''); // Append 'id' parameter
      params.append('uId', profile?.uId || ''); // Append 'uId' parameter

      // Append the username to the URL
      url = `${url}/${profile?.username}?${params.toString()}`;
    }
    if (name === 'Vibes') {
      dispatch(getPosts() as any);
    }

    if (name === 'Chat') {
      setChatPageName('Chat');
    } else {
      leaveChatPage();
      setChatPageName('');
    }
    socketService.socket.off('message received');
    navigate(url);
  };

  const createChatUrlParams = useCallback(
    (url: string) => {
      if (chatList.length) {
        const chatUser = chatList[0];
        const params = ChatUtils.chatUrlParams(chatUser, profile!);
        ChatUtils.joinRoomEvent(chatUser, profile!);
        return `${url}?${createSearchParams(params)}`;
      } else {
        return url;
      }
    },
    [chatList, profile]
  );
  const markMessageAsRead = useCallback(
    async (user: IMessageData) => {
      try {
        const receiverId = user.receiverUsername !== profile?.username ? user.receiverId : user.senderId;
        if (user.receiverUsername === profile?.username && !user.isRead) {
          await chatService.markMessagesAsRead(profile._id, receiverId);
        }
        const receiverName = user.receiverUsername !== profile?.username ? user.receiverUsername : user.senderUsername;
        await chatService.addChatUsers({ sender: profile?.username!, receiver: receiverName });
      } catch (error: any) {
        Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
      }
    },
    [dispatch, profile]
  );
  const leaveChatPage = async () => {
    try {
      const chatUser = chatList[0];
      const receiverUserName = chatUser.receiverUsername !== profile?.username ? chatUser.receiverUsername : chatUser.senderUsername;
      ChatUtils.privateChatMessages = [];
      await chatService.removeChatUsers({ sender: profile?.username!, receiver: receiverUserName });
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  useEffect(() => {
    setSidebar(sideBarItems);
  }, []);

  useEffect(() => {
    if (chatPageName === 'Chat') {
      const url = createChatUrlParams('/app/social/chat/messages');
      navigate(url);
      if (chatList.length && !chatList[0].isRead) {
        markMessageAsRead(chatList[0]);
      }
    }
  }, [chatList, chatPageName, createChatUrlParams, markMessageAsRead, navigate]);
  return (
    <div className="app-side-menu">
      <div className="side-menu">
        <ul className="list-unstyled">
          {sidebar &&
            sidebar.map((data) => {
              return (
                <li key={data.index} onClick={() => navigateToPage(data.name, data.url)}>
                  <div className={`sidebar-link ${checkUrlPath(data.name) ? 'active' : ''}`}>
                    <div className="menu-icon">{fontAwesomeIcons[data.iconName]}</div>
                    <div className="menu-link">
                      <span>{`${data.name}`}</span>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
