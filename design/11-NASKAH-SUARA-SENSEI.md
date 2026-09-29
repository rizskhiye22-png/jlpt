# 11 · Naskah Suara Sensei (siap rekam)

> Naskah tetap untuk **Tanaka-sensei** (perempuan, ±35 tahun, hangat, tenang, sedikit lucu).
> Setiap baris = **satu klip audio**. Kata Jepang di dalam kalimat diucapkan sensei sendiri dengan pelafalan Jepang yang jelas (jeda kecil sebelum & sesudahnya), jadi **tidak ada pergantian suara** di tengah kalimat.
> Naskah Bab 1–2 di bawah **dibuat langsung dari data game** (`KANA.tip`, jumlah goresan KanjiVG di `strokes.js`, contoh kata dari `WORDS`), jadi cocok 1:1 dengan video pelajaran yang ada.

## A. Aturan naskah

| Aturan | Keterangan |
|---|---|
| ID klip | `sen_<h/k>_<romaji>_<nn>` untuk kana, `sen_dNN_intro/outro` untuk pembuka/penutup hari, `sen_air_N`, `sen_ok_N`, `sen_ng_N` untuk klip bersama. ID **tetap**, tidak berubah walau teks diperbaiki (lihat kolom `rev` di CSV). |
| Urutan per huruf | `_01` perkenalan → `_02` cara baca → `_03` goresan → `_04` cara mengingat → `_05` pasangan hiragana (katakana saja) → `_06` huruf mirip (jika ada) → `_07` contoh kata → `_08` menulis di udara (klip bersama). |
| Nomor yang tidak ada | Dilewati (mis. huruf tanpa pasangan mirip tidak punya `_06`). |
| Emosi | Dipakai untuk arahan akting **dan** ekspresi potret sensei saat klip diputar (lihat §14.7 dokumen utama). |
| Durasi | Target 2–6 detik per klip. Durasi shot video mengikuti panjang rekaman (dari manifest). |
| Nama pemain | Tidak pernah disebut di klip (tidak bisa direkam untuk semua nama). |

## B. Arahan akting untuk pengisi suara
- Bayangkan sedang mengajar **satu murid yang gugup** di les privat, bukan kelas besar.
- Tempo ±10% lebih pelan dari bicara biasa; beri jeda ±0,3 detik sebelum huruf/kata Jepang.
- Huruf Jepang diucapkan **dua kali** bila tertulis dua kali di naskah (sekali di tengah, sekali di akhir) — ini disengaja untuk pengulangan.
- Bagian "lucu" (`_04`): senyum terdengar di suara, boleh sedikit dramatis ("Aaa!").
- Bagian "serius-lembut" (`_06`): pelan, seperti memberi tahu rahasia penting.
- Bahasa Indonesia santai & jelas: "ya", "yuk", "nah" boleh; hindari logat daerah yang kuat.
- Rekam 3 take untuk intro hari & semua klip bersama.

## C. Klip bersama (dipakai berulang)

| ID | Teks | Emosi |
|---|---|---|
| `sen_air_1` | Sekarang tulis di udara dengan jarimu, ikuti kapur sensei. Pelan-pelan saja. | lembut |
| `sen_air_2` | Yuk, tulis di udara bareng sensei. Satu, dua… | lembut |
| `sen_air_3` | Coba gerakkan jarimu mengikuti kapurnya. Tidak apa-apa kalau belum rapi. | lembut |
| `sen_ok_1` | すごい！ Tepat sekali! | bangga |
| `sen_ok_2` | せいかい！ Benar! | ceria |
| `sen_ok_3` | いい ね！ Kamu makin jago. | bangga |
| `sen_ok_4` | よく できました！ Bagus sekali. | bangga |
| `sen_ok_5` | Wah, cepat sekali. Sensei kalah, nih. | lucu |
| `sen_ng_1` | おしい！ Hampir benar. Coba lihat lagi, ya. | lembut |
| `sen_ng_2` | Tidak apa-apa. Salah itu bagian dari belajar. | lembut |
| `sen_ng_3` | Hmm, yang ini sering tertukar. Perhatikan bentuknya baik-baik. | serius-lembut |
| `sen_ng_4` | ドンマイ！ Jangan khawatir, kita coba sekali lagi. | ceria |
| `sen_star3` | Tiga bintang! Sempurna! Sensei bangga sekali. | bangga |
| `sen_star1` | Satu bintang juga kemajuan. Besok pasti lebih baik. | lembut |
| `sen_review` | Ada beberapa huruf yang perlu diulas hari ini. Sebentar saja, yuk. | ceria |
| `sen_test_start` | Ulangan dimulai. Tarik napas dulu… Kamu pasti bisa. | tenang |
| `sen_test_end` | Ulangan selesai. Apa pun hasilnya, kamu sudah berusaha. おつかれさま！ | bangga |
| `sen_hanko` | Ini stempel dari sensei. はなまる！ | ceria |
| `sen_welcome_back` | Selamat datang kembali! Sensei sudah menunggumu. | ceria |
| `sen_goodbye` | Sampai jumpa besok, ya. また あした！ | lembut |

## D. Naskah Bab 1 (hiragana) & Bab 2 (katakana)

> Sumber kebenaran: `src/data/voice/sensei-vo.json` di kode (dipakai langsung oleh video pelajaran). Tabel ini dibuat dari file itu.

#### Hari 1 — あ い う え お

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d01_intro` | Selamat datang di kelas video pertamamu! Hari ini kita belajar lima huruf pertama hiragana. Santai saja, ya. | ceria |
| `sen_h_a_01` | Huruf pertama kita hari ini: あ. | semangat |
| `sen_h_a_02` | Bacanya "a", sama seperti bunyi "a" dalam bahasa Indonesia. あ. | tenang |
| `sen_h_a_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_a_04` | Tanda salib dan lingkaran besar, seperti orang berguling sambil teriak "Aaa!" | lucu |
| `sen_h_a_06` | Hati-hati, jangan tertukar dengan お. Yang kiri あ, dibaca "a". Yang kanan お, dibaca "o". | serius-lembut |
| `sen_h_a_07` | Contoh katanya: あい. Artinya "cinta". あい. | ceria |
| `sen_h_i_01` | Oke, lanjut ke huruf ini: い. | semangat |
| `sen_h_i_02` | Bacanya "i", sama seperti bunyi "i" dalam bahasa Indonesia. い. | tenang |
| `sen_h_i_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_i_04` | Dua garis berdiri berdampingan, seperti dua huruf "i": "ii". | lucu |
| `sen_h_i_06` | Hati-hati, jangan tertukar dengan り. Yang kiri い, dibaca "i". Yang kanan り, dibaca "ri". | serius-lembut |
| `sen_h_i_07` | Contoh katanya: いえ. Artinya "rumah". いえ. | ceria |
| `sen_h_u_01` | Sekarang, perhatikan huruf ini: う. | semangat |
| `sen_h_u_02` | Bacanya "u", bibir tidak terlalu dimonyongkan. う. | tenang |
| `sen_h_u_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_u_04` | Titik di atas lalu lengkungan, seperti orang membungkuk mengeluh "Uuh…" | lucu |
| `sen_h_u_06` | Hati-hati, jangan tertukar dengan つ. Yang kiri う, dibaca "u". Yang kanan つ, dibaca "tsu". | serius-lembut |
| `sen_h_u_07` | Contoh katanya: うえ. Artinya "atas". うえ. | ceria |
| `sen_h_e_01` | Nah, yang ini juga penting: え. | semangat |
| `sen_h_e_02` | Bacanya "e". Huruf e-nya seperti pada kata "enak", bukan "emas". え. | tenang |
| `sen_h_e_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_e_04` | Seperti orang menari dengan kaki melangkah: "Eh, eh!" | lucu |
| `sen_h_e_07` | Contoh katanya: いいえ. Artinya "Tidak". いいえ. | ceria |
| `sen_h_o_01` | Terakhir untuk hari ini: お. | semangat |
| `sen_h_o_02` | Bacanya "o", sama seperti bunyi "o" dalam bahasa Indonesia. お. | tenang |
| `sen_h_o_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_o_04` | Mirip あ tapi ada titik kecil di kanan atas: "Oh! Ada titik!" | lucu |
| `sen_h_o_06` | Hati-hati, jangan tertukar dengan あ. Yang kiri お, dibaca "o". Yang kanan あ, dibaca "a". | serius-lembut |
| `sen_h_o_07` | Contoh katanya: あお. Artinya "biru". あお. | ceria |
| `sen_d01_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

