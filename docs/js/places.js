/* =========================================================
   TEMPAT-TEMPAT BARU & ADEGAN SEHARI-HARI
   - Kota diperluas ke timur: jalan belanja (おみせ), kafe, toko buku,
     pos polisi (こうばん), kedai ramen, taman dengan air mancur.
   - Konbini & stasiun (えき) bisa dimasuki.
   - Naik kereta ke pantai (うみ): kerang berhuruf, memancing di laut, es serut.
   Setiap tempat punya adegan belajar: belanja, beli tiket, memesan makanan,
   bertanya arah, dll. Poin diberikan sekali per hari per adegan.
   ========================================================= */

/* ---------- tokoh baru ---------- */
Object.assign(CHARACTERS, {
  ekiin:  { name: 'Petugas Stasiun', color: '#2f5d50' },
  mama:   { name: 'Ibu Hana',        color: '#3b8a78' },
  taisho: { name: 'Paman Ramen',     color: '#b0363f' },
  shoten: { name: 'Kak Toko Buku',   color: '#6a5a9a' },
});
Object.assign(Pix.PAL, {
  ekiin:  { h: '#2d2b3b', H: '#16151d', e: '#2b2b44', E: '#4f5690', I: '#8d95d8', o: '#2f5d50', O: '#1f4038', a: '#f6d44a', A: '#c9a526', p: '#2a3530', b: '#1d1d24', c: '#e9eef8' },
  mama:   { h: '#1f2a44', H: '#121a2e', e: '#1d2233', E: '#3f7a8c', I: '#88c8d4', o: '#f7f3ea', O: '#d3c7b3', a: '#5bb3a0', A: '#3b8a78', p: '#4a3f35', b: '#2a2a2a', c: '#f7f3ea' },
  taisho: { h: '#2f2c40', H: '#191824', e: '#2a2a3a', E: '#5a4a3a', I: '#9a8a7a', o: '#f7f3ea', O: '#d3c7b3', a: '#d8455d', A: '#9c3446', p: '#3a3f55', b: '#2a2a2a', c: '#f7f3ea' },
  shoten: { h: '#6b4430', H: '#452a1c', e: '#2a2238', E: '#6b4430', I: '#b08060', o: '#8a78c8', O: '#6a5aa8', a: '#f6d44a', A: '#c9a526', p: '#3a3f55', b: '#3a2a2a', c: '#f7f3ea', g: '#3a2438' },
});
Object.assign(Pix.STYLE, {
  ekiin:  { hair: 'short', uniform: 'blazer', cap: true },
  mama:   { hair: 'bun', uniform: 'apron' },
  taisho: { hair: 'short', uniform: 'apron', headband: true },
  shoten: { hair: 'bob', uniform: 'cardigan', glasses: true },
});

/* ---------- ikan laut ---------- */
FISH.push(
  { id: 'tai', jp: 'たい', ro: 'tai', name: 'ikan kakap merah', where: 'sea', rare: 2, pts: 14, col: ['#f28c8c', '#c9574f'] },
  { id: 'aji', jp: 'あじ', ro: 'aji', name: 'ikan kembung', where: 'sea', rare: 1, pts: 6, col: ['#b9c9d6', '#5a7a96'] },
  { id: 'saba', jp: 'さば', ro: 'saba', name: 'ikan makarel', where: 'sea', rare: 1, pts: 7, col: ['#8fb3c9', '#3f5f7a'] },
  { id: 'tako', jp: 'たこ', ro: 'tako', name: 'gurita', where: 'sea', rare: 2, pts: 15, col: ['#e0775f', '#a8452e'], shape: 'crab' },
  { id: 'fugu', jp: 'ふぐ', ro: 'fugu', name: 'ikan buntal', where: 'sea', rare: 3, pts: 24, col: ['#f6e0a0', '#8a7a4a'] },
);

