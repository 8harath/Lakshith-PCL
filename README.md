# Crop Marketplace & Recommendation System - MVP

A comprehensive web application that combines a crop marketplace, AI-powered crop recommendations, and disease prediction system for farmers and buyers.

## Features

### 🛒 Marketplace
- Browse and search crop listings
- Filter by crop type, location, price range, and harvest date
- Detailed listing views with farmer contact information
- Farmer listing management (create, edit, delete)

### 🌱 Crop Recommendation Engine
- Rule-based recommendation system
- Personalized crop suggestions based on:
  - Soil type and pH
  - Temperature and rainfall
  - Humidity and irrigation availability
  - Seasonal conditions
- Optional Gemini AI integration for enhanced insights

### 🩺 Disease Predictor
- Text-based symptom input
- Rule-based disease identification
- Management recommendations (cultural, chemical, organic)
- Common symptom selection for easy input

### 💬 Community Q&A
- Ask and answer agricultural questions
- Tag-based organization
- Knowledge sharing among farmers

### 🌤️ Weather Integration
- Real-time weather data via Open-Meteo API
- Location-based forecasts
- Temperature, humidity, and precipitation data

## Tech Stack

### Backend
- **Framework**: Flask (Python)
- **Database**: SQLite
- **Authentication**: Flask-Bcrypt with session management
- **APIs**: RESTful API design
- **External APIs**: Open-Meteo (weather), Gemini (optional AI)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS (responsive design)

## Prerequisites

- Python 3.8+
- Node.js 16+ and npm
- Git

## Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd Lakshith-PCL
\`\`\`

### 2. Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (copy from example)
cp .env.example .env

# Edit .env file and add your API keys (optional)
# SECRET_KEY=your-secret-key-here
# GEMINI_API_KEY=your-gemini-api-key (optional)
\`\`\`

### 3. Initialize Database with Sample Data

\`\`\`bash
# Still in backend directory
python seed_data.py
\`\`\`

This will create the database and populate it with sample data including:
- 5 demo users (3 farmers, 2 clients)
- 8 sample crop listings
- 5 community Q&A posts

**Demo Login Credentials:**

**Farmers:**
- Username: `rajesh_farmer` | Password: `farmer123`
- Username: `priya_farms` | Password: `farmer123`
- Username: `suresh_agro` | Password: `farmer123`

**Clients:**
- Username: `anil_trader` | Password: `client123`
- Username: `neha_wholesale` | Password: `client123`

### 4. Frontend Setup

\`\`\`bash
# Open a new terminal window
cd frontend

# Install dependencies
npm install
\`\`\`

## Running the Application

You need to run both backend and frontend servers simultaneously.

### Terminal 1: Start Backend Server

\`\`\`bash
cd backend
python app.py
\`\`\`

Backend will run on: **http://localhost:5000**

### Terminal 2: Start Frontend Development Server

\`\`\`bash
cd frontend
npm run dev
\`\`\`

Frontend will run on: **http://localhost:3000**

### Access the Application

Open your browser and navigate to: **http://localhost:3000**

## Project Structure

\`\`\`
Lakshith-PCL/
├── backend/
│   ├── app.py                    # Main Flask application
│   ├── config.py                 # Configuration settings
│   ├── models.py                 # Database models
│   ├── recommendation_engine.py  # Crop recommendation logic
│   ├── disease_predictor.py      # Disease prediction logic
│   ├── seed_data.py             # Database seeding script
│   ├── requirements.txt          # Python dependencies
│   └── .env.example             # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Navigation component
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Marketplace.jsx  # Crop listings page
│   │   │   ├── ListingDetail.jsx # Single listing view
│   │   │   ├── CreateListing.jsx # Create new listing
│   │   │   ├── MyListings.jsx   # Farmer's listings
│   │   │   ├── Recommendations.jsx # Crop recommendations
│   │   │   ├── DiseasePredictor.jsx # Disease prediction
│   │   │   ├── Community.jsx    # Q&A forum
│   │   │   └── CreatePost.jsx   # Create Q&A post
│   │   ├── App.jsx              # Main app component
│   │   ├── AuthContext.jsx      # Authentication context
│   │   ├── api.js               # API service layer
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
\`\`\`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user
- `PUT /api/profile` - Update profile

### Marketplace
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing (farmer only)
- `PUT /api/listings/:id` - Update listing (owner only)
- `DELETE /api/listings/:id` - Delete listing (owner only)
- `GET /api/my-listings` - Get user's listings

### Recommendations
- `POST /api/recommend` - Get crop recommendations

### Disease Prediction
- `POST /api/predict-disease` - Predict disease from symptoms
- `GET /api/common-symptoms` - Get list of common symptoms

### Community
- `GET /api/qa-posts` - Get all Q&A posts
- `GET /api/qa-posts/:id` - Get single post
- `POST /api/qa-posts` - Create new post

### Weather
- `GET /api/weather?location=<city>` - Get weather data

### Gemini (Optional)
- `POST /api/gemini-chat` - Chat with Gemini AI

## Features Walkthrough

### For Farmers

1. **Register/Login** as a farmer
2. **Create Listings**: Add crop details, pricing, quantity, harvest dates
3. **Manage Listings**: View, edit, or delete your listings
4. **Get Recommendations**: Input field data to get crop suggestions
5. **Disease Help**: Identify crop diseases and get treatment advice
6. **Community**: Ask questions and share knowledge

### For Clients/Buyers

1. **Register/Login** as a client
2. **Browse Marketplace**: Search and filter available crops
3. **View Details**: See complete listing information and weather data
4. **Contact Farmers**: Get farmer contact information (when logged in)
5. **Community**: Ask questions and learn from others

## Optional Configuration

### Gemini API Integration

To enable Gemini AI features:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `backend/.env`:
   \`\`\`
   GEMINI_API_KEY=your-api-key-here
   \`\`\`
3. Restart the backend server

Gemini features include:
- Enhanced crop recommendation insights
- AI-powered agricultural Q&A

### Weather API

The application uses Open-Meteo API (free, no key required) for weather data. It's automatically enabled.

## Database Schema

### Users Table
- id, username, password_hash, role, display_name, location, contact_info, created_at

### Listings Table
- id, farmer_id, crop_name, variety, quality, price, quantity, unit, location, harvest_date, description, created_at

### QA Posts Table
- id, author_id, title, body, tags, created_at

## Troubleshooting

### Backend Issues

**Port 5000 already in use:**
\`\`\`bash
# Change port in backend/app.py (last line)
app.run(debug=True, host='0.0.0.0', port=5001)
\`\`\`

**Database errors:**
\`\`\`bash
# Delete existing database and recreate
rm crop_marketplace.db
python seed_data.py
\`\`\`

### Frontend Issues

**Port 3000 already in use:**
\`\`\`bash
# Vite will automatically suggest another port, or edit vite.config.js
\`\`\`

**API connection errors:**
- Ensure backend is running on port 5000
- Check browser console for CORS errors
- Verify proxy settings in `vite.config.js`

## Development Notes

### Rule-Based Engines

**Crop Recommendation:**
- Located in `backend/recommendation_engine.py`
- Uses deterministic scoring based on soil, climate, and resources
- Database of 11 common Indian crops with growing conditions

**Disease Prediction:**
- Located in `backend/disease_predictor.py`
- Pattern matching against 12 common crop diseases
- Provides cultural, chemical, and organic management options

### Security Considerations

For MVP/Demo:
- Passwords are hashed using bcrypt
- Session-based authentication
- Local-only deployment recommended

For Production (Future):
- Implement HTTPS
- Add CSRF protection
- Implement rate limiting
- Add email verification
- Use production-grade database (PostgreSQL)
- Implement proper logging and monitoring

## Future Enhancements

- [ ] Image-based disease detection using ML models
- [ ] Payment integration for transactions
- [ ] Delivery and logistics management
- [ ] Admin dashboard for monitoring
- [ ] Mobile application (React Native)
- [ ] Real-time chat between farmers and buyers
- [ ] Multi-language support
- [ ] Blockchain-based certification
- [ ] Market price prediction using ML

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review application logs (terminal output)
3. Create an issue in the repository

## License

This project is for educational/demonstration purposes.

## Acknowledgments

- Open-Meteo for weather API
- Google Gemini for AI capabilities
- Agricultural domain knowledge from various Indian farming resources

---

**Built with ❤️ for Indian Agriculture**
