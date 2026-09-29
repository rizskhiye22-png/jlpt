# にほんごがっこう · Nihongo Gakkou

Game **3D** untuk **belajar bahasa Jepang dari nol**: hiragana, katakana, dan percakapan sehari-hari.
Kamu adalah murid pindahan dari Indonesia yang tinggal bersama Nenek Sato di sebuah kota kecil di Jepang.
Setiap hari kamu sekolah, berteman, jajan, memancing, dan pelan-pelan jadi lancar membaca huruf Jepang.

**Tanpa pertarungan.** Belajar terasa seperti di sekolah sungguhan: guru, video pelajaran, latihan menulis, kuis, dan teman sekelas.

> Rencana pengembangan lengkap ada di **[ROADMAP.md](ROADMAP.md)**.

## Fitur utama

**Belajar**
- **Bab 1 Hiragana** (11 hari) & **Bab 2 Katakana** (11 hari): 92 huruf, ulangan, dan ujian.
- **Video pelajaran animasi** dari sensei: urutan goresan asli, subtitle, narasi suara sensei yang santai, putar/jeda/ulang/kecepatan.
- **Latihan menulis bertahap** per goresan (langkah 1 → 1+2 → …), dinilai otomatis dengan stempel hanko.
- **Ulasan Harian** (spaced repetition): huruf muncul lagi tepat sebelum lupa.
- Setelah video, **pilihan latihan berganti setiap hari**: Karuta, Hujan Huruf, Susun Kata, Benar/Salah Kilat, Cari Huruf, Pasangkan Kata, Dikte (+ Kaligrafi & Belanja Konbini).
- Percakapan sehari-hari dalam cerita: sarapan (いただきます), berangkat (いってきます), pulang (ただいま), belanja (いくら ですか).
- Suara bahasa Jepang, romaji & arti, **mode santai** tanpa batas waktu. Salah tidak pernah dihukum.

**Kota yang bisa dijelajahi**
- Kota 2x lebih luas: **jalan belanja (おみせ)** dengan kafe, toko buku, pos polisi (こうばん), kedai ramen, dan **taman dengan air mancur**.
- Bisa masuk ke **konbini**, **stasiun (えき)**, kafe, kedai ramen, toko buku, dan pos polisi.
- Adegan sehari-hari di tiap tempat:
  - 🏪 Konbini: kasir menyapa いらっしゃいませ, ditanya ふくろ は いりますか？, bekal dipanaskan (あたためますか？), rak barang berlabel katakana.
  - 🚉 Stasiun: beli きっぷ di mesin (baca nama tujuan), lewati gerbang tiket, pengumuman peron, tanya petugas (トイレ は どこ ですか？).
  - 🚃 Naik kereta ke **pantai (うみ)**: kerang berhuruf untuk dibaca, memancing ikan laut (たい, たこ, ふぐ…), es serut.
  - ☕ Kafe: pesan menu katakana dengan 〜を ください. 🍜 Ramen: beli tiket makan (しょっけん), ucapkan いただきます.
  - 📚 Toko buku: kosakata buku (まんが, じしょ, えほん) + rak buku cerita. 👮 Pos polisi: belajar arah (みぎ, ひだり, まっすぐ).

**Jalur kereta ke seluruh "Jepang mini"** (beli きっぷ di stasiun: baca nama tujuan & harga dalam bahasa Jepang)
- 🏖 **うみ** (pantai): kerang berhuruf, memancing ikan laut, es serut.
- ⛰ **やま** (desa gunung): **penginapan onsen** (resepsionis, aturan mandi ○×, yukata, susu kopi, telur onsen), toko soba, sawah (こめ/ごはん), orang-orangan sawah, patung jizo, pemandian kaki, daun もみじ berhuruf.
- 🏙 **まち** (kota besar): **lampu penyeberangan** (menyeberang saat あお!), department store (lantai いっかい/にかい/さんがい), **sushi putar** (mini-game ambil piring sesuai pesanan), karaoke (lengkapi lirik lagu tradisional), toko baju (warna & ukuran), プリクラ (foto stiker), patung Hachiko.
- ⛩ **てら** (kota kuil kuno): kuil Buddha (bedanya dengan jinja), **lonceng かね** (mini-game ketepatan), **upacara teh** (susun urutan langkah), jimat おまもり, rusa yang membungkuk (おじぎ), lentera batu, kolam koi.
- 🍱 **Menu & Buku Makanan**: pesan makanan dengan 〜を ください / 〜に します, dengar harga dalam bahasa Jepang (さんびゃく えん…), kumpulkan 20 makanan Jepang.

**Bermain & bersantai**
- Hari penuh dengan pilihan: makan siang di atap/kelas/perpustakaan (+ menu spesial harian), klub (kaligrafi, karuta, memasak, sains) dengan klub unggulan ★.
- **Kejadian harian ★** yang berbeda tiap hari (anak hilang, turis tersesat, payung saat hujan, kembang api, dompet jatuh…) & cuaca cerah/berawan/hujan.
- 🎣 Memancing (baca huruf untuk menarik pancing) + Buku Ikan.
- 🐱 Hewan peliharaan yang mengikutimu, 🪑 duduk di taman, 📚 buku cerita di perpustakaan.
- 🍡 Jidouhanbaiki, warung yatai, & konbini: beli jajanan Jepang (おにぎり, だんご, たいやき, ラムネ…), makan, atau beri hadiah ke teman.
- Misi sampingan, event persahabatan, omikuji di kuil, stempel, **24 pencapaian**, streak harian.
- Kustomisasi karakter (rambut, warna, seragam, aksesori) + lemari.
- 🌐 **Online (opsional)**: bertemu pemain lain di kota & saling menyapa dengan stempel frasa Jepang.

