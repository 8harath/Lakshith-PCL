import React, { useState } from 'react';
import { getCropRecommendations } from '../api';

const Recommendations = () => {
  const [formData, setFormData] = useState({
    soil_type: '',
    soil_ph: '',
    average_temperature: '',
    average_rainfall: '',
    humidity: '',
    irrigation_available: false,
    season: '',
    location: ''
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Convert string numbers to actual numbers
      const payload = {
        ...formData,
        soil_ph: formData.soil_ph ? parseFloat(formData.soil_ph) : null,
        average_temperature: parseFloat(formData.average_temperature),
        average_rainfall: parseFloat(formData.average_rainfall),
        humidity: formData.humidity ? parseFloat(formData.humidity) : null
      };

      const response = await getCropRecommendations(payload);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.errors?.join(', ') || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 style={{marginTop: '30px', marginBottom: '20px', color: '#2e7d32'}}>
        🌱 Crop Recommendation Engine
      </h1>

      <div className="alert alert-info mb-2">
        <strong>How it works:</strong> Enter your field attributes below to get personalized crop recommendations
        based on soil type, climate, and available resources. Our rule-based engine analyzes your inputs
        to suggest the most suitable crops for your conditions.
      </div>

      <div className="card">
        <h3 className="card-header">Field Information</h3>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Soil Type *</label>
              <select
                name="soil_type"
                className="form-control"
                value={formData.soil_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Soil Type</option>
                <option value="clay">Clay</option>
                <option value="loamy">Loamy</option>
                <option value="sandy-loam">Sandy Loam</option>
                <option value="alluvial">Alluvial</option>
                <option value="black">Black Soil</option>
                <option value="red">Red Soil</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Soil pH (optional)</label>
              <input
                type="number"
                name="soil_ph"
                className="form-control"
                value={formData.soil_ph}
                onChange={handleChange}
                min="0"
                max="14"
                step="0.1"
                placeholder="e.g., 6.5"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Average Temperature (°C) *</label>
              <input
                type="number"
                name="average_temperature"
                className="form-control"
                value={formData.average_temperature}
                onChange={handleChange}
                required
                min="-10"
                max="50"
                step="0.1"
                placeholder="e.g., 25"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Average Rainfall (mm/year) *</label>
              <input
                type="number"
                name="average_rainfall"
                className="form-control"
                value={formData.average_rainfall}
                onChange={handleChange}
                required
                min="0"
                step="1"
                placeholder="e.g., 1000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Humidity (%) (optional)</label>
              <input
                type="number"
                name="humidity"
                className="form-control"
                value={formData.humidity}
                onChange={handleChange}
                min="0"
                max="100"
                step="1"
                placeholder="e.g., 70"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Season</label>
              <select
                name="season"
                className="form-control"
                value={formData.season}
                onChange={handleChange}
              >
                <option value="">Select Season</option>
                <option value="kharif">Kharif (Monsoon)</option>
                <option value="rabi">Rabi (Winter)</option>
                <option value="zaid">Zaid (Summer)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location (optional)</label>
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
              <label className="form-label" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                <input
                  type="checkbox"
                  name="irrigation_available"
                  checked={formData.irrigation_available}
                  onChange={handleChange}
                  style={{width: 'auto', margin: 0}}
                />
                Irrigation Available
              </label>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary"
            style={{width: '100%', marginTop: '20px'}}
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Get Recommendations'}
          </button>
        </form>
      </div>

      {results && (
        <div style={{marginTop: '30px'}}>
          <h2 style={{color: '#2e7d32', marginBottom: '20px'}}>Recommended Crops</h2>

          <div className="card mb-2" style={{backgroundColor: '#e3f2fd'}}>
            <h4 style={{color: '#1976d2', marginBottom: '10px'}}>Input Summary</h4>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
              <div><strong>Soil:</strong> {results.input_summary.soil_type}</div>
              {results.input_summary.season && <div><strong>Season:</strong> {results.input_summary.season}</div>}
              <div><strong>Irrigation:</strong> {results.input_summary.irrigation_available ? 'Yes' : 'No'}</div>
              {results.input_summary.location && <div><strong>Location:</strong> {results.input_summary.location}</div>}
            </div>
          </div>

          {results.recommendations.map((rec, index) => (
            <div key={index} className="recommendation-result">
              <div className="recommendation-crop">
                {index + 1}. {rec.crop_name}
              </div>
              <span className="recommendation-score">
                Suitability: {rec.percentage}%
              </span>

              <div style={{marginTop: '15px'}}>
                <div style={{marginBottom: '10px'}}>
                  <strong style={{color: '#1b5e20'}}>Why this crop?</strong>
                  <p style={{margin: '5px 0'}}>{rec.rationale}</p>
                </div>

                <div style={{marginBottom: '10px'}}>
                  <strong style={{color: '#1b5e20'}}>Sowing Window:</strong>
                  <p style={{margin: '5px 0'}}>{rec.sowing_window}</p>
                </div>

                <div>
                  <strong style={{color: '#1b5e20'}}>Care Notes:</strong>
                  <p style={{margin: '5px 0'}}>{rec.care_notes}</p>
                </div>
              </div>
            </div>
          ))}

          {results.gemini_insights && (
            <div className="card mt-2" style={{backgroundColor: '#fff3e0', borderLeft: '4px solid #ff9800'}}>
              <h4 style={{color: '#e65100', marginBottom: '10px'}}>🤖 AI Insights (Gemini)</h4>
              <p style={{lineHeight: '1.8'}}>{results.gemini_insights}</p>
            </div>
          )}

          <div className="alert alert-info mt-2">
            <strong>Disclaimer:</strong> These recommendations are based on rule-based analysis and are for
            advisory purposes only. Please consult with local agricultural experts before making final decisions.
          </div>
        </div>
      )}
    </div>
  );
};

export default Recommendations;
