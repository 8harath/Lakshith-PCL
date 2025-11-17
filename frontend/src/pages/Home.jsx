import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <div className="card" style={{marginTop: '40px', textAlign: 'center'}}>
        <div style={{backgroundColor: '#fff3cd', padding: '15px', borderRadius: '8px', marginBottom: '20px'}}>
          <strong>🎯 MVP Demo Version</strong>
          <p style={{marginTop: '10px', fontSize: '14px', color: '#856404'}}>
            This is a prototype showcasing core features. Browse marketplace, get crop recommendations, and predict crop diseases - all powered by Vercel serverless functions!
          </p>
        </div>

        <h1 style={{fontSize: '36px', color: '#2e7d32', marginBottom: '20px'}}>
          Crop Marketplace & Recommendation System
        </h1>

        <p style={{fontSize: '18px', marginBottom: '30px', color: '#666'}}>
          Your intelligent platform for crop trading, recommendations, and agricultural insights
        </p>

        <div className="grid grid-3" style={{marginTop: '40px'}}>
          <Link to="/marketplace" style={{textDecoration: 'none'}}>
            <div className="card" style={{cursor: 'pointer', height: '100%', transition: 'transform 0.2s'}}>
              <div style={{fontSize: '48px', marginBottom: '15px'}}>🛒</div>
              <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>Marketplace</h3>
              <p className="text-muted">Browse quality crops from farmers across India</p>
            </div>
          </Link>

          <Link to="/recommendations" style={{textDecoration: 'none'}}>
            <div className="card" style={{cursor: 'pointer', height: '100%', transition: 'transform 0.2s'}}>
              <div style={{fontSize: '48px', marginBottom: '15px'}}>🌱</div>
              <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>Crop Recommendations</h3>
              <p className="text-muted">Get smart crop recommendations for your field</p>
            </div>
          </Link>

          <Link to="/disease-predictor" style={{textDecoration: 'none'}}>
            <div className="card" style={{cursor: 'pointer', height: '100%', transition: 'transform 0.2s'}}>
              <div style={{fontSize: '48px', marginBottom: '15px'}}>🩺</div>
              <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>Disease Predictor</h3>
              <p className="text-muted">Identify crop diseases and get treatment advice</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="card" style={{marginTop: '30px', backgroundColor: '#e8f5e9'}}>
        <h3 style={{color: '#2e7d32', marginBottom: '15px'}}>MVP Features</h3>
        <div className="grid grid-3">
          <div>
            <strong>🌾 Marketplace:</strong> Browse 10+ sample crop listings
          </div>
          <div>
            <strong>🤖 Smart Recommendations:</strong> Rule-based crop matching system
          </div>
          <div>
            <strong>🔬 Disease Detection:</strong> Symptom-based disease prediction
          </div>
          <div>
            <strong>🌤️ Weather Integration:</strong> Real-time weather via Open-Meteo
          </div>
          <div>
            <strong>⚡ Serverless:</strong> Powered by Vercel functions
          </div>
          <div>
            <strong>📊 No Database:</strong> Mock data for quick deployment
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop: '30px'}}>
        <h3 style={{color: '#2e7d32', marginBottom: '15px'}}>How It Works</h3>
        <div className="grid grid-2" style={{marginTop: '20px'}}>
          <div className="card">
            <h4 style={{color: '#388e3c', marginBottom: '10px'}}>For Farmers</h4>
            <ul style={{textAlign: 'left', lineHeight: '2'}}>
              <li>View sample crop listings from farmers</li>
              <li>Get crop recommendations based on field conditions</li>
              <li>Diagnose crop diseases from symptoms</li>
              <li>Access real-time weather data</li>
            </ul>
          </div>

          <div className="card">
            <h4 style={{color: '#388e3c', marginBottom: '10px'}}>For Buyers</h4>
            <ul style={{textAlign: 'left', lineHeight: '2'}}>
              <li>Browse quality crops from verified regions</li>
              <li>Filter by crop type, location, and price</li>
              <li>View detailed crop information</li>
              <li>See farmer contact information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
