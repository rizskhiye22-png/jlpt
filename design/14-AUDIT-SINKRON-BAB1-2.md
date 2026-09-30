# 14 · Audit & Sinkron Bab 1–2 (Hiragana & Katakana) — v3.6

> Bab 1–2 dibuat paling awal (v2.0), sebelum sistem Bab 3–4 (naskah suara sensei, SIMILAR/pengecoh, drill, Mata Jeli, aturan "huruf yang belum dipelajari").
> Dokumen ini mencatat **apa yang tidak sinkron**, **apa yang sudah diperbaiki di v3.6**, dan **sisa pekerjaan**.
> Alat audit: `node scripts/…` tidak diperlukan — semua angka di bawah dihitung dari data game (DAYS, WORDS, KANA, sensei-vo.json).

## A. Temuan

### A.1 Contoh kata di video sensei memakai huruf yang belum diajarkan ❌ → ✅
Audit per hari (sebelum v3.6):

| Hari | Masalah |
|---|---|
| 1 | え → contoh こえ (こ baru Hari 2) |
| 2 | く → くつ (つ baru Hari 4) |
| 3 | そ → そと (と baru Hari 4) |
| 4 | と → ひと (ひ baru Hari 7) |
| 6, 9 | の, れ, ろ → **tidak ada contoh** |
| 10 | を → 「パン を たべます」 (パ & べ baru Bab 3!) — dan kalimat ini sebenarnya tidak pernah tampil |
| 12–21 | **16 dari 46 katakana** memakai huruf yang belum diajarkan (ソ → メロンソーダ, ム → ゲーム (Bab 3), ル → ボール (Bab 3)…), **12 katakana tanpa contoh** |

Penyebab: generator naskah menambah huruf ke daftar "sudah dipelajari" satu per satu (huruf ke-1 belum "tahu" huruf ke-5 hari yang sama), fallback memilih kata apa saja, dan kosakata katakana (WORDS) tidak disusun per baris.

**Perbaikan v3.6**
- 8 kata hiragana baru (え, かく, きく, うそ, おと, きのこ, これ, いろ) & 23 kata katakana baru yang bisa dibaca **tepat pada hari barisnya diajarkan** (カカオ, キウイ, サーカス, シーソー, ソース, チーター, ツアー, テスト, トースト, ツナ, カヌー, ハート, コーヒー, ヘア, トマト, ミキサー, チーム, モーター, タイヤ, ユニホーム, エアコン, ワニ, オーケー).
- Urutan pilihan contoh: (1) terbaca & belum dipakai → (2) terbaca → (3) katakana **dengan bantuan hiragana kecil** di papan tulis (pemain sudah hafal semua hiragana) → (4) tanpa contoh. Hasil: **0 contoh hiragana** memakai huruf belum dipelajari; sisa 8 katakana (Hari 12–13 dsb.) memakai bantuan hiragana, mis. アイス + 「あいす」.
- を: contoh 「ほん を よむ」 (sama dengan penjelasan sensei di kelas Hari 10), sekarang benar-benar tampil di video.

### A.2 "Huruf rawan" hanya ada di video, tidak di latihan ❌ → ✅
- Daftar huruf mirip (SIMILAR) sebelumnya tersimpan di dalam video.js saja; kuis memilih pengecoh acak, jadi ね/れ/わ atau シ/ツ jarang diuji berdampingan.
- Ada pasangan yang **bunyinya sama** (ロ/ろ, ヘ/へ) sehingga sensei berkata "jangan tertukar… yang kiri ro, yang kanan ro".
- Suara sensei untuk ヘ (katakana) menyebut "partikel arah dibaca e" — partikel hanya ditulis へ hiragana.

**Perbaikan v3.6**
- `SIMILAR` pindah ke `data2.js` (dipakai bersama video, kuis, Mata Jeli, generator suara), berisi **kelompok** (ね→れわ, ソ→ンノ, ク→ケタ, コ→ロユ…), hanya pasangan yang bunyinya berbeda. ロ kini dilawankan dengan コ.
- Kuis: soal "pilih huruf" & "dengarkan" selalu memasukkan huruf kembar yang **sudah dipelajari** sebagai pengecoh.
- 🆕 **Mata Jeli 👀** (design/01 §6.2 "Huruf rawan"): menggantikan latihan soal di **Hari 10** (hiragana) dan **Hari 21** (katakana). 8 ronde: romaji ditampilkan, pemain memilih di antara huruf-huruf kembar. Huruf hari itu (わ を ん / ワ ヲ ン) selalu ikut.
- Tips 26 huruf ditulis ulang supaya menyebut **bedanya**: ぬ/め (simpul), ね/れ/わ (ekor), さ/ち (arah perut), い/り, た/な, ク/ケ/タ, コ/ロ/ユ, ナ/メ, チ/テ, ア/マ, ス/ヌ, ノ/ソ, ウ/ワ/フ.

