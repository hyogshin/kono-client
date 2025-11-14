import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios from 'axios';
import api from '../services/clients';
import { API_ENDPOINTS } from '../config/apiEndpoints';
import { LOG } from '../config/constants';
import type { User, AuthContextType } from '../types';

axios.defaults.withCredentials = true;

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const loadUserInfo = async (isInitialLoad = true) => {
    try {
      setLoading(true);

      const res = await api.get(API_ENDPOINTS.GET_USER);

      if (res.data) {
        const userData = {
          id: res.data.id,
          nickname: res.data.nickname,
          profileImageUrl: res.data.profileImageUrl,
          cashBalance: res.data.cashBalance,
        };
        setUser(userData);
      } else {
        setUser(null);
      }
      setError(null);
    } catch (error) {
      console.error(LOG.ERR.USER.GET_INFO, error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(
            LOG.ERR.AUTH.RESPONSE,
            error.response.status,
            error.response.data,
          );

          if (error.response.status === 401 || error.response.status === 403) {
            setUser(null);
          }
        } else if (error.request) {
          console.error(LOG.ERR.AUTH.NETWORK, error.request);
        } else {
          console.error(LOG.ERR.AUTH.REQUEST, error.message);
        }

        if (error.code === 'ERR_NETWORK' && isInitialLoad && !isRetrying) {
          setIsRetrying(true);
          setTimeout(() => {
            loadUserInfo(false);
            setIsRetrying(false);
          }, 3000);
        }
      }

      setError('Failed to load user info');
      if (!isRetrying) {
        setLoading(false);
      }
    } finally {
      if (!isRetrying) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const isLoginPage = window.location.pathname === '/login';

    const params = new URLSearchParams(window.location.search);
    const hasAuthCode = params.has('code');

    if (isLoginPage && !hasAuthCode) {
      setLoading(false);
      return;
    }

    if (hasAuthCode) {
      const cleanUrl = window.location.pathname;

      setTimeout(() => {
        loadUserInfo(false).then(() => {
          const redirectTo = localStorage.getItem('redirectAfterLogin') || '/';
          window.location.replace(redirectTo);
          localStorage.removeItem('redirectAfterLogin');
        });
      }, 2000);
      window.history.replaceState({}, document.title, cleanUrl);
    } else {
      loadUserInfo();
    }

    if (hasAuthCode) {
      const currentUrl = window.location.href;
      const baseUrl = currentUrl.split('?')[0];
      const cleanUrl = baseUrl;

      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, []);

  const login = () => {
    const kakaoLoginPath = '/oauth2/authorization/kakao';
    window.location.href = kakaoLoginPath;
  };

  const logout = async () => {
    try {
      setUser(null);

      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error(LOG.ERR.USER.LOGOUT, error);
    } finally {
      window.location.href = '/login';
    }
  };

  const withdraw = async () => {
    try {
      await api.delete(API_ENDPOINTS.WITHDRAW);

      setUser(null);

      window.location.href = '/login';
    } catch (error) {
      console.error(LOG.ERR.USER.WITHDRAW, error);
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        withdraw,
        isAuthenticated: !!user,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
