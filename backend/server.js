/**
 * Node.js Express Backend Server
 * Handles API routes for screenshot capture, AI analysis, and query history
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize database
db.init();

/**
 * Route: POST /capture
 * Receives screenshot data from Electron app
 */
app.post('/capture', async (req, res) => {
  try {
    const { image, region } = req.body;
    
    if (!image || !region) {
      return res.status(400).json({ error: 'Missing image or region data' });
    }

    // Save screenshot temporarily
    const screenshotPath = path.join(__dirname, 'temp', `screenshot_${Date.now()}.png`);
    const tempDir = path.join(__dirname, 'temp');
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Convert base64 to image file
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(screenshotPath, base64Data, 'base64');

    res.json({ 
      success: true, 
      screenshotPath,
      message: 'Screenshot captured successfully' 
    });
  } catch (error) {
    console.error('Capture error:', error);
    res.status(500).json({ error: 'Failed to capture screenshot' });
  }
});

/**
 * Route: POST /analyze
 * Forwards screenshot to Python AI backend for analysis
 */
app.post('/analyze', async (req, res) => {
  try {
    const { image, region } = req.body;
    
    if (!image || !region) {
      return res.status(400).json({ error: 'Missing image or region data' });
    }

    // Save screenshot temporarily
    const screenshotPath = path.join(__dirname, 'temp', `analyze_${Date.now()}.png`);
    const tempDir = path.join(__dirname, 'temp');
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Convert base64 to image file (keep for storage, but send base64 to Python)
    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(screenshotPath, base64Data, 'base64');

    // Call Python backend via HTTP
    try {
      const pythonResponse = await axios.post('http://localhost:5000/analyze', {
        image: base64Data,
        format: 'base64'
      }, {
        timeout: 30000 // 30 second timeout
      });

      const result = pythonResponse.data;
      
      // Save to database
      db.saveQuery({
        imagePath: screenshotPath,
        region: JSON.stringify(region),
        result: JSON.stringify(result),
        timestamp: new Date().toISOString()
      });

      res.json(result);
    } catch (pythonError) {
      console.error('Python API error:', pythonError.message);
      if (pythonError.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
          error: 'Python AI backend is not running. Please start it with: npm run python' 
        });
      }
      res.status(500).json({ error: 'Failed to analyze image: ' + pythonError.message });
    }
  } catch (error) {
    console.error('Analyze error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

/**
 * Route: GET /history
 * Returns previous query history from SQLite
 */
app.get('/history', async (req, res) => {
  try {
    const history = db.getHistory();
    res.json({ success: true, history });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

/**
 * Route: GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`[INFO] Backend server running on http://localhost:${PORT}`);
  console.log(`[INFO] Ready to receive requests`);
});

module.exports = app;