/* ---------- kota diperluas (timur: jalan belanja & taman) ---------- */
MAPS.town.rows = [
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  'TP,...................,...PTT.,....==.......,.TT',
  'T.f........................T.......==..........T',
  'TP..................Y.....PT.......==..........T',
  'T..........................T.......==..........T',
  'T.,......................,.T.......==..........T',
  'T.,.....#####==#####...,...T....=..==..=.......T',
  'T............==.................=..==..=.......T',
  'T.......f....==.L............f..=..==..=......fT',
  'T............==...f........TT...=..==..=.......T',
  'TM...........==...........VT....=.L==..=....=.VT',
  'T==============================================T',
  'T==============================================T',
  'T.,....L.....==.....L..,...T.,...P.==.....L....T',
  'TP.f.....P.,.==......,...P.T.......==P........PT',
  'T.,WWWWW...b.==............T.......==.f.f..f.f.T',
  'TP.WWWWW.....==.............P......==..b....b..T',
  'T..WWWWW..f..==..f.................==....OO....T',
  'Tf.WWWWW.....==............T...======.f..OO..f.T',
  'T.P........P.==............T.......==.L......L.T',
  'T......,....L==========....T..f....==..b....b..T',
  'TP...f....P..==..f.....,...TT..,..,==P..fP.f..PT',
  'T.......,....==.....,......T.T...f.==.........TT',
  'WWWWWWWWWWWWWBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'WWWWWWWWWWWWWBBWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
];
MAPS.town.buildings.push(
  { type: 'kafe',  x: 30, y: 2,  w: 5, h: 4, doors: [[32, 5]] },
  { type: 'honya', x: 37, y: 2,  w: 5, h: 4, doors: [[39, 5]] },
  { type: 'koban', x: 43, y: 7,  w: 3, h: 3, doors: [[44, 9]] },
  { type: 'ramen', x: 30, y: 14, w: 5, h: 4, doors: [[32, 17]] },
);
MAPS.town.signs.push(
  { x: 37, y: 1,  text: 'おみせ', note: 'Jalan belanja' },
  { x: 30, y: 6,  text: 'コーヒー', note: 'Kopi (kafe)', kata: true },
  { x: 38, y: 6,  text: 'ほんや', note: 'Toko buku' },
  { x: 42, y: 10, text: 'こうばん', note: 'Pos polisi' },
  { x: 29, y: 17, text: 'ラーメン', note: 'Ramen', kata: true },
  { x: 38, y: 13, text: 'こうえん', note: 'Taman' },
);
MAPS.town.warps.push(
  { x: 22, y: 10, to: 'konbini', tx: 6, ty: 7, dir: 'up' },
  { x: 22, y: 19, to: 'eki', tx: 7, ty: 9, dir: 'up' },
  { x: 32, y: 5,  to: 'kafe', tx: 5, ty: 7, dir: 'up' },
  { x: 39, y: 5,  to: 'honya', tx: 5, ty: 6, dir: 'up' },
  { x: 44, y: 9,  to: 'koban', tx: 4, ty: 5, dir: 'up' },
  { x: 32, y: 17, to: 'ramen', tx: 5, ty: 6, dir: 'up' },
);
MAPS.town.closedDoors = [];
Object.assign(MAPS.town.spots, { ryo: [38, 10], imoya: [29, 10], fountain: [41, 19] });

/* ---------- peta dalam ruangan & pantai ---------- */
const toTown = (x, y, tx, ty) => ({ x, y, to: 'town', tx, ty, dir: 'down' });
Object.assign(MAPS, {
  konbini: {
    name: 'Konbini', rows: [
      'WWWWWWWWWWWWW',
      'WIIIIWWWGGGGW',
      'W...........W',
      'W.GG.GG.....W',
      'W.........RRW',
      'W.GG.GG.....W',
      'W...........W',
      'Wp.........pW',
      'WWWWWWxWWWWWW',
    ],
    warps: [toTown(6, 8, 22, 11)],
    spots: { tenin: [11, 3] },
  },
  eki: {
    name: 'Stasiun Sakura', rows: [
      'WWWWWWWWWWWWWWW',
      'WZZZZZZZZZZZZZW',
      'WZZZZZZZZZZZZZW',
      'W.............W',
      'W.hh......hh..W',
      'WggggjggggjgggW',
      'W.............W',
      'WJJ.......kk.NW',
      'W.............W',
      'Wp..hh.......pW',
      'WWWWWWWxWWWWWWW',
    ],
    warps: [toTown(7, 10, 22, 20)],
    closedDoors: [{ x: 5, y: 5, kind: 'gate' }, { x: 10, y: 5, kind: 'gate' }],
    spots: { ekiin: [10, 6], platform: [7, 3] },
  },
  kafe: {
    name: 'Kafe Keluarga Hana', rows: [
      'WWWWWWWWWWW',
      'WnWWNWWWnWW',
      'W.........W',
      'Wkkkk....pW',
      'W.........W',
      'W.t.t..t.pW',
      'W.........W',
      'Wp.......pW',
      'WWWWWxWWWWW',
    ],
    warps: [toTown(5, 8, 32, 6)],
    spots: { mama: [2, 2], hana: [4, 6] },
  },
  ramen: {
    name: 'Kedai Ramen', rows: [
      'WWWWWWWWWWW',
      'WWNWWWWWnWW',
      'W.........W',
      'Wkkkkkkkk.W',
      'W.........W',
      'W........JW',
      'Wp.......pW',
      'WWWWWxWWWWW',
    ],
    warps: [toTown(5, 7, 32, 18)],
    spots: { taisho: [4, 2], kenta: [7, 4] },
  },
  honya: {
    name: 'Toko Buku', rows: [
      'WWWWWWWWWWW',
      'WSSSSWSSSSW',
      'W.........W',
      'W.SS...SS.W',
      'W.........W',
      'Wkk....SS.W',
      'W.........W',
      'WWWWWxWWWWW',
    ],
    warps: [toTown(5, 7, 39, 6)],
    spots: { shoten: [1, 4], yuki: [5, 2] },
  },
  koban: {
    name: 'Pos Polisi (こうばん)', rows: [
      'WWWWWWWWW',
      'WnNWWWWnW',
      'W.......W',
      'W..TTT..W',
      'W.......W',
      'Wp.....pW',
      'WWWWxWWWW',
    ],
    warps: [toTown(4, 6, 44, 10)],
    spots: { omawari: [4, 2] },
  },
  umi: {
    name: 'Pantai (うみ)', outdoor: true, rows: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTT',
      'T...,.............P......T',
      'T.....................f..T',
      'T....................Y...T',
      'T..........,.............T',
      'T________________________T',
      'T___u______u_______u_____T',
      'T______*_______*_________T',
      'T__*________u______*_____T',
      'T_____________*______u___T',
      'T___*____________________T',
      'WWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWWWWWWWWWWWWWW',
    ],
    buildings: [{ type: 'station', x: 2, y: 1, w: 6, h: 4, doors: [[5, 4]] }],
    signs: [{ x: 9, y: 4, text: 'うみ', note: 'Laut / pantai' }],
    warps: [{ x: 5, y: 4, to: 'eki', tx: 7, ty: 3, dir: 'down' }],
    spots: { kid: [10, 7], mai: [17, 9] },
  },
});

