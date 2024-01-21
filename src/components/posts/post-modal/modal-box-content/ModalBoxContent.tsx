import Avatar from '@components/avatar/Avatar';
import SelectDropdown from '@components/select-dropdown/SelectDropdown';
import useDetectOutsideClick from '@hooks/useDetectOutsideClick';
import { RootState } from '@redux-toolkit/store';
import { privacyList } from '@services/utils/static.data';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaGlobe } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import '@components/posts/post-modal/modal-box-content/ModalBoxContent.scss';
import { IPrivacy } from '@interfaces/index';
const ModalBoxContent = () => {
  const { profile } = useSelector((state: RootState) => state.user);
  const privacyRef = useRef(null);
  const { privacy } = useSelector((state: RootState) => state.post);
  const { feeling } = useSelector((state: RootState) => state.modal);
  const [selectedItem, setSelectedItem] = useState<IPrivacy>({
    topText: 'Public',
    subText: 'Anyone on vibeX',
    icon: <FaGlobe className="globe-icon globe" />
  });
  const [togglePrivacy, setTogglePrivacy] = useDetectOutsideClick({ ref: privacyRef, initialState: false });
  const displayPostPrivacy = useCallback(() => {
    if (privacy) {
      const postPrivacy = privacyList.find((data) => data.topText === privacy) as IPrivacy;
      setSelectedItem(postPrivacy);
    }
  }, [privacy]);
  useEffect(() => {
    displayPostPrivacy();
  }, [displayPostPrivacy]);
  return (
    <div className="modal-box-content" data-testid="modal-box-content">
      <div className="user-post-image" data-testid="box-avatar">
        <Avatar name={profile?.username} bgColor={profile?.avatarColor} textColor="#ffffff" size={40} avatarSrc={profile?.profilePicture} />
      </div>
      <div className="modal-box-info">
        <h5 className="inline-title-display" data-testid="box-username">
          Manish
        </h5>
        {feeling && feeling.name && (
          <p className="inline-display" data-testid="box-feeling">
            is feeling <img className="feeling-icon" src={`${feeling?.image}`} alt="" /> <span>{feeling?.name}</span>
          </p>
        )}

        <div data-testid="box-text-display" className="time-text-display" onClick={() => setTogglePrivacy(!togglePrivacy)}>
          <div className="selected-item-text" data-testid="box-item-text">
            {selectedItem.topText}
          </div>
          <div ref={privacyRef}>
            <SelectDropdown isActive={togglePrivacy} items={privacyList} setSelectedItem={setSelectedItem} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalBoxContent;
