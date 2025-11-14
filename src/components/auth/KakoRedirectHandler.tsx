import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/apiEndpoints';
import { LOG } from '../../config/constants';

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        await axios.get(
          `${import.meta.env.VITE_API_URL}${API_ENDPOINTS.GET_USER}`,
          {
            withCredentials: true,
          },
        );

        navigate('/');
      } catch (error) {
        console.error(LOG.ERR.USER.GET_INFO, error);
        navigate('/login');
      }
    };

    getUserInfo();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default KakaoRedirectHandler;
