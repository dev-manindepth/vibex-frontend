import React from 'react';
import '@components/spinner/Spinner.scss';

interface ISpinner {
  bgColor?: string;
}
const Spinner: React.FC<ISpinner> = ({ bgColor }) => {
  return (
    <div className="spinner">
      <div className="bounce1" style={{ backgroundColor: `${bgColor || '#50b5ff'}` }}></div>
      <div className="bounce2" style={{ backgroundColor: `${bgColor || '#50b5ff'}` }}></div>
      <div className="bounce3" style={{ backgroundColor: `${bgColor || '#50b5ff'}` }}></div>
    </div>
  );
};

export default Spinner;
