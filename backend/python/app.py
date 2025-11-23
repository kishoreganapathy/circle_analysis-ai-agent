"""
Python AI Backend (Flask)
Performs image classification, OCR, and code detection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import numpy as np
from PIL import Image
import re

# Try to import TensorFlow (optional)
try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
except (ImportError, TypeError) as e:
    TENSORFLOW_AVAILABLE = False
    print(f"[WARNING] TensorFlow not available ({type(e).__name__}). Image classification will be disabled.")
    print(f"   Error: {str(e)[:100]}")
    print("   Tip: Try 'pip install protobuf==3.20.3' to fix TensorFlow compatibility")

# Import our custom modules
from model.classifier import ImageClassifier
from model.ocr_engine import OCREngine
from model.code_detector import CodeDetector

app = Flask(__name__)
CORS(app)

# Initialize AI models
classifier = None
ocr_engine = None
code_detector = None

def init_models():
    """Initialize AI models (lazy loading)"""
    global classifier, ocr_engine, code_detector
    
    try:
        classifier = ImageClassifier()
        ocr_engine = OCREngine()
        code_detector = CodeDetector()
        print("[OK] AI models initialized successfully")
    except Exception as e:
        print(f"[WARNING] Some models failed to load: {e}")
        print("   Continuing with available models...")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Python AI backend is running'
    })

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Main analysis endpoint
    Receives base64 image and returns analysis results
    """
    try:
        data = request.json
        image_data = data.get('image', '')
        
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        # Decode base64 image
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        image_array = np.array(image)
        
        # Initialize models if not already done
        if classifier is None:
            init_models()
        
        result = {
            'description': '',
            'objects': [],
            'detectedText': '',
            'isCode': False,
            'explanation': '',
            'codeVersion': '',
            'formattedCode': ''
        }
        
        # 1. Perform OCR
        try:
            detected_text = ocr_engine.extract_text(image)
            result['detectedText'] = detected_text
        except Exception as e:
            print(f"OCR error: {e}")
            result['detectedText'] = ''
        
        # 2. Check if text is code
        if result['detectedText']:
            code_result = code_detector.detect_and_format(result['detectedText'])
            result['isCode'] = code_result['isCode']
            result['codeVersion'] = code_result['codeVersion']
            result['explanation'] = code_result['explanation']
            result['formattedCode'] = code_result.get('formattedCode', result['detectedText'])
        
        # 3. Image classification (if no text detected or as supplement)
        try:
            if classifier:
                classification = classifier.classify(image_array)
                result['objects'] = classification.get('objects', [])
                if not result['description']:
                    result['description'] = classification.get('description', '')
        except Exception as e:
            print(f"Classification error: {e}")
        
        # 4. Generate description if not already present
        if not result['description']:
            if result['detectedText']:
                result['description'] = f"Text content detected: {result['detectedText'][:100]}..."
            elif result['objects']:
                result['description'] = f"Detected objects: {', '.join(result['objects'])}"
            else:
                result['description'] = "Image analyzed. No specific content detected."
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Analysis error: {e}")
        return jsonify({
            'error': str(e),
            'description': 'Failed to analyze image'
        }), 500

if __name__ == '__main__':
    print("[INFO] Starting Python AI Backend...")
    init_models()
    app.run(host='0.0.0.0', port=5000, debug=False)

