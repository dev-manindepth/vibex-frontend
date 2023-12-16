import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
import Vibe from '@pages/social/Vibe';
import { useRoutes } from 'react-router-dom';

export const AppRouter = () => {
  const routes = useRoutes([
    {
      path: '/',
      element: <AuthTabs />
    },

    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/app/social/vibe',
      element: <Vibe />
    }
  ]);
  return routes;
};
