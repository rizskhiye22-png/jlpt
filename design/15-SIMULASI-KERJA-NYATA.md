# 15 · Simulasi Kerja Nyata: dari "gambaran umum" ke "rasanya benar-benar kerja"

> Status sekarang (v3.7): 4 tempat kerja (pabrik makanan, panti wreda, genba, izakaya) di kawasan **しごとまち**.
> Ruangan bergambar, atasan berjalan ke pos dan memberi instruksi, pemain mengetuk pos lalu mengerjakan tugas.
> **Masalah:** tugasnya masih berupa **kuis pilihan ganda**. Pemain *membaca dan memilih*, belum *melakukan* pekerjaan.
> Dokumen ini menjelaskan cara mengubahnya menjadi simulasi kerja yang terasa nyata.

---

## 1. Prinsip: "lakukan, jangan pilih"

| Sekarang (gambaran umum) | Target (simulasi nyata) |
|---|---|
| "Urutkan langkah cuci tangan" (ketuk 6 kartu) | **Gosok tangan sungguhan**: usap bagian telapak, sela jari, kuku, pergelangan selama 30 detik. Bagian yang terlewat tetap "kotor" (berwarna). |
| "Cara pakai rol perekat?" (3 pilihan) | **Gulirkan rol** di siluet badan. Rambut/debu hilang di bagian yang tersapu. Skor = persentase yang bersih. |
| Cek onigiri satu per satu di kartu | Onigiri **benar-benar lewat di conveyor**. Ketuk yang cacat **sebelum keluar layar**. Kecepatan naik di jam sibuk. |
| "Suhu 68℃, apa yang kamu lakukan?" | **Tusukkan termometer** ke bagian paling tebal, baca angkanya, **tulis di lembar catatan suhu** (記録表), dan putuskan sendiri: loloskan atau panaskan ulang. |
| Atasan memberi instruksi lewat teks | Instruksi **diucapkan** (audio dulu, teks menyusul atau disembunyikan di level tinggi), dengan kecepatan dan gaya bicara asli. |
| Salah = penjelasan | Salah = **akibat nyata dalam game** (produk ditarik, lansia tersedak, kerja dihentikan, tamu marah), lalu atasan menjelaskan. |

Aturan desain:
1. **Setiap tugas punya kata kerja fisik**: usap, seret, tahan, tuang, tusuk, tulis, tunjuk, angkat.
2. **Bahasa Jepang dipakai untuk bekerja**, bukan dihafal: instruksi didengar, laporan disusun, tamu dilayani.
3. **Waktu berjalan**: ada jam kerja, antrean, dan gangguan. Pekerjaan nyata jarang datang satu per satu.
4. **Tidak ada game over**: kesalahan menimbulkan kejadian, tapi shift tetap bisa diselesaikan dan diulang.

---

## 2. Rancangan per tempat kerja

### 2.1 🍙 Pabrik makanan (食品製造)

| Pos | Interaksi nyata | Bahasa Jepang yang dipakai |
|---|---|---|
| ロッカー | **Ganti seragam**: seret topi, masker, sarung tangan, dan sepatu bot ke karakter. Cincin/jam harus **dilepas** ke loker. Karakter **benar-benar berganti seragam putih** setelahnya. | ぼうし を かぶって / ゆびわ を はずして |
| てあらいば | Gosok tangan 30 detik (lihat §1), air keran menyala/mati, lalu semprot alkohol. | せっけん で 30びょう |
| エアシャワー | Gulirkan rol perekat ke seluruh badan, lalu berdiri diam di air shower selama 15 detik. | ローラー を かけて |
| ちょうれい | **Apel pagi**: dengar target produksi, ulangi slogan bersama (tombol tahan bicara), dan laporkan kondisi badan dengan menyusun kalimat. | きょう の もくひょう は… / たいちょう は だいじょうぶ です |
| ライン | **Conveyor real-time**: (a) taruh isian onigiri sesuai **kartu spesifikasi** (しようしょ), (b) singkirkan produk NG, (c) tempel label tanggal yang benar. Mesin bisa **berhenti tiba-tiba**: tekan tombol darurat dan lapor. | NG です / ラベル が ない / きかい が とまりました |
| フライヤー | Tusuk termometer, catat di 記録表, putuskan loloskan atau panaskan ulang. | ちゅうしん おんど 75ど 1ぷん |
| そうじ | **5S sungguhan**: buang barang tak perlu (せいり), kembalikan alat ke bayangannya di papan (せいとん), lap meja (せいそう). | ここ に もどして |
| でぐち | **Kartu absen (タイムカード)**: tap keluar, lalu ucapkan salam pulang ke tiap orang yang masih bekerja. | おさきに しつれいします |

