# にほんごがっこう · Nihongo Gakkou

Game RPG *pixel art* 2D untuk **belajar bahasa Jepang dari nol**, terinspirasi dari game seperti *Wagotabi*.
Kamu menjadi murid pindahan dari Indonesia di sebuah kota kecil di Jepang: jalan-jalan keliling kota,
mengobrol dengan teman dan warga, lalu belajar hiragana di sekolah bersama Tanaka-sensei.

**Tanpa sistem bertarung.** Semua latihan terjadi di kelas, seperti di sekolah sungguhan.

## Isi Bab 1: Hiragana (11 hari sekolah)

| Hari | Pelajaran | Percakapan sehari-hari |
|---|---|---|
| 1 | あ い う え お | おはよう, はじめまして, よろしく |
| 2 | か き く け こ | げんき？, ありがとう, どういたしまして |
| 3 | さ し す せ そ | 〜さん, どこから きましたか |
| 4 | た ち つ て と | すみません, だいじょうぶ |
| 5 | **Ulangan 1** | がんばって, また あした |
| 6 | な に ぬ ね の | いただきます, ごちそうさまでした |
| 7 | は ひ ふ へ ほ | これ / それ, なんですか |
| 8 | ま み む め も | すき, おいしい |
| 9 | や ゆ よ ら り る れ ろ | いま なんじ？, いいよ |
| 10 | わ を ん | たのしい, わかりません |
| 11 | **Ujian Akhir** | おめでとう |

### Satu hari di game
1. **Pagi**: sapa teman di kota (pilih jawaban bahasa Jepang yang tepat).
2. **Sekolah**: kenalan huruf baru (suara + cara mengingat + contoh kata), menulis huruf dengan jari, lalu latihan soal.
3. **Sore**: ngobrol dengan teman memakai kalimat sehari-hari.
4. **Malam**: pulang, tidur, dan baca **Buku Harian** (rangkuman hari itu).

### Fitur belajar
- Setiap kalimat Jepang **bisa didengar** (memakai suara bawaan HP/browser).
- **Romaji** dan arti bahasa Indonesia, romaji bisa dimatikan setelah lancar.
- **Salah tidak dihukum**: selalu ada penjelasan, dan pilihan yang salah dihapus sampai kamu menemukan jawabannya.
- Huruf yang sering salah **lebih sering muncul** lagi di latihan.
- **Papan nama di kota** bisa dibaca sedikit demi sedikit. Huruf yang belum dipelajari tampil sebagai `?`.
- **Buku Catatan** (tabel hiragana, kosakata, kalimat), **Rapor**, dan **Latihan Bebas**.
- Pertemanan ♥ dengan Yuki dan Kenta naik saat kamu menjawab benar pada percobaan pertama.

## Cara main
- **HP**: ketuk layar untuk berjalan, atau pakai tombol arah. Ketuk orang atau tekan **A** untuk bicara. **B/MENU** membuka menu.
- **Tugas** selalu tertulis di kiri atas. **Ketuk tulisan itu** untuk berjalan otomatis ke tujuan.
- **Keyboard**: panah/WASD untuk berjalan, Spasi/Enter/Z = A, X/Esc = B, angka 1–4 untuk memilih jawaban.

## Menjalankan
Tanpa instalasi dan tanpa build. Cukup HTML, CSS, dan JavaScript biasa.

```bash
# dari folder proyek
python3 -m http.server 8000
# lalu buka http://localhost:8000 di browser (atau di HP dengan IP komputermu)
```

File `index.html` juga bisa langsung dibuka di browser. Mode offline baru aktif jika dibuka lewat server (http/https).

### Online gratis dengan GitHub Pages
Repo → **Settings → Pages** → Source: *Deploy from a branch* → pilih branch dan folder `/ (root)`.
Setelah itu game bisa dibuka di HP lewat link, lalu **"Tambahkan ke layar utama"** agar bisa dimainkan seperti aplikasi, bahkan tanpa internet.

## Struktur kode

```
index.html          halaman utama
css/style.css       tampilan retro (jendela dialog, tombol, papan tulis)
js/data.js          ★ MATERI: huruf, kosakata, 11 hari sekolah, dialog warga
js/pixel.js         pixel art karakter (sprite jalan 16x16 + potret wajah 32x32)
js/maps.js          peta kota, kelas, kamar + gambar ubin/bangunan
js/world.js         mesin dunia: berjalan, kamera, tabrakan, cari jalur saat diketuk
js/game.js          alur hari sekolah, tugas, menu, buku catatan, rapor
js/lesson.js        pelajaran: kenalan huruf, latihan menulis, soal
js/ui.js            kotak dialog, pilihan, panel, notifikasi
js/audio.js         suara bahasa Jepang (Text-to-Speech) + efek suara 8-bit
js/save.js          simpan progres di browser (localStorage)
sw.js, manifest     mode offline & bisa dipasang di HP
```

### Menambah materi
Semua materi ada di `js/data.js`. Untuk menambah hari baru, salin satu objek di `DAYS` lalu ubah:
huruf (`kana`), dialog pagi (`morning`), dialog kelas (`cls`), dialog sore (`brk`), dan `phrases`.

### Mengganti gambar karakter
Karakter digambar dari kode di `js/pixel.js` (palet warna `PAL` dan gaya `STYLE`).
Ubah warna rambut/baju di `PAL` untuk membuat karakter baru. Kalau nanti ingin memakai gambar buatan sendiri
(misalnya dari Aseprite atau Piskel), cukup ganti fungsi `sprite()` dan `portrait()` agar memuat file PNG.

## Rencana berikutnya
- Bab 2: Katakana & belanja di konbini (angka, harga)
- Bab 3: Stasiun & bepergian ke kota lain (waktu, arah)
- Musik latar chiptune
