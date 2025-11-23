/**
 * Popup JavaScript
 * Handles displaying analysis results and action buttons
 */

const { ipcRenderer } = require('electron');

let analysisData = null;

// DOM elements
const btnWhat = document.getElementById('btn-what');
const btnExplain = document.getElementById('btn-explain');
const btnCode = document.getElementById('btn-code');
const btnSummarize = document.getElementById('btn-summarize');
const resultContent = document.getElementById('result-content');
const metadataContent = document.getElementById('metadata-content');

// Receive analysis result from main process
ipcRenderer.on('analysis-result', (event, data) => {
  analysisData = data;
  displayMetadata(data);
  // Auto-show "What is this?" result
  handleWhatIsThis();
});

/**
 * Display metadata information
 */
function displayMetadata(data) {
  let html = '';
  
  if (data.isCode) {
    html += `<div class="metadata-item">📝 Code Detected: <strong>${data.codeVersion || 'Unknown'}</strong></div>`;
  }
  
  if (data.detectedText) {
    html += `<div class="metadata-item">📄 Text Detected: <strong>Yes</strong></div>`;
  }
  
  if (data.objects && data.objects.length > 0) {
    html += `<div class="metadata-item">🖼️ Objects: <strong>${data.objects.length}</strong></div>`;
  }
  
  metadataContent.innerHTML = html;
}

/**
 * Handle "What is this?" button
 */
btnWhat.addEventListener('click', handleWhatIsThis);

function handleWhatIsThis() {
  if (!analysisData) return;
  
  let html = '<div class="result-text">';
  
  // Description
  if (analysisData.description) {
    html += `<h3>Description</h3><p>${escapeHtml(analysisData.description)}</p>`;
  }
  
  // Objects
  if (analysisData.objects && analysisData.objects.length > 0) {
    html += '<h3>Detected Objects</h3><ul class="object-list">';
    analysisData.objects.forEach(obj => {
      html += `<li>${escapeHtml(obj)}</li>`;
    });
    html += '</ul>';
  }
  
  // Detected text
  if (analysisData.detectedText) {
    html += '<h3>Detected Text</h3>';
    html += `<p>${escapeHtml(analysisData.detectedText)}</p>`;
  }
  
  html += '</div>';
  resultContent.innerHTML = html;
}

/**
 * Handle "Explain" button
 */
btnExplain.addEventListener('click', () => {
  if (!analysisData) return;
  
  let html = '<div class="result-text">';
  
  if (analysisData.explanation) {
    html += `<h3>Explanation</h3><p>${escapeHtml(analysisData.explanation)}</p>`;
  } else if (analysisData.description) {
    html += `<h3>Explanation</h3><p>${escapeHtml(analysisData.description)}</p>`;
  } else {
    html += '<p class="placeholder">No explanation available</p>';
  }
  
  // Additional context
  if (analysisData.detectedText && analysisData.detectedText.length > 0) {
    html += '<h3>Text Content</h3>';
    html += `<p>${escapeHtml(analysisData.detectedText)}</p>`;
  }
  
  html += '</div>';
  resultContent.innerHTML = html;
});

/**
 * Handle "Convert to Code" button
 */
btnCode.addEventListener('click', () => {
  if (!analysisData) return;
  
  let html = '<div class="result-text">';
  
  if (analysisData.isCode && (analysisData.formattedCode || analysisData.detectedText)) {
    html += '<h3>Detected Code</h3>';
    const codeToShow = analysisData.formattedCode || analysisData.detectedText;
    html += `<div class="code-block"><code>${escapeHtml(codeToShow)}</code></div>`;
    
    if (analysisData.codeVersion) {
      html += `<p><strong>Language:</strong> ${escapeHtml(analysisData.codeVersion)}</p>`;
    }
    
    if (analysisData.explanation) {
      html += `<h3>Code Explanation</h3><p>${escapeHtml(analysisData.explanation)}</p>`;
    }
  } else if (analysisData.detectedText) {
    html += '<h3>Text Content (Not Code)</h3>';
    html += `<p>${escapeHtml(analysisData.detectedText)}</p>`;
    html += '<p class="placeholder">This text does not appear to be code.</p>';
  } else {
    html += '<p class="placeholder">No code detected in the selected region.</p>';
  }
  
  html += '</div>';
  resultContent.innerHTML = html;
});

/**
 * Handle "Summarize" button
 */
btnSummarize.addEventListener('click', () => {
  if (!analysisData) return;
  
  let html = '<div class="result-text">';
  html += '<h3>Summary</h3>';
  
  const summaryParts = [];
  
  if (analysisData.description) {
    summaryParts.push(analysisData.description);
  }
  
  if (analysisData.isCode) {
    summaryParts.push(`Contains ${analysisData.codeVersion || 'code'} code.`);
  }
  
  if (analysisData.objects && analysisData.objects.length > 0) {
    summaryParts.push(`Detected objects: ${analysisData.objects.join(', ')}.`);
  }
  
  if (analysisData.detectedText) {
    const textPreview = analysisData.detectedText.length > 100 
      ? analysisData.detectedText.substring(0, 100) + '...'
      : analysisData.detectedText;
    summaryParts.push(`Text content: ${textPreview}`);
  }
  
  if (summaryParts.length > 0) {
    html += '<ul>';
    summaryParts.forEach(part => {
      html += `<li>${escapeHtml(part)}</li>`;
    });
    html += '</ul>';
  } else {
    html += '<p class="placeholder">No summary available</p>';
  }
  
  html += '</div>';
  resultContent.innerHTML = html;
});

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