**Kejadian acak (pilih 1–2 per shift):** rambut ditemukan di produk → seluruh batch dicek ulang · mesin macet · teman kerja sakit perut (harus lapor, bukan ditutupi) · pesanan mendadak bertambah 500 pcs.

### 2.2 🧓 Panti wreda / Kaigo (介護)

Inti kaigo adalah **hubungan dengan lansia**. Tambahkan **meter Rasa Aman (あんしん)** untuk tiap penghuni.

| Pos | Interaksi nyata | Bahasa Jepang |
|---|---|---|
| ステーション | **Serah terima** (申し送り): dengarkan laporan shift malam (audio). Beberapa info **harus diingat** untuk dipakai nanti, misalnya "Kimura-san kurang tidur" dan "Tanaka-san tidak boleh makan makanan keras". | ゆうべ あまり ねむれません でした |
| きょしつ | **Urutan 声かけ**: sapa dengan nama → jelaskan → minta izin → baru bertindak. Kalau langsung menyentuh tanpa bicara, meter あんしん turun dan nenek kaget. | いまから カーテン を あけます ね |
| しょくどう | **Mini-game ritme menyuapi**: tunggu tanda menelan (leher bergerak) sebelum suapan berikutnya. Terlalu cepat → **むせ (tersedak/batuk)** dan harus ditangani. Catat persentase makan (8わり, 5わり). | ごっくん できました か？ |
| くるまいす | **Pindah ke kursi roda** sebagai urutan aksi fisik: kunci rem (ketuk tuas), posisikan kursi miring, bantu berdiri (tahan tombol sesuai napas), lalu putar dan dudukkan. Lupa rem = kursi bergeser (kejadian berbahaya). | ブレーキ OK です |
| よくしつ | **Putar dial suhu air** ke 38–41℃, cek dengan tangan sendiri, lalu tanya "おゆ の かげん は？" | ちょうど いい ですか？ |
| ろうか | **Nada panggil (ナースコール)** berbunyi acak dari kamar-kamar. Pemain harus memilih prioritas: lansia jatuh > minta ke toilet > minta minum. | すぐ いきます！ |
| きろく | **Menulis catatan** (記録) dari kejadian yang *benar-benar terjadi* di shift itu: jam, persentase makan, suhu badan, kejadian. Kalau isinya tidak cocok, atasan menegur. | 12じ、しょくじ 8わり |

**Kejadian acak:** nenek menolak makan (bujuk dengan percakapan) · keluarga datang berkunjung dan bertanya kondisi (keigo) · penghuni dengan demensia mencari "rumahnya" (tenangkan, jangan membantah).

### 2.3 🏗 Genba konstruksi (建設)

| Pos | Interaksi nyata | Bahasa Jepang |
|---|---|---|
| ひろば | **Senam radio** (ラジオ体操): ikuti gerakan dengan menekan arah sesuai ketukan. Lalu apel pagi dengan teriakan bersama ご安全に！ | ごあんぜん に！ |
| ほごぐ | **Pakaikan APD** ke karakter: helm, **ikat tali dagu** (tarik sampai klik), harness, sepatu safety. Karakter tampil memakai helm & rompi. | あごひも よし！ |
| KYボード | **KY dengan gambar**: gambar lokasi kerja hari ini, ketuk bahaya tersembunyi (seperti mencari gambar), lalu pilih tindakan pencegahan dan **teriakkan target tim**. | 〇〇 よし！ |
| あしば | **Patroli**: berjalan di area, temukan pelanggaran (lubang terbuka, kabel melintang, pekerja tanpa harness di atas 2 m) **sebelum terjadi kecelakaan**. Waktu terbatas. | あぶない！ |
| きゃたつ | **指差呼称 sungguhan**: tunjuk (ketuk) titik yang diperiksa → tahan tombol untuk berseru → baru boleh naik. | あしもと よし！ |
| しざい | **Bawa material dengan ねこ** (gerobak) melewati jalur sempit. Hindari genangan dan orang, jangan kelebihan muatan. | ねこ もって きて |
| きゅうけいじょ | **Meter panas (WBGT)** naik sepanjang hari. Pemain harus minum dan istirahat tepat waktu. Teman yang pusing harus ditolong (tempat teduh, dinginkan leher, lapor). | みず のんで |
| ゲート | Beres-beres, tap keluar, salam ke mandor. | おつかれさま でした |

**Bahasa lapangan:** di level lanjut, mandor memakai bahasa lapangan & dialek (ばらす, ねこ, かたす, 〜しといて). Pemain bisa menekan **「もう いちど おねがいします」** tanpa dihukum. Yang dihukum justru pura-pura paham.

### 2.4 🍶 Izakaya / Restoran (外食)

Ubah menjadi **game layanan real-time** (seperti game masak/restoran):

