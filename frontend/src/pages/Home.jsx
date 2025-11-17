import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div style={{ background: '#ffffff' }}>
      {/* Hero Section - Apple Style */}
      <section style={{
        padding: '80px 0 120px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, #fafafa 0%, #ffffff 100%)'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 600,
            color: '#1d1d1f',
            marginBottom: '20px',
            letterSpacing: '-1px',
            lineHeight: 1.1
          }}>
            Agricultural Excellence,<br />Simplified.
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#6e6e73',
            marginBottom: '40px',
            maxWidth: '600px',
            margin: '0 auto 40px',
            lineHeight: 1.5
          }}>
            Connect farmers and buyers. Get smart crop recommendations.
            Detect plant diseases with AI. All in one platform.
          </p>

          {!isAuthenticated ? (
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register">
                <button className="btn btn-primary" style={{
                  padding: '14px 32px',
                  fontSize: '1rem'
                }}>
                  Get Started
                </button>
              </Link>
              <Link to="/login">
                <button className="btn btn-secondary" style={{
                  padding: '14px 32px',
                  fontSize: '1rem'
                }}>
                  Sign In
                </button>
              </Link>
            </div>
          ) : (
            <div style={{
              background: '#f5f5f5',
              padding: '32px',
              borderRadius: '18px',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 600,
                color: '#1d1d1f',
                marginBottom: '8px'
              }}>
                Welcome back, {user.display_name || user.username}
              </h2>
              <p style={{ color: '#6e6e73', fontSize: '1rem' }}>
                Role: <strong style={{ color: '#1d7a4f' }}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</strong>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', background: '#fafafa' }}>
        <div className="container">
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '60px',
            color: '#1d1d1f'
          }}>
            Everything you need
          </h2>

          <div className="grid grid-3">
            <FeatureCard
              to="/marketplace"
              icon="🛒"
              title="Marketplace"
              description="Buy and sell crops directly. Browse listings, compare prices, and connect with verified farmers and buyers."
              cta="Browse Marketplace"
            />
            <FeatureCard
              to="/recommendations"
              icon="🌱"
              title="Crop Recommendations"
              description="Get data-driven crop suggestions based on soil type, climate, and resources. Make informed farming decisions."
              cta="Get Recommendations"
            />
            <FeatureCard
              to="/disease-predictor"
              icon="🩺"
              title="Disease Detection"
              description="Identify plant diseases from symptoms or images. Get instant treatment recommendations and preventive care."
              cta="Check Plant Health"
            />
            <FeatureCard
              to="/chatbot"
              icon="🤖"
              title="AI Assistant"
              description="24/7 agricultural chatbot powered by AI. Get instant answers to your farming questions."
              cta="Ask a Question"
            />
            <FeatureCard
              to="/community"
              icon="💬"
              title="Community Q&A"
              description="Connect with fellow farmers. Ask questions, share knowledge, and learn from the community."
              cta="Join Community"
            />
            <FeatureCard
              to="/marketplace"
              icon="🌤️"
              title="Weather Insights"
              description="Access real-time weather data and forecasts to plan your agricultural activities better."
              cta="View Weather"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            textAlign: 'center'
          }}>
            <StatCard number="100+" label="Active Farmers" />
            <StatCard number="500+" label="Crop Listings" />
            <StatCard number="12+" label="Diseases Detected" />
            <StatCard number="24/7" label="AI Support" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section style={{
          padding: '100px 0',
          background: 'linear-gradient(135deg, #1d7a4f 0%, #2d8f5f 100%)',
          color: 'white',
          textAlign: 'center'
        }}>
          <div className="container">
            <h2 style={{
              fontSize: '2.5rem',
              fontWeight: 600,
              marginBottom: '20px',
              color: 'white'
            }}>
              Ready to get started?
            </h2>
            <p style={{
              fontSize: '1.25rem',
              marginBottom: '40px',
              opacity: 0.9,
              maxWidth: '600px',
              margin: '0 auto 40px'
            }}>
              Join thousands of farmers and buyers transforming agriculture with technology.
            </p>
            <Link to="/register">
              <button className="btn" style={{
                padding: '16px 48px',
                fontSize: '1.125rem',
                background: 'white',
                color: '#1d7a4f',
                fontWeight: 600
              }}>
                Create Free Account
              </button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ to, icon, title, description, cta }) => (
  <Link to={to} style={{ textDecoration: 'none', display: 'block' }}>
    <div style={{
      background: 'white',
      padding: '40px',
      borderRadius: '18px',
      border: '1px solid #e5e5e7',
      height: '100%',
      transition: 'all 0.2s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.12)';
      e.currentTarget.style.borderColor = '#1d7a4f';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = '#e5e5e7';
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '20px'
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1d1d1f',
        marginBottom: '12px'
      }}>
        {title}
      </h3>
      <p style={{
        color: '#6e6e73',
        lineHeight: 1.6,
        marginBottom: '20px',
        fontSize: '0.95rem'
      }}>
        {description}
      </p>
      <span style={{
        color: '#1d7a4f',
        fontWeight: 500,
        fontSize: '0.95rem'
      }}>
        {cta} →
      </span>
    </div>
  </Link>
);

// Stat Card Component
const StatCard = ({ number, label }) => (
  <div>
    <div style={{
      fontSize: '3rem',
      fontWeight: 700,
      color: '#1d7a4f',
      marginBottom: '8px',
      lineHeight: 1
    }}>
      {number}
    </div>
    <div style={{
      fontSize: '1rem',
      color: '#6e6e73',
      fontWeight: 500
    }}>
      {label}
    </div>
  </div>
);

export default Home;
