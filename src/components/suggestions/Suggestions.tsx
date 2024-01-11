import Avatar from '@components/avatar/Avatar';
import Button from '@components/button/Button';
import React, { useEffect, useState } from 'react';

import '@components/suggestions/Suggestions.scss';
import { useSelector } from 'react-redux';
import { IUser } from '@interfaces/index';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@redux-toolkit/store';

const Suggestions = () => {
  const { isLoading, users } = useSelector((state: RootState) => state.suggestions);
  const [suggestedUser, setSuggestedUser] = useState<IUser[]>([]);
  const navigate = useNavigate();

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
          {suggestedUser.map((user, index) => (
            <div data-testid="suggestions-item" className="suggestions-item" key={index}>
              <Avatar name={user?.username} bgColor={user?.avatarColor} textColor="#ffffff" size={40} avatarSrc={user?.profilePicture} />
              <div className="title-text">{user?.username}</div>
              <div className="add-icon">
                <Button label="Follow" className="button follow" disabled={false} />
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
