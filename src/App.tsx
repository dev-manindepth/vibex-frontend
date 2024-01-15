import './App.scss';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './routes/routes';
import { useEffect } from 'react';
import { socketService } from '@services/socket/socket.service';
import Toast from '@components/toast/Toast';
import { IToastData } from '@root/interfaces/index';
import { useSelector } from 'react-redux';
import { RootState } from '@redux-toolkit/store';

function App() {
  const notifications: IToastData[] = useSelector((state: RootState) => state.notifications);
  useEffect(() => {
    socketService.setupSocketConnection();
  }, []);

  return (
    <>
      {notifications && notifications.length > 0 && <Toast position="top-right" toastList={notifications} autoDelete={false} />}
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </>
  );
}

export default App;
