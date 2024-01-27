import React from 'react';
import '@components/posts/reactions/reactions-modal/reaction-list/ReactionList.scss';
import { IReactionData } from '@interfaces/index';
import { Utils } from '@services/utils/utils.service';
import Avatar from '@components/avatar/Avatar';
import { reactionsMap } from '@services/utils/static.data';

interface IReactionList {
  postReactions: IReactionData[];
}
const ReactionList: React.FC<IReactionList> = ({ postReactions }) => {
  return (
    <div className="modal-reactions-container">
      {postReactions.map((postReaction) => (
        <div className="modal-reactions-container-list" key={Utils.generateString(10)}>
          <div className="img">
            <Avatar
              name={postReaction.username}
              bgColor={postReaction.avatarColor}
              textColor="#ffffff"
              size={50}
              avatarSrc={postReaction.profilePicture}
            />
            <img src={`${reactionsMap[postReaction.type]}`} alt="" className="reaction-icon" />
          </div>
          <span>{postReaction.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ReactionList;