**Teknis**
- **React + TypeScript + Vite**; dunia 3D gaya HD-2D dengan **Three.js** (TypeScript).
- Karakter tetap **pixel art 2D yang lucu** buatan kode, berdiri di dunia 3D: bangunan low-poly, cahaya pagi/sore/malam, hujan, kelopak sakura.
- 👥 Halaman **Teman** (React): potret & sprite tiap tokoh, keakraban, jajanan favorit, dan perkenalan diri dalam bahasa Jepang yang bisa didengarkan.
- Mode 2D klasik otomatis untuk HP yang tidak mendukung WebGL.
- Musik latar dibuat langsung oleh browser (tanpa file MP3). Grafis dari kode, tanpa gambar besar.
- PWA: bisa dipasang di layar utama HP & dimainkan offline.

## Suara di HP
Suara memakai Text-to-Speech bawaan perangkat. Jika video sensei tidak bersuara:
- **Android**: Pengaturan → Aksesibilitas/Sistem → *Text-to-Speech* → mesin **Google** → pasang data suara **日本語 (Jepang)** dan **Bahasa Indonesia**.
- **iPhone**: Pengaturan → Aksesibilitas → Konten Lisan → Suara → unduh suara Jepang (mis. Kyoko/O-ren) & Indonesia (Damayanti).
- Matikan mode senyap, lalu di game buka **Menu → Pengaturan → Suara** untuk memilih suara paling alami dan tekan *Tes*.

## Cara main
- **HP**: ketuk layar untuk berjalan (atau tombol arah). Ketuk orang/benda atau tekan **A** untuk bicara. **B/MENU** membuka menu.
- **Tugas** selalu tertulis di kiri atas. **Ketuk tulisan itu** untuk berjalan otomatis ke tujuan.
- 📝 di kanan atas = huruf yang perlu diulas hari ini. 🌸 = poin sakura.
- **Keyboard**: panah/WASD, Spasi/Enter/Z = A, X/Esc = B, angka 1–4 untuk memilih jawaban.

## Menjalankan

Butuh **Node.js 20+**.

```bash
npm install
npm run dev        # mode pengembangan → buka alamat yang muncul (bisa dari HP di jaringan yang sama)
npm run build      # hasil siap terbit di folder dist/
npm run preview    # coba hasil build
npm run typecheck  # cek TypeScript
npm run build:pages  # hasil build ke folder docs/ (untuk GitHub Pages tanpa Actions)
```

**Menerbitkan (GitHub Pages)**, pilih salah satu:
- **Paling mudah:** Settings → Pages → *Deploy from a branch* → pilih branch-nya → folder **`/docs`**.
  Folder `docs/` berisi game yang sudah dibuild. Jalankan `npm run build:pages` setiap kali selesai mengubah kode.
- **Otomatis:** Settings → Pages → *Source: GitHub Actions*. Setiap push ke `main` dibuild & diterbitkan (`.github/workflows/deploy.yml`).

> Jika halaman dibuka dari akar repo tanpa build (mis. *Deploy from a branch* → `/ (root)`), game otomatis pindah ke `docs/`.
> Untuk APK / aplikasi pembungkus (WebView, Capacitor, dll.), gunakan isi folder **`docs/`** (atau `dist/`), bukan file sumber.

**Suara asli penutur Jepang:** lihat [voice/README.md](voice/README.md). Rekaman MP3 di `public/audio/ja/` otomatis dipakai menggantikan suara TTS.

**Online bersama**: lihat [server/README.md](server/README.md).

## Struktur kode

Pindah ke React + TypeScript dilakukan **bertahap**: mesin 3D & halaman Teman sudah TypeScript/React,
logika pelajaran/cerita lama masih JavaScript biasa di `public/js` dan dipindah satu per satu.

```
index.html                  halaman utama (memuat modul lama + src/main.tsx)
src/main.tsx                titik masuk: pasang mesin 3D & antarmuka React
src/world/world3d.ts        dunia 3D (Three.js): peta, karakter pixel, cahaya, cuaca, kamera, jalan
src/ui/Friends.tsx          halaman Teman (React)
src/ui/pages.tsx, mount.ts  jembatan React ↔ panel lama (dimuat saat dibutuhkan)
src/legacy.d.ts             tipe untuk modul lama
public/js/data*.js          ★ materi pelajaran, cerita, tokoh, kejadian harian
public/js/places.js         ★ tempat di kota (konbini, stasiun, kafe, ramen, toko buku, pos polisi, pantai)
public/js/places2.js        ★ jalur kereta (やま, まち, てら), menu restoran, Buku Makanan, mini-game dunia Jepang
public/js/pixel.js, portrait.js   ★ karakter pixel art & potret (dibuat dari kode)
public/js/game.js           alur hari, dialog, menu, lemari, pengaturan
public/js/lesson.js, games.js, video.js   pelajaran, mini-game, video sensei
public/js/extras.js, relax.js             jajanan, pencapaian, SRS, memancing, hewan
public/js/world.js          dunia 2D (cadangan untuk HP tanpa WebGL)
public/js/ui.js, save.js, audio.js, music.js, online.js
public/css/style.css        tampilan
server/                     server online (Node.js + WebSocket)
```

## Lisensi data
- Data urutan goresan: **KanjiVG** © Ulrich Apel, CC BY-SA 3.0 (http://kanjivg.tagaini.net). File `js/strokes.js` dibagikan dengan lisensi yang sama.
- Three.js, React: lisensi MIT (lihat `node_modules/*/LICENSE`).
