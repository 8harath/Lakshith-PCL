import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../api';
import { useAuth } from '../AuthContext';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    crop_name: '',
    variety: '',
    quality: '',
    price: '',
    quantity: '',
    unit: 'kg',
    location: '',
    harvest_date: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isFarmer } = useAuth();
  const navigate = useNavigate();

  if (!isFarmer) {
    return (
      <div className="container">
        <div className="alert alert-error mt-2">
          Only farmers can create listings. Please register as a farmer.
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createListing(formData);
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '800px', margin: '40px auto'}}>
        <h2 className="card-header">Create New Listing</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Crop Name *</label>
              <input
                type="text"
                name="crop_name"
                className="form-control"
                value={formData.crop_name}
                onChange={handleChange}
                required
                placeholder="e.g., Rice, Wheat, Cotton"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Variety</label>
              <input
                type="text"
                name="variety"
                className="form-control"
                value={formData.variety}
                onChange={handleChange}
                placeholder="e.g., Basmati, BT Cotton"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quality</label>
              <select
                name="quality"
                className="form-control"
                value={formData.quality}
                onChange={handleChange}
              >
                <option value="">Select Quality</option>
                <option value="Grade A">Grade A</option>
                <option value="Grade B">Grade B</option>
                <option value="Grade C">Grade C</option>
                <option value="Premium">Premium</option>
                <option value="Standard">Standard</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Price per unit"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit *</label>
              <select
                name="unit"
                className="form-control"
                value={formData.unit}
                onChange={handleChange}
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="quintal">Quintal</option>
                <option value="ton">Ton</option>
                <option value="bag">Bag</option>
                <option value="piece">Piece</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="City, State"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Harvest Date *</label>
              <input
                type="date"
                name="harvest_date"
                className="form-control"
                value={formData.harvest_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Provide details about your crop, farming methods, quality, etc."
            />
          </div>

          <div className="flex-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/my-listings')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
