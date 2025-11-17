import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          🌾 Crop Marketplace & Recommendation
        </Link>
        <ul className="navbar-nav">
          <li><Link to="/marketplace" className="nav-link">Marketplace</Link></li>
          <li><Link to="/recommendations" className="nav-link">Recommendations</Link></li>
          <li><Link to="/disease-predictor" className="nav-link">Disease Help</Link></li>
          <li>
            <span className="nav-link demo-badge" style={{cursor: 'default', color: '#4CAF50', fontWeight: 'bold'}}>
              🎯 MVP Demo
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
