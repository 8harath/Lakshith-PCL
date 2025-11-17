import React, { createContext, useState, useContext, useEffect } from 'react';
import { authenticateUser, initializeMockData, mockUsers } from './mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();

    // Check if user is logged in
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    return new Promise((resolve, reject) => {
      const { username, password } = credentials;
      const authenticatedUser = authenticateUser(username, password);

      if (authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
        resolve({ data: { user: authenticatedUser, message: 'Login successful' } });
      } else {
        reject({ response: { data: { error: 'Invalid credentials' } } });
      }
    });
  };

  const register = async (userData) => {
    return new Promise((resolve, reject) => {
      const { username, password, role, display_name, location, contact_info } = userData;

      // Check if username already exists
      const existingUser = mockUsers.find(u => u.username === username);
      if (existingUser) {
        reject({ response: { data: { error: 'Username already exists' } } });
        return;
      }

      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        username,
        role: role || 'client',
        display_name: display_name || username,
        location: location || '',
        contact_info: contact_info || ''
      };

      // Add to mock users array (in-memory only for this session)
      mockUsers.push({ ...newUser, password });

      // Set as current user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));

      resolve({ data: { user: userWithoutPassword, message: 'Registration successful' } });
    });
  };

  const logout = async () => {
    return new Promise((resolve) => {
      setUser(null);
      localStorage.removeItem('currentUser');
      resolve();
    });
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