#### Hari 2 — か き く け こ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d02_intro` | Selamat datang kembali! Hari ini giliran huruf: か、き、く、け、こ. Yuk! | ceria |
| `sen_h_ka_01` | Huruf pertama kita hari ini: か. | semangat |
| `sen_h_ka_02` | Bacanya "ka", sama seperti bunyi "ka" dalam bahasa Indonesia. か. | tenang |
| `sen_h_ka_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ka_04` | Seperti orang karate yang menebas: "KA-rate!" | lucu |
| `sen_h_ka_07` | Contoh katanya: かお. Artinya "wajah". かお. | ceria |
| `sen_h_ki_01` | Oke, lanjut ke huruf ini: き. | semangat |
| `sen_h_ki_02` | Bacanya "ki", sama seperti bunyi "ki" dalam bahasa Indonesia. き. | tenang |
| `sen_h_ki_03` | Ada 4 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ki_04` | Bentuknya mirip anak kunci (key): "KI". | lucu |
| `sen_h_ki_06` | Hati-hati, jangan tertukar dengan さ. Yang kiri き, dibaca "ki". Yang kanan さ, dibaca "sa". | serius-lembut |
| `sen_h_ki_07` | Contoh katanya: えき. Artinya "stasiun". えき. | ceria |
| `sen_h_ku_01` | Sekarang, perhatikan huruf ini: く. | semangat |
| `sen_h_ku_02` | Bacanya "ku", sama seperti bunyi "ku" dalam bahasa Indonesia. く. | tenang |
| `sen_h_ku_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_ku_04` | Seperti paruh burung terbuka yang berkicau: "KUkuruyuk!" | lucu |
| `sen_h_ku_07` | Contoh katanya: くつ. Artinya "sepatu". くつ. | ceria |
| `sen_h_ke_01` | Nah, yang ini juga penting: け. | semangat |
| `sen_h_ke_02` | Bacanya "ke". Huruf e-nya seperti pada kata "enak", bukan "emas". け. | tenang |
| `sen_h_ke_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ke_04` | Seperti pagar dengan satu tiang. Ketuk pagarnya: "KEtuk!" | lucu |
| `sen_h_ke_07` | Contoh katanya: いけ. Artinya "kolam". いけ. | ceria |
| `sen_h_ko_01` | Terakhir untuk hari ini: こ. | semangat |
| `sen_h_ko_02` | Bacanya "ko", sama seperti bunyi "ko" dalam bahasa Indonesia. こ. | tenang |
| `sen_h_ko_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ko_04` | Dua garis sejajar seperti dua koin bertumpuk: "KOin". | lucu |
| `sen_h_ko_07` | Contoh katanya: こえ. Artinya "suara". こえ. | ceria |
| `sen_d02_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 3 — さ し す せ そ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d03_intro` | Pagi yang cerah untuk belajar! Hari ini: さ、し、す、せ、そ. Kita mulai, ya. | ceria |
| `sen_h_sa_01` | Huruf pertama kita hari ini: さ. | semangat |
| `sen_h_sa_02` | Bacanya "sa", sama seperti bunyi "sa" dalam bahasa Indonesia. さ. | tenang |
| `sen_h_sa_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_sa_04` | Mirip き tapi garis mendatarnya hanya SAtu: "SA". | lucu |
| `sen_h_sa_06` | Hati-hati, jangan tertukar dengan き. Yang kiri さ, dibaca "sa". Yang kanan き, dibaca "ki". | serius-lembut |
| `sen_h_sa_07` | Contoh katanya: かさ. Artinya "payung". かさ. | ceria |
| `sen_h_shi_01` | Oke, lanjut ke huruf ini: し. | semangat |
| `sen_h_shi_02` | Bacanya "shi", seperti "syi" yang lembut, bukan "si". し. | tenang |
| `sen_h_shi_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_shi_04` | Seperti kail pancing. Dibaca "shi" (mirip "si"). | lucu |
| `sen_h_shi_07` | Contoh katanya: あし. Artinya "kaki". あし. | ceria |
| `sen_h_su_01` | Sekarang, perhatikan huruf ini: す. | semangat |
| `sen_h_su_02` | Bacanya "su". Huruf u di akhir sering terdengar samar, seperti "s" saja. す. | tenang |
| `sen_h_su_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_su_04` | Garis dengan simpul berputar, seperti peselancar (SUrfing) berputar di ombak. | lucu |
| `sen_h_su_07` | Contoh katanya: すし. Artinya "sushi". すし. | ceria |
| `sen_h_se_01` | Nah, yang ini juga penting: せ. | semangat |
| `sen_h_se_02` | Bacanya "se". Huruf e-nya seperti pada kata "enak", bukan "emas". せ. | tenang |
| `sen_h_se_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_se_04` | Seperti mulut tersenyum lebar dengan gigi: "SEnyum!" | lucu |
| `sen_h_se_07` | Contoh katanya: せかい. Artinya "dunia". せかい. | ceria |
| `sen_h_so_01` | Terakhir untuk hari ini: そ. | semangat |
| `sen_h_so_02` | Bacanya "so", sama seperti bunyi "so" dalam bahasa Indonesia. そ. | tenang |
| `sen_h_so_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_so_04` | Zig-zag seperti jalan berkelok-kelok: "SO jauh!" | lucu |
| `sen_h_so_07` | Contoh katanya: そと. Artinya "luar". そと. | ceria |
| `sen_d03_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

