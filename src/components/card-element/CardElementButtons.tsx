import Button from '@components/button/Button';
import React, { Fragment } from 'react';

interface ICardElementButtons {
  isChecked: boolean;
  btnTextOne: string;
  btnTextTwo: string;
  onClickBtnOne: () => void;
  onClickBtnTwo: () => void;
  onNavigateToProfile: () => void;
}
const CardElementButtons: React.FC<ICardElementButtons> = ({
  isChecked,
  btnTextOne,
  btnTextTwo,
  onClickBtnOne,
  onClickBtnTwo,
  onNavigateToProfile
}) => {
  return (
    <div className="card-element-buttons">
      <Fragment>
        {!isChecked && (
          <Button label={btnTextOne} className="card-element-buttons-btn button" handleClick={onClickBtnOne} disabled={false} />
        )}
        {isChecked && (
          <Button
            label={btnTextTwo}
            className="card-element-buttons-btn button isUserFollowed"
            handleClick={onClickBtnTwo}
            disabled={false}
          />
        )}
      </Fragment>
      <Button label="Profile" className="card-element-buttons-btn button" handleClick={onNavigateToProfile} disabled={false} />
    </div>
  );
};

export default CardElementButtons;
