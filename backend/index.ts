import { Hono } from "hono";
import { cors } from "hono/cors";
import db from "./db"; // Import instance db untuk query & auto-init tabel
import {
  validateAmount,
  validateTransactionType,
  validateDate,
} from "./validators";
import {
  validateCategoryName,
  validateCategoryType,
} from "./validators"; // baris baru

// Inisialisasi instance aplikasi Hono utama
const app = new Hono();

// Supaya frontend (Svelte, di port 5173) bisa mengakses API ini
app.use("/*", cors());

// =====================
// Helpers
// =====================

// Cek category_id valid (ada di database) dan tipenya cocok sama tipe transaksi.
// Dipakai di POST dan PUT /transactions supaya nggak duplikat logic.
function validateCategoryForTransaction(
  categoryId: unknown,
  type: string
): string | null {
  if (categoryId === null || categoryId === undefined) {
    return null; // kategori opsional, nggak masalah kalau kosong
  }

  const category = db
    .query("SELECT type FROM categories WHERE id = ?")
    .get(categoryId as number) as { type: string } | null; // tambahin "as number" di sini

  if (!category) {
    return "category_id tidak ditemukan";
  }
  if (category.type !== type) {
    return "tipe kategori tidak sesuai dengan tipe transaksi";
  }
  return null;
}

// =====================
// Health Check
// =====================
// Endpoint untuk memastikan server backend aktif dan merespons dengan baik
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// =====================
// Transactions
// =====================

// GET — Ambil transaksi berdasarkan id
app.get("/transactions/:id", (c) => {
  const id = c.req.param("id");
  const transaction = db
    .query("SELECT * FROM transactions WHERE id = ?")
    .get(id);

  if (!transaction) {
    return c.json({ error: "Transaksi tidak ditemukan" }, 404);
  }
  return c.json(transaction);
});

// POST — Simpan transaksi baru
app.post("/transactions", async (c) => {
  const body = await c.req.json();
  const { amount, type, category_id, date } = body;

  const amountError = validateAmount(amount);
  if (amountError) return c.json({ error: amountError }, 400);

  const typeError = validateTransactionType(type);
  if (typeError) return c.json({ error: typeError }, 400);

  const dateError = validateDate(date);
  if (dateError) return c.json({ error: dateError }, 400);

  // Validasi category_id: kalau diisi, harus ada di tabel categories dan tipenya cocok
  const categoryError = validateCategoryForTransaction(category_id, type);
  if (categoryError) return c.json({ error: categoryError }, 400);

  const result = db.run(
    "INSERT INTO transactions (amount, type, category_id, date) VALUES (?, ?, ?, ?)",
    [amount, type, category_id ?? null, date]
  );

  return c.json(
    { id: result.lastInsertRowid, amount, type, category_id, date },
    201
  );
});

// GET — Ambil semua transaksi (dengan nama kategori via JOIN)
app.get("/transactions", (c) => {
  const transactions = db
    .query(`
      SELECT
        transactions.*,
        categories.name AS category_name
      FROM transactions
      LEFT JOIN categories ON transactions.category_id = categories.id
      ORDER BY transactions.date DESC
    `)
    .all();
  return c.json(transactions);
});

// PUT — Update transaksi berdasarkan id
app.put("/transactions/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { amount, type, category_id, date } = body;

  // Validasi pakai helper yang sama seperti POST
  const amountError = validateAmount(amount);
  if (amountError) return c.json({ error: amountError }, 400);

  const typeError = validateTransactionType(type);
  if (typeError) return c.json({ error: typeError }, 400);

  const dateError = validateDate(date);
  if (dateError) return c.json({ error: dateError }, 400);

  const categoryError = validateCategoryForTransaction(category_id, type);
  if (categoryError) return c.json({ error: categoryError }, 400);

  // Pastikan transaksi yang mau diedit beneran ada
  const existing = db
    .query("SELECT id FROM transactions WHERE id = ?")
    .get(id);

  if (!existing) {
    return c.json({ error: "Transaksi tidak ditemukan" }, 404);
  }

  db.run(
    `UPDATE transactions
     SET amount = ?, type = ?, category_id = ?, date = ?
     WHERE id = ?`,
    [amount, type, category_id ?? null, date, id]
  );

  return c.json({ id: Number(id), amount, type, category_id, date });
});

// DELETE — Hapus transaksi berdasarkan id
app.delete("/transactions/:id", (c) => {
  const id = c.req.param("id");

  const existing = db
    .query("SELECT * FROM transactions WHERE id = ?")
    .get(id);

  if (!existing) {
    return c.json({ error: "Transaksi tidak ditemukan" }, 404);
  }

  db.run("DELETE FROM transactions WHERE id = ?", [id]);

  return c.json({ message: "Transaksi berhasil dihapus", id: Number(id) });
});

// =====================
// Categories
// =====================

// POST — Tambah kategori baru
app.post("/categories", async (c) => {
  const body = await c.req.json();
  const { name, type } = body;

  const nameError = validateCategoryName(name);
  if (nameError) return c.json({ error: nameError }, 400);

  const typeError = validateCategoryType(type);
  if (typeError) return c.json({ error: typeError }, 400);

  // Cek duplikasi sebelum insert, biar pesan errornya jelas
  const existing = db
    .query("SELECT id FROM categories WHERE name = ? AND type = ?")
    .get(name, type);

  if (existing) {
    return c.json({ error: "Kategori dengan nama dan tipe ini sudah ada" }, 400);
  }

  const result = db.run(
    "INSERT INTO categories (name, type) VALUES (?, ?)",
    [name, type]
  );

  return c.json({ id: result.lastInsertRowid, name, type }, 201);
});

// GET — Ambil semua kategori
app.get("/categories", (c) => {
  const categories = db
    .query("SELECT * FROM categories ORDER BY name ASC")
    .all();
  return c.json(categories);
});

// Ekspor konfigurasi server Bun (port + fetch handler)
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};