#### Hari 4 — た ち つ て と

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d04_intro` | Halo lagi! Hari ini kita belajar huruf: た、ち、つ、て、と. Siap? | ceria |
| `sen_h_ta_01` | Huruf pertama kita hari ini: た. | semangat |
| `sen_h_ta_02` | Bacanya "ta", sama seperti bunyi "ta" dalam bahasa Indonesia. た. | tenang |
| `sen_h_ta_03` | Ada 4 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ta_04` | Terlihat seperti huruf "t" dan "a" digabung: "TA". | lucu |
| `sen_h_ta_06` | Hati-hati, jangan tertukar dengan な. Yang kiri た, dibaca "ta". Yang kanan な, dibaca "na". | serius-lembut |
| `sen_h_ta_07` | Contoh katanya: たこ. Artinya "gurita". たこ. | ceria |
| `sen_h_chi_01` | Oke, lanjut ke huruf ini: ち. | semangat |
| `sen_h_chi_02` | Bacanya "chi", mirip "ci" dalam kata cinta. ち. | tenang |
| `sen_h_chi_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_chi_04` | Mirip angka 5 yang dibalik. Dibaca "chi" (seperti "ci"). | lucu |
| `sen_h_chi_06` | Hati-hati, jangan tertukar dengan さ. Yang kiri ち, dibaca "chi". Yang kanan さ, dibaca "sa". | serius-lembut |
| `sen_h_chi_07` | Contoh katanya: ちかてつ. Artinya "kereta bawah tanah". ちかてつ. | ceria |
| `sen_h_tsu_01` | Sekarang, perhatikan huruf ini: つ. | semangat |
| `sen_h_tsu_02` | Bacanya "tsu". Ujung lidah menempel sebentar, lalu "su". Pelan-pelan: ts, tsu. つ. | tenang |
| `sen_h_tsu_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_tsu_04` | Satu lengkungan seperti ombak TSUnami. | lucu |
| `sen_h_tsu_06` | Hati-hati, jangan tertukar dengan う. Yang kiri つ, dibaca "tsu". Yang kanan う, dibaca "u". | serius-lembut |
| `sen_h_tsu_07` | Contoh katanya: つくえ. Artinya "meja". つくえ. | ceria |
| `sen_h_te_01` | Nah, yang ini juga penting: て. | semangat |
| `sen_h_te_02` | Bacanya "te". Huruf e-nya seperti pada kata "enak", bukan "emas". て. | tenang |
| `sen_h_te_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_te_04` | Seperti tangan yang terulur. "Te" dalam bahasa Jepang memang berarti tangan! | lucu |
| `sen_h_te_07` | Contoh katanya: て. Artinya "tangan". て. | ceria |
| `sen_h_to_01` | Terakhir untuk hari ini: と. | semangat |
| `sen_h_to_02` | Bacanya "to", sama seperti bunyi "to" dalam bahasa Indonesia. と. | tenang |
| `sen_h_to_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_to_04` | Seperti duri yang menancap di jari kaki: "TOlong!" | lucu |
| `sen_h_to_07` | Contoh katanya: ひと. Artinya "orang". ひと. | ceria |
| `sen_d04_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 6 — な に ぬ ね の

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d06_intro` | Selamat datang kembali! Hari ini giliran huruf: な、に、ぬ、ね、の. Yuk! | ceria |
| `sen_h_na_01` | Huruf pertama kita hari ini: な. | semangat |
| `sen_h_na_02` | Bacanya "na", sama seperti bunyi "na" dalam bahasa Indonesia. な. | tenang |
| `sen_h_na_03` | Ada 4 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_na_04` | Salib dan simpul: bayangkan NAsi dibungkus lalu diikat. | lucu |
| `sen_h_na_06` | Hati-hati, jangan tertukar dengan た. Yang kiri な, dibaca "na". Yang kanan た, dibaca "ta". | serius-lembut |
| `sen_h_na_07` | Contoh katanya: なつ. Artinya "musim panas". なつ. | ceria |
| `sen_h_ni_01` | Oke, lanjut ke huruf ini: に. | semangat |
| `sen_h_ni_02` | Bacanya "ni", sama seperti bunyi "ni" dalam bahasa Indonesia. に. | tenang |
| `sen_h_ni_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ni_04` | Satu tiang dan DUA garis. Angka 2 dalam bahasa Jepang adalah "ni"! | lucu |
| `sen_h_ni_07` | Contoh katanya: にく. Artinya "daging". にく. | ceria |
| `sen_h_nu_01` | Sekarang, perhatikan huruf ini: ぬ. | semangat |
| `sen_h_nu_02` | Bacanya "nu", sama seperti bunyi "nu" dalam bahasa Indonesia. ぬ. | tenang |
| `sen_h_nu_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_nu_04` | Seperti mi (NUdle) keriting dengan simpul di ujungnya. | lucu |
| `sen_h_nu_06` | Hati-hati, jangan tertukar dengan め. Yang kiri ぬ, dibaca "nu". Yang kanan め, dibaca "me". | serius-lembut |
| `sen_h_nu_07` | Contoh katanya: いぬ. Artinya "anjing". いぬ. | ceria |
| `sen_h_ne_01` | Nah, yang ini juga penting: ね. | semangat |
| `sen_h_ne_02` | Bacanya "ne". Huruf e-nya seperti pada kata "enak", bukan "emas". ね. | tenang |
| `sen_h_ne_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ne_04` | Seperti kucing (NEko) dengan ekor melingkar. | lucu |
| `sen_h_ne_06` | Hati-hati, jangan tertukar dengan れ. Yang kiri ね, dibaca "ne". Yang kanan れ, dibaca "re". | serius-lembut |
| `sen_h_ne_07` | Contoh katanya: ねこ. Artinya "kucing". ねこ. | ceria |
| `sen_h_no_01` | Terakhir untuk hari ini: の. | semangat |
| `sen_h_no_02` | Bacanya "no", sama seperti bunyi "no" dalam bahasa Indonesia. の. | tenang |
| `sen_h_no_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_no_04` | Seperti tanda larangan: "NO!" | lucu |
| `sen_h_no_07` | Contoh katanya: たのしい. Artinya "Menyenangkan". たのしい. | ceria |
| `sen_d06_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 7 — は ひ ふ へ ほ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d07_intro` | Pagi yang cerah untuk belajar! Hari ini: は、ひ、ふ、へ、ほ. Kita mulai, ya. | ceria |
| `sen_h_ha_01` | Huruf pertama kita hari ini: は. | semangat |
| `sen_h_ha_02` | Bacanya "ha". Tapi kalau jadi partikel, dibaca "wa". Nanti kita pelajari. は. | tenang |
| `sen_h_ha_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ha_04` | Tiang dan wajah tertawa: "HAhaha!" (Sebagai partikel dibaca "wa".) | lucu |
| `sen_h_ha_06` | Hati-hati, jangan tertukar dengan ほ. Yang kiri は, dibaca "ha". Yang kanan ほ, dibaca "ho". | serius-lembut |
| `sen_h_ha_07` | Contoh katanya: はな. Artinya "bunga". はな. | ceria |
| `sen_h_hi_01` | Oke, lanjut ke huruf ini: ひ. | semangat |
| `sen_h_hi_02` | Bacanya "hi", sama seperti bunyi "hi" dalam bahasa Indonesia. ひ. | tenang |
| `sen_h_hi_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_hi_04` | Seperti senyum lebar: "HIhihi!" | lucu |
| `sen_h_hi_07` | Contoh katanya: ひこうき. Artinya "pesawat". ひこうき. | ceria |
| `sen_h_fu_01` | Sekarang, perhatikan huruf ini: ふ. | semangat |
| `sen_h_fu_02` | Bacanya "fu", tapi bibir tidak menyentuh gigi. Seperti meniup lilin pelan: fu. ふ. | tenang |
| `sen_h_fu_03` | Ada 4 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_fu_04` | Seperti orang meniup lilin: "FUuu!" (bunyinya antara "fu" dan "hu"). | lucu |
| `sen_h_fu_07` | Contoh katanya: ふね. Artinya "kapal". ふね. | ceria |
| `sen_h_he_01` | Nah, yang ini juga penting: へ. | semangat |
| `sen_h_he_02` | Bacanya "he". Kalau jadi partikel arah, dibaca "e". へ. | tenang |
| `sen_h_he_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_he_04` | Seperti bukit kecil: "HEi, ada bukit!" | lucu |
| `sen_h_he_06` | Hati-hati, jangan tertukar dengan ヘ. Yang kiri へ, dibaca "he". Yang kanan ヘ, dibaca "he". | serius-lembut |
| `sen_h_he_07` | Contoh katanya: へそ. Artinya "pusar". へそ. | ceria |
| `sen_h_ho_01` | Terakhir untuk hari ini: ほ. | semangat |
| `sen_h_ho_02` | Bacanya "ho", sama seperti bunyi "ho" dalam bahasa Indonesia. ほ. | tenang |
| `sen_h_ho_03` | Ada 4 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ho_04` | Mirip は tapi ada garis tambahan di atas: "HOho!" | lucu |
| `sen_h_ho_06` | Hati-hati, jangan tertukar dengan は. Yang kiri ほ, dibaca "ho". Yang kanan は, dibaca "ha". | serius-lembut |
| `sen_h_ho_07` | Contoh katanya: ほし. Artinya "bintang". ほし. | ceria |
| `sen_d07_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

