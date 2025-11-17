import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isFarmer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-brand">
          AgriMarket
        </Link>
        <ul className="navbar-nav">
          {/* Common Links for All */}
          {isAuthenticated && (
            <li><Link to="/" className="nav-link">Dashboard</Link></li>
          )}

          {/* Farmer-Specific Links */}
          {isAuthenticated && isFarmer ? (
            <>
              <li><Link to="/my-listings" className="nav-link">My Listings</Link></li>
              <li><Link to="/create-listing" className="nav-link">Add Listing</Link></li>
              <li><Link to="/recommendations" className="nav-link">Crop Advice</Link></li>
              <li><Link to="/disease-predictor" className="nav-link">Disease Help</Link></li>
            </>
          ) : isAuthenticated ? (
            /* Client-Specific Links */
            <>
              <li><Link to="/marketplace" className="nav-link">Browse Crops</Link></li>
              <li><Link to="/recommendations" className="nav-link">Crop Insights</Link></li>
              <li><Link to="/disease-predictor" className="nav-link">Plant Health</Link></li>
            </>
          ) : (
            /* Guest Links */
            <>
              <li><Link to="/marketplace" className="nav-link">Marketplace</Link></li>
              <li><Link to="/recommendations" className="nav-link">Recommendations</Link></li>
            </>
          )}

          {/* Common Links */}
          {isAuthenticated && (
            <>
              <li><Link to="/chatbot" className="nav-link">AI Assistant</Link></li>
              <li><Link to="/community" className="nav-link">Community</Link></li>
            </>
          )}

          {/* Auth Links */}
          {isAuthenticated ? (
            <>
              <li>
                <span className="nav-link" style={{cursor: 'default', fontWeight: 500}}>
                  {user.display_name || user.username}
                </span>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="nav-link">Login</Link></li>
              <li><Link to="/register" className="nav-link">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
