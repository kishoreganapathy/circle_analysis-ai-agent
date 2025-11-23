"""
Helper script to call Python AI backend from Node.js
Takes screenshot path as argument and returns JSON result
"""

import sys
import json
import requests
import base64

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No screenshot path provided"}))
        sys.exit(1)
    
    screenshot_path = sys.argv[1]
    
    try:
        # Read image and convert to base64
        with open(screenshot_path, 'rb') as f:
            image_data = base64.b64encode(f.read()).decode('utf-8')
        
        # Call Python Flask API
        response = requests.post(
            'http://localhost:5000/analyze',
            json={
                'image': image_data,
                'format': 'base64'
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print(json.dumps(result))
        else:
            print(json.dumps({"error": f"Python API returned status {response.status_code}"}))
            sys.exit(1)
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()

