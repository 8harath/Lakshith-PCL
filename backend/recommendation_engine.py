"""
Rule-based Crop Recommendation Engine
Uses deterministic rules to recommend crops based on field attributes
"""

import json

# Crop database with growing conditions
CROP_DATABASE = {
    'rice': {
        'soil_types': ['clay', 'loamy', 'alluvial'],
        'ph_range': (5.5, 7.0),
        'temp_range': (20, 35),
        'rainfall_range': (1000, 2500),
        'humidity_range': (60, 90),
        'irrigation': 'required',
        'seasons': ['kharif', 'rabi'],
        'sowing_window': 'June-July (Kharif), November-December (Rabi)',
        'care_notes': 'Requires standing water during growth. Ensure proper drainage before harvest.'
    },
    'wheat': {
        'soil_types': ['loamy', 'clay', 'sandy-loam'],
        'ph_range': (6.0, 7.5),
        'temp_range': (10, 25),
        'rainfall_range': (300, 800),
        'humidity_range': (40, 70),
        'irrigation': 'required',
        'seasons': ['rabi'],
        'sowing_window': 'October-November',
        'care_notes': 'Cool weather crop. Requires 4-6 irrigations. Avoid waterlogging.'
    },
    'cotton': {
        'soil_types': ['black', 'loamy', 'sandy-loam'],
        'ph_range': (5.5, 8.5),
        'temp_range': (21, 35),
        'rainfall_range': (500, 1000),
        'humidity_range': (50, 80),
        'irrigation': 'required',
        'seasons': ['kharif'],
        'sowing_window': 'April-June',
        'care_notes': 'Requires warm weather and moderate rainfall. Sensitive to waterlogging.'
    },
    'maize': {
        'soil_types': ['loamy', 'sandy-loam', 'clay'],
        'ph_range': (5.5, 7.5),
        'temp_range': (18, 32),
        'rainfall_range': (500, 900),
        'humidity_range': (50, 70),
        'irrigation': 'optional',
        'seasons': ['kharif', 'rabi', 'zaid'],
        'sowing_window': 'June-July (Kharif), October-November (Rabi), February-March (Zaid)',
        'care_notes': 'Versatile crop. Ensure good drainage. Responds well to fertilizers.'
    },
    'sugarcane': {
        'soil_types': ['loamy', 'clay', 'alluvial'],
        'ph_range': (6.0, 7.5),
        'temp_range': (20, 35),
        'rainfall_range': (1000, 1500),
        'humidity_range': (60, 85),
        'irrigation': 'required',
        'seasons': ['kharif', 'rabi'],
        'sowing_window': 'February-March, September-October',
        'care_notes': 'Long duration crop (10-12 months). Requires regular irrigation.'
    },
    'pulses': {
        'soil_types': ['loamy', 'sandy-loam', 'clay'],
        'ph_range': (6.0, 7.5),
        'temp_range': (15, 30),
        'rainfall_range': (300, 700),
        'humidity_range': (40, 70),
        'irrigation': 'optional',
        'seasons': ['rabi', 'kharif'],
        'sowing_window': 'September-October (Rabi), June-July (Kharif)',
        'care_notes': 'Nitrogen fixing. Good for soil health. Avoid waterlogging.'
    },
    'groundnut': {
        'soil_types': ['sandy-loam', 'loamy', 'red'],
        'ph_range': (6.0, 7.0),
        'temp_range': (20, 30),
        'rainfall_range': (500, 1000),
        'humidity_range': (50, 75),
        'irrigation': 'optional',
        'seasons': ['kharif', 'rabi'],
        'sowing_window': 'June-July (Kharif), October-November (Rabi)',
        'care_notes': 'Requires well-drained soil. Deep ploughing recommended.'
    },
    'soybean': {
        'soil_types': ['loamy', 'clay', 'sandy-loam'],
        'ph_range': (6.0, 7.5),
        'temp_range': (20, 30),
        'rainfall_range': (450, 700),
        'humidity_range': (50, 75),
        'irrigation': 'optional',
        'seasons': ['kharif'],
        'sowing_window': 'June-July',
        'care_notes': 'Nitrogen fixing legume. Avoid waterlogging. Good rotation crop.'
    },
    'tomato': {
        'soil_types': ['loamy', 'sandy-loam', 'red'],
        'ph_range': (6.0, 7.0),
        'temp_range': (18, 27),
        'rainfall_range': (400, 800),
        'humidity_range': (50, 70),
        'irrigation': 'required',
        'seasons': ['kharif', 'rabi', 'zaid'],
        'sowing_window': 'All year depending on region',
        'care_notes': 'High value crop. Requires regular irrigation and disease management.'
    },
    'potato': {
        'soil_types': ['loamy', 'sandy-loam'],
        'ph_range': (5.5, 7.0),
        'temp_range': (15, 25),
        'rainfall_range': (500, 750),
        'humidity_range': (60, 80),
        'irrigation': 'required',
        'seasons': ['rabi'],
        'sowing_window': 'October-November',
        'care_notes': 'Cool weather crop. Ensure good drainage. Earthing up is essential.'
    },
    'onion': {
        'soil_types': ['loamy', 'sandy-loam', 'red'],
        'ph_range': (6.0, 7.5),
        'temp_range': (13, 24),
        'rainfall_range': (400, 650),
        'humidity_range': (50, 70),
        'irrigation': 'required',
        'seasons': ['kharif', 'rabi'],
        'sowing_window': 'June-July (Kharif), October-November (Rabi)',
        'care_notes': 'High market demand. Requires good quality seeds and regular irrigation.'
    }
}


