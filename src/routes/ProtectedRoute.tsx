import useEffectOnce from '@hooks/useEffectOnce';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { IUser } from '@interfaces/index';
import { getConversationList } from '@redux-toolkit/api/chat';
import { addUser } from '@redux-toolkit/reducers/user/user.reducer';
import { RootState } from '@redux-toolkit/store';
import { userService } from '@services/api/user/user.service';
import { Utils } from '@services/utils/utils.service';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, token } = useSelector((state: RootState) => state.user);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [tokenIsValid, setTokenIsValid] = useState(false);
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const pageReload = useSessionStorage('pageReload', 'get');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [deleteStorageUsername] = useLocalStorage('username', 'remove');
  const [deleteSessionPageReload] = useSessionStorage('pageReload', 'remove');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkUser = useCallback(async () => {
    try {
      const response = await userService.checkCurrentUser();
      setUserData(response.data.user);
      dispatch(getConversationList() as any);
      setTokenIsValid(true);
      dispatch(addUser({ token: response.data.token, profile: response.data.user }));
    } catch (err) {
      setTokenIsValid(false);
      setTimeout(async () => {
        Utils.clearStore({ dispatch, deleteStorageUsername, deleteSessionPageReload, setLoggedIn });
        await userService.logoutUser();
        navigate('/');
      }, 1000);
    }
  }, [dispatch, navigate, deleteStorageUsername, deleteSessionPageReload, setLoggedIn]);

  useEffectOnce(() => {
    checkUser();
  });
  if (keepLoggedIn || (!keepLoggedIn && userData) || (profile && token) || pageReload) {
    if (!tokenIsValid) {
      return <></>;
    } else {
      return <>{children}</>;
    }
  } else {
    return <>{<Navigate to="/" />}</>;
  }
};

export default ProtectedRoute;
