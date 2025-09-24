'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: useEffect triggered');
    checkAuth();
  }, []);

  const checkAuth = async () => {
    console.log('AuthProvider: checkAuth started');
    try {
      // Check if we're in the browser
      if (typeof window === 'undefined') {
        console.log('AuthProvider: Not in browser, setting loading false');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('admin_token');
      console.log('AuthProvider: Token from localStorage:', token ? 'exists' : 'not found');
      
      if (!token) {
        console.log('AuthProvider: No token, setting loading false');
        setLoading(false);
        return;
      }

      console.log('AuthProvider: Making profile request');
      const response = await authApi.getProfile();
      console.log('AuthProvider: Profile response:', response.data);
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Auth check error:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
      }
    } finally {
      console.log('AuthProvider: Setting loading false');
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }): Promise<boolean> => {
    try {
      console.log('AuthContext: Attempting login with:', credentials.email);
      const response = await authApi.login(credentials);
      console.log('AuthContext: Login response:', response.data);
      
      const { token, user: userData } = response.data.data;

      localStorage.setItem('admin_token', token);
      setUser(userData);
      
      toast.success('Logged in successfully!');
      return true;
    } catch (error: unknown) {
      console.error('AuthContext: Login error:', error);
      const errorMessage = (error as { response?: { data?: { error?: string } } }).response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('admin_token');
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
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