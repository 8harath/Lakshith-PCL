import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyListings, deleteListing } from '../api';
import { useAuth } from '../AuthContext';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isFarmer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isFarmer) {
      fetchMyListings();
    }
  }, [isFarmer]);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const response = await getMyListings();
      setListings(response.data.listings);
      setError('');
    } catch (err) {
      setError('Failed to fetch your listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await deleteListing(id);
      setListings(listings.filter(l => l.id !== id));
    } catch (err) {
      alert('Failed to delete listing');
      console.error(err);
    }
  };

  if (!isFarmer) {
    return (
      <div className="container">
        <div className="alert alert-error mt-2">
          Only farmers can view this page.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex-between mt-2 mb-2">
        <h1 style={{color: '#2e7d32'}}>My Listings</h1>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/create-listing')}
        >
          + Add New Listing
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading your listings...</div>
      ) : listings.length === 0 ? (
        <div className="card text-center">
          <p style={{fontSize: '18px', color: '#666', marginBottom: '20px'}}>
            You haven't created any listings yet.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/create-listing')}
          >
            Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {listings.map((listing) => (
            <div key={listing.id} className="card">
              <div className="flex-between mb-1">
                <h3 style={{color: '#2e7d32', margin: 0}}>{listing.crop_name}</h3>
                <div className="flex-gap">
                  <button
                    className="btn btn-secondary"
                    style={{padding: '5px 15px', fontSize: '14px'}}
                    onClick={() => navigate(`/listings/${listing.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{padding: '5px 15px', fontSize: '14px'}}
                    onClick={() => handleDelete(listing.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {listing.variety && (
                <div className="text-muted" style={{fontSize: '14px', marginBottom: '10px'}}>
                  {listing.variety}
                </div>
              )}

              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#d32f2f', margin: '10px 0'}}>
                ₹{listing.price.toLocaleString()} / {listing.unit}
              </div>

              <div style={{fontSize: '14px', lineHeight: '1.8'}}>
                <div>📦 Quantity: {listing.quantity} {listing.unit}</div>
                {listing.quality && <div>⭐ Quality: {listing.quality}</div>}
                <div>📍 {listing.location}</div>
                <div>📅 Harvest: {listing.harvest_date}</div>
              </div>

              {listing.description && (
                <div style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
                  {listing.description.substring(0, 100)}
                  {listing.description.length > 100 && '...'}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
