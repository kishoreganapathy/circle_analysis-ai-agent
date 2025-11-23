"""
OCR Engine using Tesseract
Extracts text from images
"""

try:
    import pytesseract
    from PIL import Image
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    print("[WARNING] pytesseract not available. Install with: pip install pytesseract")

class OCREngine:
    """OCR engine for text extraction from images"""
    
    def __init__(self):
        """Initialize OCR engine"""
        self.available = TESSERACT_AVAILABLE
        
        if not self.available:
            print("[WARNING] OCR will use fallback method")
    
    def extract_text(self, image):
        """
        Extract text from image
        
        Args:
            image: PIL Image object
        
        Returns:
            str: Extracted text
        """
        if not self.available:
            # Fallback: return empty string
            return ""
        
        try:
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Extract text using Tesseract
            text = pytesseract.image_to_string(image, lang='eng')
            
            # Clean up text
            text = text.strip()
            
            return text
            
        except Exception as e:
            print(f"OCR extraction error: {e}")
            return ""

