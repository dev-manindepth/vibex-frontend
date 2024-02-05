import React from 'react';
import Picker from 'emoji-picker-react';

interface IEmojiPicker {
  onEmojiClick: (emojiData: any, event: any) => void;
  pickerStyle: any;
}
const EmojiPicker: React.FC<IEmojiPicker> = ({ onEmojiClick, pickerStyle }) => {
  return (
    <div className="emoji-picker" data-testid="emoji-container">
      <Picker onEmojiClick={onEmojiClick} />
    </div>
  );
};

export default EmojiPicker;
