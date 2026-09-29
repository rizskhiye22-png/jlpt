# ROADMAP — Nihongo Gakkou

Dokumen ini berisi rencana pengembangan **Nihongo Gakkou** supaya menjadi game belajar bahasa Jepang yang:

- **sangat ramah pemula**: mulai dari nol, tanpa rasa takut salah;
- **seru dan menyenangkan**: terasa seperti bermain game, bukan mengerjakan soal;
- **tampil hidup, tidak kaku**: dunia yang bergerak, karakter yang punya kepribadian;
- **membuat pemain ingin kembali setiap hari**: ada alasan kecil untuk login lagi besok.

Status tiap poin: ✅ sudah ada · 🚧 dikerjakan di pembaruan ini · 🔜 berikutnya · 💡 ide jangka panjang

---

## 1. Prinsip desain

| Prinsip | Artinya di dalam game |
|---|---|
| **Belajar lewat cerita** | Setiap huruf dan kalimat langsung dipakai dalam situasi nyata: sarapan, di kelas, belanja, festival. |
| **Sedikit tapi sering** | 3–8 huruf baru per hari. Sesi 10–20 menit terasa lengkap. |
| **Salah itu aman** | Tidak ada "game over". Jawaban salah selalu dijelaskan, lalu pilihan salah dihapus. |
| **Banyak cara belajar** | Melihat (video), mendengar (suara), menulis (kaligrafi), membaca (papan kota), bicara (dialog). |
| **Hadiah yang terasa** | Bintang, poin sakura, stempel, pencapaian, jajanan, aksesori: kemajuan selalu terlihat. |
| **Ringan & nyaman di HP** | Tombol besar, bisa satu tangan, ketuk untuk berjalan, grafis bisa dihemat. |

---

## 2. Yang sudah ada (✅)

- Dunia **3D gaya HD-2D** (Three.js) + mode 2D cadangan untuk HP lama.
- **Bab 1 Hiragana** & **Bab 2 Katakana**: 22 hari sekolah, 92 huruf, ulangan & ujian.
- Satu hari penuh: sarapan → sapa teman → pelajaran 1 → makan siang (pilih tempat) → pelajaran 2 → klub (pilih) → sore di kota → makan malam → tidur & buku harian.
- **Setiap hari berbeda**: setelah video, pilihan latihan berganti tiap hari (3 dari 7 permainan), ada **kejadian harian** (anak hilang, turis, payung saat hujan, kembang api, dompet jatuh, dll.), **cuaca** (cerah/berawan/hujan), makan siang spesial, dan klub unggulan ★.
- **Video pelajaran animasi** dari sensei: urutan goresan asli (KanjiVG), subtitle, narasi suara sensei yang santai (bahasa Indonesia + sapaan Jepang), putar/jeda/ulang/kecepatan.
- **Latihan menulis bertahap per goresan** (langkah 1 → 1+2 → …) dengan penilaian otomatis & stempel hanko.
- Mini-game: **Karuta, Hujan Huruf, Susun Kata, Kaligrafi, Belanja Konbini, Benar/Salah Kilat, Cari Huruf, Pasangkan Kata, Dikte**.
- Setiap kegiatan punya tombol **✕ keluar** dan tombol B/Esc selalu bisa menutup menu (tidak ada lagi layar macet).
- Karakter pixel art buatan kode, potret berekspresi, **kustomisasi pemain** + lemari.
- Misi sampingan, event persahabatan, omikuji di kuil, stempel, poin sakura.
- Musik latar generatif bernuansa Jepang (otomatis mengecil saat sensei bicara), efek suara 8-bit.
- Suara TTS: otomatis memilih suara paling alami di perangkat (Natural/Google/Online), bisa dipilih manual di Pengaturan, aman untuk HP Android/iOS.
- PWA offline, simpan otomatis, pengaturan lengkap (romaji, mode santai, kualitas grafis, dll.).

---

## 3. Pembelajaran (inti dari game)

