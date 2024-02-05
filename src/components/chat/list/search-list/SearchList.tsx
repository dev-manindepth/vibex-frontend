import React from 'react';
import '@components/chat/list/search-list/SearchList.scss';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { ISearchUser, IUser } from '@interfaces/index';
import Avatar from '@components/avatar/Avatar';

interface ISearchList {
  users: ISearchUser[];
  isSearching: boolean;
  searchTerm: string;
  setSelectedUser: (user: ISearchUser) => void;
  setSearch: (searchTerm: string) => void;
  setIsSearching: (searching: boolean) => void;
  setSearchResult: (result: any) => void;
  setComponentType: (componentType: string) => void;
}
const SearchList: React.FC<ISearchList> = ({
  users,
  isSearching,
  searchTerm,
  setComponentType,
  setIsSearching,
  setSearch,
  setSearchResult,
  setSelectedUser
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const addUsernametoUrlQuery = (user: ISearchUser) => {
    setComponentType('searchList');
    setSelectedUser(user);
    const url = `${location.pathname}?${createSearchParams({ username: user.username?.toLocaleLowerCase()!, id: user._id })}`;
    navigate(url);
    // setSearch('');
    // setIsSearching(false);
    // setSearchResult([]);
  };
  return (
    <div className="search-result">
      <div className="search-result-container">
        {!isSearching && users.length > 0 && (
          <>
            {users.map((user) => (
              <div className="search-result-container-item" key={user._id} onClick={() => addUsernametoUrlQuery(user)}>
                <Avatar name={user.username} bgColor={user.avatarColor} textColor="#ffffff" size={40} avatarSrc={user.profilePicture} />
                <div className="username">{user.username}</div>
              </div>
            ))}
          </>
        )}
        {searchTerm && isSearching && users.length === 0 && (
          <div className="search-result-container-empty">
            <span>Searching...</span>
          </div>
        )}
        {searchTerm && !isSearching && users.length === 0 && (
          <div className="search-result-container-empty">
            <span>No Result Found</span>
            <p className="search-result-container-empty-msg">We couldn&apos;t find match for {searchTerm}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchList;
