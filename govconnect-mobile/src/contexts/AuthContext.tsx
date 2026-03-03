import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getToken, removeToken, fetchMe } from '../api/client';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await getToken();
      if (token) {
        const userData = await fetchMe();
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await removeToken();
    } finally {
      setIsLoading(false);
    }
  }

  async function login(token: string, userData: User) {
    setUser(userData);
  }

  async function logout() {
    await removeToken();
    setUser(null);
  }

  async function refreshUser() {
    try {
      const userData = await fetchMe();
      setUser(userData);
    } catch (error) {
      console.error('Refresh user failed:', error);
      await logout();
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user ? true : false,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
