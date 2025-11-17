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
          🌾 Crop Marketplace
        </Link>
        <ul className="navbar-nav">
          <li><Link to="/marketplace" className="nav-link">Marketplace</Link></li>
          <li><Link to="/recommendations" className="nav-link">Recommendations</Link></li>
          <li><Link to="/disease-predictor" className="nav-link">Disease Help</Link></li>
          <li><Link to="/community" className="nav-link">Community</Link></li>

          {isAuthenticated ? (
            <>
              {isFarmer && (
                <>
                  <li><Link to="/create-listing" className="nav-link">Add Listing</Link></li>
                  <li><Link to="/my-listings" className="nav-link">My Listings</Link></li>
                </>
              )}
              <li>
                <span className="nav-link" style={{cursor: 'default'}}>
                  👤 {user.display_name || user.username}
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
