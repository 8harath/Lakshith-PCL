/**
 * API Service - Now using Mock Data (Frontend Only)
 * All functions return Promises to maintain compatibility with existing components
 */

import {
  getListings as getMockListings,
  getListingById,
  addListing,
  updateListing as updateMockListing,
  deleteListing as deleteMockListing,
  getPosts,
  addPost,
  getRecommendations,
  predictDisease as predictMockDisease,
  mockDiseases
} from './mockData';

// Simulate API delay for realistic experience
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication (handled by AuthContext)
export const register = async (userData) => {
  await delay();
  return { data: { message: 'Registration successful', user: userData } };
};

export const login = async (credentials) => {
  await delay();
  return { data: { message: 'Login successful' } };
};

export const logout = async () => {
  await delay();
  return { data: { message: 'Logout successful' } };
};

export const getCurrentUser = async () => {
  await delay();
  const user = localStorage.getItem('currentUser');
  if (user) {
    return { data: { user: JSON.parse(user) } };
  }
  throw new Error('Not authenticated');
};

export const updateProfile = async (profileData) => {
  await delay();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const updatedUser = { ...currentUser, ...profileData };
  localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  return { data: { user: updatedUser, message: 'Profile updated successfully' } };
};

// Marketplace
export const getListings = async (params = {}) => {
  await delay();
  let listings = getMockListings();

  // Apply filters
  if (params.search) {
    const search = params.search.toLowerCase();
    listings = listings.filter(l =>
      l.crop_name.toLowerCase().includes(search) ||
      l.variety.toLowerCase().includes(search)
    );
  }

  if (params.location) {
    listings = listings.filter(l =>
      l.location.toLowerCase().includes(params.location.toLowerCase())
    );
  }

  if (params.min_price) {
    listings = listings.filter(l => l.price >= parseFloat(params.min_price));
  }

  if (params.max_price) {
    listings = listings.filter(l => l.price <= parseFloat(params.max_price));
  }

  return { data: { listings } };
};

export const getListing = async (id) => {
  await delay();
  const listing = getListingById(id);
  if (listing) {
    return { data: { listing } };
  }
  throw new Error('Listing not found');
};

export const createListing = async (listingData) => {
  await delay();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const newListing = addListing({
    ...listingData,
    farmer_id: currentUser.id,
    farmer: currentUser
  });
  return { data: { listing: newListing, message: 'Listing created successfully' } };
};

export const updateListing = async (id, listingData) => {
  await delay();
  const updated = updateMockListing(id, listingData);
  if (updated) {
    return { data: { listing: updated, message: 'Listing updated successfully' } };
  }
  throw new Error('Listing not found');
};

export const deleteListing = async (id) => {
  await delay();
  deleteMockListing(id);
  return { data: { message: 'Listing deleted successfully' } };
};

export const getMyListings = async () => {
  await delay();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const allListings = getMockListings();
  const myListings = allListings.filter(l => l.farmer_id === currentUser.id);
  return { data: { listings: myListings } };
};

// Recommendations
export const getCropRecommendations = async (fieldData) => {
  await delay(800); // Slightly longer delay for "processing"
  const recommendations = getRecommendations(fieldData);
  return {
    data: {
      recommendations,
      message: 'Recommendations generated successfully'
    }
  };
};

// Disease Prediction
export const predictDisease = async ({ symptoms }) => {
  await delay(800);
  const predictions = predictMockDisease(symptoms);

  if (predictions.length === 0) {
    return {
      data: {
        predictions: [{
          name: 'No Match Found',
          confidence: 0,
          management: {
            cultural: 'Please provide more specific symptoms or consult an agricultural expert',
            chemical: 'N/A',
            organic: 'N/A'
          }
        }],
        message: 'No diseases matched the symptoms'
      }
    };
  }

  return {
    data: {
      predictions,
      message: 'Disease prediction completed'
    }
  };
};

