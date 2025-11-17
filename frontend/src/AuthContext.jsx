import React, { createContext, useState, useContext, useEffect } from 'react';
import * as api from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to get current user from backend
      const response = await api.getCurrentUser();
      setUser(response.data.user);
      // Also save to localStorage for persistence
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    } catch (error) {
      // Not authenticated or session expired
      setUser(null);
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await api.login(credentials);
    setUser(response.data.user);
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    return response;
  };

  const register = async (userData) => {
    const response = await api.register(userData);
    setUser(response.data.user);
    localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    return response;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isFarmer: user?.role === 'farmer',
    isClient: user?.role === 'client' || user?.role === 'pharma'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
