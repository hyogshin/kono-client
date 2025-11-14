import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import KakaoLoginButton from '../assets/images/kakao_login_medium_wide.png';
import konoLogo from '../assets/images/kono_logo.svg';
import { useAuth } from '../contexts/AuthContext';
import { LOG } from '../config/constants';

declare global {
  interface Window {
    Kakao: any;
  }
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [isKakaoInitialized, setIsKakaoInitialized] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLoginPageHistory = () => {
      if (location.pathname === '/login') {
        if (!loading && isAuthenticated) {
          navigate('/', { replace: true });
        }
      }
    };
    handleLoginPageHistory();
  }, [isAuthenticated, loading, navigate, location]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasCode = params.has('code');

    if (hasCode) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
      navigate(redirectTo, { replace: true });
      localStorage.removeItem('redirectAfterLogin');
    }
  }, [navigate]);

  useEffect(() => {
    const loadKakaoSDK = () => {
      const script = document.createElement('script');
      script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
      script.async = true;
      script.onload = () => {
        window.Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
        setIsKakaoInitialized(true);
      };
      document.body.appendChild(script);
    };

    if (!window.Kakao) {
      loadKakaoSDK();
    } else if (!window.Kakao.isInitialized()) {
      window.Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
      setIsKakaoInitialized(true);
    } else {
      setIsKakaoInitialized(true);
    }

    return () => {
      const script = document.querySelector(
        'script[src="https://developers.kakao.com/sdk/js/kakao.js"]',
      );
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleKakaoLogin = () => {
    if (!isKakaoInitialized) {
      console.error(LOG.ERR.KAKAO.SDK_NOT_INITIALIZED);
      return;
    }

    try {
      const prevPath = location.state?.from || '/';
      localStorage.setItem('redirectAfterLogin', prevPath);
      window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/kakao`;
    } catch (error) {
      console.error(LOG.ERR.KAKAO.INITIATE, error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        {t('common.loading')}
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-4">
      <div className="flex-1 flex items-end justify-center w-full mb-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center justify-center">
            <img
              src={konoLogo}
              alt={t('auth.konoLogo')}
              className="w-3/4 mx-auto"
            />
            <p
              className="text-center text-sm text-gray-500 mt-2"
              dangerouslySetInnerHTML={{ __html: t('auth.welcomeMessage') }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className="flex-1 flex items-start justify-center w-full mt-8">
        <div className="w-full max-w-md">
          <img
            src={KakaoLoginButton}
            alt={t('auth.kakaoLogin')}
            className={`mx-auto cursor-pointer transition-opacity ${
              isKakaoInitialized
                ? 'hover:opacity-90'
                : 'opacity-50 cursor-not-allowed'
            }`}
            onClick={isKakaoInitialized ? handleKakaoLogin : undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
