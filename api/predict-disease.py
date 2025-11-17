"""
Vercel Serverless Function: Disease Prediction API
Predicts crop diseases based on symptoms
"""

from http.server import BaseHTTPRequestHandler
import json

# Disease database with symptoms and management
DISEASE_DATABASE = {
    'bacterial_blight': {
        'symptoms': ['water-soaked lesions', 'yellowing', 'leaf blight', 'wilting', 'bacterial ooze'],
        'crops': ['rice', 'cotton', 'beans'],
        'management': {
            'cultural': 'Use disease-free seeds. Practice crop rotation. Remove infected plant debris.',
            'chemical': 'Apply copper-based bactericides. Spray streptocycline (200-250 ppm).',
            'organic': 'Use bio-agents like Pseudomonas fluorescens. Neem-based sprays.'
        },
        'severity': 'high'
    },
    'powdery_mildew': {
        'symptoms': ['white powdery spots', 'leaf curling', 'stunted growth', 'powdery coating'],
        'crops': ['wheat', 'peas', 'cucurbits', 'grapes'],
        'management': {
            'cultural': 'Ensure proper spacing for air circulation. Avoid overhead irrigation.',
            'chemical': 'Apply sulfur dust or wettable sulfur. Use systemic fungicides like propiconazole.',
            'organic': 'Spray neem oil or potassium bicarbonate solution. Milk spray (1:9 ratio).'
        },
        'severity': 'medium'
    },
    'leaf_rust': {
        'symptoms': ['orange pustules', 'brown spots', 'rust colored', 'leaf yellowing'],
        'crops': ['wheat', 'coffee', 'beans'],
        'management': {
            'cultural': 'Use resistant varieties. Remove alternate hosts. Ensure field sanitation.',
            'chemical': 'Apply mancozeb or propiconazole. Early spray is crucial.',
            'organic': 'Use sulfur-based sprays. Bordeaux mixture application.'
        },
        'severity': 'high'
    },
    'early_blight': {
        'symptoms': ['dark spots', 'concentric rings', 'target spot', 'leaf drop', 'yellowing lower leaves'],
        'crops': ['tomato', 'potato', 'brinjal'],
        'management': {
            'cultural': 'Crop rotation (3-4 years). Remove infected leaves. Mulching to prevent soil splash.',
            'chemical': 'Apply mancozeb or chlorothalonil. Start spraying before disease onset.',
            'organic': 'Copper-based fungicides. Bacillus subtilis bio-fungicide.'
        },
        'severity': 'medium'
    },
    'late_blight': {
        'symptoms': ['water-soaked lesions', 'white fungal growth', 'rapid wilting', 'brown patches', 'tuber rot'],
        'crops': ['potato', 'tomato'],
        'management': {
            'cultural': 'Use certified disease-free seeds. Destroy infected plants immediately. Avoid overhead irrigation.',
            'chemical': 'Apply metalaxyl + mancozeb. Frequent sprays during humid conditions.',
            'organic': 'Copper oxychloride. Bordeaux mixture. Bio-fungicides.'
        },
        'severity': 'very_high'
    },
    'anthracnose': {
        'symptoms': ['sunken lesions', 'dark spots', 'fruit rot', 'pink spore masses'],
        'crops': ['mango', 'beans', 'cucurbits', 'chilli'],
        'management': {
            'cultural': 'Prune for better air circulation. Harvest mature fruits. Remove fallen fruits.',
            'chemical': 'Apply carbendazim or hexaconazole. Post-harvest fungicide dip.',
            'organic': 'Neem oil sprays. Trichoderma application. Proper drying after rain.'
        },
        'severity': 'medium'
    },
    'fusarium_wilt': {
        'symptoms': ['yellowing', 'wilting', 'vascular browning', 'stunted growth', 'one-sided yellowing'],
        'crops': ['tomato', 'banana', 'cotton', 'chickpea'],
        'management': {
            'cultural': 'Use resistant varieties. Soil solarization. Long crop rotation.',
            'chemical': 'Soil drenching with carbendazim. Seed treatment with Thiram.',
            'organic': 'Trichoderma harzianum. Pseudomonas fluorescens. Neem cake application.'
        },
        'severity': 'high'
    },
    'downy_mildew': {
        'symptoms': ['downy growth', 'yellow patches', 'leaf curling', 'greyish mold underside'],
        'crops': ['grapes', 'cucurbits', 'onion', 'crucifers'],
        'management': {
            'cultural': 'Improve drainage. Reduce humidity. Proper plant spacing.',
            'chemical': 'Apply metalaxyl or mancozeb. Preventive sprays are effective.',
            'organic': 'Copper-based fungicides. Bordeaux mixture. Proper field sanitation.'
        },
        'severity': 'high'
    },
    'root_rot': {
        'symptoms': ['wilting', 'root decay', 'yellowing', 'stunted growth', 'dark roots'],
        'crops': ['most crops'],
        'management': {
            'cultural': 'Ensure proper drainage. Avoid overwatering. Use raised beds.',
            'chemical': 'Soil drench with carbendazim or metalaxyl. Seed treatment.',
            'organic': 'Trichoderma application. Improve soil structure with organic matter.'
        },
        'severity': 'high'
    },
    'mosaic_virus': {
        'symptoms': ['mosaic pattern', 'mottling', 'leaf distortion', 'stunted growth', 'yellow patches'],
        'crops': ['tomato', 'tobacco', 'beans', 'cucurbits'],
        'management': {
            'cultural': 'Use virus-free seeds. Control aphid vectors. Remove infected plants immediately.',
            'chemical': 'No direct chemical control. Focus on vector control with insecticides.',
            'organic': 'Neem-based insecticides for vector control. Reflective mulches to repel aphids.'
        },
        'severity': 'very_high'
    },
    'bacterial_wilt': {
        'symptoms': ['sudden wilting', 'bacterial ooze', 'vascular browning', 'no leaf yellowing initially'],
        'crops': ['tomato', 'potato', 'brinjal', 'banana'],
        'management': {
            'cultural': 'Use disease-free planting material. Crop rotation. Field sanitation.',
            'chemical': 'Limited chemical control. Soil drenching with streptocycline may help.',
            'organic': 'Use resistant varieties. Bio-control agents like Pseudomonas.'
        },
        'severity': 'very_high'
    },
    'nutrient_deficiency': {
        'symptoms': ['yellowing', 'chlorosis', 'purple leaves', 'stunted growth', 'necrosis'],
        'crops': ['all crops'],
        'management': {
            'cultural': 'Soil testing. Balanced fertilization. Proper pH management.',
            'chemical': 'Apply specific nutrient fertilizers based on deficiency. Foliar sprays.',
            'organic': 'Compost application. Green manuring. Bio-fertilizers.'
        },
        'severity': 'low'
    }
}