### 3.1 Ulangan berjarak (Spaced Repetition) — ✅
Huruf yang sudah dipelajari harus **muncul lagi tepat sebelum lupa**.
- Sistem kotak Leitner: setiap huruf punya "kotak" 1–5. Benar → naik kotak (jeda makin panjang: 1, 2, 4, 7, 14 hari). Salah → kembali ke kotak 1.
- **Ulasan Harian** di meja belajar/menu: 10–15 huruf yang "jatuh tempo" hari ini.
- Indikator di HUD: "📝 6 huruf perlu diulas".

### 3.2 Materi lanjutan — 🔜
1. **Dakuten & handakuten** (が, ざ, だ, ば, ぱ…): Bab 3, tanda ゛ dan ゜ dijelaskan lewat video.
2. **Yōon** (きゃ, しゅ, ちょ…) & **tsu kecil** (っ/ッ) & bunyi panjang: Bab 4.
3. **Angka & harga** (いち〜じゅう, ひゃく, せん) dipakai di konbini dan jidouhanbaiki.
4. **Waktu & hari** (〜じ, なんようび) dipakai di jadwal sekolah & stasiun.
5. **Kanji dasar N5** (日, 月, 山, 川, 人, 口…): kanji muncul di papan kota dan bisa "dikoleksi".
6. **Pola kalimat N5**: 〜は〜です, 〜が すき, 〜を ください, 〜に いきます, dipakai dalam dialog.

### 3.3 Cara belajar tambahan — 🔜
- **Latihan bicara**: pemain mengucapkan kalimat ke mikrofon (Web Speech Recognition), sensei memberi nilai.
- **Mendengar tanpa teks**: mode "tutup romaji" di dialog untuk melatih telinga.
- **Furigana bertahap**: romaji → hiragana → tanpa bantuan, sesuai kemampuan.
- **Tes penempatan**: pemain yang sudah bisa hiragana bisa langsung loncat ke Bab 2.
- **Kamus bergambar**: setiap kata di Buku Catatan punya ilustrasi pixel & contoh kalimat.

### 3.4 Pelacakan kemampuan — 🔜
- Grafik kemajuan mingguan (huruf dikuasai, ketepatan, menit belajar).
- "Huruf rawan": huruf yang sering tertukar (シ/ツ, ソ/ン, ぬ/め) mendapat mini-latihan khusus.
- Target JLPT N5 (bab 1–6 ≈ seluruh kana + 100 kanji + 800 kata).

---

## 4. Keseruan & alasan untuk kembali

### 4.1 Pencapaian (achievement) — ✅ (24 lencana)
Lencana untuk tonggak kecil & besar, dengan pop-up yang memuaskan:
- *Langkah Pertama* (hari 1 selesai), *Tangan Kaligrafer* (10× nilai すごい), *Juara Karuta*, *Ahli Hiragana* (46 huruf), *Ahli Katakana*, *Sahabat Yuki* (♥10), *Pemburu Jajanan* (coba 8 jajanan), *Rajin* (streak 7 hari), *Detektif Kucing* (misi Mochi), dll.
- Setiap lencana memberi poin sakura.

### 4.2 Streak harian & bonus login — ✅
- 🔥 Streak: jumlah hari berturut-turut bermain. Bonus poin naik tiap hari (maks. di hari ke-7).
- "Hadiah hari ini" kecil saat membuka game (poin/jajanan).

### 4.3 Jidouhanbaiki & jajanan Jepang — ✅ (13 jajanan, 3 tempat beli)
Mesin minuman (自動販売機, *jidouhanbaiki*) di kota + konbini menjual jajanan khas Jepang, dibeli dengan poin sakura:
- おにぎり (onigiri), だんご (dango), たいやき (taiyaki), メロンパン (melon pan), どらやき (dorayaki), せんべい (senbei), もち (mochi), プリン (purin), ラムネ (ramune), おちゃ (teh hijau)…
- Nama barang **ditulis dalam hiragana/katakana**, jadi membeli = latihan membaca.
- Setiap jajanan punya **fakta budaya** saat dimakan (+ ucapan いただきます / ごちそうさま).
- **Hadiah untuk teman**: setiap teman punya jajanan favorit → ♥ naik lebih banyak.
- Koleksi "Buku Jajanan" untuk dilengkapi.

