import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication
export const register = (userData) => api.post('/register', userData);
export const login = (credentials) => api.post('/login', credentials);
export const logout = () => api.post('/logout');
export const getCurrentUser = () => api.get('/me');
export const updateProfile = (profileData) => api.put('/profile', profileData);

// Marketplace
export const getListings = (params) => api.get('/listings', { params });
export const getListing = (id) => api.get(`/listings/${id}`);
export const createListing = (listingData) => api.post('/listings', listingData);
export const updateListing = (id, listingData) => api.put(`/listings/${id}`, listingData);
export const deleteListing = (id) => api.delete(`/listings/${id}`);
export const getMyListings = () => api.get('/my-listings');

// Recommendations
export const getCropRecommendations = (fieldData) => api.post('/recommend', fieldData);

// Disease Prediction
export const predictDisease = (symptoms) => api.post('/predict-disease', { symptoms });
export const getCommonSymptoms = () => api.get('/common-symptoms');

// Q&A
export const getQAPosts = () => api.get('/qa-posts');
export const getQAPost = (id) => api.get(`/qa-posts/${id}`);
export const createQAPost = (postData) => api.post('/qa-posts', postData);

// Weather
export const getWeather = (location) => api.get('/weather', { params: { location } });

// Gemini
export const geminiChat = (prompt) => api.post('/gemini-chat', { prompt });

export default api;
