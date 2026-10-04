/* =========================================================
   ADEGAN HARIAN · setiap hari berbeda
   - Tugas yang sudah pernah muncul di hari sebelumnya DIHAPUS dari hari
     berikutnya (tidak ada lagi cuci tangan / conveyor yang itu-itu saja).
   - Setiap hari mendapat PERCAKAPAN sendiri (talk, meter perasaan) dan
     AKSI sendiri (act / variasi tugas fisik dengan isi baru), plus
     kosakata harian tambahan.
   Jadi hari = satu adegan utuh: cerita + percakapan + aksi.
   ========================================================= */
(() => {
  const D = Kerja.DAYS, V = (...r) => r;
  // Percakapan: turns = [[jp, arti, [[jawaban, ±perasaan, penjelasan], …]], …]
  const TL = (at, k, face, title, hint, turns, why, x = {}) => ({ t: 'talk', at, k, face, title, hint, why, turns: turns.map(([jp, id, opts]) => ({ jp, id, opts: opts.map(([j, d, fb]) => ({ jp: j, d, fb })) })), ...x });
  // Aksi alat + gerakan: steps = [[emoji, alat, perintah, arti, gerakan, hasil], …]
  const AC = (at, title, target, label, steps, extras, why) => ({ t: 'act', at, title, target, targetLabel: label, steps: steps.map(([e, n, jp, id, how, after]) => ({ tool: [e, n], jp, id, how, after })), extras, why });
  const SC = {};

  /* =========================================================
     🍙 PABRIK MAKANAN
     ========================================================= */
  SC.food = {
    1: { add: [TL('board', 'boss', '👨‍🍳', 'じこしょうかい · Perkenalan di apel pagi', 'Pak Hancho memintamu memperkenalkan diri di depan semua pekerja.', [
        ['じゃあ、みんな に じこしょうかい して。', 'Silakan perkenalkan diri ke semua.', [['インドネシア から きました ○○ です。いっしょうけんめい がんばります。よろしく おねがいします。', 30, 'Asal + nama + semangat + よろしく おねがいします. Singkat dan sopan.'], ['○○。よろしく。', -10, 'Terlalu singkat dan terdengar kurang sopan di depan atasan.'], ['（はずかしくて だまる）', -25, 'Malu itu wajar, tapi perkenalan adalah awal hubungan kerja.']]],
        ['わからない こと が あったら どう する？', 'Kalau ada yang tidak paham, kamu bagaimana?', [['すぐ きいて、メモ します。', 30, 'Bertanya + mencatat adalah sikap yang paling disukai di pabrik.'], ['じぶん で かんがえて やります。', -15, 'Menebak sendiri di pabrik makanan bisa menyebabkan produk cacat.'], ['わかった ふり を します。', -30, 'Pura-pura paham adalah sumber kesalahan terbesar.']]],
      ], 'Perkenalan: 「〜から きました。〜です。よろしく おねがいします。」 Kalau tidak paham, tanya & catat (メモ).')],
      vocab: V(['自己紹介', 'じこしょうかい', 'jiko shoukai', 'perkenalan diri'], ['朝礼', 'ちょうれい', 'chourei', 'apel pagi'], ['一生懸命', 'いっしょうけんめい', 'isshoukenmei', 'sungguh-sungguh']) },
    2: { add: [TL('line', 'w2', '👩', 'Senpai bilang "terlalu lambat"', 'Emma-san, senpai di lini, menegurmu karena ritmemu lambat.', [
        ['もうちょっと はやく できる？ ラインが とまっちゃう。', 'Bisa sedikit lebih cepat? Lininya jadi tertahan.', [['すみません。コツ を おしえて いただけますか？', 30, 'Minta maaf lalu minta tips. Senpai senang diminta mengajari.'], ['むり です。', -25, 'Menolak begitu saja merusak kerja tim.'], ['はやく する と あぶない です！', -5, 'Keselamatan memang penting, tapi sampaikan dengan sopan dan cari jalan tengah.']]],
        ['りょうて で もって、こう まわす の。', 'Pegang dengan dua tangan, putar begini.', [['なるほど！ やって みます。ありがとう ございます。', 30, 'Langsung coba dan berterima kasih.'], ['あ、そう。', -10, 'Terdengar tidak menghargai.'], ['（みない で つづける）', -25, 'Tidak memperhatikan contoh.']]],
      ], 'Kalau ditegur soal kecepatan: すみません + minta コツ (tips), lalu langsung praktik.'),
      AC('line', 'ほうそう · Bungkus onigiri dengan film', '🍙', 'onigiri di meja kemas', [['🧤', 'てぶくろ', 'あたらしい てぶくろ に かえて。', 'ganti sarung tangan baru', 'tap', '🧤 ✓'], ['🎞️', 'フィルム', 'フィルム で つつんで。', 'bungkus dengan film', 'swipe', '🎞️'], ['🌿', 'のり', 'のり を まいて。', 'gulung nori', 'swipe', '🍙'], ['🏷️', 'ラベル', 'ラベル を まっすぐ はって。', 'tempel label lurus', 'tap', '🏷️ ✓']], [['📱', 'スマホ'], ['🍬', 'あめ']], 'Urutan kemas: sarung tangan bersih → film → nori → label. Label miring/terlipat dianggap NG karena tanggal & alergen bisa tidak terbaca.')],
      vocab: V(['包装', 'ほうそう', 'housou', 'pengemasan'], ['コツ', 'コツ', 'kotsu', 'trik / tips'], ['遅い', 'おそい', 'osoi', 'lambat']) },
    3: { add: [TL('line', 'w2', '👩', 'Tanya arti label', 'Kamu bingung dengan dua tanggal di label.', [
        ['しょうひきげん と しょうみきげん、ちがい わかる？', 'Tahu bedanya 消費期限 dan 賞味期限?', [['すみません、まだ よく わかりません。おしえて ください。', 30, 'Jujur bilang belum paham.'], ['おなじ です よね？', -15, 'Keduanya berbeda; salah paham bisa berbahaya.'], ['だいたい わかります。', -10, '"Kira-kira paham" tidak cukup untuk label makanan.']]],
        ['しょうひきげん は「あんぜん に たべられる きげん」。おにぎり は こっち。', '消費期限 = batas aman dimakan. Onigiri pakai ini.', [['わかりました。おにぎり は しょうひきげん ですね。メモ します。', 30, 'Ulangi (復唱) lalu catat.'], ['へえ。', -10, 'Tidak menunjukkan bahwa kamu paham.'], ['どっち でも いい です。', -30, 'Salah label bisa membuat produk ditarik dari toko.']]],
      ], '消費期限 = batas aman (makanan cepat basi: onigiri, bento). 賞味期限 = batas rasa terbaik (makanan awet).')],
      vocab: V(['消費期限', 'しょうひきげん', 'shouhi kigen', 'batas aman konsumsi'], ['賞味期限', 'しょうみきげん', 'shoumi kigen', 'batas rasa terbaik'], ['違い', 'ちがい', 'chigai', 'perbedaan']) },
    4: { add: [TL('board', 'boss', '👨‍🍳', 'Lapor rambut di produk', 'Ada rambut di onigiri yang lolos dari posmu. Pak Hancho memanggilmu.', [
        ['この かみのけ、きみ の ポジション の あと で みつかった。', 'Rambut ini ditemukan setelah posmu.', [['もうしわけ ありません。ぼうし から でて いた かも しれません。', 30, 'Akui kemungkinan penyebabnya dengan jujur.'], ['わたし じゃ ない と おもいます。', -25, 'Membantah sebelum dicek membuat masalah tidak selesai.'], ['かみのけ ぐらい だいじょうぶ です。', -30, 'Rambut = 異物混入, bisa menyebabkan produk ditarik.']]],
        ['じゃあ、どう したら ふせげる？', 'Lalu, bagaimana mencegahnya?', [['ぼうし を ふかく かぶって、ローラー を ていねい に かけます。', 30, 'Sebutkan tindakan pencegahan yang konkret.'], ['きを つけます。', 0, 'Kurang konkret. Sebutkan apa yang akan diubah.'], ['わかりません。', -20, 'Coba pikirkan penyebabnya dulu.']]],
      ], 'Saat ada kesalahan: akui, sebutkan penyebab yang mungkin, lalu tindakan pencegahan yang konkret (再発防止).')],
      vocab: V(['髪の毛', 'かみのけ', 'kaminoke', 'rambut'], ['防ぐ', 'ふせぐ', 'fusegu', 'mencegah'], ['再発防止', 'さいはつぼうし', 'saihatsu boushi', 'mencegah terulang']) },
    5: { add: [TL('board', 'boss', '👨‍🍳', 'Diminta lembur', 'Pesanan naik. Pak Hancho bertanya apakah kamu bisa lembur 2 jam.', [
        ['きょう、2じかん ざんぎょう できる？', 'Hari ini bisa lembur 2 jam?', [['はい、だいじょうぶ です。なんじ まで ですか？', 30, 'Setuju sambil memastikan jam selesai.'], ['すみません、きょう は にほんご の じゅぎょう が あって…あした なら できます。', 20, 'Menolak boleh, asal sopan, beri alasan dan alternatif.'], ['いやです。', -30, 'Penolakan tanpa alasan terdengar kasar.']]],
        ['ざんぎょうだい は きゅうりょう に はいる から ね。', 'Uang lembur masuk ke gaji, ya.', [['わかりました。きゅうよめいさい で かくにん します。', 30, 'Cek slip gaji: lembur harus dibayar (25% ke atas).'], ['おかね は いりません。', -20, 'Lembur wajib dibayar menurut hukum Jepang.'], ['（なにも いわない）', -5, 'Lebih baik tunjukkan bahwa kamu paham.']]],
      ], 'Lembur (残業) boleh ditolak dengan sopan + alasan. Upah lembur wajib dibayar minimal 25% lebih tinggi; cek di slip gaji.'),
      { t: 'belt', at: 'line', title: 'Lini sandwich: target naik 20%', count: 14, items: [
        { e: '🥪', d: 'Sandwich rapi, isi tidak keluar', ok: true }, { e: '🥪', d: 'Label & tanggal jelas', ok: true }, { e: '🥪', d: 'Kemasan tertutup rapat', ok: true },
        { e: '🥪', b: '🥬', d: 'Selada keluar dari kemasan', ok: false, why: 'ほうそう ふりょう (kemasan gagal)' }, { e: '🥪', b: '🏷️', d: 'Label alergen tidak ada', ok: false, why: 'アレルゲン ひょうじ なし: berbahaya bagi penderita alergi' }, { e: '🥪', b: '🪰', d: 'Ada serangga kecil', ok: false, why: 'むし = いぶつ → lapor segera' }] }],
      vocab: V(['残業', 'ざんぎょう', 'zangyou', 'lembur'], ['給与明細', 'きゅうよめいさい', 'kyuuyo meisai', 'slip gaji'], ['残業代', 'ざんぎょうだい', 'zangyoudai', 'upah lembur']) },
    6: { add: [TL('fryer', 'w1', '🧑‍🍳', 'Rekan tersiram minyak panas', 'Tenin-san terkena cipratan minyak di tangan.', [
        ['あつっ！ あぶら が はねた！', 'Panas! Minyaknya memercik!', [['すぐ みず で ひやしましょう！ 15ふん いじょう！', 30, 'Luka bakar: dinginkan dengan air mengalir 15–20 menit.'], ['バター を ぬりましょう。', -25, 'Mitos. Mentega/minyak memperparah luka bakar.'], ['だいじょうぶ？ しごと を つづけよう。', -20, 'Luka bakar harus ditangani dulu.']]],
        ['…ありがとう。はんちょう に いわなきゃ。', 'Terima kasih… harus bilang ke Hancho.', [['わたし が ほうこく して きます。ここ で ひやして いて ください。', 30, 'Bagi tugas: korban tetap mendinginkan, kamu yang melapor.'], ['あとで いいよ。', -20, 'Kecelakaan kerja (労災) harus dilaporkan hari itu juga.'], ['ないしょ に しましょう。', -30, 'Menyembunyikan kecelakaan dilarang.']]],
      ], 'Luka bakar: air mengalir 15 menit+, jangan pakai mentega/pasta gigi, lapor ke atasan. Kecelakaan kerja ditanggung asuransi 労災.')],
      vocab: V(['火傷', 'やけど', 'yakedo', 'luka bakar'], ['跳ねる', 'はねる', 'haneru', 'memercik'], ['労災', 'ろうさい', 'rousai', 'kecelakaan kerja (asuransi)']) },
    7: { add: [TL('board', 'boss', '👨‍🍳', 'Badan tidak enak di hari panas', 'Kepalamu pusing dan mual di ruang produksi yang panas.', [
        ['どうした？ かお が あかい よ。', 'Kenapa? Mukamu merah.', [['すみません、あたま が いたくて、きもち が わるい です。', 30, 'Sampaikan gejala dengan jelas: 頭が痛い, 気持ちが悪い.'], ['だいじょうぶ です！', -25, 'Memaksakan diri saat pusing berbahaya (熱中症).'], ['（だまって つづける）', -30, 'Diam bisa berakibat pingsan di lini.']]],
        ['きゅうけいしつ で やすんで。みず のめる？', 'Istirahat di ruang istirahat. Bisa minum?', [['はい、のめます。ありがとう ございます。', 30, 'Bisa minum sendiri = istirahat & minum elektrolit. Kalau tidak bisa minum, harus ke dokter.'], ['いえ、ライン に もどります。', -25, 'Kembali terlalu cepat bisa membuat kondisi memburuk.'], ['トイレ で やすみます。', -10, 'Istirahatlah di tempat sejuk yang diketahui atasan.']]],
      ], 'Gejala panas: pusing, mual, kram. Bilang 「気持ちが悪いです」 ke atasan, istirahat di tempat sejuk, minum.'),
      AC('locker', 'すいぶん ほきゅう · Minum sesuai aturan pabrik', '🥤', 'ruang istirahat', [['🧤', 'てぶくろ', 'てぶくろ と ぼうし を はずして から。', 'lepas sarung tangan & topi dulu', 'tap', '🧤 ✓'], ['🧼', 'てあらい', 'て を あらって。', 'cuci tangan', 'swipe', '✨'], ['🥤', 'すいとう', 'きゅうけいしつ で のんで。', 'minum di ruang istirahat (bukan di lini)', 'taps:3', '💧'], ['🌀', 'ローラー', 'もどる まえ に ローラー。', 'rol perekat sebelum kembali', 'swipe', '🌀 ✓']], [['🍙', 'しょうひん'], ['🥤', 'ライン で のむ']], 'Di pabrik makanan, minum/makan hanya di ruang istirahat. Saat kembali ke lini: cuci tangan & rol perekat lagi.')],
      vocab: V(['気持ちが悪い', 'きもちがわるい', 'kimochi ga warui', 'mual / tidak enak badan'], ['水分補給', 'すいぶんほきゅう', 'suibun hokyuu', 'minum cairan'], ['頭痛', 'ずつう', 'zutsuu', 'sakit kepala']) },
    8: { add: [TL('board', 'boss', '👨‍🍳', 'Pesanan berubah mendadak', 'Supermarket menambah pesanan. Pak Hancho memberi instruksi cepat.', [
        ['10じ から おべんとう 300こ、えび ぬき 50こ。いい？', 'Mulai jam 10: 300 bento, 50 tanpa udang. Oke?', [['10じ から 300こ、その うち えび ぬき が 50こ ですね。', 30, '復唱 (mengulang): angka & pengecualian alergen.'], ['はい！', 0, 'Hanya "ya" tanpa mengulang angka berisiko salah.'], ['えび は いれます か？', -10, 'Dengarkan sampai selesai; "えび ぬき" = tanpa udang.']]],
        ['えび ぬき は べつ の ライン で つくる。なぜ だ？', 'Yang tanpa udang dibuat di lini lain. Kenapa?', [['アレルギー の ひと の ため に、まざらない ように です。', 30, 'Kontaminasi silang alergen (コンタミ) harus dicegah.'], ['はやい から です。', -15, 'Alasannya keselamatan, bukan kecepatan.'], ['わかりません。', -5, 'Tanyakan, lalu ingat: alergen dipisah.']]],
      ], 'Instruksi angka selalu diulang (復唱). Produk tanpa alergen dibuat terpisah supaya tidak tercampur (コンタミ防止).'),
      { t: 'bins', at: 'line', title: 'アレルゲン · Pilah bento sesuai label', hint: 'Baca label, lalu masukkan ke rak yang tepat.', bins: [['ebi', '🦐', 'えび あり', 'mengandung udang'], ['nuki', '🚫', 'えび ぬき', 'tanpa udang'], ['ng', '❌', 'ラベル NG', 'label rusak / salah']],
        items: [['🍱', 'からあげ べんとう（えび なし）', 'bento karaage', 'nuki'], ['🍱', 'えびフライ べんとう', 'bento udang goreng', 'ebi'], ['🍱', 'ラベル が やぶれた べんとう', 'label sobek', 'ng', 'Label tidak terbaca = tidak boleh dikirim.'], ['🍱', 'てんぷら べんとう（えび いり）', 'tempura udang', 'ebi'], ['🍱', 'さけ べんとう（えび なし）', 'bento salmon', 'nuki'], ['🍱', 'えび ぬき なのに えび が みえる', 'tertulis tanpa udang tapi ada udang', 'ng', 'Bahaya besar bagi penderita alergi! Pisahkan & lapor.']], why: 'Label alergen yang salah bisa menyebabkan syok anafilaksis. Ragu sedikit pun → NG & lapor.' }],
      vocab: V(['復唱', 'ふくしょう', 'fukushou', 'mengulang instruksi'], ['抜き', 'ぬき', 'nuki', 'tanpa ~'], ['混ざる', 'まざる', 'mazaru', 'tercampur']) },
    9: { add: [TL('sink', 'w2', '👩', 'Lantai basah dekat wastafel', 'Emma-san berjalan cepat ke arah lantai yang basah.', [
        ['いそがなきゃ！', 'Harus cepat!', [['エマ さん、あぶない！ ゆか が ぬれて います！', 30, 'Peringatkan dengan nama + bahaya yang jelas.'], ['（みて いる だけ）', -30, 'Melihat bahaya dan diam = ikut bertanggung jawab.'], ['はしって！', -25, 'Berlari di lantai basah = terpeleset.']]],
        ['ありがとう！ どう しよう？', 'Makasih! Lalu bagaimana?', [['ふいて、ちゅうい の かんばん を おいて、はんちょう に ヒヤリハット を だします。', 30, 'Bersihkan, pasang papan peringatan, laporkan ヒヤリハット.'], ['そのまま で いい です。', -25, 'Orang berikutnya bisa terpeleset.'], ['あとで ふきます。', -10, 'Bahaya ditangani saat itu juga.']]],
      ], 'Lihat bahaya → peringatkan (〜さん、あぶない！) → amankan → laporkan ヒヤリハット.')],
      vocab: V(['濡れる', 'ぬれる', 'nureru', 'basah'], ['滑る', 'すべる', 'suberu', 'terpeleset'], ['看板', 'かんばん', 'kanban', 'papan tanda']) },
    10: { add: [TL('ima', 'boss', '👴', 'Tetangga mengeluh suara', 'Malam hari, tetangga apartemen mengetuk pintu karena kamarmu berisik.', [
        ['すみません、よる おそく まで うるさい んです けど…', 'Maaf, malam-malam berisik sekali…', [['ごめいわく を おかけ しました。きを つけます。', 30, 'Minta maaf atas gangguannya + janji memperbaiki.'], ['わたし じゃ ない です。', -20, 'Kalau memang kamarmu, akui saja.'], ['インドネシア では ふつう です。', -25, 'Aturan tempat tinggal Jepang harus diikuti.']]],
        ['22じ から は しずか に して ください ね。', 'Mulai jam 22 tolong tenang, ya.', [['はい、わかりました。おしえて くださって ありがとう ございます。', 30, 'Berterima kasih karena diberi tahu.'], ['はい はい。', -15, 'Terdengar malas.'], ['でも でんわ したい です。', -10, 'Telepon dengan suara pelan atau di luar kamar.']]],
      ], 'Hidup bertetangga di Jepang: tenang setelah jam 22, minta maaf dengan 「ご迷惑をおかけしました」.', { cast: [] })],
      vocab: V(['迷惑', 'めいわく', 'meiwaku', 'gangguan / merepotkan'], ['隣', 'となり', 'tonari', 'sebelah'], ['静か', 'しずか', 'shizuka', 'tenang']) },
    11: { add: [TL('sink', 'boss', '🕵️', 'Ditanya auditor HACCP', 'Auditor dari pelanggan bertanya langsung kepadamu.', [
        ['てあらい の てじゅん を おしえて ください。', 'Tolong jelaskan prosedur cuci tangan.', [['みず で ぬらして、せっけん で 30びょう、ゆび の あいだ と つめ も あらって、ながして、ふいて、アルコール です。', 30, 'Jawab urut dan konkret.'], ['ちゃんと あらって います。', -10, 'Auditor ingin tahu prosedurnya, bukan sekadar "sudah".'], ['わかりません。', -25, 'Prosedur dasar harus hafal.']]],
        ['きろく は どこ に ありますか？', 'Catatannya di mana?', [['もうしわけ ありません、ばしょ を はんちょう に かくにん します。', 25, 'Kalau tidak tahu: jangan menebak, tanyakan ke atasan.'], ['たぶん ロッカー です。', -20, 'Menebak di depan auditor berbahaya.'], ['ありません。', -30, 'Jawaban tidak benar merugikan pabrik.']]],
      ], 'Di depan auditor: jawab jujur dan urut. Yang tidak tahu: 「確認します」, jangan menebak.')],
      vocab: V(['監査', 'かんさ', 'kansa', 'audit'], ['手順', 'てじゅん', 'tejun', 'prosedur'], ['記録', 'きろく', 'kiroku', 'catatan']) },
    12: { add: [TL('line', 'boss', '👨‍🍳', 'Laporan mesin berhenti', 'Mesin pengisi nasi berhenti dengan bunyi aneh. Kamu melapor.', [
        ['どう した？', 'Ada apa?', [['ごはん の きかい が とまりました。とまる まえ に「ガガッ」と おと が しました。', 30, 'Laporan: apa yang terjadi + tanda sebelumnya.'], ['こわれました。', -5, 'Kurang detail untuk diperbaiki cepat.'], ['わかりません、しりません。', -25, 'Sampaikan yang kamu lihat & dengar.']]],
        ['なか に て を いれた？', 'Kamu masukkan tangan ke dalam?', [['いいえ。でんげん を きって、だれも さわらない ように して います。', 30, 'Mesin macet: matikan daya, jangan masukkan tangan (挟まれ事故).'], ['はい、つまった ごはん を とりました。', -30, 'Sangat berbahaya: mesin bisa menyala tiba-tiba.'], ['これから いれます。', -25, 'Jangan! Tunggu teknisi.']]],
      ], 'Mesin berhenti: tekan stop, matikan daya, jangan masukkan tangan, laporkan apa yang terlihat & terdengar.')],
      vocab: V(['機械', 'きかい', 'kikai', 'mesin'], ['電源', 'でんげん', 'dengen', 'sumber listrik'], ['挟まれる', 'はさまれる', 'hasamareru', 'terjepit']) },
    13: { add: [TL('locker', 'nguyen', '👦', 'Nguyen-san bertanya kenapa', 'Nguyen-san bingung kenapa aturan pabrik begitu ketat.', [
        ['どうして ぼうし を ふかく かぶる んですか？', 'Kenapa topi harus dipakai dalam-dalam?', [['かみのけ が しょうひん に はいらない ため です。', 30, 'Ajarkan alasan, bukan hanya aturan.'], ['きまり だから。', -10, 'Tanpa alasan, aturan mudah dilupakan.'], ['べつに いい よ。', -30, 'Senpai harus memberi contoh yang benar.']]],
        ['ローラー は どこ から かけますか？', 'Rol perekat dari mana?', [['うえ から した へ。うしろ は ふたり で かけあいます。', 30, 'Atas ke bawah, bagian punggung saling bantu.'], ['てきとう で いい よ。', -25, 'Asal-asalan = rambut lolos.'], ['しらない。', -20, 'Kalau lupa, cek papan prosedur bersama.']]],
      ], 'Mengajar: beri alasan (〜ため です), tunjukkan contoh, lalu biarkan mencoba.'),
      AC('air', 'Contohkan rol perekat ke Nguyen-san', '🧍', 'seragam Nguyen-san', [['🧢', 'ぼうし', 'ぼうし から みみ が でない ように。', 'telinga tertutup topi', 'tap', '🧢 ✓'], ['🌀', 'ローラー', 'かた から あし へ ローラー。', 'rol dari bahu ke kaki', 'swipe', '🌀'], ['🔄', 'うしろ', 'せなか は おたがい に。', 'punggung saling bantu', 'swipe', '🔄 ✓'], ['🪞', 'かがみ', 'かがみ で さいご の チェック。', 'cek akhir di cermin', 'hold', '🪞 ヨシ']], [['🧥', 'ジャケット']], 'Mengajar dengan memperagakan (見本). Cermin dipakai untuk pemeriksaan terakhir sebelum masuk ruang produksi.')],
      vocab: V(['見本', 'みほん', 'mihon', 'contoh'], ['背中', 'せなか', 'senaka', 'punggung'], ['お互いに', 'おたがいに', 'otagai ni', 'saling']) },
    14: { add: [TL('board', 'boss', '🧑‍⚖️', 'Ujian lisan', 'Penguji ujian keterampilan menanyaimu secara lisan.', [
        ['いぶつ を みつけたら、まず なに を しますか？', 'Kalau menemukan benda asing, apa yang pertama?', [['ラインを とめて、はんちょう に ほうこく します。', 30, 'Hentikan → lapor. Jangan dibuang diam-diam.'], ['すてます。', -25, 'Bukti hilang dan penyebab tidak bisa dicari.'], ['あとで いいます。', -20, 'Benda asing dilaporkan segera.']]],
        ['かねつ の ちゅうしんおんど の きじゅん は？', 'Standar suhu tengah pemanasan?', [['75ど で 1ぷん いじょう です。', 30, 'Standar umum: 75℃ selama 1 menit atau lebih.'], ['50ど です。', -20, 'Terlalu rendah, bakteri tidak mati.'], ['わかりません。', -10, 'Hafalkan: 75℃・1分以上.']]],
      ], 'Ujian: benda asing → stop & lapor. Pemanasan: suhu tengah 75℃ selama 1 menit+.'),
      { t: 'thermo', at: 'fryer', title: 'Ujian praktik: ukur suhu tengah ayam' }],
      vocab: V(['試験', 'しけん', 'shiken', 'ujian'], ['基準', 'きじゅん', 'kijun', 'standar'], ['中心温度', 'ちゅうしんおんど', 'chuushin ondo', 'suhu bagian tengah']) },
    15: { add: [TL('board', 'boss', '👨‍🍳', 'Pidato perpisahan di apel', 'Hari terakhir. Pak Hancho memintamu berpamitan di apel pagi.', [
        ['さいご に みんな に ひとこと。', 'Terakhir, sepatah kata untuk semua.', [['15にちかん、ありがとう ございました。ここ で まなんだ こと を わすれません。', 30, 'Terima kasih + apa yang dipelajari.'], ['つかれました。', -20, 'Kurang pantas untuk perpisahan.'], ['じゃあ、バイバイ。', -15, 'Terlalu santai untuk apel.']]],
        ['とくていぎのう で また きたい か？', 'Mau datang lagi lewat Tokutei Ginou?', [['はい！ しけん に ごうかく して、また ここ で はたらきたい です。', 30, 'Sampaikan tujuanmu dengan jelas.'], ['わかりません。', 0, 'Boleh ragu, tapi tunjukkan rasa terima kasih.'], ['もう いや です。', -30, 'Tidak sopan di hari terakhir.']]],
      ], 'Salam perpisahan: 「〜日間、ありがとうございました」 + pelajaran + harapan.'),
      { t: 'belt', at: 'line', title: 'Lini terakhir: bento spesial akhir tahun', count: 14, items: [
        { e: '🍱', d: 'Isi lengkap sesuai gambar contoh', ok: true }, { e: '🍱', d: 'Tutup rapat, label lurus', ok: true }, { e: '🍱', d: 'Lauk di tempat yang benar', ok: true },
        { e: '🍱', b: '🦐', d: 'Udang masuk ke bento “tanpa udang”', ok: false, why: 'コンタミ: alergen tercampur' }, { e: '🍱', b: '🥢', d: 'Sumpit tidak ada', ok: false, why: 'けっぴん (barang kurang)' }, { e: '🍱', b: '💥', d: 'Tutup retak', ok: false, why: 'ようき ふりょう (wadah rusak)' }] },
      AC('exit', 'ひきつぎ · Serah terima ke shift malam', '📋', 'papan serah terima', [['📝', 'メモ', 'きょう の せいさんすう を かいて。', 'tulis jumlah produksi hari ini', 'swipe', '📝 1,250こ'], ['⚠️', 'ちゅうい', 'きかい の ちょうし も つたえて。', 'sampaikan kondisi mesin', 'tap', '⚠️ ✓'], ['🗣️', 'くちで', 'くち でも つたえて、かくにん。', 'sampaikan juga secara lisan', 'hold', '🗣️ ✓']], [['🍙', 'おにぎり']], 'Serah terima (引き継ぎ): tulis + sampaikan lisan, termasuk masalah mesin, supaya shift berikutnya aman.')],
      vocab: V(['引き継ぎ', 'ひきつぎ', 'hikitsugi', 'serah terima'], ['生産数', 'せいさんすう', 'seisansuu', 'jumlah produksi'], ['特定技能', 'とくていぎのう', 'tokutei ginou', 'visa keterampilan khusus']) },
  };

  /* =========================================================
     🧓 KAIGO
     ========================================================= */
  const RES = (x, y) => [{ k: 'r', id: 'riyosha', x, y, dir: 'left' }];
  SC.kaigo = {
    1: { add: [TL('room', 'r', '👵', 'Nenek Kimura bertanya tentangmu', 'Nenek Kimura penasaran dengan pekerja baru.', [
        ['あなた、どこ から きた の？', 'Kamu datang dari mana?', [['インドネシア から きました。○○ と もうします。', 30, 'Perkenalan sopan (もうします).'], ['あっち。', -20, 'Terlalu singkat dan tidak sopan.'], ['（わらって だまる）', -10, 'Senyum itu baik, tapi jawablah.']]],
        ['とおい ところ から、えらい ねえ。さむく ない？', 'Dari jauh ya, hebat. Tidak kedinginan?', [['すこし さむい です。きむら さん は さむく ない ですか？', 30, 'Jawab lalu balik bertanya: menunjukkan perhatian.'], ['さむい！ いや です。', -15, 'Mengeluh ke penghuni kurang pantas.'], ['べつに。', -15, 'Percakapan berhenti.']]],
      ], 'Obrolan ringan (雑談) membangun kepercayaan. Jawab lalu balik bertanya tentang penghuni.')],
      vocab: V(['申します', 'もうします', 'moushimasu', 'nama saya (sopan)'], ['雑談', 'ざつだん', 'zatsudan', 'obrolan ringan'], ['寒い', 'さむい', 'samui', 'dingin']) },
    2: { vocab: V(['刻み食', 'きざみしょく', 'kizami shoku', 'makanan dicincang'], ['歯', 'は', 'ha', 'gigi']) },
    3: { vocab: V(['徘徊', 'はいかい', 'haikai', 'berkeliaran (demensia)'], ['受容', 'じゅよう', 'juyou', 'menerima perasaan']) },
    4: { add: [TL('wheel', 'r', '👴', 'Kakek Tanaka jadi takut', 'Setelah kursi roda bergeser kemarin, Kakek Tanaka takut dipindahkan olehmu.', [
        ['きのう は こわかった。あんた に たのみたく ない。', 'Kemarin menakutkan. Aku tak mau minta tolong kamu.', [['きのう は こわい おもい を させて、もうしわけ ありません でした。', 30, 'Minta maaf secara tulus atas rasa takutnya.'], ['だいじょうぶ です よ、けが なかった でしょう。', -20, 'Meremehkan perasaan beliau.'], ['じゃあ ほか の ひと に たのんで。', -15, 'Menyerah tanpa memperbaiki hubungan.']]],
        ['…ほんとう に だいじょうぶ か？', '…Benar-benar aman?', [['はい。ブレーキ を いっしょ に かくにん しましょう。「ブレーキ、よし」。', 30, 'Libatkan beliau dalam pengecekan: rasa aman kembali.'], ['しんじて ください！', -5, 'Kepercayaan dibangun dengan tindakan, bukan kata.'], ['たぶん。', -25, 'Membuat beliau makin takut.']]],
      ], 'Setelah kesalahan: minta maaf atas rasa takut penghuni, lalu tunjukkan langkah aman bersama-sama.', { cast: RES(6, 4) })],
      vocab: V(['怖い', 'こわい', 'kowai', 'takut'], ['頼む', 'たのむ', 'tanomu', 'meminta tolong'], ['確認', 'かくにん', 'kakunin', 'pengecekan']) },
    5: { add: [TL('room', 'r', '👵', 'Nenek belum mau bangun', 'Jam 7 pagi. Nenek Kimura masih ingin tidur.', [
        ['まだ ねむい の… もう すこし ねかせて。', 'Masih ngantuk… biarkan tidur sebentar lagi.', [['そう ですか。じゃあ 15ふん したら また きます ね。', 30, 'Hormati ritme penghuni; tawarkan waktu kembali.'], ['だめ です、おきて ください！', -25, 'Memaksa membuat pagi jadi tidak menyenangkan.'], ['（カーテン を いきなり あける）', -20, 'Tanpa こえかけ dan tanpa izin.']]],
        ['…ありがとう。きょう は なに が ある の？', '…Makasih. Hari ini ada apa?', [['ごご は うた の レクリエーション が あります よ。', 30, 'Beri hal menyenangkan untuk ditunggu.'], ['なにも ない です。', -10, 'Percakapan jadi suram.'], ['はやく おきない と、ごはん が ない よ。', -25, 'Mengancam lansia tidak boleh.']]],
      ], 'Menolak bangun: hormati, tawarkan waktu, beri motivasi positif (予定を伝える).')],
      vocab: V(['起床', 'きしょう', 'kishou', 'bangun tidur'], ['眠い', 'ねむい', 'nemui', 'mengantuk'], ['予定', 'よてい', 'yotei', 'jadwal / rencana']) },
    6: { add: [TL('bath', 'r', '👵', 'Nenek malu dimandikan', 'Nenek Kimura ragu dimandikan oleh pekerja muda.', [
        ['はずかしい わ… わかい ひと に みられる の。', 'Malu… dilihat orang muda.', [['そう ですよね。タオル を かけながら、みえない ように します ね。', 30, 'Pahami rasa malu (羞恥心) dan jaga privasi dengan handuk.'], ['しごと だから きに しないで。', -15, 'Perasaan beliau tetap penting.'], ['はやく ぬいで ください。', -30, 'Merendahkan martabat.']]],
        ['じぶん で あらえる ところ は あらう わ。', 'Bagian yang bisa, kucuci sendiri.', [['はい、おねがい します。せなか だけ おてつだい します ね。', 30, 'Bantu hanya yang perlu (自立支援).'], ['わたし が ぜんぶ やります。', -15, 'Mengambil kemampuan penghuni.'], ['じかん が かかる から だめ。', -25, 'Kemandirian lebih penting dari kecepatan.']]],
      ], 'Mandi: hormati rasa malu (handuk, pintu tertutup), biarkan penghuni mencuci yang ia bisa.')],
      vocab: V(['恥ずかしい', 'はずかしい', 'hazukashii', 'malu'], ['羞恥心', 'しゅうちしん', 'shuuchishin', 'rasa malu'], ['背中', 'せなか', 'senaka', 'punggung']) },
    7: { add: [TL('dining', 'r', '👵', 'Lagu dari negaramu', 'Saat rekreasi, Nenek Kimura memintamu menyanyikan lagu Indonesia.', [
        ['あなた の くに の うた、うたって よ。', 'Nyanyikan lagu negaramu dong.', [['はい！「ブンガワン・ソロ」 という うた です。', 30, 'Tukar budaya membuat penghuni senang.'], ['はずかしい から いや です。', -10, 'Boleh malu, tapi coba ikut suasana.'], ['にほん の うた だけ に しましょう。', -15, 'Tawaran penghuni sebaiknya disambut.']]],
        ['きれい な うた ね。むかし ラジオ で きいた わ！', 'Lagu yang indah. Dulu pernah dengar di radio!', [['ほんとう ですか！ どんな じだい でした か？', 30, 'Ajak bercerita tentang masa lalu (回想法).'], ['へえ。', -10, 'Kesempatan bercerita hilang.'], ['うそ でしょう。', -25, 'Meragukan cerita lansia menyakitkan.']]],
      ], 'Rekreasi & tukar budaya: ajak penghuni bercerita tentang masa lalu (回想法), dengarkan dengan antusias.')],
      vocab: V(['歌', 'うた', 'uta', 'lagu'], ['昔', 'むかし', 'mukashi', 'dulu'], ['回想法', 'かいそうほう', 'kaisouhou', 'terapi mengenang']) },
    8: { add: [TL('hall', 'r', '👴', 'Penghuni kamar 1 kesal menunggu', 'Kamu terlambat datang ke kamar 1. Kakek Tanaka kesal.', [
        ['おそい！ ずっと まって いた んだ ぞ！', 'Lama! Aku menunggu dari tadi!', [['おまたせ して、もうしわけ ありません。おみず です ね。', 30, 'Minta maaf atas penantian lalu langsung penuhi kebutuhan.'], ['ほか の へや が いそがしかった から。', -15, 'Alasan dulu terdengar membela diri.'], ['（だまって みず を おく）', -10, 'Tanpa kata, beliau tetap kesal.']]],
        ['…なにか あった の か？', '…Ada apa tadi?', [['ころんだ かた が いて、その たいおう を して いました。', 25, 'Jelaskan singkat tanpa menyebut nama/rahasia penghuni lain.'], ['きむら さん が ころびました。', -20, 'Jangan ceritakan info penghuni lain (個人情報).'], ['ひみつ です。', -5, 'Terlalu tertutup; beri penjelasan umum.']]],
      ], 'Saat terlambat: お待たせして申し訳ありません. Jaga privasi penghuni lain (個人情報).')],
      vocab: V(['お待たせしました', 'おまたせしました', 'omatase shimashita', 'maaf membuat menunggu'], ['個人情報', 'こじんじょうほう', 'kojin jouhou', 'informasi pribadi'], ['遅い', 'おそい', 'osoi', 'lama / terlambat']) },
    9: { add: [TL('staff', 'boss', '👩‍⚕️', 'Lapor ヒヤリハット ke leader', 'Kamu melapor kejadian hampir terpeleset di kamar mandi.', [
        ['くわしく おしえて。', 'Ceritakan detailnya.', [['10じ ごろ、よくしつ で、きむら さん が せっけん で すべりそう に なりました。けが は ありません。', 30, 'いつ・どこで・だれが・なにが・結果: lengkap.'], ['あぶなかった です。', -10, 'Terlalu umum.'], ['だいじょうぶ でした。', -15, 'Tidak ada informasi untuk mencegah.']]],
        ['げんいん は なん だと おもう？', 'Menurutmu penyebabnya apa?', [['ゆか に せっけん が のこって いました。すべりどめ が ひつよう だと おもいます。', 30, 'Penyebab + usulan perbaikan.'], ['きむら さん が わるい です。', -30, 'Menyalahkan penghuni tidak menyelesaikan masalah.'], ['わかりません。', -5, 'Coba pikirkan lingkungan, bukan orang.']]],
      ], 'Laporan ヒヤリハット: kapan, di mana, siapa, apa, akibat + penyebab & usulan.')],
      vocab: V(['原因', 'げんいん', 'genin', 'penyebab'], ['詳しく', 'くわしく', 'kuwashiku', 'secara detail'], ['石鹸', 'せっけん', 'sekken', 'sabun']) },
    10: { add: [TL('phone', 'siti', '👩', 'Rindu rumah', 'Kamu terlihat murung. Bu Siti mengajak bicara.', [
        ['げんき ない ね。どうした の？', 'Kamu kelihatan lesu. Kenapa?', [['じつは、かぞく に あいたくて…', 30, 'Ceritakan perasaanmu. Itu bukan kelemahan.'], ['なんでも ない です。', -10, 'Memendam terus membuat stres.'], ['しごと を やめたい。', -5, 'Boleh jujur, tapi coba ceritakan sebabnya dulu.']]],
        ['わかる よ。わたし も そう だった。こんや ビデオ でんわ したら？', 'Aku paham. Aku juga dulu. Video call malam ini?', [['そう します。はなして よかった です。', 30, 'Berbagi perasaan membantu. Ada juga layanan konsultasi (相談窓口).'], ['でも ねる じかん が…', 0, 'Atur waktu: telepon sebentar sebelum tidur.'], ['いい です、ひとり で がまん します。', -20, 'Menahan sendiri terus-menerus berbahaya bagi kesehatan mental.']]],
      ], 'Rindu rumah itu wajar. Cerita ke senpai, video call keluarga, atau hubungi 相談窓口 (layanan konsultasi).')],
      vocab: V(['会いたい', 'あいたい', 'aitai', 'ingin bertemu'], ['相談', 'そうだん', 'soudan', 'konsultasi'], ['我慢', 'がまん', 'gaman', 'menahan diri']) },
    11: { add: [AC('room', 'かんきょう せいび · Rapikan kamar sebelum keluarga datang', '🛏️', 'kamar Nenek Kimura', [['🛏️', 'シーツ', 'シーツ の しわ を のばして。', 'rapikan kerutan seprai', 'swipe', '🛏️ ✓'], ['👓', 'めがね', 'めがね と いれば を ての とどく ところ に。', 'kacamata & gigi palsu di jangkauan', 'tap', '👓 ✓'], ['🔔', 'ナースコール', 'ナースコール を まくら の よこ に。', 'bel di samping bantal', 'tap', '🔔 ✓'], ['🧹', 'ゆか', 'ゆか に ものを おかない。', 'lantai bebas barang (cegah jatuh)', 'swipe', '✨']], [['📺', 'テレビ を つける']], 'Penataan lingkungan (環境整備): barang penting dalam jangkauan, bel di dekat bantal, lantai bebas barang supaya tidak tersandung.')],
      vocab: V(['環境整備', 'かんきょうせいび', 'kankyou seibi', 'penataan lingkungan'], ['眼鏡', 'めがね', 'megane', 'kacamata'], ['届く', 'とどく', 'todoku', 'terjangkau']) },
    12: { add: [TL('room', 'r', '👴', 'Kakek kesepian di kamar isolasi', 'Kakek Tanaka bosan dan ingin keluar dari kamar isolasi.', [
        ['もう へや に いる の は いや だ！ みんな の ところ へ いく！', 'Aku tidak mau di kamar terus! Aku mau ke yang lain!', [['さびしい ですよね。ねつ が さがる まで、すこし だけ ここ で すごしましょう。', 30, 'Akui perasaannya lalu jelaskan alasan dengan lembut.'], ['だめ！ うつる から！', -20, 'Benar tapi kasar; beliau merasa jadi "sumber penyakit".'], ['（ドア を しめて でる）', -30, 'Membuat beliau makin kesepian.']]],
        ['…じゃあ、なにか する こと は ない か？', '…Lalu, ada yang bisa kulakukan?', [['すきな ラジオ を もって きます ね。また ようす を みに きます。', 30, 'Beri aktivitas & janji kembali.'], ['ねて いて ください。', -10, 'Bosan berkepanjangan memperburuk suasana hati.'], ['しりません。', -25, 'Dingin.']]],
      ], 'Isolasi: akui rasa sepi, jelaskan alasan dengan lembut, beri aktivitas, sering menengok.')],
      vocab: V(['寂しい', 'さびしい', 'sabishii', 'kesepian'], ['熱が下がる', 'ねつがさがる', 'netsu ga sagaru', 'demam turun'], ['様子', 'ようす', 'yousu', 'keadaan']) },
    13: { add: [TL('room', 'nguyen', '👦', 'Nguyen-san bertanya soal こえかけ', 'Nguyen-san belum paham kenapa harus bicara sebelum menyentuh.', [
        ['どうして まいかい こえ を かける んですか？ じかん が かかります。', 'Kenapa harus bicara tiap kali? Makan waktu.', [['いきなり さわられる と、こわい し、びっくり して ころぶ かも しれない から です。', 30, 'Ajarkan alasan: rasa takut & risiko jatuh.'], ['きまり だから。', -10, 'Tanpa alasan, mudah dilupakan.'], ['いそがしい とき は しなくて いい よ。', -30, 'Contoh buruk dari senpai.']]],
        ['なんて いえば いい ですか？', 'Bilang apa?', [['「いまから 〜します ね」と、ゆっくり、め を みて いいます。', 30, 'Kalimat contoh + cara (pelan, kontak mata).'], ['なんでも いい よ。', -15, 'Pekerja baru butuh contoh konkret.'], ['にほんご、むずかしい よ ね。', -5, 'Bantu dengan kalimat pendek yang mudah.']]],
      ], 'Mengajar こえかけ: alasan + kalimat contoh + cara mengucapkan (pelan, kontak mata).'),
      { t: 'dress', at: 'room', mahi: 'L', title: 'Contohkan ganti baju ke Nguyen-san (lumpuh kiri)' },
      AC('wheel', 'いじょう · Contohkan pindah dari kasur ke kursi roda', '🛏️', 'Kakek Tanaka (lumpuh kanan)', [['♿', 'くるまいす', 'くるまいす を けんそく の ひだり に、ななめ に おいて。', 'kursi roda di sisi sehat, miring 30°', 'tap', '♿ ✓'], ['🛑', 'ブレーキ', 'ブレーキ を かけて。', 'kunci rem', 'taps:2', '🛑🛑'], ['🦶', 'あし', 'あし を ひいて、まえかがみ に。', 'tarik kaki ke belakang, badan condong ke depan', 'hold', '🦶 ✓'], ['🔄', 'まわる', 'いっしょ に たって、まわって すわる。', 'berdiri bersama, putar, duduk', 'swipe', '♿ ✓']], [['💪', 'ちから で もちあげる']], 'Pindah (移乗): kursi roda di sisi sehat, rem dikunci, condongkan badan ke depan, putar dengan poros kaki sehat. Jangan mengangkat dengan tenaga saja (腰痛).', )],
      vocab: V(['移乗', 'いじょう', 'ijou', 'memindahkan (kasur↔kursi roda)'], ['斜め', 'ななめ', 'naname', 'miring / diagonal'], ['前かがみ', 'まえかがみ', 'maekagami', 'condong ke depan']) },
    14: { add: [TL('staff', 'boss', '🧑‍⚖️', 'Wawancara ujian kaigo', 'Penguji bertanya tentang sikapmu sebagai pekerja kaigo.', [
        ['かいご で いちばん だいじ に して いる こと は？', 'Apa yang paling kamu utamakan dalam kaigo?', [['りようしゃ さん の きもち と、できる こと を たいせつ に する こと です。', 30, 'Martabat & kemandirian (尊厳・自立支援).'], ['はやく おわらせる こと です。', -25, 'Kecepatan bukan tujuan utama.'], ['おかね です。', -20, 'Jujur, tapi tidak tepat untuk wawancara.']]],
        ['りようしゃ に「ばか」と いわれたら？', 'Kalau penghuni bilang "bodoh" padamu?', [['おちついて、りゆう を かんがえます。つらい とき は リーダー に そうだん します。', 30, 'Tenang, cari sebab (sakit/demensia), konsultasi ke leader.'], ['いいかえします。', -30, 'Membalas penghuni dilarang.'], ['もう その ひと の せわ を しません。', -20, 'Bicarakan dengan tim, jangan menolak sepihak.']]],
      ], 'Wawancara: utamakan martabat & kemandirian. Perkataan kasar penghuni sering karena sakit/demensia; tenang dan konsultasi.'),
      { t: 'vital', at: 'room', title: 'Ujian praktik: tanda vital Kakek Sato', c: { who: 'さとう さん', v: { temp: 36.7, bp: [168, 96], pulse: 78, spo2: 96 }, abn: 'bp' } },
      { t: 'meds', at: 'dining', title: 'Ujian praktik: obat pagi', time: 'あさ', people: ['やまだ', 'いとう', 'こばやし'], wrong: { to: 'いとう', time: 'ねるまえ' } },
      { t: 'skin', at: 'room', title: 'Ujian praktik: cek kulit setelah ubah posisi', red: ['koto', 'hiji'] }],
      vocab: V(['実技', 'じつぎ', 'jitsugi', 'ujian praktik'], ['寝る前', 'ねるまえ', 'neru mae', 'sebelum tidur'], ['肘', 'ひじ', 'hiji', 'siku']) },
    15: { add: [TL('room', 'r', '👵', 'Pamit kepada Nenek Kimura', 'Hari terakhir. Nenek Kimura memegang tanganmu.', [
        ['きょう で さいご なの？ さびしく なる わ。', 'Hari ini terakhir? Aku akan kesepian.', [['わたし も さびしい です。きむら さん に たくさん おしえて もらいました。', 30, 'Ungkapkan terima kasih dan perasaanmu.'], ['しごと だから しかたない です。', -15, 'Benar, tapi terasa dingin.'], ['また すぐ あえます よ。', -5, 'Jangan berjanji yang belum pasti.']]],
        ['げんき で ね。にほんご、じょうず に なった わ。', 'Sehat-sehat ya. Bahasa Jepangmu sudah pintar.', [['ありがとう ございます。きむら さん も おげんき で。', 30, 'Salam perpisahan: お元気で.'], ['まだ へた です。', 0, 'Rendah hati itu baik, tapi terima pujiannya juga.'], ['バイバイ！', -15, 'Terlalu santai untuk lansia.']]],
      ], 'Perpisahan dengan penghuni: terima kasih, ungkapkan perasaan, 「お元気で」.'),
      { t: 'vital', at: 'room', title: 'Ronde pagi terakhir: Nenek Kimura', c: { who: 'きむら さん', v: { temp: 36.3, bp: [126, 74], pulse: 70, spo2: 98 }, abn: null } },
      AC('staff', 'もうしおくり · Serah terima ke shift malam', '📋', 'catatan kaigo', [['📝', 'きろく', 'たなか さん の けつあつ を きろく して。', 'catat tekanan darah Kakek Tanaka', 'swipe', '📝 ✓'], ['💊', 'くすり', 'よる の くすり の ちゅうい を つたえて。', 'sampaikan catatan obat malam', 'tap', '💊 ✓'], ['🗣️', 'もうしおくり', 'よるきん の ひと に くちで つたえて。', 'sampaikan lisan ke shift malam', 'hold', '🗣️ ✓']], [['📺', 'テレビ']], '申し送り: perubahan kondisi, obat, dan kejadian hari itu disampaikan tertulis + lisan ke shift berikutnya.')],
      vocab: V(['申し送り', 'もうしおくり', 'moushiokuri', 'serah terima (kaigo)'], ['夜勤', 'やきん', 'yakin', 'shift malam'], ['お元気で', 'おげんきで', 'ogenki de', 'sehat-sehat ya']) },
  };

  /* =========================================================
     🏗 GENBA
     ========================================================= */
  const RYO = (x, y, dir = 'left') => [{ k: 'w1', id: 'ryo', x, y, dir }];
  SC.genba = {
    1: { add: [TL('plaza', 'w1', '🧑‍🔧', 'Kenalan dengan Ryo-san', 'Ryo-san, pekerja senior, menyapamu di lapangan apel.', [
        ['おう、しんじん か。どこ の くに？', 'Oh, orang baru? Dari negara mana?', [['インドネシア です。○○ です。よろしく おねがいします！', 30, 'Salam semangat dengan suara jelas. Di genba suara besar = baik.'], ['…インドネシア。', -10, 'Suara kecil sulit terdengar di genba yang bising.'], ['なんで きく んですか？', -25, 'Terdengar curiga dan tidak ramah.']]],
        ['げんば は はじめて か？ わからない こと は すぐ きけ よ。', 'Pertama kali di genba? Yang tidak tahu langsung tanya.', [['はい、はじめて です。いろいろ おしえて ください。', 30, 'Rendah hati & siap belajar.'], ['だいじょうぶ です、できます。', -15, 'Terlalu percaya diri di genba berbahaya.'], ['ググります。', -10, 'Di genba, tanya orang yang tahu kondisinya.']]],
      ], 'Di genba suara harus jelas dan semangat. Pekerja baru: 「いろいろ教えてください」.', { cast: RYO(2, 3, 'up') })],
      vocab: V(['新人', 'しんじん', 'shinjin', 'orang baru'], ['現場', 'げんば', 'genba', 'lokasi proyek'], ['先輩', 'せんぱい', 'senpai', 'senior']) },
    2: { add: [TL('ky', 'boss', '👷', 'Bicara di rapat KY', 'Pak Kondo memintamu menyebutkan bahaya hari ini di depan tim.', [
        ['○○、きょう の さぎょう で いちばん の きけん は？', '○○, bahaya utama pekerjaan hari ini?', [['かいだん の あな に おちる きけん です。カバー を して、てすり を つけます！', 30, 'Bahaya + tindakan pencegahan.'], ['あぶない です。', -15, 'Terlalu umum; sebutkan bahaya spesifik.'], ['ない です。', -30, 'Selalu ada bahaya di genba.']]],
        ['よし。じゃあ チーム の もくひょう を いえ。', 'Oke. Ucapkan target tim.', [['あな の カバー、ヨシ！', 30, 'Target tim KY diucapkan bersama dengan 「〜ヨシ！」.'], ['がんばります。', -5, 'Target harus konkret.'], ['（ちいさい こえ で）よし…', -10, 'Ucapkan dengan suara keras bersama tim.']]],
      ], 'KY: sebutkan bahaya spesifik + pencegahan, lalu target tim 「〜ヨシ！」 dengan suara keras.')],
      vocab: V(['目標', 'もくひょう', 'mokuhyou', 'target'], ['穴', 'あな', 'ana', 'lubang'], ['手すり', 'てすり', 'tesuri', 'pagar pegangan']) },
    3: { add: [TL('material', 'w1', '🧑‍🔧', 'Tanya tempat menyimpan alat', 'Selesai kerja, kamu tidak tahu di mana menyimpan alat.', [
        ['かたづけ、たのむ ぞ。', 'Tolong beres-beres.', [['はい。この インパクト は どこ に おけば いい ですか？', 30, 'Tanya lokasi dengan menyebut nama alat.'], ['（てきとう に おく）', -25, 'Alat hilang = pekerjaan besok terhambat.'], ['しりません。', -20, 'Kalau tidak tahu, tanyakan.']]],
        ['あの コンテナ の、たな の 2だんめ。じゅうでん も な。', 'Di kontainer itu, rak tingkat 2. Dicas juga.', [['コンテナ の 2だんめ に おいて、じゅうでん します。', 30, '復唱: ulangi tempat + tugas tambahan.'], ['はい。', 0, 'Lebih aman jika diulang.'], ['じゅうでん は あした で いい ですか？', -15, 'Baterai kosong besok pagi menghambat tim.']]],
      ], 'Tanya: 「〜はどこに置けばいいですか」. Ulangi instruksi (復唱) supaya tidak salah.', { cast: RYO(3, 5) })],
      vocab: V(['片付け', 'かたづけ', 'katazuke', 'beres-beres'], ['充電', 'じゅうでん', 'juuden', 'mengisi baterai'], ['棚', 'たな', 'tana', 'rak']) },
    4: { vocab: V(['気をつける', 'きをつける', 'ki wo tsukeru', 'berhati-hati'], ['理由', 'りゆう', 'riyuu', 'alasan']) },
    5: { add: [TL('gate', 'boss', '🚛', 'Sopir truk mengantar material', 'Truk material datang di gerbang. Sopir bertanya kepadamu.', [
        ['てっきん の のうひん です。どこ に おろせば いい？', 'Kirim besi tulangan. Diturunkan di mana?', [['しょうしょう おまち ください。しょくちょう に かくにん します。', 30, 'Tidak tahu → minta tunggu & tanya mandor.'], ['どこ でも いい です。', -25, 'Material di tempat salah = bahaya & kerja dua kali.'], ['しりません。', -20, 'Tamu/vendor harus dilayani sopan.']]],
        ['でんぴょう に サイン ください。', 'Tolong tanda tangan surat jalannya.', [['すうりょう を かくにん して から サイン します。', 30, 'Cek jumlah dulu baru tanda tangan.'], ['（すぐ サイン する）', -15, 'Kalau jumlah kurang, genba yang rugi.'], ['サイン できません、かえって ください。', -20, 'Tolak dengan sopan dan panggil yang berwenang.']]],
      ], 'Penerimaan barang (納品): tanya mandor tempatnya, cek jumlah di surat jalan (伝票) sebelum tanda tangan.')],
      vocab: V(['納品', 'のうひん', 'nouhin', 'pengiriman barang'], ['伝票', 'でんぴょう', 'denpyou', 'surat jalan'], ['数量', 'すうりょう', 'suuryou', 'jumlah']) },
    6: { vocab: V(['断る', 'ことわる', 'kotowaru', 'menolak'], ['フック', 'フック', 'fukku', 'kait']) },
    7: { vocab: V(['くらくら', 'くらくら', 'kurakura', 'pusing berkunang'], ['冷やす', 'ひやす', 'hiyasu', 'mendinginkan']) },
    8: { add: [TL('scaffold', 'w1', '🧑‍🔧', 'Operator pompa beton mendesak', 'Saat pengecoran, operator pompa berteriak minta cepat, padahal ada orang dekat selang.', [
        ['はやく！ コンクリ が かたまる ぞ！', 'Cepat! Betonnya keburu mengeras!', [['ちょっと まって ください！ ホース の ちかく に ひと が います！', 30, 'Keselamatan dulu: hentikan dan beri alasan.'], ['（だまって つづける）', -30, 'Selang pompa bisa memukul orang.'], ['はい！ いそぎます！', -15, 'Terburu-buru karena tekanan = kecelakaan.']]],
        ['…わかった。どいたら いえ よ。', '…Oke. Bilang kalau sudah minggir.', [['ひと、どきました。オーライ です！', 30, 'Konfirmasi aman dengan aba-aba jelas.'], ['たぶん だいじょうぶ です。', -20, '"Mungkin" bukan konfirmasi aman.'], ['（て を ふる だけ）', -5, 'Lebih jelas bila disertai suara.']]],
      ], 'Pengecoran: walau terburu-buru, hentikan kalau ada orang di zona bahaya. Konfirmasi dengan 「オーライ」.', { cast: RYO(8, 3, 'up') })],
      vocab: V(['固まる', 'かたまる', 'katamaru', 'mengeras'], ['退く', 'どく', 'doku', 'minggir'], ['ホース', 'ホース', 'hoosu', 'selang']) },
    9: { add: [TL('scaffold', 'boss', '👷', 'Lapor benda jatuh dengan detail', 'Pak Kondo meminta detail kejadian kunci pas yang jatuh.', [
        ['いつ、どこ で おちた？', 'Kapan, di mana jatuh?', [['11じ ごろ、2かい の あしば から、わたし の 1メートル よこ に おちました。', 30, 'Waktu + tempat + jarak: lengkap.'], ['さっき、うえ から。', -10, 'Kurang detail.'], ['わすれました。', -25, 'Laporkan segera selagi ingat.']]],
        ['だれ の どうぐ か わかる か？', 'Tahu alat siapa?', [['わかりません。でも、ひも が ついて いません でした。', 30, 'Fokus pada fakta & penyebab, bukan menyalahkan orang.'], ['きっと りょう さん です。', -20, 'Menebak dan menyalahkan merusak tim.'], ['かんけい ない です。', -15, 'Informasi penting untuk pencegahan.']]],
      ], 'Laporan: いつ・どこで・なにが・どうなった, fakta tanpa menyalahkan, plus penyebab (alat tanpa tali).')],
      vocab: V(['落ちる', 'おちる', 'ochiru', 'jatuh'], ['足場', 'あしば', 'ashiba', 'perancah'], ['紐', 'ひも', 'himo', 'tali']) },
    10: { add: [TL('ima', 'siti', '👩', 'Potongan di slip gaji', 'Kamu bingung kenapa gaji bersih lebih kecil. Bu Siti menjelaskan.', [
        ['きゅうよめいさい、みた？ なにか ききたい こと ある？', 'Sudah lihat slip gaji? Ada yang mau ditanya?', [['この「しゃかいほけん」と「ぜいきん」は なん ですか？', 30, 'Tanya istilah yang tidak dimengerti.'], ['すくない！ だまされた！', -20, 'Potongan resmi bukan penipuan; tanyakan dulu.'], ['みて いません。', -10, 'Selalu cek slip gaji.']]],
        ['けんこうほけん、ねんきん、ぜいきん は ほうりつ で きまって いる の。', 'Asuransi kesehatan, pensiun, pajak diatur hukum.', [['なるほど。びょういん で ほけんしょう が つかえる んですね。', 30, 'Asuransi membuat biaya berobat hanya 30%.'], ['ぜんぶ いりません。', -20, 'Wajib menurut hukum dan bermanfaat.'], ['ねんきん は もらえない から むだ です。', -5, 'Pekerja asing bisa klaim 脱退一時金 saat pulang.']]],
      ], 'Potongan gaji: 健康保険 (kesehatan, berobat 30%), 年金 (pensiun, bisa diklaim saat pulang), 税金 (pajak).')],
      vocab: V(['社会保険', 'しゃかいほけん', 'shakai hoken', 'asuransi sosial'], ['税金', 'ぜいきん', 'zeikin', 'pajak'], ['年金', 'ねんきん', 'nenkin', 'pensiun']) },
    11: { add: [TL('ky', 'boss', '🕵️', 'Pertanyaan petugas patroli', 'Petugas keselamatan dari kantor pusat menanyaimu.', [
        ['あなた の きょう の しごと は？', 'Pekerjaanmu hari ini apa?', [['あしば の うえ で、かたわく の くみたて です。', 30, 'Jawab singkat & spesifik.'], ['いろいろ です。', -15, 'Terlalu kabur.'], ['しょくちょう に きいて ください。', -10, 'Pekerjaanmu sendiri harus bisa kamu jelaskan.']]],
        ['あんぜんたい は どこ に かけますか？', 'Harness dikaitkan di mana?', [['こし より たかい ところ の、しっかり した しちゅう に かけます。', 30, 'Kait di titik lebih tinggi dari pinggang & kokoh.'], ['あしもと に かけます。', -25, 'Terlalu rendah → jarak jatuh panjang.'], ['かけません。', -30, 'Pelanggaran berat.']]],
      ], 'Saat patroli: jelaskan pekerjaanmu & aturan keselamatannya dengan yakin.'),
      { t: 'hunt', at: 'ky', title: 'Patroli: temukan pelanggaran', items: [
        { e: '🧗', x: 70, y: 60, d: 'Bekerja tinggi tanpa kait harness', ok: false, why: 'ノーフック' }, { e: '🚬', x: 160, y: 120, d: 'Merokok di luar tempat merokok', ok: false, why: 'Hanya di 喫煙所' }, { e: '🧯', x: 250, y: 115, d: 'Alat pemadam tertutup material', ok: false, why: 'Harus mudah dijangkau' },
        { e: '⛑️', x: 120, y: 45, d: 'Helm & tali dagu terpasang', ok: true }, { e: '🚧', x: 220, y: 50, d: 'Area bawah diberi pita larangan', ok: true }, { e: '🧹', x: 290, y: 60, d: 'Jalur kerja bersih', ok: true }] }],
      vocab: V(['安全帯', 'あんぜんたい', 'anzentai', 'sabuk pengaman / harness'], ['型枠', 'かたわく', 'katawaku', 'bekisting'], ['支柱', 'しちゅう', 'shichuu', 'tiang penyangga']) },
    12: { add: [TL('gate', 'boss', '👷', 'Lapor persiapan topan', 'Pak Kondo menelepon dan menanyakan kondisi genba.', [
        ['たいふう の じゅんび、どう なってる？', 'Persiapan topan bagaimana?', [['しざい は しばりました。シート は あと 2まい です。30ぷん で おわります。', 30, 'Laporan progres: selesai + sisa + perkiraan waktu.'], ['だいたい おわりました。', -10, '"Kira-kira" tidak cukup untuk keputusan mandor.'], ['わかりません。', -25, 'Cek dulu, lalu laporkan.']]],
        ['かぜ が つよく なったら すぐ おりろ。', 'Kalau angin menguat, segera turun.', [['はい。10メートル いじょう に なったら、さぎょう を ちゅうし して おります。', 30, 'Ulangi aturan & tindakan.'], ['もうすこし だから おわらせます。', -30, 'Angin kencang di ketinggian = sangat berbahaya.'], ['かさ を もって いきます。', -20, 'Payung di perancah berbahaya.']]],
      ], 'Laporan progres: yang selesai, sisa, perkiraan waktu. Angin ≥10 m/s → hentikan kerja di ketinggian.'),
      { t: 'harness', at: 'scaffold', n: 4, title: 'Naik melipat terpal sebelum angin kencang' }],
      vocab: V(['準備', 'じゅんび', 'junbi', 'persiapan'], ['風', 'かぜ', 'kaze', 'angin'], ['降りる', 'おりる', 'oriru', 'turun']) },
    13: { add: [TL('ppe', 'nguyen', '👦', 'Nguyen-san takut ketinggian', 'Nguyen-san gemetar sebelum naik perancah.', [
        ['たかい ところ、ちょっと こわい です…', 'Tempat tinggi agak menakutkan…', [['だいじょうぶ。いつも フック を ひとつ かけて いれば、おちない よ。いっしょ に やろう。', 30, 'Tenangkan + aturan konkret + temani.'], ['こわがる な！', -20, 'Membentak membuat makin takut dan kaku.'], ['じゃあ ずっと した に いて。', -10, 'Hindari, tapi bantu dia belajar dengan aman.']]],
        ['フック は いつ かけかえ ますか？', 'Kapan kaitnya dipindah?', [['あたらしい ほう を かけて から、ふるい ほう を はずす。', 30, 'Aturan 2丁掛け dengan kalimat sederhana.'], ['てきとう に。', -25, 'Berbahaya.'], ['りょうほう はずして から うごく。', -30, 'ノーフック: sangat berbahaya.']]],
      ], 'Mengajar ketinggian: tenangkan, beri aturan sederhana (pasang baru → lepas lama), temani langkah pertama.'),
      { t: 'harness', at: 'scaffold', n: 5, title: 'Contohkan 2丁掛け ke Nguyen-san' }],
      vocab: V(['高い所', 'たかいところ', 'takai tokoro', 'tempat tinggi'], ['掛け替える', 'かけかえる', 'kakekaeru', 'memindah kait'], ['外す', 'はずす', 'hazusu', 'melepas']) },
    14: { add: [TL('ky', 'boss', '🧑‍⚖️', 'Ujian lisan genba', 'Penguji meminta kamu menjelaskan sendiri.', [
        ['クレーン の あいず で、まきあげ は なん と いいますか？', 'Aba-aba crane untuk naik disebut apa?', [['ゴーヘイ です。まきさげ は スラー です。', 30, 'Jawab + tambahan yang relevan.'], ['アップ です。', -10, 'Di genba Jepang dipakai ゴーヘイ.'], ['わかりません。', -20, 'Hafalkan: ゴーヘイ・スラー・ストップ.']]],
        ['つりに の した に ひと が いたら？', 'Kalau ada orang di bawah beban?', [['すぐ「ストップ」と いって、たいひ させます。', 30, 'Hentikan crane & evakuasi.'], ['いそいで おろします。', -25, 'Menurunkan beban di atas orang = berbahaya.'], ['きに しません。', -30, 'Pelanggaran keselamatan berat.']]],
      ], 'Ujian: aba-aba crane (ゴーヘイ・スラー・ストップ), 吊り荷の下に入るな.'),
      { t: 'crane', at: 'scaffold', title: 'Ujian praktik: angkat balok baja melewati dinding tinggi', wallH: 58, wallX: 130, tx: 270, load: '🔩', color: '#6a7a8a' },
      { t: 'rebar', at: 'scaffold', title: 'Ujian praktik: ikat besi & cek ピッチ' }],
      vocab: V(['巻き上げ', 'まきあげ', 'makiage', 'mengangkat (crane)'], ['巻き下げ', 'まきさげ', 'makisage', 'menurunkan (crane)'], ['退避', 'たいひ', 'taihi', 'menyingkir / evakuasi']) },
    15: { add: [TL('gate', 'boss', '👷', 'Kata terakhir dari Pak Kondo', 'Pak Kondo memanggilmu setelah upacara.', [
        ['よく がんばった。くに に かえったら、なに を する？', 'Kerja bagus. Setelah pulang, mau apa?', [['にほん で まなんだ あんぜん を、くに の げんば でも つたえたい です。', 30, 'Tunjukkan rencana & rasa terima kasih.'], ['ねます。', -10, 'Bercanda boleh, tapi ini momen penting.'], ['わかりません。', 0, 'Boleh jujur, tambahkan terima kasih.']]],
        ['また いっしょ に はたらこう な。', 'Ayo kerja bareng lagi.', [['はい！ ありがとう ございました！ ごあんぜん に！', 30, 'Salam khas genba: ご安全に!'], ['じゃあ。', -15, 'Terlalu singkat.'], ['もう きません。', -30, 'Tidak sopan.']]],
      ], 'Perpisahan di genba: terima kasih + rencana + 「ご安全に！」.'),
      { t: 'crane', at: 'scaffold', title: 'じょうとう · Pasang balok terakhir (upacara 上棟)', load: '🎌', color: '#c0392b', wallH: 50 },
      { t: 'yudo', at: 'gate', title: 'Pandu truk sampah konstruksi keluar', truck: '🚛' },
      { t: 'bins', at: 'material', title: 'Bersih-bersih akhir: pilah sisa material', bins: [['moku', '🪵', 'もくくず', 'sisa kayu'], ['kinzoku', '🔩', 'きんぞくくず', 'sisa logam'], ['pura', '🛍️', 'はいプラ', 'plastik'], ['gara', '🧱', 'がれき', 'puing']],
        items: [['🔧', 'こわれた スパナ', 'kunci pas rusak', 'kinzoku'], ['🪵', 'あしば いた の はへん', 'serpihan papan perancah', 'moku'], ['🧴', 'シーリング の から', 'tabung sealant kosong', 'pura'], ['🧱', 'ブロック の かけら', 'pecahan batako', 'gara'], ['📏', 'まがった てっきん', 'besi bengkok', 'kinzoku'], ['🛍️', 'ブルーシート の きれはし', 'potongan terpal biru', 'pura']], why: 'Genba yang rapi saat ditinggalkan adalah tanda pekerja profesional.' }],
      vocab: V(['上棟', 'じょうとう', 'joutou', 'pemasangan balok puncak'], ['ご安全に', 'ごあんぜんに', 'go-anzen ni', 'salam keselamatan'], ['伝える', 'つたえる', 'tsutaeru', 'menyampaikan']) },
  };

  /* =========================================================
     🍶 IZAKAYA
     ========================================================= */
  const GUEST = (k = 'c1', id = 'emma', x = 3, y = 3) => [{ k, id, x, y, dir: 'up' }];
  SC.gaishoku = {
    1: { add: [TL('back', 'boss', '🧑‍🍳', 'Aturan penampilan dari tencho', 'Tencho memeriksa penampilanmu sebelum shift pertama.', [
        ['つめ と かみ、みせて。', 'Coba lihat kuku dan rambutmu.', [['はい。つめ は みじかく きって あります。', 30, 'Kuku pendek, rambut diikat: dasar kebersihan restoran.'], ['ネイル、かわいい でしょう？', -25, 'Kuteks/kuku panjang dilarang di dapur & pelayanan.'], ['みせたく ない です。', -20, 'Pemeriksaan 身だしなみ adalah aturan kerja.']]],
        ['えがお で「いらっしゃいませ」、いって みて。', 'Coba bilang "irasshaimase" sambil senyum.', [['いらっしゃいませ！', 30, 'Suara cerah dan jelas.'], ['（ちいさい こえ で）いらっしゃいませ…', -10, 'Suara kecil terdengar tidak ramah.'], ['ハロー！', -20, 'Pakai salam Jepang.']]],
      ], '身だしなみ: kuku pendek, rambut rapi, tanpa aksesoris berlebihan. Salam dengan senyum & suara jelas.')],
      vocab: V(['身だしなみ', 'みだしなみ', 'midashinami', 'kerapian penampilan'], ['爪', 'つめ', 'tsume', 'kuku'], ['笑顔', 'えがお', 'egao', 'senyum']) },
    2: { add: [TL('t1', 'c1', '👩', 'Tamu minta rekomendasi', 'Tamu di meja 1 bingung memilih menu.', [
        ['おすすめ は なん ですか？', 'Apa rekomendasinya?', [['きょう の おすすめ は、やきとり の もりあわせ です。', 30, 'Sebut menu rekomendasi dengan yakin.'], ['ぜんぶ おいしい です。', -5, 'Tamu butuh pilihan konkret.'], ['わかりません。', -20, 'Hafalkan menu rekomendasi sebelum shift.']]],
        ['じゃあ、それ と なま ふたつ。', 'Kalau gitu itu dan bir draft dua.', [['やきとり の もりあわせ ひとつ、なまビール ふたつ ですね。かしこまりました。', 30, 'Ulangi pesanan (復唱) + かしこまりました.'], ['はい。', -5, 'Tanpa mengulang, mudah salah.'], ['オッケー！', -15, 'Terlalu santai untuk tamu.']]],
      ], 'Rekomendasi: sebutkan satu menu konkret. Pesanan selalu diulang lalu 「かしこまりました」.', { cast: GUEST() })],
      vocab: V(['おすすめ', 'おすすめ', 'osusume', 'rekomendasi'], ['盛り合わせ', 'もりあわせ', 'moriawase', 'aneka (porsi campur)'], ['かしこまりました', 'かしこまりました', 'kashikomarimashita', 'baik (sopan)']) },
    3: { add: [TL('t1', 'c3', '👴', 'Tamu bertanya isi masakan', 'Kakek pelanggan bertanya apa isi masakan yang tidak kamu kenal.', [
        ['この「なんばんづけ」って なに が はいってる の？', '"Nanbanzuke" ini isinya apa?', [['しょうしょう おまち ください。キッチン に かくにん して まいります。', 30, 'Tidak tahu → cek ke dapur. Jangan menebak (alergi!).'], ['たぶん さかな です。', -20, 'Menebak bahan berbahaya bagi tamu alergi.'], ['しりません。', -25, 'Tidak sopan kepada tamu.']]],
        ['あじ と たまねぎ と す だって？ じゃあ ひとつ。', 'Ikan aji, bawang, cuka? Kalau gitu satu.', [['ありがとう ございます。なんばんづけ ひとつ ですね。', 30, 'Ulangi pesanan.'], ['よかった〜。', -5, 'Lebih baik pakai bahasa sopan.'], ['（だまって もどる）', -10, 'Konfirmasi pesanan dulu.']]],
      ], 'Ditanya bahan yang tidak tahu: 「確認してまいります」. Bahan & alergen tidak boleh ditebak.', { cast: GUEST('c3', 'ojii', 4, 3) })],
      vocab: V(['入っている', 'はいっている', 'haitte iru', 'berisi'], ['玉ねぎ', 'たまねぎ', 'tamanegi', 'bawang bombay'], ['酢', 'す', 'su', 'cuka']) },
    4: { add: [TL('t2', 'c2', '🧑', 'Salah antar pesanan', 'Kamu mengantar tsukune ke meja 2, padahal mereka pesan yakitori.', [
        ['え、これ たのんで ない よ。', 'Eh, ini bukan pesanan kami.', [['たいへん もうしわけ ございません。すぐ おとりかえ します。', 30, 'Minta maaf + tindakan segera.'], ['でも つくね も おいしい です よ。', -25, 'Memaksa tamu menerima yang salah.'], ['キッチン が まちがえました。', -15, 'Menyalahkan orang lain di depan tamu.']]],
        ['じゃあ、はやく ね。', 'Cepat ya.', [['はい、おいそぎ します。おまたせ して もうしわけ ありません。', 30, 'Konfirmasi dan minta maaf atas penantian.'], ['はーい。', -15, 'Terdengar malas.'], ['10ぷん かかります。', -5, 'Boleh beri estimasi, tapi dengan sopan.']]],
      ], 'Salah pesanan: 「大変申し訳ございません。すぐお取り替えします」. Jangan menyalahkan dapur di depan tamu.', { cast: GUEST('c2', 'ryo', 7, 3) })],
      vocab: V(['取り替える', 'とりかえる', 'torikaeru', 'menukar'], ['頼む', 'たのむ', 'tanomu', 'memesan'], ['急ぐ', 'いそぐ', 'isogu', 'bergegas']) },
    5: { add: [TL('reg', 'c1', '👩', 'Tamu ingin bayar terpisah', 'Dua tamu ingin membayar masing-masing.', [
        ['べつべつ で おねがい します。', 'Tolong bayar masing-masing.', [['かしこまりました。おひとり ずつ おうかがい します。', 30, 'Tanggapi sopan, lalu hitung per orang.'], ['できません。', -20, 'Kebanyakan izakaya bisa; kalau tidak bisa, jelaskan dengan sopan.'], ['めんどう です ね。', -30, 'Tidak boleh diucapkan ke tamu.']]],
        ['カード は つかえます か？', 'Bisa pakai kartu?', [['はい、ご利用 いただけます。こちら に どうぞ。', 30, 'ご利用いただけます = bisa digunakan (sopan).'], ['うん、いいよ。', -15, 'Terlalu santai.'], ['げんきん だけ です。', -5, 'Pastikan dulu aturan toko.']]],
      ], 'Kasir: 別々 (bayar terpisah), 「ご利用いただけます」 untuk kartu.', { cast: [{ k: 'c1', id: 'emma', x: 3, y: 6, dir: 'right' }] }),
],
      vocab: V(['別々', 'べつべつ', 'betsubetsu', 'terpisah'], ['お会計', 'おかいけい', 'okaikei', 'pembayaran'], ['ご利用', 'ごりよう', 'goriyou', 'penggunaan (sopan)']) },
    6: { add: [TL('t1', 'c1', '👩', 'Tamu bertanya soal udang', 'Tamu alergi udang bertanya tentang menu.', [
        ['この サラダ、えび は はいって います か？', 'Salad ini ada udangnya?', [['キッチン に ざいりょう を かくにん します。しょうしょう おまち ください。', 30, 'Cek bahan & bumbu ke dapur, termasuk saus.'], ['はいって ない と おもいます。', -30, '"Kayaknya" sangat berbahaya untuk alergi.'], ['すこし なら だいじょうぶ です よ。', -30, 'Sedikit pun bisa menyebabkan syok.']]],
        ['ドレッシング にも？', 'Di saus juga?', [['はい、ドレッシング も かくにん しました。えび は つかって いません。', 30, 'Sebut bahwa saus/kaldu juga dicek.'], ['ドレッシング は わかりません。', -15, 'Saus sering mengandung alergen; cek juga.'], ['たぶん。', -25, 'Tidak cukup.']]],
      ], 'Alergi: cek semua bahan termasuk saus, kaldu, minyak goreng. Jawab hanya setelah dikonfirmasi dapur.', { cast: GUEST() })],
      vocab: V(['材料', 'ざいりょう', 'zairyou', 'bahan'], ['海老', 'えび', 'ebi', 'udang'], ['使う', 'つかう', 'tsukau', 'memakai']) },
    7: { add: [TL('door', 'c3', '👴', 'Tamu basah kehujanan', 'Seorang kakek masuk basah kuyup karena hujan.', [
        ['いや〜、すごい あめ だ。', 'Wah, hujannya deras.', [['いらっしゃいませ。よろしければ タオル を どうぞ。', 30, 'Perhatian kecil (気配り) membuat tamu senang.'], ['ゆか が ぬれる ので、そと で ふいて ください。', -25, 'Tidak ramah.'], ['（なにも いわない）', -10, 'Kesempatan memberi kesan baik hilang.']]],
        ['ありがとう。かさ は どこ に おく？', 'Makasih. Payung ditaruh di mana?', [['こちら の かさたて に どうぞ。', 30, 'Tunjukkan tempat payung (傘立て).'], ['どこ でも いい です。', -15, 'Payung basah di lantai = licin.'], ['しりません。', -20, 'Tidak membantu.']]],
      ], '気配り (perhatian kecil): tawarkan handuk, tunjukkan 傘立て, keringkan lantai pintu masuk.', { cast: [{ k: 'c3', id: 'ojii', x: 1, y: 6, dir: 'right' }] })],
      vocab: V(['傘立て', 'かさたて', 'kasatate', 'tempat payung'], ['気配り', 'きくばり', 'kikubari', 'perhatian kecil'], ['雨', 'あめ', 'ame', 'hujan']) },
    8: { add: [TL('t2', 'c2', '🧑', 'Ketua rombongan memesan', 'Ketua rombongan 10 orang memesan dengan cepat.', [
        ['とりあえず なま 8、ウーロンちゃ 2、えだまめ 3！', 'Untuk awal: bir draft 8, teh oolong 2, edamame 3!', [['なま 8つ、ウーロンちゃ 2つ、えだまめ 3つ ですね。', 30, 'Ulangi semua angka.'], ['はい！', -5, 'Pesanan besar wajib diulang.'], ['もう いちど ゆっくり…', 10, 'Boleh minta diulang, lebih baik daripada salah.']]],
        ['あと、ひとり おくれて くる から、いす ひとつ たして。', 'Satu orang menyusul, tambah satu kursi.', [['かしこまりました。すぐ ごよう い します。', 30, 'Tanggapi cepat & sopan.'], ['せき が ない です。', -15, 'Cek dulu atau tanya tencho.'], ['じぶん で もって きて ください。', -30, 'Tidak sopan.']]],
      ], 'Rombongan: ulangi semua angka, siapkan kursi tambahan. Kalau terlalu cepat: 「もう一度お願いします」.', { cast: GUEST('c2', 'ryo', 7, 3) }),
      AC('kitchen', 'Antar 8 bir dengan baki', '🍺', 'baki minuman', [['🧊', 'ジョッキ', 'ジョッキ を ひやして おいて。', 'gelas didinginkan', 'tap', '🧊 ✓'], ['🍺', 'サーバー', 'あわ は 3わり。', 'busa 30%', 'hold', '🍺×8'], ['🍽️', 'トレイ', 'トレイ の まんなか から のせて。', 'taruh dari tengah baki (seimbang)', 'taps:4', '🍽️ ✓'], ['🚶', 'はこぶ', 'りょうて で、「しつれい します」と いって。', 'bawa dua tangan, bilang permisi', 'swipe', '🚶 ✓']], [['📱', 'スマホ']], 'Bir draft: gelas dingin, busa ±30%. Baki diisi dari tengah supaya seimbang. Saat lewat: 「失礼します」.')],
      vocab: V(['とりあえず', 'とりあえず', 'toriaezu', 'untuk awal'], ['枝豆', 'えだまめ', 'edamame', 'edamame'], ['泡', 'あわ', 'awa', 'busa']) },
    9: { add: [TL('kitchen', 'boss', '🧑‍🍳', 'Rekan terluka pisau', 'Tencho mengiris jarinya saat memotong sayur.', [
        ['いたっ… ゆび を きった。', 'Aduh… jariku teriris.', [['きず を おさえて、こころ より たかく して ください！ きゅうきゅうばこ を もって きます。', 30, 'Tekan luka, angkat lebih tinggi dari jantung, ambil P3K.'], ['みず で ずっと あらって ください。', -5, 'Bilas sebentar boleh, tapi utamakan menekan untuk menghentikan darah.'], ['（びっくり して にげる）', -30, 'Bantu tenang.']]],
        ['ちが とまらない…', 'Darahnya tidak berhenti…', [['10ぷん おさえても とまらなければ、びょういん へ いきましょう。', 30, 'Tekan 10 menit; kalau tidak berhenti → klinik.'], ['だいじょうぶ です よ。', -15, 'Jangan meremehkan.'], ['しごと を つづけましょう。', -25, 'Luka terbuka di dapur juga masalah higiene.']]],
      ], 'Luka iris: tekan, angkat, P3K (救急箱). Tidak berhenti 10 menit → ke klinik. Ganti/tutup sarung tangan sebelum memasak lagi.')],
      vocab: V(['救急箱', 'きゅうきゅうばこ', 'kyuukyuubako', 'kotak P3K'], ['傷', 'きず', 'kizu', 'luka'], ['押さえる', 'おさえる', 'osaeru', 'menekan']) },
    10: { add: [TL('ima', 'boss', '👩‍⚕️', 'Ke klinik saat flu', 'Hari libur, kamu demam dan pergi ke klinik.', [
        ['ほけんしょう は おもち ですか？', 'Membawa kartu asuransi?', [['はい、これ です。', 30, 'Selalu bawa 保険証 / My Number card.'], ['なん ですか、それ？', -15, 'Kartu asuransi wajib dibawa ke klinik.'], ['いいえ、ぜんぶ じぶん で はらいます。', -10, 'Tanpa kartu kamu bayar 100%.']]],
        ['きょう は どう されました か？', 'Keluhannya apa hari ini?', [['きのう から ねつ が あって、のど が いたい です。', 30, 'Sebut sejak kapan + gejala.'], ['びょうき です。', -15, 'Terlalu umum untuk dokter.'], ['わかりません。', -20, 'Jelaskan gejalamu.']]],
      ], 'Klinik: bawa 保険証, jelaskan gejala + sejak kapan (〜から熱があります).')],
      vocab: V(['保険証', 'ほけんしょう', 'hokenshou', 'kartu asuransi'], ['熱', 'ねつ', 'netsu', 'demam'], ['喉', 'のど', 'nodo', 'tenggorokan']) },
    11: { add: [TL('kitchen', 'boss', '🕵️', 'Pertanyaan petugas 保健所', 'Petugas kesehatan memeriksa dapur.', [
        ['れいぞうこ の おんど は なんど ですか？', 'Suhu kulkas berapa?', [['3ど です。まいにち きろく して います。', 30, 'Jawab angka + bukti pencatatan.'], ['つめたい です。', -15, 'Petugas butuh angka.'], ['わかりません。', -20, 'Lihat termometer & catatan.']]],
        ['なま の にく と やさい の まないた は？', 'Talenan daging mentah & sayur?', [['いろ で わけて います。にく は あか、やさい は みどり です。', 30, 'Pisah warna mencegah kontaminasi silang.'], ['おなじ の を あらって つかいます。', -20, 'Risiko keracunan makanan.'], ['きに して いません。', -30, 'Pelanggaran higiene.']]],
      ], 'Inspeksi: kulkas ≤10℃ (ideal ≤5℃) & dicatat, talenan dipisah warna untuk daging/ikan/sayur.')],
      vocab: V(['保健所', 'ほけんじょ', 'hokenjo', 'dinas kesehatan'], ['まな板', 'まないた', 'manaita', 'talenan'], ['生肉', 'なまにく', 'namaniku', 'daging mentah']) },
    12: { add: [TL('t2', 'c2', '🧑', 'Tamu mabuk minta tambah', 'Tamu yang sudah mabuk berat minta sake lagi dengan keras.', [
        ['おい！ さけ もう いっぽん！', 'Hei! Sake satu botol lagi!', [['おきゃくさま、すこし おみず を おもち しました。きょう は このへん で いかが でしょう。', 30, 'Tawarkan air & tolak halus. Utamakan keselamatan tamu.'], ['だめ！ のみすぎ！', -25, 'Kasar dan bisa memancing keributan.'], ['はい、すぐ！', -20, 'Melayani tamu yang sangat mabuk bisa berbahaya.']]],
        ['なんだと！ てんちょう よべ！', 'Apa?! Panggil tencho!', [['かしこまりました。しょうしょう おまち ください。', 30, 'Situasi sulit → serahkan ke tencho dengan tenang.'], ['よびません！', -25, 'Memperburuk keadaan.'], ['（にらみかえす）', -30, 'Jangan terpancing.']]],
      ], 'Tamu mabuk: tawarkan air, tolak halus, jangan berdebat; serahkan ke tencho bila memanas.', { cast: GUEST('c2', 'ryo', 7, 3) })],
      vocab: V(['酔う', 'よう', 'you', 'mabuk'], ['お水', 'おみず', 'omizu', 'air (sopan)'], ['店長', 'てんちょう', 'tenchou', 'manajer toko']) },
    13: { add: [TL('t1', 'nguyen', '👦', 'Nguyen-san lupa mengulang pesanan', 'Nguyen-san menerima pesanan tanpa mengulang.', [
        ['ちゅうもん、おぼえた から だいじょうぶ です。', 'Pesanannya sudah kuingat, aman.', [['いそがしい とき は わすれる から、かならず ふくしょう して、ハンディ に いれて ね。', 30, 'Beri alasan + cara (ulang & input).'], ['すごい ね！', -15, 'Membiarkan kebiasaan berisiko.'], ['だめ！ ばか！', -30, 'Merendahkan rekan kerja.']]],
        ['ふくしょう って、どう いう んですか？', 'Mengulang itu bilang gimana?', [['「〜と 〜 ですね。かしこまりました」って いう の。', 30, 'Beri kalimat contoh.'], ['じぶん で しらべて。', -15, 'Senpai sebaiknya membantu.'], ['てきとう に。', -20, 'Tidak membantu.']]],
      ], 'Mengajar: alasan + kalimat contoh 「〜と〜ですね。かしこまりました」.'),
      AC('t1', 'セッティング · Contohkan menyiapkan meja', '🍽️', 'meja 1', [['🧽', 'ダスター', 'テーブル を ふいて。', 'lap meja', 'swipe', '✨'], ['🥢', 'わりばし', 'はし と こざら を ならべて。', 'tata sumpit & piring kecil', 'taps:4', '🥢 ✓'], ['🧂', 'ちょうみりょう', 'しょうゆ の りょう を チェック。', 'cek isi kecap', 'tap', '🧂 ✓'], ['📋', 'メニュー', 'メニュー を まっすぐ おいて。', 'menu diletakkan rapi', 'tap', '📋 ✓']], [['🍺', 'ビール']], 'Setting meja: lap, sumpit & piring kecil, cek bumbu, menu rapi. Lakukan sama untuk setiap meja.')],
      vocab: V(['復唱', 'ふくしょう', 'fukushou', 'mengulang pesanan'], ['割り箸', 'わりばし', 'waribashi', 'sumpit sekali pakai'], ['小皿', 'こざら', 'kozara', 'piring kecil']) },
    14: { add: [TL('back', 'boss', '🧑‍⚖️', 'Ujian lisan restoran', 'Penguji menanyakan pelayanan.', [
        ['おきゃくさま が はいって きたら、さいしょ に なん と いいますか？', 'Saat tamu masuk, pertama bilang apa?', [['いらっしゃいませ。なんめいさま ですか？', 30, 'Salam + tanya jumlah orang.'], ['こんにちは。', -10, 'Di restoran dipakai いらっしゃいませ.'], ['なに に しますか？', -20, 'Pesanan ditanya setelah duduk.']]],
        ['しょくちゅうどく を ふせぐ 3げんそく は？', '3 prinsip mencegah keracunan?', [['つけない、ふやさない、やっつける です。', 30, 'Tidak menempelkan, tidak membiarkan berkembang, membasmi.'], ['あらう だけ です。', -15, 'Hanya sebagian.'], ['わかりません。', -20, 'Hafalkan: つけない・増やさない・やっつける.']]],
      ], 'Ujian: いらっしゃいませ・何名様ですか. Keracunan: つけない・増やさない・やっつける.'),
      { t: 'cash', at: 'reg', title: 'Ujian praktik: kasir & kembalian' }],
      vocab: V(['食中毒', 'しょくちゅうどく', 'shokuchuudoku', 'keracunan makanan'], ['原則', 'げんそく', 'gensoku', 'prinsip'], ['何名様', 'なんめいさま', 'nanmei-sama', 'berapa orang (sopan)']) },
    15: { add: [TL('door', 'c3', '👴', 'Pelanggan setia berpamitan', 'Kakek pelanggan tetap tahu hari ini hari terakhirmu.', [
        ['きょう で さいご なんだって？ さびしく なる なあ。', 'Katanya hari ini terakhir? Bakal sepi nih.', [['いつも きて くださって、ありがとう ございました。', 30, 'Terima kasih atas kunjungannya selama ini.'], ['うん、さいご。', -15, 'Terlalu santai untuk pelanggan.'], ['また きます よ。', -5, 'Jangan janji yang belum pasti.']]],
        ['にほんご、じょうず に なった ね。がんばれ よ。', 'Bahasa Jepangmu jadi pintar. Semangat ya.', [['おきゃくさま の おかげ です。どうぞ おげんき で。', 30, 'Rendah hati + doa sehat.'], ['まあね！', -15, 'Kurang sopan.'], ['（てれて だまる）', -5, 'Ucapkan terima kasih.']]],
      ], 'Perpisahan dengan pelanggan: 「いつも来てくださって、ありがとうございました」.', { cast: [{ k: 'c3', id: 'ojii', x: 2, y: 6, dir: 'right' }] }),
      { t: 'cash', at: 'reg', title: 'Kasir terakhir malam ini' },
      AC('kitchen', 'へいてん さぎょう · Tutup toko', '🏮', 'izakaya setelah tutup', [['🔥', 'ガス', 'ガス の もとせん を しめて。', 'tutup katup utama gas', 'hold', '🔥 OFF'], ['🧊', 'れいぞうこ', 'れいぞうこ の おんど を きろく。', 'catat suhu kulkas', 'tap', '3℃ 📝'], ['🧹', 'ゆか', 'ゆか を はいて、モップ。', 'sapu & pel lantai', 'swipe', '✨'], ['🔒', 'かぎ', 'さいご に かぎ を かけて。', 'kunci pintu', 'tap', '🔒 ✓']], [['🍶', 'さけ を のむ']], 'Tutup toko: gas mati, catat suhu kulkas, bersihkan lantai, kunci. Ini bagian penting dari kebersihan & keamanan.')],
      vocab: V(['閉店', 'へいてん', 'heiten', 'tutup toko'], ['元栓', 'もとせん', 'motosen', 'katup utama'], ['常連', 'じょうれん', 'jouren', 'pelanggan tetap']) },
  };

  /* =========================================================
     🌱 PERTANIAN
     ========================================================= */
  SC.nogyo = {
    1: { add: [TL('naya', 'boss', '👨‍🌾', 'Perkenalan dengan Pak Ogawa', 'Pak Ogawa, pemilik ladang, menyambutmu di gudang.', [
        ['とおい ところ から よく きた ね。のうぎょう は はじめて かい？', 'Jauh-jauh datang ya. Baru pertama bertani?', [['いいえ、くに で おや の はたけ を てつだって いました。', 30, 'Ceritakan pengalaman yang relevan.'], ['はい。でも かんたん でしょう？', -20, 'Meremehkan pekerjaan pertanian.'], ['…はい。', -5, 'Coba jawab lebih lengkap.']]],
        ['ここ の あさ は はやい よ。だいじょうぶ？', 'Di sini pagi sekali mulainya. Sanggup?', [['はい、がんばります。なんじ に くれば いい ですか？', 30, 'Siap + pastikan jam masuk.'], ['ねぼう する かも。', -15, 'Terdengar tidak bisa diandalkan.'], ['あさ は きらい です。', -25, 'Tidak pantas di hari pertama.']]],
      ], 'Perkenalan: ceritakan pengalaman, pastikan jam kerja (何時に来ればいいですか).')],
      vocab: V(['農業', 'のうぎょう', 'nougyou', 'pertanian'], ['畑', 'はたけ', 'hatake', 'ladang'], ['寝坊', 'ねぼう', 'nebou', 'kesiangan']) },
    2: { add: [TL('tomato', 'boss', '👨‍🌾', 'Lapor hasil panen', 'Pak Ogawa bertanya hasil panen pagi ini.', [
        ['なんケース とれた？', 'Dapat berapa kotak?', [['12ケース です。きず の ある もの は べつ に 2ケース あります。', 30, 'Angka jelas + info barang cacat.'], ['たくさん です。', -15, 'Petani butuh angka untuk pengiriman.'], ['かぞえて いません。', -20, 'Selalu hitung hasil panen.']]],
        ['きず もの は どう する？', 'Yang cacat diapakan?', [['かこう よう に わけて おきます。すてません。', 30, 'Barang cacat bisa untuk olahan (加工用).'], ['すてます。', -10, 'Sayang; tanyakan dulu.'], ['いっしょ に いれます。', -25, 'Mencampur barang cacat merusak kepercayaan pembeli.']]],
      ], 'Laporan panen: jumlah kotak + barang cacat dipisah (加工用).'),
      { t: 'harvest', at: 'tomato', crop: 'tomato', title: 'Panen tomat ceri kedua', mix: ['ripe', 'ripe', 'half', 'half', 'green'] }],
      vocab: V(['収穫', 'しゅうかく', 'shuukaku', 'panen'], ['傷物', 'きずもの', 'kizumono', 'barang cacat'], ['加工用', 'かこうよう', 'kakou you', 'untuk olahan']) },
    3: { add: [TL('naya', 'boss', '👨‍🌾', 'Tanya nama alat', 'Pak Ogawa menyuruh mengambil alat yang belum kamu kenal.', [
        ['くわ もって きて。', 'Ambilkan kuwa.', [['すみません、くわ は どれ ですか？', 30, 'Tidak tahu → tanya sebelum mengambil.'], ['（かま を もって いく）', -20, 'Menebak membuang waktu.'], ['ない です。', -15, 'Cek dulu atau tanya.']]],
        ['この ながい の。つち を たがやす どうぐ だ。', 'Yang panjang ini. Alat menggemburkan tanah.', [['くわ は つち を たがやす どうぐ ですね。おぼえました。', 30, 'Ulangi nama + fungsi supaya hafal.'], ['へえ。', -10, 'Tunjukkan bahwa kamu paham.'], ['くに と おなじ だ。', 5, 'Bagus, sambungkan dengan pengetahuanmu, tapi hafalkan nama Jepangnya.']]],
      ], 'Tanya: 「〜はどれですか」, lalu ulangi nama + fungsi alat.')],
      vocab: V(['鍬', 'くわ', 'kuwa', 'cangkul'], ['鎌', 'かま', 'kama', 'sabit'], ['耕す', 'たがやす', 'tagayasu', 'menggemburkan tanah']) },
    4: { add: [TL('tomato', 'boss', '👨‍🌾', 'Mengaku salah petik', 'Kamu memetik tomat hijau terlalu banyak.', [
        ['あれ？ あおい の が たくさん ある な。', 'Lho? Banyak yang hijau.', [['すみません。わたし が まちがえて とりました。', 30, 'Akui kesalahan dengan jujur.'], ['もともと あおかった です。', -25, 'Berbohong merusak kepercayaan.'], ['ほか の ひと です。', -30, 'Menyalahkan orang lain.']]],
        ['いろ の みかた、もう いちど おしえる よ。', 'Kuajari lagi cara melihat warna.', [['ありがとう ございます。メモ して おぼえます。', 30, 'Terima pelajaran & catat.'], ['だいじょうぶ です。', -15, 'Kesalahan bisa terulang.'], ['めんどう です。', -30, 'Tidak sopan.']]],
      ], 'Salah: akui (私が間違えました), terima penjelasan, catat.'),
      { t: 'harvest', at: 'tomato', crop: 'tomato', title: 'Panen ulang: hanya yang merah penuh', mix: ['ripe', 'half', 'half', 'green', 'green', 'ripe'] }],
      vocab: V(['青い', 'あおい', 'aoi', 'hijau (belum matang)'], ['間違える', 'まちがえる', 'machigaeru', 'salah'], ['見方', 'みかた', 'mikata', 'cara melihat']) },
    5: { add: [TL('senka', 'boss', '👨‍🌾', 'Tanya potongan asrama', 'Kamu bertanya soal potongan biaya asrama di slip gaji.', [
        ['きゅうりょう、なにか しつもん ある？', 'Ada pertanyaan soal gaji?', [['すみません、この「りょうひ」は なん ですか？', 30, 'Tanyakan potongan yang tidak jelas.'], ['すくない です！', -20, 'Tanya dulu, jangan langsung protes.'], ['ありません。', -5, 'Sebaiknya pahami slip gajimu.']]],
        ['りょう の やちん と すいどうだい だよ。けいやくしょ に かいて ある。', 'Sewa asrama & air. Ada di kontrak.', [['けいやくしょ と くらべて かくにん します。', 30, 'Cocokkan dengan kontrak (契約書).'], ['そう ですか。', 0, 'Lebih baik dicek.'], ['はらいたく ない です。', -25, 'Potongan sesuai kontrak sah.']]],
      ], 'Slip gaji: cocokkan potongan (寮費, 水道代) dengan kontrak kerja (契約書).'),
      { t: 'bins', at: 'senka', title: 'Kemas sesuai tujuan kirim', bins: [['ja', '🏢', 'JA (のうきょう)', 'koperasi'], ['super', '🛒', 'スーパー', 'supermarket'], ['kakou', '🥫', 'かこうよう', 'olahan']],
        items: [['🍅', 'まっか で かたち が いい', 'merah, bentuk bagus', 'super'], ['🍅', 'Mサイズ・ふつう', 'ukuran M biasa', 'ja'], ['🍅', 'すこし われて いる', 'sedikit retak', 'kakou', 'Retak → olahan (jus, saus).'], ['🍅', 'Lサイズ・きれい', 'L, mulus', 'super'], ['🍅', 'かたち が わるい', 'bentuk jelek', 'kakou'], ['🍅', 'Sサイズ・ふつう', 'S biasa', 'ja']], why: 'Supermarket meminta kualitas tinggi, JA standar, yang cacat ke olahan supaya tidak terbuang.' }],
      vocab: V(['寮費', 'りょうひ', 'ryouhi', 'biaya asrama'], ['契約書', 'けいやくしょ', 'keiyakusho', 'surat kontrak'], ['農協', 'のうきょう', 'noukyou', 'koperasi pertanian (JA)']) },
    6: { add: [TL('ichigo', 'boss', '👨‍🌾', 'Stroberi itu lembut', 'Pak Ogawa melihatmu memegang stroberi terlalu kuat.', [
        ['いちご は ゆび で おしたら だめ だ。', 'Stroberi jangan ditekan jari.', [['すみません。へた の ところ を もって とります。', 30, 'Pegang di tangkai (へた), jangan buahnya.'], ['ちょっと だけ です。', -15, 'Bekas tekanan membuat stroberi cepat busuk.'], ['でも はやく できます。', -20, 'Kualitas lebih penting.']]],
        ['なぜ だと おもう？', 'Menurutmu kenapa?', [['おした ところ から くさる から です。', 30, 'Paham alasan.'], ['しりません。', -10, 'Pikirkan alasannya.'], ['かたい から です。', -15, 'Justru karena lembut.']]],
      ], 'Stroberi: pegang tangkai (へた), jangan ditekan, letakkan satu lapis di wadah.'),
      { t: 'harvest', at: 'ichigo', crop: 'ichigo', title: 'Panen stroberi pagi buta (paling manis)' }],
      vocab: V(['苺', 'いちご', 'ichigo', 'stroberi'], ['へた', 'へた', 'heta', 'tangkai buah'], ['腐る', 'くさる', 'kusaru', 'busuk']) },
    7: { add: [TL('vent', 'boss', '👨‍🌾', 'Pak Ogawa menyuruh istirahat', 'Pak Ogawa melihatmu terus bekerja di rumah kaca 38℃.', [
        ['おい、やすめ。みず のんだ か？', 'Hei, istirahat. Sudah minum?', [['まだ です。すぐ のみます。ありがとう ございます。', 30, 'Jujur & segera minum.'], ['だいじょうぶ です、まだ できます。', -25, 'Di rumah kaca, heat stroke datang cepat.'], ['あとで のみます。', -15, 'Minum sebelum haus.']]],
        ['ハウス の なか は ひる は はいるな。あさ と ゆうがた に やる。', 'Siang jangan masuk rumah kaca. Kerja pagi & sore.', [['わかりました。ひる は そと の しごと を します。', 30, 'Ikuti jadwal untuk menghindari panas.'], ['でも おわりません。', -10, 'Kesehatan lebih penting.'], ['ひる が いい です。', -20, 'Siang paling berbahaya.']]],
      ], 'Rumah kaca: minum sebelum haus, hindari siang hari, kerja pagi & sore.'),
      { t: 'dial', at: 'vent', title: 'Turunkan suhu rumah kaca: buka ventilasi', min: 20, max: 45, start: 38, target: [24, 28], hint: 'Geser ke suhu ideal tomat (24–28℃), lalu cek termometer.', check: '🌡️ Cek termometer', hot: 'あつすぎる！ Bunga tomat rontok di atas 30℃.', cold: 'さむすぎる… Pertumbuhan melambat.', good: 'ちょうど いい！ Suhu ideal.', ask: false }],
      vocab: V(['ハウス', 'ハウス', 'hausu', 'rumah kaca'], ['休む', 'やすむ', 'yasumu', 'istirahat'], ['夕方', 'ゆうがた', 'yuugata', 'sore']) },
    8: { add: [TL('truck', 'boss', '🧑‍💼', 'Petugas JA di tempat pengiriman', 'Petugas koperasi memeriksa kotak kirimanmu.', [
        ['この はこ、ラベル が はって ありません ね。', 'Kotak ini belum berlabel.', [['もうしわけ ありません。すぐ はります。', 30, 'Minta maaf & segera perbaiki.'], ['あとで いい でしょう。', -20, 'Tanpa label, produk tidak bisa dilacak (トレーサビリティ).'], ['わたし の じゃ ない。', -25, 'Satu tim bertanggung jawab.']]],
        ['せいさんしゃ の なまえ と ひづけ を わすれずに。', 'Jangan lupa nama produsen & tanggal.', [['おがわ のうえん、きょう の ひづけ ですね。かくにん しました。', 30, 'Ulangi isi label.'], ['はい はい。', -15, 'Terdengar tidak serius.'], ['ひづけ は いりません よね？', -20, 'Tanggal wajib.']]],
      ], 'Label kiriman: nama produsen + tanggal panen, supaya bisa dilacak (トレーサビリティ).')],
      vocab: V(['出荷', 'しゅっか', 'shukka', 'pengiriman hasil panen'], ['生産者', 'せいさんしゃ', 'seisansha', 'produsen'], ['日付', 'ひづけ', 'hizuke', 'tanggal']) },
    9: { add: [TL('field', 'nguyen', '🧑', 'Rekan hampir masuk area semprot', 'Seorang rekan berjalan ke petak yang baru disemprot pestisida.', [
        ['ちょっと トマト とって くる ね。', 'Sebentar, ambil tomat ya.', [['まって！ そこ は けさ のうやく を まいた ところ です！', 30, 'Hentikan dengan alasan jelas.'], ['いって らっしゃい。', -30, 'Membiarkan rekan terpapar pestisida.'], ['（だまって みる）', -25, 'Diam = ikut bertanggung jawab.']]],
        ['え、ほんとう？ ひょうじ が なかった よ。', 'Eh, benar? Tidak ada tanda.', [['じゃあ、たてふだ を たてて、おがわ さん に つたえます。', 30, 'Pasang tanda & lapor supaya tidak terulang.'], ['まあ いい か。', -20, 'Orang lain bisa masuk.'], ['あなた の せい です。', -20, 'Fokus pada pencegahan.']]],
      ], 'Area pestisida: hentikan orang yang masuk, pasang papan (立て札), laporkan.')],
      vocab: V(['農薬', 'のうやく', 'nouyaku', 'pestisida'], ['撒く', 'まく', 'maku', 'menyemprot / menabur'], ['立て札', 'たてふだ', 'tatefuda', 'papan tanda']) },
    10: { add: [TL('kitchen', 'boss', '👵', 'Tetangga memberi sayur', 'Nenek tetangga desa datang membawa sayuran untukmu.', [
        ['これ、うち で とれた の。おすそわけ。', 'Ini dari kebunku. Untuk dibagi.', [['わあ、ありがとう ございます！ だいじ に いただきます。', 30, 'Terima dengan rasa terima kasih.'], ['いりません。', -25, 'Menolak pemberian terasa tidak sopan.'], ['いくら ですか？', -15, 'おすそわけ adalah hadiah, bukan dijual.']]],
        ['インドネシア の りょうり、つくれる？', 'Bisa masak masakan Indonesia?', [['はい！ こんど この やさい で つくって、もって きます ね。', 30, 'Membalas kebaikan (お返し) mempererat hubungan desa.'], ['できません。', -5, 'Coba tawarkan hal lain.'], ['めんどう です。', -30, 'Merusak hubungan dengan tetangga.']]],
      ], 'Hidup di desa: お裾分け (berbagi hasil kebun) diterima dengan terima kasih, lalu dibalas (お返し).')],
      vocab: V(['お裾分け', 'おすそわけ', 'osusowake', 'berbagi pemberian'], ['お返し', 'おかえし', 'okaeshi', 'balasan pemberian'], ['近所', 'きんじょ', 'kinjo', 'tetangga sekitar']) },
    11: { add: [TL('field', 'boss', '🧑‍💼', 'Bicara dengan pembeli supermarket', 'Pembeli dari supermarket bertanya kepadamu langsung.', [
        ['この トマト は いつ しゅうかく した ものですか？', 'Tomat ini dipanen kapan?', [['けさ 6じ に しゅうかく いたしました。', 30, 'Keigo + waktu tepat.'], ['きのう か きょう。', -15, 'Pastikan jawaban tepat.'], ['わかんない。', -30, 'Bahasa terlalu kasar untuk pembeli.']]],
        ['のうやく は つかって います か？', 'Pakai pestisida?', [['きじゅん に そって つかって います。くわしく は おがわ から ごせつめい いたします。', 30, 'Jawab umum & serahkan detail ke pemilik.'], ['ぜんぜん つかって いません！', -25, 'Jangan berbohong demi menyenangkan pembeli.'], ['ひみつ です。', -20, 'Terdengar mencurigakan.']]],
      ], 'Dengan pembeli: keigo (いたしました), jawab jujur, detail diserahkan ke pemilik.')],
      vocab: V(['基準', 'きじゅん', 'kijun', 'standar'], ['説明', 'せつめい', 'setsumei', 'penjelasan'], ['今朝', 'けさ', 'kesa', 'tadi pagi']) },
    12: { add: [TL('field', 'boss', '👨‍🌾', 'Lapor hama di daun', 'Kamu menemukan daun berbintik dan serangga kecil.', [
        ['どこ で みつけた？', 'Di mana menemukannya?', [['3ばん の うね の、おく から 5ほんめ です。しゃしん も とりました。', 30, 'Lokasi tepat + foto = cepat ditangani.'], ['あっち の ほう。', -15, 'Terlalu kabur.'], ['わすれました。', -20, 'Catat lokasinya.']]],
        ['ほか の かぶ は どう だ？', 'Tanaman lain bagaimana?', [['まわり の 10かぶ を みましたが、まだ ありません でした。', 30, 'Cek sekitar → laporan lengkap.'], ['みて いません。', -10, 'Cek tanaman sekitarnya juga.'], ['ぜんぶ だめ です。', -15, 'Jangan melebih-lebihkan tanpa cek.']]],
      ], 'Laporan hama: lokasi (畝・株), foto, kondisi tanaman sekitar.'),
      AC('field', 'Singkirkan daun sakit tanpa menyebarkan', '🌿', 'tanaman tomat sakit', [['🧤', 'てぶくろ', 'つかいすて てぶくろ を して。', 'sarung tangan sekali pakai', 'tap', '🧤 ✓'], ['✂️', 'はさみ', 'びょうき の は を きって。', 'potong daun sakit', 'taps:3', '✂️ ✓'], ['🛍️', 'ふくろ', 'ふくろ に いれて、とじて。', 'masukkan kantong & tutup', 'tap', '🛍️ ✓'], ['🧴', 'しょうどく', 'はさみ を しょうどく。', 'desinfeksi gunting', 'swipe', '✨']], [['🌱', 'ほか の かぶ を さわる']], 'Daun sakit dipotong & dibungkus, gunting didesinfeksi supaya penyakit tidak pindah ke tanaman lain.')],
      vocab: V(['害虫', 'がいちゅう', 'gaichuu', 'hama'], ['畝', 'うね', 'une', 'bedengan'], ['株', 'かぶ', 'kabu', 'batang tanaman']) },
    13: { add: [TL('tomato', 'nguyen', '👦', 'Nguyen-san salah gunting', 'Nguyen-san memotong tangkai tomat terlalu panjang.', [
        ['これ で いい ですか？', 'Begini sudah benar?', [['おしい！ ヘタ の うえ で みじかく きって。ながい と ほか の トマト を きずつける から。', 30, 'Puji usaha, koreksi + alasan.'], ['だめ！ ぜんぜん ちがう！', -20, 'Terlalu keras untuk pekerja baru.'], ['いい よ。', -15, 'Membiarkan kesalahan.']]],
        ['あ、なるほど。もう いちど やって みます。', 'Oh begitu. Kucoba lagi.', [['そう そう、じょうず！', 30, 'Puji saat sudah benar (褒める).'], ['おそい ね。', -15, 'Fokus pada ketepatan dulu.'], ['（みない）', -10, 'Awasi sampai benar.']]],
      ], 'Mengajar: puji usaha, koreksi + alasan, puji lagi saat benar.'),
      { t: 'harvest', at: 'tomato', crop: 'tomato', title: 'Contohkan panen ke Nguyen-san', mix: ['ripe', 'ripe', 'ripe', 'half', 'green'] }],
      vocab: V(['惜しい', 'おしい', 'oshii', 'hampir benar'], ['傷つける', 'きずつける', 'kizutsukeru', 'melukai'], ['上手', 'じょうず', 'jouzu', 'pintar']) },
    14: { add: [TL('naya', 'boss', '🧑‍⚖️', 'Ujian lisan pertanian', 'Penguji menanyaimu di gudang.', [
        ['のうやく を つかう とき の ほごぐ は？', 'APD saat memakai pestisida?', [['マスク、ゴーグル、てぶくろ、ながそで です。', 30, 'Sebut lengkap.'], ['マスク だけ です。', -10, 'Kurang lengkap.'], ['いりません。', -30, 'Berbahaya.']]],
        ['しゅうかく した トマト は どこ に おく？', 'Tomat hasil panen ditaruh di mana?', [['ひかげ の すずしい ところ です。', 30, 'Hindari sinar matahari langsung.'], ['ひなた です。', -20, 'Cepat rusak.'], ['どこ でも。', -15, 'Kualitas turun.']]],
      ], 'Ujian: APD pestisida (masker, kacamata, sarung tangan, lengan panjang); hasil panen di tempat teduh.'),
      { t: 'dial', at: 'vent', title: 'Ujian praktik: atur suhu malam rumah kaca', min: 5, max: 30, start: 9, target: [12, 16], hint: 'Malam hari tomat butuh 12–16℃. Nyalakan pemanas.', check: '🌡️ Cek', hot: 'あたたかすぎる. Boros bahan bakar.', cold: 'さむい！ Tanaman bisa rusak.', good: 'ちょうど いい！', ask: false },
      { t: 'harvest', at: 'ichigo', crop: 'ichigo', title: 'Ujian praktik: panen stroberi 30 detik', limit: 30000 }],
      vocab: V(['保護具', 'ほごぐ', 'hogogu', 'alat pelindung'], ['日陰', 'ひかげ', 'hikage', 'teduh'], ['暖房', 'だんぼう', 'danbou', 'pemanas']) },
    15: { add: [TL('naya', 'boss', '👨‍🌾', 'Pak Ogawa berterima kasih', 'Pak Ogawa memberimu sekotak tomat terbaik.', [
        ['これ、もって かえれ。いちばん いい トマト だ。', 'Bawa pulang. Tomat terbaik.', [['ありがとう ございます！ おがわ さん の トマト、わすれません。', 30, 'Terima dengan terima kasih.'], ['いりません。', -20, 'Menolak hadiah terasa tidak sopan.'], ['もっと ください。', -25, 'Tidak sopan.']]],
        ['くに に かえっても、つち を だいじ に しろ よ。', 'Walau pulang, jaga tanahmu ya.', [['はい。ここ で ならった こと を、くに の はたけ でも つかいます。', 30, 'Tunjukkan rencana menerapkan ilmu.'], ['はい はい。', -15, 'Kurang menghargai.'], ['もう のうぎょう は しません。', -10, 'Boleh, tapi sampaikan dengan sopan.']]],
      ], 'Perpisahan: terima hadiah dengan terima kasih, sampaikan rencana memakai ilmu.'),
      { t: 'harvest', at: 'tomato', crop: 'tomato', title: 'Panen besar terakhir', mix: ['ripe', 'ripe', 'ripe', 'ripe', 'half', 'green'] },
      AC('naya', 'どうぐ の ていれ · Rawat alat sebelum pulang', '🧰', 'gudang alat', [['🧽', 'たわし', 'はさみ の つち を おとして。', 'bersihkan tanah dari gunting', 'swipe', '✨'], ['🛢️', 'あぶら', 'はもの に あぶら を さして。', 'minyaki bilah', 'tap', '🛢️ ✓'], ['🪝', 'かべ', 'もと の ばしょ に かけて。', 'gantung di tempat semula', 'tap', '🪝 ✓']], [['🍅', 'トマト']], 'Merawat alat (手入れ) membuat alat awet & aman. Kembalikan ke tempatnya untuk pekerja berikutnya.')],
      vocab: V(['手入れ', 'ていれ', 'teire', 'perawatan alat'], ['刃物', 'はもの', 'hamono', 'benda tajam'], ['土', 'つち', 'tsuchi', 'tanah']) },
  };

  /* =========================================================
     🐄 PETERNAKAN
     ========================================================= */
  SC.chikusan = {
    1: { add: [TL('office', 'boss', '👩‍🌾', 'Perkenalan dengan Bu Hayashi', 'Bu Hayashi menjelaskan peternakan.', [
        ['うし が 40とう、にわとり が 3000わ いる の。どうぶつ は すき？', 'Ada 40 sapi, 3000 ayam. Suka hewan?', [['はい、すき です。でも うし は はじめて なので、おしえて ください。', 30, 'Antusias + jujur soal pengalaman.'], ['きらい です。', -25, 'Tidak cocok diucapkan di peternakan.'], ['くさい です ね。', -20, 'Tidak sopan.']]],
        ['どうぶつ は いきもの。まいにち やすみ が ない の。', 'Hewan itu makhluk hidup. Tiap hari tanpa libur.', [['わかりました。シフト を まもって、きちんと せわ します。', 30, 'Paham tanggung jawab & jadwal shift.'], ['やすみ が ない の は いや です。', -10, 'Shift diatur bergantian; tanyakan jadwalnya.'], ['じゃあ たまに なら。', -20, 'Hewan butuh perawatan setiap hari.']]],
      ], 'Peternakan: hewan dirawat setiap hari dengan sistem shift. 世話をする = merawat.')],
      vocab: V(['頭', 'とう', 'tou', 'satuan ekor (sapi)'], ['羽', 'わ', 'wa', 'satuan ekor (ayam)'], ['世話', 'せわ', 'sewa', 'merawat']) },
    2: { add: [TL('feed', 'boss', '👩‍🌾', 'Pastikan takaran pakan', 'Kamu tidak yakin takaran pakan sapi nomor 3.', [
        ['3ばん の うし、えさ は いれた？', 'Sapi no. 3 sudah dikasih pakan?', [['まだ です。3ばん は なんキロ ですか？ ホワイトボード に かいて ありません でした。', 30, 'Tanya angka pasti & sebut alasannya.'], ['たぶん 10キロ で いれました。', -25, 'Menebak takaran bisa membuat sapi sakit.'], ['わすれました。', -15, 'Tanya, jangan dilewati.']]],
        ['3ばん は にんしん ちゅう だから 8キロ。かいて おいて。', 'No. 3 sedang hamil, 8 kg. Tolong ditulis.', [['3ばん、にんしん ちゅう、8キロ。ボード に かきます。', 30, 'Ulangi + catat untuk shift berikutnya.'], ['はい。', 0, 'Lebih aman jika dicatat.'], ['おぼえて おきます。', -10, 'Shift lain tidak tahu kalau tidak ditulis.']]],
      ], 'Takaran pakan: tanya angka pasti, ulangi, tulis di papan untuk semua shift.')],
      vocab: V(['餌', 'えさ', 'esa', 'pakan'], ['妊娠中', 'にんしんちゅう', 'ninshin chuu', 'sedang hamil'], ['書いておく', 'かいておく', 'kaite oku', 'menuliskan']) },
    3: { add: [TL('barn', 'boss', '👩‍🌾', 'Alat membersihkan kandang', 'Bu Hayashi menyebut alat yang belum kamu kenal.', [
        ['フォーク で しきわら を かえて。', 'Ganti jerami alas dengan garpu.', [['すみません、フォーク は この おおきい の ですか？', 30, 'Konfirmasi alat sebelum dipakai.'], ['（てで やる）', -15, 'Alat yang tepat lebih aman & cepat.'], ['しきわら って なん ですか？', 15, 'Bagus bertanya, tanyakan juga alatnya.']]],
        ['そう。ふるい わら は たいひば へ。', 'Ya. Jerami lama ke tempat kompos.', [['ふるい わら は たいひば ですね。', 30, 'Ulangi tujuan.'], ['ゴミばこ に すてます。', -20, 'Kotoran & jerami jadi kompos (堆肥).'], ['どこ でも いい です か？', -10, 'Tanya jelas.']]],
      ], 'Kandang: 敷きわら (jerami alas) diganti, yang lama ke 堆肥場 (tempat kompos).')],
      vocab: V(['敷きわら', 'しきわら', 'shikiwara', 'jerami alas'], ['堆肥', 'たいひ', 'taihi', 'kompos'], ['牛舎', 'ぎゅうしゃ', 'gyuusha', 'kandang sapi']) },
    4: { add: [TL('barn', 'boss', '👩‍🌾', 'Lapor hampir ditendang sapi', 'Kamu hampir ditendang karena mendekati sapi dari belakang.', [
        ['だいじょうぶ？ なにが あった の？', 'Tidak apa? Ada apa?', [['うし の うしろ から ちかづいて、けられそう に なりました。けが は ありません。', 30, 'Kejadian + penyebab + akibat.'], ['うし が わるい です。', -25, 'Sapi bereaksi karena kaget.'], ['なんでも ない です。', -20, 'ヒヤリハット harus dilaporkan.']]],
        ['つぎ は どう する？', 'Lain kali bagaimana?', [['まえ から こえ を かけて、ゆっくり ちかづきます。', 30, 'Tindakan pencegahan konkret.'], ['はやく とおります。', -20, 'Gerakan cepat membuat sapi kaget.'], ['もう ちかづきません。', -10, 'Harus tetap bekerja, dengan cara aman.']]],
      ], 'Sapi: dekati dari depan/samping sambil bersuara, jangan dari belakang.')],
      vocab: V(['蹴る', 'ける', 'keru', 'menendang'], ['近づく', 'ちかづく', 'chikazuku', 'mendekat'], ['後ろ', 'うしろ', 'ushiro', 'belakang']) },
    5: { add: [TL('office', 'boss', '👩‍🌾', 'Shift pagi buta', 'Bu Hayashi bertanya apakah kamu bisa shift jam 4 pagi minggu depan.', [
        ['らいしゅう、あさ 4じ の シフト、はいれる？', 'Minggu depan bisa shift jam 4 pagi?', [['はい、だいじょうぶ です。そうちょう てあて は ありますか？', 30, 'Setuju + tanya tunjangan dengan sopan.'], ['むり です。', -15, 'Beri alasan atau alternatif.'], ['ねむい から いや。', -25, 'Terlalu santai.']]],
        ['あるわよ。きゅうよめいさい に でる から。', 'Ada. Muncul di slip gaji.', [['わかりました。めいさい で かくにん します。', 30, 'Cek slip gaji.'], ['いくら ですか？ いま おしえて。', -5, 'Boleh bertanya, tapi dengan sopan.'], ['どうでも いい です。', -15, 'Pahami hakmu.']]],
      ], 'Shift dini hari: boleh tanya 早朝手当 (tunjangan pagi) dengan sopan, cek di slip gaji.')],
      vocab: V(['早朝', 'そうちょう', 'souchou', 'dini hari'], ['手当', 'てあて', 'teate', 'tunjangan'], ['入る', 'はいる', 'hairu', 'masuk (shift)']) },
    6: { add: [TL('parlor', 'boss', '👩‍🌾', 'Sapi gelisah saat diperah', 'Sapi nomor 7 menendang-nendang. Kamu memanggil Bu Hayashi.', [
        ['どうした の？', 'Ada apa?', [['7ばん が おちつきません。ちぶさ を さわる と いやがります。', 30, 'Sebut nomor + gejala.'], ['うし が うるさい です。', -15, 'Kurang informatif.'], ['（ひとり で つづける）', -25, 'Bisa terluka & ambing sakit tidak ketahuan.']]],
        ['ちぶさ が はれて いる かも。さわって みて、あつい？', 'Mungkin ambing bengkak. Raba, panas?', [['はい、みぎ の うしろ が あつい です。', 30, 'Detail lokasi membantu diagnosis mastitis.'], ['わかりません。', -10, 'Raba dan bandingkan.'], ['こわい です。', 0, 'Wajar, minta ditemani.']]],
      ], 'Sapi gelisah saat diperah: bisa mastitis. Laporkan nomor sapi + bagian ambing yang panas/bengkak.')],
      vocab: V(['乳房', 'ちぶさ', 'chibusa', 'ambing'], ['腫れる', 'はれる', 'hareru', 'bengkak'], ['落ち着く', 'おちつく', 'ochitsuku', 'tenang']) },
    7: { add: [TL('barn', 'boss', '👩‍🌾', 'Sapi kepanasan', 'Sapi-sapi bernapas cepat dengan mulut terbuka.', [
        ['うし の ようす、どう？', 'Kondisi sapi bagaimana?', [['こきゅう が はやくて、くち を あけて います。みず も あまり のんで いません。', 30, 'Gejala heat stress: napas cepat, mulut terbuka.'], ['げんき です。', -25, 'Gejala tidak diperhatikan.'], ['ねて います。', -10, 'Perhatikan napasnya.']]],
        ['ファン と ミスト、つけて くれる？', 'Nyalakan kipas & kabut air?', [['はい、すぐ つけます。みずのみば も そうじ します。', 30, 'Tindakan + inisiatif tambahan.'], ['あとで。', -20, 'Heat stress harus cepat ditangani.'], ['でんき だい が たかい です よ。', -15, 'Kesehatan hewan lebih penting.']]],
      ], 'Heat stress sapi: napas cepat, mulut terbuka, kurang minum → kipas, kabut air, air bersih.'),
      { t: 'dial', at: 'barn', title: 'Atur kipas & kabut kandang', min: 20, max: 38, start: 33, target: [22, 26], unit: '℃', hint: 'Turunkan suhu kandang ke 22–26℃.', check: '🌡️ Cek', hot: 'まだ あつい！ Sapi kepanasan.', cold: 'ひえすぎ. Terlalu dingin & boros.', good: 'ちょうど いい！', ask: false }],
      vocab: V(['呼吸', 'こきゅう', 'kokyuu', 'pernapasan'], ['水飲み場', 'みずのみば', 'mizunomiba', 'tempat minum'], ['ミスト', 'ミスト', 'misuto', 'kabut air']) },
    8: { add: [TL('barn', 'boss', '👩‍🌾', 'Anak sapi lahir', 'Bu Hayashi membantu kelahiran dan memintamu membantu.', [
        ['タオル と ヨード、もって きて！', 'Bawakan handuk & yodium!', [['タオル と ヨード ですね。すぐ もって きます！', 30, 'Ulangi singkat & bergerak cepat.'], ['ヨード って なん ですか？', 10, 'Boleh tanya, tapi cepat.'], ['（あわてて なにも しない）', -25, 'Tetap tenang & bergerak.']]],
        ['こうし の からだ を ふいて。いきして る？', 'Lap tubuh anak sapi. Bernapas?', [['はい、いき を して います。うごいて います！', 30, 'Laporkan kondisi napas & gerak.'], ['わかりません。', -15, 'Perhatikan dada & hidung.'], ['かわいい〜！', -5, 'Lucu, tapi laporkan kondisinya dulu.']]],
      ], 'Kelahiran: handuk untuk mengeringkan, yodium untuk pusar, laporkan napas anak sapi.')],
      vocab: V(['子牛', 'こうし', 'koushi', 'anak sapi'], ['息', 'いき', 'iki', 'napas'], ['拭く', 'ふく', 'fuku', 'mengelap']) },
    9: { add: [TL('coop', 'boss', '👩‍🌾', 'Lapor pintu kandang terbuka', 'Pagi ini pintu kandang ayam tidak terkunci.', [
        ['だれ が さいご に しめた の？', 'Siapa yang terakhir menutup?', [['きのう の よる、わたし です。かぎ の かくにん を わすれました。もうしわけ ありません。', 30, 'Akui dengan jujur.'], ['わかりません。', -15, 'Kalau kamu, akui.'], ['かぜ で あいた と おもいます。', -25, 'Mencari alasan.']]],
        ['どうぶつ が はいったら、びょうき が ひろがる の。', 'Kalau binatang masuk, penyakit menyebar.', [['これから は しめた あと、「かぎ、ヨシ」と ゆびさし かくにん します。', 30, 'Pencegahan konkret: 指差し確認.'], ['きを つけます。', 0, 'Lebih baik sebutkan cara konkret.'], ['にわとり は だいじょうぶ でした。', -15, 'Risiko tetap ada.']]],
      ], 'Pintu kandang: binatang liar membawa penyakit (flu burung). Kunci + 指差し確認 「かぎ、ヨシ」.')],
      vocab: V(['鍵', 'かぎ', 'kagi', 'kunci'], ['広がる', 'ひろがる', 'hirogaru', 'menyebar'], ['指差し確認', 'ゆびさしかくにん', 'yubisashi kakunin', 'tunjuk & cek']) },
    10: { add: [TL('genkan', 'boss', '👮', 'Polisi memeriksa sepeda', 'Polisi menghentikanmu saat bersepeda ke supermarket.', [
        ['すみません、じてんしゃ の ぼうはん とうろく を かくにん させて ください。', 'Maaf, boleh cek registrasi sepeda?', [['はい、どうぞ。これ が ステッカー です。', 30, 'Tenang & kooperatif. Sepeda wajib 防犯登録.'], ['なにも わるい こと して ない！', -20, 'Ini pemeriksaan rutin.'], ['（にげる）', -30, 'Jangan pernah lari dari polisi.']]],
        ['よる は ライト を つけて ください ね。', 'Malam nyalakan lampu ya.', [['はい、わかりました。きを つけます。', 30, 'Aturan sepeda: lampu malam, tidak berdua, tidak pakai HP.'], ['ライト は ありません。', -10, 'Pasang lampu, wajib.'], ['いなか だから だいじょうぶ。', -15, 'Aturan berlaku di mana saja.']]],
      ], 'Sepeda di Jepang: 防犯登録 wajib, lampu di malam hari, jangan pakai HP/payung sambil mengayuh.')],
      vocab: V(['自転車', 'じてんしゃ', 'jitensha', 'sepeda'], ['防犯登録', 'ぼうはんとうろく', 'bouhan touroku', 'registrasi anti-curi'], ['警察', 'けいさつ', 'keisatsu', 'polisi']) },
    11: { add: [TL('barn', 'boss', '🧑‍⚕️', 'Menjawab dokter hewan', 'Dokter hewan bertanya tentang sapi nomor 12.', [
        ['12ばん、いつ から えさ を のこして います か？', 'No. 12 mulai kapan menyisakan pakan?', [['おととい の ゆうがた から です。きのう は はんぶん のこしました。', 30, 'Sejak kapan + seberapa.'], ['さいきん です。', -15, 'Dokter butuh waktu tepat.'], ['わかりません。', -20, 'Catatan harian penting.']]],
        ['うんち の ようす は？', 'Kotorannya bagaimana?', [['すこし ゆるい です。いろ は ふつう です。', 30, 'Konsistensi + warna.'], ['みて いません。', -15, 'Kotoran adalah indikator kesehatan.'], ['くさい です。', -10, 'Kurang informatif.']]],
      ], 'Laporan ke dokter hewan: sejak kapan, seberapa (nafsu makan), kondisi kotoran.')],
      vocab: V(['獣医', 'じゅうい', 'juui', 'dokter hewan'], ['残す', 'のこす', 'nokosu', 'menyisakan'], ['一昨日', 'おととい', 'ototoi', 'kemarin lusa']) },
    12: { add: [TL('coop', 'boss', '📞', 'Telepon darurat ke Bu Hayashi', 'Kamu menemukan banyak ayam mati dan menelepon Bu Hayashi.', [
        ['もしもし、はやし です。', 'Halo, Hayashi.', [['もしもし、○○ です。きゅうぎょう けいしゃ で、にわとり が 20わ ぐらい しんで います。', 30, 'Nama + tempat + jumlah. Singkat & jelas.'], ['たいへん です！ たいへん！', -15, 'Panik tanpa informasi.'], ['あとで はなします。', -30, 'Ini darurat.']]],
        ['さわって ない？ すぐ いく から、だれ も いれないで。', 'Tidak disentuh? Aku segera datang, jangan biarkan orang masuk.', [['はい、さわって いません。いりぐち で まって います。', 30, 'Konfirmasi & jaga pintu.'], ['すこし さわりました。', 0, 'Jujur, lalu cuci & desinfeksi segera.'], ['いえ に かえります。', -30, 'Bisa menyebarkan penyakit.']]],
      ], 'Telepon darurat: もしもし + nama + tempat + jumlah. Jangan sentuh, jaga pintu, tunggu.')],
      vocab: V(['電話', 'でんわ', 'denwa', 'telepon'], ['死ぬ', 'しぬ', 'shinu', 'mati'], ['入れない', 'いれない', 'irenai', 'tidak membolehkan masuk']) },
    13: { add: [TL('gate', 'nguyen', '👦', 'Nguyen-san lupa ganti sepatu', 'Nguyen-san masuk kandang dengan sepatu dari luar.', [
        ['あ、くつ、かえなきゃ だめ ですか？', 'Oh, sepatu harus diganti?', [['うん。そと の きん を いれない ため。こっち の ながぐつ に かえて、しょうどくそう も ね。', 30, 'Alasan + cara.'], ['べつに いい よ。', -30, 'Biosekuriti tidak boleh dilewati.'], ['なんで しらない の！', -20, 'Pekerja baru wajar belum tahu.']]],
        ['わかりました。ほか に きを つける こと は？', 'Paham. Ada yang lain?', [['けいしゃ を うつる とき も、て を しょうどく して ね。', 30, 'Tambahkan aturan penting.'], ['ない よ。', -10, 'Ada aturan lain yang penting.'], ['あした おしえる。', -10, 'Lebih baik sekarang.']]],
      ], 'Mengajar biosekuriti: ganti sepatu, bak desinfeksi, desinfeksi tangan saat pindah kandang.'),
      { t: 'scale', at: 'feed', title: 'Contohkan timbang pakan ke Nguyen-san' }],
      vocab: V(['長靴', 'ながぐつ', 'nagagutsu', 'sepatu bot'], ['菌', 'きん', 'kin', 'kuman'], ['消毒槽', 'しょうどくそう', 'shoudokusou', 'bak desinfeksi']) },
    14: { add: [TL('office', 'boss', '🧑‍⚖️', 'Ujian lisan peternakan', 'Penguji menanyakan hal dasar.', [
        ['うし に ちかづく とき の ちゅうい は？', 'Hal penting saat mendekati sapi?', [['まえ か よこ から、こえ を かけて ゆっくり ちかづきます。', 30, 'Lengkap.'], ['はしって ちかづきます。', -25, 'Membuat sapi kaget.'], ['うしろ から です。', -30, 'Risiko ditendang.']]],
        ['にゅうぼうえん の ぎゅうにゅう は？', 'Susu sapi mastitis?', [['タンク に いれず、べつ に して すてます。', 30, 'Tidak dicampur ke tangki.'], ['まぜます。', -30, 'Merusak seluruh tangki susu.'], ['のみます。', -25, 'Tidak boleh.']]],
      ], 'Ujian: dekati sapi dari depan/samping; susu mastitis dipisah, tidak masuk tangki.'),
      { t: 'scale', at: 'feed', title: 'Ujian praktik: timbang pakan 4 sapi' }],
      vocab: V(['乳房炎', 'にゅうぼうえん', 'nyuubouen', 'mastitis'], ['牛乳', 'ぎゅうにゅう', 'gyuunyuu', 'susu sapi'], ['混ぜる', 'まぜる', 'mazeru', 'mencampur']) },
    15: { add: [TL('barn', 'boss', '👩‍🌾', 'Pamit kepada sapi & Bu Hayashi', 'Hari terakhir. Bu Hayashi mengajakmu ke kandang anak sapi.', [
        ['あの こうし、なまえ を つけて いい わよ。', 'Anak sapi itu, boleh kamu beri nama.', [['ほんとう ですか！ じゃあ「ハナ」に します。', 30, 'Sambut dengan senang.'], ['いりません。', -15, 'Kesempatan kenangan indah.'], ['たべる の ですか？', -20, 'Kurang pantas di momen ini.']]],
        ['あなた が いて、たすかった わ。', 'Kamu sangat membantu.', [['こちら こそ、いろいろ おせわ に なりました。', 30, 'こちらこそ + お世話になりました.'], ['とうぜん です。', -10, 'Kurang rendah hati.'], ['はい。', -5, 'Balas dengan terima kasih.']]],
      ], 'Perpisahan: 「こちらこそ、お世話になりました」.'),
      { t: 'scale', at: 'feed', title: 'Pakan terakhir untuk semua sapi' },
      AC('barn', 'Bersihkan kandang anak sapi', '🐮', 'kandang anak sapi', [['🧹', 'フォーク', 'ふるい わら を だして。', 'keluarkan jerami lama', 'swipe', '🧹 ✓'], ['🧴', 'しょうどく', 'ゆか を しょうどく して。', 'desinfeksi lantai', 'swipe', '✨'], ['🌾', 'わら', 'あたらしい わら を しいて。', 'hamparkan jerami baru', 'taps:3', '🌾 ✓'], ['🍼', 'ミルク', 'ミルク を 40ど に して あげて。', 'beri susu 40℃', 'hold', '🍼 ✓']], [['🧊', 'つめたい ミルク']], 'Kandang anak sapi harus kering & bersih; susu diberikan hangat ±40℃.')],
      vocab: V(['名前をつける', 'なまえをつける', 'namae wo tsukeru', 'memberi nama'], ['助かる', 'たすかる', 'tasukaru', 'terbantu'], ['こちらこそ', 'こちらこそ', 'kochira koso', 'saya juga (terima kasih)']) },
  };

  /* ---------- terapkan: hapus tugas berulang, tambahkan adegan harian ---------- */
  const ENDERS = ['bye', 'otsukare', 'osaki'];
  const keyOf = x => (typeof x === 'string' ? x : (x.title || x.q) ? x.t + '|' + (x.title || x.q) : x);
  for (const [id, days] of Object.entries(D)) {
    const used = new Set();
    days.forEach((d, i) => {
      d.tasks = (d.tasks || []).filter(x => { const k = keyOf(x); if (used.has(k)) return false; used.add(k); return true; });
      const s = SC[id] && SC[id][i + 1];
      if (!s) return;
      const end = d.tasks.findIndex(x => ENDERS.includes(x));   // salam pulang tetap paling akhir
      const add = (s.add || []).filter(x => { const k = keyOf(x); if (used.has(k)) return false; used.add(k); return true; });
      d.tasks.splice(end < 0 ? d.tasks.length : end, 0, ...add);
      if (s.vocab) d.vocab = [...(d.vocab || []), ...s.vocab];
    });
  }
  Kerja.SCENES = SC;
})();
