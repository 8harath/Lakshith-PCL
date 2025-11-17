# 🔧 Technical Setup Guide

## For Developers & Advanced Users

This guide provides detailed technical information for developers, system administrators, and advanced users who want to understand the application architecture and deployment options.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Management](#database-management)
5. [API Documentation](#api-documentation)
6. [AI Integration Details](#ai-integration-details)
7. [Deployment Options](#deployment-options)
8. [Performance Optimization](#performance-optimization)
9. [Security Considerations](#security-considerations)
10. [Contributing Guidelines](#contributing-guidelines)

---

## Architecture Overview

### Tech Stack

**Backend:**
```
Python 3.8+
├── Flask 3.0.0 (Web framework)
├── SQLAlchemy 3.1.1 (ORM)
├── Flask-Bcrypt 1.0.1 (Password hashing)
├── Flask-CORS 4.0.0 (Cross-origin resource sharing)
├── google-generativeai 0.3.2 (Gemini AI integration)
├── Pillow 10.1.0 (Image processing)
└── gunicorn 21.2.0 (Production server)
```

**Frontend:**
```
Node.js 16+
├── React 18.2.0 (UI framework)
├── Vite 5.0.8 (Build tool)
├── React Router 6.20.0 (Routing)
└── Axios 1.6.2 (HTTP client)
```

**Database:**
- SQLite (Development)
- PostgreSQL (Production recommended)

### System Architecture

```
┌─────────────┐      HTTP/JSON       ┌─────────────┐
│   React     │ ◄──────────────────► │   Flask     │
│  Frontend   │    REST API Calls    │   Backend   │
│  (Port 5173)│                      │  (Port 5000)│
└─────────────┘                      └──────┬──────┘
                                            │
                                            │ SQLAlchemy ORM
                                            ▼
                                     ┌──────────────┐
                                     │   SQLite DB  │
                                     └──────────────┘
                                            ▲
                                            │
                                     ┌──────┴──────┐
                                     │  External   │
                                     │   APIs      │
                                     ├─────────────┤
                                     │ Gemini AI   │
                                     │ Open-Meteo  │
                                     └─────────────┘
```

---

## Local Development Setup

### Prerequisites

- Python 3.8+ with pip
- Node.js 16+ with npm
- Git (for version control)
- Code editor (VS Code recommended)

### Backend Setup (Detailed)

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Initialize database:**
   ```bash
   python seed_data.py
   ```

6. **Run development server:**
   ```bash
   python app.py
   ```

   Server runs at: http://localhost:5000

### Frontend Setup (Detailed)

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   echo "VITE_API_URL=http://localhost:5000/api" > .env
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

   Server runs at: http://localhost:5173

### Development Workflow

```bash
# Terminal 1: Backend with hot-reload
cd backend
source venv/bin/activate
export FLASK_ENV=development
python app.py

# Terminal 2: Frontend with hot-reload
cd frontend
npm run dev

# Terminal 3: Optional - Watch logs, run tests, etc.
```

---

## Environment Configuration

### Backend Environment Variables

File: `backend/.env`

```bash
# Flask Configuration
SECRET_KEY=your-super-secret-key-change-in-production
FLASK_ENV=development

# Database
DATABASE_URL=sqlite:///crop_marketplace.db
# For PostgreSQL: postgresql://user:password@localhost/dbname

# Gemini AI (Optional)
GEMINI_API_KEY=your-gemini-api-key-here
# Get from: https://aistudio.google.com/app/apikey

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,http://localhost:5174

# Server Settings
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
```

### Frontend Environment Variables

File: `frontend/.env`

```bash
# API Configuration
VITE_API_URL=http://localhost:5000/api

# For production:
# VITE_API_URL=https://your-backend-domain.com/api
```

### Security Best Practices

1. **Never commit `.env` files to version control**
2. **Use strong SECRET_KEY in production:**
   ```python
   import secrets
   secrets.token_hex(32)  # Generate secure key
   ```
3. **Rotate API keys regularly**
4. **Use environment-specific configurations**

---

## Database Management

### SQLite (Development)

**Location:** `backend/crop_marketplace.db`

**Advantages:**
- No setup required
- Perfect for development
- Single file database
- Zero configuration

**Limitations:**
- Not suitable for production
- No concurrent writes
- Limited scalability

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    password_hash VARCHAR(200) NOT NULL,
    role VARCHAR(20) NOT NULL,  -- farmer, client, pharma
    display_name VARCHAR(100),
    location VARCHAR(200),
    contact_info VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings Table
CREATE TABLE listings (
    id INTEGER PRIMARY KEY,
    farmer_id INTEGER NOT NULL,
    crop_name VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    quality VARCHAR(50),
    price FLOAT NOT NULL,
    quantity FLOAT NOT NULL,
    unit VARCHAR(20) NOT NULL,
    location VARCHAR(200) NOT NULL,
    harvest_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Q&A Posts Table
CREATE TABLE qa_posts (
    id INTEGER PRIMARY KEY,
    author_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    tags VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Database Commands

```bash
# Reset database (WARNING: Deletes all data!)
cd backend
rm crop_marketplace.db
python seed_data.py

# Access database directly
sqlite3 crop_marketplace.db
# Then use SQL commands:
.tables                    # List all tables
.schema users             # Show table structure
SELECT * FROM users;      # Query data
.exit                     # Exit
```

### Migration to PostgreSQL

For production, migrate to PostgreSQL:

1. **Install PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib

   # macOS
   brew install postgresql
   ```

2. **Create database:**
   ```sql
   CREATE DATABASE crop_marketplace;
   CREATE USER crop_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE crop_marketplace TO crop_user;
   ```

3. **Update .env:**
   ```bash
   DATABASE_URL=postgresql://crop_user:secure_password@localhost/crop_marketplace
   ```

4. **Install psycopg2:**
   ```bash
   pip install psycopg2-binary
   ```

---

## API Documentation

### Authentication Endpoints

#### POST `/api/register`
Register new user

**Request:**
```json
{
  "username": "string",
  "password": "string",
  "role": "farmer|client|pharma",
  "display_name": "string (optional)",
  "location": "string (optional)",
  "contact_info": "string (optional)"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "farmer1",
    "role": "farmer",
    "display_name": "Farmer One"
  }
}
```

#### POST `/api/login`
User login

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": { /* user object */ }
}
```

### Marketplace Endpoints

#### GET `/api/listings`
Get all listings with filters

**Query Parameters:**
- `crop_name` (string): Filter by crop name
- `location` (string): Filter by location
- `min_price` (float): Minimum price
- `max_price` (float): Maximum price
- `sort_by` (string): created_at|price|harvest_date
- `sort_order` (string): asc|desc

**Response:**
```json
{
  "listings": [
    {
      "id": 1,
      "crop_name": "Rice",
      "variety": "Basmati",
      "price": 50,
      "quantity": 1000,
      "unit": "kg",
      "location": "Punjab",
      "farmer": { /* farmer details */ }
    }
  ],
  "total": 10
}
```

### AI Endpoints

#### POST `/api/predict-disease-image`
Analyze plant image for diseases

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "disease_detected": "Early Blight",
    "confidence": "High",
    "severity": "Medium",
    "affected_crops": "Tomato, Potato",
    "symptoms_visible": "Dark spots with concentric rings",
    "management": {
      "cultural": "...",
      "chemical": "...",
      "organic": "..."
    },
    "preventive_measures": "...",
    "additional_notes": "..."
  },
  "model": "gemini-1.5-flash",
  "disclaimer": "..."
}
```

#### POST `/api/gemini-chat`
Agricultural chatbot

**Request:**
```json
{
  "prompt": "How do I improve soil fertility?"
}
```

**Response:**
```json
{
  "response": "To improve soil fertility, you can...",
  "model": "gemini-pro",
  "disclaimer": "..."
}
```

### Complete API List

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/register` | POST | No | Register new user |
| `/api/login` | POST | No | User login |
| `/api/logout` | POST | Yes | User logout |
| `/api/me` | GET | Yes | Get current user |
| `/api/profile` | PUT | Yes | Update profile |
| `/api/listings` | GET | No | Get all listings |
| `/api/listings/:id` | GET | No | Get single listing |
| `/api/listings` | POST | Yes (Farmer) | Create listing |
| `/api/listings/:id` | PUT | Yes (Owner) | Update listing |
| `/api/listings/:id` | DELETE | Yes (Owner) | Delete listing |
| `/api/my-listings` | GET | Yes (Farmer) | Get user's listings |
| `/api/recommend` | POST | No | Get crop recommendations |
| `/api/predict-disease` | POST | No | Predict disease from symptoms |
| `/api/predict-disease-image` | POST | No | Analyze disease from image |
| `/api/common-symptoms` | GET | No | Get symptom list |
| `/api/qa-posts` | GET | No | Get all Q&A posts |
| `/api/qa-posts/:id` | GET | No | Get single post |
| `/api/qa-posts` | POST | Yes | Create Q&A post |
| `/api/weather` | GET | No | Get weather data |
| `/api/gemini-chat` | POST | No | AI chatbot |
| `/api/health` | GET | No | Health check |

---

## AI Integration Details

### Gemini API Configuration

**Models Used:**
- `gemini-pro`: Text generation (chatbot, recommendations)
- `gemini-1.5-flash`: Vision analysis (image-based disease detection)

**Rate Limits (Free Tier):**
- 60 requests per minute
- 1,500 requests per day
- Adequate for development and small-scale production

### Custom Prompts

#### Chatbot Prompt Engineering

The chatbot uses a carefully crafted system prompt to:
1. **Restrict scope** to agricultural topics only
2. **Provide context** about Indian farming conditions
3. **Ensure safety** by avoiding harmful advice
4. **Maintain quality** through structured responses

See: `backend/app.py:605-635`

#### Image Analysis Prompt

The vision model receives:
1. **Structured JSON schema** for consistent responses
2. **Context** about agricultural pathology
3. **Safety guidelines** to avoid misuse
4. **Indian farming focus** for regional relevance

See: `backend/app.py:425-448`

### Error Handling

```python
try:
    response = gemini_model.generate_content(prompt)
    # Process response
except Exception as e:
    # Graceful degradation
    return jsonify({'error': 'AI service unavailable'}), 503
```

### Cost Management

**Tips to minimize API costs:**
1. Implement request caching
2. Add rate limiting per user
3. Use smaller models where possible
4. Cache common questions/responses
5. Monitor usage via Google Cloud Console

---

## Deployment Options

### Option 1: Local Network (Easiest)

Access from devices on same network:

1. Find your local IP:
   ```bash
   # Linux/Mac
   ifconfig | grep "inet "

   # Windows
   ipconfig
   ```

2. Update `backend/.env`:
   ```bash
   ALLOWED_ORIGINS=http://192.168.1.x:5173
   ```

3. Run servers:
   ```bash
   # Backend
   python app.py --host=0.0.0.0

   # Frontend - update vite.config.js
   server: { host: '0.0.0.0' }
   ```

4. Access from other devices:
   ```
   http://192.168.1.x:5173
   ```

### Option 2: GitHub Codespaces (Cloud Development)

Perfect for development without local setup:

1. Open repository in GitHub
2. Click "Code" → "Codespaces" → "Create codespace"
3. Wait for environment to load
4. Run setup:
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
5. Start application:
   ```bash
   ./run.sh
   ```
6. Codespaces will provide URLs for accessing the app

**Advantages:**
- No local installation needed
- Access from anywhere
- Free tier available
- Automatic port forwarding

### Option 3: Traditional Cloud Deployment

See `DEPLOYMENT.md` for detailed instructions on:
- Render.com (recommended)
- Railway.app
- Heroku
- DigitalOcean
- AWS

### Option 4: Docker Deployment

Create `Dockerfile`:

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt

COPY backend/ .
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app:app"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=sqlite:///crop_marketplace.db
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./backend:/app

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
```

---

## Performance Optimization

### Backend Optimization

1. **Database Indexing:**
   ```python
   # In models.py
   class Listing(db.Model):
       __table_args__ = (
           db.Index('idx_crop_location', 'crop_name', 'location'),
       )
   ```

2. **Query Optimization:**
   ```python
   # Use lazy loading
   listings = Listing.query.options(
       db.joinedload(Listing.farmer)
   ).all()
   ```

3. **Caching:**
   ```python
   from flask_caching import Cache
   cache = Cache(app, config={'CACHE_TYPE': 'simple'})

   @app.route('/api/weather')
   @cache.cached(timeout=600)  # Cache for 10 minutes
   def get_weather():
       # ...
   ```

### Frontend Optimization

1. **Code Splitting:**
   ```javascript
   // Lazy load routes
   const Chatbot = React.lazy(() => import('./pages/Chatbot'));
   ```

2. **Image Optimization:**
   ```javascript
   // Compress before upload
   const compressImage = (file) => {
       // Implementation
   };
   ```

3. **Build Optimization:**
   ```bash
   npm run build  # Creates optimized production build
   ```

---

## Security Considerations

### Production Checklist

- [ ] Change SECRET_KEY to strong random value
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Enable security headers
- [ ] Use environment variables for secrets
- [ ] Implement input sanitization
- [ ] Add SQL injection protection (SQLAlchemy helps)
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup database regularly

### Security Headers

```python
from flask_talisman import Talisman

talisman = Talisman(
    app,
    force_https=True,
    strict_transport_security=True,
    content_security_policy={
        'default-src': "'self'",
        'img-src': '*',
        'script-src': "'self' 'unsafe-inline'",
    }
)
```

### Rate Limiting

```python
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/gemini-chat')
@limiter.limit("10 per minute")
def gemini_chat():
    # ...
```

---

## Contributing Guidelines

### Development Workflow

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Create Pull Request

### Code Standards

**Python (Backend):**
- Follow PEP 8
- Use type hints where possible
- Write docstrings for functions
- Add unit tests

**JavaScript (Frontend):**
- Follow Airbnb style guide
- Use functional components
- Add PropTypes or TypeScript
- Write component tests

### Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Documentation

- Update README.md for user-facing changes
- Update TECHNICAL_SETUP.md for developer changes
- Add JSDoc comments for complex functions
- Update API documentation

---

## Monitoring & Logging

### Application Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
logger.info('Application started')
```

### Error Tracking

Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for frontend monitoring
- **New Relic** for APM

---

## Backup & Recovery

### Database Backup

```bash
# SQLite backup
cp backend/crop_marketplace.db backend/backup_$(date +%Y%m%d).db

# PostgreSQL backup
pg_dump crop_marketplace > backup_$(date +%Y%m%d).sql

# Automated backup script
#!/bin/bash
BACKUP_DIR="/path/to/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
cp backend/crop_marketplace.db "$BACKUP_DIR/db_$TIMESTAMP.db"
find "$BACKUP_DIR" -name "db_*.db" -mtime +30 -delete  # Keep 30 days
```

---

## Troubleshooting (Advanced)

### Debug Mode

```bash
# Backend
export FLASK_DEBUG=1
export FLASK_ENV=development
python app.py

# Frontend
npm run dev -- --debug
```

### Database Issues

```bash
# Check database integrity
sqlite3 crop_marketplace.db "PRAGMA integrity_check;"

# Vacuum database (optimize)
sqlite3 crop_marketplace.db "VACUUM;"

# Export data
sqlite3 crop_marketplace.db ".dump" > dump.sql
```

### Performance Profiling

```python
from flask import Flask
from werkzeug.middleware.profiler import ProfilerMiddleware

app.wsgi_app = ProfilerMiddleware(app.wsgi_app)
```

---

## Useful Commands

```bash
# Backend
pip freeze > requirements.txt          # Update dependencies
pip install -r requirements.txt --upgrade  # Upgrade all
python -m flask routes                 # List all routes

# Frontend
npm outdated                           # Check for updates
npm update                             # Update packages
npm run build                          # Production build
npm run preview                        # Preview production build

# Database
sqlite3 crop_marketplace.db ".dump" > backup.sql  # Backup
sqlite3 crop_marketplace.db < backup.sql          # Restore

# Git
git log --oneline --graph             # View commit history
git stash                             # Temporarily save changes
git stash pop                         # Restore stashed changes
```

---

## Resources

### Documentation
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Gemini API Documentation](https://ai.google.dev/docs)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [DB Browser for SQLite](https://sqlitebrowser.org/) - Database management
- [React DevTools](https://react.dev/learn/react-developer-tools) - React debugging

---

## Support

For technical issues:
1. Check this documentation
2. Review error logs
3. Search existing GitHub issues
4. Create new issue with details

---

**Happy Coding! 🚀**
