# にほんごがっこう · Nihongo Gakkou

Game **3D** untuk **belajar bahasa Jepang dari nol**: hiragana, katakana, dan percakapan sehari-hari.
Kamu adalah murid pindahan dari Indonesia yang tinggal bersama Nenek Sato di sebuah kota kecil di Jepang.
Setiap hari kamu sekolah, berteman, jajan, memancing, dan pelan-pelan jadi lancar membaca huruf Jepang.

**Tanpa pertarungan.** Belajar terasa seperti di sekolah sungguhan: guru, video pelajaran, latihan menulis, kuis, dan teman sekelas.

> Rencana pengembangan lengkap ada di **[ROADMAP.md](ROADMAP.md)**. Desain lengkap v3 (cerita, kurikulum N5, suara) ada di folder **[design/](design/00-README.md)**.

## Baru: ▶ Video sensei asli (YouTube)
Pelajaran **hiragana & katakana** kini memutar video guru sungguhan dari YouTube ([hiragana](https://youtu.be/icK6kVTegDA), [katakana](https://youtu.be/5lC9rhjrHxU)), dan **hanya bagian baris hari itu** (hari あいうえお → bagian あ い う え お saja).
- Tombol **↺ Ulang bagian**, **🎨 Video animasi** (video papan tulis lama), dan **Selesai ▶** untuk lanjut latihan menulis.
- **⚙ Atur waktu bagian ini**: tandai detik mulai/selesai tiap baris sambil menonton (tersimpan di HP). **📋 Salin kode waktu** menghasilkan kode untuk diisi ke `SEG` di `public/js/ytvideo.js`, supaya semua pemain mendapat waktu yang pas.
- Tanpa internet, atau kalau dimatikan di **Pengaturan → Video sensei YouTube**, game otomatis memakai video animasi.

## Baru: 💼 Simulasi Kerja (しごと たいけん) & kawasan kerja しごとまち
Rasakan **satu hari kerja di Jepang** di bidang yang banyak diisi pekerja Indonesia (Tokutei Ginou / magang).
- 🚃 **Kawasan kerja しごとまち**: beli tiket di stasiun → naik kereta. Ada 4 bangunan yang bisa dimasuki: 🍙 **こうじょう** (pabrik makanan), 🧓 **かいご ホーム** (panti wreda), 🏗 **けんせつ** (proyek konstruksi), 🍶 **いざかや** (restoran). Bu Rina (pembimbing kerja) menyambut di depan stasiun. Bisa juga dari **Menu → 💼 Kerja**.
- 🎮 **Simulasi aktif, bukan cuma bacaan**: ruangan kerja bergambar dengan pos-pos kerja berlabel Jepang (ロッカー, てあらいば, ライン, しょくどう, KYボード, レジ…). Atasan **berjalan ke pos berikutnya**, memberi instruksi lewat **balon kata** (「てあらいば へ いこう！」), **panah menunjuk tujuan**, lalu kamu mengetuk pos itu dan karaktermu berjalan ke sana untuk mengerjakan tugasnya.
- Atasan **bereaksi langsung** (いいね！/ちがう よ…), memberi **petunjuk kalau kamu diam terlalu lama**, dan teman kerja, penghuni panti, atau tamu ikut bergerak di ruangan (tamu izakaya masuk, duduk, lalu ke kasir). Ada conveyor yang berjalan, crane yang berayun, dan lentera izakaya.
- Jam kerja berjalan (07:50 → 17:00), ruangan makin gelap di malam hari, ada daftar **📋 Tugas shift** dengan ✅/❌, dan skor ⭐.
- 🍙 **Pabrik**: penampilan, cuci tangan, rol perekat, apel pagi, cek onigiri **ヨシ！/NG**, lapor benda asing, suhu 75℃ 1 menit, 5S. 🧓 **Kaigo**: serah terima, **声かけ**, demam, bantu makan (誤嚥), kursi roda, mandi, lansia jatuh, laporan. 🏗 **Genba**: **ご安全に！**, APD, **KY活動**, patroli bahaya, **指差呼称**, ねこ = gerobak, heat stroke. 🍶 **Izakaya**: alur melayani, 〜名様, 「とりあえず生！」, alergi, cek piring, kembalian.

## v3.6 — Sinkron Bab 1–2 (Hiragana & Katakana)
- **Contoh kata di video sensei** kini hanya memakai huruf yang sudah dipelajari (31 kata baru disusun per baris). Katakana yang belum diajarkan dibantu hiragana kecil di papan tulis (アイス → あいす).
- 👀 **Mata Jeli**: latihan huruf kembar (ね/れ/わ, シ/ツ, ソ/ン, ク/ケ/タ, コ/ロ/ユ…) di Hari 10 & 21. Kuis biasa juga selalu memasukkan huruf kembar sebagai pengecoh, dan tips 26 huruf menjelaskan bedanya.
- 🔁 Soal baru **"Mana pasangan hiragananya?"** untuk katakana.
- **Romaji Otomatis** (bawaan): romaji hilang sendiri kalau semua huruf di kalimat sudah kamu pelajari; tombol **Aa** untuk mengintip.
- Kakek Mori & NPC kota disesuaikan dengan cerita. Rincian audit: [design/14-AUDIT-SINKRON-BAB1-2.md](design/14-AUDIT-SINKRON-BAB1-2.md).

## v3.5 — Bab 4 「なつやすみ」 (Musim Panas & Rahasia Gunung)
- **12 hari baru (Hari 35–46)**: **yōon** (きゃ しゅ ちょ … 66 bunyi), **っ kecil**, **bunyi panjang**, dan kanji **上 下 中 右 左**. Goresan yōon disusun otomatis dari data KanjiVG, jadi video & penilaian tulisan tetap jalan.
- 🎧 **Latihan Telinga**: きて/きって, かこ/かっこ, おばさん/おばあさん, ゆき/ゆうき.
- ♨ **Menginap di onsen desa gunung** tiga sore berturut-turut, dan 🎞 **kilas balik pertama**: bermain sebagai Dewi muda di musim panas 1976 (layar sepia) dengan mini-game **Tangkap Kunang-kunang**.
- 🎋 **Tanabata** (mini-game menyusun tanzaku), 🥁 **Natsu Matsuri** (mini-game **Taiko**), Surat #7 & #8, halaman buku #5 & #6, rahasia 「さとちゃん」.
- Tokoh baru: Pak Pos, Sato/Mori/Dewi muda. 4 kejadian musim panas, 6 pencapaian, tab **Yōon** di Buku Catatan. Naskah sensei **910 klip**.

## v3.0 — Bab 3 「てんてん と すうじ」 (Suara Baru & Angka)
- **12 hari baru (Hari 23–34)** di musim hujan: huruf ber-**tenten ゛ & maru ゜** (50 huruf) dan **14 kanji pertama** (一〜十, 百, 円, 千, 万) lengkap dengan video, urutan goresan KanjiVG, dan penilaian tulisan.
- Kuis & mini-game memakai pengecoh yang pas: が dilawankan dengan か, ぱ dengan ば & は.
- 🧾 **Kerja paruh waktu di Kafe Hanamizuki**: mini-game **Kasir Kafe** (baca pesanan katakana, harga dalam kanji 三百五十円, hitung kembalian) dengan 4 level.
- Cerita: bingkai menu kafe menyimpan halaman buku, **perjalanan ke pantai うみ** (ほこら di tebing, bertemu Emma lagi), Kakek Mori memesan melon soda, rapat warga, **Pasar Pagi**, Surat #5 & #6.
- 🔎 **Jurnal Misteri** (papan petunjuk + 6 pertanyaan besar), 🏮 **Meter Kota**, tab **Tenten** & **Kanji** di Buku Catatan, 8 pencapaian baru.
- Naskah suara sensei kini **768 klip** (`npm run voice:sensei` membuatnya ulang dari data pelajaran).

## v2.5 — 「さくら の てがみ」 (Surat-Surat Sakura)
- **Prolog** baru: tiba di stasiun Sakura-machi, dijemput Nenek Sato, malam pertama dan loteng yang terkunci.
- **Cerita besar yang saling berkaitan**: Mochi menggali **kunci loteng**, di loteng ada **surat-surat Eyang Dewi** (nenekmu sendiri!) untuk Nenek Sato dari tahun 1976.
- 📮 **Kotak Surat** (Menu → Surat): surat hanya bisa dibaca sejauh huruf yang sudah kamu pelajari — kata yang hurufnya belum dipelajari tampil **kabur**, ketuk untuk tahu kapan huruf itu dipelajari.
- 🗺️ **Peta Harta 1976** dari Mai, 📖 **buku bergambar** 『さくら と ともだち』 yang halamannya tersebar, dan 🎁 **benda kenangan**.
- 22 adegan cerita baru di Bab 1–2 (Tanaka-sensei, Kakek Mori, Kenta, Ibu Hana, Ryo, telepon dari Eyang, pengakuan Nenek Sato…).
- 🎙️ **Suara sensei siap diganti rekaman manusia**: video pelajaran memakai naskah tetap (586 klip, `voice/sensei-lines.csv`). Taruh rekaman di `public/audio/sensei/<id>.mp3` → otomatis dipakai; tanpa rekaman tetap memakai TTS.
- Save lama otomatis dimigrasi: progres tidak hilang, surat & benda yang sesuai langsung tersedia.


## Fitur utama

**Belajar**
- **Bab 1 Hiragana** (11 hari), **Bab 2 Katakana** (11 hari) & **Bab 3 Tenten & Angka** & **Bab 4 Musim Panas** (masing-masing 12 hari): 142 huruf + 66 yōon + 19 kanji, ulangan, dan ujian.
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
- **iPhone/iPad**: Pengaturan → Aksesibilitas → Konten Lisan → Suara → unduh suara Jepang (Kyoko/Otoya, pilih versi *Ditingkatkan/Premium* agar tidak kaku) & Indonesia (Damayanti). Tutup game sepenuhnya lalu buka lagi.
- Di game buka **Menu → Pengaturan → Suara** untuk memilih suara paling alami dan tekan *Tes*.

**Kenapa di iPhone berbeda dengan Android? (diperbaiki di v3.6.1)**
- iOS membisukan Web Audio (efek & musik) saat tombol senyap aktif, sedangkan Android tidak. Game kini meminta sesi audio "playback" (iOS 17+: `navigator.audioSession`, iOS lama: audio senyap yang diputar berulang), jadi efek & musik tetap terdengar seperti di Android.
- iOS menghentikan audio ("interrupted") setelah sensei berbicara lewat TTS, setelah telepon, atau saat pindah aplikasi. Dulu efek & musik bisa hilang setelah video pertama; kini audio dibangunkan lagi setelah setiap kalimat TTS dan di setiap ketukan.
- Efek suara & musik kini memakai satu AudioContext bersama, dan rekaman suara memakai satu elemen audio yang dibuka saat ketukan pertama (iOS menolak memutar audio baru di luar ketukan).
- Suara TTS iPhone memang berbeda dengan Google di Android; unduh versi *Ditingkatkan/Premium* agar lebih alami.

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
npm run test:bab4    # uji browser Bab 4 (yōon, onsen, kilas balik, Tanabata, matsuri)
npm run test:bab3    # uji browser Bab 3 (kuis tenten, kasir, pantai, Pasar Pagi)
npm run test:story   # uji browser alur cerita (butuh: pip install playwright && python -m playwright install chromium; jalankan `npm run preview` dulu di port 4173)
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
src/story/                  ★ cerita v3: surat, buku bergambar, peta harta, adegan, mesin flag & migrasi save
src/ui/LetterBox.tsx        ★ Kotak Surat (React)
src/systems/voice.ts        suara: rekaman manusia/AI → cadangan TTS
src/data/voice/sensei-vo.json  ★ naskah tetap sensei (dipakai video pelajaran)
design/                     dokumen desain lengkap v3 (cerita Bab 1–6, kurikulum N5, suara)
public/js/data*.js          ★ materi pelajaran, cerita, tokoh, kejadian harian (data4.js = Bab 3)
public/js/strokes3.js       urutan goresan tenten & kanji angka (KanjiVG, CC BY-SA 3.0)
src/story/scenes3.ts, kasir.ts  cerita Bab 3 & mini-game Kasir Kafe
src/story/scenes4.ts, games4.ts cerita Bab 4 & mini-game (latihan telinga, kunang-kunang, tanzaku, taiko)
scripts/sensei-vo.mjs       pembuat naskah suara sensei dari data pelajaran
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
