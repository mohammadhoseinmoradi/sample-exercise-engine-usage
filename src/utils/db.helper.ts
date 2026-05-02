import { Database } from "bun:sqlite";
import path from "path";

let db: Database;
function initial() {
  // Database path
  const dbPath = process.env.DB_PATH
    ? path.join(__dirname, "..", process.env.DB_PATH)
    : path.join(__dirname, "../../database/database.db");
  db = new Database(dbPath);

  // Create users table
  db.query(
    `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `,
  ).run();
}

export { initial, db };
