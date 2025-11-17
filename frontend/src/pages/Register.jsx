import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'client',
    display_name: '',
    location: '',
    contact_info: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '600px', margin: '40px auto'}}>
        <h2 className="card-header">Register</h2>

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              type="text"
              name="username"
              className="form-control"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Role *</label>
            <select
              name="role"
              className="form-control"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="client">Client (Buyer)</option>
              <option value="farmer">Farmer (Seller)</option>
              <option value="pharma">Pharmaceutical Company</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Display Name</label>
            <input
              type="text"
              name="display_name"
              className="form-control"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contact Info</label>
            <input
              type="text"
              name="contact_info"
              className="form-control"
              value={formData.contact_info}
              onChange={handleChange}
              placeholder="Phone number or email"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{width: '100%'}}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-2">
          Already have an account? <Link to="/login" style={{color: '#2e7d32'}}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