### 4.4 Mini-game baru — 🔜
- ✅ **Memancing** sudah ada (lihat 4.6). 🔜 Variasi: turnamen memancing & ikan musiman.
- **Ritme Taiko**: tekan huruf mengikuti ketukan drum festival.
- **Kereta Kata** (Bab stasiun): sambung kata seperti shiritori (しりとり).
- **Masak Bersama Nenek**: ikuti resep berbahasa Jepang (urutan kata kerja).

### 4.5 Aktivitas santai (refreshing) — ✅
Tidak semua waktu harus belajar keras. Aktivitas santai membuat dunia terasa seperti rumah kedua:
- 🎣 **Memancing** di sungai & kolam: saat ikan menggigit, baca huruf yang muncul untuk menarik pancing. 12 tangkapan (termasuk sampah lucu seperti kaleng & sandal kayu) di **Buku Ikan**.
- 🐱 **Hewan peliharaan** (ねこ, いぬ, うさぎ, ひよこ) dibeli dengan poin, mengikuti pemain ke mana pun, bisa dielus (bonus harian).
- 🪑 **Duduk di bangku taman**: mendengar percakapan warga (latihan menyimak kalimat nyata).
- 📚 **Perpustakaan**: 6 buku cerita pendek yang terbuka otomatis sesuai huruf yang sudah dikuasai (graded reader), lengkap dengan suara, romaji, dan arti.
- 🔜 Berkebun (menanam sayur bernama Jepang), foto-foto di kota, dekorasi kamar.

### 4.6 Dunia yang hidup — 🔜
- Musim (sakura → musim panas & kembang api → momiji → salju) berganti tiap bab.
- ✅ Cuaca (cerah, berawan, hujan) + kejadian payung (あめ, かさ). 🔜 Salju & angin musiman.
- NPC berjalan dengan rutinitas harian, kucing Mochi berkeliaran.
- Event musiman: Tanabata (menulis permohonan dalam hiragana), Obon, Tahun Baru (omikuji spesial).

---

## 5. Online bersama (seperti Growtopia) — ✅ prototipe berjalan

**Tujuan:** pemain bisa melihat pemain lain di kota yang sama, menyapa, dan belajar bersama.

### 5.1 Fitur
- Melihat avatar pemain lain (dengan kustomisasi & nama) berjalan di kota 3D.
- **Obrolan stempel frasa**: pemain memilih frasa Jepang siap pakai (こんにちは, ありがとう, いっしょに べんきょう しよう！…) yang muncul sebagai balon kata. Aman untuk anak (tanpa teks bebas) **dan** melatih kalimat sehari-hari.
- Emote (♥, !, ?, 😊) & membungkuk (ojigi).
- 🔜 Karuta duel 1 lawan 1 dan papan peringkat mingguan.
- 🔜 Tukar/beri jajanan antar pemain, kunjungan kamar teman.
- 💡 Kelas bersama: guru sungguhan membuat "ruang kelas" dan memutar video pelajaran bersamaan.

### 5.2 Arsitektur
```
[HP pemain] ⇄ WebSocket ⇄ [server/ (Node.js)] ⇄ [HP pemain lain]
```
- Server ringan di folder `server/` (Node.js + `ws`), ruangan per peta, hanya meneruskan posisi, penampilan, & ID frasa.
- Bisa di-host gratis di Render / Railway / Fly.io. Alamat server diisi di Pengaturan → Online.
- Game tetap bisa dimainkan **offline** sepenuhnya; online bersifat opsional.

### 5.3 Keamanan
- Tidak ada teks bebas: hanya frasa dari daftar (ID angka), jadi tidak ada kata kasar/spam.
- Nama pemain dibatasi 12 huruf & disaring.
- Batas kirim pesan (rate limit) di server.

