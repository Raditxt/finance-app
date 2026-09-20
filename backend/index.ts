import { Hono } from "hono";
import { cors } from "hono/cors";
import db from "./db"; // Import instance db untuk query & auto-init tabel

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

  // Validasi sederhana
  if (amount === undefined || !type || !date) {
    return c.json(
      { error: "Field 'amount', 'type', dan 'date' wajib diisi" },
      400
    );
  }

  const result = db.run(
    "INSERT INTO transactions (amount, type, category_id, date) VALUES (?, ?, ?, ?)",
    [amount, type, category_id ?? null, date]
  );

  return c.json(
    {
      id: result.lastInsertRowid,
      amount,
      type,
      category_id: category_id ?? null,
      date,
    },
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

// Ekspor aplikasi agar bisa dijalankan oleh server runner Bun
export default app;