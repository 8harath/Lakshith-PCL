/**
 * Mock Data Service - Frontend Only
 * Provides sample data for demo without backend
 */

// Sample Users
export const mockUsers = [
  {
    id: 1,
    username: 'farmer',
    password: 'farmer123',
    role: 'farmer',
    display_name: 'Rajesh Kumar',
    location: 'Punjab, India',
    contact_info: '+91-9876543210'
  },
  {
    id: 2,
    username: 'client',
    password: 'client123',
    role: 'client',
    display_name: 'Anil Mehta',
    location: 'Delhi, India',
    contact_info: '+91-9876543211'
  },
  {
    id: 3,
    username: 'priya_farms',
    password: 'farmer123',
    role: 'farmer',
    display_name: 'Priya Sharma',
    location: 'Maharashtra, India',
    contact_info: '+91-9876543212'
  }
];

// Sample Crop Listings
export const mockListings = [
  {
    id: 1,
    farmer_id: 1,
    crop_name: 'Rice',
    variety: 'Basmati',
    quality: 'Premium',
    price: 50,
    quantity: 1000,
    unit: 'kg',
    location: 'Punjab, India',
    harvest_date: '2025-12-01',
    description: 'High-quality Basmati rice, organically grown',
    created_at: '2025-10-15',
    farmer: mockUsers[0]
  },
  {
    id: 2,
    farmer_id: 1,
    crop_name: 'Wheat',
    variety: 'Lokwan',
    quality: 'Grade A',
    price: 30,
    quantity: 2000,
    unit: 'kg',
    location: 'Punjab, India',
    harvest_date: '2025-11-20',
    description: 'Fresh harvest wheat, excellent for flour',
    created_at: '2025-10-18',
    farmer: mockUsers[0]
  },
  {
    id: 3,
    farmer_id: 3,
    crop_name: 'Cotton',
    variety: 'BT Cotton',
    quality: 'Premium',
    price: 45,
    quantity: 500,
    unit: 'kg',
    location: 'Maharashtra, India',
    harvest_date: '2025-12-10',
    description: 'High-yield BT cotton, pest-resistant',
    created_at: '2025-10-20',
    farmer: mockUsers[2]
  },
  {
    id: 4,
    farmer_id: 3,
    crop_name: 'Tomato',
    variety: 'Hybrid',
    quality: 'Fresh',
    price: 25,
    quantity: 800,
    unit: 'kg',
    location: 'Maharashtra, India',
    harvest_date: '2025-11-15',
    description: 'Fresh tomatoes, perfect for market',
    created_at: '2025-10-22',
    farmer: mockUsers[2]
  },
  {
    id: 5,
    farmer_id: 1,
    crop_name: 'Sugarcane',
    variety: 'Co 86032',
    quality: 'Grade A',
    price: 20,
    quantity: 5000,
    unit: 'kg',
    location: 'Punjab, India',
    harvest_date: '2025-12-25',
    description: 'High-sugar content sugarcane',
    created_at: '2025-10-25',
    farmer: mockUsers[0]
  }
];

// Sample Community Posts
export const mockPosts = [
  {
    id: 1,
    author_id: 1,
    author: mockUsers[0],
    title: 'Best practices for organic farming?',
    body: 'I am looking to transition to organic farming. What are the best practices and certifications needed?',
    tags: 'organic, certification, farming',
    created_at: '2025-10-10'
  },
  {
    id: 2,
    author_id: 2,
    author: mockUsers[1],
    title: 'Where to find quality wheat suppliers?',
    body: 'Looking for reliable wheat suppliers in North India. Any recommendations?',
    tags: 'wheat, suppliers, buying',
    created_at: '2025-10-12'
  },
  {
    id: 3,
    author_id: 3,
    author: mockUsers[2],
    title: 'How to control aphids naturally?',
    body: 'My cotton crop has aphid infestation. What are some natural pest control methods?',
    tags: 'pests, cotton, organic',
    created_at: '2025-10-14'
  }
];

// Disease symptoms database
export const mockDiseases = [
  {
    name: 'Leaf Rust',
    confidence: 0.85,
    symptoms: ['yellowing', 'spots', 'rust-colored'],
    management: {
      cultural: 'Remove infected leaves, improve air circulation',
      chemical: 'Apply fungicide (Mancozeb or Chlorothalonil)',
      organic: 'Neem oil spray, copper-based fungicides'
    }
  },
  {
    name: 'Powdery Mildew',
    confidence: 0.78,
    symptoms: ['white', 'powder', 'leaves'],
    management: {
      cultural: 'Reduce humidity, prune infected parts',
      chemical: 'Sulfur-based fungicides',
      organic: 'Baking soda solution, milk spray'
    }
  },
  {
    name: 'Bacterial Blight',
    confidence: 0.72,
    symptoms: ['wilting', 'brown', 'spots'],
    management: {
      cultural: 'Remove infected plants, crop rotation',
      chemical: 'Copper-based bactericides',
      organic: 'Garlic extract, bio-fungicides'
    }
  }
];

