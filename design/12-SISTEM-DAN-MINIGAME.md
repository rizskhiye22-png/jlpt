# 12 · Spesifikasi Sistem & Mini-Game

## A. Sistem cerita

### A.1 📮 Kotak Surat (LetterBox)
**Terbuka:** Bab 1 Hari 9 (`letterbox_unlocked`). **Menu:** 📮 di menu utama + meja di kamar.

| Elemen | Perilaku |
|---|---|
| Daftar surat | Kartu amplop bergaya lama; surat terkunci tampil siluet dengan petunjuk syarat ("Pelajari katakana", "Temukan di みなと"). |
| Mode baca | Kertas surat penuh layar, tulisan tangan (font kana bergaya tulisan tangan), baris muncul satu per satu. |
| Token kabur | Blur 4px + opacity 40%; ketuk → tooltip "Huruf ini dipelajari di Bab X, Hari Y". |
| Tombol | 🔊 dengar (rekaman), 🇮🇩 arti per kalimat, Aa romaji, ＋ tambah kata ke Ulasan, 📷 simpan ke Album |
| Progres | Ikon amplop: kosong → ½ (sebagian kabur) → penuh (semua jelas) → ✔ (sudah dibaca penuh, dapat lencana) |
| Membaca keras | (Surat #12, dan opsional semua surat) Pemain membaca per kalimat lewat mikrofon atau tombol ✓. |

### A.2 Format data surat
```ts
interface Letter {
  id: 'L01' | … | 'L14';
  from: 'dewi' | 'sato' | 'emma' | 'player';
  date: string;                       // '1976-04', tampil sebagai "April 1976"
  voice: 'dewi_young' | 'sato_young' | 'emma';
  unlock: Requirement[];              // mis. [{ flag: 'ch1_done' }]
  lines: Token[][];                   // per baris
  translation: string[];              // per baris
  clues?: ClueId[];                   // ditempel ke Jurnal Misteri saat dibaca penuh
  mapSpots?: SpotId[];                // tanda × peta harta yang ikut terbuka
}
type Token = { t: string; kana?: string; kanji?: boolean; known?: 'word' };
```

### A.3 Aturan "jelas vs kabur"
1. Token **jelas** jika setiap karakter kana sudah dipelajari **dan** setiap kanji sudah dipelajari.
2. Kanji yang belum dipelajari → tampil `kana` (furigana mode), tetap jelas jika kana-nya sudah dipelajari.
3. **Pengecualian kosakata utuh:** token bertanda `known: 'word'` dianggap jelas bila kata itu sudah pernah dipelajari **sebagai kosakata** (muncul di pelajaran/SRS), walaupun salah satu bunyinya (mis. っ, ゃ, ー) belum diajarkan formal. Contoh: わらって (Surat #3), ありがとう, ケーキ.
4. Tanda baca, spasi, angka Arab, dan huruf Latin (nama "Dewi") selalu jelas.
5. Validasi otomatis saat build: skrip memastikan setiap surat **terbaca penuh** pada hari `unlock`-nya, kecuali token yang sengaja dicatat di kolom "Kabur saat dibaca" (file 08).

### A.4 🔎 Jurnal Misteri
**Terbuka:** Bab 3 Hari 23. Papan gabus dengan foto/benda yang disematkan pin.

| Elemen | Perilaku |
|---|---|
| Petunjuk | Kartu (foto, surat, benda, kutipan NPC) otomatis ditempel saat flag terkait diset. |
| Benang merah | Pemain menarik benang antara dua kartu. Jika pasangan benar → animasi "klik", teks deduksi, +🌸. Jika salah → benang lepas lembut, tanpa hukuman. |
| Pertanyaan besar | 6 misteri inti (dokumen utama §2.3) tampil sebagai kartu "?" yang berubah jadi "!" saat terjawab. |
| Tujuan | Memberi pemain rasa menjadi detektif; opsional (cerita tetap maju tanpa menyambung benang). |

**Pasangan benang (contoh):**
| Kartu A | Kartu B | Deduksi |
|---|---|---|
| Foto sepia | Foto dinding kafe | "Trio yang sama pernah ke kafe Hanamizuki." |
| Surat #6 (Mori-kun) | Kakek Mori di kafe | "Orang ketiga adalah Kakek Mori." |
| Tanzaku 「ゆるして ください」 | Pertengkaran di onsen | "Kakek Mori menyimpan rasa bersalah." |
| Ema Mori | Cerita ayah Kenta | "Mori menyerah pada mimpi menjadi ilustrator." |
| Surat #10 (Mori akan mengirim) | Cap あてさき ふめい (#11) | "Surat kedua belah pihak tidak sampai." |

### A.5 🗺 Peta Harta 1976
- Item dari Mai (Bab 2 Hari 15). Tampil sebagai kertas tua dengan 9 tanda ×.
- Setiap tanda × memakai aturan A.3: terbaca bila materinya sudah dipelajari (lokasi di file 02 §A.6).
- Tanda × yang terbaca → ikon di peta dunia + tujuan di HUD. Halaman yang sudah ditemukan → × dicoret dengan pensil merah.

### A.6 🎞 Kilas Balik (Flashback)
| Kilas balik | Bab | Tokoh yang dimainkan | Isi |
|---|---|---|---|
| #1 「1976年 なつ」 | 4 Hari 41 | Dewi muda | Onsen, kunang-kunang, lahirnya ide buku |
| #2 「あらし」 | 6 Hari 67 | Mori muda | Badai, amplop luntur |
| (opsional) #3 「さよなら の あさ」 | Pasca-tamat | Sato muda | Demam di pagi keberangkatan Dewi (dibuka setelah tamat) |

- Visual: filter sepia + grain + vignette; musik versi kotak musik dari tema tokoh.
- Kontrol sama; tidak ada soal yang dinilai (fokus emosi), kecuali mini-game ringan.
- Dunia 1976: versi lama peta (toko alat tulis Mori masih buka, kafe dengan papan lama, tanpa konbini).

### A.7 🌙 Menginap (hari multi-peta)
- Dipakai Bab 4 (onsen, 3 hari) dan Bab 5 (karyawisata, 3 hari).
- Struktur hari tetap (pagi → kegiatan → sore → malam), tetapi lokasi "rumah" dipindah ke penginapan.
- Tas, SRS, dan kerja paruh waktu tetap jalan (kerja → diganti tugas lokal).

---

## B. Sistem dunia & kehidupan

### B.1 🧾 Kerja Paruh Waktu (アルバイト)
| Tempat | Terbuka | Mini-game | Hadiah | Belajar |
|---|---|---|---|---|
| Kafe Hanamizuki | Bab 3 Hari 24 | Kasir Kafe | 🌸 + Meter Kota | Menu katakana, harga, kembalian |
| Konbini | Bab 4 | Kasir Konbini (varian) | 🌸 | Angka, ungkapan kasir |
| Museum Pos みなと | Bab 6 Hari 63 | Sortir Surat | 🌸 + petunjuk | Kanji alamat |
| Pasar ikan みなと | Bab 6 | Lelang Ikan | 🌸 + ikan untuk Buku Ikan | Angka besar |
- 1× per hari, sore. Bayaran naik dengan level kerja (1–5).

### B.2 📈 Meter Kota
- 0–100, tampil sebagai ikon lentera di menu kota.
- Sumber: tugas persiapan event, kerja kafe, kejadian harian menolong warga, event besar.
- Ambang visual: lihat dokumen utama §7.2 (20/40/60/80/100).
- **Tidak bisa turun.** Menentukan kemeriahan Epilog (≥80 → seluruh kota hadir).

### B.3 📷 Kamera & Album Foto
- Kamera film dari loteng (Bab 2 Hari 16). Tombol 📷 di HUD saat berada di dunia.
- **Foto bebas:** simpan hingga 60 foto.
- **Foto cerita (40):** momen tertentu memunculkan ikon ✨ kamera; memotretnya mengisi daftar Album. Beberapa foto cerita wajib untuk lencana, tidak wajib untuk cerita.
- **Kanji di kota:** memotret papan dengan kanji yang sudah dipelajari → koleksi 100 kanji.
- Album dipakai sebagai latar kredit di Epilog.

### B.4 🌱 Kebun
- Terbuka Bab 4 Hari 41 (bibit dari Pak Petani). Petak 6 di taman Nenek Sato.
- Tanaman bernama Jepang (ditulis kana): だいこん, にんじん, トマト, きゅうり, なす, ひまわり, あさがお, いちご.
- Siklus 3–5 hari dalam game; disiram 1× sehari (baca papan nama bibit).
- Hasil: bahan Masak Bersama, hadiah teman, bahan lapak pasar.

### B.5 🏠 Kamar
- Kamar pemain (bekas kamar Dewi). Perabot dibeli dengan 🌸 atau hadiah Kizuna.
- Objek khusus cerita: meja surat, papan Jurnal Misteri, rak Buku Kita, foto sepia (bingkai), bingkai foto Epilog.
- 💡 Online: kunjungan kamar teman.

### B.6 📱 Pesan (gaya aplikasi chat)
- Terbuka Bab 5 Hari 47. Pesan singkat dari teman di malam hari (maks. 2/malam).
- Bahasa sesuai level (kana → sedikit kanji). Balasan: pilih 1 dari 3 frasa/stempel.
- Contoh:
  - **Kenta**: 「あした、はなし が ある。」 → balas: 「なに？」「わかった！」「(stempel 👍)」
  - **Hana**: 「あたらしい ケーキ、あした たべて くれる？」 → 「たべたい！」
  - **Emma**: 「いま、まち の えき です。まよいました…」 → memicu kejadian bantuan esok hari.

### B.7 🗓 Kalender & musim
| Bab | Musim | Palet | Partikel | Suara ambien |
|---|---|---|---|---|
| 0–2 | Musim semi | Pink, hijau muda | Kelopak sakura ✅ | Burung uguisu |
| 3 | Tsuyu | Biru-abu, hijau tua | Hujan ✅, siput | Hujan, kodok |
| 4 | Musim panas | Kuning terang, biru langit | Kunang-kunang (malam), uap panas | Jangkrik (みんみん) |
| 5 | Musim gugur | Oranye, merah | Daun momiji | Jangkrik malam (すずむし) |
| 6 | Musim dingin | Putih, biru tua | Salju, uap napas | Angin, lonceng |
| E | Musim semi | Pink cerah | Kelopak tebal | Burung + lagu kota |

---

## C. Mini-game baru

> Semua mini-game: tombol ✕ keluar, mode santai (tanpa waktu), bintang 1–3, maksimal 60–90 detik per ronde, suara benar/salah memakai klip sensei (`sen_ok_*`, `sen_ng_*`).

### C.1 Kasir Kafe (+ Hitung Kembalian)
- **Tujuan:** membaca pesanan katakana & menghitung harga.
- **Alur:** pelanggan datang → balon pesanan (teks + suara) → pemain mengetuk item di menu → layar total → (level 3+) pelanggan membayar, pemain memilih koin/uang kembalian.
- **Level:** 1 satu barang · 2 dua barang · 3 kembalian · 4 pesanan lisan saja (tanpa teks) · 5 Mode Pasar/Natal (antrean berwaktu).
- **Skor:** ketepatan + kecepatan; salah → pelanggan tersenyum dan mengulang pelan.
- **Data:** `{ item: 'ケーキ', price: 350, audio: 'ja_xxx' }`.

### C.2 Tangkap Tenten
- Varian Hujan Huruf: huruf tanpa dakuten jatuh; pemain menambahkan ゛/゜ dengan mengetuk ikon agar cocok dengan suara yang diputar.

### C.3 Tangkap Kunang-kunang
- Malam hari; kunang-kunang membawa bunyi yōon. Suara diputar → ketuk kunang-kunang yang benar. Pengecoh: pasangan rawan (きょ/きよ, びょう/びよう).

### C.4 Taiko Ritme
- Lagu festival 60–90 detik. Huruf/kata muncul di jalur; ketuk drum tepat saat mencapai garis **dan** pilih bacaan benar (2 tombol: ドン = pilihan kiri, カッ = pilihan kanan).
- Tingkat: かんたん (kana), ふつう (kata), むずかしい (yōon + っ).

### C.5 Tanzaku
- Susun permohonan dari kartu kata (subjek → objek → kata kerja/harapan) lalu "tulis" kata terakhir dengan kuas. Tanzaku tergantung di bambu kota (dan server online, lihat dokumen utama §12).

### C.6 Shiritori Kereta
- Selama perjalanan kereta. Kata terakhir NPC → pemain memilih kata yang dimulai dengan huruf terakhirnya dari 3 pilihan. Kata berakhiran ん = kalah lucu ("ん" membuat kereta berhenti mendadak).

### C.7 Jadwal Kereta
- Papan keberangkatan: 時/分, tujuan, peron. Instruksi lisan ("７時１５分 の てら行き に のって ください") → pilih kereta & peron. Level lanjut: pindah kereta dengan waktu terbatas.

### C.8 Panel Manga
- 4–6 panel acak → susun urutan cerita; lalu tempatkan balon dialog (kalimat 〜ます/〜ました) ke tokoh yang tepat. Juri (NPC) menilai.

### C.9 Masak Bersama
- Kartu resep berbahasa Jepang: urutkan langkah (まぜます, きります, やきます, 〜分 まちます). Aksi sederhana (ketuk/geser) per langkah. Mode lomba: waktu + penilaian juri.
- Resep: おはぎ (Bab 3), たまごサンド (Bab 5), としこしそば (Bab 6), ともだち セット (Kizuna Hana).

### C.10 Menulis Surat
- **Epilog (Surat #13)** dan pasca-tamat (balasan untuk Emma/Eyang).
- **Alur:** pilih kerangka (salam → kabar → cerita → perasaan → harapan → penutup). Setiap slot menawarkan 3–5 kalimat **yang pernah dipakai pemain** (diambil dari riwayat dialog & frasa Buku Catatan). Pemain bisa mengganti kata di dalam kalimat (mis. nama tempat, makanan).
- **Menulis kuas:** 3 kata ditulis tangan (penilaian goresan seperti latihan menulis ✅).
- **Hasil:** surat tampil di kertas bergaya; tersimpan di Kotak Surat; bisa diekspor sebagai gambar.

### C.11 Pidato (latihan bicara)
- **Dengan mikrofon:** Web Speech Recognition (`ja-JP`). Kalimat ditampilkan → pemain membaca → kecocokan kata (toleran; tanpa nilai buruk). Indikator: gelombang suara + kata yang dikenali menyala.
- **Tanpa mikrofon / tidak didukung:** mode "Ikuti irama" — rekaman manusia diputar per frasa, pemain menekan ✓ setelah menirukan; pemilihan jeda & intonasi (naik/turun) sebagai soal.
- **Privasi:** audio tidak disimpan dan tidak dikirim ke server game.

### C.12 Susun Kalimat & Buku Harian
- Kartu kata + partikel → susun kalimat. Buku Harian (Bab 5 Hari 56): menulis 3 kalimat lampau tentang karyawisata; hasilnya tampil di buku harian malam.

### C.13 Karuta Kanji
- Karuta ✅ dengan kartu kanji; pembaca menyebut kata (mis. 「やま」) → ambil kartu 山. Mode duel online (dokumen utama §12).

### C.14 Lelang Ikan
- Pelelang menyebut harga cepat (angka besar, suara) → pemain menaikkan tawaran dengan membaca angka di papan. Target: beli ikan pesanan Paman Ramen dengan anggaran tertentu.

### C.15 Sortir Surat
- Amplop dengan alamat (kanji arah & kota: 東, 西, 駅, 道 …) → geser ke laci yang benar. Amplop "あてさき ふめい" berkedip → memicu cerita (Hari 63).

### C.16 Susun Alamat
- Amplop luntur (Surat #12). Referensi: alamat di Surat #10. Pemain menyusun kartu: nama penerima (デウィ さま), jalan, kota (バンドン), negara (インドネシア), kode pos; urutan alamat gaya internasional. Salah urut → Nenek Sato memberi petunjuk.

### C.17 Mini-game kecil (satu layar)
| Nama | Tempat | Isi |
|---|---|---|
| Ketuk Papan | Loteng (Bab 2) | Ketuk papan lantai, dengarkan bunyi kosong |
| Angkat Tatami | Onsen (Bab 4) | Tahan tombol, cari tanda × |
| Cari Barang | Bab 4 Hari 43 | "ねこ は つくえ の した に います" → ketuk lokasi |
| Semangka Pecah | Pantai musim panas | Mata tertutup; teman berteriak みぎ/ひだり/まっすぐ |
| Pohon Keluarga | Bab 6 Hari 62 | Tempel kanji keluarga ke silsilah |
| Kalender Kizuna | Bab 5 Hari 50 | Atur jadwal minggu dengan 〜ようび |
| Jam Dinding | Bab 5 Hari 47 | Putar jarum sesuai 〜じ〜ふん |

---

## D. Daftar flag cerita (utama)

| Flag | Diset di | Dipakai untuk |
|---|---|---|
| `prolog_met_sato`, `prolog_done`, `attic_seen` | Prolog | Mulai Bab 1 |
| `sensei_knows_sato` | B1 H1 | Dialog sensei |
| `sato_hint_1`, `mori_met` | B1 H2, H4 | Jurnal |
| `key_found`, `attic_promise` | B1 H6–7 | Membuka loteng |
| `dewi_petal_sent` | B1 H8 | Dialog Nenek |
| `attic_opened`, `letterbox_unlocked` | B1 H9 | Kotak Surat |
| `letter1_read`, `ch1_done` | B1 H11 | Bab 2 |
| `asked_dewi_1` | B2 H14 | Variasi telepon |
| `treasure_map` | B2 H15 | Peta harta |
| `page2`, `camera_unlocked` | B2 H16 | Album |
| `kenta_sees_book`, `cafe_arc_seed`, `cafe_photo_seen`, `song_v1` | B2 H17–20 | Benang B/C |
| `sato_knows`, `letter3_read`, `ch2_done` | B2 H21–22 | Bab 3 |
| `ch3_start`, `baito_cafe`, `map_spot4_read`, `page4`, `letter5_read`, `page3`, `emma_arc_2`, `market_plan`, `letter6_read`, `ch3_done` | Bab 3 | — |
| `ch4_start`, `onsen_invite`, `chan_revealed`, `kenta_father`, `map_spot6_read`, `letter7_read`, `stay_yama_1`, `tree_advice`, `flashback1`, `page6`, `sato_mori_argue`, `tree_care_1`, `mori_tanzaku`, `letter8_read`, `third_is_mori`, `ch4_done` | Bab 4 | — |
| `ch5_start`, `kenta_contest`, `yuki_speech`, `kenta_signed`, `letter9_read`, `page7`, `ema_found`, `page8`, `kenta_contest_done`, `mori_full_name`, `trip_done`, `tree_care_2`, `carving_read`, `yuki_speech_won`, `letter10_read`, `ch5_done` | Bab 5 | — |
| `ch6_start`, `map_spot9_read`, `minato_open`, `museum_met`, `emma_leaving`, `takeshi_hint`, `museum_bundle_seen`, `letter11_found`, `sato_has_11`, `snow_plan`, `page9`, `mori_confessed`, `letter12_obtained`, `reconciled`, `address_fixed`, `tree_care_3`, `kenta_mori_mentor`, `letter12_read`, `dewi_call`, `ch6_done` | Bab 6 | — |
| `epilogue_done`, `game_cleared` | Epilog | Pasca-tamat |

Nama flag memakai `snake_case`, disimpan di `save.story.flags` sebagai `Record<string, boolean | number>`.

---

## E. Data & save

### E.1 Struktur save v3 (ringkas)
```ts
interface SaveV3 {
  version: 3;
  player: { name: string; look: Look; };
  day: number;                     // 0 = prolog, 1–72, >72 = bebas
  story: { flags: Record<string, boolean | number>; letters: Record<LetterId, 'locked'|'partial'|'full'|'read'>; pages: PageId[]; clues: ClueId[]; threads: [ClueId, ClueId][]; };
  learn: { kana: string[]; kanji: string[]; words: string[]; grammar: string[]; srs: SrsCard[]; };
  kizuna: Record<CharId, number>;
  town: { meter: number; };
  life: { bag: Record<ItemId, number>; garden: Plot[]; room: Furniture[]; photos: Photo[]; baito: Record<JobId, number>; };
  collections: { fish: string[]; food: string[]; snacks: string[]; kanjiPhotos: string[]; omamori: string[]; };
  settings: Settings;              // + voiceMode: 'human'|'device', downloadAllVoice: boolean
  stats: { streak: number; minutes: number; };
}
```

### E.2 Migrasi v2 → v3
| Data v2 | Menjadi v3 |
|---|---|
| Hari 1–22 selesai | `day` sama; flag bab otomatis diset sesuai hari (tabel D) |
| Misi Mochi selesai | `key_found = true` (+ kunci di tas) |
| Misi surat selesai | `dewi_petal_sent = true` |
| ♥ teman | Disalin; batas lama tetap |
| Pemain lama yang sudah melewati Hari 9/11/22 | Adegan cerita yang terlewat diputar sebagai **"Kenangan"** ringkas saat pertama membuka v3 (±3 menit, bisa dilewati) |
