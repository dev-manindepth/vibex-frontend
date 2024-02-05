import { IChatUsers, IJoinRoom, IMessageBody, IMessageData, ISenderReceiver, IUser } from '@interfaces/index';
import { Dispatch } from '@reduxjs/toolkit';
import { chatService } from '@services/api/chat/chat.service';
import { socketService } from '@services/socket/socket.service';
import { NavigateFunction, createSearchParams } from 'react-router-dom';

export class ChatUtils {
  static privateChatMessages: IMessageData[] = [];
  static chatUsers: IChatUsers[] = [];

  static usersOnline(setOnlineUsers: (users: string[]) => void) {
    socketService.socket.on('user online', (data: string[]) => {
      setOnlineUsers(data);
    });
  }
  static usersOnChatPage() {
    socketService.socket.on('add chat users', (data: IChatUsers[]) => {
      ChatUtils.chatUsers = [...data];
    });
  }
  static joinRoomEvent(user: Partial<IMessageData>, profile: IUser) {
    const users = {
      receiverId: user.receiverId,
      receiverName: user.receiverUsername,
      senderId: profile._id,
      senderName: profile.username
    };
    socketService.socket.emit('join room', users);
  }
  static emitChatPageEvent(event: any, data: any) {
    socketService.socket.emit(event, data);
  }
  static chatUrlParams(user: Partial<IMessageData>, profile: IUser) {
    const params = { username: '', id: '' };
    if (user.receiverUsername === profile.username) {
      params.username = user.senderUsername!.toLowerCase();
      params.id = user.senderId!;
    } else {
      params.username = user.receiverUsername!.toLowerCase();
      params.id = user.receiverId!;
    }
    return params;
  }
  static messageData({
    receiver,
    conversationId,
    message,
    searchParamsId,
    chatMessages,
    isRead,
    gifUrl,
    selectedImage
  }: {
    receiver: IUser;
    conversationId: string;
    message: string;
    searchParamsId: string;
    chatMessages: IMessageData[];
    isRead: boolean;
    gifUrl: string;
    selectedImage: string;
  }) {
    const chatConversationId = chatMessages.find((chat) => chat.receiverId === searchParamsId || chat.senderId === searchParamsId);
    const messageData: IMessageBody = {
      conversationId: chatConversationId ? chatConversationId.conversationId : conversationId,
      receiverId: receiver._id,
      receiverUsername: receiver.username!,
      receiverAvatarColor: receiver.avatarColor!,
      receiverProfilePicture: receiver.profilePicture,
      body: message.trim(),
      isRead,
      gifUrl,
      selectedImage
    };
    return messageData;
  }
  static updateSelectedChatUser({
    chatMessageList,
    profile,
    username,
    setSelectedChatUser,
    params,
    pathname,
    navigate,
    dispatch
  }: {
    chatMessageList: Partial<IMessageData>[];
    profile: IUser | null;
    username: string;
    setSelectedChatUser: any;
    params: { username: string; id: string } | null;
    pathname: string;
    navigate: NavigateFunction;
    dispatch: Dispatch;
  }) {
    if (chatMessageList.length) {
      dispatch(setSelectedChatUser({ isLoading: false, selectedChatUser: chatMessageList[0] }));
      navigate(`${pathname}?${createSearchParams(params!)}`);
    } else {
      dispatch(setSelectedChatUser({ isLoading: false, selectedChatUser: null }));
      const sender = ChatUtils.chatUsers.find(
        (chatUser) => chatUser.sender === profile?.username && chatUser.receiver.toLowerCase() === username
      );
      if (sender) {
        chatService.removeChatUsers(sender);
      }
    }
  }

  static socketIOChatList(
    profile: IUser,
    chatMessageList: Partial<IMessageData>[],
    setChatMessageList: (chatMessageList: Partial<IMessageData>[]) => void
  ) {
    socketService.socket.on('chat list', (data: IMessageData) => {
      if (data.senderUsername === profile.username || data.receiverUsername === profile.username) {
        const messageIndex = chatMessageList.findIndex((chat) => chat.conversationId === data.conversationId);
        chatMessageList = JSON.parse(JSON.stringify(chatMessageList));
        if (messageIndex > -1) {
          chatMessageList = chatMessageList.filter((chat) => chat.conversationId !== data.conversationId);
          chatMessageList = [data, ...chatMessageList];
        } else {
          chatMessageList = chatMessageList.filter((chat) => chat.receiverUsername !== data.receiverUsername);
          chatMessageList = [data, ...chatMessageList];
        }
        setChatMessageList(chatMessageList);
      }
    });
  }

  static socketIOMessageReceived(
    chatMessage: IMessageData[],
    username: string,
    setConversationId: (conversationId: string) => void,
    setChatMessages: (chatMessages: IMessageData[]) => void
  ) {
    chatMessage = JSON.parse(JSON.stringify(chatMessage));
    socketService.socket.on('message received', (data: IMessageData) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        setConversationId(data.conversationId);
        ChatUtils.privateChatMessages.push(data);
        chatMessage = [...ChatUtils.privateChatMessages];
        setChatMessages(chatMessage);
      }
    });

    socketService.socket.on('message read', (data: IMessageData) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        const findMessageIndex = ChatUtils.privateChatMessages.findIndex((message) => message._id === data._id);
        if (findMessageIndex > -1) {
          ChatUtils.privateChatMessages.splice(findMessageIndex, 1, data);
          if (findMessageIndex > -1) {
            ChatUtils.privateChatMessages.splice(findMessageIndex, 1, data);
            chatMessage = [...ChatUtils.privateChatMessages];
            setChatMessages(chatMessage);
          }
        }
      }
    });
  }

  static socketIOMessageReaction(
    chatMessages: IMessageData[],
    username: string,
    setConversationId: (conversationId: string) => void,
    setChatMessages: (chatMessages: IMessageData[]) => void
  ) {
    socketService.socket.on('message reaction', (data: IMessageData) => {
      if (data.senderUsername.toLowerCase() === username || data.receiverUsername.toLowerCase() === username) {
        chatMessages = JSON.parse(JSON.stringify(chatMessages));
        setConversationId(data.conversationId);
        const messageIndex = chatMessages.findIndex((message) => message._id === data._id);
        if (messageIndex > -1) {
          chatMessages.splice(messageIndex, 1, data);
          setChatMessages(chatMessages);
        }
      }
    });
  }
}
