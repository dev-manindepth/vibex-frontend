import Reactions from '@components/posts/reactions/Reactions';
import React from 'react';
import RightMessageBubble from './RightMessageBubble';
import { reactionsMap } from '@services/utils/static.data';
import DateTimeUtil from '@services/utils/date-time.service';
import { IMessageData, ISelectedReaction, IUpdateChatReactionBody, IUser } from '@interfaces/index';
import doubleCheckmark from '@assets/images/double-checkmark.png';

interface IRightMessageDisplay {
  chat: IMessageData;
  lastChatMessage: IMessageData;
  profile: IUser;
  toggleReaction: boolean;
  showReactionIcon: boolean;
  index: number;
  activeElementIndex: number;
  reactionRef: any;
  setToggleReaction: (body: any) => void;
  handleReactionClick: (data: IUpdateChatReactionBody) => void;
  deleteMessage: (data: IMessageData, type: string) => void;
  showReactionIconOnHover: (show: boolean, index: number) => void;
  setActiveElementIndex: (index: number) => void;
  setSelectedReaction: (selectedReaction: ISelectedReaction) => void;
  setShowImageModal: (showImageModal: boolean) => void;
  setImageUrl: (imageUrl: string) => void;
  showImageModal: boolean;
}
const RightMessageDisplay: React.FC<IRightMessageDisplay> = ({
  chat,
  lastChatMessage,
  profile,
  toggleReaction,
  showReactionIcon,
  index,
  activeElementIndex,
  reactionRef,
  setToggleReaction,
  handleReactionClick,
  deleteMessage,
  showReactionIconOnHover,
  setActiveElementIndex,
  setSelectedReaction,
  setShowImageModal,
  setImageUrl,
  showImageModal
}) => {
  return (
    <div className="message right-message" data-testid="right-message">
      <div className="message-right-reactions-container">
        {toggleReaction && index === activeElementIndex && !chat?.deleteForEveryone && (
          <div ref={reactionRef}>
            <Reactions
              showLabel={false}
              handleClick={(event) => {
                const body = {
                  conversationId: chat?.conversationId,
                  messageId: chat?._id,
                  reaction: event,
                  type: 'add'
                };
                handleReactionClick(body);
                setToggleReaction(false);
              }}
            />
          </div>
        )}
      </div>
      <div className="message-right-content-container-wrapper">
        <div
          data-testid="message-content"
          className="message-content"
          onClick={() => {
            if (!chat.deleteForEveryone) {
              deleteMessage(chat, 'deleteForEveryone');
            }
          }}
          onMouseEnter={() => {
            if (!chat.deleteForEveryone) {
              showReactionIconOnHover(true, index);
              setActiveElementIndex(index);
            }
          }}
        >
          {chat?.deleteForEveryone && chat?.deleteForMe && (
            <div className="message-bubble right-message-bubble">
              <span className="message-deleted">message deleted</span>
            </div>
          )}
          {!chat?.deleteForEveryone && chat?.deleteForMe && chat?.senderUsername === profile?.username && (
            <div className="message-bubble right-message-bubble">
              <span className="message-deleted">message deleted</span>
            </div>
          )}
          {!chat?.deleteForEveryone && !chat?.deleteForMe && (
            <RightMessageBubble
              chat={chat}
              showImageModal={showImageModal}
              setImageUrl={setImageUrl}
              setShowImageModal={setShowImageModal}
            />
          )}
          {!chat?.deleteForEveryone && chat?.deleteForMe && chat.senderUsername === profile?.username && (
            <RightMessageBubble
              chat={chat}
              showImageModal={showImageModal}
              setImageUrl={setImageUrl}
              setShowImageModal={setShowImageModal}
            />
          )}
        </div>
        {showReactionIcon && index === activeElementIndex && !chat.deleteForEveryone && (
          <div className="message-content-emoji-right-container" onClick={() => setToggleReaction(true)}>
            &#9786;
          </div>
        )}
      </div>
      <div className="message-content-bottom">
        {chat?.reaction && chat?.reaction.length > 0 && !chat.deleteForEveryone && (
          <div className="message-reaction">
            {chat?.reaction.map((data, index) => (
              <img
                key={index}
                data-testid="reaction-img"
                src={reactionsMap[data?.type]}
                alt=""
                onClick={() => {
                  if (data?.senderName === profile?.username) {
                    const body = {
                      conversationId: chat?.conversationId,
                      messageId: chat?._id,
                      reaction: data?.type,
                      type: 'remove'
                    };
                    setSelectedReaction(body);
                  }
                }}
              />
            ))}
          </div>
        )}
        <div className="message-time">
          {chat?.senderUsername === profile?.username && !chat?.deleteForEveryone && (
            <>
              {lastChatMessage?.isRead ? (
                <img src={doubleCheckmark} alt="" className="message-read-icon" />
              ) : (
                <>{chat?.isRead && <img src={doubleCheckmark} alt="" className="message-read-icon" />}</>
              )}
            </>
          )}
          <span data-testid="chat-time">{DateTimeUtil.timeFormat(chat?.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default RightMessageDisplay;
