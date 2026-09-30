# Finance Tracker

Personal finance tracker berbasis web, dibangun dari nol sambil belajar software engineering fundamentals. Terinspirasi dari buku *The Psychology of Money* (Morgan Housel) — fokusnya bukan cuma mencatat transaksi, tapi ke depannya membantu memahami pola dan psikologi di balik kebiasaan finansial, bukan sekadar angka di dashboard.

## Kenapa proyek ini

Kebanyakan expense tracker berhenti di "catat lalu lihat grafik". Proyek ini dibangun dengan asumsi berbeda: masalah keuangan pribadi seringkali bukan soal kurang informasi, tapi soal kebiasaan dan pemahaman diri. Arah pengembangannya menuju ke sana — meski di tahap sekarang fondasinya masih level pencatatan dasar yang solid dulu, sebelum fitur-fitur reflektif itu dibangun di atasnya.

## Fitur saat ini

- Catat transaksi (pemasukan/pengeluaran) dengan validasi berlapis (client-side dan server-side)
- Kategori transaksi custom, terpisah income/expense, dengan validasi tipe agar tidak tercampur
- Edit transaksi lewat UI, dengan sinkronisasi state antar komponen (list ter-update otomatis tanpa reload)
- Input nominal dengan format Rupiah otomatis
- Riwayat transaksi terurut berdasarkan tanggal

**Belum ada** (dalam pengerjaan aktif): hapus transaksi, dashboard ringkasan (savings rate, net worth), dan seluruh fitur behavioral yang jadi inti diferensiasi proyek ini.

## Stack

- **Backend:** Bun + Hono + `bun:sqlite`
- **Frontend:** Svelte 5 (runes) + Vite + TypeScript

Dipilih dengan sengaja tanpa framework full-stack (seperti SvelteKit) agar frontend dan backend benar-benar terpisah — REST API dari nol, bukan sekadar mengikuti template.

## Menjalankan secara lokal

### Backend

cd backend
bun install
bun run index.ts

Server berjalan di `http://localhost:3000`

### Frontend

cd frontend
bun install
bun run dev

App berjalan di `http://localhost:5173`

## Status & roadmap

Proyek ini sedang dalam pengembangan aktif, dikerjakan secara bertahap harian sebagai bagian dari proses belajar. Progress didokumentasikan lewat riwayat commit.

**Fase saat ini — Fondasi & CRUD:**
- [x] Setup backend, frontend, dan database
- [x] Create & Read transaksi
- [x] Kategori dinamis
- [x] Update transaksi
- [ ] Delete transaksi
- [ ] Dashboard (savings rate, net worth)
- [ ] Deploy

**Fase berikutnya:** UI/UX & Branding → Fitur behavioral (journal pengeluaran, target "cukup", dsb) → Integrasi API broker (Indodax) → AI layer (analisis pola, terhubung ke [proyek analisis BTC](https://github.com/Raditxt/btc-market-analysis))

## Dibuat oleh

[Raditya](https://github.com/Raditxt), Seorang mahasiswa D4 Teknik Komputer & Jaringan, yang sedang membangun proyek ini sebagai bagian dari proses belajar menjadi seorang software engineer.