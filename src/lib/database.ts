import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDatabase() {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'calendar.db');
    
    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);

    // Create tasks table if it doesn't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  return db;
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  category: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  const database = getDatabase();
  const stmt = database.prepare(
    'INSERT INTO tasks (title, description, category, date) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(task.title, task.description, task.category, task.date);
  return result.lastInsertRowid;
}

export function getTasks(date?: string): Task[] {
  const database = getDatabase();
  if (date) {
    const stmt = database.prepare('SELECT * FROM tasks WHERE date = ? ORDER BY created_at');
    return stmt.all(date) as Task[];
  }
  const stmt = database.prepare('SELECT * FROM tasks ORDER BY date, created_at');
  return stmt.all() as Task[];
}

export function updateTask(id: number, updates: Partial<Task>) {
  const database = getDatabase();
  const fields = Object.keys(updates).filter(key => key !== 'id').map(key => `${key} = ?`);
  const values = Object.values(updates).filter((_, index) => Object.keys(updates)[index] !== 'id');
  
  const stmt = database.prepare(
    `UPDATE tasks SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
  );
  stmt.run(...values, id);
}

export function deleteTask(id: number) {
  const database = getDatabase();
  const stmt = database.prepare('DELETE FROM tasks WHERE id = ?');
  stmt.run(id);
}

export function getTasksByMonth(year: number, month: number): Task[] {
  const database = getDatabase();
  const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
  const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
  
  const stmt = database.prepare(
    'SELECT * FROM tasks WHERE date >= ? AND date <= ? ORDER BY date, created_at'
  );
  return stmt.all(startDate, endDate) as Task[];
} 