export const getCommonSymptoms = async () => {
  await delay(200);
  return {
    data: {
      symptoms: [
        'yellowing', 'wilting', 'spots', 'rust-colored', 'white powder',
        'brown patches', 'curling leaves', 'stunted growth', 'root rot',
        'stem damage', 'fruit damage', 'leaf drop'
      ]
    }
  };
};

export const predictDiseaseFromImage = async (imageData) => {
  await delay(1500); // Longer delay for "AI processing"
  // Mock AI response
  return {
    data: {
      disease: 'Leaf Spot Disease',
      confidence: 0.87,
      description: 'AI analysis detected signs of leaf spot disease. This is a common fungal infection.',
      treatment: 'Remove affected leaves, apply fungicide, ensure proper spacing for air circulation.',
      prevention: 'Avoid overhead watering, maintain good air circulation, use disease-resistant varieties.',
      additional_info: 'This disease is most common during humid conditions. Monitor closely and treat early.',
      message: 'Image analysis completed successfully'
    }
  };
};

// Q&A
export const getQAPosts = async () => {
  await delay();
  const posts = getPosts();
  return { data: { posts } };
};

export const getQAPost = async (id) => {
  await delay();
  const posts = getPosts();
  const post = posts.find(p => p.id === parseInt(id));
  if (post) {
    return { data: { post } };
  }
  throw new Error('Post not found');
};

export const createQAPost = async (postData) => {
  await delay();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const newPost = addPost(postData, currentUser);
  return { data: { post: newPost, message: 'Post created successfully' } };
};

// Weather (mock implementation)
export const getWeather = async (location) => {
  await delay(1000);
  // Mock weather data
  return {
    data: {
      location: location,
      current: {
        temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
        humidity: Math.floor(Math.random() * 30) + 60, // 60-90%
        conditions: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        wind_speed: Math.floor(Math.random() * 20) + 5 // 5-25 km/h
      },
      forecast: [
        { day: 'Tomorrow', temp_high: 32, temp_low: 22, conditions: 'Sunny' },
        { day: 'Day 2', temp_high: 30, temp_low: 21, conditions: 'Partly Cloudy' },
        { day: 'Day 3', temp_high: 28, temp_low: 20, conditions: 'Cloudy' }
      ]
    }
  };
};

// Gemini AI Chat (mock implementation)
export const geminiChat = async ({ prompt }) => {
  await delay(1200); // Longer delay for "AI thinking"

  // Simple mock responses based on keywords
  const lowerPrompt = prompt.toLowerCase();

  let response = '';

  if (lowerPrompt.includes('wheat') || lowerPrompt.includes('crop')) {
    response = 'For wheat cultivation, ensure soil pH between 6.0-7.5, with adequate phosphorus and nitrogen. Plant during winter season for best results. Maintain proper spacing and irrigation.';
  } else if (lowerPrompt.includes('pest') || lowerPrompt.includes('insect')) {
    response = 'For pest control, use integrated pest management (IPM). Start with neem oil or organic pesticides. Monitor regularly and use chemical pesticides only when necessary. Maintain field hygiene.';
  } else if (lowerPrompt.includes('fertilizer') || lowerPrompt.includes('soil')) {
    response = 'Soil health is crucial. Conduct soil testing first. Use organic compost, green manure, and balanced NPK fertilizers. Rotate crops to maintain soil fertility. Add micronutrients if deficient.';
  } else if (lowerPrompt.includes('water') || lowerPrompt.includes('irrigation')) {
    response = 'Efficient water management is key. Use drip irrigation when possible. Water early morning or evening. Monitor soil moisture. Mulch to retain moisture. Avoid overwatering to prevent root diseases.';
  } else {
    response = 'Thank you for your question! For specific agricultural advice, please consult with local agricultural experts or extension officers who can assess your field conditions directly. General best practices include regular monitoring, proper irrigation, balanced fertilization, and integrated pest management.';
  }

  return {
    data: {
      response,
      message: 'AI response generated'
    }
  };
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