def calculate_crop_score(crop_data, user_input):
    """Calculate suitability score for a crop based on user inputs"""
    score = 0
    max_score = 0
    reasons = []

    # Soil type match (weight: 20)
    max_score += 20
    if user_input.get('soil_type', '').lower() in crop_data['soil_types']:
        score += 20
        reasons.append(f"Soil type ({user_input['soil_type']}) is suitable")
    else:
        reasons.append(f"Soil type ({user_input['soil_type']}) is not ideal")

    # pH range (weight: 15)
    max_score += 15
    soil_ph = user_input.get('soil_ph')
    if soil_ph:
        ph_min, ph_max = crop_data['ph_range']
        if ph_min <= soil_ph <= ph_max:
            score += 15
            reasons.append(f"Soil pH ({soil_ph}) is within optimal range")
        else:
            reasons.append(f"Soil pH ({soil_ph}) is outside optimal range ({ph_min}-{ph_max})")

    # Temperature (weight: 20)
    max_score += 20
    avg_temp = user_input.get('average_temperature')
    if avg_temp:
        temp_min, temp_max = crop_data['temp_range']
        if temp_min <= avg_temp <= temp_max:
            score += 20
            reasons.append(f"Temperature ({avg_temp}°C) is suitable")
        elif abs(avg_temp - temp_min) <= 5 or abs(avg_temp - temp_max) <= 5:
            score += 10
            reasons.append(f"Temperature ({avg_temp}°C) is marginally suitable")
        else:
            reasons.append(f"Temperature ({avg_temp}°C) is not suitable ({temp_min}-{temp_max}°C)")

    # Rainfall (weight: 20)
    max_score += 20
    avg_rainfall = user_input.get('average_rainfall')
    if avg_rainfall:
        rain_min, rain_max = crop_data['rainfall_range']
        if rain_min <= avg_rainfall <= rain_max:
            score += 20
            reasons.append(f"Rainfall ({avg_rainfall}mm) is suitable")
        elif rain_min - 200 <= avg_rainfall <= rain_max + 200:
            score += 10
            reasons.append(f"Rainfall ({avg_rainfall}mm) is marginally suitable")
        else:
            reasons.append(f"Rainfall ({avg_rainfall}mm) is not suitable ({rain_min}-{rain_max}mm)")

    # Humidity (weight: 10)
    max_score += 10
    humidity = user_input.get('humidity')
    if humidity:
        hum_min, hum_max = crop_data['humidity_range']
        if hum_min <= humidity <= hum_max:
            score += 10
            reasons.append(f"Humidity ({humidity}%) is suitable")

    # Irrigation (weight: 10)
    max_score += 10
    irrigation = user_input.get('irrigation_available', False)
    if crop_data['irrigation'] == 'required' and irrigation:
        score += 10
        reasons.append("Irrigation is available (required for this crop)")
    elif crop_data['irrigation'] == 'optional':
        score += 10
        reasons.append("Irrigation requirement is flexible")
    elif crop_data['irrigation'] == 'required' and not irrigation:
        reasons.append("Irrigation not available but required for this crop")

    # Season match (weight: 5)
    max_score += 5
    season = user_input.get('season', '').lower()
    if season in crop_data['seasons']:
        score += 5
        reasons.append(f"Season ({season}) is suitable")

    # Calculate percentage
    percentage = (score / max_score * 100) if max_score > 0 else 0

    return {
        'score': score,
        'max_score': max_score,
        'percentage': round(percentage, 2),
        'reasons': reasons
    }


def get_recommendations(user_input):
    """
    Main recommendation function
    Returns top 2-3 suitable crops with rationale
    """
    crop_scores = []

    for crop_name, crop_data in CROP_DATABASE.items():
        result = calculate_crop_score(crop_data, user_input)
        crop_scores.append({
            'crop_name': crop_name.title(),
            'score': result['score'],
            'percentage': result['percentage'],
            'sowing_window': crop_data['sowing_window'],
            'care_notes': crop_data['care_notes'],
            'rationale': ' | '.join(result['reasons'][:3])  # Top 3 reasons
        })

    # Sort by score descending
    crop_scores.sort(key=lambda x: x['score'], reverse=True)

    # Return top 3
    recommendations = crop_scores[:3]

    return {
        'recommendations': recommendations,
        'input_summary': {
            'soil_type': user_input.get('soil_type'),
            'season': user_input.get('season'),
            'location': user_input.get('location', 'Not specified'),
            'irrigation_available': user_input.get('irrigation_available', False)
        }
    }


def validate_input(user_input):
    """Validate user input for recommendation"""
    required_fields = ['soil_type', 'average_temperature', 'average_rainfall']
    errors = []

    for field in required_fields:
        if field not in user_input or user_input[field] is None:
            errors.append(f"Missing required field: {field}")

    return errors
