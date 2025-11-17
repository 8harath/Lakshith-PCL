"""
Vercel Serverless Function: Weather API
Fetches weather data from Open-Meteo API
"""

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, quote
import json
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen


def get_coordinates(location):
    """Get coordinates for a location using Open-Meteo Geocoding API"""
    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={quote(location)}&count=1&language=en&format=json"
        response = urlopen(url, timeout=5)
        data = json.loads(response.read().decode('utf-8'))

        if 'results' in data and len(data['results']) > 0:
            result = data['results'][0]
            return {
                'latitude': result['latitude'],
                'longitude': result['longitude'],
                'name': result['name'],
                'country': result.get('country', '')
            }
        return None
    except Exception as e:
        return None


def get_weather_data(latitude, longitude):
    """Get weather data from Open-Meteo API"""
    try:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=7"
        response = urlopen(url, timeout=5)
        data = json.loads(response.read().decode('utf-8'))
        return data
    except Exception as e:
        return None


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests for weather data"""
        try:
            # Parse query parameters
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)

            # Get location parameter
            location = query_params.get('location', [None])[0]

            if not location:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Location parameter is required'}).encode())
                return

            # Get coordinates
            coords = get_coordinates(location)
            if not coords:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Location not found'}).encode())
                return

            # Get weather data
            weather = get_weather_data(coords['latitude'], coords['longitude'])
            if not weather:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Failed to fetch weather data'}).encode())
                return

            # Combine location and weather data
            result = {
                'location': {
                    'name': coords['name'],
                    'country': coords['country'],
                    'latitude': coords['latitude'],
                    'longitude': coords['longitude']
                },
                'current': weather.get('current', {}),
                'daily': weather.get('daily', {})
            }

            # Return response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode())

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
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
