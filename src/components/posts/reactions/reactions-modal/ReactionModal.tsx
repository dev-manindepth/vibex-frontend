import React, { useState } from 'react';
import '@components/posts/reactions/reactions-modal/ReactionModal.scss';
import ReactionWrapper from '@components/posts/modal-wrapper/reaction-wrapper/ReactionWrapper';
import ReactionList from './reaction-list/ReactionList';
import { IFormattedReaction, IReactionData } from '@interfaces/index';
import { reactionsColor, reactionsMap } from '@services/utils/static.data';
import { Utils } from '@services/utils/utils.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import { postService } from '@services/api/post/post.service';
import useEffectOnce from '@hooks/useEffectOnce';
import { closeModal } from '@redux-toolkit/reducers/modal/modal.reducer';
import { clearPost } from '@redux-toolkit/reducers/post/post.reducer';

const ReactionModal = () => {
  const { _id, reactions } = useSelector((state: RootState) => state.post);
  const dispatch = useDispatch();
  const [activeViewAllTab, setActiveViewAllTab] = useState(true);
  const [formattedReactions, setFormattedReaction] = useState<IFormattedReaction[]>([]);
  const [reactionType, setReactionType] = useState('');
  const [reactionColor, setReactionColor] = useState('');
  const [postReaction, setPostReaction] = useState<IReactionData[]>();
  const [reactionsOfPost, setReactionsOfPost] = useState<IReactionData[]>();

  function orderBy(property: string, order: 'asc' | 'desc') {
    return function (a: any, b: any) {
      const aValue = a[property];
      const bValue = b[property];

      if (order === 'desc') {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      } else {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      }

      return 0;
    };
  }
  const getPostReactions = async () => {
    try {
      const response = await postService.getPostReactions(_id);
      const orderedPosts = response.data.reactions.sort(orderBy('createdAt', 'desc'));
      setPostReaction(orderedPosts);
      setReactionsOfPost(orderedPosts);
    } catch (err: any) {
      Utils.dispatchNotification(err.response.data.message, 'error', dispatch);
    }
  };

  const closeReactionModal = () => {
    dispatch(closeModal());
    dispatch(clearPost());
  };
  const viewAll = () => {
    setActiveViewAllTab(true);
    setReactionType('');
    setPostReaction(reactionsOfPost);
  };

  const reactionList = (type: string) => {
    setActiveViewAllTab(false);
    setReactionType(type);
    const exists = reactionsOfPost?.some((reaction) => reaction.type === type);
    const filteredReaction = exists ? reactionsOfPost?.filter((reaction) => reaction.type === type) : [];
    setPostReaction(filteredReaction);
    setReactionColor(reactionsColor[type]);
  };
  useEffectOnce(() => {
    getPostReactions();
    setFormattedReaction(Utils.formattedReactions(reactions));
  });

  return (
    <>
      <ReactionWrapper closeModal={closeReactionModal}>
        <div className="modal-reactions-header-tabs">
          <ul className="modal-reactions-header-tabs-list">
            <li className={`${activeViewAllTab ? 'activeViewAllTab' : 'all'}`} onClick={viewAll}>
              All
            </li>
            {formattedReactions.map((reaction, index) => (
              <li
                key={index}
                className={`${reaction.type === reactionType ? 'activeTab' : ''}`}
                style={{ color: `${reaction.type === reactionType ? reactionColor : ''}` }}
                onClick={() => reactionList(reaction.type)}
              >
                <img src={`${reactionsMap[reaction.type]}`} alt="" />
                <span>{Utils.shortenLargeNumbers(reaction.value)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="modal-reactions-list">{postReaction && <ReactionList postReactions={postReaction} />}</div>
      </ReactionWrapper>
    </>
  );
};

export default ReactionModal;
