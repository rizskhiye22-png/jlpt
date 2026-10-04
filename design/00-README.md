# 🌸 Nihongo Gakkou v3 — Paket Dokumen Desain 「さくら の てがみ」

Paket ini berisi desain lengkap pembaruan besar **Nihongo Gakkou**: dari game belajar hiragana/katakana (v2) menjadi perjalanan satu tahun sampai **JLPT N5**, dengan satu cerita besar yang saling berkaitan.

## Cerita dalam 5 kalimat
1. Kamu, murid pindahan dari Indonesia, tinggal bersama **Nenek Sato** di Sakura-machi — di kamar yang 50 tahun lalu dipakai **Eyang Dewi**, nenekmu sendiri.
2. Kucing **Mochi** menggali kunci loteng; di sana ada surat-surat Dewi untuk Sato yang hanya bisa kamu baca **seiring kemampuan bahasamu tumbuh**.
3. **Peta Harta 1976** dari Mai menuntunmu ke halaman-halaman buku bergambar 『さくら と ともだち』 yang disembunyikan trio **Sato, Dewi, dan Mori** di pantai, gunung, kuil, kota besar, dan pelabuhan.
4. Di pelabuhan みなと kamu menemukan kebenaran: dua surat yang tidak pernah sampai, dan **Kakek Mori** yang menyimpan rasa bersalah selama 50 tahun.
5. Di Tahun Baru kamu membacakan surat terakhir dalam bahasa Jepang, tiga sahabat berbicara lagi, dan di musim semi Eyang Dewi datang ke bawah pohon sakura yang akhirnya mekar.

## Isi paket
| File | Isi | Untuk siapa |
|---|---|---|
| `01-GAME_DESIGN.md` | Visi, pilar, ringkasan semua sistem, **suara manusia (§14)**, arsitektur, roadmap, keputusan desain | Semua |
| `02-KANON-PROLOG-BAB1-2.md` | **Kanon cerita** (linimasa 1976–77, fakta tokoh, benda kunci, Peta Harta), naskah Prolog, sisipan cerita Bab 1–2 | Penulis, desainer |
| `03-BAB3-SUARA-BARU-DAN-ANGKA.md` | Bab 3 hari per hari (Hari 23–34) | Penulis, programmer konten |
| `04-BAB4-MUSIM-PANAS.md` | Bab 4 hari per hari (Hari 35–46) | 〃 |
| `05-BAB5-KARYAWISATA-MUSIM-GUGUR.md` | Bab 5 hari per hari (Hari 47–58) | 〃 |
| `06-BAB6-PELABUHAN-MUSIM-DINGIN.md` | Bab 6 hari per hari (Hari 59–70), klimaks | 〃 |
| `07-EPILOG-DAN-PASCA-TAMAT.md` | Epilog (Hari 71–72), kredit, mode bebas, Tahun Kedua | 〃 |
| `08-SURAT-DAN-BUKU-BERGAMBAR.md` | Isi lengkap 14 surat + 11 halaman buku bergambar, aturan kata kabur | Penulis, pengisi suara |
| `09-KIZUNA-DAN-ENDING.md` | Aturan keakraban, 25 event teman, 7 ending | Penulis |
| `10-KURIKULUM-N5.md` | Kana, angka, **100 kanji**, 32 pola tata bahasa, kosakata per bab, ujian N5 tiruan, SRS | Desainer belajar |
| `11-NASKAH-SUARA-SENSEI.md` | **910 klip** naskah sensei siap rekam (Bab 1–2 lengkap, dibuat dari data game) + templat Bab 3–6 | Pengisi suara, audio |
| `12-SISTEM-DAN-MINIGAME.md` | Spesifikasi Kotak Surat, Jurnal Misteri, Peta Harta, kerja paruh waktu, Meter Kota, kamera, kebun, pesan; 16 mini-game + 7 mini-game kecil; daftar flag; save v3 | Programmer |
| `13-KEJADIAN-MISI-NPC.md` | Kejadian harian (lama & baru), misi sampingan, rutinitas NPC, dialog ambien | Penulis, programmer |
| `14-AUDIT-SINKRON-BAB1-2.md` | Audit Bab 1–2 (hiragana & katakana) terhadap sistem Bab 3–4: temuan, perbaikan v3.6, sisa pekerjaan | Semua |
| `16-KARIER-15-HARI.md` | Karier 15 hari di 6 bidang (cerita harian, slip gaji, sertifikat, pertanian & peternakan, aksi nyata) | Desainer, penulis, pengembang |
| `15-SIMULASI-KERJA-NYATA.md` | Rancangan simulasi kerja nyata: tugas fisik per tempat kerja, sistem shift/karier, 報連相, evaluasi, perbaikan tampilan, tahapan | Desainer, pengembang |
| `NIHONGO_GAKKOU_v3_FULL.md` | Semua file di atas digabung jadi satu | Membaca sekaligus |

## Angka penting
| Hal | Jumlah |
|---|---|
| Hari cerita | Prolog + 72 hari + mode bebas |
| Bab | 6 + Prolog + Epilog |
| Surat | 12 cerita + 2 bonus |
| Halaman buku bergambar | 10 + 1 (Kenta) + sampul |
| Kanji | 100 |
| Event Kizuna | 25 (5 teman × 5 tingkat) |
| Ending | 7 |
| Mini-game baru | 16 + 7 mini-game kecil (+ 16 yang sudah ada) |
| Klip suara sensei siap rekam | 910 (Bab 1–4, dipakai video di game; `npm run voice:sensei`) |

## Cara memakai dokumen
1. Mulai dari **01** untuk gambaran besar, lalu **02** untuk kanon.
2. Saat menulis/mengubah konten bab, cek **aturan keterkaitan** (01 §17.2) dan **aturan huruf kabur** (12 §A.3).
3. Setiap dialog baru → tambahkan ke naskah suara (01 §14.5) agar bisa direkam.
4. Urutan pengerjaan kode: lihat **Checklist v2.5** (01 §16.1) dan **Checklist suara** (01 §14.11).

## Konvensi
- ✅ sudah ada di kode · 🔁 sudah ada tapi diubah · 🆕 baru · 💡 ide jangka panjang
- 🎬 arahan adegan · 🚩 flag cerita · 🎁 hadiah · ❓ pilihan pemain (✅ benar / ❌ salah + penjelasan)
- Nama tempat & alamat di cerita **fiktif**.