// Crop recommendations database
export const cropDatabase = [
  {
    name: 'Rice',
    suitability: {
      soil: ['loamy', 'clay'],
      ph_range: [5.5, 7.0],
      temp_range: [20, 35],
      rainfall_range: [1000, 2000],
      season: 'monsoon'
    }
  },
  {
    name: 'Wheat',
    suitability: {
      soil: ['loamy', 'clay-loam'],
      ph_range: [6.0, 7.5],
      temp_range: [15, 25],
      rainfall_range: [400, 800],
      season: 'winter'
    }
  },
  {
    name: 'Cotton',
    suitability: {
      soil: ['black', 'loamy'],
      ph_range: [6.5, 8.0],
      temp_range: [21, 30],
      rainfall_range: [500, 1000],
      season: 'summer'
    }
  },
  {
    name: 'Sugarcane',
    suitability: {
      soil: ['loamy', 'clay-loam'],
      ph_range: [6.0, 7.5],
      temp_range: [20, 30],
      rainfall_range: [750, 1500],
      season: 'all'
    }
  },
  {
    name: 'Pulses',
    suitability: {
      soil: ['loamy', 'sandy-loam'],
      ph_range: [6.0, 7.0],
      temp_range: [20, 30],
      rainfall_range: [400, 700],
      season: 'winter'
    }
  }
];

// Initialize localStorage with mock data if not present
export const initializeMockData = () => {
  if (!localStorage.getItem('mockListings')) {
    localStorage.setItem('mockListings', JSON.stringify(mockListings));
  }
  if (!localStorage.getItem('mockPosts')) {
    localStorage.setItem('mockPosts', JSON.stringify(mockPosts));
  }
};

// Get all listings from localStorage
export const getListings = () => {
  const listings = localStorage.getItem('mockListings');
  return listings ? JSON.parse(listings) : mockListings;
};

// Get listing by ID
export const getListingById = (id) => {
  const listings = getListings();
  return listings.find(listing => listing.id === parseInt(id));
};

// Add new listing
export const addListing = (listing) => {
  const listings = getListings();
  const newListing = {
    ...listing,
    id: listings.length > 0 ? Math.max(...listings.map(l => l.id)) + 1 : 1,
    created_at: new Date().toISOString()
  };
  listings.push(newListing);
  localStorage.setItem('mockListings', JSON.stringify(listings));
  return newListing;
};

// Update listing
export const updateListing = (id, updates) => {
  const listings = getListings();
  const index = listings.findIndex(l => l.id === parseInt(id));
  if (index !== -1) {
    listings[index] = { ...listings[index], ...updates };
    localStorage.setItem('mockListings', JSON.stringify(listings));
    return listings[index];
  }
  return null;
};

// Delete listing
export const deleteListing = (id) => {
  const listings = getListings();
  const filtered = listings.filter(l => l.id !== parseInt(id));
  localStorage.setItem('mockListings', JSON.stringify(filtered));
  return true;
};

// Get all community posts
export const getPosts = () => {
  const posts = localStorage.getItem('mockPosts');
  return posts ? JSON.parse(posts) : mockPosts;
};

// Add new post
export const addPost = (post, user) => {
  const posts = getPosts();
  const newPost = {
    ...post,
    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
    author_id: user.id,
    author: user,
    created_at: new Date().toISOString()
  };
  posts.push(newPost);
  localStorage.setItem('mockPosts', JSON.stringify(posts));
  return newPost;
};

// Authenticate user
export const authenticateUser = (username, password) => {
  const user = mockUsers.find(
    u => u.username === username && u.password === password
  );
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

// Get crop recommendations
export const getRecommendations = (fieldData) => {
  const { soil_type, ph, temperature, rainfall, season } = fieldData;

  const recommendations = cropDatabase.map(crop => {
    let score = 0;
    let reasons = [];

    // Soil check
    if (crop.suitability.soil.includes(soil_type.toLowerCase())) {
      score += 30;
      reasons.push(`Soil type (${soil_type}) is ideal`);
    } else {
      reasons.push(`Soil type not optimal`);
    }

    // pH check
    if (ph >= crop.suitability.ph_range[0] && ph <= crop.suitability.ph_range[1]) {
      score += 20;
      reasons.push(`pH level (${ph}) is perfect`);
    } else {
      reasons.push(`pH needs adjustment`);
    }

    // Temperature check
    if (temperature >= crop.suitability.temp_range[0] && temperature <= crop.suitability.temp_range[1]) {
      score += 25;
      reasons.push(`Temperature (${temperature}°C) is suitable`);
    } else {
      reasons.push(`Temperature not ideal`);
    }

    // Rainfall check
    if (rainfall >= crop.suitability.rainfall_range[0] && rainfall <= crop.suitability.rainfall_range[1]) {
      score += 25;
      reasons.push(`Rainfall (${rainfall}mm) is adequate`);
    } else {
      reasons.push(`Rainfall may need supplementation`);
    }

    return {
      crop: crop.name,
      score,
      reasons,
      suitability: score >= 70 ? 'Highly Suitable' : score >= 50 ? 'Moderately Suitable' : 'Less Suitable'
    };
  });

  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

// Predict disease from symptoms
export const predictDisease = (symptoms) => {
  const symptomText = symptoms.toLowerCase();

  return mockDiseases.filter(disease => {
    const matchCount = disease.symptoms.filter(s =>
      symptomText.includes(s)
    ).length;
    return matchCount > 0;
  }).map(disease => ({
    ...disease,
    confidence: (Math.random() * 0.2 + 0.7).toFixed(2) // Random confidence between 0.7-0.9
  }));
};
