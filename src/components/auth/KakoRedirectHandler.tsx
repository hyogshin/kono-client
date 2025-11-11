import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoRedirectHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 백엔드에서 리다이렉트된 후의 처리
    // Spring Security에서는 이미 인증이 완료된 상태이므로
    // 사용자 정보를 요청하여 프론트엔드 상태를 업데이트

    const getUserInfo = async () => {
      try {
        // 사용자 정보 요청 (Spring Security 인증된 상태에서)
        await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users`, {
          withCredentials: true,
        });

        // 로그인 성공 후 메인 페이지로 이동
        navigate('/');
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        navigate('/login'); // 로그인 실패 시 로그인 페이지로 이동
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

// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import api from '../../services/clients';
// const { Kakao } = window;

// const KakaoRedirectHandler = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const params = new URL(document.location.toString()).searchParams;
//     const code = params.get('code');
//     const grantType = 'authorization_code';

//     const kakaoLogin = async () => {
//       try {
//         // Vite 환경변수 사용
//         const response = await axios.post(
//           `${import.meta.env.VITE_API_URL}/api/v1/auth/login`,
//           {
//             code,
//             grant_type: grantType,
//           },
//           {
//             withCredentials: true,
//           },
//         );

//         // 로그인 성공 처리
//         if (response.data.token) {
//           localStorage.setItem('token', response.data.token);
//           navigate('/'); // 메인 페이지로 이동
//         }
//       } catch (error) {
//         console.error('카카오 로그인 실패:', error);
//         navigate('/login'); // 로그인 페이지로 이동
//       }
//     };

//     if (code) {
//       kakaoLogin();
//     }
//   }, [navigate]);

//   return (
//     <div className="flex justify-center items-center h-screen">
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//     </div>
//   );
// };

// export default KakaoRedirectHandler;
