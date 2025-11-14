import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Clarity from '@microsoft/clarity';
import App from './App';
import './index.css';
import './i18n/config';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import NotFound from './pages/NotFound.tsx';
import Wallet from './pages/Wallet.tsx';
import Discover from './pages/Discover.tsx';
import Favorite from './pages/Favorite.tsx';
import Ranking from './pages/Ranking.tsx';
import Settings from './pages/Settings.tsx';
import CoinDetail from './pages/CoinDetail.tsx';
import Profile from './pages/Profile.tsx';
import Trade from './pages/Trade.tsx';
import Transaction from './pages/Transaction.tsx';
import Login from './pages/Login.tsx';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import KakoRedirectHandler from './components/auth/KakoRedirectHandler.tsx';
import * as Sentry from '@sentry/react';
import { MockAuthProvider } from './contexts/MockAuthProvider.tsx';
const isLocalMode = import.meta.env.VITE_LOCAL_MODE === 'true';

Clarity.init('r1aim0c7qk');
Clarity.consent();

const identifyUser = (userId: string, nickname: string) => {
  Clarity.identify(userId, undefined, undefined, nickname);
};

const setUserTags = (userId: string, userType: string) => {
  Clarity.setTag('userId', userId);
  Clarity.setTag('userType', userType);
  Clarity.setTag('platform', 'web');
};

const trackImportantEvent = (eventName: string) => {
  Clarity.event(eventName);
  Clarity.upgrade(eventName);
};

window.clarityHelpers = {
  identifyUser,
  setUserTags,
  trackImportantEvent,
};

declare global {
  interface Window {
    clarityHelpers: {
      identifyUser: (userId: string, nickname: string) => void;
      setUserTags: (userId: string, userType: string) => void;
      trackImportantEvent: (eventName: string) => void;
    };
  }
}

Sentry.init({
  dsn: 'https://9ba5351ae2788a1039d336aeb4b88082@o4509077698707456.ingest.us.sentry.io/4509077976449024',
  integrations: [Sentry.browserTracingIntegration()],

  tracesSampleRate: 1.0,
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/dev.playkono.com\.io\/api/,
  ],
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'login',
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: 'login/oauth',
        element: <KakoRedirectHandler />,
      },
      {
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Favorite />,
          },
          {
            path: 'wallet',
            element: <Wallet />,
          },
          {
            path: 'discover',
            element: <Discover />,
          },
          {
            path: 'favorites',
            element: <Favorite />,
          },
          {
            path: 'rankings',
            element: <Ranking />,
          },
          {
            path: 'settings',
            element: <Settings />,
          },
          {
            path: 'profile',
            element: <Profile />,
          },
          {
            path: 'users/:nickname',
            element: <Profile />,
          },
          {
            path: 'transactions',
            element: <Transaction />,
          },
          {
            path: 'coins/:ticker/:type',
            element: <Trade />,
          },
          {
            path: 'coins/:ticker',
            element: <CoinDetail />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      {isLocalMode ? (
        <MockAuthProvider>
          <RouterProvider router={router} />
        </MockAuthProvider>
      ) : (
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      )}
    </ThemeProvider>
  </React.StrictMode>,
);