#### Hari 8 — ま み む め も

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d08_intro` | Halo lagi! Hari ini kita belajar huruf: ま、み、む、め、も. Siap? | ceria |
| `sen_h_ma_01` | Huruf pertama kita hari ini: ま. | semangat |
| `sen_h_ma_02` | Bacanya "ma", sama seperti bunyi "ma" dalam bahasa Indonesia. ま. | tenang |
| `sen_h_ma_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ma_04` | Tiang dengan dua palang dan simpul di bawah, seperti MAma mengikat tali. | lucu |
| `sen_h_ma_07` | Contoh katanya: まち. Artinya "kota". まち. | ceria |
| `sen_h_mi_01` | Oke, lanjut ke huruf ini: み. | semangat |
| `sen_h_mi_02` | Bacanya "mi", sama seperti bunyi "mi" dalam bahasa Indonesia. み. | tenang |
| `sen_h_mi_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_mi_04` | Seperti angka 21 yang ditulis bersambung: "MI". | lucu |
| `sen_h_mi_07` | Contoh katanya: みみ. Artinya "telinga". みみ. | ceria |
| `sen_h_mu_01` | Sekarang, perhatikan huruf ini: む. | semangat |
| `sen_h_mu_02` | Bacanya "mu", sama seperti bunyi "mu" dalam bahasa Indonesia. む. | tenang |
| `sen_h_mu_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_mu_04` | Seperti sapi bertanduk yang melenguh: "MUuu!" | lucu |
| `sen_h_mu_07` | Contoh katanya: むし. Artinya "serangga". むし. | ceria |
| `sen_h_me_01` | Nah, yang ini juga penting: め. | semangat |
| `sen_h_me_02` | Bacanya "me". Huruf e-nya seperti pada kata "enak", bukan "emas". め. | tenang |
| `sen_h_me_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_me_04` | Seperti mata. "Me" dalam bahasa Jepang memang berarti mata! | lucu |
| `sen_h_me_06` | Hati-hati, jangan tertukar dengan ぬ. Yang kiri め, dibaca "me". Yang kanan ぬ, dibaca "nu". | serius-lembut |
| `sen_h_me_07` | Contoh katanya: め. Artinya "mata". め. | ceria |
| `sen_h_mo_01` | Terakhir untuk hari ini: も. | semangat |
| `sen_h_mo_02` | Bacanya "mo", sama seperti bunyi "mo" dalam bahasa Indonesia. も. | tenang |
| `sen_h_mo_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_mo_04` | Kail pancing dengan dua umpan: "MOga dapat ikan!" | lucu |
| `sen_h_mo_07` | Contoh katanya: もも. Artinya "buah persik". もも. | ceria |
| `sen_d08_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 9 — や ゆ よ ら り る れ ろ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d09_intro` | Selamat datang kembali! Hari ini giliran huruf: や、ゆ、よ、ら、り、る、れ、ろ. Yuk! | ceria |
| `sen_h_ya_01` | Huruf pertama kita hari ini: や. | semangat |
| `sen_h_ya_02` | Bacanya "ya", sama seperti bunyi "ya" dalam bahasa Indonesia. や. | tenang |
| `sen_h_ya_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ya_04` | Seperti yak (hewan) dengan tanduk: "YA!" | lucu |
| `sen_h_ya_07` | Contoh katanya: やま. Artinya "gunung". やま. | ceria |
| `sen_h_yu_01` | Oke, lanjut ke huruf ini: ゆ. | semangat |
| `sen_h_yu_02` | Bacanya "yu", sama seperti bunyi "yu" dalam bahasa Indonesia. ゆ. | tenang |
| `sen_h_yu_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_yu_04` | Seperti ikan dilihat dari samping: "YUk makan ikan!" | lucu |
| `sen_h_yu_07` | Contoh katanya: ゆき. Artinya "salju". ゆき. | ceria |
| `sen_h_yo_01` | Sekarang, perhatikan huruf ini: よ. | semangat |
| `sen_h_yo_02` | Bacanya "yo", sama seperti bunyi "yo" dalam bahasa Indonesia. よ. | tenang |
| `sen_h_yo_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_yo_04` | Seperti orang main YOyo. | lucu |
| `sen_h_yo_07` | Contoh katanya: おはよう. Artinya "Selamat pagi (santai)". おはよう. | ceria |
| `sen_h_ra_01` | Nah, yang ini juga penting: ら. | semangat |
| `sen_h_ra_02` | Bunyi R Jepang ada di antara R dan L. Lidah cukup mengetuk sekali: ra. ら. | tenang |
| `sen_h_ra_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ra_04` | Seperti orang berjongkok dengan titik di kepala: "RA". | lucu |
| `sen_h_ra_07` | Contoh katanya: さくら. Artinya "bunga sakura". さくら. | ceria |
| `sen_h_ri_01` | Berikutnya, huruf ini: り. | semangat |
| `sen_h_ri_02` | Lidah mengetuk sekali, antara R dan L: ri. り. | tenang |
| `sen_h_ri_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_ri_04` | Dua garis seperti aliran sungai (RIver): "RI". | lucu |
| `sen_h_ri_06` | Hati-hati, jangan tertukar dengan い. Yang kiri り, dibaca "ri". Yang kanan い, dibaca "i". | serius-lembut |
| `sen_h_ri_07` | Contoh katanya: とり. Artinya "burung". とり. | ceria |
| `sen_h_ru_01` | Oke, lanjut ke huruf ini: る. | semangat |
| `sen_h_ru_02` | Lidah mengetuk sekali: ru. る. | tenang |
| `sen_h_ru_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_ru_04` | Seperti angka 3 dengan lingkaran kecil di bawah: "RU". | lucu |
| `sen_h_ru_06` | Hati-hati, jangan tertukar dengan ろ. Yang kiri る, dibaca "ru". Yang kanan ろ, dibaca "ro". | serius-lembut |
| `sen_h_ru_07` | Contoh katanya: よる. Artinya "malam". よる. | ceria |
| `sen_h_re_01` | Sekarang, perhatikan huruf ini: れ. | semangat |
| `sen_h_re_02` | Lidah mengetuk sekali: re. れ. | tenang |
| `sen_h_re_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_re_04` | Seperti ね tapi ekornya lurus ke kanan: "RE". | lucu |
| `sen_h_re_06` | Hati-hati, jangan tertukar dengan わ. Yang kiri れ, dibaca "re". Yang kanan わ, dibaca "wa". | serius-lembut |
| `sen_h_re_07` | Contoh katanya: これ / それ / あれ. Artinya "Ini / itu (dekat lawan) / itu (jauh)". これ / それ / あれ. | ceria |
| `sen_h_ro_01` | Terakhir untuk hari ini: ろ. | semangat |
| `sen_h_ro_02` | Lidah mengetuk sekali: ro. ろ. | tenang |
| `sen_h_ro_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_ro_04` | Seperti る tanpa lingkaran: "RO". | lucu |
| `sen_h_ro_06` | Hati-hati, jangan tertukar dengan る. Yang kiri ろ, dibaca "ro". Yang kanan る, dibaca "ru". | serius-lembut |
| `sen_h_ro_07` | Contoh katanya: ふくろ は いりますか. Artinya "Perlu kantong?". ふくろ は いりますか. | ceria |
| `sen_d09_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

