import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.playcono.com',
  withCredentials: true, // 세션 쿠키를 주고받기 위해 필요
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
