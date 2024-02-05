import '@components/chat/window/ChatWindow.scss';
import Avatar from '@components/avatar/Avatar';
import { IMessageBody, IMessageData, IUpdateChatReactionBody, IUser } from '@interfaces/index';
import { RootState } from '@redux-toolkit/store';
import { chatService } from '@services/api/chat/chat.service';
import { userService } from '@services/api/user/user.service';
import { ChatUtils } from '@services/utils/chat-utils.service';
import { Utils } from '@services/utils/utils.service';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import MessageInput from './message-input/MessageInput';
import MessageDisplay from './message-display/MessageDisplay';

const ChatWindow = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { isLoading } = useSelector((state: RootState) => state.chat);
  const [receiver, setReceiver] = useState<IUser>();
  const [conversationId, setConversationId] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<IMessageData[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const [rendered, setRendered] = useState(false);
  const dispatch = useDispatch();

  const getChatMessages = useCallback(
    async (receiverId: string) => {
      try {
        const response = await chatService.getChatMessages(receiverId);
        ChatUtils.privateChatMessages = [...response.data.messages];
        setChatMessages([...ChatUtils.privateChatMessages]);
      } catch (error: any) {
        Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
      }
    },
    [dispatch]
  );
  const getNewUserMessages = useCallback(() => {
    if (searchParams.get('id') && searchParams.get('username')) {
      setConversationId('');
      setChatMessages([]);
      getChatMessages(searchParams.get('id')!);
    }
  }, [getChatMessages, searchParams]);
  const getUserProfileByUserId = useCallback(async () => {
    try {
      const response = await userService.getUserProfileByUserId(searchParams.get('id')!);
      setReceiver(response.data.user);
      const { receiverId, receiverName } = response.data.user;
      ChatUtils.joinRoomEvent(response.data.user, profile!);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  }, [dispatch, profile, searchParams]);
  const sendChatMessage = async (message: any, gifUrl: string, selectedImage: string) => {
    try {
      const senderUser = ChatUtils.chatUsers.some((user) => user.sender === profile?.username && user.receiver === receiver?.username);
      const receiverUser = ChatUtils.chatUsers.some((user) => user.sender === receiver?.username && user.receiver === profile?.username);

      let messageData =
        receiver &&
        ChatUtils.messageData({
          receiver,
          conversationId,
          message,
          searchParamsId: searchParams.get('id')!,
          chatMessages,
          gifUrl,
          selectedImage,
          isRead: senderUser && receiverUser
        });

      await chatService.saveChatMessage(messageData!);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  const updateMessageReaction = async (body: IUpdateChatReactionBody) => {
    try {
      await chatService.updateMessageReaction(body);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  const deleteChatMessage = async (senderId: string, receiverId: string, messageId: string, type: string) => {
    try {
      await chatService.markMessageAsDelete(messageId, senderId, receiverId, type);
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };

  useEffect(() => {
    if (rendered) {
      getUserProfileByUserId();
      getNewUserMessages();
    }
    if (!rendered) setRendered(true);
  }, [getUserProfileByUserId, getNewUserMessages, searchParams, rendered]);

  useEffect(() => {
    if (rendered) {
      ChatUtils.socketIOMessageReceived(chatMessages, searchParams.get('username')!, setConversationId, setChatMessages);
    }
    if (!rendered) setRendered(true);
    ChatUtils.usersOnline(setOnlineUsers);
    ChatUtils.usersOnChatPage();
  }, [searchParams, rendered]);

  useEffect(() => {
    ChatUtils.socketIOMessageReaction(chatMessages, searchParams.get('username')!, setConversationId, setChatMessages);
  }, [chatMessages, searchParams]);
  return (
    <div className="chat-window-container">
      {isLoading ? (
        <div className="message-loading"></div>
      ) : (
        <div>
          <div className="chat-title">
            {receiver && (
              <div className="chat-title-avatar">
                <Avatar
                  name={receiver.username}
                  bgColor={receiver.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={receiver.profilePicture}
                />
              </div>
            )}
            <div className="chat-title-items">
              {receiver && (
                <div className={`chat-name ${Utils.checkIfUserIsOnline(receiver.username!, onlineUsers) ? '' : 'user-not-online'}`}>
                  {receiver.username!}
                </div>
              )}

              {receiver && Utils.checkIfUserIsOnline(receiver.username!, onlineUsers) && <span className="chat-active">Online</span>}
            </div>
          </div>
          <div className="chat-window">
            <div className="chat-window-message">
              <MessageDisplay
                chatMessages={chatMessages}
                profile={profile!}
                updateMessageReaction={updateMessageReaction}
                deleteChatMessage={deleteChatMessage}
              />
            </div>
            <div className="chat-window-input">
              <MessageInput setChatMessage={sendChatMessage} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
