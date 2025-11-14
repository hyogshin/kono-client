export const API_ENDPOINTS = {
  LOGIN: '/api/v1/auth/login',
  SIGNUP: '/api/v1/auth/signup',
  LOGOUT: '/api/v1/auth/logout',
  WITHDRAW: '/api/v1/users/withdraw',

  KAKAO_LOGIN: '/oauth2/authorization/kakao',
  AUTH_KAKAO_CALLBACK: '/api/v1/auth/kakao/callback',

  GET_USER: '/api/v1/users',
  // POST_PROFILE_IMAGE: '/api/vi1/users/profile',
  POST_PROFILE_IMAGE: '/api/v1/s3/presigned-url',
  PUT_PROFILE_IMAGE: '/api/v1/users/profile-image',
  PUT_NICKNAME: '/api/v1/users/nickname',
  DELETE_USER: '/api/v1/users',

  GET_FAVORITE: '/api/v1/users/favorites',
  GET_IS_FAVORITE: (ticker: string) => `/api/v1/users/favorites/${ticker}`,
  POST_FAVORITE: (ticker: string) => `/api/v1/users/favorites/${ticker}`,
  DELETE_FAVORITE: (ticker: string) => `/api/v1/users/favorites/${ticker}`,
  GET_COINS: '/api/v1/coins',
  GET_COIN_DETAIL: (ticker: string) => `/api/v1/coins/${ticker}`,
  POST_ORDER: '/api/v1/coins/orders',

  GET_CASH: '/api/v1/wallets/cash',
  GET_BALANCE: '/api/v1/users/balance',
  GET_HOLDING_COIN: '/api/v1/wallets/coins',
  GET_IS_HOLDING_COIN: (ticker: string) => `/api/v1/wallets/coins/${ticker}`,
  GET_TRANSACTION: '/api/v1/wallets/transactions',

  GET_RANK_DAILY: '/api/v1/rankings/daily',
  GET_RANK_DAILY_ME: '/api/v1/rankings/daily/me',
  GET_RANK_ALL: '/api/v1/rankings',
  GET_RANK_ALL_ME: '/api/v1/rankings/me',

  GET_WS_URL: import.meta.env.VITE_WS_URL,
};
