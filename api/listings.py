"""
Vercel Serverless Function: Marketplace Listings API
Provides crop listing data with search and filtering
"""

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import os

# Load mock data
def load_listings():
    """Load listings from mock data file"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    mock_data_path = os.path.join(current_dir, 'mock_data.json')

    with open(mock_data_path, 'r') as f:
        data = json.load(f)

    return data['listings']


def filter_listings(listings, query_params):
    """Filter listings based on query parameters"""
    filtered = listings.copy()

    # Filter by crop name
    if 'crop_name' in query_params:
        crop_name = query_params['crop_name'][0].lower()
        filtered = [l for l in filtered if crop_name in l['crop_name'].lower()]

    # Filter by location
    if 'location' in query_params:
        location = query_params['location'][0].lower()
        filtered = [l for l in filtered if location in l['location'].lower()]

    # Filter by price range
    if 'min_price' in query_params:
        min_price = float(query_params['min_price'][0])
        filtered = [l for l in filtered if l['price'] >= min_price]

    if 'max_price' in query_params:
        max_price = float(query_params['max_price'][0])
        filtered = [l for l in filtered if l['price'] <= max_price]

    # Filter by quality
    if 'quality' in query_params:
        quality = query_params['quality'][0]
        filtered = [l for l in filtered if l['quality'] == quality]

    # Sort results
    if 'sort_by' in query_params:
        sort_by = query_params['sort_by'][0]
        sort_order = query_params.get('sort_order', ['asc'])[0]
        reverse = sort_order == 'desc'

        if sort_by == 'price':
            filtered.sort(key=lambda x: x['price'], reverse=reverse)
        elif sort_by == 'harvest_date':
            filtered.sort(key=lambda x: x['harvest_date'], reverse=reverse)
        elif sort_by == 'created_at':
            filtered.sort(key=lambda x: x['created_at'], reverse=reverse)

    return filtered


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests for listings"""
        try:
            # Parse URL and query parameters
            parsed_url = urlparse(self.path)
            query_params = parse_qs(parsed_url.query)

            # Check if requesting single listing
            path_parts = parsed_url.path.split('/')

            # Load all listings
            all_listings = load_listings()

            # Check if requesting specific listing by ID
            if len(path_parts) > 2 and path_parts[-1].isdigit():
                listing_id = int(path_parts[-1])
                listing = next((l for l in all_listings if l['id'] == listing_id), None)

                if listing:
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps(listing).encode())
                else:
                    self.send_response(404)
                    self.send_header('Content-type', 'application/json')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': 'Listing not found'}).encode())
            else:
                # Filter listings based on query parameters
                filtered_listings = filter_listings(all_listings, query_params)

                # Return filtered listings
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(filtered_listings).encode())

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
