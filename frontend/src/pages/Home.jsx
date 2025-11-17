import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { PlantLeaf, Tree, Sprout, WheatStalk, Flower } from '../components/PlantDecorations';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <>
      {/* Hero Section with Plant Decorations */}
      <div style={styles.heroSection}>
        {/* Decorative Plants */}
        <div style={styles.decorationLeft}>
          <Tree style={{ opacity: 0.4 }} />
        </div>
        <div style={styles.decorationRight}>
          <Sprout style={{ opacity: 0.3 }} />
          <PlantLeaf style={{ opacity: 0.3, marginLeft: '20px' }} />
        </div>
        <div style={styles.decorationBottomLeft}>
          <Flower style={{ opacity: 0.4 }} />
        </div>
        <div style={styles.decorationBottomRight}>
          <WheatStalk style={{ opacity: 0.3 }} />
        </div>

        <div className="container">
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>
              Welcome to Crop Marketplace
            </h1>
            <p style={styles.heroSubtitle}>
              Your one-stop solution for crop trading, smart recommendations,
              and agricultural support powered by modern technology
            </p>

            {!isAuthenticated ? (
              <div style={styles.heroCTA}>
                <Link to="/login">
                  <button className="btn btn-primary" style={styles.ctaButton}>
                    Get Started
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn btn-secondary" style={styles.ctaButton}>
                    Register Now
                  </button>
                </Link>
              </div>
            ) : (
              <div style={styles.welcomeMessage}>
                <h2 style={styles.welcomeText}>
                  Hello, {user.display_name || user.username}!
                </h2>
                <p style={styles.roleText}>
                  Logged in as <strong>{user.role}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Features Grid */}
        <div style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Our Features</h2>
          <div className="grid grid-3">
            <Link to="/marketplace" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.featureCard}>
                <div style={styles.featureIcon}>🛒</div>
                <h3 style={styles.featureTitle}>Marketplace</h3>
                <p style={styles.featureDesc}>
                  Browse and purchase quality crops directly from verified farmers
                </p>
                <div style={styles.featureBadge}>Browse Now</div>
              </div>
            </Link>

            <Link to="/recommendations" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.featureCard}>
                <div style={styles.featureIcon}>🌱</div>
                <h3 style={styles.featureTitle}>Smart Recommendations</h3>
                <p style={styles.featureDesc}>
                  Get personalized crop recommendations based on your field conditions
                </p>
                <div style={styles.featureBadge}>Try Now</div>
              </div>
            </Link>

            <Link to="/disease-predictor" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.featureCard}>
                <div style={styles.featureIcon}>🩺</div>
                <h3 style={styles.featureTitle}>Disease Detection</h3>
                <p style={styles.featureDesc}>
                  Identify crop diseases and get treatment recommendations instantly
                </p>
                <div style={styles.featureBadge}>Check Health</div>
              </div>
            </Link>

            <Link to="/chatbot" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.featureCard}>
                <div style={styles.featureIcon}>🤖</div>
                <h3 style={styles.featureTitle}>AI Assistant</h3>
                <p style={styles.featureDesc}>
                  Get instant answers to your agricultural questions from our AI chatbot
                </p>
                <div style={styles.featureBadge}>Ask Questions</div>
              </div>
            </Link>

            <Link to="/community" style={{ textDecoration: 'none' }}>
              <div className="card" style={styles.featureCard}>
                <div style={styles.featureIcon}>💬</div>
                <h3 style={styles.featureTitle}>Community Forum</h3>
                <p style={styles.featureDesc}>
                  Connect with farmers, share knowledge, and learn from experiences
                </p>
                <div style={styles.featureBadge}>Join Discussion</div>
              </div>
            </Link>

            {isAuthenticated && user.role === 'farmer' && (
              <Link to="/create-listing" style={{ textDecoration: 'none' }}>
                <div className="card" style={{...styles.featureCard, ...styles.farmerSpecial}}>
                  <div style={styles.featureIcon}>📝</div>
                  <h3 style={styles.featureTitle}>Create Listing</h3>
                  <p style={styles.featureDesc}>
                    List your crops for sale and reach buyers across the platform
                  </p>
                  <div style={styles.featureBadge}>Add Listing</div>
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Benefits Section */}
        <div style={styles.benefitsSection}>
          <div className="card" style={styles.benefitsCard}>
            <h3 style={styles.sectionTitle}>Why Choose Us?</h3>
            <div className="grid grid-4" style={styles.benefitsGrid}>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>✅</div>
                <h4 style={styles.benefitTitle}>Direct Trading</h4>
                <p style={styles.benefitText}>
                  Connect directly with farmers and buyers
                </p>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🎯</div>
                <h4 style={styles.benefitTitle}>Smart Tools</h4>
                <p style={styles.benefitText}>
                  AI-powered recommendations and predictions
                </p>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🌍</div>
                <h4 style={styles.benefitTitle}>Wide Reach</h4>
                <p style={styles.benefitText}>
                  Access marketplace from anywhere
                </p>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🔒</div>
                <h4 style={styles.benefitTitle}>Secure Platform</h4>
                <p style={styles.benefitText}>
                  Safe and reliable transactions
                </p>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>📊</div>
                <h4 style={styles.benefitTitle}>Data Insights</h4>
                <p style={styles.benefitText}>
                  Make informed agricultural decisions
                </p>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🤝</div>
                <h4 style={styles.benefitTitle}>Community Support</h4>
                <p style={styles.benefitText}>
                  Learn from fellow farmers
                </p>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>⚡</div>
                <h4 style={styles.benefitTitle}>Fast & Easy</h4>
                <p style={styles.benefitText}>
                  Simple, intuitive interface
                </p>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>💰</div>
                <h4 style={styles.benefitTitle}>Fair Pricing</h4>
                <p style={styles.benefitText}>
                  Get the best value for crops
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div style={styles.ctaSection}>
            <div className="card" style={styles.ctaCard}>
              <h3 style={styles.ctaTitle}>Ready to Get Started?</h3>
              <p style={styles.ctaText}>
                Join thousands of farmers and buyers transforming agriculture with technology
              </p>
              <div style={styles.ctaButtons}>
                <Link to="/register">
                  <button className="btn btn-primary" style={styles.largeButton}>
                    Create Free Account
                  </button>
                </Link>
                <Link to="/marketplace">
                  <button className="btn btn-secondary" style={styles.largeButton}>
                    Explore Marketplace
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Demo Credentials Info */}
        {!isAuthenticated && (
          <div style={styles.demoSection}>
            <div className="alert alert-info">
              <h4 style={{ marginBottom: '10px', fontWeight: '700' }}>
                🎯 Demo Credentials
              </h4>
              <p style={{ marginBottom: '10px' }}>
                Try the platform with these test accounts:
              </p>
              <div style={styles.credentialsGrid}>
                <div>
                  <strong>Farmer Account:</strong>
                  <br />
                  Username: <code style={styles.code}>farmer</code>
                  <br />
                  Password: <code style={styles.code}>farmer123</code>
                </div>
                <div>
                  <strong>Client Account:</strong>
                  <br />
                  Username: <code style={styles.code}>client</code>
                  <br />
                  Password: <code style={styles.code}>client123</code>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  heroSection: {
    position: 'relative',
    background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 50%, #52b788 100%)',
    color: 'white',
    padding: '80px 0',
    marginBottom: '40px',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  decorationLeft: {
    position: 'absolute',
    left: '-40px',
    top: '20px',
    zIndex: 1,
  },
  decorationRight: {
    position: 'absolute',
    right: '20px',
    top: '40px',
    zIndex: 1,
    display: 'flex',
    gap: '10px',
  },
  decorationBottomLeft: {
    position: 'absolute',
    left: '50px',
    bottom: '-20px',
    zIndex: 1,
  },
  decorationBottomRight: {
    position: 'absolute',
    right: '-10px',
    bottom: '0',
    zIndex: 1,
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    maxWidth: '900px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '900',
    marginBottom: '20px',
    lineHeight: '1.2',
    textShadow: '2px 2px 8px rgba(0,0,0,0.2)',
  },
  heroSubtitle: {
    fontSize: '1.35rem',
    marginBottom: '40px',
    opacity: 0.95,
    lineHeight: '1.6',
    maxWidth: '700px',
    margin: '0 auto 40px',
  },
  heroCTA: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaButton: {
    padding: '14px 40px',
    fontSize: '1.1rem',
    fontWeight: '700',
  },
  welcomeMessage: {
    padding: '30px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  },
  welcomeText: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  roleText: {
    fontSize: '1.2rem',
    opacity: 0.9,
  },
  featuresSection: {
    marginBottom: '60px',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    textAlign: 'center',
    color: '#2d6a4f',
    marginBottom: '40px',
    position: 'relative',
    paddingBottom: '15px',
  },
  featureCard: {
    textAlign: 'center',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  featureIcon: {
    fontSize: '4rem',
    marginBottom: '20px',
    animation: 'bounce 2s ease-in-out infinite',
  },
  featureTitle: {
    color: '#2d6a4f',
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '12px',
  },
  featureDesc: {
    color: '#64748b',
    lineHeight: '1.7',
    flex: 1,
  },
  featureBadge: {
    marginTop: '20px',
    padding: '8px 20px',
    background: 'linear-gradient(135deg, #2d6a4f, #52b788)',
    color: 'white',
    borderRadius: '20px',
    fontWeight: '600',
    fontSize: '0.95rem',
    display: 'inline-block',
  },
  farmerSpecial: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    border: '2px solid #f59e0b',
  },
  benefitsSection: {
    marginBottom: '60px',
  },
  benefitsCard: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
  },
  benefitsGrid: {
    marginTop: '30px',
  },
  benefitItem: {
    textAlign: 'center',
    padding: '20px',
  },
  benefitIcon: {
    fontSize: '2.5rem',
    marginBottom: '12px',
  },
  benefitTitle: {
    color: '#2d6a4f',
    fontSize: '1.1rem',
    fontWeight: '700',
    marginBottom: '8px',
  },
  benefitText: {
    color: '#64748b',
    fontSize: '0.95rem',
    lineHeight: '1.5',
  },
  ctaSection: {
    marginBottom: '60px',
  },
  ctaCard: {
    textAlign: 'center',
    background: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 100%)',
    color: 'white',
    padding: '60px 40px',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '20px',
  },
  ctaText: {
    fontSize: '1.25rem',
    marginBottom: '40px',
    opacity: 0.95',
  },
  ctaButtons: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  largeButton: {
    padding: '16px 48px',
    fontSize: '1.15rem',
  },
  demoSection: {
    marginBottom: '40px',
  },
  credentialsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '15px',
  },
  code: {
    background: '#1e293b',
    color: '#10b981',
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
};

// Add bounce animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;
document.head.appendChild(styleSheet);

export default Home;
