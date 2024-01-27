import React, { useCallback, useEffect, useRef, useState } from 'react';
import '@components/toast/Toast.scss';
import { Utils } from '@services/utils/utils.service';
import { IToast, IToastData } from '@interfaces/index';
import { useDispatch } from 'react-redux';

const Toast: React.FC<IToast> = (prop) => {
  const { toastList, position, autoDelete, autoDeleteTime = 2000 } = prop;
  const [list, setList] = useState<IToastData[]>(toastList);
  const listData = useRef([]);
  const dispatch = useDispatch();

  const deleteToast = useCallback(() => {
    listData.current = JSON.parse(JSON.stringify(list));
    listData.current.splice(0, 1);
    setList([...listData.current]);
    if (!listData.current.length) {
      list.length = 0;
      Utils.dispatchClearNotification(dispatch);
    }
  }, [list, dispatch]);

  useEffect(() => {
    setList([...toastList]);
  }, [toastList]);
  useEffect(() => {
    const tick = () => {
      deleteToast();
    };
    if (autoDelete && toastList.length && list.length) {
      const interval = setInterval(tick, autoDeleteTime);
      return () => clearInterval(interval);
    }
  }, [toastList, autoDelete, autoDeleteTime, list, deleteToast]);
  return (
    <div className={`toast-notification-container ${position}`}>
      {list.map((toast, index) => (
        <div className={`toast-notification toast ${position}`} style={{ backgroundColor: toast.backgroundColor }} key={index}>
          <button className="cancel-button" onClick={() => deleteToast()}>
            X
          </button>
          <div className={`toast-notification-image ${toast.description.length <= 73 ? 'toast-icon' : ''}`}>
            <img src={toast.icon} alt="" />
          </div>
          <div className={`toast-notification-message ${toast.description.length <= 73 ? 'toast-message' : ''}`}>{toast.description}</div>
        </div>
      ))}
    </div>
  );
};

export default Toast;
