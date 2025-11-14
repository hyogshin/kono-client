export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://dev.playkono.com/api';
export const API_TIMEOUT = 30000;

export const TOKEN_KEY = 'kono_access_token';
export const REFRESH_TOKEN_KEY = 'kono_refresh_token';
export const TOKEN_EXPIRY = 'kono_token_expiry';

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_NUMBER = 1;

export const THEME_KEY = 'kono_theme';
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const TRADE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELED: 'canceled',
};

export const LOG = {
  ERR: {
    AUTH: {
      REQUEST: 'Request setup error occurred.',
      NETWORK: 'Network error occurred. No response from server.',
      RESPONSE: 'Server response error occurred.',
    },
    KAKAO: {
      INITIATE: 'Failed to initiate Kakao login',
      SDK_NOT_INITIALIZED: 'Kakao SDK not initialized yet.',
    },
    USER: {
      GET_INFO: 'Failed to load user information.',
      GET_PROFILE: 'Failed to load user profile information.',
      LOGOUT: 'Failed to logout.',
      WITHDRAW: 'Failed to withdraw.',
      DELETE: 'Failed to delete account.',
      UPDATE_PROFILE_IMAGE: 'Failed to update user profile image.',
      UPDATE_NICKNAME: 'Failed to update user nickname.',
    },
    COINS: {
      GET_INFO: 'Failed to fetch coin details.',
      GET_LIST: 'Failed to fetch coin list.',
      GET_NAME: 'Failed to fetch coin name.',
      INVALID_DATA_FORMAT: 'Coin data format is invalid.',
      FETCH_DATA: 'Failed to fetch coin data.',
    },
    FAVORITES: {
      TOGGLE: 'Failed to toggle favorite coin.',
      GET_LIST: 'Failed to retrieve favorite coins.',
      INITIALIZE: 'Failed to initialize favorites.',
      GET_STATUS: 'Failed to fetch favorite status.',
      ADD: 'Failed to add favorite coin.',
      REMOVE: 'Failed to remove favorite coin.',
    },
    WALLETS: {
      GET_HOLDING_COIN: 'Failed to fetch holding coins.',
      GET_DATA: 'Failed to fetch wallet data.',
      GET_TRANSACTIONS: 'Failed to fetch transactions.',
      GET_BALANCE: 'Failed to fetch balance.',
    },
    TRANSACTIONS: {
      TRANSACTION: 'Transaction failed. Please try again.',
      GET_HISTORY: 'Failed to retrieve transaction history.',
      GET_HISTORY_BY_TYPE: 'Failed to retrieve transaction history by type.',
      MARKET_BUY: 'Market buy order failed.',
      MARKET_SELL: 'Market sell order failed.',
    },
    RANKINGS: {
      GET_INFO: 'Failed to get ranking lists.',
      GET_DAILY: 'Failed to get daily ranks.',
      GET_USER_DAILY: 'Failed to get user daily rank.',
      GET_ALL: 'Failed to get ranks.',
      GET_USER_ALL: 'Failed to get user ranks.',
    },
    GENERAL: {
      DEFAULT: 'An error occurred. Please try again.',
      INTERNAL_SERVER: 'Internal server error.',
      TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
      JSON_PARSE: 'Failed to parse incoming message as JSON.',
      FORMAT_DATE: 'Failed to format date.',
      INVALID_DATE: 'Invalid date.',
      TICKER_MISSING: 'Ticker information is missing.',
      INVALID_TRADE_TYPE: 'Invalid trade type.',
      WEBSOCKET_CONNECTION: 'WebSocket connection error occurred.',
    },
  },
} as const;

export const UI = {
  OK: {
    AUTH: {
      SIGNUP: 'Welcome to KONO! Let the trading begin!',
      LOGIN: 'Welcome back, trader!',
      LOGOUT: 'See you later! Happy trading!',
    },
    USER: {
      GET_INFO: 'Got your info! Looking good!',
      UPDATE_PROFILE: 'Profile updated! You look amazing!',
      UPDATE_NICKNAME: 'Nickname changed! Fresh new you!',
      UPDATE_PROFILE_IMAGE: 'New profile pic is fire!',
      DELETE_ACCOUNT: "Account deleted. We'll miss you!",
    },
    COINS: {
      LIST: 'Coins loaded! Time to explore!',
      DETAILS: 'Coin details ready!',
    },
    FAVORITES: {
      ADD: 'Added to favorites! Smart choice!',
      REMOVE: 'Removed from favorites!',
    },
    WALLETS: {
      CASH: 'Cash balance loaded!',
      COINS: 'Your crypto stash is ready!',
    },
    TRANSACTIONS: {
      HISTORY: 'Transaction history loaded!',
      ORDER_COMPLETE_BUY: 'Buy order completed!',
      ORDER_COMPLETE_SELL: 'Sell order completed!',
    },
    RANKINGS: {
      DAILY: 'Daily leaderboard loaded!',
      TOTAL: 'All-time rankings loaded!',
    },
  },
  ERR: {
    AUTH: {
      UNAUTHORIZED: 'Oops! Authentication failed. Please login again.',
    },
    USER: {
      LOGOUT: 'Logout failed. Try again?',
      WITHDRAW: 'Account deletion failed. Please try again.',
      WITHDRAW_UNAUTHORIZED: 'Please login first!',
      WITHDRAW_FORBIDDEN: "You don't have permission to do that.",
      UPDATE_PROFILE_IMAGE: 'Image upload failed. Try another one?',
      UPDATE_PROFILE_IMAGE_INVALID:
        'Please upload an image file (JPG, PNG, etc.)',
      UPDATE_NICKNAME_REQUIRED: "Nickname can't be empty!",
      UPDATE_NICKNAME: 'Nickname update failed. Try again?',
    },
    COINS: {
      FETCH: 'Failed to load coin data. Refresh?',
    },
    FAVORITES: {
      TOGGLE: 'Oops! Favorite toggle failed.',
    },
    TRANSACTIONS: {
      TRANSACTION: 'Transaction failed. Please try again!',
    },
  },
} as const;
