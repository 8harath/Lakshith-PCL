/**
 * API Service - Real Backend Integration
 */

import axios from 'axios';

// Get API URL from environment or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configure axios defaults
axios.defaults.withCredentials = true; // Important for session cookies

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Unauthorized - clear local storage
      localStorage.removeItem('currentUser');
    }
    return Promise.reject(error);
  }
);

// ==================== Authentication ====================

export const register = async (userData) => {
  const response = await api.post('/register', userData);
  return response;
};

export const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  return response;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response;
};

export const getCurrentUser = async () => {
  const response = await api.get('/me');
  return response;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/profile', profileData);
  return response;
};

// ==================== Marketplace ====================

export const getListings = async (params = {}) => {
  const response = await api.get('/listings', { params });
  return response;
};

export const getListing = async (id) => {
  const response = await api.get(`/listings/${id}`);
  return response;
};

export const createListing = async (listingData) => {
  const response = await api.post('/listings', listingData);
  return response;
};

export const updateListing = async (id, listingData) => {
  const response = await api.put(`/listings/${id}`, listingData);
  return response;
};

export const deleteListing = async (id) => {
  const response = await api.delete(`/listings/${id}`);
  return response;
};

export const getMyListings = async () => {
  const response = await api.get('/my-listings');
  return response;
};

// ==================== Recommendations ====================

export const getCropRecommendations = async (fieldData) => {
  const response = await api.post('/recommend', fieldData);
  return response;
};

// ==================== Disease Prediction ====================

export const predictDisease = async (data) => {
  const response = await api.post('/predict-disease', data);
  return response;
};

export const getCommonSymptoms = async () => {
  const response = await api.get('/common-symptoms');
  return response;
};

export const predictDiseaseFromImage = async (imageData) => {
  const response = await api.post('/predict-disease-image', imageData);
  return response;
};

// ==================== Community Q&A ====================

export const getQAPosts = async () => {
  const response = await api.get('/qa-posts');
  return response;
};

export const getQAPost = async (id) => {
  const response = await api.get(`/qa-posts/${id}`);
  return response;
};

export const createQAPost = async (postData) => {
  const response = await api.post('/qa-posts', postData);
  return response;
};

// ==================== Weather ====================

export const getWeather = async (location) => {
  const response = await api.get('/weather', { params: { location } });
  return response;
};

// ==================== Gemini AI Chat ====================

export const geminiChat = async (data) => {
  const response = await api.post('/gemini-chat', data);
  return response;
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  getCropRecommendations,
  predictDisease,
  getCommonSymptoms,
  predictDiseaseFromImage,
  getQAPosts,
  getQAPost,
  createQAPost,
  getWeather,
  geminiChat
};
