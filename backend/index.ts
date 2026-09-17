import { Hono } from "hono";
import { cors } from "hono/cors";
import "./db"; // Mengimpor file db.ts agar database & tabel otomatis terinisialisasi saat server nyala

// Inisialisasi instance aplikasi Hono utama
const app = new Hono();

// Supaya frontend (Svelte, di port 5173) bisa mengakses API ini
app.use("/*", cors());

// Endpoint health check untuk memastikan server backend aktif dan merespons dengan baik
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Ekspor aplikasi agar bisa dijalankan oleh server runner Bun
export default app;