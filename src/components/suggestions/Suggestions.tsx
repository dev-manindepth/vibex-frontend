import Avatar from '@components/avatar/Avatar';
import Button from '@components/button/Button';
import React, { useEffect, useState } from 'react';

import '@components/suggestions/Suggestions.scss';
import { useDispatch, useSelector } from 'react-redux';
import { IUser } from '@interfaces/index';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@redux-toolkit/store';
import { Utils } from '@services/utils/utils.service';
import { FollowersUtils } from '@services/utils/followers-utils.service';
import { addToSuggestions } from '@redux-toolkit/reducers/suggestions/suggestions.reducer';

const Suggestions = () => {
  const { users } = useSelector((state: RootState) => state.suggestions);
  const [suggestedUser, setSuggestedUser] = useState<IUser[]>([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const followUser = async (userId: string) => {
    try {
      FollowersUtils.followUser(userId, dispatch);
      const updatedUsers = suggestedUser.filter((user) => user._id !== userId);
      setSuggestedUser(updatedUsers);
      dispatch(addToSuggestions({ users: updatedUsers, isLoading: false }));
    } catch (error: any) {
      Utils.dispatchNotification(error.response.data.message, 'error', dispatch);
    }
  };
  useEffect(() => {
    setSuggestedUser(users);
  }, [suggestedUser, users]);
  return (
    <div className="suggestions-list-container" data-testid="suggestions-container">
      <div className="suggestions-header">
        <div className="title-text">Suggestions</div>
      </div>
      <hr />
      <div className="suggestions-container">
        <div className="suggestions">
          {suggestedUser.map((user) => (
            <div data-testid="suggestions-item" className="suggestions-item" key={user._id}>
              <Avatar name={user?.username} bgColor={user?.avatarColor} textColor="#ffffff" size={40} avatarSrc={user?.profilePicture} />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button label="Follow" className="button follow" disabled={false} handleClick={() => followUser(user._id)} />
              </div>
            </div>
          ))}
        </div>
        <div className="view-more" onClick={() => navigate('/app/social/people')}>
          View More
        </div>
      </div>
    </div>
  );
};

export default Suggestions;
