import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container">
      <div className="card" style={{marginTop: '40px', textAlign: 'center'}}>
        <h1 style={{fontSize: '36px', color: '#2e7d32', marginBottom: '20px'}}>
          Welcome to Crop Marketplace & Recommendation System
        </h1>

        {isAuthenticated ? (
          <div>
            <p style={{fontSize: '20px', marginBottom: '30px'}}>
              Hello, {user.display_name || user.username}! ({user.role})
            </p>
            <div className="grid grid-2" style={{marginTop: '40px'}}>
              <Link to="/marketplace" style={{textDecoration: 'none'}}>
                <div className="card" style={{cursor: 'pointer', height: '100%'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>🛒</div>
                  <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>Marketplace</h3>
                  <p className="text-muted">Browse and buy quality crops from farmers</p>
                </div>
              </Link>

              <Link to="/recommendations" style={{textDecoration: 'none'}}>
                <div className="card" style={{cursor: 'pointer', height: '100%'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>🌱</div>
                  <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>Crop Recommendations</h3>
                  <p className="text-muted">Get AI-powered crop recommendations for your field</p>
                </div>
              </Link>

              <Link to="/disease-predictor" style={{textDecoration: 'none'}}>
                <div className="card" style={{cursor: 'pointer', height: '100%'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>🩺</div>
                  <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>Disease Predictor</h3>
                  <p className="text-muted">Identify crop diseases and get treatment advice</p>
                </div>
              </Link>

              <Link to="/community" style={{textDecoration: 'none'}}>
                <div className="card" style={{cursor: 'pointer', height: '100%'}}>
                  <div style={{fontSize: '48px', marginBottom: '15px'}}>💬</div>
                  <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>Community Q&A</h3>
                  <p className="text-muted">Ask questions and share knowledge with farmers</p>
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p style={{fontSize: '18px', marginBottom: '30px', color: '#666'}}>
              Your one-stop solution for crop trading, recommendations, and agricultural support
            </p>

            <div style={{display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '40px'}}>
              <Link to="/login">
                <button className="btn btn-primary" style={{fontSize: '18px', padding: '12px 30px'}}>
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="btn btn-secondary" style={{fontSize: '18px', padding: '12px 30px'}}>
                  Register
                </button>
              </Link>
            </div>

            <div className="grid grid-2" style={{marginTop: '40px'}}>
              <div className="card">
                <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>For Farmers</h3>
                <ul style={{textAlign: 'left', lineHeight: '2'}}>
                  <li>List your crops for sale</li>
                  <li>Get crop recommendations based on your field</li>
                  <li>Diagnose crop diseases</li>
                  <li>Connect with buyers directly</li>
                </ul>
              </div>

              <div className="card">
                <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>For Buyers</h3>
                <ul style={{textAlign: 'left', lineHeight: '2'}}>
                  <li>Browse quality crops from verified farmers</li>
                  <li>Filter by location, price, and harvest date</li>
                  <li>Get detailed crop information</li>
                  <li>Contact farmers directly</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card" style={{marginTop: '30px', backgroundColor: '#e8f5e9'}}>
        <h3 style={{color: '#2e7d32', marginBottom: '15px'}}>Features</h3>
        <div className="grid grid-3">
          <div>
            <strong>🌾 Marketplace:</strong> Buy and sell crops directly
          </div>
          <div>
            <strong>🤖 Smart Recommendations:</strong> AI-powered crop suggestions
          </div>
          <div>
            <strong>🔬 Disease Detection:</strong> Identify and treat crop diseases
          </div>
          <div>
            <strong>🌤️ Weather Integration:</strong> Real-time weather data
          </div>
          <div>
            <strong>💬 Community Support:</strong> Q&A forum for farmers
          </div>
          <div>
            <strong>📊 Data-Driven Insights:</strong> Make informed decisions
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
