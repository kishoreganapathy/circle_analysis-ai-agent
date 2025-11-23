/**
 * Overlay JavaScript
 * Handles circle drawing and region capture
 */

const { ipcRenderer } = require('electron');

const canvas = document.getElementById('draw-canvas');
const ctx = canvas.getContext('2d');
const instructions = document.getElementById('instructions');

// Set canvas size to match window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Drawing state
let isDrawing = false;
let startX = 0;
let startY = 0;
let currentX = 0;
let currentY = 0;
let circle = null;

// Draw semi-transparent background
function drawBackground() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw circle
function drawCircle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  
  if (circle) {
    const { x, y, radius } = circle;
    
    // Draw circle outline
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw circle fill (semi-transparent)
    ctx.fillStyle = 'rgba(76, 175, 80, 0.2)';
    ctx.fill();
    
    // Draw bounding box
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(
      x - radius,
      y - radius,
      radius * 2,
      radius * 2
    );
    ctx.setLineDash([]);
  }
}

// Calculate circle from two points
function calculateCircle(x1, y1, x2, y2) {
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const radius = Math.sqrt(
    Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
  ) / 2;
  
  return {
    x: centerX,
    y: centerY,
    radius: radius
  };
}

// Get bounding box from circle
function getBoundingBox(circle) {
  return {
    x: Math.max(0, Math.round(circle.x - circle.radius)),
    y: Math.max(0, Math.round(circle.y - circle.radius)),
    width: Math.round(circle.radius * 2),
    height: Math.round(circle.radius * 2)
  };
}

// Mouse/Touch event handlers
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
  currentX = startX;
  currentY = startY;
  instructions.style.display = 'none';
});

canvas.addEventListener('mousemove', (e) => {
  if (isDrawing) {
    currentX = e.clientX;
    currentY = e.clientY;
    circle = calculateCircle(startX, startY, currentX, currentY);
    drawCircle();
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (isDrawing) {
    isDrawing = false;
    currentX = e.clientX;
    currentY = e.clientY;
    circle = calculateCircle(startX, startY, currentX, currentY);
    
    // Only capture if circle is large enough
    if (circle.radius > 10) {
      const boundingBox = getBoundingBox(circle);
      
      // Send capture request to main process
      ipcRenderer.send('capture-region', boundingBox);
    } else {
      // Reset if circle too small
      circle = null;
      drawBackground();
      instructions.style.display = 'block';
    }
  }
});

// Touch support for tablets
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  isDrawing = true;
  startX = touch.clientX;
  startY = touch.clientY;
  currentX = startX;
  currentY = startY;
  instructions.style.display = 'none';
});

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  if (isDrawing) {
    const touch = e.touches[0];
    currentX = touch.clientX;
    currentY = touch.clientY;
    circle = calculateCircle(startX, startY, currentX, currentY);
    drawCircle();
  }
});

canvas.addEventListener('touchend', (e) => {
  e.preventDefault();
  if (isDrawing) {
    isDrawing = false;
    if (circle && circle.radius > 10) {
      const boundingBox = getBoundingBox(circle);
      ipcRenderer.send('capture-region', boundingBox);
    } else {
      circle = null;
      drawBackground();
      instructions.style.display = 'block';
    }
  }
});

// ESC key to cancel
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    ipcRenderer.send('close-overlay');
  }
});

// Error handling
ipcRenderer.on('capture-error', (event, error) => {
  alert('Error: ' + error.message);
  ipcRenderer.send('close-overlay');
});

// Initialize
drawBackground();