#### Hari 10 — わ を ん

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d10_intro` | Pagi yang cerah untuk belajar! Hari ini: わ、を、ん. Kita mulai, ya. | ceria |
| `sen_h_wa_01` | Huruf pertama kita hari ini: わ. | semangat |
| `sen_h_wa_02` | Bacanya "wa", sama seperti bunyi "wa" dalam bahasa Indonesia. わ. | tenang |
| `sen_h_wa_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_wa_04` | Seperti ね tanpa ekor melingkar: "WAh!" | lucu |
| `sen_h_wa_06` | Hati-hati, jangan tertukar dengan れ. Yang kiri わ, dibaca "wa". Yang kanan れ, dibaca "re". | serius-lembut |
| `sen_h_wa_07` | Contoh katanya: わたし. Artinya "saya". わたし. | ceria |
| `sen_h_wo_01` | Oke, lanjut ke huruf ini: を. | semangat |
| `sen_h_wo_02` | Walaupun ditulis "wo", bacanya "o". Huruf ini hampir hanya dipakai sebagai partikel. を. | tenang |
| `sen_h_wo_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_h_wo_04` | Seperti orang kaget: "WOah!" Dibaca "o", hanya dipakai sebagai partikel. | lucu |
| `sen_h_wo_07` | Contohnya: パン を たべます. Artinya "makan roti". を menunjukkan benda yang dimakan. | ceria |
| `sen_h_n_01` | Terakhir untuk hari ini: ん. | semangat |
| `sen_h_n_02` | Bacanya "n" saja, tanpa huruf hidup. Satu ketukan penuh, lho. ん. | tenang |
| `sen_h_n_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_h_n_04` | Seperti huruf "n" kecil yang ditulis miring: "N". | lucu |
| `sen_h_n_07` | Contoh katanya: ほん. Artinya "buku". ほん. | ceria |
| `sen_d10_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 12 — ア イ ウ エ オ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d12_intro` | Selamat datang di dunia katakana! Bunyinya sama dengan hiragana, hanya bentuknya lebih tegas dan bersudut. | ceria |
| `sen_k_a_01` | Huruf pertama kita hari ini: ア. | semangat |
| `sen_k_a_02` | Bacanya "a", sama seperti bunyi "a" dalam bahasa Indonesia. ア. | tenang |
| `sen_k_a_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_a_04` | Seperti kapak (axe) yang miring: "A". | lucu |
| `sen_k_a_05` | Pasangan hiragananya adalah あ. Bunyinya sama persis: ア, あ. | tenang |
| `sen_k_a_06` | Hati-hati, jangan tertukar dengan マ. Yang kiri ア, dibaca "a". Yang kanan マ, dibaca "ma". | serius-lembut |
| `sen_k_a_07` | Contoh katanya: アイス. Artinya "es krim". アイス. | ceria |
| `sen_k_i_01` | Oke, lanjut ke huruf ini: イ. | semangat |
| `sen_k_i_02` | Bacanya "i", sama seperti bunyi "i" dalam bahasa Indonesia. イ. | tenang |
| `sen_k_i_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_i_04` | Seperti orang bersandar ke tiang: "I". | lucu |
| `sen_k_i_05` | Pasangan hiragananya adalah い. Bunyinya sama persis: イ, い. | tenang |
| `sen_k_i_07` | Contoh katanya: トイレ. Artinya "toilet". トイレ. | ceria |
| `sen_k_u_01` | Sekarang, perhatikan huruf ini: ウ. | semangat |
| `sen_k_u_02` | Bacanya "u", bibir tidak terlalu dimonyongkan. ウ. | tenang |
| `sen_k_u_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_u_04` | Mirip う versi bersudut, dengan titik di atas: "U". | lucu |
| `sen_k_u_05` | Pasangan hiragananya adalah う. Bunyinya sama persis: ウ, う. | tenang |
| `sen_k_u_06` | Hati-hati, jangan tertukar dengan ワ. Yang kiri ウ, dibaca "u". Yang kanan ワ, dibaca "wa". | serius-lembut |
| `sen_k_e_01` | Nah, yang ini juga penting: エ. | semangat |
| `sen_k_e_02` | Bacanya "e". Huruf e-nya seperti pada kata "enak", bukan "emas". エ. | tenang |
| `sen_k_e_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_e_04` | Seperti balok besi (I-beam) untuk bangunan: "E". | lucu |
| `sen_k_e_05` | Pasangan hiragananya adalah え. Bunyinya sama persis: エ, え. | tenang |
| `sen_k_o_01` | Terakhir untuk hari ini: オ. | semangat |
| `sen_k_o_02` | Bacanya "o", sama seperti bunyi "o" dalam bahasa Indonesia. オ. | tenang |
| `sen_k_o_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_o_04` | Seperti orang berolahraga dengan tangan terbuka: "O". | lucu |
| `sen_k_o_05` | Pasangan hiragananya adalah お. Bunyinya sama persis: オ, お. | tenang |
| `sen_d12_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 13 — カ キ ク ケ コ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d13_intro` | Selamat datang kembali! Hari ini giliran huruf: カ、キ、ク、ケ、コ. Yuk! | ceria |
| `sen_k_ka_01` | Huruf pertama kita hari ini: カ. | semangat |
| `sen_k_ka_02` | Bacanya "ka", sama seperti bunyi "ka" dalam bahasa Indonesia. カ. | tenang |
| `sen_k_ka_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ka_04` | Mirip か hiragana tanpa titik: "KA". | lucu |
| `sen_k_ka_05` | Pasangan hiragananya adalah か. Bunyinya sama persis: カ, か. | tenang |
| `sen_k_ka_07` | Contoh katanya: カメラ. Artinya "kamera". カメラ. | ceria |
| `sen_k_ki_01` | Oke, lanjut ke huruf ini: キ. | semangat |
| `sen_k_ki_02` | Bacanya "ki", sama seperti bunyi "ki" dalam bahasa Indonesia. キ. | tenang |
| `sen_k_ki_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ki_04` | Mirip き versi lurus, seperti anak kunci: "KI". | lucu |
| `sen_k_ki_05` | Pasangan hiragananya adalah き. Bunyinya sama persis: キ, き. | tenang |
| `sen_k_ki_07` | Contoh katanya: ケーキ. Artinya "kue". ケーキ. | ceria |
| `sen_k_ku_01` | Sekarang, perhatikan huruf ini: ク. | semangat |
| `sen_k_ku_02` | Bacanya "ku", sama seperti bunyi "ku" dalam bahasa Indonesia. ク. | tenang |
| `sen_k_ku_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ku_04` | Seperti paruh burung dilihat dari samping: "KU". | lucu |
| `sen_k_ku_05` | Pasangan hiragananya adalah く. Bunyinya sama persis: ク, く. | tenang |
| `sen_k_ku_06` | Hati-hati, jangan tertukar dengan ケ. Yang kiri ク, dibaca "ku". Yang kanan ケ, dibaca "ke". | serius-lembut |
| `sen_k_ku_07` | Contoh katanya: タクシー. Artinya "taksi". タクシー. | ceria |
| `sen_k_ke_01` | Nah, yang ini juga penting: ケ. | semangat |
| `sen_k_ke_02` | Bacanya "ke". Huruf e-nya seperti pada kata "enak", bukan "emas". ケ. | tenang |
| `sen_k_ke_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ke_04` | Seperti huruf "K" yang miring: "KE". | lucu |
| `sen_k_ke_05` | Pasangan hiragananya adalah け. Bunyinya sama persis: ケ, け. | tenang |
| `sen_k_ke_06` | Hati-hati, jangan tertukar dengan ク. Yang kiri ケ, dibaca "ke". Yang kanan ク, dibaca "ku". | serius-lembut |
| `sen_k_ko_01` | Terakhir untuk hari ini: コ. | semangat |
| `sen_k_ko_02` | Bacanya "ko", sama seperti bunyi "ko" dalam bahasa Indonesia. コ. | tenang |
| `sen_k_ko_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ko_04` | Seperti sudut kotak yang terbuka: "KO". | lucu |
| `sen_k_ko_05` | Pasangan hiragananya adalah こ. Bunyinya sama persis: コ, こ. | tenang |
| `sen_k_ko_06` | Hati-hati, jangan tertukar dengan ユ. Yang kiri コ, dibaca "ko". Yang kanan ユ, dibaca "yu". | serius-lembut |
| `sen_k_ko_07` | Contoh katanya: ココア. Artinya "cokelat panas". ココア. | ceria |
| `sen_d13_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

