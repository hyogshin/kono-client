import React from 'react';
import { AuthContext } from './AuthContext'; // 🔥 reuse the same context

// Provide fake user + functions so the app can render without backend
export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mockValue = {
    user: {
      id: 1,
      nickname: 'LocalUser',
      profileImageUrl: 'https://placehold.co/100x100',
      cashBalance: 999999,
    },
    loading: false,
    error: null,
    login: () => console.log('[mock] login'),
    logout: () => console.log('[mock] logout'),
    withdraw: () => console.log('[mock] withdraw'),
    isAuthenticated: true,
    updateUser: () => {},
  };

  return (
    <AuthContext.Provider value={mockValue}>{children}</AuthContext.Provider>
  );
};
