import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getListings } from '../api';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    crop_name: '',
    location: '',
    min_price: '',
    max_price: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.crop_name) params.crop_name = filters.crop_name;
      if (filters.location) params.location = filters.location;
      if (filters.min_price) params.min_price = filters.min_price;
      if (filters.max_price) params.max_price = filters.max_price;
      params.sort_by = filters.sort_by;
      params.sort_order = filters.sort_order;

      const response = await getListings(params);
      setListings(response.data.listings);
      setError('');
    } catch (err) {
      setError('Failed to fetch listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings();
  };

  const handleClearFilters = () => {
    setFilters({
      crop_name: '',
      location: '',
      min_price: '',
      max_price: '',
      sort_by: 'created_at',
      sort_order: 'desc'
    });
    setTimeout(fetchListings, 100);
  };

  return (
    <div className="container">
      <h1 style={{marginTop: '30px', marginBottom: '20px', color: '#2e7d32'}}>
        🛒 Crop Marketplace
      </h1>

      <div className="filter-bar">
        <form onSubmit={handleSearch}>
          <div className="filter-row">
            <div className="filter-group">
              <label className="form-label">Crop Name</label>
              <input
                type="text"
                name="crop_name"
                className="form-control"
                placeholder="e.g., Rice, Wheat"
                value={filters.crop_name}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="e.g., Pune, Mumbai"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Min Price (₹)</label>
              <input
                type="number"
                name="min_price"
                className="form-control"
                placeholder="0"
                value={filters.min_price}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Max Price (₹)</label>
              <input
                type="number"
                name="max_price"
                className="form-control"
                placeholder="10000"
                value={filters.max_price}
                onChange={handleFilterChange}
              />
            </div>

            <div className="filter-group">
              <label className="form-label">Sort By</label>
              <select
                name="sort_by"
                className="form-control"
                value={filters.sort_by}
                onChange={handleFilterChange}
              >
                <option value="created_at">Date Listed</option>
                <option value="price">Price</option>
                <option value="harvest_date">Harvest Date</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">Order</label>
              <select
                name="sort_order"
                className="form-control"
                value={filters.sort_order}
                onChange={handleFilterChange}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="form-label">&nbsp;</label>
              <button type="submit" className="btn btn-primary" style={{width: '100%'}}>
                Search
              </button>
            </div>

            <div className="filter-group">
              <label className="form-label">&nbsp;</label>
              <button
                type="button"
                className="btn btn-secondary"
                style={{width: '100%'}}
                onClick={handleClearFilters}
              >
                Clear
              </button>
            </div>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading listings...</div>
      ) : listings.length === 0 ? (
        <div className="card text-center">
          <p style={{fontSize: '18px', color: '#666'}}>
            No listings found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          <p className="text-muted mb-2">Found {listings.length} listing(s)</p>
          <div className="grid grid-3">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="listing-card"
                onClick={() => navigate(`/listings/${listing.id}`)}
              >
                <div className="listing-title">{listing.crop_name}</div>
                {listing.variety && (
                  <div className="text-muted" style={{fontSize: '14px'}}>
                    {listing.variety}
                  </div>
                )}
                <div className="listing-price">
                  ₹{listing.price.toLocaleString()} / {listing.unit}
                </div>
                <div className="listing-info">
                  📦 Quantity: {listing.quantity} {listing.unit}
                </div>
                <div className="listing-info">
                  📍 {listing.location}
                </div>
                <div className="listing-info">
                  📅 Harvest: {listing.harvest_date}
                </div>
                {listing.quality && (
                  <div className="listing-info">
                    ⭐ Quality: {listing.quality}
                  </div>
                )}
                <div className="listing-info text-muted" style={{fontSize: '12px', marginTop: '10px'}}>
                  By: {listing.farmer_name}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Marketplace;