#### Hari 14 — サ シ ス セ ソ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d14_intro` | Pagi yang cerah untuk belajar! Hari ini: サ、シ、ス、セ、ソ. Kita mulai, ya. | ceria |
| `sen_k_sa_01` | Huruf pertama kita hari ini: サ. | semangat |
| `sen_k_sa_02` | Bacanya "sa", sama seperti bunyi "sa" dalam bahasa Indonesia. サ. | tenang |
| `sen_k_sa_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_sa_04` | Seperti rak dengan dua tiang, mirip さ: "SA". | lucu |
| `sen_k_sa_05` | Pasangan hiragananya adalah さ. Bunyinya sama persis: サ, さ. | tenang |
| `sen_k_shi_01` | Oke, lanjut ke huruf ini: シ. | semangat |
| `sen_k_shi_02` | Bacanya "shi", seperti "syi" yang lembut, bukan "si". シ. | tenang |
| `sen_k_shi_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_shi_04` | Dua titik di kiri, goresan panjang NAIK dari bawah: "SHI". Beda dengan ツ! | lucu |
| `sen_k_shi_05` | Pasangan hiragananya adalah し. Bunyinya sama persis: シ, し. | tenang |
| `sen_k_shi_06` | Hati-hati, jangan tertukar dengan ツ. Yang kiri シ, dibaca "shi". Yang kanan ツ, dibaca "tsu". | serius-lembut |
| `sen_k_su_01` | Sekarang, perhatikan huruf ini: ス. | semangat |
| `sen_k_su_02` | Bacanya "su". Huruf u di akhir sering terdengar samar, seperti "s" saja. ス. | tenang |
| `sen_k_su_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_su_04` | Seperti orang berseluncur dengan kaki terbuka: "SU". | lucu |
| `sen_k_su_05` | Pasangan hiragananya adalah す. Bunyinya sama persis: ス, す. | tenang |
| `sen_k_su_06` | Hati-hati, jangan tertukar dengan ヌ. Yang kiri ス, dibaca "su". Yang kanan ヌ, dibaca "nu". | serius-lembut |
| `sen_k_su_07` | Contoh katanya: スキー. Artinya "ski". スキー. | ceria |
| `sen_k_se_01` | Nah, yang ini juga penting: セ. | semangat |
| `sen_k_se_02` | Bacanya "se". Huruf e-nya seperti pada kata "enak", bukan "emas". セ. | tenang |
| `sen_k_se_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_se_04` | Mirip せ hiragana: "SE". | lucu |
| `sen_k_se_05` | Pasangan hiragananya adalah せ. Bunyinya sama persis: セ, せ. | tenang |
| `sen_k_se_07` | Contoh katanya: セーター. Artinya "sweter". セーター. | ceria |
| `sen_k_so_01` | Terakhir untuk hari ini: ソ. | semangat |
| `sen_k_so_02` | Bacanya "so", sama seperti bunyi "so" dalam bahasa Indonesia. ソ. | tenang |
| `sen_k_so_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_so_04` | Dua goresan, yang panjang TURUN dari atas: "SO". Beda dengan ン! | lucu |
| `sen_k_so_05` | Pasangan hiragananya adalah そ. Bunyinya sama persis: ソ, そ. | tenang |
| `sen_k_so_06` | Hati-hati, jangan tertukar dengan ン. Yang kiri ソ, dibaca "so". Yang kanan ン, dibaca "n". | serius-lembut |
| `sen_d14_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 15 — タ チ ツ テ ト

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d15_intro` | Halo lagi! Hari ini kita belajar huruf: タ、チ、ツ、テ、ト. Siap? | ceria |
| `sen_k_ta_01` | Huruf pertama kita hari ini: タ. | semangat |
| `sen_k_ta_02` | Bacanya "ta", sama seperti bunyi "ta" dalam bahasa Indonesia. タ. | tenang |
| `sen_k_ta_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ta_04` | Seperti ク dengan garis tambahan di tengah: "TA". | lucu |
| `sen_k_ta_05` | Pasangan hiragananya adalah た. Bunyinya sama persis: タ, た. | tenang |
| `sen_k_ta_07` | Contoh katanya: ネクタイ. Artinya "dasi". ネクタイ. | ceria |
| `sen_k_chi_01` | Oke, lanjut ke huruf ini: チ. | semangat |
| `sen_k_chi_02` | Bacanya "chi", mirip "ci" dalam kata cinta. チ. | tenang |
| `sen_k_chi_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_chi_04` | Mirip angka 千 (seribu) versi miring: "CHI". | lucu |
| `sen_k_chi_05` | Pasangan hiragananya adalah ち. Bunyinya sama persis: チ, ち. | tenang |
| `sen_k_chi_06` | Hati-hati, jangan tertukar dengan テ. Yang kiri チ, dibaca "chi". Yang kanan テ, dibaca "te". | serius-lembut |
| `sen_k_chi_07` | Contoh katanya: チキン. Artinya "ayam goreng". チキン. | ceria |
| `sen_k_tsu_01` | Sekarang, perhatikan huruf ini: ツ. | semangat |
| `sen_k_tsu_02` | Bacanya "tsu". Ujung lidah menempel sebentar, lalu "su". Pelan-pelan: ts, tsu. ツ. | tenang |
| `sen_k_tsu_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_tsu_04` | Dua titik di atas, goresan panjang TURUN dari atas: "TSU". Beda dengan シ! | lucu |
| `sen_k_tsu_05` | Pasangan hiragananya adalah つ. Bunyinya sama persis: ツ, つ. | tenang |
| `sen_k_tsu_06` | Hati-hati, jangan tertukar dengan シ. Yang kiri ツ, dibaca "tsu". Yang kanan シ, dibaca "shi". | serius-lembut |
| `sen_k_tsu_07` | Contoh katanya: スポーツ. Artinya "Olahraga". スポーツ. | ceria |
| `sen_k_te_01` | Nah, yang ini juga penting: テ. | semangat |
| `sen_k_te_02` | Bacanya "te". Huruf e-nya seperti pada kata "enak", bukan "emas". テ. | tenang |
| `sen_k_te_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_te_04` | Seperti tiang telepon dengan kabel: "TE". | lucu |
| `sen_k_te_05` | Pasangan hiragananya adalah て. Bunyinya sama persis: テ, て. | tenang |
| `sen_k_te_06` | Hati-hati, jangan tertukar dengan チ. Yang kiri テ, dibaca "te". Yang kanan チ, dibaca "chi". | serius-lembut |
| `sen_k_te_07` | Contoh katanya: テニス. Artinya "tenis". テニス. | ceria |
| `sen_k_to_01` | Terakhir untuk hari ini: ト. | semangat |
| `sen_k_to_02` | Bacanya "to", sama seperti bunyi "to" dalam bahasa Indonesia. ト. | tenang |
| `sen_k_to_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_to_04` | Seperti tongkat dengan cabang kecil: "TO". | lucu |
| `sen_k_to_05` | Pasangan hiragananya adalah と. Bunyinya sama persis: ト, と. | tenang |
| `sen_k_to_07` | Contoh katanya: スカート. Artinya "rok". スカート. | ceria |
| `sen_d15_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

#### Hari 17 — ナ ニ ヌ ネ ノ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d17_intro` | Selamat datang kembali! Hari ini giliran huruf: ナ、ニ、ヌ、ネ、ノ. Yuk! | ceria |
| `sen_k_na_01` | Huruf pertama kita hari ini: ナ. | semangat |
| `sen_k_na_02` | Bacanya "na", sama seperti bunyi "na" dalam bahasa Indonesia. ナ. | tenang |
| `sen_k_na_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_na_04` | Seperti tanda tambah yang miring: "NA". | lucu |
| `sen_k_na_05` | Pasangan hiragananya adalah な. Bunyinya sama persis: ナ, な. | tenang |
| `sen_k_na_07` | Contoh katanya: ナース. Artinya "perawat". ナース. | ceria |
| `sen_k_ni_01` | Oke, lanjut ke huruf ini: ニ. | semangat |
| `sen_k_ni_02` | Bacanya "ni", sama seperti bunyi "ni" dalam bahasa Indonesia. ニ. | tenang |
| `sen_k_ni_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ni_04` | Dua garis, sama seperti angka 二 (dua = "ni")! | lucu |
| `sen_k_ni_05` | Pasangan hiragananya adalah に. Bunyinya sama persis: ニ, に. | tenang |
| `sen_k_ni_07` | Contoh katanya: アニメ. Artinya "anime". アニメ. | ceria |
| `sen_k_nu_01` | Sekarang, perhatikan huruf ini: ヌ. | semangat |
| `sen_k_nu_02` | Bacanya "nu", sama seperti bunyi "nu" dalam bahasa Indonesia. ヌ. | tenang |
| `sen_k_nu_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_nu_04` | Seperti sumpit yang menjepit mi (noodle): "NU". | lucu |
| `sen_k_nu_05` | Pasangan hiragananya adalah ぬ. Bunyinya sama persis: ヌ, ぬ. | tenang |
| `sen_k_nu_06` | Hati-hati, jangan tertukar dengan ス. Yang kiri ヌ, dibaca "nu". Yang kanan ス, dibaca "su". | serius-lembut |
| `sen_k_ne_01` | Nah, yang ini juga penting: ネ. | semangat |
| `sen_k_ne_02` | Bacanya "ne". Huruf e-nya seperti pada kata "enak", bukan "emas". ネ. | tenang |
| `sen_k_ne_03` | Ada 4 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ne_04` | Seperti nenek berdiri dengan tongkat: "NE". | lucu |
| `sen_k_ne_05` | Pasangan hiragananya adalah ね. Bunyinya sama persis: ネ, ね. | tenang |
| `sen_k_no_01` | Terakhir untuk hari ini: ノ. | semangat |
| `sen_k_no_02` | Bacanya "no", sama seperti bunyi "no" dalam bahasa Indonesia. ノ. | tenang |
| `sen_k_no_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_k_no_04` | Satu goresan miring, seperti menulis "NO" terburu-buru. | lucu |
| `sen_k_no_05` | Pasangan hiragananya adalah の. Bunyinya sama persis: ノ, の. | tenang |
| `sen_k_no_06` | Hati-hati, jangan tertukar dengan ソ. Yang kiri ノ, dibaca "no". Yang kanan ソ, dibaca "so". | serius-lembut |
| `sen_k_no_07` | Contoh katanya: ノート. Artinya "buku tulis". ノート. | ceria |
| `sen_d17_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

