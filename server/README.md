# Server Online — Nihongo Gakkou

Server kecil (Node.js + WebSocket) supaya pemain bisa **bertemu di kota yang sama**, saling melihat avatar, dan menyapa dengan **stempel frasa bahasa Jepang**.

- Tidak ada teks bebas, hanya frasa dari daftar, jadi aman untuk anak-anak dan tidak ada spam kata kasar.
- Server hanya meneruskan posisi, penampilan karakter, dan nomor frasa. Tidak ada data pribadi yang disimpan.
- Game tetap bisa dimainkan sepenuhnya **tanpa** server ini.

## Menjalankan di komputer sendiri

```bash
cd server
npm install
npm start          # berjalan di port 8787
```

Di game: **Menu → Pengaturan → Online**, isi `ws://localhost:8787`, lalu tekan **Sambungkan**.
Untuk teman di Wi-Fi yang sama, pakai IP komputermu, misalnya `ws://192.168.1.10:8787`.

## Online gratis (contoh: Render.com)

1. Buat akun di render.com → **New → Web Service** → pilih repo ini.
2. **Root Directory**: `server` · **Build Command**: `npm install` · **Start Command**: `npm start`.
3. Setelah aktif, alamatnya kira-kira `https://nama-kamu.onrender.com`.
4. Di game isi alamat server: `wss://nama-kamu.onrender.com`.

Layanan lain yang juga bisa: Railway, Fly.io, Glitch, atau VPS sendiri.

> Catatan: jika game dibuka lewat `https://` (misalnya GitHub Pages), server **harus** memakai `wss://` (aman). Browser memblokir `ws://` dari halaman https.

## Pengaturan (variabel lingkungan)

| Nama | Bawaan | Arti |
|---|---|---|
| `PORT` | `8787` | Port server |
| `MAX_PLAYERS` | `100` | Batas jumlah pemain bersamaan |

## Protokol singkat

Pesan dari klien: `hello` (nama, penampilan, posisi), `move`, `say` (nomor frasa), `look`.
Pesan dari server: `welcome`, `join`, `move`, `say`, `look`, `leave`.
Server memvalidasi semua isi pesan dan membatasi ±10 pesan per detik per pemain.
