import Avatar from '@components/avatar/Avatar';
import Input from '@components/input/Input';
import { RootState } from '@redux-toolkit/store';
import React, { useCallback, useEffect, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import '@components/chat/list/ChatList.scss';
import SearchList from './search-list/SearchList';
import useDebounce from '@hooks/useDebounce';
import { createSearchParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Utils } from '@services/utils/utils.service';
import { userService } from '@services/api/user/user.service';
import { IMessageData, ISearchUser } from '@interfaces/index';
import { ChatUtils } from '@services/utils/chat-utils.service';
import { setSelectedChatUser } from '@redux-toolkit/reducers/chat/chat.reducer';
import { chatService } from '@services/api/chat/chat.service';
import DateTimeUtil from '@services/utils/date-time.service';
import ChatListBody from './ChatListBody';

const ChatList = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const { chatList } = useSelector((state: RootState) => state.chat);
  const [search, setSearch] = useState<string>('');
  const [searchResult, setSearchResult] = useState<ISearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [componentType, setComponentType] = useState<string>('chatList');
  let [chatMessageList, setChatMessageList] = useState<Partial<IMessageData>[]>([]);
  const [rendered, setRendered] = useState(false);
  const debouncedValue = useDebounce(search, 1000);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParamas] = useSearchParams();

  const searchUsers = useCallback(
    async (query: string) => {
      setIsSearching(true);
      try {
        setSearch(query);
        if (query) {
          const response = await userService.searchUsers(query);
          setSearchResult(response.data.search);
        }
      } catch (error: any) {
        Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
      } finally {
        setIsSearching(false);
      }
    },
    [dispatch]
  );

  const addSelectedUserToList = useCallback(
    (user: ISearchUser) => {
      const newUser: Partial<IMessageData> = {
        receiverId: user._id,
        receiverUsername: user.username,
        receiverAvatarColor: user.avatarColor,
        receiverProfilePicture: user.profilePicture,
        senderUsername: profile?.username,
        senderId: profile?._id,
        senderAvatarColor: profile?.avatarColor,
        senderProfilePicture: profile?.profilePicture,
        body: ''
      };
      ChatUtils.joinRoomEvent(user, profile!);
      ChatUtils.privateChatMessages = [];
      const findUser = chatMessageList.find(
        (chat) => chat.receiverId === searchParamas.get('id') || chat.senderId === searchParamas.get('id')
      );
      if (!findUser) {
        const newChatList = [newUser, ...chatMessageList];
        setChatMessageList(newChatList);
        if (!chatList.length) {
          dispatch(setSelectedChatUser({ isLoading: false, selectedChatUser: newUser }));
          const receiverUsername = newUser.receiverUsername !== profile?.username ? newUser.receiverUsername : newUser.senderUsername;
          chatService.addChatUsers({ sender: profile?.username!, receiver: receiverUsername! });
        }
      }
    },
    [chatList, chatMessageList, dispatch, searchParamas, profile]
  );

  const removeSelectedUserFromList = (event: React.SyntheticEvent) => {
    event.stopPropagation();
    chatMessageList = JSON.parse(JSON.stringify(chatMessageList));
    const userIndex = chatMessageList.findIndex((chat) => chat.receiverId === searchParamas.get('id'));
    if (userIndex > -1) {
      chatMessageList.splice(userIndex, 1);
      setSelectedUser(null);
      setChatMessageList(chatMessageList);
      ChatUtils.updateSelectedChatUser({
        chatMessageList,
        profile,
        username: searchParamas.get('username')!,
        setSelectedChatUser,
        params: chatMessageList.length ? updateQueryParams(chatMessageList[0]) : null,
        pathname: location.pathname,
        navigate,
        dispatch
      });
    }
  };
  const updateQueryParams = (user: Partial<IMessageData>) => {
    setSelectedUser(user);
    const params = ChatUtils.chatUrlParams(user, profile!);
    ChatUtils.joinRoomEvent(user, profile!);
    ChatUtils.privateChatMessages = [];
    return params;
  };

  const addUsernameToUrlQuery = async (user: Partial<IMessageData>) => {
    try {
      const sender = ChatUtils.chatUsers.find(
        (userData) =>
          userData.sender.toLowerCase() === profile?.username && userData.receiver.toLowerCase() === searchParamas.get('username')
      );
      const params = updateQueryParams(user);
      const receiverName = user.receiverUsername !== profile?.username ? user.receiverUsername : user.senderUsername;
      const receiverId = user.receiverUsername !== profile?.username ? user.receiverId : user.senderId;
      navigate(`${location.pathname}?${createSearchParams(params)}`);
      if (sender) {
        chatService.removeChatUsers(sender);
      }
      chatService.addChatUsers({ sender: profile?.username!, receiver: receiverName! });
      if (user.receiverUsername) {
        await chatService.markMessagesAsRead(profile?._id!, receiverId!);
      }
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  useEffect(() => {
    if (debouncedValue) {
      searchUsers(debouncedValue);
    }
  }, [debouncedValue, searchUsers]);

  useEffect(() => {
    if (selectedUser && componentType === 'searchList') {
      addSelectedUserToList(selectedUser);
    }
  }, [addSelectedUserToList, componentType, selectedUser]);

  useEffect(() => {
    setChatMessageList(chatList);
  }, [chatList]);
  useEffect(() => {
    if (rendered) {
      ChatUtils.socketIOChatList(profile!, chatMessageList, setChatMessageList);
    }
    if (!rendered) setRendered(true);
  }, [chatMessageList, profile, rendered]);
  return (
    <div data-testid="chatList">
      <div className="conversation-container">
        <div className="conversation-container-header">
          <div className="header-img">
            <Avatar
              name={profile?.username}
              bgColor={profile?.avatarColor}
              textColor="#ffffff"
              size={40}
              avatarSrc={profile?.profilePicture}
            />
          </div>
          <div className="title-text">{profile?.username}</div>
        </div>

        <div className="conversation-container-search" data-testid="search-container">
          <FaSearch className="search" />
          <Input
            id="message"
            name="message"
            type="text"
            className="search-input"
            labelText=""
            placeholder="Search"
            handleChange={(event) => {
              setIsSearching(true);
              setSearch(event.target.value);
            }}
            value={search}
          />
          {search && (
            <FaTimes
              className="times"
              onClick={() => {
                setSearch('');
                setIsSearching(false);
                setSearchResult([]);
              }}
            />
          )}
        </div>

        <div className="conversation-container-body">
          {!search && (
            <div className="conversation">
              {chatMessageList.map((data) => (
                <div
                  key={Utils.generateString(10)}
                  className={`conversation-item ${
                    searchParamas.get('username') == data.receiverUsername?.toLowerCase() ||
                    searchParamas.get('username') == data.senderUsername?.toLowerCase()
                      ? 'active'
                      : ''
                  }`}
                  onClick={() => addUsernameToUrlQuery(data)}
                >
                  <div className="avatar">
                    <Avatar
                      name={data.receiverUsername == profile?.username ? profile?.username : data.senderUsername}
                      bgColor={data.receiverUsername == profile?.username ? data.receiverAvatarColor : data.senderAvatarColor}
                      textColor="#ffffff"
                      size={40}
                      avatarSrc={data.receiverUsername !== profile?.username ? data.receiverProfilePicture : data.senderProfilePicture}
                    />
                  </div>
                  <div className={`title-text ${selectedUser && !data.body ? 'title-text' : ''}`}>
                    {data.receiverUsername !== profile?.username ? data.receiverUsername : data.senderUsername}
                  </div>
                  {data.createdAt && <div className="created-date">{DateTimeUtil.transform(data.createdAt)}</div>}
                  {!data.body && (
                    <div className="created-date" onClick={removeSelectedUserFromList}>
                      <FaTimes />
                    </div>
                  )}
                  {data.body && !data.deleteForMe && !data.deleteForEveryone && (
                    <ChatListBody data={data} profile={profile!} key={data._id} />
                  )}
                  {data.deleteForMe && data.deleteForEveryone && (
                    <div className="conversation-message">
                      <span className="message-deleted">message deleted</span>
                    </div>
                  )}
                  {data.deleteForMe && !data.deleteForEveryone && data.senderUsername !== profile?.username && (
                    <div className="conversation-message">
                      <span className="message-deleted">message deleted</span>
                    </div>
                  )}
                  {data.deleteForMe && !data.deleteForEveryone && data.receiverUsername !== profile?.username && (
                    <ChatListBody data={data} profile={profile!} key={data._id} />
                  )}
                </div>
              ))}
            </div>
          )}

          <SearchList
            searchTerm={search}
            users={searchResult}
            isSearching={isSearching}
            setSearchResult={setSearch}
            setIsSearching={setIsSearching}
            setSearch={setSearch}
            setSelectedUser={setSelectedUser}
            setComponentType={setComponentType}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatList;
