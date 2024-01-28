import { Utils } from '@services/utils/utils.service';
import React from 'react';

interface ICardElementStats {
  postsCount?: number;
  followersCount?: number;
  followingCount?: number;
}
const CardElementStats: React.FC<ICardElementStats> = ({ postsCount, followersCount, followingCount }) => {
  return (
    <div className="card-element-stats">
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title">Posts</p>
        <h5 className="card-element-stats-group-info">{postsCount && Utils.shortenLargeNumbers(postsCount)}</h5>
      </div>
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title">Followers</p>
        <h5 className="card-element-stats-group-info">{followersCount && Utils.shortenLargeNumbers(followersCount)}</h5>
      </div>
      <div className="card-element-stats-group">
        <p className="card-element-stats-group-title">Following</p>
        <h5 className="card-element-stats-group-info">{followingCount && Utils.shortenLargeNumbers(followingCount)}</h5>
      </div>
    </div>
  );
};

export default CardElementStats;
