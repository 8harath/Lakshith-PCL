import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getListings, getWeather } from '../api';

const ClientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load recent listings
      const listingsRes = await getListings();
      setListings(listingsRes.data.listings.slice(0, 6)); // Show only 6

      // Load weather for user's location
      if (user.location) {
        try {
          const weatherRes = await getWeather(user.location);
          setWeather(weatherRes.data);
        } catch (err) {
          console.error('Weather fetch failed:', err);
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px' }}>
            Welcome, {user.display_name || user.username}
          </h1>
          <p style={{ color: '#6e6e73', fontSize: '1.125rem' }}>
            Find the best crops and connect with farmers
          </p>
        </div>

        {/* Search Bar */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e5e7',
          borderRadius: '18px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '20px' }}>
            🔍 Search Marketplace
          </h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for crops, varieties, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              style={{ flex: 1, fontSize: '1rem' }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSearch}
              style={{ padding: '12px 32px' }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <StatCard
            title="Available Crops"
            value={listings.length}
            subtitle="Fresh listings"
            color="#1d7a4f"
          />
          <StatCard
            title="Active Farmers"
            value="100+"
            subtitle="Verified sellers"
            color="#3b82f6"
          />
          <StatCard
            title="Saved Items"
            value="--"
            subtitle="Coming soon"
            color="#f59e0b"
          />
          <StatCard
            title="Orders"
            value="--"
            subtitle="Coming soon"
            color="#10b981"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Latest Listings */}
            <DashboardCard title="Latest Crop Listings" icon="🌾">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {listings.map(listing => (
                  <CropCard key={listing.id} listing={listing} />
                ))}
              </div>
              <Link to="/marketplace" style={{
                display: 'block',
                textAlign: 'center',
                padding: '12px',
                color: '#1d7a4f',
                fontWeight: 500,
                marginTop: '12px'
              }}>
                Browse All Crops →
              </Link>
            </DashboardCard>

            {/* Quick Actions */}
            <DashboardCard title="Explore Features" icon="✨">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <ActionButton to="/marketplace" icon="🛒" label="Browse Marketplace" />
                <ActionButton to="/recommendations" icon="🌱" label="Crop Insights" />
                <ActionButton to="/disease-predictor" icon="🩺" label="Disease Detection" />
                <ActionButton to="/community" icon="💬" label="Community Forum" />
              </div>
            </DashboardCard>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Weather Widget */}
            {weather && (
              <DashboardCard title="Weather" icon="🌤️">
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{
                    fontSize: '3rem',
                    fontWeight: 700,
                    color: '#1d7a4f',
                    marginBottom: '8px'
                  }}>
                    {weather.current.temperature}°C
                  </div>
                  <div style={{ fontSize: '1.125rem', color: '#6e6e73', marginBottom: '16px' }}>
                    {weather.current.conditions}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#86868b' }}>
                    📍 {weather.location}
                  </div>
                  <div style={{
                    marginTop: '20px',
                    padding: '12px',
                    background: '#f5f5f5',
                    borderRadius: '10px',
                    fontSize: '0.875rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#6e6e73' }}>Humidity:</span>
                      <span style={{ fontWeight: 500 }}>{weather.current.humidity}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#6e6e73' }}>Wind:</span>
                      <span style={{ fontWeight: 500 }}>{weather.current.wind_speed} km/h</span>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            )}

            {/* AI Assistant */}
            <DashboardCard title="AI Assistant" icon="🤖">
              <p style={{ color: '#6e6e73', fontSize: '0.875rem', marginBottom: '16px' }}>
                Get expert agricultural advice
              </p>
              <Link to="/chatbot">
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Ask AI Assistant
                </button>
              </Link>
            </DashboardCard>

            {/* Popular Categories */}
            <DashboardCard title="Categories" icon="📂">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <CategoryItem name="Grains" count="25" />
                <CategoryItem name="Vegetables" count="18" />
                <CategoryItem name="Fruits" count="12" />
                <CategoryItem name="Pulses" count="8" />
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, icon, children }) => (
  <div style={{
    background: 'white',
    border: '1px solid #e5e5e7',
    borderRadius: '18px',
    padding: '24px'
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e5e5e7'
    }}>
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</h2>
    </div>
    {children}
  </div>
);

// Stat Card Component
const StatCard = ({ title, value, subtitle, color }) => (
  <div style={{
    background: 'white',
    border: '1px solid #e5e5e7',
    borderRadius: '14px',
    padding: '20px',
    textAlign: 'center'
  }}>
    <div style={{
      fontSize: '2rem',
      fontWeight: 700,
      color: color,
      marginBottom: '4px'
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#1d1d1f',
      marginBottom: '4px'
    }}>
      {title}
    </div>
    <div style={{ fontSize: '0.75rem', color: '#86868b' }}>
      {subtitle}
    </div>
  </div>
);

// Crop Card Component
const CropCard = ({ listing }) => (
  <Link
    to={`/listings/${listing.id}`}
    style={{
      display: 'block',
      background: '#fafafa',
      border: '1px solid #e5e5e7',
      borderRadius: '10px',
      padding: '16px',
      textDecoration: 'none',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f5f5f5';
      e.currentTarget.style.borderColor = '#1d7a4f';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#fafafa';
      e.currentTarget.style.borderColor = '#e5e5e7';
    }}
  >
    <div style={{
      fontSize: '1rem',
      fontWeight: 600,
      color: '#1d1d1f',
      marginBottom: '8px'
    }}>
      {listing.crop_name}
    </div>
    <div style={{
      fontSize: '0.875rem',
      color: '#6e6e73',
      marginBottom: '8px'
    }}>
      {listing.variety}
    </div>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{
        fontSize: '1.125rem',
        fontWeight: 700,
        color: '#1d7a4f'
      }}>
        ₹{listing.price}/{listing.unit}
      </span>
      <span style={{
        fontSize: '0.75rem',
        color: '#86868b'
      }}>
        {listing.quantity} {listing.unit}
      </span>
    </div>
  </Link>
);

// Action Button Component
const ActionButton = ({ to, icon, label }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div style={{
      background: '#fafafa',
      border: '1px solid #e5e5e7',
      borderRadius: '10px',
      padding: '16px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f5f5f5';
      e.currentTarget.style.borderColor = '#1d7a4f';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#fafafa';
      e.currentTarget.style.borderColor = '#e5e5e7';
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1d1d1f' }}>
        {label}
      </div>
    </div>
  </Link>
);

// Category Item Component
const CategoryItem = ({ name, count }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: '#fafafa',
    borderRadius: '8px',
    fontSize: '0.875rem'
  }}>
    <span style={{ fontWeight: 500, color: '#1d1d1f' }}>{name}</span>
    <span style={{ color: '#6e6e73' }}>{count} items</span>
  </div>
);

export default ClientDashboard;
