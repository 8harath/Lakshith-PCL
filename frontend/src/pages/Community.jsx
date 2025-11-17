import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQAPosts } from '../api';
import { useAuth } from '../AuthContext';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getQAPosts();
      setPosts(response.data.posts);
      setError('');
    } catch (err) {
      setError('Failed to fetch community posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container">
      <div className="flex-between mt-2 mb-2">
        <h1 style={{color: '#2e7d32'}}>💬 Community Q&A</h1>
        {isAuthenticated && (
          <button
            className="btn btn-primary"
            onClick={() => navigate('/create-post')}
          >
            + Ask Question
          </button>
        )}
      </div>

      <div className="card mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search questions by keyword or tag..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {!isAuthenticated && (
        <div className="alert alert-info">
          <strong>Join the community!</strong> Login to ask questions and share your knowledge with fellow farmers.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading">Loading community posts...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="card text-center">
          <p style={{fontSize: '18px', color: '#666', marginBottom: '20px'}}>
            {searchTerm ? 'No posts found matching your search.' : 'No community posts yet.'}
          </p>
          {isAuthenticated && !searchTerm && (
            <button
              className="btn btn-primary"
              onClick={() => navigate('/create-post')}
            >
              Be the First to Ask
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-muted mb-2">
            {filteredPosts.length} question(s) found
          </p>

          {filteredPosts.map((post) => (
            <div key={post.id} className="qa-post">
              <div className="qa-post-title">{post.title}</div>

              <div className="qa-post-meta">
                Asked by <strong>{post.author_name}</strong> ({post.author_role}) •{' '}
                {new Date(post.created_at).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>

              <div className="qa-post-body">
                {post.body.length > 300
                  ? post.body.substring(0, 300) + '...'
                  : post.body}
              </div>

              {post.tags.length > 0 && (
                <div>
                  {post.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </>
      )}

      <div className="card mt-3" style={{backgroundColor: '#e8f5e9'}}>
        <h3 style={{color: '#2e7d32', marginBottom: '15px'}}>Community Guidelines</h3>
        <ul style={{lineHeight: '2', color: '#555'}}>
          <li>Be respectful and helpful to fellow community members</li>
          <li>Provide detailed information when asking questions</li>
          <li>Share your experiences and knowledge</li>
          <li>Use relevant tags for better discoverability</li>
          <li>Avoid spam and promotional content</li>
        </ul>
      </div>
    </div>
  );
};

export default Community;
