import { Database } from "bun:sqlite";

const db = new Database("finance.sqlite");

// Membuka atau membuat file database SQLite lokal bernama "finance.sqlite" menggunakan modul bawaan Bun
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

// Ekspor objek koneksi database agar bisa dipakai untuk query di file lain (routes/controllers)
export default db;