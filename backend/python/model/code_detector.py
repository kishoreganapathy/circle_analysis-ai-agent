"""
Code Detector
Detects if text is code and formats it appropriately
"""

import re

class CodeDetector:
    """Detects and formats code in text"""
    
    # Common code patterns
    CODE_PATTERNS = {
        'python': [
            r'\b(def|class|import|from|if __name__|print\(|return\s)',
            r'\b(try|except|finally|with|as)\b',
            r'^\s*(#|""")',
        ],
        'javascript': [
            r'\b(function|const|let|var|=>|console\.log)',
            r'\b(require\(|module\.exports|export\s)',
            r'[{}();]',
        ],
        'java': [
            r'\b(public|private|class|interface|extends|implements)',
            r'\b(static|void|int|String|System\.out\.print)',
        ],
        'html': [
            r'<[a-zA-Z][^>]*>',
            r'</[a-zA-Z]+>',
        ],
        'css': [
            r'\{[^}]*:[^}]*\}',
            r'@(media|import|keyframes)',
        ],
        'sql': [
            r'\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE)',
        ],
    }
    
    def __init__(self):
        """Initialize code detector"""
        pass
    
    def detect_language(self, text):
        """
        Detect programming language from text
        
        Args:
            text: Input text to analyze
        
        Returns:
            str: Detected language or 'unknown'
        """
        text_lower = text.lower()
        scores = {}
        
        for lang, patterns in self.CODE_PATTERNS.items():
            score = 0
            for pattern in patterns:
                if re.search(pattern, text, re.IGNORECASE | re.MULTILINE):
                    score += 1
            scores[lang] = score
        
        # Find language with highest score
        if scores:
            max_score = max(scores.values())
            if max_score > 0:
                detected_lang = max(scores, key=scores.get)
                return detected_lang
        
        return 'unknown'
    
    def format_code(self, text, language):
        """
        Format code text (basic cleaning)
        
        Args:
            text: Code text
            language: Programming language
        
        Returns:
            str: Formatted code
        """
        # Basic formatting
        lines = text.split('\n')
        
        # Remove excessive empty lines
        formatted_lines = []
        prev_empty = False
        for line in lines:
            is_empty = not line.strip()
            if not (is_empty and prev_empty):
                formatted_lines.append(line)
            prev_empty = is_empty
        
        return '\n'.join(formatted_lines)
    
    def detect_and_format(self, text):
        """
        Detect if text is code and format it
        
        Args:
            text: Input text
        
        Returns:
            dict with isCode, codeVersion, explanation, formattedCode
        """
        if not text or len(text.strip()) < 10:
            return {
                'isCode': False,
                'codeVersion': '',
                'explanation': 'Text is too short to be code',
                'formattedCode': text
            }
        
        # Check for code patterns
        language = self.detect_language(text)
        
        # Additional heuristics
        has_brackets = bool(re.search(r'[{}()\[\]]', text))
        has_operators = bool(re.search(r'[=+\-*/%<>!&|]', text))
        has_keywords = bool(re.search(r'\b(def|function|class|import|const|let|var|public|private)\b', text, re.IGNORECASE))
        
        is_code = (
            language != 'unknown' or
            (has_brackets and has_operators) or
            has_keywords
        )
        
        if is_code:
            formatted_code = self.format_code(text, language)
            explanation = f"Detected {language} code" if language != 'unknown' else "Detected code-like structure"
            
            return {
                'isCode': True,
                'codeVersion': language if language != 'unknown' else 'generic',
                'explanation': explanation,
                'formattedCode': formatted_code
            }
        else:
            return {
                'isCode': False,
                'codeVersion': '',
                'explanation': 'Text does not appear to be code',
                'formattedCode': text
            }

