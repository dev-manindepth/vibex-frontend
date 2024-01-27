import React from 'react';
import '@components/posts/reactions/Reactions.scss';
import { reactionsMap } from '@services/utils/static.data';

interface IReactions {
  handleClick: (reaction: string) => void;
  showLabel?: boolean;
}
const Reactions: React.FC<IReactions> = ({ handleClick, showLabel = true }) => {
  const reactionList = ['like', 'love', 'wow', 'happy', 'sad', 'angry'];
  return (
    <div className="reactions" id="reactions">
      <ul>
        {reactionList.map((reaction, index) => (
          <li key={index} onClick={() => handleClick(reaction)}>
            {showLabel && <label>{reaction}</label>}
            <img src={`${reactionsMap[reaction]}`} alt="" />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reactions;
