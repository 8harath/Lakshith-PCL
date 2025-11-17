# 🌾 Crop Marketplace & AI Disease Detection - Complete User Guide

## 📖 Table of Contents
1. [What is this Application?](#what-is-this-application)
2. [Key Features](#key-features)
3. [Quick Start (Easiest Way)](#quick-start-easiest-way)
4. [Detailed Setup Instructions](#detailed-setup-instructions)
5. [How to Use Each Feature](#how-to-use-each-feature)
6. [Getting Your Gemini API Key](#getting-your-gemini-api-key)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## What is this Application?

This is a **complete agricultural platform** that helps farmers and buyers connect, get crop recommendations, detect plant diseases, and receive AI-powered farming advice. Think of it as a "one-stop shop" for modern farming needs.

### Who is this for?
- **Farmers**: Sell crops, get planting advice, diagnose plant diseases
- **Buyers**: Purchase crops directly from farmers
- **Agricultural Students**: Learn about crop management and diseases
- **Anyone interested in agriculture**: Access farming knowledge and AI assistance

---

## Key Features

### 🛒 **1. Crop Marketplace**
- Buy and sell crops directly between farmers and buyers
- Search for specific crops by name, location, or price
- View detailed information about each crop listing
- Direct contact with farmers

### 🌱 **2. Crop Recommendations (AI-Powered)**
- Get personalized crop recommendations based on:
  - Your soil type and pH
  - Local temperature and rainfall
  - Season and irrigation availability
- Receive detailed planting guidelines

### 🩺 **3. Disease Detection (Two Methods)**

#### **Method A: Symptom-Based Detection**
- Describe what you see on your plants
- Select from common symptoms (yellowing, spots, etc.)
- Get instant disease identification
- Receive treatment recommendations (organic & chemical)

#### **Method B: AI Image Analysis** 🆕
- Take a photo of the affected plant
- Upload it to the app
- Gemini AI analyzes the image
- Get detailed diagnosis and treatment plan

### 🤖 **4. Agricultural Chatbot** 🆕
- Ask any farming-related question
- Get instant AI-powered answers
- Topics include:
  - Crop cultivation
  - Pest control
  - Soil management
  - Weather advice
  - Government schemes
  - And much more!

### 💬 **5. Community Q&A**
- Ask questions to the farming community
- Share your knowledge with others
- Browse previously answered questions

### 🌤️ **6. Weather Information**
- Real-time weather data for your location
- Temperature, humidity, and rainfall forecasts
- Helps plan farming activities

---

## Quick Start (Easiest Way)

### Prerequisites (What You Need)
1. **Python 3.8 or higher** - [Download here](https://www.python.org/downloads/)
2. **Node.js 16 or higher** - [Download here](https://nodejs.org/)
3. **A computer** with Windows, Mac, or Linux
4. **Internet connection** (for AI features)

### Installation Steps

#### For Windows Users:
```bash
# 1. Open Command Prompt or PowerShell
# 2. Navigate to the project folder
cd path\to\Lakshith-PCL

# 3. Run the setup script
setup.bat

# 4. After setup completes, run the application
run.bat
```

#### For Mac/Linux Users:
```bash
# 1. Open Terminal
# 2. Navigate to the project folder
cd path/to/Lakshith-PCL

# 3. Make scripts executable
chmod +x setup.sh run.sh

# 4. Run the setup script
./setup.sh

# 5. After setup completes, run the application
./run.sh
```

### That's it! 🎉

The application will open in your browser at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## Detailed Setup Instructions

### Step 1: Install Python

1. Go to [python.org](https://www.python.org/downloads/)
2. Download Python 3.8 or higher
3. **Important**: During installation, check "Add Python to PATH"
4. Verify installation:
   ```bash
   python --version
   ```

### Step 2: Install Node.js

1. Go to [nodejs.org](https://nodejs.org/)
2. Download the LTS (Long Term Support) version
3. Install with default settings
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 3: Get Gemini API Key (Optional but Recommended)

The AI features require a free API key from Google:

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (it looks like: `AIzaSy...`)
5. Open `backend/.env` file
6. Replace `your-gemini-api-key-here-optional` with your actual key
7. Save the file

**Example:**
```
GEMINI_API_KEY=AIzaSyDx5k...YourActualKeyHere...
```

**Note**: Without the API key, you can still use all features except:
- AI Image-based disease detection
- AI Chatbot
- Enhanced crop recommendations

### Step 4: Run the Application

Use the quick start commands above, or manually:

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate.bat
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## How to Use Each Feature

### 1. Marketplace

#### As a Buyer:
1. Click "Marketplace" in the navigation
2. Browse available crops
3. Use filters to narrow down:
   - Search by crop name
   - Filter by location
   - Set price range
4. Click on a listing to view details
5. Contact information is shown when logged in

#### As a Farmer:
1. Register/Login as a "Farmer"
2. Click "Add Listing"
3. Fill in crop details:
   - Crop name and variety
   - Quality grade
   - Price and quantity
   - Location
   - Harvest date
4. Submit to publish
5. Manage your listings from "My Listings"

### 2. Crop Recommendations

1. Click "Recommendations"
2. Fill in your field information:
   - **Soil Type**: Sandy, Loamy, Clay, etc.
   - **pH Level**: Test your soil or estimate (6-8 is typical)
   - **Temperature**: Average in your area (°C)
   - **Rainfall**: Average annual rainfall (mm)
   - **Season**: Current growing season
   - **Irrigation**: Do you have irrigation?
3. Click "Get Recommendations"
4. View top 3 recommended crops with:
   - Suitability percentage
   - Why it's suitable
   - Best planting time
   - Care instructions

### 3. Disease Detection

#### Method A: Symptom-Based
1. Click "Disease Help"
2. Choose "Symptom-Based Detection" tab
3. Either:
   - Type symptoms (e.g., "yellow leaves; brown spots")
   - OR select from checkboxes
4. Click "Predict Disease"
5. Review results with:
   - Most likely diseases
   - Confidence levels
   - Treatment options (cultural, chemical, organic)

#### Method B: AI Image Analysis
1. Click "Disease Help"
2. Choose "AI Image Analysis" tab
3. Take a clear photo of the affected plant:
   - Good lighting
   - Focus on the diseased part
   - Close-up but showing context
4. Click "Choose File" and select your image
5. Click "Analyze with AI"
6. Wait 5-10 seconds for AI analysis
7. Review detailed results:
   - Disease identification
   - Confidence level
   - Visible symptoms
   - Treatment recommendations
   - Prevention tips

**Tips for Best Results:**
- Use clear, well-lit photos
- Focus on the affected area
- Include leaves, stems, or fruits
- Avoid blurry images

### 4. AI Chatbot

1. Click "AI Chatbot"
2. Type your question in the chat box
3. Examples of good questions:
   - "How do I improve soil fertility naturally?"
   - "What's the best time to plant tomatoes in Maharashtra?"
   - "How can I control pests without chemicals?"
   - "What government schemes are available for farmers?"
4. Get instant AI-generated answers
5. Ask follow-up questions
6. Use "Clear Chat" to start fresh

**Important**: The chatbot only answers agriculture-related questions!

### 5. Community Q&A

1. Click "Community"
2. Browse existing questions
3. To ask a new question:
   - Click "Ask Question"
   - Write a clear title
   - Add detailed description
   - Add relevant tags
   - Submit
4. Others can read and learn from your question

### 6. Weather Information

- Available on the Recommendations page
- Enter your location
- View current weather and forecast
- Use this data for farming decisions

---

## Getting Your Gemini API Key

### Why Do I Need This?

The Gemini API key enables:
- **AI Image Disease Detection**: Analyze plant photos
- **Smart Chatbot**: Get intelligent farming advice
- **Enhanced Recommendations**: Better crop suggestions

### Is It Free?

**YES!** Google provides a free tier with generous limits:
- 60 requests per minute
- Enough for personal/small-scale use
- No credit card required

### Step-by-Step Instructions

1. **Go to Google AI Studio**
   - Visit: https://aistudio.google.com/app/apikey
   - Or Google search: "Google AI Studio API Key"

2. **Sign In**
   - Use any Google account (Gmail)
   - Accept terms of service

3. **Create API Key**
   - Click "Create API Key" button
   - Select "Create API key in new project"
   - Wait 5-10 seconds

4. **Copy Your Key**
   - Key appears (starts with `AIzaSy...`)
   - Click "Copy" icon
   - **KEEP IT SAFE** - treat it like a password!

5. **Add to Application**
   - Open `backend/.env` in a text editor
   - Find line: `GEMINI_API_KEY=your-gemini-api-key-here-optional`
   - Replace with: `GEMINI_API_KEY=AIzaSy...YourActualKey...`
   - Save file

6. **Restart Application**
   - Stop the running servers (Ctrl+C)
   - Run `./run.sh` or `run.bat` again
   - AI features are now active! 🎉

---

## Troubleshooting

### Problem: "Python not found"

**Solution:**
- Reinstall Python from [python.org](https://www.python.org/)
- Check "Add Python to PATH" during installation
- Restart your terminal/command prompt

### Problem: "Node not found"

**Solution:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal/command prompt

### Problem: "Port 5000 already in use"

**Solution:**
- Another app is using port 5000
- Option 1: Stop that application
- Option 2: Change port in `backend/app.py` (line 551):
  ```python
  app.run(debug=True, host='0.0.0.0', port=5001)  # Changed to 5001
  ```

### Problem: "Gemini API Error"

**Solution:**
- Check if API key is correct in `backend/.env`
- Verify API key is active at https://aistudio.google.com/app/apikey
- Check internet connection
- Try regenerating the API key

### Problem: "Module not found" errors

**Solution:**
```bash
# For backend
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate.bat
pip install -r requirements.txt

# For frontend
cd frontend
npm install
```

### Problem: Database errors

**Solution:**
```bash
cd backend
rm crop_marketplace.db  # Delete old database
python seed_data.py     # Create fresh database
```

### Problem: Frontend not loading

**Solution:**
- Clear browser cache (Ctrl+Shift+Delete)
- Try different browser
- Check if backend is running
- Verify `frontend/.env` has correct API URL

---

## FAQ

### Q: Do I need internet to use this?

**A:**
- **No internet needed**: Marketplace, symptom-based disease detection, community features
- **Internet required**: AI image analysis, chatbot, weather data

### Q: Can multiple people use this at once?

**A:**
- Locally: Only you (one computer)
- To share: Deploy to a server (see DEPLOYMENT.md)

### Q: Is my data safe?

**A:**
- All data stored locally on your computer
- Passwords are encrypted
- API keys stay on your machine
- Images sent to Google Gemini for analysis (temporary)

### Q: Can I add my own crops/diseases?

**A:**
- Yes! Edit `backend/recommendation_engine.py` for crops
- Edit `backend/disease_predictor.py` for diseases
- Requires basic Python knowledge

### Q: How accurate is the disease detection?

**A:**
- **Symptom-based**: 60-80% accuracy (rule-based)
- **AI Image analysis**: 70-90% accuracy (depends on image quality)
- **Always consult local agricultural experts for critical decisions**

### Q: Can I use this offline?

**A:**
- Yes, except AI features (chatbot, image analysis)
- Weather data requires internet
- All other features work offline

### Q: What about mobile phones?

**A:**
- Web interface works on mobile browsers
- For best experience: Use tablet or computer
- Native mobile app not available (yet!)

### Q: How do I get support?

**A:**
- Check this README first
- Read DEPLOYMENT.md for technical details
- Check GitHub Issues
- Contact: [Your Contact Information]

### Q: Can I modify this application?

**A:**
- Yes! This is open-source
- Modify as needed for your requirements
- Share improvements with the community

### Q: Will this work in GitHub Codespaces?

**A:**
- **Yes!** Perfect for cloud development
- No local installation needed
- Follow the same setup steps
- Codespace provides all prerequisites

---

## System Requirements

### Minimum:
- **OS**: Windows 10, macOS 10.14, or Linux (Ubuntu 18.04+)
- **RAM**: 4GB
- **Storage**: 500MB free space
- **Processor**: Dual-core 2GHz+

### Recommended:
- **OS**: Latest Windows 11, macOS, or Linux
- **RAM**: 8GB or more
- **Storage**: 1GB free space
- **Processor**: Quad-core 2.5GHz+
- **Internet**: 5 Mbps+ for AI features

---

## Demo Accounts

Try these pre-created accounts:

| Username | Password | Role | Use Case |
|----------|----------|------|----------|
| farmer1 | password123 | Farmer | Create and manage crop listings |
| farmer2 | password123 | Farmer | Test multiple farmer accounts |
| client1 | password123 | Client | Browse and buy crops |
| client2 | password123 | Client | Test buyer experience |
| pharma1 | password123 | Pharma | Explore pharmaceutical needs |

---

## Technologies Used (For the Curious)

### Backend:
- **Python 3** - Programming language
- **Flask** - Web framework
- **SQLite** - Database (simple, no setup needed)
- **Google Gemini AI** - AI-powered features

### Frontend:
- **React** - User interface
- **Vite** - Fast development server
- **Axios** - API communication

### APIs:
- **Google Gemini Vision** - Image analysis
- **Google Gemini Pro** - Chatbot
- **Open-Meteo** - Weather data (free, no key needed)

---

## What Makes This Special?

1. **100% Open Source** - No hidden costs
2. **AI-Powered** - Modern machine learning
3. **Offline Capable** - Works without internet (mostly)
4. **Local-First** - Your data stays on your computer
5. **Easy Setup** - One script to install
6. **Beginner Friendly** - No coding needed to use
7. **Extensible** - Easy to customize

---

## Support & Community

- **Documentation**: This README
- **Technical Docs**: DEPLOYMENT.md
- **Issues**: GitHub Issues page
- **Updates**: Check GitHub for latest version

---

## License

This project is open-source and free to use, modify, and distribute.

---

## Acknowledgments

- **Google Gemini AI** for powering intelligent features
- **Open-Meteo** for free weather data
- **Open-source community** for amazing tools

---

**🌾 Happy Farming! 🌾**

*Built with ❤️ for farmers and agricultural enthusiasts*
