import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';

import Vibes from '@pages/social/vibes/Vibes';
import { useRoutes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Suspense, lazy } from 'react';
import VibesSkeleton from '@pages/social/vibes/VibesSkeleton';
import Error from '@pages/error/Error';
import NotificationsSkeleton from '@pages/social/notifications/NotificationsSkeleton';
import CardSkeleton from '@components/card-element/CardSkeleton';
import PhotoSkeleton from '@pages/social/photos/PhotoSkeleton';

const Social = lazy(() => import('@pages/social/Social'));
const Chat = lazy(() => import('@pages/social/chat/Chat'));
const Followers = lazy(() => import('@pages/social/followers/Followers'));
const Following = lazy(() => import('@pages/social/following/Following'));
const Notifications = lazy(() => import('@pages/social/notifications/Notifications'));
const People = lazy(() => import('@pages/social/people/People'));
const Photos = lazy(() => import('@pages/social/photos/Photos'));
const Profile = lazy(() => import('@pages/social/profile/Profile'));
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
      path: '/app/social',
      element: (
        <ProtectedRoute>
          <Social />
        </ProtectedRoute>
      ),
      children: [
        {
          path: 'vibes',
          element: (
            <Suspense fallback={<VibesSkeleton />}>
              <Vibes />
            </Suspense>
          )
        },
        {
          path: 'chat/messages',
          element: (
            <Suspense>
              <Chat />
            </Suspense>
          )
        },
        {
          path: 'people',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <People />
            </Suspense>
          )
        },
        {
          path: 'followers',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Followers />
            </Suspense>
          )
        },
        {
          path: 'following',
          element: (
            <Suspense fallback={<CardSkeleton />}>
              <Following />
            </Suspense>
          )
        },
        {
          path: 'photos',
          element: (
            <Suspense fallback={<PhotoSkeleton />}>
              <Photos />
            </Suspense>
          )
        },
        {
          path: 'notifications',
          element: (
            <Suspense fallback={<NotificationsSkeleton />}>
              <Notifications />
            </Suspense>
          )
        },
        {
          path: 'profile/:username',
          element: (
            <Suspense>
              <Profile />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '*',
      element: <Error />
    }
  ]);
  return routes;
};
