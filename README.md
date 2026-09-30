# Finance App

Personal finance tracker berbasis web, terinspirasi dari buku "The Psychology of Money" (Morgan Housel). Fokusnya bukan cuma mencatat transaksi, tapi membantu memahami *pola* dan *psikologi* di balik kebiasaan finansial — bukan sekadar angka di dashboard.

## Fitur (sejauh ini)
- Catat transaksi (pemasukan/pengeluaran) dengan validasi input
- Kategori transaksi yang bisa disesuaikan sendiri, terpisah income/expense
- Edit & hapus transaksi
- Riwayat transaksi yang otomatis terurut dan ter-update real-time

## Stack
- Backend: Bun + Hono + bun:sqlite
- Frontend: Svelte 5 (runes) + Vite + TypeScript

## Cara jalanin

### Backend
cd backend
bun install
bun run index.ts
# Server jalan di http://localhost:3000

### Frontend
cd frontend
bun install
bun run dev
# App jalan di http://localhost:5173

## Status
Masih dalam pengembangan aktif. Roadmap lengkap: Fondasi & CRUD (sedang berjalan) → UI/UX & Branding → Fitur behavioral (journal, dsb) → Integrasi Indodax → Deploy → AI layer.

## Dibuat oleh
[Raditya](https://github.com/Raditxt)