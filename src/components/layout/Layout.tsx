import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const isLoginPage = location.pathname === '/login';
    const isSignupPage = location.pathname === '/signup';
    const isAuthPage = isLoginPage || isSignupPage;

    if (loading) {
      return;
    }

    if (redirecting) {
      return;
    }

    if (!isAuthenticated && !isAuthPage) {
      setRedirecting(true);
      setTimeout(() => {
        navigate('/login');
        setRedirecting(false);
      }, 100);
    }
  }, [isAuthenticated, loading, navigate, location.pathname, redirecting]);

  if (loading) {
    return (
      <div className="flex flex-col max-w-[430px] w-full mx-auto relative overflow-y-auto bg-white dark:bg-gray-900 text-mainText dark:text-white justify-center items-center">
        <div className="text-center">
          <p className="mb-2">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const params = new URLSearchParams(window.location.search);
  const hasAuthCode = params.has('code');
  if (hasAuthCode) {
    return (
      <div className="flex flex-col min-h-screen max-w-[430px] w-full mx-auto relative overflow-y-auto bg-white dark:bg-gray-900 text-mainText dark:text-white justify-center items-center">
        <div className="text-center">
          <p className="mb-2">{t('auth.loggingIn')}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && location.pathname !== '/login') {
    return (
      <div className="flex flex-col min-h-screen max-w-[430px] w-full mx-auto relative overflow-y-auto bg-white dark:bg-gray-900 text-mainText dark:text-white justify-center items-center">
        <div className="text-center">
          <p className="mb-2">{t('auth.loginRequired')}</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('auth.goToLogin')}
          </button>
        </div>
      </div>
    );
  }

  const customHeaderRoutes = ['/coins/'];
  const hasCustomHeader = customHeaderRoutes.some((route) =>
    location.pathname.startsWith(route),
  );

  return (
    <div className="flex flex-col w-full h-full max-w-[430px] mx-auto bg-white dark:bg-gray-900 text-mainText dark:text-white">
      {!hasCustomHeader && <Header />}
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;
