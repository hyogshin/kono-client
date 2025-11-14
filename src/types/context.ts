import { User } from './user';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (accessToken?: string, refreshToken?: string) => Promise<void> | void;
  logout: () => void;
  withdraw?: () => void;
  deleteAccount?: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser?: (userData: Partial<User>) => void;
}

export type ThemeContextType = {
  isDarkMode?: boolean;
  darkMode?: boolean;
  toggleDarkMode: () => void;
};