#### Hari 18 — ハ ヒ フ ヘ ホ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d18_intro` | Pagi yang cerah untuk belajar! Hari ini: ハ、ヒ、フ、ヘ、ホ. Kita mulai, ya. | ceria |
| `sen_k_ha_01` | Huruf pertama kita hari ini: ハ. | semangat |
| `sen_k_ha_02` | Bacanya "ha". Tapi kalau jadi partikel, dibaca "wa". Nanti kita pelajari. ハ. | tenang |
| `sen_k_ha_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ha_04` | Dua garis seperti atap terbuka, orang tertawa "HAha": "HA". | lucu |
| `sen_k_ha_05` | Pasangan hiragananya adalah は. Bunyinya sama persis: ハ, は. | tenang |
| `sen_k_ha_07` | Contoh katanya: ハム. Artinya "daging ham". ハム. | ceria |
| `sen_k_hi_01` | Oke, lanjut ke huruf ini: ヒ. | semangat |
| `sen_k_hi_02` | Bacanya "hi", sama seperti bunyi "hi" dalam bahasa Indonesia. ヒ. | tenang |
| `sen_k_hi_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_hi_04` | Seperti orang duduk bersandar sambil terkekeh "HIhi". | lucu |
| `sen_k_hi_05` | Pasangan hiragananya adalah ひ. Bunyinya sama persis: ヒ, ひ. | tenang |
| `sen_k_hi_07` | Contoh katanya: ヒーロー. Artinya "pahlawan". ヒーロー. | ceria |
| `sen_k_fu_01` | Sekarang, perhatikan huruf ini: フ. | semangat |
| `sen_k_fu_02` | Bacanya "fu", tapi bibir tidak menyentuh gigi. Seperti meniup lilin pelan: fu. フ. | tenang |
| `sen_k_fu_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_k_fu_04` | Seperti bendera kecil yang tertiup angin "FUuu". | lucu |
| `sen_k_fu_05` | Pasangan hiragananya adalah ふ. Bunyinya sama persis: フ, ふ. | tenang |
| `sen_k_fu_07` | Contoh katanya: ナイフ. Artinya "pisau". ナイフ. | ceria |
| `sen_k_he_01` | Nah, yang ini juga penting: ヘ. | semangat |
| `sen_k_he_02` | Bacanya "he". Kalau jadi partikel arah, dibaca "e". ヘ. | tenang |
| `sen_k_he_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_k_he_04` | Sama persis dengan へ hiragana: "HE". | lucu |
| `sen_k_he_05` | Pasangan hiragananya adalah へ. Bunyinya sama persis: ヘ, へ. | tenang |
| `sen_k_he_06` | Hati-hati, jangan tertukar dengan へ. Yang kiri ヘ, dibaca "he". Yang kanan へ, dibaca "he". | serius-lembut |
| `sen_k_ho_01` | Terakhir untuk hari ini: ホ. | semangat |
| `sen_k_ho_02` | Bacanya "ho", sama seperti bunyi "ho" dalam bahasa Indonesia. ホ. | tenang |
| `sen_k_ho_03` | Ada 4 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ho_04` | Seperti salib dengan dua kaki kecil, mirip ほ: "HO". | lucu |
| `sen_k_ho_05` | Pasangan hiragananya adalah ほ. Bunyinya sama persis: ホ, ほ. | tenang |
| `sen_k_ho_07` | Contoh katanya: ホテル. Artinya "hotel". ホテル. | ceria |
| `sen_d18_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 19 — マ ミ ム メ モ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d19_intro` | Halo lagi! Hari ini kita belajar huruf: マ、ミ、ム、メ、モ. Siap? | ceria |
| `sen_k_ma_01` | Huruf pertama kita hari ini: マ. | semangat |
| `sen_k_ma_02` | Bacanya "ma", sama seperti bunyi "ma" dalam bahasa Indonesia. マ. | tenang |
| `sen_k_ma_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ma_04` | Seperti kepala maskot dengan dagu runcing: "MA". | lucu |
| `sen_k_ma_05` | Pasangan hiragananya adalah ま. Bunyinya sama persis: マ, ま. | tenang |
| `sen_k_ma_06` | Hati-hati, jangan tertukar dengan ア. Yang kiri マ, dibaca "ma". Yang kanan ア, dibaca "a". | serius-lembut |
| `sen_k_ma_07` | Contoh katanya: マスク. Artinya "masker". マスク. | ceria |
| `sen_k_mi_01` | Oke, lanjut ke huruf ini: ミ. | semangat |
| `sen_k_mi_02` | Bacanya "mi", sama seperti bunyi "mi" dalam bahasa Indonesia. ミ. | tenang |
| `sen_k_mi_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_mi_04` | Tiga garis miring, seperti angka 3 (mittsu): "MI". | lucu |
| `sen_k_mi_05` | Pasangan hiragananya adalah み. Bunyinya sama persis: ミ, み. | tenang |
| `sen_k_mi_07` | Contoh katanya: ミルク. Artinya "susu". ミルク. | ceria |
| `sen_k_mu_01` | Sekarang, perhatikan huruf ini: ム. | semangat |
| `sen_k_mu_02` | Bacanya "mu", sama seperti bunyi "mu" dalam bahasa Indonesia. ム. | tenang |
| `sen_k_mu_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_mu_04` | Seperti lengan berotot (muscle): "MU". | lucu |
| `sen_k_mu_05` | Pasangan hiragananya adalah む. Bunyinya sama persis: ム, む. | tenang |
| `sen_k_me_01` | Nah, yang ini juga penting: メ. | semangat |
| `sen_k_me_02` | Bacanya "me". Huruf e-nya seperti pada kata "enak", bukan "emas". メ. | tenang |
| `sen_k_me_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_me_04` | Seperti tanda silang ✕, tutup mata (me): "ME". | lucu |
| `sen_k_me_05` | Pasangan hiragananya adalah め. Bunyinya sama persis: メ, め. | tenang |
| `sen_k_me_07` | Contoh katanya: メロン. Artinya "melon". メロン. | ceria |
| `sen_k_mo_01` | Terakhir untuk hari ini: モ. | semangat |
| `sen_k_mo_02` | Bacanya "mo", sama seperti bunyi "mo" dalam bahasa Indonesia. モ. | tenang |
| `sen_k_mo_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_mo_04` | Mirip も hiragana tanpa lengkungan: "MO". | lucu |
| `sen_k_mo_05` | Pasangan hiragananya adalah も. Bunyinya sama persis: モ, も. | tenang |
| `sen_k_mo_07` | Contoh katanya: メモ. Artinya "catatan". メモ. | ceria |
| `sen_d19_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

