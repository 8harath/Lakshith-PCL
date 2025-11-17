import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Marketplace from './pages/Marketplace';
import ListingDetail from './pages/ListingDetail';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';
import Recommendations from './pages/Recommendations';
import DiseasePredictor from './pages/DiseasePredictor';
import Community from './pages/Community';
import CreatePost from './pages/CreatePost';
import Chatbot from './pages/Chatbot';
import FarmerDashboard from './pages/FarmerDashboard';
import ClientDashboard from './pages/ClientDashboard';

// Dashboard Router - redirects to appropriate dashboard based on role
const DashboardRouter = () => {
  const { isAuthenticated, isFarmer, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Home />;
  }

  // Redirect to role-specific dashboard
  return isFarmer ? <FarmerDashboard /> : <ClientDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<DashboardRouter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/listings/:id" element={<ListingDetail />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/disease-predictor" element={<DiseasePredictor />} />
            <Route path="/community" element={<Community />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
