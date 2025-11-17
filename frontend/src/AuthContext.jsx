import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

// Demo user for MVP showcase
const DEMO_USER = {
  id: 'demo',
  username: 'demo_user',
  role: 'farmer',
  display_name: 'Demo User',
  location: 'Demo Location',
  contact_info: 'Contact via platform'
};

export const AuthProvider = ({ children }) => {
  // In demo mode, user is always logged in as demo user
  const [user] = useState(DEMO_USER);
  const [loading] = useState(false);

  const value = {
    user,
    loading,
    isAuthenticated: true, // Always authenticated in demo mode
    isFarmer: true, // Demo user is a farmer
    isClient: false,
    // These functions are kept for compatibility but don't do anything
    login: async () => ({ data: { user: DEMO_USER } }),
    register: async () => ({ data: { user: DEMO_USER } }),
    logout: async () => {}
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
