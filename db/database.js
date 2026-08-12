const { DatabaseSync } = require(`node:sqlite`);
const path = require('path');

// Create/open file SQLite
const dbPath = path.join(__dirname, '..', 'portfolio.db');
const db = new DatabaseSync(dbPath);

// Create projects tables if not exist
db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tech_stack TEXT,
        github_url TEXT,
        demo_url TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
);

console.log('✅ Database connected');
console.log('✅ Projects table ready');

module.exports = db;