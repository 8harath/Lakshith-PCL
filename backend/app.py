from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import requests
import os
import base64
from io import BytesIO
from PIL import Image

from config import Config
from models import db, User, Listing, QAPost
from recommendation_engine import get_recommendations, validate_input as validate_recommendation_input
from disease_predictor import predict_disease, get_common_symptoms

app = Flask(__name__)
app.config.from_object(Config)

# CORS configuration - supports both local development and production
allowed_origins = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173').split(',')
CORS(app, supports_credentials=True, origins=allowed_origins)
bcrypt = Bcrypt(app)
db.init_app(app)

# Gemini API setup (optional)
try:
    if app.config['GEMINI_ENABLED']:
        import google.generativeai as genai
        genai.configure(api_key=app.config['GEMINI_API_KEY'])
        # Updated model names for current Gemini API
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        gemini_vision_model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Gemini API configured successfully with gemini-1.5-flash")
    else:
        gemini_model = None
        gemini_vision_model = None
except Exception as e:
    print(f"❌ Gemini API not configured: {e}")
    gemini_model = None
    gemini_vision_model = None


# ==================== Authentication Routes ====================

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()

    # Validate input
    required_fields = ['username', 'password', 'role']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409

    # Validate role
    if data['role'] not in ['farmer', 'client', 'pharma']:
        return jsonify({'error': 'Invalid role. Must be farmer, client, or pharma'}), 400

    # Create new user
    password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    new_user = User(
        username=data['username'],
        password_hash=password_hash,
        role=data['role'],
        display_name=data.get('display_name', data['username']),
        location=data.get('location', ''),
        contact_info=data.get('contact_info', '')
    )

    db.session.add(new_user)
    db.session.commit()

    # Create session
    session['user_id'] = new_user.id
    session['username'] = new_user.username
    session['role'] = new_user.role

    return jsonify({
        'message': 'User registered successfully',
        'user': new_user.to_dict()
    }), 201


@app.route('/api/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()

    if 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Missing username or password'}), 400

    user = User.query.filter_by(username=data['username']).first()

    if not user or not bcrypt.check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401

    # Create session
    session['user_id'] = user.id
    session['username'] = user.username
    session['role'] = user.role

    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict()
    }), 200


@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200


@app.route('/api/me', methods=['GET'])
def get_current_user():
    """Get current logged-in user"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'user': user.to_dict(include_sensitive=True)}), 200


@app.route('/api/profile', methods=['PUT'])
def update_profile():
    """Update user profile"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()

    # Update allowed fields
    if 'display_name' in data:
        user.display_name = data['display_name']
    if 'location' in data:
        user.location = data['location']
    if 'contact_info' in data:
        user.contact_info = data['contact_info']

    db.session.commit()

    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict(include_sensitive=True)
    }), 200


# ==================== Marketplace Routes ====================

@app.route('/api/listings', methods=['GET'])
def get_listings():
    """Get all listings with optional filters"""
    query = Listing.query

    # Apply filters
    crop_name = request.args.get('crop_name')
    if crop_name:
        query = query.filter(Listing.crop_name.ilike(f'%{crop_name}%'))

    location = request.args.get('location')
    if location:
        query = query.filter(Listing.location.ilike(f'%{location}%'))

    min_price = request.args.get('min_price', type=float)
    if min_price is not None:
        query = query.filter(Listing.price >= min_price)

    max_price = request.args.get('max_price', type=float)
    if max_price is not None:
        query = query.filter(Listing.price <= max_price)

    # Sorting
    sort_by = request.args.get('sort_by', 'created_at')
    sort_order = request.args.get('sort_order', 'desc')

    if sort_by == 'price':
        query = query.order_by(Listing.price.desc() if sort_order == 'desc' else Listing.price.asc())
    elif sort_by == 'harvest_date':
        query = query.order_by(Listing.harvest_date.desc() if sort_order == 'desc' else Listing.harvest_date.asc())
    else:
        query = query.order_by(Listing.created_at.desc() if sort_order == 'desc' else Listing.created_at.asc())

    listings = query.all()

    return jsonify({
        'listings': [listing.to_dict() for listing in listings],
        'total': len(listings)
    }), 200


