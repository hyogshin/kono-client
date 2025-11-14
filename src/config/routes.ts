export const ROUTES = {
  HOME: '/',
  NOT_FOUND: '/404',

  AUTH: {
    LOGIN: '/login',
    SIGNUP: '/signup',
  },

  USER: {
    PROFILE: (nickname: string) => `/users/${nickname}`,
  },

  COIN: {
    TRADE: (ticker: string, type: string) => `/coins/${ticker}/${type}`,
    DETAIL: (ticker: string) => `/coins/${ticker}`,
  },

  WALLET: '/wallet',
  TRANSACTION: '/transactions',
  DISCOVER: '/discover',
  FAVORITE: '/favorites',
  RANKING: '/rankings',
  SETTINGS: '/settings',
};

// Nav items use i18n keys - labels should be translated in components
export const NAV_ITEMS = [
  { labelKey: 'pages.wallet', path: ROUTES.WALLET },
  { labelKey: 'pages.discover', path: ROUTES.DISCOVER },
  { labelKey: 'pages.favorites', path: ROUTES.FAVORITE },
  { labelKey: 'pages.rankings', path: ROUTES.RANKING },
  { labelKey: 'pages.settings', path: ROUTES.SETTINGS },
];