---

## 6. Tampilan & rasa (tidak kaku)

- ✅ Karakter bernapas, berkedip, bergoyang saat berjalan; cahaya pagi/sore/malam.
- 🔜 Animasi kecil: debu saat berjalan, hati muncul saat teman senang, konfeti saat naik level.
- 🔜 Transisi kamera saat masuk bangunan, "zoom" saat dialog penting.
- 🔜 Ekspresi baru (marah lucu, malu, menangis terharu) untuk momen cerita.
- 🔜 Getaran HP (haptic) ringan saat jawaban benar/salah.
- 🔜 Aksesibilitas: ukuran teks besar, mode kontras tinggi, mode buta warna.

---

## 7. Optimasi & teknis

| Area | Rencana |
|---|---|
| Performa 3D | ✅ instancing pohon, ✅ render dijeda saat panel terbuka, 🔜 texture atlas, 🔜 LOD bayangan otomatis sesuai FPS |
| Ukuran unduhan | ✅ tanpa file gambar/audio besar, 🔜 kompres three.js (tree-shaking) |
| Baterai | ✅ kualitas Hemat 30 FPS, 🔜 deteksi baterai lemah otomatis |
| Simpan data | ✅ localStorage, 🔜 ekspor/impor kode simpanan, 🔜 simpan awan (opsional) |
| Pengujian | ✅ uji otomatis Playwright (main 1 hari penuh), ✅ build + typecheck di GitHub Actions |
| Kode | ✅ Vite + TypeScript + React (bertahap), 🔜 data cerita bertipe, 🔜 editor konten sederhana untuk guru |

---

## 8. Tahapan (fase)

### Fase 1 — pembaruan ini ✅
1. ✅ ROADMAP ini.
2. ✅ **Pencapaian** + halaman lencana + spanduk pop-up.
3. ✅ **Streak harian & bonus login.**
4. ✅ **Ulasan Harian (SRS)** + lencana 📝 di HUD.
5. ✅ **Jidouhanbaiki, yatai & konbini**, tas (inventaris), makan (いただきます/ごちそうさま), hadiah ke teman (jajanan favorit = ♥♥♥), buku jajanan.
6. ✅ **Aktivitas santai**: memancing + buku ikan, hewan peliharaan, bangku taman, buku cerita perpustakaan.
7. ✅ **Online (prototipe)**: server WebSocket (`server/`) + avatar pemain lain + papan nama + stempel frasa + reconnect otomatis.

### Fase 1.5 — React + TypeScript ✅ (tahap 1 dari migrasi)
1. ✅ Proyek **Vite + React + TypeScript**; build & terbit otomatis ke GitHub Pages (Actions).
2. ✅ Dunia 3D dipindah ke TypeScript (`src/world/world3d.ts`); karakter tetap **pixel art 2D yang lucu**.
3. ✅ Halaman **Teman** pertama dengan React (potret, sprite berjalan, keakraban, perkenalan diri berbahasa Jepang).

**Tahap migrasi berikutnya** (satu per satu, game tetap bisa dimainkan setiap tahap):
- 🔜 Pindahkan data pelajaran & cerita ke modul TypeScript bertipe (`src/data/*.ts`).
- 🔜 Ubah panel (menu, tas, pencapaian, rapor, pengaturan) menjadi komponen React.
- 🔜 Ubah pelajaran, kuis, video, dan mini-game menjadi komponen React.
- 🔜 Karakter pixel: animasi melambai/membungkuk (ojigi) saat menyapa, lebih banyak ekspresi potret.
- 🔜 Grafik: tone mapping sinematik untuk dunia, ambient occlusion ringan, air memantul, dedaunan bergoyang (dengan saklar kualitas untuk HP).
- 🔜 Suara: rekaman suara asli (atau file suara AI berkualitas) untuk kalimat pelajaran utama.