#### Hari 20 — ヤ ユ ヨ ラ リ ル レ ロ

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d20_intro` | Selamat datang kembali! Hari ini giliran huruf: ヤ、ユ、ヨ、ラ、リ、ル、レ、ロ. Yuk! | ceria |
| `sen_k_ya_01` | Huruf pertama kita hari ini: ヤ. | semangat |
| `sen_k_ya_02` | Bacanya "ya", sama seperti bunyi "ya" dalam bahasa Indonesia. ヤ. | tenang |
| `sen_k_ya_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ya_04` | Mirip や hiragana: "YA". | lucu |
| `sen_k_ya_05` | Pasangan hiragananya adalah や. Bunyinya sama persis: ヤ, や. | tenang |
| `sen_k_yu_01` | Oke, lanjut ke huruf ini: ユ. | semangat |
| `sen_k_yu_02` | Bacanya "yu", sama seperti bunyi "yu" dalam bahasa Indonesia. ユ. | tenang |
| `sen_k_yu_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_yu_04` | Seperti kursi atau gagang pintu: "YU". | lucu |
| `sen_k_yu_05` | Pasangan hiragananya adalah ゆ. Bunyinya sama persis: ユ, ゆ. | tenang |
| `sen_k_yu_06` | Hati-hati, jangan tertukar dengan コ. Yang kiri ユ, dibaca "yu". Yang kanan コ, dibaca "ko". | serius-lembut |
| `sen_k_yo_01` | Sekarang, perhatikan huruf ini: ヨ. | semangat |
| `sen_k_yo_02` | Bacanya "yo", sama seperti bunyi "yo" dalam bahasa Indonesia. ヨ. | tenang |
| `sen_k_yo_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_yo_04` | Seperti huruf E yang dibalik: "YO". | lucu |
| `sen_k_yo_05` | Pasangan hiragananya adalah よ. Bunyinya sama persis: ヨ, よ. | tenang |
| `sen_k_yo_07` | Contoh katanya: ヨーヨー. Artinya "yoyo". ヨーヨー. | ceria |
| `sen_k_ra_01` | Nah, yang ini juga penting: ラ. | semangat |
| `sen_k_ra_02` | Bunyi R Jepang ada di antara R dan L. Lidah cukup mengetuk sekali: ra. ラ. | tenang |
| `sen_k_ra_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ra_04` | Garis pendek di atas + フ: "RA". | lucu |
| `sen_k_ra_05` | Pasangan hiragananya adalah ら. Bunyinya sama persis: ラ, ら. | tenang |
| `sen_k_ra_07` | Contoh katanya: コーラ. Artinya "cola". コーラ. | ceria |
| `sen_k_ri_01` | Berikutnya, huruf ini: リ. | semangat |
| `sen_k_ri_02` | Lidah mengetuk sekali, antara R dan L: ri. リ. | tenang |
| `sen_k_ri_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ri_04` | Mirip り hiragana versi lurus: "RI". | lucu |
| `sen_k_ri_05` | Pasangan hiragananya adalah り. Bunyinya sama persis: リ, り. | tenang |
| `sen_k_ri_07` | Contoh katanya: アメリカ. Artinya "Amerika". アメリカ. | ceria |
| `sen_k_ru_01` | Oke, lanjut ke huruf ini: ル. | semangat |
| `sen_k_ru_02` | Lidah mengetuk sekali: ru. ル. | tenang |
| `sen_k_ru_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ru_04` | Seperti dua kaki, satu menendang ke kanan: "RU". | lucu |
| `sen_k_ru_05` | Pasangan hiragananya adalah る. Bunyinya sama persis: ル, る. | tenang |
| `sen_k_re_01` | Sekarang, perhatikan huruf ini: レ. | semangat |
| `sen_k_re_02` | Lidah mengetuk sekali: re. レ. | tenang |
| `sen_k_re_03` | Cara menulisnya cuma satu goresan. Perhatikan arahnya, ya. | tenang |
| `sen_k_re_04` | Seperti huruf "L" yang miring: "RE". | lucu |
| `sen_k_re_05` | Pasangan hiragananya adalah れ. Bunyinya sama persis: レ, れ. | tenang |
| `sen_k_re_07` | Contoh katanya: カレー. Artinya "kari". カレー. | ceria |
| `sen_k_ro_01` | Terakhir untuk hari ini: ロ. | semangat |
| `sen_k_ro_02` | Lidah mengetuk sekali: ro. ロ. | tenang |
| `sen_k_ro_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_ro_04` | Kotak seperti mulut. Jangan tertukar dengan ろ hiragana: "RO". | lucu |
| `sen_k_ro_05` | Pasangan hiragananya adalah ろ. Bunyinya sama persis: ロ, ろ. | tenang |
| `sen_k_ro_06` | Hati-hati, jangan tertukar dengan ろ. Yang kiri ロ, dibaca "ro". Yang kanan ろ, dibaca "ro". | serius-lembut |
| `sen_d20_outro` | Bagus sekali! Ayo praktik menulis. Sensei tunggu hasilmu, ya. | bangga |

#### Hari 21 — ワ ヲ ン

| ID | Teks narasi sensei | Emosi |
|---|---|---|
| `sen_d21_intro` | Pagi yang cerah untuk belajar! Hari ini: ワ、ヲ、ン. Kita mulai, ya. | ceria |
| `sen_k_wa_01` | Huruf pertama kita hari ini: ワ. | semangat |
| `sen_k_wa_02` | Bacanya "wa", sama seperti bunyi "wa" dalam bahasa Indonesia. ワ. | tenang |
| `sen_k_wa_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_wa_04` | Seperti ウ tanpa titik di atas: "WA". | lucu |
| `sen_k_wa_05` | Pasangan hiragananya adalah わ. Bunyinya sama persis: ワ, わ. | tenang |
| `sen_k_wa_06` | Hati-hati, jangan tertukar dengan ウ. Yang kiri ワ, dibaca "wa". Yang kanan ウ, dibaca "u". | serius-lembut |
| `sen_k_wa_07` | Contoh katanya: ワクワク. Artinya "Berdebar senang". ワクワク. | ceria |
| `sen_k_wo_01` | Oke, lanjut ke huruf ini: ヲ. | semangat |
| `sen_k_wo_02` | Walaupun ditulis "wo", bacanya "o". Huruf ini hampir hanya dipakai sebagai partikel. ヲ. | tenang |
| `sen_k_wo_03` | Ada 3 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_wo_04` | Seperti ワ dengan garis tambahan. Jarang sekali dipakai: "WO". | lucu |
| `sen_k_wo_05` | Pasangan hiragananya adalah を. Bunyinya sama persis: ヲ, を. | tenang |
| `sen_k_n_01` | Terakhir untuk hari ini: ン. | semangat |
| `sen_k_n_02` | Bacanya "n" saja, tanpa huruf hidup. Satu ketukan penuh, lho. ン. | tenang |
| `sen_k_n_03` | Ada 2 goresan. Perhatikan urutannya baik-baik. | tenang |
| `sen_k_n_04` | Dua goresan, yang panjang NAIK dari bawah: "N". Beda dengan ソ! | lucu |
| `sen_k_n_05` | Pasangan hiragananya adalah ん. Bunyinya sama persis: ン, ん. | tenang |
| `sen_k_n_06` | Hati-hati, jangan tertukar dengan ソ. Yang kiri ン, dibaca "n". Yang kanan ソ, dibaca "so". | serius-lembut |
| `sen_k_n_07` | Contoh katanya: ハンカチ. Artinya "saputangan". ハンカチ. | ceria |
| `sen_d21_outro` | Hebat! Sekarang giliranmu menulis. Salah itu biasa, yang penting mencoba. | bangga |

## E. Templat naskah Bab 3–6 (ditulis bersamaan dengan pembuatan bab)

### E.1 Dakuten (Bab 3) — contoh baris が
| ID | Teks | Emosi |
|---|---|---|
| `sen_dk_intro` | Hari ini ada yang baru: dua titik kecil ini, namanya てんてん. Titik kecil, tapi pengaruhnya besar! | ceria |
| `sen_dk_rule` | Kalau か diberi てんてん, bunyinya jadi lebih berat: か menjadi が. K menjadi G. | tenang |
| `sen_h_ga_01` | Huruf pertama: が. Bacanya "ga". が. | semangat |
| `sen_h_ga_02` | Cara menulisnya sama dengan か, lalu tambahkan dua titik di kanan atas. | tenang |
| `sen_h_ga_07` | Contoh katanya: めがね. Artinya kacamata. Seperti kacamata sensei. めがね. | lucu |
| `sen_hd_rule` | Nah, baris は istimewa. Dengan てんてん jadi ば, dengan lingkaran kecil まる jadi ぱ. Tiga bunyi dari satu huruf! | ceria |

### E.2 Angka & harga (Bab 3) — contoh
| ID | Teks | Emosi |
|---|---|---|
| `sen_num_intro` | Hari ini kita berhitung dalam bahasa Jepang. Siapkan jarimu! | ceria |
| `sen_num_1_10` | いち、に、さん、し、ご、ろく、しち、はち、きゅう、じゅう. Ulangi bersama sensei, ya. | semangat |
| `sen_num_4_9` | Angka empat dan sembilan punya dua bacaan. Empat: し atau よん. Sembilan: きゅう atau く. | tenang |
| `sen_kanji_first` | Selamat! Ini kanji pertamamu: 一. Satu garis, artinya satu. Gampang, kan? | bangga |
| `sen_price` | Di toko, tanyakan harga dengan: いくら ですか. Berapa harganya? | ceria |
| `sen_hyaku` | Hati-hati, tiga ratus jadi さんびゃく, enam ratus ろっぴゃく, delapan ratus はっぴゃく. Bunyinya berubah. | serius-lembut |

### E.3 Yōon & っ (Bab 4) — contoh
| ID | Teks | Emosi |
|---|---|---|
| `sen_yo_intro` | Lihat huruf kecil ini: ゃ、ゅ、ょ. Kalau menempel pada huruf lain, dua huruf dibaca jadi satu bunyi. | ceria |
| `sen_yo_kya` | き tambah ゃ kecil jadi きゃ. Bukan "ki-ya", tapi "kya", satu ketukan. きゃ. | tenang |
| `sen_tsu_small` | Ini つ kecil. Tidak dibaca "tsu", tapi jeda sebentar, seperti menahan napas. がっこう. Gak-kou. | tenang |
| `sen_long` | Garis panjang ini artinya bunyi diperpanjang. コーヒー. Koo-hii. | ceria |

### E.4 Kanji (Bab 5–6) — pola per kanji
| ID | Pola teks | Emosi |
|---|---|---|
| `sen_kj_<kanji>_01` | Kanji hari ini: {kanji}. Artinya "{arti}". | semangat |
| `sen_kj_<kanji>_02` | Bacaannya ada dua. Kalau sendiri, biasanya dibaca {kun}. Dalam kata gabungan, sering dibaca {on}. | tenang |
| `sen_kj_<kanji>_03` | {cerita gambar kanji, mis. "山 seperti tiga puncak gunung."} | lucu |
| `sen_kj_<kanji>_04` | Contohnya: {kata1}, artinya {arti1}. Dan {kata2}, artinya {arti2}. | ceria |
| `sen_kj_<kanji>_05` | Ada {n} goresan. Ikuti urutannya, ya. | tenang |

Perkiraan: Bab 3 ±140 klip · Bab 4 ±160 klip · Bab 5 ±200 klip · Bab 6 ±360 klip.

## F. Klip cerita (bukan sensei) — daftar prioritas
| Kelompok | Pengisi suara | Jumlah kira-kira |
|---|---|---|
| Surat #1–#9 (dibacakan Dewi muda) | Perempuan remaja, bahasa Jepang **sedikit beraksen asing** tapi jelas | 9 surat × ±7 kalimat |
| Surat #10–#11 (Dewi muda, lebih lancar) | Sama | 2 × ±12 |
| Surat #12 (Sato muda) | Perempuan remaja Jepang, lembut | ±18 |
| Buku bergambar 11 halaman | Sato muda & Dewi muda bergantian | ±40 |
| Adegan klimaks Bab 6 (mercusuar, kotatsu, telepon) | Kakek Mori, Nenek Sato, Eyang Dewi | ±60 |
| Prolog | Nenek Sato, pengumuman stasiun | ±25 |
