import { Hono } from "hono";
import { cors } from "hono/cors";
import db from "./db"; // Import instance db untuk query & auto-init tabel
import {
  validateAmount,
  validateTransactionType,
  validateDate,
} from "./validators";

// Inisialisasi instance aplikasi Hono utama
const app = new Hono();

// Supaya frontend (Svelte, di port 5173) bisa mengakses API ini
app.use("/*", cors());

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

  const result = db.run(
    "INSERT INTO transactions (amount, type, category_id, date) VALUES (?, ?, ?, ?)",
    [amount, type, category_id ?? null, date]
  );

  return c.json(
    { id: result.lastInsertRowid, amount, type, category_id, date },
    201
  );
});

// GET — Ambil semua transaksi
app.get("/transactions", (c) => {
  const transactions = db
    .query("SELECT * FROM transactions ORDER BY date DESC")
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

  const existing = db
    .query("SELECT * FROM transactions WHERE id = ?")
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

// Ekspor konfigurasi server Bun (port + fetch handler)
export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};