/* ---------- adegan ---------- */
const Places = (() => {
  const S = () => Save.d;
  const H = () => Game.h;
  const say = l => UI.say(l);
  // poin sekali per hari per adegan
  function once(key, pts, why) {
    const d = S().placeDay || (S().placeDay = {});
    if (d[key] === S().day) return false;
    d[key] = S().day; Save.write();
    if (pts) H().addPoints(pts, why);
    return true;
  }
  const STAFF = { konbini: 'tenin', eki: 'ekiin', kafe: 'mama', ramen: 'taisho', honya: 'shoten', koban: 'omawari' };

  /* ---- siapa ada di tempat ini ---- */
  function npcs(mapId, ctx) {
    const SP = MAPS[mapId].spots || {}, st = S().step, out = [];
    const busyId = id => ctx.inScript(id) || (ctx.ev && ctx.ev.npc === id);
    if (mapId === 'town') {
      if (!busyId('ryo') && S().day % 2 === 0) out.push({ id: 'ryo', x: SP.ryo[0], y: SP.ryo[1], dir: 'down' });
      if (!busyId('imoya') && (st === 'after' || st === 'evening')) out.push({ id: 'imoya', x: SP.imoya[0], y: SP.imoya[1], dir: 'right' });
      return out;
    }
    const staff = STAFF[mapId];
    if (staff) {
      const qm = mapId === 'konbini' && H().q('list').state === 'active' ? '!' : null;
      out.push({ id: staff, x: SP[staff][0], y: SP[staff][1], dir: 'down', marker: qm });
    }
    const free = st === 'after' || st === 'evening';
    if (mapId === 'kafe' && free && H().chapter() >= 2 && !busyId('hana')) out.push({ id: 'hana', x: SP.hana[0], y: SP.hana[1], dir: 'up' });
    if (mapId === 'ramen' && free && S().day % 2 === 1 && !busyId('kenta')) out.push({ id: 'kenta', x: SP.kenta[0], y: SP.kenta[1], dir: 'up' });
    if (mapId === 'honya' && free && S().day % 3 === 0 && !busyId('yuki')) out.push({ id: 'yuki', x: SP.yuki[0], y: SP.yuki[1], dir: 'up' });
    if (mapId === 'eki' && !busyId('emma')) out.push({ id: 'emma', x: 12, y: 3, dir: 'down' });
    if (mapId === 'umi') { out.push({ id: 'kid', x: SP.kid[0], y: SP.kid[1], dir: 'down' }); out.push({ id: 'mai', x: SP.mai[0], y: SP.mai[1], dir: 'left' }); }
    return out;
  }
  const song = m => ({ umi: 'morning', eki: 'evening', konbini: 'home', kafe: 'home', ramen: 'home', honya: 'home', koban: 'home' })[m];

  /* ---- percakapan dengan tokoh di tempat ---- */
  const TALK_HERE = { tenin: 'konbini', ekiin: 'eki', mama: 'kafe', taisho: 'ramen', shoten: 'honya', omawari: 'koban' };
  function talks(npc) {
    const m = World.map;
    if (TALK_HERE[npc.id] === m) return true;
    if (m === 'kafe' && npc.id === 'hana') return true;
    if (m === 'ramen' && npc.id === 'kenta') return true;
    if (m === 'honya' && npc.id === 'yuki') return true;
    if (m === 'eki' && npc.id === 'emma') return true;
    if (m === 'umi' && (npc.id === 'kid' || npc.id === 'mai')) return true;
    return ['ryo', 'imoya'].includes(npc.id) && m === 'town';
  }
  async function talk(npc) {
    const id = npc.id, m = World.map;
    if (id === 'tenin') return konbini();
    if (id === 'ekiin') return ekiin();
    if (id === 'mama') return kafe();
    if (id === 'taisho') return ramen();
    if (id === 'shoten') return honya();
    if (id === 'omawari') return koban();
    const L = LINES[m + ':' + id] || LINES[id];
    if (L) { await H().runLines(L[S().day % L.length], [id]); }
  }
  const LINES = {
    'kafe:hana': [
      [{ w: 'hana', e: 'happy', jp: 'いらっしゃい！ここ は わたし の いえ の カフェ。', ro: 'irasshai! koko wa watashi no ie no kafe.', id: 'Selamat datang! Ini kafe keluargaku.' }, { w: 'hana', t: 'Coba pesan sesuatu ke ibuku. Kue di sini enak, lho!' }],
      [{ w: 'hana', jp: 'この ケーキ、おいしい よ。', ro: 'kono keeki, oishii yo.', id: 'Kue ini enak, lho.' }, { w: 'hana', t: 'ケーキ (keeki) = kue. Kata serapan dari bahasa Inggris "cake", jadi ditulis katakana.' }],
    ],
    'ramen:kenta': [
      [{ w: 'kenta', e: 'happy', jp: 'ラーメン は さいこう！', ro: 'raamen wa saikou!', id: 'Ramen itu yang terbaik!' }, { w: 'kenta', t: 'Beli tiket makanan di mesin dulu, lalu berikan ke paman. Namanya しょっけん (shokken).' }],
      [{ w: 'kenta', jp: 'ずるずる… おいしい！', ro: 'zuru zuru… oishii!', id: 'Sruput… enak!' }, { w: 'kenta', t: 'Di Jepang, menyeruput mi dengan bunyi itu sopan. Tandanya makanannya enak!' }],
    ],
    'honya:yuki': [
      [{ w: 'yuki', e: 'happy', jp: 'あ！ほん を かいに きた の？', ro: 'a! hon wo kai ni kita no?', id: 'Eh! Mau beli buku?' }, { w: 'yuki', t: 'Aku suka まんが (manga). Rak buku cerita juga bisa kamu baca, sesuai huruf yang sudah kamu kuasai!' }],
    ],
    'eki:emma': [
      [{ w: 'emma', e: 'happy', jp: 'うみ に いきます！', ro: 'umi ni ikimasu!', id: 'Aku mau ke pantai!' }, { w: 'emma', t: 'Beli きっぷ (kippu, tiket) di mesin, lalu lewati gerbang. Keretanya datang ke peron.' }],
      [{ w: 'emma', jp: 'でんしゃ は はやい です ね。', ro: 'densha wa hayai desu ne.', id: 'Keretanya cepat, ya.' }, { w: 'emma', t: 'でんしゃ (densha) = kereta listrik. Kereta di Jepang hampir selalu tepat waktu!' }],
    ],
    'umi:kid': [
      [{ w: 'kid', e: 'happy', jp: 'すなの おしろ！', ro: 'suna no oshiro!', id: 'Istana pasir!' }, { w: 'kid', t: 'すな (suna) = pasir. Ada kerang berhuruf di pantai. Coba cari!' }],
    ],
    'umi:mai': [
      [{ w: 'mai', e: 'happy', jp: 'うみ、きれい！', ro: 'umi, kirei!', id: 'Lautnya indah!' }, { w: 'mai', t: 'Aku suka ombak! なみ (nami) = ombak.' }],
    ],
    ryo: [
      [{ w: 'ryo', e: 'happy', jp: 'きょう も うたう よ！', ro: 'kyou mo utau yo!', id: 'Hari ini aku bernyanyi lagi!' }, { w: 'ryo', t: 'うたう (utau) = bernyanyi. Mampir ke taman, ada air mancur baru!' }],
      [{ w: 'ryo', jp: 'おんがく は たのしい！', ro: 'ongaku wa tanoshii!', id: 'Musik itu menyenangkan!' }],
    ],
    imoya: [
      [{ w: 'imoya', e: 'happy', jp: 'いしやきいも〜！', ro: 'ishiyakiimo~!', id: 'Ubi bakar batu~!' }, { w: 'imoya', t: 'Penjual ubi bakar berkeliling dan bernyanyi seperti ini di musim dingin.' }],
    ],
  };

  /* ---- KONBINI ---- */
  async function konbini() {
    await say({ w: 'tenin', e: 'happy', jp: 'いらっしゃいませ！', ro: 'irasshaimase!', id: 'Selamat datang!' });
    if (H().q('list').state === 'active') {
      UI.hideDialog();
      await Games.shop({ count: 3 });
      H().setQ('list', { state: 'done' }); H().addPoints(QUESTS.list.reward, 'misi'); H().addStamp('list', QUESTS.list.title);
      return;
    }
    const a = await H().menuChoice('Mau apa di kasir?', ['Beli jajanan 🍙', 'Beli bekal & minta dipanaskan 🍱', 'Latihan belanja (daftar katakana)', 'Tidak jadi']);
    UI.hideDialog();
    if (a === 0) {
      await Extras.shop('konbini');
      await bagQuestion();
    }
    if (a === 1) {
      await say({ w: 'tenin', jp: 'おべんとう、あたためますか？', ro: 'obentou, atatamemasu ka?', id: '(Kasir bertanya soal bekalmu)' });
      await H().runLines([{ q: '「あたためますか？」 artinya…', o: [
        { jp: 'Mau dipanaskan?', ro: 'atatameru = menghangatkan', ok: true },
        { jp: 'Perlu kantong plastik?', ro: '', why: 'Itu 「ふくろ は いりますか？」. あたためる = menghangatkan.' },
        { jp: 'Bayar tunai?', ro: '', why: 'Bukan. あたためる (atatameru) = menghangatkan.' },
      ] }], ['tenin']);
      await say({ jp: 'はい、おねがいします。', ro: 'hai, onegai shimasu.', id: 'Ya, tolong.' });
      await say({ n: 'ピッ… ブーン… チン！ Microwave berbunyi. Bekalmu hangat.' });
      await say({ w: 'tenin', e: 'happy', jp: 'おまたせ しました。', ro: 'omatase shimashita.', id: 'Maaf menunggu.' });
      Places.eat && Places.eat('bento');
      if (once('bento', 10, 'belanja di konbini')) H().addStamp('konbini', 'Belanja di konbini');
    }
    if (a === 2) await Games.shop({ count: 3, title: 'Latihan Belanja' });
    if (a !== 3) await say({ w: 'tenin', e: 'happy', jp: 'ありがとうございました！', ro: 'arigatou gozaimashita!', id: 'Terima kasih banyak!' });
  }
  async function bagQuestion() {
    await say({ w: 'tenin', jp: 'ふくろ は いりますか？', ro: 'fukuro wa irimasu ka?', id: 'Perlu kantong plastik?' });
    const i = await UI.choose('Jawab kasir:', [{ jp: 'はい、おねがいします。', ro: 'hai, onegai shimasu.' }, { jp: 'いいえ、だいじょうぶ です。', ro: 'iie, daijoubu desu.' }]);
    await say(i === 0 ? { w: 'tenin', e: 'happy', jp: 'はい、どうぞ。', ro: 'hai, douzo.', id: 'Ini, silakan. (Kantong plastik di Jepang biasanya berbayar 3 yen!)' }
      : { w: 'tenin', e: 'happy', jp: 'エコ です ね！', ro: 'eko desu ne!', id: 'Ramah lingkungan, ya! (エコ = eco)' });
    once('konbini', 8, 'percakapan kasir');
  }
  const SHELF = [
    { jp: 'おにぎり', ro: 'onigiri', id: 'Rak nasi kepal. Ada isi ツナ (tuna), うめ (plum), さけ (salmon).' },
    { jp: 'パン', ro: 'pan', id: 'Rak roti. メロンパン, カレーパン, サンドイッチ…' },
    { jp: 'おかし', ro: 'okashi', id: 'Rak camilan: ポテトチップス, チョコ, ガム.' },
    { jp: 'ざっし', ro: 'zasshi', id: 'Rak majalah & まんが (manga). Banyak orang membaca sambil berdiri: たちよみ.' },
  ];
  async function goods(t) {
    const s = SHELF[(t.x || 0) % SHELF.length];
    await say({ jp: s.jp, ro: s.ro, id: s.id });
  }

  /* ---- STASIUN ---- */
  async function machine() {
    if (World.map === 'ramen') return shokken();
    await say({ n: 'Mesin tiket: きっぷうりば (kippu-uriba). Nama tujuan ditulis dengan hiragana.' });
    if (S().ticket) return say({ n: 'Kamu sudah punya きっぷ (tiket) ke うみ. Lewati gerbang lalu naik kereta di peron!' });
    await H().runLines([{ q: 'Kamu ingin ke pantai. Tekan tombol yang mana?', o: [
      { jp: 'うみ', ro: 'umi', ok: true },
      { jp: 'やま', ro: 'yama', why: 'やま (yama) = gunung. Pantai/laut = うみ (umi).' },
      { jp: 'かわ', ro: 'kawa', why: 'かわ (kawa) = sungai. Pantai/laut = うみ (umi).' },
      { jp: 'もり', ro: 'mori', why: 'もり (mori) = hutan. Pantai/laut = うみ (umi).' },
    ] }], []);
    await say({ jp: 'ひゃくごじゅう えん です。', ro: 'hyaku gojuu en desu.', id: '150 yen. (Kamu membayar 🌸10 poin)' });
    S().points = Math.max(0, (S().points || 0) - 10); S().ticket = 'umi'; Save.write();
    UI.toast('🎫 きっぷ ke うみ didapat!');
    H().addStamp('kippu', 'Tiket kereta pertama');
  }
  async function gate() {
    Sound.bad();
    await say({ n: 'ピンポーン！ Gerbang tertutup.' });
    await say({ jp: 'きっぷ を かって ください。', ro: 'kippu wo katte kudasai.', id: 'Silakan beli tiket dulu. (Mesin tiket ada di kiri bawah)' });
  }
  async function train() {
    await say({ n: '🔔 Pengumuman:' });
    await say({ jp: 'まもなく、でんしゃ が まいります。', ro: 'mamonaku, densha ga mairimasu.', id: 'Sebentar lagi kereta akan tiba.' });
    if (!S().ticket) return say({ n: 'Kamu belum punya tiket. Kembali ke lobi dan beli きっぷ di mesin.' });
    const a = await H().menuChoice('Naik kereta ke うみ (pantai)?', ['Naik 🚃', 'Nanti saja']);
    UI.hideDialog();
    if (a !== 0) return;
    S().ticket = null; Save.write();
    await UI.timecard('🚃 でんしゃ', 'Menuju うみ (pantai)…');
    await say({ jp: 'つぎ は、うみ。うみ です。', ro: 'tsugi wa, umi. umi desu.', id: 'Pemberhentian berikutnya: Umi.' });
    UI.hideDialog();
    await H().goTo('umi', 5, 5, 'down');
    if (once('umi', 15, 'jalan-jalan ke pantai')) { H().addStamp('umi', 'Liburan ke pantai'); await say({ n: 'うみ だ！ Angin laut terasa segar. Cari kerang berhuruf, memancing, atau beli es serut!' }); }
  }
  const EKIIN = [
    { q: 'Bagaimana bertanya "Permisi, toilet di mana?"', ok: 'すみません、トイレ は どこ ですか？', ro: 'sumimasen, toire wa doko desu ka?', bad: ['トイレ を ください。', 'トイレ は おいしい です。'], ans: { jp: 'あちら です。', ro: 'achira desu.', id: 'Di sebelah sana.' } },
    { q: 'Bagaimana bertanya "Kereta ke Umi dari peron nomor berapa?"', ok: 'うみ は なんばんせん ですか？', ro: 'umi wa nanbansen desu ka?', bad: ['うみ は いくら ですか？', 'うみ は すき ですか？'], ans: { jp: 'いちばんせん です。', ro: 'ichibansen desu.', id: 'Peron nomor 1.' } },
    { q: 'Bagaimana bertanya "Tiketnya berapa?"', ok: 'きっぷ は いくら ですか？', ro: 'kippu wa ikura desu ka?', bad: ['きっぷ は どこ ですか？', 'きっぷ は なん ですか？'], ans: { jp: 'ひゃくごじゅう えん です。', ro: 'hyaku gojuu en desu.', id: '150 yen.' } },
  ];
  async function ekiin() {
    await say({ w: 'ekiin', e: 'happy', jp: 'いらっしゃいませ。どうしましたか？', ro: 'irasshaimase. dou shimashita ka?', id: 'Selamat datang. Ada yang bisa dibantu?' });
    const L = EKIIN[S().day % EKIIN.length];
    await H().runLines([{ q: L.q, o: [{ jp: L.ok, ro: L.ro, ok: true }, ...L.bad.map(b => ({ jp: b, ro: '', why: `Coba lagi. Yang tepat: 「${L.ok}」` }))] }], ['ekiin']);
    await say({ w: 'ekiin', e: 'happy', ...L.ans });
    once('ekiin', 8, 'bertanya di stasiun');
  }

  /* ---- KAFE ---- */
  const KAFE_MENU = [
    { jp: 'コーヒー', ro: 'koohii', id: 'kopi' }, { jp: 'ケーキ', ro: 'keeki', id: 'kue' },
    { jp: 'ジュース', ro: 'juusu', id: 'jus' }, { jp: 'パフェ', ro: 'pafe', id: 'parfait' },
  ];
  async function kafe() {
    await say({ w: 'mama', e: 'happy', jp: 'いらっしゃいませ。ごちゅうもん は？', ro: 'irasshaimase. gochuumon wa?', id: 'Selamat datang. Mau pesan apa?' });
    const i = await UI.choose('Pilih menu (baca katakananya!):', KAFE_MENU.map(m => ({ jp: m.jp, ro: m.ro })));
    const m = KAFE_MENU[i];
    await H().runLines([{ q: `Bagaimana bilang "Minta ${m.id}"?`, o: [
      { jp: `${m.jp} を ください。`, ro: `${m.ro} wo kudasai.`, ok: true },
      { jp: `${m.jp} は どこ ですか？`, ro: '', why: '〜は どこ ですか = di mana? Untuk memesan pakai 〜を ください.' },
      { jp: `${m.jp} が きらい です。`, ro: '', why: 'きらい = tidak suka. Untuk memesan pakai 〜を ください.' },
    ] }], ['mama']);
    await say({ w: 'mama', e: 'happy', jp: 'かしこまりました。', ro: 'kashikomarimashita.', id: 'Baik, dimengerti. (bahasa sopan pelayan)' });
    await say({ n: `${m.jp} datang. Kamu menikmatinya pelan-pelan. おいしい！` });
    Places.eat && Places.eat(['kohi', 'keki', 'jusu', 'pafe'][i]);
    await say({ jp: 'ごちそうさまでした！', ro: 'gochisousama deshita!', id: 'Terima kasih atas hidangannya!' });
    if (once('kafe', 10, 'memesan di kafe')) H().addStamp('kafe', 'Memesan di kafe');
  }

  /* ---- RAMEN ---- */
  async function shokken() {
    await say({ n: 'Mesin tiket makanan: しょっけん (shokken). Tombolnya ditulis katakana & hiragana.' });
    await H().runLines([{ q: 'Kamu ingin ramen miso. Tekan tombol yang mana?', o: [
      { jp: 'みそラーメン', ro: 'miso raamen', ok: true },
      { jp: 'しおラーメン', ro: 'shio raamen', why: 'しお (shio) = garam. Yang miso: みそラーメン.' },
      { jp: 'ぎょうざ', ro: 'gyouza', why: 'ぎょうざ = pangsit goreng. Yang miso: みそラーメン.' },
      { jp: 'ごはん', ro: 'gohan', why: 'ごはん = nasi. Yang miso: みそラーメン.' },
    ] }], []);
    S().shokken = true; Save.write();
    UI.toast('🎟 Tiket ramen didapat! Berikan ke paman di konter.');
  }
  async function ramen() {
    await say({ w: 'taisho', e: 'happy', jp: 'へい、らっしゃい！', ro: 'hei, rasshai!', id: 'Hei, selamat datang! (sapaan khas kedai)' });
    if (!S().shokken) return say({ w: 'taisho', t: 'Beli tiket di mesin しょっけん dulu, ya! Mesinnya di pojok kanan.' });
    S().shokken = false; Save.write();
    await say({ w: 'taisho', e: 'happy', jp: 'みそラーメン、おまち！', ro: 'miso raamen, omachi!', id: 'Ramen miso, silakan! (sudah jadi)' });
    await H().runLines([{ q: 'Sebelum makan, apa yang diucapkan?', o: [
      { jp: 'いただきます！', ro: 'itadakimasu!', ok: true },
      { jp: 'ごちそうさま！', ro: 'gochisousama!', why: 'ごちそうさま diucapkan SESUDAH makan. Sebelum makan: いただきます.' },
      { jp: 'おやすみ！', ro: 'oyasumi!', why: 'おやすみ = selamat tidur. Sebelum makan: いただきます.' },
    ] }], ['taisho']);
    await say({ n: 'ずるずる… Kuahnya gurih, minya kenyal. あつい けど おいしい！(panas tapi enak!)' });
    Places.eat && Places.eat('misoramen');
    await say({ w: 'taisho', e: 'happy', jp: 'まいど！', ro: 'maido!', id: 'Terima kasih, datang lagi ya!' });
    if (once('ramen', 12, 'makan ramen')) H().addStamp('ramen', 'Makan ramen');
  }

  /* ---- TOKO BUKU ---- */
  const HON = [
    { jp: 'まんが', ro: 'manga', id: 'komik', bad: ['kamus', 'majalah'] },
    { jp: 'じしょ', ro: 'jisho', id: 'kamus', bad: ['komik', 'buku gambar'] },
    { jp: 'えほん', ro: 'ehon', id: 'buku bergambar', bad: ['kamus', 'buku catatan'] },
  ];
  async function honya() {
    const h = HON[S().day % HON.length];
    await say({ w: 'shoten', e: 'happy', jp: 'いらっしゃいませ。この ほん、おすすめ です。', ro: 'irasshaimase. kono hon, osusume desu.', id: 'Selamat datang. Buku ini rekomendasi kami.' });
    await H().runLines([{ q: `Sampulnya bertuliskan 「${h.jp}」. Artinya…`, o: [
      { jp: h.id, ro: h.ro, ok: true }, ...h.bad.map(b => ({ jp: b, ro: '', why: `${h.jp} (${h.ro}) = ${h.id}.` })),
    ] }], ['shoten']);
    await say({ w: 'shoten', t: 'Rak-rak di sini juga berisi buku cerita pendek. Coba baca, sesuai huruf yang sudah kamu kuasai!' });
    once('honya', 6, 'toko buku');
  }

  /* ---- POS POLISI: bertanya arah ---- */
  async function koban() {
    await say({ w: 'omawari', e: 'happy', jp: 'こんにちは。みち を おしえましょう か？', ro: 'konnichiwa. michi wo oshiemashou ka?', id: 'Halo. Mau saya tunjukkan jalannya?' });
    await say({ w: 'omawari', t: 'Kata arah penting: みぎ (migi) = kanan, ひだり (hidari) = kiri, まっすぐ (massugu) = lurus.' });
    const Q = [
      { q: 'Polisi: 「えき は まっすぐ です」. Stasiun ada di…', o: [{ jp: 'lurus', ro: 'massugu', ok: true }, { jp: 'kanan', ro: 'migi', why: 'まっすぐ (massugu) = lurus.' }, { jp: 'kiri', ro: 'hidari', why: 'まっすぐ (massugu) = lurus.' }] },
      { q: 'Polisi: 「こうえん は みぎ です」. Taman ada di…', o: [{ jp: 'kanan', ro: 'migi', ok: true }, { jp: 'kiri', ro: 'hidari', why: 'みぎ (migi) = kanan.' }, { jp: 'belakang', ro: 'ushiro', why: 'みぎ (migi) = kanan.' }] },
      { q: 'Polisi: 「がっこう は ひだり です」. Sekolah ada di…', o: [{ jp: 'kiri', ro: 'hidari', ok: true }, { jp: 'kanan', ro: 'migi', why: 'ひだり (hidari) = kiri.' }, { jp: 'lurus', ro: 'massugu', why: 'ひだり (hidari) = kiri.' }] },
    ];
    await H().runLines([Q[S().day % Q.length]], ['omawari']);
    await say({ w: 'omawari', e: 'happy', jp: 'きをつけて ね。', ro: 'ki wo tsukete ne.', id: 'Hati-hati, ya.' });
    if (once('koban', 10, 'bertanya arah')) H().addStamp('koban', 'Bertanya arah di こうばん');
  }

  /* ---- papan, air mancur, pantai ---- */
  async function notice() {
    const m = World.map;
    if (m === 'eki') return say({ jp: 'じこくひょう：つぎ の でんしゃ は うみ ゆき', ro: 'jikokuhyou: tsugi no densha wa umi yuki', id: 'Jadwal: kereta berikutnya tujuan Umi (pantai).' });
    if (m === 'kafe') return say({ jp: 'メニュー：コーヒー・ケーキ・ジュース・パフェ', ro: 'menyuu: koohii, keeki, juusu, pafe', id: 'Menu: kopi, kue, jus, parfait. Semua kata serapan → katakana!' });
    if (m === 'ramen') return say({ jp: 'みそラーメン・しおラーメン・ぎょうざ', ro: 'miso raamen, shio raamen, gyouza', id: 'Menu: ramen miso, ramen garam, pangsit goreng.' });
    if (m === 'koban') return say({ jp: 'ちず：がっこう・えき・こうえん・じんじゃ', ro: 'chizu: gakkou, eki, kouen, jinja', id: 'Peta kota: sekolah, stasiun, taman, kuil.' });
    return say({ n: 'Papan pengumuman.' });
  }
  async function fountain() {
    await say({ jp: 'ふんすい', ro: 'funsui', id: 'Air mancur. Kamu melempar koin dan membuat permohonan (ねがいごと).' });
    if (!once('fountain', 5, 'air mancur')) return say({ n: 'Kamu sudah membuat permohonan hari ini.' });
    const f = [
      { jp: 'テスト で ひゃくてん！', ro: 'tesuto de hyakuten!', id: 'Semoga dapat nilai 100 di ujian!' },
      { jp: 'ともだち が ふえます ように。', ro: 'tomodachi ga fuemasu you ni.', id: 'Semoga temanku bertambah.' },
      { jp: 'にほんご が じょうず に なります ように。', ro: 'nihongo ga jouzu ni narimasu you ni.', id: 'Semoga bahasa Jepangku makin lancar.' },
    ][S().day % 3];
    await say(f);
  }
  async function shell(t) {
    const key = `shell_${t.x}_${t.y}`;
    const d = S().placeDay || (S().placeDay = {});
    if (d[key] === S().day) return say({ n: 'Kerang ini sudah kamu periksa hari ini.' });
    const pool = S().kana.length ? S().kana : ['あ', 'い', 'う', 'え', 'お'];
    const k = pool[Math.random() * pool.length | 0];
    const others = pool.filter(x => x !== k && KANA[x] && KANA[x].ro !== KANA[k].ro);
    const pick = [...others].sort(() => Math.random() - .5).slice(0, 2);
    await say({ jp: 'かい', ro: 'kai', id: `Kerang! Ada huruf tertulis di dalamnya: 「${k}」` });
    await H().runLines([{ q: `Bacanya… 「${k}」`, o: [{ jp: KANA[k].ro, ro: '', ok: true }, ...pick.map(x => ({ jp: KANA[x].ro, ro: '', why: `「${k}」 dibaca "${KANA[k].ro}". (${KANA[x].ro} itu 「${x}」)` }))] }], []);
    d[key] = S().day; S().shells = (S().shells || 0) + 1; Save.write();
    H().addPoints(3, 'kerang');
    if (S().shells === 10) H().addStamp('shells', 'Kolektor kerang (10)');
  }

  const HANDLES = new Set(['goods', 'cooler', 'machine', 'train', 'notice', 'fountain', 'shell', 'parasol']);
  async function interact(t) {
    if (t.type === 'goods') return goods(t);
    if (t.type === 'cooler') { await say({ jp: 'のみもの', ro: 'nomimono', id: 'Lemari minuman dingin: おちゃ, ジュース, みず…' }); UI.hideDialog(); return Extras.shop('vending'); }
    if (t.type === 'machine') return machine();
    if (t.type === 'train') return train();
    if (t.type === 'notice') return notice();
    if (t.type === 'fountain') return fountain();
    if (t.type === 'shell') return shell(t);
    if (t.type === 'parasol') return say({ jp: 'パラソル', ro: 'parasoru', id: 'Payung pantai (parasol). Teduh sekali di sini.' });
  }

  return { npcs, song, talks, talk, interact, handles: t => HANDLES.has(t), gate, PLACE_NAMES: { konbini: 'Konbini', eki: 'Stasiun', kafe: 'Kafe', ramen: 'Kedai Ramen', honya: 'Toko Buku', koban: 'Pos Polisi', umi: 'Pantai' } };
})();
window.Places = Places;
