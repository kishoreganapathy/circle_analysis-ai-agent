/**
 * Electron Main Process
 * Handles application lifecycle, global hotkey, and window management
 */

const { app, BrowserWindow, globalShortcut, ipcMain, nativeImage, desktopCapturer } = require('electron');
const path = require('path');
const axios = require('axios');

let overlayWindow = null;
let popupWindow = null;
const BACKEND_URL = 'http://localhost:3000';

/**
 * Create transparent overlay window for circle drawing
 */
function createOverlayWindow() {
  // Get all displays
  const { screen } = require('electron');
  const displays = screen.getAllDisplays();
  
  // Find primary display
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const { x, y } = primaryDisplay.bounds;

  overlayWindow = new BrowserWindow({
    width: width,
    height: height,
    x: x,
    y: y,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    focusable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  overlayWindow.loadFile(path.join(__dirname, 'overlay', 'overlay.html'));
  
  // Make window click-through when not drawing
  overlayWindow.setIgnoreMouseEvents(false);
  
  overlayWindow.on('closed', () => {
    overlayWindow = null;
  });

  // Show window
  overlayWindow.show();
}

/**
 * Create popup window for displaying analysis results
 */
function createPopupWindow(result) {
  if (popupWindow) {
    popupWindow.close();
  }

  popupWindow = new BrowserWindow({
    width: 600,
    height: 700,
    frame: true,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  popupWindow.loadFile(path.join(__dirname, 'popup', 'popup.html'));

  // Send result data to popup when ready
  popupWindow.webContents.once('did-finish-load', () => {
    popupWindow.webContents.send('analysis-result', result);
  });

  popupWindow.on('closed', () => {
    popupWindow = null;
  });
}

/**
 * Capture screenshot of specified region
 */
async function captureRegion(region) {
  try {
    const { screen } = require('electron');
    const primaryDisplay = screen.getPrimaryDisplay();
    
    // Calculate absolute coordinates
    const x = Math.round(region.x);
    const y = Math.round(region.y);
    const width = Math.round(region.width);
    const height = Math.round(region.height);

    // Get screen sources using desktopCapturer
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: primaryDisplay.size.width, height: primaryDisplay.size.height }
    });

    if (sources.length === 0) {
      throw new Error('No screen sources available');
    }

    // Use the first screen source (primary display)
    const source = sources[0];
    const fullImage = nativeImage.createFromDataURL(source.thumbnail.toDataURL());

    // Get image size
    const imgSize = fullImage.getSize();
    
    // Crop to the specified region
    // Note: thumbnail might be scaled, so we need to calculate the scale factor
    const scaleX = imgSize.width / primaryDisplay.size.width;
    const scaleY = imgSize.height / primaryDisplay.size.height;
    
    const cropX = Math.round(x * scaleX);
    const cropY = Math.round(y * scaleY);
    const cropWidth = Math.round(width * scaleX);
    const cropHeight = Math.round(height * scaleY);

    // Crop the image
    const croppedImage = fullImage.crop({
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight
    });

    // Resize to original requested size if needed
    const finalImage = croppedImage.resize({ width: width, height: height });

    // Convert to base64
    const base64Image = finalImage.toDataURL();

    return {
      success: true,
      image: base64Image,
      region: { x, y, w: width, h: height }
    };
  } catch (error) {
    console.error('Capture error:', error);
    return { success: false, error: error.message };
  }
}

// IPC Handlers

/**
 * Handle screenshot capture request from overlay
 */
ipcMain.on('capture-region', async (event, region) => {
  const captureResult = await captureRegion(region);
  
  if (captureResult.success) {
    // Send to backend for analysis
    try {
      const response = await axios.post(`${BACKEND_URL}/analyze`, {
        image: captureResult.image,
        region: captureResult.region
      });

      // Close overlay
      if (overlayWindow) {
        overlayWindow.close();
      }

      // Show popup with results
      createPopupWindow(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      event.reply('capture-error', { message: 'Failed to analyze image' });
    }
  } else {
    event.reply('capture-error', { message: captureResult.error });
  }
});

/**
 * Handle overlay close request
 */
ipcMain.on('close-overlay', () => {
  if (overlayWindow) {
    overlayWindow.close();
  }
});

// App Event Handlers

app.whenReady().then(() => {
  // Register global hotkey: Ctrl + Shift + O
  const ret = globalShortcut.register('CommandOrControl+Shift+O', () => {
    if (!overlayWindow) {
      createOverlayWindow();
    } else {
      overlayWindow.close();
    }
  });

  if (!ret) {
    console.log('[WARNING] Global hotkey registration failed');
  } else {
    console.log('[OK] Global hotkey registered: Ctrl+Shift+O');
  }

  // Check if backend is running
  axios.get(`${BACKEND_URL}/health`)
    .then(() => {
      console.log('[OK] Backend server is running');
    })
    .catch(() => {
      console.log('[WARNING] Backend server not responding. Make sure it\'s running on port 3000');
    });
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0) {
    createOverlayWindow();
  }
});

