# Suara asli penutur Jepang (bukan TTS)

Game ini bisa memutar **rekaman suara orang Jepang sungguhan**. Untuk kalimat yang sudah
direkam, file rekaman yang diputar. Kalimat yang belum direkam tetap memakai suara TTS perangkat,
jadi rekaman bisa ditambah sedikit demi sedikit.

## Alurnya

1. **Buat daftar kalimat**
   ```bash
   npm run voice:export
   ```
   Hasilnya `voice/voice-lines.csv` (±750 baris), diurutkan dari yang paling sering muncul.
   Kolomnya: `file` (nama file rekaman), `jp`, `romaji`, `arti`.
2. **Rekam.** Kirim CSV ke pengisi suara. Setiap kalimat disimpan sebagai file bernama sesuai kolom `file`
   (contoh: `f4280c51.mp3` untuk いただきます！).
3. **Taruh file** di `public/audio/ja/`.
4. **Daftarkan rekaman**
   ```bash
   npm run voice:manifest
   ```
   Perintah ini memperbarui `public/audio/manifest.json`. Setelah itu build seperti biasa (`npm run build:pages`).

> Nama file = kode hash dari kalimatnya. Kalau teks kalimat di game diubah, nama filenya ikut berubah,
> jadi jalankan lagi `voice:export` dan rekam ulang kalimat itu.

## Standar rekaman

- Format **MP3**, mono, 44.1 kHz, 96–128 kbps.
- Potong jeda hening di awal & akhir (sisakan ±0.1 detik).
- Volume rata (sekitar −16 LUFS), tanpa gema atau musik.
- Intonasi **standar Tokyo (hyōjungo)**, tempo sedikit lebih pelan dari percakapan biasa (untuk pemula).
- Gunakan suara yang cocok untuk tiap tokoh bila memungkinkan: Sensei (dewasa, tenang), Yuki/Hana (remaja),
  Kenta (remaja laki-laki), Nenek (lembut). Minimal 1 pria + 1 wanita sudah cukup bagus.

## Prioritas (kalau belum bisa merekam semuanya)

1. **92 huruf kana** (あ, い, う … ン). Ini yang paling sering didengar di pelajaran, kuis, dan karuta.
2. **Salam & ungkapan harian** (baris teratas CSV): いただきます, おはよう, ありがとう, いらっしゃいませ…
3. **Kosakata** (kata contoh di video & kuis).
4. Baru kemudian dialog cerita.

## Di mana mencari suara asli (bukan AI / bukan Google)

| Pilihan | Keterangan |
|---|---|
| **Pengisi suara lepas (freelance)** | Cari "Japanese native voice over" di Fiverr, Upwork, atau Coconala / Skeb (situs Jepang). Minta rekaman sesuai CSV. Cara ini paling rapi dan konsisten. |
| **Teman / guru / komunitas penutur asli** | Mahasiswa Jepang di kampus, komunitas pertukaran bahasa (HelloTalk, Tandem), atau guru les. Rekam dengan mikrofon HP di ruangan sunyi. |
| **Tatoeba** (tatoeba.org) | Kumpulan kalimat dengan rekaman suara penutur asli. Lisensinya berbeda-beda per perekam (ada yang CC BY, ada yang CC BY-NC, dll.). Cek lisensi tiap file dan cantumkan kredit. |
| **Wikimedia Commons** | Ada rekaman pelafalan huruf/kata oleh penutur asli dengan lisensi bebas (cek per file, cantumkan kredit). Cocok untuk 92 huruf kana. |

Hindari mengambil audio dari situs yang lisensinya tidak mengizinkan dipakai ulang (mis. Forvo, rekaman dari anime/YouTube).

## Kalau terpaksa memakai suara sintetis

Suara TTS bawaan perangkat tetap dipakai sebagai cadangan. Di **Menu → Pengaturan → Suara** pemain bisa memilih
suara paling alami yang ada di HP-nya (biasanya yang bernama *Natural*, *Online*, *Kyoko*, atau *O-ren*).