### Fase 1.6 — Kota lebih luas & tempat yang bisa dimasuki ✅
1. ✅ Kota diperluas ke timur: jalan belanja, taman + air mancur, sungai lebih panjang.
2. ✅ Bisa masuk: konbini, stasiun, kafe, kedai ramen, toko buku, pos polisi.
3. ✅ Kereta ke peta baru **pantai (うみ)**: kerang berhuruf, memancing di laut, es serut.
4. ✅ Adegan belajar di tiap tempat (belanja, tiket, gerbang, memesan, arah) + stempel & poin harian.
5. 🔜 Berikutnya: kota kedua lewat kereta (やま/gunung), rumah teman, festival di taman, interior sekolah lebih banyak (UKS, kantin, gym).

### Fase 1.7 — Jalur kereta & Jepang yang lebih luas ✅
1. ✅ 3 peta tujuan baru: やま (desa gunung + onsen), まち (kota besar), てら (kota kuil) + interior onsen & sushi.
2. ✅ Mesin tiket banyak tujuan (baca nama stasiun & harga), pengumuman kereta.
3. ✅ Sistem menu restoran + angka/harga Jepang + **Buku Makanan** (20 hidangan).
4. ✅ Mini-game aktif: sushi putar, lampu penyeberangan, lonceng kuil, upacara teh, karaoke lirik, プリクラ.
5. ✅ Adegan budaya: aturan onsen, kuil Buddha vs Shinto, lantai department store, warna & ukuran baju, jimat, rusa おじぎ.
6. 🔜 Berikutnya: festival musim panas (まつり) di taman, salju & musim dingin di やま, kota pelabuhan (みなと), rumah teman, menginap semalam di onsen.

### Fase 2.5 — 「さくら の てがみ」 fondasi cerita ✅
1. ✅ Mesin cerita (flag, adegan per slot, NPC cerita) + save v3 dengan migrasi otomatis.
2. ✅ Prolog + 22 adegan Bab 1–2, loteng, Kotak Surat, Peta Harta 1976, buku bergambar, benda kenangan.
3. ✅ Suara tahap 1: naskah tetap sensei (586 klip) dipakai video; rekaman di `public/audio/sensei/` otomatis dipakai.
4. ✅ v3.0: Bab 3 「てんてん と すうじ」 — tenten, 14 kanji angka, Kasir Kafe, pantai, Pasar Pagi, Jurnal Misteri, Meter Kota.
5. 🔜 Berikutnya (v3.5): Bab 4 「なつやすみ」 — yōon, っ, bunyi panjang, menginap di onsen やま, kilas balik, Natsu Matsuri. Lihat `design/04-BAB4-MUSIM-PANAS.md`.

### Fase 2 🔜
Bab 3 (dakuten, angka, konbini penuh), latihan bicara, memancing kana, musim panas & kembang api, grafik kemajuan.

### Fase 3 🔜
Bab 4–6 (yōon, waktu, kanji N5, stasiun & kota baru), karuta duel online, papan peringkat, event musiman.

### Fase 4 💡
Mode kelas untuk guru, editor konten, simpan awan, aplikasi toko (Play Store via TWA).

---

## 9. Ukuran keberhasilan

- **Retensi**: pemain kembali di hari ke-2 (target ≥ 50%) dan hari ke-7 (≥ 25%).
- **Belajar**: ketepatan kuis naik dari hari ke hari; ≥ 80% pemain yang tamat Bab 1 bisa membaca semua hiragana.
- **Kesenangan**: rata-rata sesi 15–25 menit; mini-game favorit dicatat untuk dikembangkan.

---

## 10. Cara menambah konten

- Hari/pelajaran baru: `js/data.js` & `js/data2.js` (lihat format `DAYS`).
- Jajanan, pencapaian, frasa online: `js/extras.js`.
- Peta: `js/maps.js` (satu huruf = satu ubin).
- Karakter: palet & gaya di `js/pixel.js`, potret di `js/portrait.js`.
