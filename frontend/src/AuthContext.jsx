import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from './api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await getCurrentUser();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await apiLogin(credentials);
    setUser(response.data.user);
    return response;
  };

  const register = async (userData) => {
    const response = await apiRegister(userData);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
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
