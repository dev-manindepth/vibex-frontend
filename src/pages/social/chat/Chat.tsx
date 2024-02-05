import React from 'react';
import '@pages/social/chat/Chat.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import useEffectOnce from '@hooks/useEffectOnce';
import { getConversationList } from '@redux-toolkit/api/chat';
import ChatList from '@components/chat/list/ChatList';
import ChatWindow from '@components/chat/window/ChatWindow';

const Chat = () => {
  const { selectedChatUser, chatList } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  useEffectOnce(() => {
    dispatch(getConversationList() as any);
  });
  return (
    <div className="private-chat-wrapper">
      <div className="private-chat-wrapper-content">
        <div className="private-chat-wrapper-content-side">
          <ChatList />
        </div>
        <div className="private-chat-wrapper-content-conversation">
          {(selectedChatUser || chatList.length > 0) && <ChatWindow />}
          {!selectedChatUser && !chatList.length && (
            <div className="no-chat" data-testid="no-chat">
              Select or Search for users to chat with
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
