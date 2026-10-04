/* =========================================================
   SIMULASI KERJA (しごと たいけん)
   Gambaran kerja nyata di Jepang untuk bidang yang banyak diisi
   pekerja Indonesia (Tokutei Ginou / magang):
   - 🍙 Pabrik makanan (しょくひん せいぞう)
   - 🧓 Kaigo / panti wreda (かいご)
   - 🏗 Genba / proyek konstruksi (けんせつ げんば)
   - 🍶 Restoran / izakaya (がいしょく)
   Atasan di tiap tempat kerja memandu satu shift penuh seperti "bot":
   memberi instruksi dalam bahasa Jepang, bertanya, lalu menjelaskan
   kenapa jawabanmu benar/salah. Isi disusun dari materi resmi
   (OTAFF, JAC, pedoman HACCP & KY活動, panduan 声かけ kaigo).
   Jenis langkah: say · clock · quiz · order · pick · spot
   ========================================================= */
const Kerja = (() => {
  /* ---------- tokoh tempat kerja ---------- */
  Object.assign(CHARACTERS, {
    hancho:  { name: 'Pak Yamada (Hanchō)',  color: '#4f7fb0' },
    leader:  { name: 'Bu Suzuki (Leader)',   color: '#d77a9a' },
    riyosha: { name: 'Nenek Kimura',         color: '#8a6aa0' },
    oyakata: { name: 'Pak Kondo (Mandor)',   color: '#d9822b' },
    tencho:  { name: 'Pak Ishii (Tenchō)',   color: '#b0363f' },
  });
  Object.assign(Pix.PAL, {
    hancho:  { h: '#2d2b3b', H: '#16151d', e: '#2b2b44', E: '#4f5690', I: '#8d95d8', o: '#f4f6fa', O: '#c9d0dc', a: '#f4f6fa', A: '#c9d0dc', p: '#e8ecf2', b: '#f4f6fa', c: '#f4f6fa' },
    leader:  { h: '#4a3020', H: '#2a1a10', e: '#2a2238', E: '#6b4430', I: '#b08060', o: '#f2a7bf', O: '#d77a9a', a: '#f6d44a', A: '#c9a526', p: '#3a3f55', b: '#f4f1ea', c: '#f7f3ea' },
    riyosha: { h: '#d8d4dc', H: '#a8a2b0', e: '#2a2238', E: '#6a5a7a', I: '#a898b8', o: '#9a7ab8', O: '#6a4a88', a: '#f6d44a', A: '#c9a526', p: '#5a4a6a', b: '#4a3a3a', c: '#f7f3ea' },
    oyakata: { h: '#1d1c26', H: '#0f0e14', e: '#2a2a3a', E: '#4a4a3a', I: '#8a8a6a', o: '#5a6b8a', O: '#3d4a63', a: '#f6c90e', A: '#c9a20b', p: '#4a4a55', b: '#2a2a2a', c: '#f7f3ea' },
    tencho:  { h: '#2f2c40', H: '#191824', e: '#2a2a3a', E: '#5a4a3a', I: '#9a8a7a', o: '#2b2b38', O: '#181820', a: '#f7f3ea', A: '#d3c7b3', p: '#2b2b38', b: '#2a2a2a', c: '#f7f3ea' },
  });
  Object.assign(Pix.STYLE, {
    hancho:  { hair: 'short', uniform: 'apron', cap: true },
    leader:  { hair: 'bob', uniform: 'tee' },
    riyosha: { hair: 'bun', old: true, uniform: 'cardigan' },
    oyakata: { hair: 'short', uniform: 'tee', cap: true },
    tencho:  { hair: 'short', uniform: 'apron', headband: true },
  });

  /* ---------- isi simulasi ---------- */
  // quiz: q = situasi (bahasa Indonesia), opts[0] = jawaban benar (diacak saat main)
  const JOBS = [
    {
      id: 'food', icon: '🍙', jp: 'しょくひん せいぞう', k: '食品製造', name: 'Pabrik Makanan', place: 'Pabrik bento & onigiri',
      desc: 'Lini produksi onigiri: kebersihan, cek barang NG, suhu, dan 5S.',
      info: {
        tugas: ['Bekerja di lini produksi: menata nasi & lauk, mengemas, menempel label', 'Cek visual: menyingkirkan produk cacat atau berbenda asing (いぶつ)', 'Cuci tangan, sanitasi alat, dan bersih-bersih area kerja', 'Mencatat suhu pemanasan & suhu ruang dingin'],
        jadwal: ['07:50 Ganti seragam, cuci tangan, rol perekat, air shower', '08:00 Chōrei (apel pagi) & cek kesehatan', '08:15 Kerja di lini (istirahat ±10 menit tiap 2 jam)', '12:00 Istirahat makan siang', '16:30 Bersih-bersih & 5S', '17:00 Shūrei (apel sore), pulang'],
        kondisi: 'Banyak berdiri. Ruang produk dingin bisa sekitar 10℃. Pabrik besar biasanya punya shift pagi, siang, dan malam.',
        visa: 'Tokutei Ginou「飲食料品製造業」: ujian keterampilan dari OTAFF + bahasa Jepang (JFT-Basic atau JLPT N4).',
        tips: 'Kebersihan nomor satu. Kalau ragu atau melihat masalah, langsung lapor (ほうれんそう). Diare atau demam juga WAJIB dilaporkan sebelum masuk.',
      },
      vocab: [
        ['朝礼', 'ちょうれい', 'chourei', 'apel pagi'], ['手洗い', 'てあらい', 'tearai', 'cuci tangan'], ['帽子', 'ぼうし', 'boushi', 'topi / penutup rambut'],
        ['手袋', 'てぶくろ', 'tebukuro', 'sarung tangan'], ['異物', 'いぶつ', 'ibutsu', 'benda asing'], ['異物混入', 'いぶつこんにゅう', 'ibutsu konnyuu', 'benda asing tercampur di makanan'],
        ['加熱', 'かねつ', 'kanetsu', 'pemanasan / memasak'], ['温度', 'おんど', 'ondo', 'suhu'], ['不良品', 'ふりょうひん', 'furyouhin', 'barang cacat (NG)'],
        ['報連相', 'ほうれんそう', 'hourensou', 'lapor · kabari · konsultasi'], ['体調', 'たいちょう', 'taichou', 'kondisi badan'], ['5S', 'ごエス', 'go esu', 'seiri, seiton, seisō, seiketsu, shitsuke'],
      ],
      steps: [
        { t: 'clock', time: '07:50', title: 'Ganti seragam & persiapan' },
        { t: 'say', w: 'hancho', e: 'happy', jp: 'おはよう ございます！きょう から よろしく ね。', ro: 'ohayou gozaimasu! kyou kara yoroshiku ne.', id: 'Selamat pagi! Mulai hari ini mohon kerja samanya, ya.' },
        { t: 'say', w: 'hancho', jp: 'まず、みだしなみ を チェック します。', ro: 'mazu, midashinami wo chekku shimasu.', id: 'Pertama, kita cek penampilan (みだしなみ) dulu. Di pabrik makanan, benda kecil pun bisa jatuh ke produk.' },
        { t: 'pick', title: 'みだしなみ · Pilih yang BOLEH dibawa/dipakai ke area produksi', items: [
          { jp: 'ぼうし', ro: 'boushi', id: 'penutup rambut', ok: true },
          { jp: 'マスク', ro: 'masuku', id: 'masker', ok: true },
          { jp: 'てぶくろ', ro: 'tebukuro', id: 'sarung tangan', ok: true },
          { jp: 'ながぐつ', ro: 'nagagutsu', id: 'sepatu bot pabrik', ok: true },
          { jp: 'ゆびわ', ro: 'yubiwa', id: 'cincin', ok: false, why: 'Aksesori bisa jatuh ke makanan (いぶつこんにゅう).' },
          { jp: 'うでどけい', ro: 'udedokei', id: 'jam tangan', ok: false, why: 'Jam tangan menyimpan kotoran & bisa jatuh.' },
          { jp: 'スマホ', ro: 'sumaho', id: 'HP', ok: false, why: 'HP ditinggal di loker.' },
          { jp: 'ヘアピン', ro: 'heapin', id: 'jepit rambut', ok: false, why: 'Jepit rambut termasuk benda asing yang sering ditemukan.' },
        ] },
        { t: 'say', w: 'hancho', jp: 'つぎ は てあらい。せっけん で 30びょう いじょう あらって ね。', ro: 'tsugi wa tearai. sekken de sanjuu-byou ijou aratte ne.', id: 'Berikutnya cuci tangan. Pakai sabun, minimal 30 detik.' },
        { t: 'order', title: 'てあらい · Urutkan langkah cuci tangan', items: [
          { jp: 'みず で ぬらす', id: 'basahi tangan dengan air' },
          { jp: 'せっけん を つける', id: 'pakai sabun' },
          { jp: '30びょう あらう', id: 'gosok 30 detik: sela jari, kuku, pergelangan' },
          { jp: 'みず で ながす', id: 'bilas dengan air' },
          { jp: 'ペーパー で ふく', id: 'keringkan dengan tisu' },
          { jp: 'アルコール で しょうどく', id: 'semprot alkohol (disinfeksi)' },
        ] },
        { t: 'quiz', w: 'hancho', jp: 'ローラー を かけて ください。', ro: 'rooraa wo kakete kudasai.', id: 'Tolong pakai rol perekat (ローラー).', q: 'Cara pakai rol perekat yang benar?', opts: [
          { label: 'Gulirkan ke seluruh baju dari atas ke bawah, depan & belakang' },
          { label: 'Cukup bagian depan saja' },
          { label: 'Hanya kalau bajunya terlihat kotor' },
        ], why: 'Rambut & debu di baju (termasuk punggung dan lengan) harus diambil semua sebelum masuk. Biasanya teman saling bantu menggulirkan rol di punggung.' },
        { t: 'clock', time: '08:00', title: 'ちょうれい · Apel pagi' },
        { t: 'say', w: 'hancho', jp: 'きょう の もくひょう は おにぎり 3000こ です。', ro: 'kyou no mokuhyou wa onigiri sanzen-ko desu.', id: 'Target hari ini 3.000 onigiri. Sekarang cek kesehatan.' },
        { t: 'quiz', w: 'hancho', jp: 'たいちょう は どう？', ro: 'taichou wa dou?', id: 'Bagaimana kondisi badanmu?', q: 'Pagi ini kamu diare. Apa yang kamu katakan?', opts: [
          { jp: 'すみません、おなか の ちょうし が わるい です。', ro: 'sumimasen, onaka no choushi ga warui desu.' },
          { jp: 'だいじょうぶ です！', ro: 'daijoubu desu!' },
          { jp: 'くすり を のんだ から、だいじょうぶ。', ro: 'kusuri wo nonda kara, daijoubu.' },
        ], why: 'Diare/muntah bisa jadi tanda norovirus yang menular lewat makanan. Wajib lapor; kamu akan dipindah ke tugas lain atau disuruh istirahat. Jujur itu justru dihargai.' },
        { t: 'clock', time: '08:15', title: 'ライン · Kerja di lini produksi' },
        { t: 'say', w: 'hancho', jp: 'ふりょうひん は NG、いい もの は ヨシ！ で ながして ね。', ro: 'furyouhin wa NG, ii mono wa yoshi! de nagashite ne.', id: 'Barang cacat = NG (singkirkan). Barang bagus = ヨシ! (loloskan).' },
        { t: 'spot', title: 'Cek onigiri di conveyor', okLabel: 'ヨシ！', ngLabel: 'NG', count: 10, limit: 6000, items: [
          { e: '🍙', d: 'Onigiri rapi, nori menempel, label ada', ok: true },
          { e: '🍙', d: 'Bentuk segitiga sempurna, kemasan rapat', ok: true },
          { e: '🍙', d: 'Label tanggal tercetak jelas', ok: true },
          { e: '🍙', b: '〰️', d: 'Ada benda hitam tipis panjang di nasi', ok: false, why: 'かみのけ (rambut) = いぶつ' },
          { e: '🍙', b: '🧩', d: 'Ada serpihan plastik bening', ok: false, why: 'ビニール の かけら (serpihan plastik)' },
          { e: '🍙', b: '🏷️', d: 'Labelnya tidak ada', ok: false, why: 'ラベル なし: tanggal & alergen tidak terbaca' },
          { e: '🍙', b: '💥', d: 'Kemasan sobek, nasi keluar', ok: false, why: 'ほうそう が やぶれて いる (kemasan rusak)' },
          { e: '🍙', b: '🔩', d: 'Ada potongan logam kecil', ok: false, why: 'きんぞく (logam) → lapor segera!' },
        ] },
        { t: 'quiz', w: 'hancho', q: 'Kamu menemukan potongan logam di onigiri. Apa yang kamu katakan ke hanchō?', opts: [
          { jp: 'はんちょう！いぶつ が ありました！', ro: 'hanchou! ibutsu ga arimashita!' },
          { jp: '（だまって すてる）', ro: '(diam-diam dibuang)' },
          { jp: 'あとで いいます。', ro: 'ato de iimasu.' },
        ], why: 'Logam bisa berarti ada bagian mesin yang patah, jadi produk lain mungkin ikut tercemar. Ini ほうれんそう: ほうこく (lapor), れんらく (kabari), そうだん (konsultasi). Lapor SEGERA, jangan dibuang diam-diam.' },
        { t: 'quiz', w: 'hancho', jp: 'からあげ の ちゅうしん おんど を はかって。', ro: 'karaage no chuushin ondo wo hakatte.', id: 'Ukur suhu bagian tengah karaage.', q: 'Termometer menunjukkan 68℃. Standar: 75℃ selama 1 menit. Apa yang kamu lakukan?', opts: [
          { jp: '68ど です。もう いちど かねつ します。', ro: 'rokujuuhachi-do desu. mou ichido kanetsu shimasu.' },
          { jp: 'だいたい OK です。', ro: 'daitai OK desu.' },
          { jp: '（そのまま ながす）', ro: '(diloloskan saja)' },
        ], why: 'Di Jepang standar umum pemanasan adalah suhu tengah 75℃ selama 1 menit atau lebih, supaya bakteri mati. Kurang dari itu: laporkan angkanya & panaskan ulang, lalu catat.' },
        { t: 'clock', time: '16:30', title: 'せいそう · Bersih-bersih & 5S' },
        { t: 'order', title: '5S · Urutkan 5S (budaya kerja pabrik Jepang)', items: [
          { jp: 'せいり', id: 'Seiri: buang yang tidak perlu' },
          { jp: 'せいとん', id: 'Seiton: tata supaya mudah diambil' },
          { jp: 'せいそう', id: 'Seisō: bersihkan' },
          { jp: 'せいけつ', id: 'Seiketsu: jaga tetap bersih' },
          { jp: 'しつけ', id: 'Shitsuke: jadikan kebiasaan' },
        ] },
        { t: 'clock', time: '17:00', title: 'しゅうれい · Apel sore & pulang' },
        { t: 'quiz', w: 'hancho', q: 'Kamu pulang lebih dulu, teman lain masih bekerja. Kamu bilang…', opts: [
          { jp: 'おさきに しつれいします。', ro: 'osaki ni shitsurei shimasu.' },
          { jp: 'じゃあね！', ro: 'jaa ne!' },
          { jp: 'いただきます。', ro: 'itadakimasu.' },
        ], why: 'おさきに しつれいします = "Saya pamit duluan". Teman biasanya menjawab おつかれさまでした (terima kasih atas kerja kerasnya).' },
        { t: 'say', w: 'hancho', e: 'happy', jp: 'おつかれさま でした！また あした。', ro: 'otsukaresama deshita! mata ashita.', id: 'Terima kasih kerja kerasnya! Sampai besok.' },
      ],
    },
    {
      id: 'kaigo', icon: '🧓', jp: 'かいご', k: '介護', name: 'Kaigo (Panti Wreda)', place: 'Panti wreda (とくべつ ようご ろうじん ホーム)',
      desc: 'Serah terima, 声かけ, bantu makan, pindah ke kursi roda, mandi, lapor.',
      info: {
        tugas: ['Membantu makan (しょくじ かいじょ), mandi (にゅうよく), toilet (はいせつ)', 'Memindahkan dari kasur ke kursi roda (いじょう)', 'Cek suhu badan & kondisi, rekreasi bersama lansia', 'Menulis catatan (きろく) & serah terima shift (もうしおくり)'],
        jadwal: ['08:30 Serah terima dari shift malam (もうしおくり)', '09:00 Cek suhu badan, ganti popok/toilet', '12:00 Bantu makan siang, sikat gigi', '14:00 Mandi / rekreasi', '15:00 Waktu camilan (おやつ)', '17:00 Catatan & serah terima ke shift malam'],
        kondisi: 'Ada shift pagi, siang, dan malam (やきん). Fisik cukup berat (mengangkat & memindahkan), tapi hubungan dengan lansia sangat hangat.',
        visa: 'Tokutei Ginou「介護」: ujian 介護技能評価試験 + 介護日本語評価試験 + bahasa Jepang (JFT-Basic atau JLPT N4).',
        tips: 'Kunci kaigo adalah こえかけ: selalu bicara sebelum menyentuh atau memindahkan ("いまから 〜しますね"). Pakai bahasa sopan, jangan terburu-buru.',
      },
      vocab: [
        ['介護', 'かいご', 'kaigo', 'perawatan lansia'], ['利用者', 'りようしゃ', 'riyousha', 'penghuni / pengguna layanan'], ['声かけ', 'こえかけ', 'koekake', 'menyapa/menjelaskan saat membantu'],
        ['申し送り', 'もうしおくり', 'moushiokuri', 'serah terima shift'], ['食事介助', 'しょくじかいじょ', 'shokuji kaijo', 'bantu makan'], ['誤嚥', 'ごえん', 'goen', 'tersedak (makanan masuk ke paru)'],
        ['移乗', 'いじょう', 'ijou', 'pindah (kasur → kursi roda)'], ['車いす', 'くるまいす', 'kurumaisu', 'kursi roda'], ['入浴', 'にゅうよく', 'nyuuyoku', 'mandi'],
        ['排泄', 'はいせつ', 'haisetsu', 'buang air (toilet)'], ['転倒', 'てんとう', 'tentou', 'terjatuh'], ['記録', 'きろく', 'kiroku', 'catatan'],
      ],
      steps: [
        { t: 'clock', time: '08:30', title: 'もうしおくり · Serah terima shift' },
        { t: 'say', w: 'leader', e: 'happy', jp: 'おはよう ございます。きょう は いっしょ に がんばりましょう。', ro: 'ohayou gozaimasu. kyou wa issho ni ganbarimashou.', id: 'Selamat pagi. Hari ini kita semangat bersama, ya.' },
        { t: 'say', w: 'leader', jp: 'きむら さん は ゆうべ あまり ねむれません でした。', ro: 'kimura-san wa yuube amari nemuremasen deshita.', id: 'Info shift malam: Nenek Kimura semalam kurang tidur. Perhatikan kondisinya, ya.' },
        { t: 'quiz', w: 'leader', q: 'Kamu masuk kamar Nenek Kimura pagi hari. Sebelum membuka tirai, kamu bilang…', opts: [
          { jp: 'きむら さん、おはよう ございます。カーテン を あけて も いい ですか？', ro: 'kimura-san, ohayou gozaimasu. kaaten wo akete mo ii desu ka?' },
          { jp: '（だまって カーテン を あける）', ro: '(diam-diam buka tirai)' },
          { jp: 'おきて！あさ だ よ！', ro: 'okite! asa da yo!' },
        ], why: 'こえかけ: sapa dengan nama, jelaskan, lalu minta izin. Lansia adalah "tuan rumah" di kamarnya sendiri. Bahasa kasar seperti "おきて！" tidak sopan.' },
        { t: 'quiz', w: 'leader', jp: 'たいおん を はかって ください。', ro: 'taion wo hakatte kudasai.', id: 'Tolong ukur suhu badannya.', q: 'Termometer: 37,8℃. Apa yang kamu lakukan?', opts: [
          { jp: 'リーダー、きむら さん の ねつ が 37ど8ぶ です。', ro: 'riidaa, kimura-san no netsu ga sanjuu-nana-do hachi-bu desu.' },
          { jp: '（あとで きろく に かく だけ）', ro: '(cuma dicatat nanti)' },
          { jp: 'ふつう です。', ro: 'futsuu desu.' },
        ], why: 'Di banyak panti, 37,5℃ ke atas sudah dianggap demam. Laporkan angkanya dengan jelas ke leader atau perawat (かんごし) SEGERA, baru dicatat.' },
        { t: 'clock', time: '12:00', title: 'しょくじ かいじょ · Bantu makan siang' },
        { t: 'pick', title: 'Pilih cara bantu makan yang BENAR', items: [
          { jp: 'からだ を おこして すわる', ro: 'karada wo okoshite suwaru', id: 'duduk tegak', ok: true },
          { jp: 'あご を すこし ひく', ro: 'ago wo sukoshi hiku', id: 'dagu sedikit menunduk', ok: true },
          { jp: 'ひとくち は すこし', ro: 'hitokuchi wa sukoshi', id: 'suapan kecil', ok: true },
          { jp: 'のみこんだ か かくにん', ro: 'nomikonda ka kakunin', id: 'cek sudah ditelan', ok: true },
          { jp: 'たった まま たべさせる', ro: 'tatta mama tabesaseru', id: 'menyuapi sambil berdiri', ok: false, why: 'Kalau kamu berdiri, lansia mendongak → mudah tersedak. Duduklah sejajar mata.' },
          { jp: 'いそいで たべさせる', ro: 'isoide tabesaseru', id: 'menyuapi cepat-cepat', ok: false, why: 'Terburu-buru = risiko ごえん (tersedak).' },
          { jp: 'ねた まま たべさせる', ro: 'neta mama tabesaseru', id: 'makan sambil berbaring', ok: false, why: 'Berbaring membuat makanan mudah masuk ke saluran napas.' },
        ] },
        { t: 'say', n: 'ごえん (tersedak sampai makanan masuk ke paru) bisa menyebabkan radang paru, salah satu penyebab sakit serius pada lansia di Jepang. Karena itu posisi tubuh sangat penting.' },
        { t: 'quiz', w: 'riyosha', e: 'happy', jp: 'もう おなか いっぱい だ わ。', ro: 'mou onaka ippai da wa.', id: '', q: 'Nenek Kimura berkata begitu. Artinya…', opts: [
          { label: 'Sudah kenyang' }, { label: 'Masih lapar, minta tambah' }, { label: 'Perutnya sakit' },
        ], why: 'おなか いっぱい = perut penuh/kenyang. Jangan dipaksa makan; catat berapa banyak yang dimakan (misal 8わり = 80%).' },
        { t: 'clock', time: '14:00', title: 'いじょう · Pindah ke kursi roda' },
        { t: 'order', title: 'Urutkan langkah memindahkan dari kasur ke kursi roda', items: [
          { jp: 'こえかけ・せつめい', id: 'jelaskan dulu: "Kita pindah ke kursi roda, ya"' },
          { jp: 'くるまいす を ななめ に おく', id: 'taruh kursi roda miring ±30° di samping kasur' },
          { jp: 'ブレーキ を かける', id: 'kunci rem kursi roda' },
          { jp: 'あし を ゆか に つける', id: 'duduk di tepi kasur, kaki menapak lantai' },
          { jp: 'たちあがって、まわる', id: 'berdiri pelan, berputar ke arah kursi' },
          { jp: 'ふかく すわる', id: 'duduk dalam, kaki di pijakan kaki' },
        ] },
        { t: 'clock', time: '15:00', title: 'にゅうよく · Membantu mandi' },
        { t: 'quiz', w: 'leader', q: 'Suhu air mandi yang tepat untuk lansia sekitar…', opts: [
          { jp: '40ど ぐらい', ro: 'yonjuu-do gurai' }, { jp: '50ど ぐらい', ro: 'gojuu-do gurai' }, { jp: '25ど ぐらい', ro: 'nijuugo-do gurai' },
        ], why: 'Umumnya 38–41℃. Cek dulu dengan tanganmu sendiri, lalu tanya: "おゆ の かげん は どう ですか？" (airnya pas?). Kulit lansia sensitif dan mudah melepuh.' },
        { t: 'quiz', w: 'leader', q: 'Nenek Kimura terjatuh (てんとう) di lorong. Apa yang pertama kamu lakukan?', opts: [
          { jp: 'だれか きて ください！きむら さん が ころびました！', ro: 'dareka kite kudasai! kimura-san ga korobimashita!' },
          { jp: '（ひとり で すぐ だきあげる）', ro: '(langsung diangkat sendirian)' },
          { jp: '（みなかった こと に する）', ro: '(pura-pura tidak lihat)' },
        ], why: 'Jangan langsung diangkat: bisa ada patah tulang atau benturan kepala. Panggil bantuan & perawat, ajak bicara supaya tetap sadar, lalu tunggu pemeriksaan.' },
        { t: 'clock', time: '17:00', title: 'きろく · Catatan & laporan' },
        { t: 'quiz', w: 'leader', jp: 'ほうこく して ください。', ro: 'houkoku shite kudasai.', id: 'Tolong laporkan.', q: 'Laporan mana yang paling baik?', opts: [
          { jp: '15じ に ろうか で ころびました。あたま は うって いません。', ro: 'juugo-ji ni rouka de korobimashita. atama wa utte imasen.' },
          { jp: 'なんか ころんだ みたい です。', ro: 'nanka koronda mitai desu.' },
          { jp: 'だいじょうぶ でした、たぶん。', ro: 'daijoubu deshita, tabun.' },
        ], why: 'Laporan yang baik: fakta yang jelas, yaitu いつ (kapan), どこで (di mana), なにが (apa yang terjadi), dan kondisinya sekarang. Hindari "たぶん" (mungkin).' },
        { t: 'say', w: 'riyosha', e: 'happy', jp: 'きょう も ありがとう ね。あなた が きて くれて うれしい わ。', ro: 'kyou mo arigatou ne. anata ga kite kurete ureshii wa.', id: 'Terima kasih untuk hari ini juga. Nenek senang kamu datang.' },
        { t: 'quiz', w: 'riyosha', q: 'Kamu pamit ke Nenek Kimura. Kamu bilang…', opts: [
          { jp: 'また あした きます ね。ゆっくり やすんで ください。', ro: 'mata ashita kimasu ne. yukkuri yasunde kudasai.' },
          { jp: 'バイバイ！', ro: 'baibai!' },
          { jp: 'はやく ねて！', ro: 'hayaku nete!' },
        ], why: 'Ucapan lembut dan sopan membuat lansia merasa tenang dan dihormati.' },
        { t: 'say', w: 'leader', e: 'happy', jp: 'おつかれさま でした。こえかけ が じょうず でした よ。', ro: 'otsukaresama deshita. koekake ga jouzu deshita yo.', id: 'Terima kasih kerja kerasnya. Cara menyapamu (こえかけ) bagus sekali!' },
      ],
    },
    {
      id: 'genba', icon: '🏗', jp: 'けんせつ げんば', k: '建設現場', name: 'Genba (Konstruksi)', place: 'Proyek pembangunan gedung',
      desc: 'ご安全に!, APD, KY活動, temukan bahaya, 指差呼称, bahasa lapangan.',
      info: {
        tugas: ['Bekisting, besi tulangan, pengecoran, perancah (あしば), interior, alat berat', 'Membawa & merapikan material', 'Ikut apel pagi (ちょうれい), senam radio, dan KY活動 tiap pagi', 'Bersih-bersih lokasi di akhir hari'],
        jadwal: ['07:45 Senam radio (ラジオたいそう)', '08:00 Apel pagi: "ごあんぜん に！", KY活動', '10:00 Istirahat singkat (いっぷく)', '12:00 Makan siang', '15:00 Istirahat singkat (いっぷく)', '17:00 Beres-beres, apel sore, pulang'],
        kondisi: 'Kerja di luar ruangan: panas di musim panas (waspada ねっちゅうしょう/heat stroke), dingin di musim dingin. Disiplin keselamatan sangat ketat.',
        visa: 'Tokutei Ginou「建設」: ujian keterampilan bidang konstruksi (diselenggarakan JAC) + bahasa Jepang (JFT-Basic atau JLPT N4).',
        tips: 'Jangan pernah pura-pura paham instruksi, minta diulang. Biasakan menunjuk sambil berseru "〇〇 ヨシ！" (しさこしょう).',
      },
      vocab: [
        ['現場', 'げんば', 'genba', 'lokasi kerja / proyek'], ['ご安全に', 'ごあんぜんに', 'go-anzen ni', 'salam: semoga selamat'], ['朝礼', 'ちょうれい', 'chourei', 'apel pagi'],
        ['危険予知', 'きけんよち (KY)', 'kiken yochi', 'memprediksi bahaya'], ['指差呼称', 'しさこしょう', 'shisa koshou', 'tunjuk & seru'], ['保護具', 'ほごぐ', 'hogogu', 'alat pelindung diri'],
        ['安全帯', 'あんぜんたい', 'anzentai', 'sabuk pengaman / harness'], ['足場', 'あしば', 'ashiba', 'perancah'], ['脚立', 'きゃたつ', 'kyatatsu', 'tangga lipat'],
        ['熱中症', 'ねっちゅうしょう', 'necchuushou', 'heat stroke'], ['一服', 'いっぷく', 'ippuku', 'istirahat singkat'], ['猫車', 'ねこ', 'neko', 'gerobak dorong (bahasa lapangan)'],
      ],
      steps: [
        { t: 'clock', time: '07:45', title: 'ラジオたいそう · Senam radio' },
        { t: 'say', w: 'oyakata', jp: 'ごあんぜん に！', ro: 'go-anzen ni!', id: 'Salam khas genba: "Semoga selamat!" Dipakai pagi-pagi menggantikan "ohayou".' },
        { t: 'quiz', w: 'oyakata', q: 'Pak Kondo menyapa "ごあんぜん に！". Kamu jawab…', opts: [
          { jp: 'ごあんぜん に！', ro: 'go-anzen ni!' }, { jp: 'こんばんは。', ro: 'konbanwa.' }, { jp: 'いただきます！', ro: 'itadakimasu!' },
        ], why: 'Jawab dengan salam yang sama, suara keras dan semangat. Di genba, suara keras = tanda kamu siap & waspada.' },
        { t: 'pick', title: 'ほごぐ · Pilih yang WAJIB dipakai di genba', items: [
          { jp: 'ヘルメット', ro: 'herumetto', id: 'helm', ok: true },
          { jp: 'あんぜんぐつ', ro: 'anzengutsu', id: 'sepatu safety', ok: true },
          { jp: 'フルハーネス', ro: 'furu haanesu', id: 'harness (sabuk pengaman)', ok: true },
          { jp: 'てぶくろ', ro: 'tebukuro', id: 'sarung tangan kerja', ok: true },
          { jp: 'サンダル', ro: 'sandaru', id: 'sandal', ok: false, why: 'Kaki harus terlindung dari paku & benda jatuh.' },
          { jp: 'イヤホン', ro: 'iyahon', id: 'earphone', ok: false, why: 'Kamu harus bisa dengar peringatan & aba-aba.' },
          { jp: 'はんそで・はんズボン', ro: 'hansode, han zubon', id: 'lengan & celana pendek', ok: false, why: 'Kulit harus tertutup (lengan & celana panjang).' },
        ] },
        { t: 'quiz', w: 'oyakata', jp: 'あごひも、しっかり！', ro: 'agohimo, shikkari!', id: 'Tali dagu, yang kencang!', q: 'Tali dagu helm (あごひも) harus…', opts: [
          { label: 'Diikat kencang di bawah dagu' }, { label: 'Dibiarkan menggantung supaya tidak gerah' }, { label: 'Diikat di belakang helm' },
        ], why: 'Helm tanpa tali dagu bisa lepas saat jatuh atau tertimpa, lalu tidak melindungi kepala sama sekali.' },
        { t: 'clock', time: '08:00', title: 'ちょうれい & KY活動' },
        { t: 'say', w: 'oyakata', jp: 'KY を やろう。きょう の きけん は なに か？', ro: 'KY wo yarou. kyou no kiken wa nani ka?', id: 'Ayo lakukan KY (prediksi bahaya). Apa bahaya hari ini?' },
        { t: 'order', title: 'KY 4 ラウンド · Urutkan langkah KY活動', items: [
          { jp: 'どんな きけん が ある？', id: 'Cari bahaya yang tersembunyi' },
          { jp: 'いちばん あぶない の は？', id: 'Tentukan bahaya paling utama' },
          { jp: 'どう する？', id: 'Buat tindakan pencegahan' },
          { jp: 'チーム の めあて「〜 ヨシ！」', id: 'Target tim, diserukan bersama' },
        ] },
        { t: 'say', w: 'oyakata', jp: 'じゃあ、げんば を まわって きけん を みつけて！', ro: 'jaa, genba wo mawatte kiken wo mitsukete!', id: 'Sekarang keliling genba dan temukan bahaya!' },
        { t: 'spot', title: 'Patroli: aman atau berbahaya?', okLabel: 'ヨシ！', ngLabel: 'あぶない！', count: 9, limit: 8000, items: [
          { e: '⛑️', d: 'Pekerja memakai helm, tali dagu terkunci', ok: true },
          { e: '🧱', d: 'Material ditumpuk rapi & diikat', ok: true },
          { e: '🚧', d: 'Pagar pengaman terpasang di tepi lantai', ok: true },
          { e: '💧', d: 'Minum air tiap 30 menit di hari panas', ok: true },
          { e: '🔌', d: 'Kabel melintang di jalan lewat', ok: false, why: 'つまずき (tersandung) → rapikan kabel' },
          { e: '🕳️', d: 'Lubang di lantai tanpa penutup', ok: false, why: 'てんらく (jatuh) → pasang penutup & tanda' },
          { e: '🪜', d: 'Tangga lipat berdiri di tanah miring', ok: false, why: 'きゃたつ harus di tempat datar & terkunci' },
          { e: '🧗', d: 'Kerja di ketinggian 3 m tanpa harness', ok: false, why: 'Ketinggian 2 m ke atas wajib harness' },
          { e: '🏗️', d: 'Orang lewat di bawah beban crane', ok: false, why: 'つりに の した に はいるな! Dilarang di bawah beban' },
        ] },
        { t: 'quiz', w: 'oyakata', q: 'Sebelum naik tangga, kamu menunjuk ke bawah sambil berseru…', opts: [
          { jp: 'あしもと、ヨシ！', ro: 'ashimoto, yoshi!' }, { jp: 'おなか すいた！', ro: 'onaka suita!' }, { jp: 'まあ、いい か。', ro: 'maa, ii ka.' },
        ], why: 'しさこしょう (tunjuk & seru): mata melihat, jari menunjuk, mulut berseru "〇〇 ヨシ！". Cara ini terbukti mengurangi kesalahan, dipakai juga oleh masinis kereta Jepang.' },
        { t: 'clock', time: '09:30', title: 'さぎょう · Bekerja' },
        { t: 'quiz', w: 'oyakata', jp: 'おい、ねこ もって きて！', ro: 'oi, neko motte kite!', id: '', q: 'Pak Kondo minta "ねこ". Apa yang kamu bawa?', opts: [
          { label: '🛒 Gerobak dorong satu roda' }, { label: '🐱 Kucing' }, { label: '🔨 Palu' },
        ], why: 'Bahasa lapangan: gerobak dorong satu roda disebut ねこ (ねこぐるま). Lucu, tapi sering dipakai!' },
        { t: 'quiz', w: 'oyakata', jp: 'あそこ の ばんせん、ばらして おいて。', ro: 'asoko no bansen, barashite oite.', id: '', q: 'Kamu tidak paham instruksi itu. Apa yang kamu lakukan?', opts: [
          { jp: 'すみません、もう いちど おねがいします。', ro: 'sumimasen, mou ichido onegaishimasu.' },
          { jp: '（わかった ふり を する）', ro: '(pura-pura paham)' },
          { jp: '（なにも しない）', ro: '(diam saja)' },
        ], why: 'Pura-pura paham adalah penyebab kecelakaan nomor satu pada pekerja asing. Minta diulang, minta ditunjukkan, atau ulangi instruksinya: "〜を 〜する ん です ね？"' },
        { t: 'clock', time: '10:00', title: 'いっぷく · Istirahat singkat' },
        { t: 'quiz', w: 'oyakata', q: 'Hari panas 34℃. Temanmu pusing dan berhenti berkeringat. Apa yang kamu lakukan?', opts: [
          { label: 'Bawa ke tempat teduh, beri minum & dinginkan, lapor mandor' },
          { label: 'Suruh lanjut kerja, sebentar lagi istirahat' },
          { label: 'Biarkan saja, nanti juga sembuh' },
        ], why: 'Itu tanda ねっちゅうしょう (heat stroke) yang bisa fatal. Segera dinginkan (leher, ketiak), beri minum, dan lapor. Kalau tidak sadar → panggil ambulans (119).' },
        { t: 'clock', time: '17:00', title: 'かたづけ · Beres-beres & pulang' },
        { t: 'quiz', w: 'oyakata', q: 'Pamit ke Pak Kondo (atasan) di akhir hari. Mana yang tepat?', opts: [
          { jp: 'おつかれさま でした！', ro: 'otsukaresama deshita!' }, { jp: 'ごくろうさま でした！', ro: 'gokurousama deshita!' }, { jp: 'おやすみ！', ro: 'oyasumi!' },
        ], why: 'ごくろうさま dipakai atasan kepada bawahan. Kepada atasan, pakai おつかれさま でした.' },
        { t: 'say', w: 'oyakata', e: 'happy', jp: 'きょう も ぶじ に おわった。ごくろうさん！', ro: 'kyou mo buji ni owatta. gokurousan!', id: 'Hari ini juga selesai tanpa kecelakaan. Kerja bagus!' },
      ],
    },
    {
      id: 'gaishoku', icon: '🍶', jp: 'がいしょく', k: '外食', name: 'Restoran / Izakaya', place: 'Izakaya di depan stasiun',
      desc: 'Bahasa pelayanan, menerima pesanan, alergi, kasir, dan urutan melayani.',
      info: {
        tugas: ['Hall: menyambut tamu, mengantar ke meja, menerima pesanan, menyajikan', 'Dapur: persiapan bahan, memasak, menata', 'Cuci piring & bersih-bersih', 'Kasir (おかいけい)'],
        jadwal: ['16:30 Masuk, ganti seragam, salam "おはようございます"', '17:00 Restoran buka', '18:00–21:00 Jam sibuk', '22:00 Pesanan terakhir (ラストオーダー)', '23:00 Bersih-bersih & pulang'],
        kondisi: 'Izakaya sibuk di sore–malam, restoran lain bisa shift pagi–siang. Cepat dan banyak bicara dengan tamu, jadi bahasa sopan sangat penting.',
        visa: 'Tokutei Ginou「外食業」: ujian keterampilan dari OTAFF + bahasa Jepang (JFT-Basic atau JLPT N4).',
        tips: 'Hafalkan 接客用語 (frasa pelayanan). Alergi tamu = urusan serius: jangan menebak, selalu cek ke tenchō atau dapur.',
      },
      vocab: [
        ['外食', 'がいしょく', 'gaishoku', 'industri restoran'], ['店長', 'てんちょう', 'tenchou', 'manajer toko'], ['接客', 'せっきゃく', 'sekkyaku', 'melayani tamu'],
        ['何名様', 'なんめいさま', 'nanmei-sama', 'berapa orang (sopan)'], ['注文', 'ちゅうもん', 'chuumon', 'pesanan'], ['お冷', 'おひや', 'ohiya', 'air dingin untuk tamu'],
        ['おしぼり', 'おしぼり', 'oshibori', 'handuk basah'], ['アレルギー', 'アレルギー', 'arerugii', 'alergi'], ['お会計', 'おかいけい', 'okaikei', 'pembayaran / bon'],
        ['お釣り', 'おつり', 'otsuri', 'uang kembalian'], ['少々', 'しょうしょう', 'shoushou', 'sebentar (sopan)'], ['ラストオーダー', 'ラストオーダー', 'rasuto oodaa', 'pesanan terakhir'],
      ],
      steps: [
        { t: 'clock', time: '16:30', title: 'しゅっきん · Masuk kerja' },
        { t: 'say', w: 'tencho', e: 'happy', jp: 'おはよう ございます！', ro: 'ohayou gozaimasu!', id: 'Di restoran, salam saat mulai shift tetap "ohayou gozaimasu", walau sudah sore!' },
        { t: 'order', title: 'Urutkan alur melayani tamu', items: [
          { jp: 'いらっしゃいませ！', id: 'sambut tamu' },
          { jp: 'なんめいさま ですか？', id: 'tanya jumlah orang, antar ke meja' },
          { jp: 'おしぼり と おひや', id: 'beri handuk basah & air' },
          { jp: 'ごちゅうもん は？', id: 'terima pesanan' },
          { jp: 'おまたせ しました', id: 'sajikan makanan' },
          { jp: 'おかいけい', id: 'pembayaran' },
        ] },
        { t: 'clock', time: '17:00', title: 'かいてん · Restoran buka' },
        { t: 'quiz', w: 'tencho', q: 'Tamu masuk ke restoran. Kamu bilang…', opts: [
          { jp: 'いらっしゃいませ！', ro: 'irasshaimase!' }, { jp: 'ただいま！', ro: 'tadaima!' }, { jp: 'おかえり！', ro: 'okaeri!' },
        ], why: 'いらっしゃいませ = selamat datang. Biasanya semua staf ikut berseru bersama.' },
        { t: 'quiz', w: 'tencho', jp: 'なんめいさま ですか？', ro: 'nanmei-sama desu ka?', id: 'Untuk berapa orang?', q: 'Tamu menunjukkan 3 jari. Kamu jawab…', opts: [
          { jp: 'さんめいさま ですね。こちら へ どうぞ。', ro: 'sanmei-sama desu ne. kochira e douzo.' },
          { jp: 'さんこ ですね。', ro: 'sanko desu ne.' },
          { jp: 'みっつ？', ro: 'mittsu?' },
        ], why: 'Untuk menghitung tamu dengan sopan pakai 〜めいさま (〜名様). 〜こ dan みっつ untuk menghitung benda.' },
        { t: 'quiz', w: 'tencho', jp: 'とりあえず なま ふたつ！', ro: 'toriaezu nama futatsu!', id: '', q: 'Tamu bilang begitu. Apa pesanannya?', opts: [
          { label: '🍺🍺 Dua bir draft (なまビール) dulu' }, { label: '🥩 Dua daging mentah' }, { label: '🍣 Dua sushi' },
        ], why: 'なま = なまビール (bir draft). "とりあえず" = "untuk sekarang dulu". Ini pesanan pertama paling klasik di izakaya!' },
        { t: 'quiz', w: 'tencho', q: 'Tamu bilang: 「えび アレルギー なんです。この サラダ は だいじょうぶ？」', opts: [
          { jp: 'しょうしょう おまち ください。かくにん して まいります。', ro: 'shoushou omachi kudasai. kakunin shite mairimasu.' },
          { jp: 'たぶん だいじょうぶ です！', ro: 'tabun daijoubu desu!' },
          { jp: 'わかりません。', ro: 'wakarimasen.' },
        ], why: 'Alergi bisa mengancam nyawa. JANGAN menebak. Bilang "mohon tunggu sebentar, saya cek dulu", lalu tanya tenchō/dapur atau lihat daftar alergen.' },
        { t: 'clock', time: '19:00', title: 'ピーク · Jam sibuk' },
        { t: 'spot', title: 'Cek piring sebelum diantar', okLabel: 'ヨシ！', ngLabel: 'NG', count: 8, limit: 5500, items: [
          { e: '🍢', d: 'Yakitori meja 3, sesuai pesanan', ok: true },
          { e: '🥗', d: 'Salad tanpa udang untuk tamu alergi, sudah dicek', ok: true },
          { e: '🍜', d: 'Ramen panas, mangkuk bersih', ok: true },
          { e: '🍣', b: '〰️', d: 'Ada rambut di pinggir piring', ok: false, why: 'かみのけ → buat ulang' },
          { e: '🍛', b: '💔', d: 'Piringnya retak', ok: false, why: 'さら が われて いる → ganti piring' },
          { e: '🍤', b: '❓', d: 'Tempura udang untuk meja yang alergi udang', ok: false, why: 'Pesanan salah & berbahaya untuk tamu alergi!' },
          { e: '🍺', b: '🫗', d: 'Gelas bir kotor bekas bibir', ok: false, why: 'Ganti gelas bersih' },
        ] },
        { t: 'quiz', w: 'tencho', q: 'Kamu tidak sengaja menumpahkan air di dekat tamu. Kamu bilang…', opts: [
          { jp: 'たいへん しつれい しました！すぐ ふきます。', ro: 'taihen shitsurei shimashita! sugu fukimasu.' },
          { jp: 'あ、ごめん。', ro: 'a, gomen.' },
          { jp: '（だまって いく）', ro: '(pergi diam-diam)' },
        ], why: 'Kepada tamu pakai bahasa sopan: たいへん しつれい しました / もうしわけ ございません. "ごめん" hanya untuk teman.' },
        { t: 'quiz', w: 'tencho', q: 'Total 3.500 えん. Tamu membayar 5.000 えん. Kamu bilang…', opts: [
          { jp: '1,500えん の おかえし です。', ro: 'sen-gohyaku en no okaeshi desu.' },
          { jp: '2,500えん の おかえし です。', ro: 'nisen-gohyaku en no okaeshi desu.' },
          { jp: '500えん の おかえし です。', ro: 'gohyaku en no okaeshi desu.' },
        ], why: '5.000 − 3.500 = 1.500. おかえし (お返し) = kembalian, cara sopan di kasir. Hitung kembalian di depan tamu.' },
        { t: 'quiz', w: 'tencho', q: 'Tamu pulang. Kamu bilang…', opts: [
          { jp: 'ありがとう ございました！また おこし くださいませ。', ro: 'arigatou gozaimashita! mata okoshi kudasaimase.' },
          { jp: 'いってらっしゃい！', ro: 'itterasshai!' },
          { jp: 'じゃあ ね！', ro: 'jaa ne!' },
        ], why: 'また おこし くださいませ = "Silakan datang kembali". Frasa standar pelayanan di Jepang.' },
        { t: 'clock', time: '23:00', title: 'しめ · Tutup & pulang' },
        { t: 'say', w: 'tencho', e: 'happy', jp: 'おつかれ！せっきゃく、いい かんじ だった よ。', ro: 'otsukare! sekkyaku, ii kanji datta yo.', id: 'Kerja bagus! Caramu melayani tamu sudah oke.' },
      ],
    },
  ];
  const BY = Object.fromEntries(JOBS.map(j => [j.id, j]));

  /* ---------- pembantu ---------- */
  const S = () => Save.d;
  const H = () => Game.h;
  const say = l => UI.say(l);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const ro = (jp, r) => r && UI.showRo(jp) ? `<small class="kj-ro">${esc(r)}</small>` : '';
  const rec = () => (S().kerja = S().kerja || {});
  const RANKS = [[90, 'S'], [75, 'A'], [55, 'B'], [0, 'C']];
  const rankOf = pct => RANKS.find(([m]) => pct >= m)[1];
  const optHtml = o => o.label || o.jp;

  /* ---------- langkah: kuis (atasan bertanya) ---------- */
  async function quiz(st) {
    if (st.jp || st.id) await say({ w: st.w, e: st.e, jp: st.jp, ro: st.ro, id: st.id });
    const opts = shuffle(st.opts);
    const i = await UI.choose(st.q, opts.map(o => (o.label ? { label: o.label } : { jp: o.jp, ro: o.ro })));
    const ok = opts[i] === st.opts[0];
    const right = st.opts[0];
    if (ok) {
      Sound.ok();
      await say({ w: st.w === 'riyosha' ? JOB_BOSS() : st.w, e: 'happy', t: `⭕ そう！ ${st.why}` });
    } else {
      Sound.bad();
      await say({ w: st.w === 'riyosha' ? JOB_BOSS() : st.w, t: `❌ Jawaban yang tepat: 「${right.label || right.jp}」. ${st.why}` });
    }
    UI.hideDialog();
    return ok ? 1 : 0;
  }
  let curJob = null;
  const JOB_BOSS = () => ({ food: 'hancho', kaigo: 'leader', genba: 'oyakata', gaishoku: 'tencho' }[curJob]);

  /* ---------- langkah: urutkan ---------- */
  function order(st) {
    const items = st.items.map((x, i) => ({ ...x, i }));
    const p = UI.panel(`<div class="win mg kj">
      <div class="w-title">${esc(st.title)}</div>
      <p class="muted small">Ketuk sesuai urutan yang benar.</p>
      <ol class="kj-seq"></ol>
      <div class="kj-opts"></div>
      <p class="kj-msg small"></p></div>`, 'gamep');
    const seq = p.querySelector('.kj-seq'), box = p.querySelector('.kj-opts'), msg = p.querySelector('.kj-msg');
    return UI.wait(done => {
      let next = 0, miss = 0;
      box.innerHTML = shuffle(items).map(x => `<button class="kj-o" data-i="${x.i}" type="button"><span class="jp">${esc(x.jp)}</span><small>${esc(x.id)}</small></button>`).join('');
      box.querySelectorAll('.kj-o').forEach(b => b.onclick = () => {
        const x = items[+b.dataset.i];
        if (x.i === next) {
          Sound.ok(); b.remove(); next++;
          seq.insertAdjacentHTML('beforeend', `<li><b class="jp">${esc(x.jp)}</b> <small>${esc(x.id)}</small></li>`);
          msg.textContent = '';
          if (next >= items.length) {
            msg.innerHTML = miss <= 1 ? '⭕ すばらしい！ Urutannya benar.' : `Selesai, salah ${miss}×. Ingat urutannya, ya!`;
            box.innerHTML = '<button class="btn block" data-a="ok" type="button">Lanjut ▶</button>';
            box.querySelector('button').onclick = () => { Sound.blip(); UI.closePanel(); done(miss <= 1 ? 1 : miss <= 3 ? .5 : 0); };
          }
        } else {
          miss++; Sound.bad(); b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400);
          msg.textContent = `Belum. Langkah ke-${next + 1}: ${items[next].id.split(':')[0]}…?`;
        }
      });
    });
  }

  /* ---------- langkah: pilih semua yang benar ---------- */
  function pick(st) {
    const items = shuffle(st.items);
    const p = UI.panel(`<div class="win mg kj">
      <div class="w-title">${esc(st.title)}</div>
      <p class="muted small">Ketuk untuk memilih, lalu tekan Cek.</p>
      <div class="kj-grid">${items.map((x, i) => `<button class="kj-t" data-i="${i}" type="button"><span class="jp">${esc(x.jp)}</span>${ro(x.jp, x.ro)}<small>${esc(x.id)}</small></button>`).join('')}</div>
      <p class="kj-msg small"></p>
      <button class="btn block" data-a="check" type="button">Cek ✓</button></div>`, 'gamep');
    const tiles = [...p.querySelectorAll('.kj-t')], msg = p.querySelector('.kj-msg'), btn = p.querySelector('[data-a=check]');
    tiles.forEach(t => t.onclick = () => { if (btn.dataset.done) return; Sound.blip(); t.classList.toggle('sel'); });
    return UI.wait(done => {
      btn.onclick = () => {
        if (btn.dataset.done) { Sound.blip(); UI.closePanel(); return done(btn.dataset.score === '1' ? 1 : 0); }
        let wrong = 0; const notes = [];
        tiles.forEach((t, i) => {
          const x = items[i], sel = t.classList.contains('sel');
          const good = sel === x.ok;
          t.classList.add(good ? 'right' : 'wrong');
          if (!good) { wrong++; notes.push(x.ok ? `${x.jp}: wajib dipakai.` : `${x.jp}: ${x.why || 'tidak boleh.'}`); }
          else if (!x.ok && x.why) notes.push(`✓ ${x.jp}: ${x.why}`);
        });
        (wrong ? Sound.bad : Sound.ok)();
        msg.innerHTML = (wrong ? `❌ Ada ${wrong} yang kurang tepat.<br>` : '⭕ Semua benar!<br>') + notes.map(esc).join('<br>');
        btn.dataset.done = '1'; btn.dataset.score = wrong ? '0' : '1'; btn.textContent = 'Lanjut ▶';
      };
    });
  }

  /* ---------- langkah: cek cepat (ヨシ / NG) ---------- */
  function spot(st) {
    const relax = !!S().settings.relax;
    const pool = [];
    while (pool.length < st.count) pool.push(...shuffle(st.items));
    const list = pool.slice(0, st.count);
    const p = UI.panel(`<div class="win mg kj">
      <div class="w-title">${esc(st.title)}</div>
      <div class="arb-timer"><i></i></div>
      <div class="kj-card"><div class="kj-emo"></div><div class="kj-d"></div></div>
      <div class="kj-yn"><button class="btn kj-ok" type="button">${esc(st.okLabel)}</button><button class="btn danger kj-ng" type="button">${esc(st.ngLabel)}</button></div>
      <p class="kj-msg small"></p>
      <p class="muted small kj-cnt"></p></div>`, 'gamep');
    const emo = p.querySelector('.kj-emo'), desc = p.querySelector('.kj-d'), msg = p.querySelector('.kj-msg'), cnt = p.querySelector('.kj-cnt'), bar = p.querySelector('.arb-timer i');
    return UI.wait(done => {
      let n = -1, ok = 0, t0 = 0, raf = 0, lock = false;
      const show = () => {
        n++;
        if (n >= list.length) {
          cancelAnimationFrame(raf);
          p.querySelector('.kj-yn').innerHTML = '<button class="btn block" type="button">Lanjut ▶</button>';
          emo.textContent = ok >= list.length * .8 ? '🏅' : '📋'; desc.textContent = `Benar ${ok}/${list.length}`;
          p.querySelector('.kj-yn button').onclick = () => { Sound.blip(); UI.closePanel(); done(ok / list.length); };
          return;
        }
        const x = list[n];
        emo.innerHTML = `${x.e}${x.b ? `<span class="kj-b">${x.b}</span>` : ''}`;
        desc.textContent = x.d; cnt.textContent = `${n + 1}/${list.length} · benar ${ok}`;
        t0 = performance.now(); lock = false;
      };
      const answer = say => {
        if (lock || n >= list.length) return;
        lock = true;
        const x = list[n], good = say === x.ok;
        if (good) { ok++; Sound.ok(); msg.innerHTML = `⭕ ${x.ok ? esc(st.okLabel) : esc(st.ngLabel + ' — ' + (x.why || ''))}`; }
        else { Sound.bad(); msg.innerHTML = `❌ ${x.ok ? 'Ini aman/bagus, seharusnya ' + esc(st.okLabel) : esc(st.ngLabel + '! ' + (x.why || ''))}`; }
        setTimeout(show, good ? 450 : 1300);
      };
      p.querySelector('.kj-ok').onclick = () => answer(true);
      p.querySelector('.kj-ng').onclick = () => answer(false);
      const limit = relax ? 1e9 : st.limit;
      const loop = t => {
        if (!p.isConnected) return;
        if (!lock && n < list.length) {
          const left = Math.max(0, 1 - (t - t0) / limit); bar.style.width = (left * 100) + '%';
          if (left <= 0) { lock = true; Sound.bad(); const x = list[n]; msg.innerHTML = `⏰ Terlambat! ${x.ok ? 'Seharusnya ' + esc(st.okLabel) : esc(st.ngLabel + ': ' + (x.why || ''))}`; setTimeout(show, 1300); }
        }
        raf = requestAnimationFrame(loop);
      };
      show(); raf = requestAnimationFrame(loop);
    });
  }

  /* ---------- menjalankan satu shift ---------- */
  async function run(job) {
    curJob = job.id;
    Music.play && Music.play('home');
    await UI.timecard(`${job.icon} ${job.name}`, `${job.place} · しごと たいけん`);
    let got = 0, max = 0;
    for (const st of job.steps) {
      if (st.t === 'say') { await say(st); continue; }
      if (st.t === 'clock') { UI.hideDialog(); await UI.timecard(`🕒 ${st.time}`, st.title); continue; }
      UI.hideDialog();
      const w = st.t === 'spot' ? 2 : 1;
      const r = st.t === 'quiz' ? await quiz(st) : st.t === 'order' ? await order(st) : st.t === 'pick' ? await pick(st) : await spot(st);
      got += r * w; max += w;
    }
    UI.hideDialog();
    const pct = Math.round(got / max * 100), rank = rankOf(pct);
    const R = rec(), r0 = R[job.id] || { best: null, plays: 0, last: 0 };
    const firstToday = r0.last !== S().day;
    const better = !r0.best || 'SABC'.indexOf(rank) < 'SABC'.indexOf(r0.best);
    R[job.id] = { best: better ? rank : r0.best, plays: r0.plays + 1, last: S().day };
    Save.write();
    await result(job, pct, rank, better && r0.best);
    const pts = Math.round(pct / 100 * (firstToday ? 30 : 10));
    if (pts) H().addPoints(pts, `gaji ${job.name}`);
    if (rank === 'S' || rank === 'A') H().addStamp('kerja_' + job.id, `${job.icon} Pekerja teladan: ${job.name}`);
    if (JOBS.every(j => R[j.id])) H().addStamp('kerja_all', '💼 Sudah mencoba semua simulasi kerja');
    curJob = null;
  }

  function result(job, pct, rank, improved) {
    const msg = { S: 'すばらしい！ Siap kerja di Jepang!', A: 'よく できました！ Tinggal sedikit lagi.', B: 'まあまあ。 Ulangi untuk hafal alurnya.', C: 'がんばろう！ Baca Info Kerja, lalu coba lagi.' }[rank];
    const p = UI.panel(`<div class="win kj">
      <div class="w-title">しごと の ひょうか · Penilaian kerja</div>
      <div class="kj-res"><div class="kj-rank r${rank}">${rank}</div><div><b>${job.icon} ${esc(job.name)}</b><br>Skor ${pct}%${improved ? ' · <b>Rekor baru!</b>' : ''}<br><span class="muted small">${msg}</span></div></div>
      <div class="sec-h">Kosakata kerja hari ini</div>
      <div class="kj-voc">${vocabRows(job)}</div>
      <button class="btn block" data-a="close" type="button">Selesai</button></div>`, 'scroll');
    bindVocab(p);
    return UI.wait(done => { p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); }; });
  }
  const vocabRows = job => job.vocab.map(([k, kana, r, id]) => `<button class="kj-v" type="button" data-say="${esc(kana.replace(/\s*\(.*\)/, ''))}"><b class="jp">${esc(k)}</b><span class="jp">${esc(kana)}</span><small>${esc(r)} · ${esc(id)}</small><i>♪</i></button>`).join('');
  const bindVocab = p => p.querySelectorAll('.kj-v').forEach(b => b.onclick = () => Sound.speak(b.dataset.say));

  /* ---------- info kerja (gambaran nyata) ---------- */
  function info(job) {
    const I = job.info, li = a => `<ul class="kj-ul">${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
    const p = UI.panel(`<div class="win kj">
      <div class="w-title">${job.icon} ${esc(job.name)} <span class="jp muted">${esc(job.k)}</span></div>
      <div class="sec-h">Tugas sehari-hari</div>${li(I.tugas)}
      <div class="sec-h">Contoh jadwal satu hari</div>${li(I.jadwal)}
      <div class="sec-h">Kondisi kerja</div><p class="small">${esc(I.kondisi)}</p>
      <div class="sec-h">Jalur visa & ujian</div><p class="small">${esc(I.visa)}</p>
      <div class="sec-h">Tips dari senpai</div><p class="small">${esc(I.tips)}</p>
      <div class="sec-h">Kosakata penting</div><div class="kj-voc">${vocabRows(job)}</div>
      <p class="muted small">Info umum untuk gambaran. Aturan visa & ujian bisa berubah, cek situs resmi ssw.go.jp sebelum mendaftar.</p>
      <div class="row"><button class="btn ghost" data-a="close" type="button">Tutup</button><button class="btn" data-a="go" type="button">Mulai shift ▶</button></div></div>`, 'scroll');
    bindVocab(p);
    return UI.wait(done => {
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(false); };
      p.querySelector('[data-a=go]').onclick = () => { Sound.blip(); UI.closePanel(); done(true); };
    });
  }

  /* ---------- pilih tempat kerja ---------- */
  async function open() {
    for (;;) {
      const R = rec();
      const p = UI.panel(`<div class="win kj">
        <div class="w-title">💼 しごと たいけん · Simulasi Kerja</div>
        <p class="small muted">Rasakan satu hari kerja di Jepang. Atasan akan memandu dan menilai kerjamu.</p>
        <div class="kj-jobs">${JOBS.map(j => `<div class="kj-job">
          <div class="kj-ic">${j.icon}</div>
          <div class="kj-jt"><b>${esc(j.name)}</b> <span class="jp muted small">${esc(j.k)}</span><br><small>${esc(j.desc)}</small>
            ${R[j.id] ? `<br><small class="kj-best">Nilai terbaik: <b class="r${R[j.id].best}">${R[j.id].best}</b> · ${R[j.id].plays}× main</small>` : ''}</div>
          <div class="kj-jb"><button class="btn small" data-go="${j.id}" type="button">Mulai ▶</button><button class="btn ghost small" data-info="${j.id}" type="button">ℹ Info</button></div>
        </div>`).join('')}</div>
        <button class="btn block ghost" data-a="close" type="button">Tutup</button></div>`, 'scroll');
      const a = await UI.wait(done => {
        p.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { Sound.blip(); done({ go: b.dataset.go }); });
        p.querySelectorAll('[data-info]').forEach(b => b.onclick = () => { Sound.blip(); done({ info: b.dataset.info }); });
        p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); done(null); };
      });
      UI.closePanel();
      if (!a) return;
      if (a.info && !(await info(BY[a.info]))) continue;
      await run(BY[a.go || a.info]);
    }
  }

  return { open, run: id => run(BY[id]), JOBS };
})();
