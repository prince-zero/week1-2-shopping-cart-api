const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const databaseSource = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.join(__dirname, '..', 'db.sqlite');

const db = new sqlite3.Database(databaseSource, (err) => {
  if (err) {
    throw err;
  }
});

db.ready = new Promise((resolve, reject) => {
  db.run(`
    CREATE TABLE IF NOT EXISTS cart_items (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_name TEXT NOT NULL,
      item_price REAL NOT NULL CHECK (item_price >= 0),
      quantity INTEGER NOT NULL CHECK (quantity > 0)
    )
  `, (err) => {
    if (err) {
      return reject(err);
    }

    return resolve();
  });
});

module.exports = db;
