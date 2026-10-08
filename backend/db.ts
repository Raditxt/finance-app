import { Database } from "bun:sqlite";

// Pakai DB_PATH dari env kalau ada, fallback ke "finance.sqlite"
const dbPath = process.env.DB_PATH || "finance.sqlite";
const db = new Database(dbPath);

// Membuka atau membuat file database SQLite lokal menggunakan modul bawaan Bun
db.run(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense'))
  )
`);

// Membuat tabel 'transactions' jika belum ada untuk mencatat keluar-masuknya uang
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    category_id INTEGER,
    date TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  )
`);

// Unique index agar kombinasi (name, type) pada tabel categories tidak duplikat.
// Mencegah input kategori yang sama dengan tipe yang sama, misal "Makanan" + "expense" dua kali.
db.run(`
  CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_name_type
  ON categories(name, type)
`);

// Ekspor objek koneksi database agar bisa dipakai untuk query di file lain (routes/controllers)
export default db;