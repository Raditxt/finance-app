# Finance Tracker

> 🚧 **Work in progress.** Proyek ini lagi aktif dikerjakan, belum siap dipakai harian dan belum di-deploy.

Personal finance tracker berbasis web, dibangun dari nol sambil belajar software engineering fundamentals. Terinspirasi dari buku *The Psychology of Money* (Morgan Housel). Fokusnya bukan cuma mencatat transaksi; ke depannya aplikasi ini mau bantu memahami pola dan kebiasaan di balik keputusan finansial, bukan sekadar angka di dashboard.

## Kenapa proyek ini

Kebanyakan expense tracker berhenti di "catat lalu lihat grafik". Proyek ini berangkat dari asumsi lain: masalah keuangan pribadi sering kali bukan soal kurang informasi, tapi soal kebiasaan dan pemahaman diri. Arah pengembangannya ke sana. Untuk sekarang, yang dibangun dulu adalah fondasi pencatatan yang solid, baru setelah itu fitur-fitur reflektif di atasnya.

## Fitur saat ini

- **Transaksi (CRUD lengkap):** tambah, lihat, edit, dan hapus (dengan konfirmasi) pemasukan/pengeluaran
- **Validasi berlapis:** di client dan server (nominal, tipe, format tanggal, kecocokan kategori dengan tipe transaksi)
- **Kategori custom:** terpisah income/expense, tidak bisa duplikat (nama + tipe unik)
- **Dashboard bulanan:** total pemasukan, pengeluaran, tabungan, dan *savings rate*, ter-update otomatis setiap ada perubahan transaksi
- **Input nominal** dengan format Rupiah otomatis
- **Riwayat transaksi** terurut berdasarkan tanggal, lengkap dengan nama kategori

## Stack

| Layer    | Teknologi                                  |
| -------- | ------------------------------------------ |
| Backend  | [Bun](https://bun.sh) + [Hono](https://hono.dev) + `bun:sqlite` |
| Frontend | Svelte 5 (runes) + Vite + TypeScript       |
| Database | SQLite (file lokal)                        |

Sengaja tidak pakai framework full-stack seperti SvelteKit, supaya frontend dan backend benar-benar terpisah dan REST API-nya dibangun dari nol, bukan sekadar mengikuti template.

## Struktur repo

```
finance-app/
├── backend/          # REST API (Hono di atas Bun)
│   ├── index.ts      # semua route
│   ├── db.ts         # koneksi SQLite + skema tabel
│   └── validators.ts # validasi input
└── frontend/         # SPA Svelte 5
    └── src/
        ├── *.svelte          # komponen UI (Dashboard, TransactionForm, TransactionList, CategoryForm)
        └── *.svelte.ts       # shared state/store (transactions, categories, summary, editState)
```

## API

Base URL: `http://localhost:3000`

| Method | Endpoint             | Keterangan                                                       |
| ------ | -------------------- | ---------------------------------------------------------------- |
| GET    | `/health`            | Cek server hidup                                                 |
| GET    | `/transactions`      | Semua transaksi (dengan `category_name`), terbaru di atas        |
| GET    | `/transactions/:id`  | Detail satu transaksi                                            |
| POST   | `/transactions`      | Tambah transaksi                                                 |
| PUT    | `/transactions/:id`  | Update transaksi                                                 |
| DELETE | `/transactions/:id`  | Hapus transaksi                                                  |
| GET    | `/categories`        | Semua kategori                                                   |
| POST   | `/categories`        | Tambah kategori                                                  |
| GET    | `/summary?month=YYYY-MM` | Ringkasan bulanan; `month` opsional (default bulan berjalan). `savings_rate` bernilai `null` kalau pemasukan 0 |

Contoh body `POST /transactions`:

```json
{
  "amount": 50000,
  "type": "expense",
  "category_id": 1,
  "date": "2026-11-10"
}
```

## Menjalankan secara lokal

Butuh [Bun](https://bun.sh) terinstal.

**Backend**

```bash
cd backend
bun install
bun run index.ts
```

Server jalan di `http://localhost:3000`. File database `finance.sqlite` dibuat otomatis saat pertama kali jalan.

Environment variable opsional (`backend/.env`):

| Variabel  | Default          |
| --------- | ---------------- |
| `PORT`    | `3000`           |
| `DB_PATH` | `finance.sqlite` |

**Frontend**

```bash
cd frontend
bun install
bun run dev
```

App jalan di `http://localhost:5173`. Backend harus sudah jalan dulu.

## Status & roadmap

Dikerjakan bertahap harian sebagai bagian dari proses belajar; progress-nya bisa dilihat dari riwayat commit.

**Fase sekarang: Fondasi & CRUD**

- [x] Setup backend, frontend, dan database
- [x] Create & read transaksi
- [x] Kategori dinamis
- [x] Update transaksi
- [x] Delete transaksi
- [x] Dashboard savings rate bulanan
- [ ] Edit & hapus kategori
- [ ] Net worth
- [ ] Deploy

**Fase berikutnya:** UI/UX & branding → fitur behavioral (jurnal pengeluaran, target "cukup", dsb.) → integrasi API broker (Indodax) → AI layer (analisis pola, terhubung ke [proyek analisis BTC](https://github.com/Raditxt/btc-market-analysis))

### Keterbatasan yang diketahui

- URL backend (`http://localhost:3000`) masih di-hardcode di beberapa file frontend; harus dipindah ke environment variable sebelum deploy.
- Belum ada autentikasi. Untuk sekarang aplikasi ini single-user dan hanya untuk dijalankan lokal.
- Belum ada automated test.

## Dibuat oleh

[Raditya](https://github.com/Raditxt), mahasiswa D4 Teknik Komputer & Jaringan yang membangun proyek ini sebagai bagian dari proses belajar menjadi software engineer.