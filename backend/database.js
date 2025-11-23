/**
 * SQLite Database Module
 * Handles storing and retrieving query history
 */

const Database = require('better-sqlite3');
const path = require('path');

let db = null;

/**
 * Initialize database connection and create tables
 */
function init() {
  const dbPath = path.join(__dirname, 'database.sqlite');
  db = new Database(dbPath);
  
  // Create queries table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imagePath TEXT NOT NULL,
      region TEXT NOT NULL,
      result TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);
  
  console.log('[OK] Database initialized successfully');
}

/**
 * Save a query to the database
 * @param {Object} queryData - Query data to save
 */
function saveQuery(queryData) {
  if (!db) {
    init();
  }
  
  const stmt = db.prepare(`
    INSERT INTO queries (imagePath, region, result, timestamp)
    VALUES (?, ?, ?, ?)
  `);
  
  stmt.run(
    queryData.imagePath,
    queryData.region,
    queryData.result,
    queryData.timestamp
  );
}

/**
 * Get query history from database
 * @param {number} limit - Maximum number of queries to return
 * @returns {Array} Array of query objects
 */
function getHistory(limit = 50) {
  if (!db) {
    init();
  }
  
  const stmt = db.prepare(`
    SELECT * FROM queries 
    ORDER BY timestamp DESC 
    LIMIT ?
  `);
  
  return stmt.all(limit);
}

/**
 * Close database connection
 */
function close() {
  if (db) {
    db.close();
  }
}

module.exports = {
  init,
  saveQuery,
  getHistory,
  close
};

