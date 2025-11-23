"""
Image Classifier using TensorFlow MobileNet
Performs object detection and image classification
"""

import numpy as np
from PIL import Image
try:
    import tensorflow as tf
    TENSORFLOW_AVAILABLE = True
except (ImportError, TypeError) as e:
    TENSORFLOW_AVAILABLE = False
    tf = None

class ImageClassifier:
    """Image classification using pre-trained MobileNet model"""
    
    def __init__(self):
        """Initialize MobileNet model"""
        if not TENSORFLOW_AVAILABLE:
            print("[WARNING] TensorFlow not available. Image classification disabled.")
            self.model = None
            return
            
        try:
            # Load MobileNetV2 pre-trained model
            self.model = tf.keras.applications.MobileNetV2(
                weights='imagenet',
                input_shape=(224, 224, 3)
            )
            
            # Load ImageNet class labels
            self.decode_predictions = tf.keras.applications.mobilenet_v2.decode_predictions
            
            print("[OK] Image classifier (MobileNet) loaded successfully")
        except Exception as e:
            print(f"[WARNING] Could not load MobileNet: {e}")
            self.model = None
    
    def classify(self, image_array):
        """
        Classify image and return detected objects
        
        Args:
            image_array: numpy array of image (RGB)
        
        Returns:
            dict with 'objects' list and 'description' string
        """
        if self.model is None:
            return {
                'objects': [],
                'description': 'Image classifier not available'
            }
        
        try:
            # Preprocess image
            img = Image.fromarray(image_array)
            img = img.resize((224, 224))
            img_array = np.array(img)
            
            # Convert to RGB if needed
            if len(img_array.shape) == 2:
                img_array = np.stack([img_array] * 3, axis=-1)
            elif img_array.shape[2] == 4:
                img_array = img_array[:, :, :3]
            
            # Normalize for MobileNet
            img_array = tf.keras.applications.mobilenet_v2.preprocess_input(
                img_array.reshape(1, 224, 224, 3)
            )
            
            # Make prediction
            predictions = self.model.predict(img_array, verbose=0)
            decoded = self.decode_predictions(predictions, top=5)[0]
            
            # Extract top predictions
            objects = [pred[1] for pred in decoded]
            descriptions = [f"{pred[1]} ({pred[2]*100:.1f}%)" for pred in decoded]
            
            return {
                'objects': objects[:3],  # Top 3 objects
                'description': f"Detected: {', '.join(descriptions[:3])}"
            }
            
        except Exception as e:
            print(f"Classification error: {e}")
            return {
                'objects': [],
                'description': f'Classification failed: {str(e)}'
            }