| Sistem | Cara kerja |
|---|---|
| Meja & kesabaran | 4–6 meja. Tamu datang bergelombang, tiap meja punya **meter kesabaran**. |
| Menyambut | Ucapkan いらっしゃいませ, tanya jumlah orang, antar ke meja yang cukup (〜名様). |
| ハンディ (alat pesan) | Tamu bicara (audio + balon kata): 「とりあえず 生 ふたつ と えだまめ」 → pemain **memasukkan pesanan** ke layar ハンディ. Salah input = makanan salah keluar. |
| Dapur memanggil | 「3番 テーブル、あがり！」 → ambil nampan di dapur, antar ke meja yang benar. |
| Alergi | Tamu menyebut alergi → pemain membuka **tabel alergen menu** dan mengecek sendiri. Kalau ragu, tanya tenchō. |
| Bersih meja | Angkat piring kosong, lap meja, siapkan untuk tamu berikutnya. |
| Kasir (レジ) | Hitung total, terima uang, **ambil kembalian dari laci kasir** (koin & uang kertas yen sungguhan), lalu ucapkan salam. |
| Jam sibuk | 19:00–21:00 tamu dua kali lebih banyak. Pemain belajar memprioritaskan tugas. |

---

## 3. Sistem bersama (membuat semuanya terasa nyata)

### 3.1 Hari kerja dan karier
- **Shift berlapis**: hari 1 (見習い/magang, dibantu terjemahan & furigana) → hari 3 (bekerja sendiri, terjemahan disembunyikan) → hari 5 (一人前, instruksi audio saja) → **リーダー** (mengajari pekerja baru, NPC yang membuat kesalahan).
- **Tugas baru terbuka** sesuai hari: hari 1 lini sederhana, hari 3 suhu & label, hari 5 menangani mesin macet.
- **Shift berbeda**: pagi, siang, malam (やきん di kaigo), dengan kejadian berbeda.

### 3.2 Dokumen kerja asli
| Dokumen | Dipakai di |
|---|---|
| タイムカード (kartu absen) | Semua: tap masuk/keluar, terlambat tercatat. |
| シフト表 (jadwal shift) | Menu kerja: pilih hari & jam. |
| 作業手順書 (prosedur kerja) | Bisa dibuka saat bekerja, seperti di tempat kerja asli. |
| 記録表 / 申し送りノート | Pabrik (suhu), kaigo (catatan). |
| KYシート | Genba. |
| 日報 (laporan harian) | Akhir shift: susun 2–3 kalimat laporan. |
| **給与明細 (slip gaji)** | Akhir minggu: gaji pokok, lembur, dipotong pajak, asuransi, dan sewa asrama (angka contoh, diberi keterangan). Sangat berguna untuk calon pekerja. |

### 3.3 報連相 sebagai mekanik utama
- Tombol **📣 Lapor** selalu ada di layar kerja.
- Laporan disusun dengan **chip kalimat**: いつ (kapan) + どこで (di mana) + なにが (apa) + どう した (bagaimana) + です/ました.
- Atasan membalas sesuai isi laporan. Laporan cepat dan jelas menambah nilai **報連相**. Menunda atau tidak melapor menimbulkan masalah di jam berikutnya.
- **ヒヤリハット** (nyaris celaka): kejadian yang hampir berbahaya harus dilaporkan walaupun tidak ada yang terluka.

### 3.4 Penilaian seperti di tempat kerja
Ganti nilai S/A/B/C tunggal dengan **評価シート (lembar evaluasi)** berisi 6 kategori, masing-masing ★1–5:

| Kategori | Diukur dari |
|---|---|
| 安全 Keselamatan | APD, 指差呼称, kejadian berbahaya |
| 衛生 Kebersihan | cuci tangan, rol, NG yang lolos |
| 報連相 Komunikasi | cepat & jelasnya laporan, minta ulang saat tidak paham |
| 正確さ Ketepatan | pesanan, catatan, urutan |
| スピード Kecepatan | target produksi, waktu layanan |
| 言葉づかい Bahasa | keigo ke atasan/tamu, salam |

Atasan memberi **satu komentar pribadi** per shift ("Laporanmu sudah bagus, tapi tadi kamu lupa rem kursi roda").

### 3.5 Bahasa: dengar dulu, baca belakangan
- Level 1: audio + teks Jepang + terjemahan. Level 2: audio + teks Jepang. Level 3: **audio saja** (teks bisa diintip dengan biaya kecil).
- Variasi bicara: cepat, pelan, ramah, terburu-buru, dialek Kansai (bonus).
- **Tombol bicara**: memakai Web Speech Recognition untuk salam & 指差呼称 (opsional, ada cadangan tombol).
- Tingkat keigo dibedakan: ke atasan (です/ます), ke tamu (いらっしゃいませ・かしこまりました), ke teman kerja (biasa).