### A.3 Katakana tidak dikaitkan dengan hiragana di latihan ❌ → ✅
Kartu kenalan menampilkan "Hiragananya: …", tapi kuis tidak pernah menanyakannya.
**Perbaikan:** tipe soal baru **"Mana pasangan hiragananya?"** (ツ → つ) muncul otomatis bila huruf fokus katakana dan pasangannya sudah dipelajari. Pengecohnya juga huruf kembar hiragana.

### A.4 Romaji selalu tampil, jadi pemain tidak pernah benar-benar membaca ❌ → ✅
Desain (01 §6.2 "Furigana bertahap", §6.3 no. 4) meminta bantuan berkurang sesuai kemampuan. Sebelumnya romaji hanya bisa "selalu" atau "mati".
**Perbaikan:** pengaturan **Romaji: Otomatis / Selalu / Mati** (bawaan: Otomatis). Mode Otomatis menyembunyikan romaji di dialog & pilihan jawaban bila **semua** huruf Jepang di kalimat itu sudah dipelajari (huruf ber-tenten, っ, yōon dan kanji dicek juga). Tombol **Aa** untuk mengintip. Save lama yang memakai "selalu" dipindah sekali ke Otomatis.
Contoh: Hari 10, 「ねこ、かわいい ね。」 → tanpa romaji; 「げんき？」 → romaji tampil (が/げ baru Bab 3).

### A.5 Cerita & NPC tidak sinkron dengan kanon ❌ → ✅
- Kakek Mori (ambien) berkata 「でんしゃは まだ こないよ」 + "Stasiun akan dibuka di bab berikutnya" — padahal pemain **tiba lewat stasiun di Prolog**, dan kanon Bab 1 membuat Mori **ketus** sampai Mochi dikembalikan.
  → Mori kini ketus (「…なんだ。」, 「さかな が にげる。しずか に。」), lalu melunak setelah misi Mochi selesai (「モチ が せわ に なった な。」 + petunjuk "dulu aku menggambar di tepi sungai ini").
- Pak Kasir: "Buka lagi di Bab 2" → "Buka lagi kalau kamu sudah mulai belajar katakana".
- Bab 4 Hari 39 (bunyi panjang) kini merujuk balik: "Garis ー sudah sering kamu lihat sejak Bab 2 (ケーキ, スキー)".

### A.6 Lain-lain yang diperbaiki
- Pilihan jawaban soal arti kata bisa berisi dua label sama (うえ/上 = "atas") → pengecoh sekarang unik per arti.
- Harness tes kini bisa menulis di kartu **Dikte** (huruf disembunyikan, hanya romaji).

## B. Sudah sesuai (tidak diubah)
- Semua 92 huruf punya data goresan KanjiVG; video & penilaian tulisan berjalan.
- Beat cerita Bab 1–2 (design/02 §C–D) sudah ada semua di `src/story/scenes.ts` (sensei–Sato, kunci, loteng, Surat #1–#3, Peta Harta, kamera, kafe, Ryo, pengakuan Nenek).
- Ulangan Hari 5/11/16/22 memakai kolam yang benar (hiragana/katakana saja), termasuk setelah huruf tenten/yōon ditambahkan di Bab 3–4.
- Dialog Bab 1–2 memang memakai huruf yang belum diajarkan (げんき, だいじょうぶ, いっしょに). Ini **disengaja**: percakapan dilatih lewat suara; dengan Romaji Otomatis, kalimat seperti itu tetap diberi romaji sampai hurufnya diajarkan.

## C. Sisa pekerjaan (belum dikerjakan)
| Item | Catatan |
|---|---|
| Tes penempatan | Lompat ke Bab 2/3 untuk yang sudah bisa kana (design/01 §6.2) |
| Papan kota bertahap | Bab 1 papan dengan romaji kecil → makin sedikit bantuan |
| Mini-latihan huruf rawan otomatis | Mata Jeli saat ini terjadwal (Hari 10 & 21); versi adaptif (muncul saat huruf sering salah) belum |
| Rekaman suara asli | Klip sensei yang teksnya berubah di v3.6 (contoh kata & huruf mirip) belum ada rekamannya — belum ada rekaman sama sekali |
| Kamera & foto cerita (Hari 16, 19) | Masih berupa item/flag, belum ada fitur memotret |
