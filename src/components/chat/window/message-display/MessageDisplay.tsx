import React, { useRef, useState } from 'react';
import '@components/chat/window/message-display/MessageDisplay.scss';
import { IMessageData, ISelectedReaction, IUpdateChatReactionBody, IUser } from '@interfaces/index';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import useChatScrollToBottom from '@hooks/useChatScrollToBottom';
import ImageModal from '@components/image-modal/ImageModal';
import Dialog from '@components/dialog/Dialog';
import DateTimeUtil from '@services/utils/date-time.service';
import RightMessageDisplay from './right-message-display/RightMessageDisplay';
import LeftMessageDisplay from './left-message/LeftMessageDisplay';

interface IMessageDisplay {
  chatMessages: IMessageData[];
  profile: IUser;
  updateMessageReaction: (body: IUpdateChatReactionBody) => void;
  deleteChatMessage: (senderId: string, receiverId: string, messageId: string, type: string) => void;
}
const MessageDisplay: React.FC<IMessageDisplay> = ({ chatMessages, profile, updateMessageReaction, deleteChatMessage }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showReactionIcon, setShowReactionIcon] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; message: IMessageData | null; type: string }>({
    open: false,
    message: null,
    type: ''
  });
  const [activeElementIndex, setActiveElementIndex] = useState<number | null>(null);
  const [selectedReaction, setSelectedReaction] = useState<ISelectedReaction | null>(null);
  const reactionRef = useRef(null);
  const [toggleReaction, setToggleReaction] = useDetectOutsideClick({ ref: reactionRef, initialState: false });
  const scrollRef = useChatScrollToBottom(chatMessages);

  const showReactionIconOnHover = (show: boolean, index: number) => {
    if (index === activeElementIndex || !activeElementIndex) {
      setShowReactionIcon(show);
    }
  };
  const handleReactionClick = (body: IUpdateChatReactionBody) => {
    updateMessageReaction(body);
    setSelectedReaction(null);
  };
  const deleteMessage = (message: IMessageData, type: string) => {
    setDeleteDialog({ open: true, message, type });
  };
  return (
    <>
      {showImageModal && <ImageModal image={`${imageUrl}`} onCancel={() => !showImageModal} showArrow={false} />}
      {selectedReaction && (
        <Dialog
          title="Do you want to remove your reaction ?"
          firstButtonText="Remove"
          secondButtonText="Cancel"
          firstBtnHandler={() => handleReactionClick(selectedReaction)}
          secondBtnHandler={() => setSelectedReaction(null)}
        />
      )}
      {deleteDialog.message && deleteDialog.open && (
        <Dialog
          title="Delete message?"
          firstButtonText={`${deleteDialog.type === 'deleteForMe' ? 'DELETE FOR ME' : 'DELETE FOR EVERYONE'}`}
          secondButtonText="CANCEL"
          firstBtnHandler={() => {
            const { message, type } = deleteDialog;
            deleteChatMessage(message!.senderId, message!.receiverId, message?._id!, type);
            setDeleteDialog({ open: false, message: null, type: '' });
          }}
          secondBtnHandler={() => {
            setDeleteDialog({ open: false, message: null, type: '' });
          }}
        />
      )}
      <div className="message-page" ref={scrollRef}>
        {chatMessages.map((chat, index) => (
          <div className="message-chat" key={chat._id}>
            {index === 0 ||
              (DateTimeUtil.dayMonthYear(chat.createdAt) !== DateTimeUtil.dayMonthYear(chatMessages[index - 1].createdAt) && (
                <div className="message-data-group">
                  <div className="message-chat-date">{DateTimeUtil.chatMessageTransform(chat.createdAt)}</div>
                </div>
              ))}
            {chat.receiverUsername === profile.username ||
              (chat.senderUsername === profile.username && (
                <>
                  {chat.senderUsername === profile.username && (
                    <RightMessageDisplay
                      chat={chat}
                      lastChatMessage={chatMessages[chatMessages.length - 1]}
                      profile={profile}
                      toggleReaction={toggleReaction}
                      showReactionIcon={showReactionIcon}
                      index={index}
                      activeElementIndex={activeElementIndex!}
                      reactionRef={reactionRef}
                      setToggleReaction={setToggleReaction}
                      handleReactionClick={handleReactionClick}
                      deleteMessage={deleteMessage}
                      showReactionIconOnHover={showReactionIconOnHover}
                      setActiveElementIndex={setActiveElementIndex}
                      setShowImageModal={setShowImageModal}
                      setImageUrl={setImageUrl}
                      showImageModal={showImageModal}
                      setSelectedReaction={setSelectedReaction}
                    />
                  )}
                  {chat.receiverUsername.toLowerCase() === profile.username && (
                    <LeftMessageDisplay
                      chat={chat}
                      profile={profile}
                      toggleReaction={toggleReaction}
                      showReactionIcon={showReactionIcon}
                      index={index}
                      activeElementIndex={activeElementIndex!}
                      reactionRef={reactionRef}
                      setToggleReaction={setToggleReaction}
                      handleReactionClick={handleReactionClick}
                      deleteMessage={deleteMessage}
                      showReactionIconOnHover={showReactionIconOnHover}
                      setActiveElementIndex={setActiveElementIndex}
                      setShowImageModal={setShowImageModal}
                      setImageUrl={setImageUrl}
                      showImageModal={showImageModal}
                      setSelectedReaction={setSelectedReaction}
                    />
                  )}
                </>
              ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default MessageDisplay;
