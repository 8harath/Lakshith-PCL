# Deployment Guide

This guide explains how to deploy the Crop Marketplace application to production.

## Architecture

This application consists of two parts:
- **Frontend**: React + Vite application (deployed to Vercel)
- **Backend**: Flask API (deployed separately - Render/Railway recommended)

## Option 1: Quick Deploy to Vercel (Frontend Only)

### Step 1: Deploy to Vercel

1. **Push your code to GitHub** (if not already done)

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your GitHub repository

3. **Vercel will auto-detect the configuration** from `vercel.json`

4. **Add Environment Variable**:
   - In Vercel dashboard, go to: Settings → Environment Variables
   - Add: `VITE_API_URL` = `http://localhost:5000/api` (temporary)
   - You'll update this after deploying the backend

5. **Deploy**: Click "Deploy"

Your frontend will be live at: `https://your-project.vercel.app`

### Step 2: Deploy Backend to Render (Free Tier)

1. **Go to** [render.com](https://render.com)

2. **Sign up/Login** with GitHub

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: crop-marketplace-backend
     - **Root Directory**: backend
     - **Runtime**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `gunicorn app:app`

4. **Add Environment Variables** in Render:
   ```
   SECRET_KEY=your-secret-key-here
   FLASK_ENV=production
   ```

5. **Important**: Add `gunicorn` to `backend/requirements.txt`:
   ```bash
   cd backend
   echo "gunicorn==21.2.0" >> requirements.txt
   ```

6. **Deploy**: Render will build and deploy

7. **Get Backend URL**: Copy the URL (e.g., `https://crop-marketplace-backend.onrender.com`)

### Step 3: Connect Frontend to Backend

1. Go back to **Vercel Dashboard**
2. Navigate to: Settings → Environment Variables
3. **Update** `VITE_API_URL` to your Render backend URL + `/api`
   - Example: `https://crop-marketplace-backend.onrender.com/api`
4. **Redeploy** the frontend (go to Deployments tab → click on latest → "Redeploy")

### Step 4: Configure Backend CORS

Update `backend/app.py` to allow your Vercel domain:

```python
from flask_cors import CORS

# Add after app = Flask(__name__)
CORS(app, origins=[
    'http://localhost:3000',
    'https://your-project.vercel.app'  # Add your Vercel URL
], supports_credentials=True)
```

Redeploy the backend on Render.

---

## Option 2: Deploy to Railway (Easier for Full-Stack)

Railway can host both frontend and backend in one project.

### Step 1: Deploy to Railway

1. **Go to** [railway.app](https://railway.app)
2. **Sign in** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. Select your repository

### Step 2: Configure Services

Railway will detect your app structure. You'll need to create two services:

#### Backend Service:
- **Root Directory**: `backend`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Environment Variables**:
  - `SECRET_KEY=your-secret-key`
  - `PORT=5000`

#### Frontend Service:
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview`
- **Environment Variables**:
  - `VITE_API_URL=<backend-service-url>/api`

### Step 3: Get URLs

Railway provides public URLs for both services. Update the frontend's `VITE_API_URL` with the backend URL.

---

## Option 3: All-in-One Render Deployment

You can also deploy both as separate services on Render:

1. **Backend**: Web Service (as described above)
2. **Frontend**: Static Site
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Environment Variable**: `VITE_API_URL=<backend-url>/api`

---

## Important Notes

### Database Considerations

⚠️ **SQLite Limitations**: The current setup uses SQLite, which has limitations in cloud environments:

- **Render/Railway**: SQLite files may be lost on restarts (ephemeral filesystem)
- **Recommended Solution**: Migrate to PostgreSQL for production

#### Quick PostgreSQL Migration (Render):

1. Create a PostgreSQL database in Render
2. Update `backend/requirements.txt`:
   ```
   flask-sqlalchemy
   psycopg2-binary
   ```
3. Update `backend/config.py` to use PostgreSQL connection string
4. Redeploy

### CORS Configuration

Ensure your backend allows requests from your frontend domain. Update `app.py`:

```python
CORS(app, origins=[
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app',
    'https://your-frontend-domain.onrender.com'
], supports_credentials=True)
```

### Session Management

For production, you need a proper session store. Current file-based sessions won't work in serverless/distributed environments. Consider:
- Redis sessions
- JWT tokens
- Database-backed sessions

### Environment Variables

Never commit these to git:
- `.env` files
- API keys
- Secret keys

Always use the platform's environment variable settings.

---

## Testing Your Deployment

1. **Frontend**: Visit your Vercel/Render URL
2. **Backend Health Check**: Visit `<backend-url>/api/listings`
3. **Test Login/Registration**
4. **Test Creating Listings**
5. **Test Recommendations Engine**

---

## Recommended: Vercel + Render Setup

For the best free-tier experience:

✅ **Frontend on Vercel**:
- Fast global CDN
- Automatic HTTPS
- Easy GitHub integration
- Instant preview deployments

✅ **Backend on Render**:
- Free PostgreSQL database
- Auto-deploy from GitHub
- Persistent storage
- Built-in environment variables

---

## Quick Start Commands

### Add gunicorn to backend:
```bash
cd backend
echo "gunicorn==21.2.0" >> requirements.txt
git add requirements.txt
git commit -m "Add gunicorn for production deployment"
git push
```

### Test local production build:
```bash
# Frontend
cd frontend
npm run build
npm run preview

# Backend
cd backend
pip install gunicorn
gunicorn app:app
```

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Railway Docs**: https://docs.railway.app

## Next Steps After Deployment

1. Set up PostgreSQL database
2. Configure Redis for sessions
3. Add monitoring (Sentry, LogRocket)
4. Set up CI/CD pipeline
5. Add SSL certificates (automatic on Vercel/Render)
6. Configure custom domain
7. Set up email notifications
8. Add analytics

---

**Your app is now live! 🚀**
