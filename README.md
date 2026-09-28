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
- Dunia 3D gaya HD-2D (Three.js): bangunan low-poly + karakter pixel art, cahaya pagi/sore/malam, kelopak sakura.
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

Tanpa build. Cukup HTML, CSS, JavaScript.

```bash
python3 -m http.server 8000
# buka http://localhost:8000
```

> Mode 3D butuh server (http/https). Jika `index.html` dibuka langsung dari file, game otomatis memakai mode 2D.

**GitHub Pages**: Settings → Pages → *Deploy from a branch* → pilih branch & folder `/ (root)`.

**Online bersama**: lihat [server/README.md](server/README.md).

## Struktur kode

```
index.html              halaman utama
css/style.css           tampilan (jendela retro, papan tulis, video, mini-game)
js/data.js              ★ materi Bab 1 (hiragana), tokoh, kosakata
js/data2.js             ★ materi Bab 2 (katakana), sarapan/makan siang/makan malam, klub, misi, event
js/data3.js             ★ variasi harian: kejadian, cuaca, makan siang spesial, rotasi latihan
js/extras.js            ★ jajanan, pencapaian, streak, ulasan harian (SRS)
js/relax.js             ★ memancing, hewan peliharaan, bangku taman, buku cerita
js/strokes.js           data urutan goresan (KanjiVG, CC BY-SA 3.0)
js/portrait.js          potret karakter 48x48 (ekspresi)
js/pixel.js             sprite karakter & hewan, kustomisasi
js/maps.js              peta & ubin (kota, rumah, kelas, atap, perpustakaan, klub)
js/world3d.js           dunia 3D (Three.js)
js/world.js             dunia 2D (cadangan)
js/game.js              alur hari, dialog, menu, lemari, pengaturan
js/lesson.js            pelajaran & kuis
js/video.js             video pelajaran animasi
js/games.js             mini-game belajar
js/music.js / audio.js  musik latar, suara Jepang (TTS), efek suara
js/online.js            klien online (stempel frasa)
js/ui.js / save.js      antarmuka & simpan progres
server/                 server online (Node.js + WebSocket)
```

## Lisensi data
- Data urutan goresan: **KanjiVG** © Ulrich Apel, CC BY-SA 3.0 (http://kanjivg.tagaini.net). File `js/strokes.js` dibagikan dengan lisensi yang sama.
- Three.js: lisensi MIT (`js/vendor/three.LICENSE`).