@app.route('/api/listings/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    """Get a specific listing by ID"""
    listing = Listing.query.get(listing_id)

    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    # Include contact info if user is logged in
    include_contact = 'user_id' in session

    return jsonify({'listing': listing.to_dict(include_contact=include_contact)}), 200


@app.route('/api/listings', methods=['POST'])
def create_listing():
    """Create a new listing (farmers only)"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    user = User.query.get(session['user_id'])
    if user.role != 'farmer':
        return jsonify({'error': 'Only farmers can create listings'}), 403

    data = request.get_json()

    # Validate required fields
    required_fields = ['crop_name', 'price', 'quantity', 'unit', 'location', 'harvest_date']
    for field in required_fields:
        if field not in data or data[field] == '':
            return jsonify({'error': f'Missing required field: {field}'}), 400

    # Parse harvest date
    try:
        harvest_date = datetime.strptime(data['harvest_date'], '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid harvest_date format. Use YYYY-MM-DD'}), 400

    # Create listing
    new_listing = Listing(
        farmer_id=user.id,
        crop_name=data['crop_name'],
        variety=data.get('variety', ''),
        quality=data.get('quality', ''),
        price=float(data['price']),
        quantity=float(data['quantity']),
        unit=data['unit'],
        location=data['location'],
        harvest_date=harvest_date,
        description=data.get('description', '')
    )

    db.session.add(new_listing)
    db.session.commit()

    return jsonify({
        'message': 'Listing created successfully',
        'listing': new_listing.to_dict()
    }), 201


@app.route('/api/listings/<int:listing_id>', methods=['PUT'])
def update_listing(listing_id):
    """Update a listing (owner only)"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    if listing.farmer_id != session['user_id']:
        return jsonify({'error': 'Unauthorized'}), 403

    data = request.get_json()

    # Update fields
    if 'crop_name' in data:
        listing.crop_name = data['crop_name']
    if 'variety' in data:
        listing.variety = data['variety']
    if 'quality' in data:
        listing.quality = data['quality']
    if 'price' in data:
        listing.price = float(data['price'])
    if 'quantity' in data:
        listing.quantity = float(data['quantity'])
    if 'unit' in data:
        listing.unit = data['unit']
    if 'location' in data:
        listing.location = data['location']
    if 'harvest_date' in data:
        try:
            listing.harvest_date = datetime.strptime(data['harvest_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid harvest_date format. Use YYYY-MM-DD'}), 400
    if 'description' in data:
        listing.description = data['description']

    db.session.commit()

    return jsonify({
        'message': 'Listing updated successfully',
        'listing': listing.to_dict()
    }), 200


@app.route('/api/listings/<int:listing_id>', methods=['DELETE'])
def delete_listing(listing_id):
    """Delete a listing (owner only)"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({'error': 'Listing not found'}), 404

    if listing.farmer_id != session['user_id']:
        return jsonify({'error': 'Unauthorized'}), 403

    db.session.delete(listing)
    db.session.commit()

    return jsonify({'message': 'Listing deleted successfully'}), 200


@app.route('/api/my-listings', methods=['GET'])
def get_my_listings():
    """Get current user's listings"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    listings = Listing.query.filter_by(farmer_id=session['user_id']).order_by(Listing.created_at.desc()).all()

    return jsonify({
        'listings': [listing.to_dict(include_contact=True) for listing in listings],
        'total': len(listings)
    }), 200


# ==================== Recommendation Routes ====================

@app.route('/api/recommend', methods=['POST'])
def recommend_crops():
    """Get crop recommendations based on field attributes"""
    data = request.get_json()

    # Validate input
    errors = validate_recommendation_input(data)
    if errors:
        return jsonify({'errors': errors}), 400

    # Get recommendations
    result = get_recommendations(data)

    # Optional: Enhance with Gemini
    if gemini_model and data.get('use_gemini', False):
        try:
            prompt = f"""Based on the following agricultural data, provide additional insights:
Soil Type: {data.get('soil_type')}
Temperature: {data.get('average_temperature')}°C
Rainfall: {data.get('average_rainfall')}mm
Season: {data.get('season')}
Irrigation: {'Available' if data.get('irrigation_available') else 'Not Available'}

Top recommended crops: {', '.join([r['crop_name'] for r in result['recommendations']])}

Provide brief additional insights or tips for successful cultivation."""

            response = gemini_model.generate_content(prompt)
            result['gemini_insights'] = response.text
        except Exception as e:
            result['gemini_insights'] = f"Gemini API error: {str(e)}"

    return jsonify(result), 200


# ==================== Disease Prediction Routes ====================

@app.route('/api/predict-disease', methods=['POST'])
def predict_disease_route():
    """Predict disease based on symptoms"""
    data = request.get_json()

    if 'symptoms' not in data or not data['symptoms']:
        return jsonify({'error': 'Missing symptoms'}), 400

    result = predict_disease(data['symptoms'])

    return jsonify(result), 200


@app.route('/api/common-symptoms', methods=['GET'])
def get_symptoms():
    """Get list of common symptoms for checkboxes"""
    symptoms = get_common_symptoms()
    return jsonify({'symptoms': symptoms}), 200


@app.route('/api/predict-disease-image', methods=['POST'])
def predict_disease_from_image():
    """Predict disease from uploaded image using Gemini Vision API"""
    if not gemini_vision_model:
        return jsonify({'error': 'Gemini Vision API not configured. Please add GEMINI_API_KEY to your environment variables.'}), 503

    try:
        data = request.get_json()

        if 'image' not in data:
            return jsonify({'error': 'Missing image data'}), 400

        # Extract base64 image data
        image_data = data['image']

        # Remove data URL prefix if present
        if ',' in image_data:
            image_data = image_data.split(',')[1]

        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(BytesIO(image_bytes))

        # Prepare prompt for Gemini
        prompt = """You are an expert agricultural pathologist. Analyze this plant/crop image and identify any diseases or problems.

Please provide your response in the following JSON format:
{
    "disease_detected": "Name of the disease or 'Healthy' if no disease detected",
    "confidence": "High/Medium/Low",
    "severity": "Very High/High/Medium/Low/None",
    "affected_crops": "List of crops commonly affected by this disease",
    "symptoms_visible": "List the symptoms you can see in the image",
    "management": {
        "cultural": "Cultural control methods",
        "chemical": "Chemical control recommendations",
        "organic": "Organic/biological control methods"
    },
    "preventive_measures": "General preventive measures",
    "additional_notes": "Any other relevant information"
}

IMPORTANT:
- Be specific and accurate in your diagnosis
- If you're not certain, indicate lower confidence
- Focus only on agricultural/plant diseases
- If the image doesn't show a plant or crop, respond with an error message
- Provide practical, actionable advice for Indian farming conditions"""

        # Generate response using Gemini Vision
        response = gemini_vision_model.generate_content([prompt, image])

        # Parse the response
        response_text = response.text

        # Try to extract JSON from the response
        import json
        try:
            # Remove markdown code blocks if present
            if '```json' in response_text:
                response_text = response_text.split('```json')[1].split('```')[0].strip()
            elif '```' in response_text:
                response_text = response_text.split('```')[1].split('```')[0].strip()

            result = json.loads(response_text)
            result['raw_response'] = response.text
        except json.JSONDecodeError:
            # If JSON parsing fails, return the raw response
            result = {
                'disease_detected': 'Analysis Complete',
                'raw_response': response.text,
                'note': 'Unable to parse structured response, showing raw analysis'
            }

        return jsonify({
            'success': True,
            'analysis': result,
            'model': 'gemini-1.5-flash',
            'disclaimer': 'This is an AI-powered analysis. For accurate diagnosis and treatment, please consult local agricultural experts or pathologists.'
        }), 200

    except Exception as e:
        return jsonify({
            'error': f'Image analysis failed: {str(e)}',
            'details': 'Please ensure the image is clear and shows the affected plant/crop clearly.'
        }), 500


# ==================== Q&A / Community Routes ====================

@app.route('/api/qa-posts', methods=['GET'])
def get_qa_posts():
    """Get all Q&A posts"""
    posts = QAPost.query.order_by(QAPost.created_at.desc()).all()

    return jsonify({
        'posts': [post.to_dict() for post in posts],
        'total': len(posts)
    }), 200


@app.route('/api/qa-posts', methods=['POST'])
def create_qa_post():
    """Create a new Q&A post"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401

    data = request.get_json()

    if 'title' not in data or 'body' not in data:
        return jsonify({'error': 'Missing title or body'}), 400

    new_post = QAPost(
        author_id=session['user_id'],
        title=data['title'],
        body=data['body'],
        tags=','.join(data.get('tags', []))
    )

    db.session.add(new_post)
    db.session.commit()

    return jsonify({
        'message': 'Post created successfully',
        'post': new_post.to_dict()
    }), 201


@app.route('/api/qa-posts/<int:post_id>', methods=['GET'])
def get_qa_post(post_id):
    """Get a specific Q&A post"""
    post = QAPost.query.get(post_id)

    if not post:
        return jsonify({'error': 'Post not found'}), 404

    return jsonify({'post': post.to_dict()}), 200


# ==================== Weather Integration ====================

@app.route('/api/weather', methods=['GET'])
def get_weather():
    """Get weather data from Open-Meteo API"""
    location = request.args.get('location')

    if not location:
        return jsonify({'error': 'Missing location parameter'}), 400

    try:
        # First, geocode the location to get coordinates
        # Using Open-Meteo's geocoding API
        geocode_url = f"https://geocoding-api.open-meteo.com/v1/search?name={location}&count=1"
        geocode_response = requests.get(geocode_url, timeout=5)
        geocode_data = geocode_response.json()

        if 'results' not in geocode_data or len(geocode_data['results']) == 0:
            return jsonify({'error': 'Location not found'}), 404

        lat = geocode_data['results'][0]['latitude']
        lon = geocode_data['results'][0]['longitude']
        location_name = geocode_data['results'][0]['name']

        # Get weather data
        weather_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto"
        weather_response = requests.get(weather_url, timeout=5)
        weather_data = weather_response.json()

        # Format response
        result = {
            'location': location_name,
            'coordinates': {'latitude': lat, 'longitude': lon},
            'current': {
                'temperature': weather_data['current']['temperature_2m'],
                'humidity': weather_data['current']['relative_humidity_2m'],
                'precipitation': weather_data['current']['precipitation']
            },
            'forecast': {
                'max_temp': weather_data['daily']['temperature_2m_max'][0],
                'min_temp': weather_data['daily']['temperature_2m_min'][0],
                'precipitation': weather_data['daily']['precipitation_sum'][0]
            }
        }

        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': f'Weather API error: {str(e)}'}), 500


# ==================== Gemini Integration (Optional) ====================

@app.route('/api/gemini-chat', methods=['POST'])
def gemini_chat():
    """Agricultural chatbot using Gemini API with custom prompts"""
    if not gemini_model:
        return jsonify({'error': 'Gemini API not configured. Please add GEMINI_API_KEY to your environment variables.'}), 503

    data = request.get_json()

    if 'prompt' not in data:
        return jsonify({'error': 'Missing prompt'}), 400

    try:
        # Strict agricultural context to prevent misuse
        agricultural_context = """You are an expert agricultural assistant specifically designed to help farmers and agricultural professionals in India.

IMPORTANT GUIDELINES:
1. ONLY answer questions related to:
   - Crop cultivation and farming practices
   - Plant diseases and pest management
   - Soil management and fertilization
   - Weather and climate for agriculture
   - Crop marketing and pricing
   - Agricultural equipment and technology
   - Livestock and animal husbandry
   - Organic farming and sustainable practices
   - Government schemes for farmers
   - Post-harvest management

2. If the user asks about topics OUTSIDE agriculture:
   - Politely decline and redirect them to agricultural topics
   - Say: "I'm specifically designed to help with agricultural and farming questions. Please ask me about crops, farming practices, diseases, soil management, or other agriculture-related topics."

3. Provide practical, actionable advice suitable for Indian farming conditions
4. Use simple, clear language that farmers can understand
5. Include specific recommendations when possible
6. Consider regional variations in India (climate zones, soil types, etc.)

7. For sensitive topics:
   - Always recommend consulting local agricultural experts for critical decisions
   - Mention government agricultural extension services when appropriate
   - Avoid medical advice (human health) - redirect to healthcare professionals

Your responses should be helpful, accurate, and focused on improving agricultural outcomes for Indian farmers."""

        full_prompt = f"{agricultural_context}\n\nUser question: {data['prompt']}"

        response = gemini_model.generate_content(full_prompt)

        return jsonify({
            'response': response.text,
            'model': 'gemini-pro',
            'disclaimer': 'This is AI-generated advice. For critical decisions, please consult local agricultural experts or extension services.'
        }), 200

    except Exception as e:
        return jsonify({'error': f'Gemini API error: {str(e)}'}), 500


# ==================== Database Initialization ====================

@app.route('/api/init-db', methods=['POST'])
def init_database():
    """Initialize database (for development only)"""
    db.create_all()
    return jsonify({'message': 'Database initialized successfully'}), 200


# ==================== Health Check ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'gemini_enabled': app.config['GEMINI_ENABLED']
    }), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
