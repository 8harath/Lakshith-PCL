import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQAPost } from '../api';
import { useAuth } from '../AuthContext';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div className="alert alert-error mt-2">
          Please login to create a post.
        </div>
        <button onClick={() => navigate('/login')} className="btn btn-primary">
          Go to Login
        </button>
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
      const payload = {
        title: formData.title,
        body: formData.body,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await createQAPost(payload);
      navigate('/community');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{maxWidth: '800px', margin: '40px auto'}}>
        <h2 className="card-header">Ask a Question</h2>

        <div className="alert alert-info">
          <strong>Tips for asking good questions:</strong>
          <ul style={{marginTop: '10px', marginBottom: 0, lineHeight: '1.8'}}>
            <li>Write a clear, descriptive title</li>
            <li>Provide detailed information about your situation</li>
            <li>Include relevant context (crop type, location, etc.)</li>
            <li>Add appropriate tags for better visibility</li>
          </ul>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Question Title *</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., How to control pests in rice crops organically?"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Question Details *</label>
            <textarea
              name="body"
              className="form-control"
              value={formData.body}
              onChange={handleChange}
              required
              rows="8"
              placeholder="Provide detailed information about your question. Include relevant context such as crop type, location, current practices, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              className="form-control"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., rice, pest-management, organic"
            />
            <small className="text-muted">
              Add relevant tags to help others find your question (e.g., crop names, topics)
            </small>
          </div>

          <div className="flex-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/community')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Posting...' : 'Post Question'}
            </button>
          </div>
        </form>
      </div>

      <div className="card" style={{maxWidth: '800px', margin: '20px auto', backgroundColor: '#e8f5e9'}}>
        <h3 style={{color: '#2e7d32', marginBottom: '15px'}}>Popular Topics</h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
          {['crop-selection', 'pest-management', 'irrigation', 'soil-health', 'disease-control',
            'organic-farming', 'fertilizers', 'market-prices', 'storage', 'weather'].map(topic => (
            <span key={topic} className="tag" style={{cursor: 'default'}}>
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
