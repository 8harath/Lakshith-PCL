import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getListing, getWeather } from '../api';
import { useAuth } from '../AuthContext';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const response = await getListing(id);
      setListing(response.data.listing);

      // Fetch weather for the location
      try {
        const weatherResponse = await getWeather(response.data.listing.location.split(',')[0]);
        setWeather(weatherResponse.data);
      } catch (err) {
        console.log('Weather data not available');
      }

      setError('');
    } catch (err) {
      setError('Failed to fetch listing details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  if (error || !listing) {
    return (
      <div className="container">
        <div className="alert alert-error">{error || 'Listing not found'}</div>
        <button onClick={() => navigate('/marketplace')} className="btn btn-secondary">
          Back to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <button onClick={() => navigate('/marketplace')} className="btn btn-secondary mt-2 mb-2">
        ← Back to Marketplace
      </button>

      <div className="grid grid-2">
        <div>
          <div className="card">
            <h1 style={{color: '#2e7d32', marginBottom: '10px'}}>{listing.crop_name}</h1>
            {listing.variety && (
              <p style={{fontSize: '18px', color: '#666', marginBottom: '20px'}}>
                Variety: {listing.variety}
              </p>
            )}

            <div className="listing-price" style={{fontSize: '32px', marginBottom: '20px'}}>
              ₹{listing.price.toLocaleString()} / {listing.unit}
            </div>

            <div style={{fontSize: '16px', lineHeight: '2'}}>
              <div><strong>Quantity Available:</strong> {listing.quantity} {listing.unit}</div>
              {listing.quality && <div><strong>Quality:</strong> {listing.quality}</div>}
              <div><strong>Location:</strong> {listing.location}</div>
              <div><strong>Harvest Date:</strong> {listing.harvest_date}</div>
              <div><strong>Farmer:</strong> {listing.farmer_name}</div>
              {listing.contact_info && isAuthenticated && (
                <div><strong>Contact:</strong> {listing.contact_info}</div>
              )}
            </div>

            {listing.description && (
              <div style={{marginTop: '20px'}}>
                <h3 style={{color: '#2e7d32', marginBottom: '10px'}}>Description</h3>
                <p style={{lineHeight: '1.8', color: '#555'}}>{listing.description}</p>
              </div>
            )}

            {!isAuthenticated && (
              <div className="alert alert-info mt-2">
                Please login to view contact information and connect with the farmer.
              </div>
            )}
          </div>
        </div>

        <div>
          {weather && (
            <div className="weather-widget">
              <div className="weather-location">
                📍 {weather.location}
              </div>
              <div className="weather-temp">
                {weather.current.temperature}°C
              </div>
              <div className="weather-details">
                <div>💧 Humidity: {weather.current.humidity}%</div>
                <div>🌧️ Precipitation: {weather.current.precipitation}mm</div>
              </div>
              <div style={{marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '15px'}}>
                <div style={{fontSize: '14px', marginBottom: '5px'}}>Today's Forecast</div>
                <div>High: {weather.forecast.max_temp}°C | Low: {weather.forecast.min_temp}°C</div>
                <div>Rain: {weather.forecast.precipitation}mm</div>
              </div>
            </div>
          )}

          <div className="card mt-2">
            <h3 style={{color: '#2e7d32', marginBottom: '15px'}}>Interested in this listing?</h3>
            {isAuthenticated ? (
              <div>
                <p style={{marginBottom: '15px'}}>
                  Contact the farmer directly using the contact information above.
                </p>
                {listing.contact_info && (
                  <div className="alert alert-success">
                    <strong>Contact:</strong> {listing.contact_info}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p style={{marginBottom: '15px'}}>
                  Login to view contact information and connect with the farmer.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-primary"
                  style={{width: '100%'}}
                >
                  Login to Contact
                </button>
              </div>
            )}
          </div>

          <div className="card mt-2">
            <h3 style={{color: '#2e7d32', marginBottom: '15px'}}>Tips for Buyers</h3>
            <ul style={{lineHeight: '2', color: '#555'}}>
              <li>Verify quality before purchase</li>
              <li>Discuss delivery terms</li>
              <li>Check harvest date for freshness</li>
              <li>Negotiate for bulk purchases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