### 3.6 Orang-orang di tempat kerja
- **Senpai** (pekerja senior) punya nama & sifat: Bu Siti (senpai asal Indonesia, membantu dengan bahasa Indonesia di level 1), Tanaka-san (galak tapi adil), Nguyen-san (rekan dari Vietnam).
- **Ruang istirahat (休憩室)**: obrolan ringan saat istirahat (cuaca, makanan, hari libur). Ini bagian penting dari kerja nyata di Jepang dan latihan percakapan yang bagus.
- Keakraban dengan rekan naik → mereka membantu saat kamu kesulitan.

---

## 4. Perbaikan tampilan & kontrol (dari uji di HP)

Berdasarkan screenshot di HP (preview Cloudflare, panti wreda):
1. **Balon kata menutupi label pos** (「ステーション」 tertutup 「こっち、こっち！」). Pindahkan balon ke sisi yang tidak ada pos, atau tampilkan label pos di atas balon.
2. **Ruangan terlalu kecil** dibanding ruang kosong di bawah. Perbesar area ruangan (atau mode layar penuh/landscape), lalu pindahkan kotak instruksi menjadi lembar yang bisa diciutkan.
3. **Bisa berjalan dengan D-pad** di dalam ruangan (sekarang hanya ketuk). D-pad dan tombol A di bawah sudah ada, tinggal disambungkan.
4. **Tabrakan dengan perabot**: karakter berjalan memutari meja/kasur (pathfinding sederhana), tidak menembus.
5. **Seragam berganti** per tempat kerja: pabrik (baju putih + penutup rambut), kaigo (polo + celemek), genba (helm kuning + rompi), izakaya (happi + ikat kepala).
6. **Benda bereaksi**: air keran mengalir, kursi roda bisa didorong, conveyor berhenti saat mesin macet, lampu izakaya menyala malam hari.
7. **Suara suasana**: dengung mesin pabrik, bel ナースコール, alat berat di genba, keramaian izakaya (bisa dimatikan).
8. **Getar HP** (haptic) saat salah atau ada bahaya.

---

## 5. Akurasi isi (supaya tidak menyesatkan)

- Setiap skenario diberi sumber: buku teks OTAFF (makanan & restoran), contoh soal 介護技能評価試験 / 介護日本語評価試験, materi JAC (konstruksi), pedoman HACCP (MHLW/MAFF).
- **Minta tinjauan dari pekerja nyata**, misalnya alumni Tokutei Ginou/magang asal Indonesia yang pernah bekerja di bidang tersebut. Buat formulir "laporkan kalau ada yang tidak sesuai" di layar Info Kerja.
- Angka (gaji, pajak, jam kerja) selalu diberi label **contoh** dan tautan ke ssw.go.jp.
- Hindari stereotip; tunjukkan juga hak pekerja: istirahat, lembur dibayar, boleh menolak tugas berbahaya, ke mana minta bantuan (konsultasi dalam bahasa Indonesia).

---

## 6. Tahapan pengerjaan

| Fase | Isi | Ukuran |
|---|---|---|
| **A · Perbaikan cepat** | Balon tidak menutupi label, ruangan lebih besar, D-pad di ruangan, seragam berganti, kartu absen masuk/keluar, komentar pribadi atasan, 評価シート 6 kategori | Kecil |
| **B · Tugas fisik pabrik** (prototipe) | Gosok tangan, rol badan, conveyor real-time, termometer + 記録表, label tanggal. Jadikan contoh untuk tempat lain | Sedang |
| **C · Tugas fisik 3 tempat lain** | Kaigo (ritme menyuapi, rem kursi roda, dial air, ナースコール, catatan), genba (APD, KY gambar, patroli, ねこ, meter panas), izakaya (meja real-time, ハンディ, laci kasir) | Besar |
| **D · Sistem kerja** | Hari/level karier, instruksi audio saja, tombol 📣 Lapor + chip kalimat, ヒヤリハット, ruang istirahat, senpai, slip gaji | Besar |
| **E · Bidang & persiapan kerja baru** | 農業 (pertanian), ビルクリーニング (cleaning gedung), 宿泊 (hotel), 保育 (pengasuhan anak), **simulasi wawancara kerja (面接)**, latihan menulis CV Jepang (履歴書) | Besar |

**Saran urutan:** A → B dulu. Kalau prototipe pabrik (B) sudah terasa seperti kerja nyata, polanya dipakai untuk kaigo, genba, dan izakaya.

---

## 7. Ukuran keberhasilan

- Pemain bisa menyebutkan alur kerja satu hari tanpa membuka Info Kerja.
- Pemain memakai frasa kerja (報連相, 指差呼称, 声かけ, 接客用語) dengan benar di level audio saja.
- Waktu rata-rata shift 8–12 menit, dan pemain mengulang shift secara sukarela (ada variasi kejadian).
- Masukan dari pekerja nyata: "ini mirip dengan pekerjaan saya" ≥ 4/5.
