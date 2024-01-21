import React from 'react';
import '@components/feelings/Feelings.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';
import { feelingsList } from '@services/utils/static.data';
import { addPostFeeling, toggleFeelingModal } from '@redux-toolkit/reducers/modal/modal.reducer';
import { IFeelingData } from '@interfaces/index';

const Feelings = () => {
  const { feelingIsOpen } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  const selectFeeling = (feeling: IFeelingData) => {
    dispatch(addPostFeeling({ feeling }));
    dispatch(toggleFeelingModal(!feelingIsOpen));
  };
  return (
    <div className="feelings-container">
      <div className="feelings-container-picker">
        <p>Feelings</p>
        <hr />
        <ul className="feelings-container-picker-list">
          {feelingsList.map((feeling) => (
            <li key={feeling.index} className="feelings-container-picker-list-item" onClick={() => selectFeeling(feeling)}>
              <img src={feeling.image} alt={feeling.name} /> <span>{feeling.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Feelings;
