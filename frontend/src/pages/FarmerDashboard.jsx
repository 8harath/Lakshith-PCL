import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { getMyListings, getWeather } from '../api';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load farmer's listings
      const listingsRes = await getMyListings();
      setListings(listingsRes.data.listings.slice(0, 3)); // Show only 3

      // Load weather for farmer's location
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

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', paddingBottom: '40px' }}>
      <div className="container" style={{ paddingTop: '40px' }}>
        {/* Welcome Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 600, marginBottom: '8px' }}>
            Welcome back, {user.display_name || user.username}
          </h1>
          <p style={{ color: '#6e6e73', fontSize: '1.125rem' }}>
            Here's your farm overview for today
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <StatCard
            title="Active Listings"
            value={listings.length}
            subtitle="Products for sale"
            color="#1d7a4f"
          />
          <StatCard
            title="Total Views"
            value="--"
            subtitle="Coming soon"
            color="#3b82f6"
          />
          <StatCard
            title="Inquiries"
            value="--"
            subtitle="Coming soon"
            color="#f59e0b"
          />
          <StatCard
            title="Revenue"
            value="--"
            subtitle="Coming soon"
            color="#10b981"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* My Listings */}
            <DashboardCard title="My Active Listings" icon="📦">
              {listings.length > 0 ? (
                <>
                  {listings.map(listing => (
                    <ListingItem key={listing.id} listing={listing} />
                  ))}
                  <Link to="/my-listings" style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px',
                    color: '#1d7a4f',
                    fontWeight: 500,
                    marginTop: '12px'
                  }}>
                    View All Listings →
                  </Link>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <p style={{ color: '#6e6e73', marginBottom: '16px' }}>
                    You don't have any active listings yet
                  </p>
                  <Link to="/create-listing">
                    <button className="btn btn-primary">
                      Create Your First Listing
                    </button>
                  </Link>
                </div>
              )}
            </DashboardCard>

            {/* Quick Actions */}
            <DashboardCard title="Quick Actions" icon="⚡">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <ActionButton to="/create-listing" icon="➕" label="Add New Listing" />
                <ActionButton to="/my-listings" icon="📋" label="Manage Listings" />
                <ActionButton to="/recommendations" icon="🌱" label="Get Crop Advice" />
                <ActionButton to="/disease-predictor" icon="🩺" label="Check Plant Health" />
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
                Get instant answers to your farming questions
              </p>
              <Link to="/chatbot">
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Ask AI Assistant
                </button>
              </Link>
            </DashboardCard>

            {/* Community */}
            <DashboardCard title="Community" icon="💬">
              <p style={{ color: '#6e6e73', fontSize: '0.875rem', marginBottom: '16px' }}>
                Connect with fellow farmers
              </p>
              <Link to="/community">
                <button className="btn btn-secondary" style={{ width: '100%' }}>
                  Join Discussion
                </button>
              </Link>
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

// Listing Item Component
const ListingItem = ({ listing }) => (
  <Link
    to={`/listings/${listing.id}`}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      background: '#fafafa',
      borderRadius: '10px',
      marginBottom: '8px',
      textDecoration: 'none',
      transition: 'all 0.2s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#f5f5f5';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#fafafa';
    }}
  >
    <div>
      <div style={{
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1d1d1f',
        marginBottom: '4px'
      }}>
        {listing.crop_name} - {listing.variety}
      </div>
      <div style={{ fontSize: '0.875rem', color: '#6e6e73' }}>
        {listing.quantity} {listing.unit} available
      </div>
    </div>
    <div style={{
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#1d7a4f'
    }}>
      ₹{listing.price}/{listing.unit}
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

export default FarmerDashboard;
