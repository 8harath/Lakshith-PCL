import axios from 'axios';

// Use /api for Vercel serverless functions
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Marketplace - Read-only in MVP
export const getListings = (params) => api.get('/listings', { params });
export const getListing = (id) => api.get(`/listings/${id}`);

// Recommendations
export const getCropRecommendations = (fieldData) => api.post('/recommend', fieldData);

// Disease Prediction
export const predictDisease = (symptoms) => api.post('/predict-disease', { symptoms });
export const getCommonSymptoms = () => api.get('/predict-disease');

// Weather
export const getWeather = (location) => api.get('/weather', { params: { location } });

// Removed for MVP (not functional without database):
// - Authentication endpoints
// - Create/Update/Delete listings
// - Q&A Community
// - Gemini Chat

export default api;