def match_symptoms(user_symptoms, disease_symptoms):
    """Calculate symptom match score"""
    user_symptoms_lower = [s.lower().strip() for s in user_symptoms]
    matches = 0

    for disease_symptom in disease_symptoms:
        for user_symptom in user_symptoms_lower:
            if disease_symptom in user_symptom or user_symptom in disease_symptom:
                matches += 1
                break

    return matches


def predict_disease(symptoms_input):
    """Predict diseases based on symptom description"""
    # Parse symptoms - can be text or list
    if isinstance(symptoms_input, str):
        symptoms = [s.strip() for s in symptoms_input.lower().replace(',', ';').split(';')]
    else:
        symptoms = [s.lower().strip() for s in symptoms_input]

    predictions = []

    for disease_name, disease_data in DISEASE_DATABASE.items():
        match_count = match_symptoms(symptoms, disease_data['symptoms'])

        if match_count > 0:
            # Calculate confidence based on matches
            confidence = min(100, (match_count / len(disease_data['symptoms'])) * 100 +
                           (match_count / len(symptoms)) * 50)

            predictions.append({
                'disease_name': disease_name.replace('_', ' ').title(),
                'confidence': round(confidence, 2),
                'severity': disease_data['severity'],
                'affected_crops': ', '.join(disease_data['crops']),
                'management': disease_data['management'],
                'matched_symptoms': match_count
            })

    # Sort by confidence
    predictions.sort(key=lambda x: x['confidence'], reverse=True)

    # Return top 5 predictions
    top_predictions = predictions[:5]

    if not top_predictions:
        return {
            'predictions': [],
            'message': 'No diseases matched the provided symptoms. Please provide more specific symptoms or consult an agricultural expert.'
        }

    return {
        'predictions': top_predictions,
        'input_symptoms': symptoms,
        'disclaimer': 'This is an automated prediction based on symptom matching. For accurate diagnosis, please consult agricultural experts or pathologists.'
    }


def get_common_symptoms():
    """Return list of common symptoms for UI"""
    all_symptoms = set()
    for disease_data in DISEASE_DATABASE.values():
        all_symptoms.update(disease_data['symptoms'])
    return sorted(list(all_symptoms))


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests for disease prediction"""
        try:
            # Read request body
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            request_data = json.loads(body.decode('utf-8'))

            # Get symptoms from request
            symptoms = request_data.get('symptoms')
            if not symptoms:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Symptoms are required'}).encode())
                return

            # Predict disease
            result = predict_disease(symptoms)

            # Return response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

        except json.JSONDecodeError:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Invalid JSON'}).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_GET(self):
        """Handle GET requests for common symptoms"""
        try:
            symptoms = get_common_symptoms()

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'symptoms': symptoms}).encode())

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
