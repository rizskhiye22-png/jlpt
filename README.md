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
- **React + TypeScript + Vite**, dunia 3D dengan **Three.js**, halaman React dengan **React Three Fiber**.
- **Karakter manusia 3D realistis** buatan kode (tanpa file model): proporsi manusia, wajah dengan mata berkilau yang berkedip & berekspresi, rambut, seragam sekolah (pelaut, gakuran, blazer), animasi jalan & bernapas, bayangan lembut.
- Potret dialog & video sensei difoto langsung dari model 3D tokohnya.
- 👥 Halaman **Teman**: putar model 3D tiap tokoh, lihat keakraban & jajanan favorit, dengarkan perkenalan dirinya dalam bahasa Jepang.
- Cahaya pagi/sore/malam, hujan, kelopak sakura.
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
```

**GitHub Pages**: Settings → Pages → *Source: GitHub Actions*. Setiap push ke `main` otomatis dibuild & diterbitkan (`.github/workflows/deploy.yml`).

**Online bersama**: lihat [server/README.md](server/README.md).

## Struktur kode

Pindah ke React + TypeScript dilakukan **bertahap**: mesin 3D & karakter sudah TypeScript,
logika pelajaran/cerita lama masih JavaScript biasa di `public/js` dan dipindah satu per satu.

```
index.html                  halaman utama (memuat modul lama + src/main.tsx)
src/main.tsx                titik masuk: pasang mesin 3D, potret 3D, antarmuka React
src/world/world3d.ts        dunia 3D (Three.js): peta, cahaya, cuaca, kamera, jalan
src/world/humanoid.ts       ★ karakter manusia 3D prosedural + kerangka & animasi
src/world/face.ts           wajah dilukis (mata, alis, mulut, ekspresi, kedip)
src/world/spec.ts           dari palet/gaya tokoh → spesifikasi 3D
src/world/animal.ts         kucing Mochi & hewan peliharaan 3D
src/world/portrait3d.ts     foto potret dari model 3D (dialog, video, lemari)
src/ui/Friends.tsx          halaman Teman (React + React Three Fiber)
src/ui/pages.tsx, mount.ts  jembatan React ↔ panel lama (dimuat saat dibutuhkan)
src/legacy.d.ts             tipe untuk modul lama
public/js/data*.js          ★ materi pelajaran, cerita, tokoh, kejadian harian
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
- Three.js, React, React Three Fiber: lisensi MIT (lihat `node_modules/*/LICENSE`).
