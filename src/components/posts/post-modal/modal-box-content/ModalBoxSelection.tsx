import Input from '@components/input/Input';
import React, { useRef } from 'react';
import photo from '@assets/images/photo.png';
import gif from '@assets/images/gif.png';
import feeling from '@assets/images/feeling.png';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import Feelings from '@components/feelings/Feelings';
import { ImageUtils } from '@services/utils/image-utils.service';
import { toggleGifModal } from '@redux-toolkit/reducers/modal/modal.reducer';

interface IModalBoxSelection {
  setSelectedPostImage: (file: File) => void;
}
const ModalBoxSelection: React.FC<IModalBoxSelection> = ({ setSelectedPostImage }) => {
  const { feelingIsOpen, gifModalIsOpen } = useSelector((state: RootState) => state.modal);
  const { post } = useSelector((state: RootState) => state.post);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const feelingRef = useRef(null);
  const [toggleFeelings, setToggleFeelings] = useDetectOutsideClick({ ref: feelingRef, initialState: feelingIsOpen });
  const dispatch = useDispatch();

  const fileInputSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ImageUtils.addFileToReduxStore(event, post, setSelectedPostImage, dispatch);
  };
  return (
    <>
      {toggleFeelings && (
        <div ref={feelingRef}>
          <Feelings />
        </div>
      )}
      <div className="modal-box-selection" data-testid="modal-box-selection">
        <ul className="post-form-list" data-testid="list-item">
          <li className="post-form-list-item image-select" onClick={fileInputSelector}>
            <Input
              name="image"
              ref={fileInputRef}
              type="file"
              className="file-input"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              handleChange={(e) => handleFileChange(e)}
            />
            <img src={photo} alt="" /> Photo
          </li>
          <li className="post-form-list-item" onClick={() => dispatch(toggleGifModal(!gifModalIsOpen))}>
            <img src={gif} alt="" /> Gif
          </li>
          <li className="post-form-list-item" onClick={() => setToggleFeelings(!toggleFeelings)}>
            <img src={feeling} alt="" /> Feeling
          </li>
        </ul>
      </div>
    </>
  );
};

export default ModalBoxSelection;
