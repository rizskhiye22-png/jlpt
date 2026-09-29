/* =========================================================
   JALUR KERETA & DUNIA JEPANG YANG LEBIH LUAS
   Dari stasiun Sakura bisa naik kereta ke:
   - うみ  (pantai)            → kerang, ikan laut
   - やま  (desa gunung)       → penginapan onsen, soba, sawah, jizo, daun momiji
   - まち  (kota besar)        → penyeberangan, department store, sushi putar,
                                 karaoke, toko baju, purikura, patung Hachiko
   - てら  (kota kuil kuno)    → kuil Buddha, lonceng, upacara teh, jimat, rusa
   Setiap tempat mengajarkan kosakata & ungkapan sesuai situasinya,
   dengan mini-game yang aktif (sushi putar, lampu penyeberangan, lonceng, dll.).
   ========================================================= */

/* ---------- peta baru (dibuat & dicek jalurnya dengan generator) ---------- */
Object.assign(MAPS, {"yama": {"name": "Desa Gunung (やま)", "rows": ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", "TR......T.TR.RT.TR.RT.TR.RT.TR.RTT", "T................................T", "T................................T", "T.................R...........R..T", "T....=...........................T", "TT...=..T....=R.............f..R.T", "T....=...R...=.........=.........T", "T....=......f=..zz.....=....aa...T", "T....=....b..=......L..=..V.....TT", "T....==========================..T", "T....==========================..T", "TR......k.......f.........f......T", "T..qqqq=qqqqq..R...f.R...v....R..T", "T..qqqq=qqqqq..v.......T...R.T...T", "T..==========....T..v............T", "T..qqqq=qqqqq.............R..v...T", "T..qqqq=qqqqq...R.v...R.v......R.T", "TR...............................T", "TWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWT", "TWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWT", "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"],
  "outdoor": true, "buildings": [{"type": "station", "x": 2, "y": 1, "w": 6, "h": 4, "doors": [[5, 4]]}, {"type": "soba", "x": 11, "y": 2, "w": 5, "h": 4, "doors": [[13, 5]]}, {"type": "onsen", "x": 20, "y": 2, "w": 7, "h": 5, "doors": [[23, 6]]}],
  "signs": [{"x": 8, "y": 4, "text": "やま", "note": "Gunung (desa pegunungan)"}, {"x": 12, "y": 6, "text": "そば", "note": "Soba (mi gandum)"}, {"x": 24, "y": 7, "text": "おんせん", "note": "Pemandian air panas"}, {"x": 2, "y": 12, "text": "たんぼ", "note": "Sawah"}],
  "warps": [{"x": 5, "y": 4, "to": "eki", "tx": 7, "ty": 3, "dir": "down"}, {"x": 23, "y": 6, "to": "onsen", "tx": 7, "ty": 8, "dir": "up"}],
  "closedDoors": [{"x": 13, "y": 5, "kind": "scene", "id": "soba"}],
  "spots": {"arrive": [5, 5],
  "nouka": [10, 12],
  "kid": [18, 12]}}, "machi": {"name": "Kota Besar (まち)", "rows": ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", "TppppppppppppppppppppppppppppppppppT", "TppppppppppppppppppppppppppppppppppT", "TppppppppppppppppppppppppppppppppppT", "TppppppppppppppppppppppppppppppppppT", "TppppppppppppppppppppVpppppppppppppT", "TppppppppppppppppppppppppppVpppppppT", "TTppHppppppTppppppppLTppppppLpppppTT", "TppppppgppppppppgppppppppppppppppppT", "TAAAAAAAccAAAAAAAccAAAAAAAAAAAAAAAAT", "TAAAAAAAccAAAAAAAccAAAAAAAAAAAAAAAAT", "TAAAAAAAccAAAAAAAccAAAAAAAAAAAAAAAAT", "TpppppppppgppppppppgpppppppppppppppT", "TTpLppppppppTppppppppppTppppppppppTT", "TppppppppppppppppppppppppppppppppppT", "TpppppppppppbppppbpppppppppppppppppT", "TpppppppppppppOOpppppppppppppppppVpT", "TpppppppppppppOOpppppppppppppppppppT", "TpppppppppppbppppbpppppppppppppppppT", "TpppppppppppppppppppppLppppppppppppT", "TpppppppppppppppppppTppppppppppppppT", "TppTpppppppppppppppppppppppppppppTpT", "TppppppppppppppppppppppppppppppppppT", "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"],
  "outdoor": true, "buildings": [{"type": "station", "x": 2, "y": 1, "w": 8, "h": 5, "doors": [[6, 5]]}, {"type": "depato", "x": 12, "y": 1, "w": 8, "h": 5, "doors": [[16, 5]]}, {"type": "sushi", "x": 22, "y": 1, "w": 5, "h": 4, "doors": [[24, 4]]}, {"type": "karaoke", "x": 29, "y": 1, "w": 5, "h": 4, "doors": [[31, 4]]}, {"type": "fuku", "x": 4, "y": 14, "w": 6, "h": 4, "doors": [[6, 17]]}, {"type": "game", "x": 26, "y": 14, "w": 6, "h": 4, "doors": [[28, 17]]}],
  "signs": [{"x": 10, "y": 6, "text": "まち", "note": "Kota"}, {"x": 5, "y": 7, "text": "ハチこう", "note": "Patung Hachiko"}, {"x": 21, "y": 4, "text": "すし", "note": "Sushi"}, {"x": 11, "y": 13, "text": "こうさてん", "note": "Persimpangan"}],
  "warps": [{"x": 6, "y": 5, "to": "eki", "tx": 7, "ty": 3, "dir": "down"}, {"x": 24, "y": 4, "to": "sushi", "tx": 6, "ty": 7, "dir": "up"}],
  "closedDoors": [{"x": 16, "y": 5, "kind": "scene", "id": "depato"}, {"x": 31, "y": 4, "kind": "scene", "id": "karaoke"}, {"x": 6, "y": 17, "kind": "scene", "id": "fuku"}, {"x": 28, "y": 17, "kind": "scene", "id": "purikura"}],
  "spots": {"arrive": [6, 6],
  "emma": [13, 7],
  "ryo": [25, 12]}}, "tera": {"name": "Kota Kuil (てら)", "rows": ["TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT", "T................................T", "T..WWWWWW.PR..........RP.....R...T", "T..WWWWWW......................P.T", "T..WWWWWW...............E........T", "T..WWWWWW........................T", "TR.............l==l...f........R.T", "T...............==...............T", "T...............==....R.....P....T", "T..............l==l.b......f.....T", "T...............==............R..T", "T............b..==...............T", "TR.......f.....l==l..............T", "T...........R...==..P............T", "T...............==..............RT", "T..............l==l..............T", "T...............==...........f...T", "T...........P...==...R...........T", "T...............==.............R.T", "T....=======================.....T", "T................................T", "TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT"],
  "outdoor": true, "buildings": [{"type": "station", "x": 2, "y": 15, "w": 6, "h": 4, "doors": [[5, 18]]}, {"type": "shrine", "x": 13, "y": 1, "w": 8, "h": 4, "doors": []}, {"type": "chaya", "x": 24, "y": 12, "w": 5, "h": 4, "doors": [[26, 15]]}, {"type": "omamori", "x": 8, "y": 7, "w": 4, "h": 3, "doors": [[10, 9]]}],
  "signs": [{"x": 8, "y": 18, "text": "てら", "note": "Kuil Buddha (otera)"}, {"x": 15, "y": 17, "text": "さんどう", "note": "Jalan menuju kuil"}, {"x": 23, "y": 15, "text": "おちゃ", "note": "Rumah teh"}],
  "warps": [{"x": 5, "y": 18, "to": "eki", "tx": 7, "ty": 3, "dir": "down"}],
  "closedDoors": [{"x": 26, "y": 15, "kind": "scene", "id": "chaya"}, {"x": 10, "y": 9, "kind": "scene", "id": "omamori"}],
  "spots": {"arrive": [5, 19],
  "obousan": [17, 5],
  "shika1": [12, 10],
  "shika2": [21, 11],
  "shika3": [9, 15],
  "emma": [25, 8]}}, "onsen": {"name": "Penginapan Onsen", "rows": ["WWWWWWWWWWWWWWW", "WnNWWWWWWWnWWnW", "W.....W.......W", "Wkkk..W..oooo.W", "W.....W..oooo.W", "W.....W..oooo.W", "W.............W", "WCC.hh...II...W", "Wp...........pW", "WWWWWWWxWWWWWWW"],
  "warps": [{"x": 7, "y": 9, "to": "yama", "tx": 23, "ty": 7, "dir": "down"}],
  "spots": {"okami": [2, 2]}}, "sushi": {"name": "Sushi Putar", "rows": ["WWWWWWWWWWWWW", "WnWWNWWWWWnWW", "W...........W", "Wyyyyyyyyyy.W", "W...........W", "W.t.t...t.t.W", "W...........W", "Wp.........pW", "WWWWWWxWWWWWW"],
  "warps": [{"x": 6, "y": 8, "to": "machi", "tx": 24, "ty": 5, "dir": "down"}],
  "spots": {"itamae": [6, 2]}}});


/* ---------- tokoh baru ---------- */
Object.assign(CHARACTERS, {
  okami:   { name: 'Nyonya Penginapan', color: '#8a4a78' },
  itamae:  { name: 'Koki Sushi',        color: '#3f6fb0' },
  obousan: { name: 'Biksu',             color: '#9a6a2a' },
  nouka:   { name: 'Pak Petani',        color: '#5a7a3a' },
  staff:   { name: 'Pelayan',           color: '#3b8a78' },
});
Object.assign(Pix.PAL, {
  okami:   { h: '#2d2b3b', H: '#16151d', e: '#2a2238', E: '#6a4a6a', I: '#b08ab0', o: '#8a4a78', O: '#653558', a: '#f6d44a', A: '#c9a526', p: '#653558', b: '#3a2a2a', c: '#f4ecdc' },
  itamae:  { h: '#2f2c40', H: '#191824', e: '#2a2a3a', E: '#4f5690', I: '#8d95d8', o: '#f7f3ea', O: '#d3c7b3', a: '#3f6fb0', A: '#2a4f86', p: '#3a3f55', b: '#2a2a2a', c: '#f7f3ea' },
  obousan: { h: '#e9c9a0', H: '#c9a070', e: '#3a3030', E: '#6a6060', I: '#a09494', o: '#c98a2e', O: '#9a6a1e', a: '#3a2a2a', A: '#1a1a1a', p: '#9a6a1e', b: '#3a2a2a', c: '#f4ecdc' },
  nouka:   { h: '#5a4a3a', H: '#3a2e22', e: '#3a3030', E: '#6a6060', I: '#a09494', o: '#5a7a9a', O: '#3f5a78', a: '#f7f3ea', A: '#d9cfbc', p: '#4a3f35', b: '#2a2a2a', c: '#f7f3ea' },
  staff:   { h: '#6b4430', H: '#452a1c', e: '#2a2238', E: '#6b4430', I: '#b08060', o: '#f7f3ea', O: '#d3c7b3', a: '#5bb3a0', A: '#3b8a78', p: '#3a3f55', b: '#2a2a2a', c: '#f7f3ea' },
});
Object.assign(Pix.STYLE, {
  okami:   { hair: 'bun', uniform: 'kimono', flower: true },
  itamae:  { hair: 'short', uniform: 'apron', headband: true },
  obousan: { hair: 'bald', uniform: 'kimono', old: true },
  nouka:   { hair: 'short', uniform: 'tee', cap: true, old: true },
  staff:   { hair: 'bob', uniform: 'apron' },
});

/* ---------- rusa (しか) di kota kuil: sprite pixel sendiri ---------- */
(() => {
  const DOWN = [
    '................', '...a........a...', '....a......a....', '.....kkkkkk.....',
    '....kbbbbbbk....', '....kbebbebk....', '....kbbbbbbk....', '.....kbnnbk.....',
    '...kkkbbbbkkk...', '..kbbbwbbwbbbk..', '..kbbbbbbbbbbk..', '..kbbwbbbbwbbk..',
    '...kbbbbbbbbk...', '...kbk....kbk...', '...kbk....kbk...', '...kk......kk...',
  ];
  const SIDE = [
    '................', '..........a.a...', '...........a....', '..........kkk...',
    '.........kbbbk..', '.........kbebnk.', '.........kbbbk..', '..kkkkkkkkbbk...',
    '.kbbbbwbbbbbk...', '.kbwbbbbbwbbk...', '.kbbbbbbbbbbk...', '..kbbbbbbbbk....',
    '..kbk.kbk.kbk...', '..kbk.kbk.kbk...', '..kk..kk..kk....', '................',
  ];
  const PAL = { k: '#2a1f2d', b: '#b07a4c', w: '#f4e6c8', e: '#1a1216', n: '#4a2e22', a: '#6a4228' };
  const cache = new Map();
  function draw(grid, flip, frame) {
    const cv = document.createElement('canvas'); cv.width = 16; cv.height = 16;
    const c = cv.getContext('2d');
    grid.forEach((row, y) => [...row].forEach((ch, x) => {
      if (ch === '.') return;
      let yy = y;
      if (frame && y >= 12) yy = y + (x % 2 ? -1 : 0);
      c.fillStyle = PAL[ch]; c.fillRect(flip ? 15 - x : x, yy, 1, 1);
    }));
    return cv;
  }
  const orig = Pix.sprite;
  Pix.sprite = (id, dir = 'down', frame = 0) => {
    if (id !== 'shika') return orig(id, dir, frame);
    const key = dir + frame;
    if (!cache.has(key)) cache.set(key, draw(dir === 'left' || dir === 'right' ? SIDE : DOWN, dir === 'left', frame));
    return cache.get(key);
  };
})();

const Places2 = (() => {
  const S = () => Save.d;
  const H = () => Game.h;
  const say = l => UI.say(l);
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pick = a => a[Math.random() * a.length | 0];
  const romaji = () => Save.d.settings.romaji !== false;
  function once(key, pts, why) {
    const d = S().placeDay || (S().placeDay = {});
    if (d[key] === S().day) return false;
    d[key] = S().day; Save.write();
    if (pts) H().addPoints(pts, why);
    return true;
  }
  function spend(n) { S().points = Math.max(0, (S().points || 0) - n); Save.write(); UI.setPoints && UI.setPoints(S().points); }

  /* ---------- angka Jepang (untuk harga) ---------- */
  const D1 = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
  const HUN = { 1: 'ひゃく', 3: 'さんびゃく', 6: 'ろっぴゃく', 8: 'はっぴゃく' };
  const THO = { 1: 'せん', 3: 'さんぜん', 8: 'はっせん' };
  function num(n) {
    if (n === 0) return 'ゼロ';
    let s = '';
    const t = Math.floor(n / 1000) % 10, h = Math.floor(n / 100) % 10, te = Math.floor(n / 10) % 10, o = n % 10;
    if (t) s += THO[t] || D1[t] + 'せん';
    if (h) s += HUN[h] || D1[h] + 'ひゃく';
    if (te) s += (te === 1 ? '' : D1[te]) + 'じゅう';
    if (o) s += D1[o];
    return s;
  }
  const yen = n => num(n) + ' えん';
  async function priceQuiz(price, who) {
    const wrong = shuffle([price * 10, Math.max(10, price / 10), price + 100, price * 2].filter(x => x !== price && x < 100000)).slice(0, 2);
    await say({ w: who, jp: `${yen(price)} です。`, ro: '', id: 'Kasir menyebut harganya.' });
    await H().runLines([{ q: `「${yen(price)}」 = berapa yen?`, o: [
      { jp: `${price} yen`, ro: '', ok: true },
      ...wrong.map(w => ({ jp: `${w} yen`, ro: '', why: `${yen(price)} = ${price} yen. (${num(w)} = ${w})` })),
    ] }], [who]);
  }

  /* ---------- katalog makanan (Buku Makanan) ---------- */
  const FOODS = [
    { id: 'kohi', jp: 'コーヒー', ro: 'koohii', name: 'kopi', where: 'Kafe', col: '#6a4228', fact: 'Kata serapan dari "coffee", jadi ditulis katakana.' },
    { id: 'keki', jp: 'ケーキ', ro: 'keeki', name: 'kue', where: 'Kafe', col: '#f7b6c8', fact: 'Kue stroberi (ショートケーキ) adalah kue paling populer di Jepang.' },
    { id: 'jusu', jp: 'ジュース', ro: 'juusu', name: 'jus', where: 'Kafe', col: '#f29b38', fact: 'Di Jepang, semua minuman manis sering disebut ジュース.' },
    { id: 'pafe', jp: 'パフェ', ro: 'pafe', name: 'parfait', where: 'Kafe', col: '#f6e0a0', fact: 'Parfait dengan buah, es krim, dan cornflakes. Ada juga パフェ rasa matcha!' },
    { id: 'misoramen', jp: 'みそラーメン', ro: 'miso raamen', name: 'ramen miso', where: 'Kedai ramen', col: '#c9853a', fact: 'Ramen miso berasal dari Sapporo, Hokkaido.' },
    { id: 'bento', jp: 'おべんとう', ro: 'obentou', name: 'bekal', where: 'Konbini', col: '#e35f6b', fact: 'Bekal konbini bisa dipanaskan di kasir: あたためますか？' },
    { id: 'maguro', jp: 'まぐろ', ro: 'maguro', name: 'tuna', where: 'Sushi', col: '#c9384a', price: 200, fact: 'Tuna adalah ikan sushi paling terkenal.' },
    { id: 'samon', jp: 'サーモン', ro: 'saamon', name: 'salmon', where: 'Sushi', col: '#f28c5c', price: 150, fact: 'Salmon ditulis katakana karena kata serapan dari "salmon".' },
    { id: 'tamago', jp: 'たまご', ro: 'tamago', name: 'telur dadar manis', where: 'Sushi', col: '#f6d44a', price: 100, fact: 'たまご = telur. Sushi telur rasanya manis!' },
    { id: 'ebi', jp: 'えび', ro: 'ebi', name: 'udang', where: 'Sushi', col: '#f7a08a', price: 150, fact: 'えび = udang.' },
    { id: 'ika', jp: 'いか', ro: 'ika', name: 'cumi', where: 'Sushi', col: '#f4f1ea', price: 120, fact: 'いか = cumi-cumi.' },
    { id: 'ikura', jp: 'いくら', ro: 'ikura', name: 'telur ikan salmon', where: 'Sushi', col: '#e0582e', price: 300, fact: 'Hati-hati: いくら juga berarti "berapa?" (いくら ですか).' },
    { id: 'zarusoba', jp: 'ざるそば', ro: 'zarusoba', name: 'soba dingin', where: 'Toko soba (やま)', col: '#8a7a5a', price: 700, fact: 'Mi soba dingin dicelup ke kuah つゆ (tsuyu).' },
    { id: 'kitsune', jp: 'きつねうどん', ro: 'kitsune udon', name: 'udon rubah', where: 'Toko soba (やま)', col: '#e9c46a', price: 600, fact: 'きつね = rubah. Konon rubah suka tahu goreng manis di atasnya!' },
    { id: 'tenpura', jp: 'てんぷら', ro: 'tenpura', name: 'tempura', where: 'Toko soba (やま)', col: '#f2c14e', price: 800, fact: 'Udang & sayur digoreng tepung renyah.' },
    { id: 'matcha', jp: 'まっちゃ', ro: 'matcha', name: 'teh hijau bubuk', where: 'Rumah teh (てら)', col: '#6fa050', price: 500, fact: 'Diminum dalam upacara teh (さどう).' },
    { id: 'mitarashi', jp: 'みたらしだんご', ro: 'mitarashi dango', name: 'dango saus manis', where: 'Rumah teh (てら)', col: '#b0703a', price: 300, fact: 'Dango dengan saus kecap manis kental.' },
    { id: 'youkan', jp: 'ようかん', ro: 'youkan', name: 'dodol kacang merah', where: 'Rumah teh (てら)', col: '#6a2e3a', price: 400, fact: 'Manisan kacang merah yang cocok dengan teh pahit.' },
    { id: 'kohigyunyu', jp: 'コーヒーぎゅうにゅう', ro: 'koohii gyuunyuu', name: 'susu kopi', where: 'Onsen (やま)', col: '#c9a070', fact: 'Diminum setelah berendam, sambil bertolak pinggang!' },
    { id: 'onsentamago', jp: 'おんせんたまご', ro: 'onsen tamago', name: 'telur onsen', where: 'Onsen (やま)', col: '#fbf7ef', fact: 'Telur yang direbus pelan di air panas onsen, setengah matang.' },
  ];
  const FOOD = Object.fromEntries(FOODS.map(f => [f.id, f]));
  function eat(id) {
    const f = FOOD[id]; if (!f) return;
    const e = S().foods || (S().foods = {});
    const first = !e[id];
    e[id] = (e[id] || 0) + 1; Save.write();
    if (first) {
      UI.toast(`🍱 Buku Makanan: ${f.jp} tercatat!`);
      const n = Object.keys(e).length;
      if (n === 5) H().addStamp('food5', 'Pencicip (5 makanan)');
      if (n === 12) H().addStamp('food12', 'Pecinta kuliner Jepang (12)');
      if (n === FOODS.length) H().addStamp('foodall', 'Master kuliner Jepang');
    }
  }
  function foodIcon(col) { return `<i class="fb-dish" style="--c:${col}"></i>`; }
  function foodBook() {
    const e = S().foods || {};
    const got = FOODS.filter(f => e[f.id]).length;
    const p = UI.panel(`
      <div class="win foodbook">
        <div class="w-title">Buku Makanan <span class="muted small">たべもの · ${got}/${FOODS.length}</span></div>
        <p class="muted small">Makan di kafe, ramen, sushi, soba, rumah teh, dan onsen untuk mengisi buku ini. Ketuk untuk mendengar.</p>
        <div class="fb-grid">${FOODS.map(f => e[f.id]
          ? `<button class="fb-item on" data-id="${f.id}" type="button">${foodIcon(f.col)}<b class="jp">${f.jp}</b><small>${f.ro} · ${f.name}</small><em>${f.where}</em></button>`
          : `<div class="fb-item">${foodIcon('#d9cbb6')}<b class="jp">？？？</b><small>${f.where}</small></div>`).join('')}</div>
        <button class="btn block" data-a="close" type="button">Tutup</button>
      </div>`, 'scroll');
    return UI.wait(done => {
      p.querySelectorAll('.fb-item.on').forEach(b => b.onclick = () => { const f = FOOD[b.dataset.id]; Sound.speak(f.jp); UI.toast(f.fact); });
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); UI.closePanel(); done(); };
    });
  }

  /* ---------- mesin pemesanan restoran (dipakai soba, sushi, rumah teh) ---------- */
  async function order(o) {
    await say({ w: o.who, e: 'happy', ...o.greet });
    const items = o.menu.map(id => FOOD[id]);
    const i = await UI.choose('メニュー — pilih (baca namanya!):', items.map(f => ({ jp: `${f.jp}　${f.price}えん`, ro: romaji() ? f.ro : '' })));
    const f = items[i];
    const pattern = pick([
      { ok: `${f.jp} を ください。`, ro: `${f.ro} wo kudasai.` },
      { ok: `${f.jp} を ひとつ ください。`, ro: `${f.ro} wo hitotsu kudasai.` },
      { ok: `${f.jp} に します。`, ro: `${f.ro} ni shimasu.` },
    ]);
    await H().runLines([{ q: `Pesan "${f.name}" dengan kalimat yang tepat:`, o: [
      { jp: pattern.ok, ro: pattern.ro, ok: true },
      { jp: `${f.jp} は どこ ですか？`, ro: '', why: '〜は どこ ですか = di mana? Untuk memesan: 〜を ください / 〜に します.' },
      { jp: `${f.jp} が きらい です。`, ro: '', why: 'きらい = tidak suka. Untuk memesan: 〜を ください.' },
    ] }], [o.who]);
    await say({ w: o.who, e: 'happy', jp: 'かしこまりました。', ro: 'kashikomarimashita.', id: 'Baik, pesanan diterima.' });
    if (o.extra) await o.extra(f);
    await say({ w: o.who, e: 'happy', jp: 'おまたせ しました。どうぞ。', ro: 'omatase shimashita. douzo.', id: 'Maaf menunggu. Silakan.' });
    await say({ jp: 'いただきます！', ro: 'itadakimasu!', id: 'Selamat makan!' });
    await say({ n: `${f.jp} (${f.name}) — ${f.fact}` });
    eat(f.id);
    await say({ jp: 'ごちそうさまでした！', ro: 'gochisousama deshita!', id: 'Terima kasih atas hidangannya!' });
    await priceQuiz(f.price, o.who);
    spend(Math.ceil(f.price / 100) * 2);
    await say({ w: o.who, e: 'happy', jp: 'ありがとうございました！', ro: 'arigatou gozaimashita!', id: `Terima kasih! (kamu membayar 🌸${Math.ceil(f.price / 100) * 2})` });
    if (once('eat_' + o.key, 10, 'makan di ' + o.place)) H().addStamp('eat_' + o.key, 'Makan di ' + o.place);
  }

  /* ---------- panel mini-game ---------- */
  function gamePanel(title, body) {
    return UI.panel(`<div class="win mg"><div class="w-title">${title}</div>${body}</div>`, 'gamep');
  }
  async function result(title, score, total, msg) {
    Sound.star();
    await say({ n: `${title}: ${score}/${total}. ${msg || ''}` });
    const pts = Math.max(2, score * 3);
    H().addPoints(pts, title);
    return score;
  }

  // 🍣 Sushi putar: ambil piring sesuai pesanan sebelum lewat
  async function sushiGame() {
    const menu = ['maguro', 'samon', 'tamago', 'ebi', 'ika', 'ikura'].map(id => FOOD[id]);
    const goal = 6, relax = !!Save.d.settings.relax;
    const p = gamePanel('Sushi Putar · かいてんずし', `
      <div class="sg-order">…</div>
      <div class="sg-lane"><div class="sg-belt"></div></div>
      <p class="muted small sg-info">Ketuk piring yang sesuai pesanan sebelum lewat!</p>`);
    const lane = p.querySelector('.sg-lane'), orderEl = p.querySelector('.sg-order'), info = p.querySelector('.sg-info');
    const res = await UI.wait(done => {
      let target = null, got = 0, miss = 0, plates = [], lastSpawn = 0, lastT = 0, raf = 0, sinceTarget = 0;
      const next = () => {
        if (got >= goal) { cancelAnimationFrame(raf); done({ got, miss }); return; }
        target = pick(menu); sinceTarget = 0;
        orderEl.innerHTML = `Pelanggan: 「<b class="jp">${target.jp} を ください</b>」 ${romaji() ? `<small>(${target.ro})</small>` : ''}`;
        Sound.speak(target.jp + ' を ください');
      };
      const spawn = () => {
        const f = sinceTarget > 1 && Math.random() < .55 ? target : pick(menu);
        sinceTarget = f === target ? 0 : sinceTarget + 1;
        const el = document.createElement('button');
        el.type = 'button'; el.className = 'sg-plate';
        el.innerHTML = `<i style="--c:${f.col}"></i><b class="jp">${f.jp}</b>`;
        lane.appendChild(el);
        const pl = { el, x: 104, f }; plates.push(pl);
        el.onclick = () => {
          if (f === target) { got++; Sound.ok(); el.classList.add('good'); setTimeout(() => el.remove(), 200); plates = plates.filter(q => q !== pl); info.textContent = `Benar! ${got}/${goal}`; next(); }
          else { miss++; Sound.bad(); el.classList.add('bad'); info.textContent = `Itu ${f.jp} (${f.name}). Cari ${target.jp}!`; }
        };
      };
      const loop = t => {
        if (!p.isConnected) return;
        const dt = lastT ? Math.min(60, t - lastT) : 16; lastT = t;
        const speed = (relax ? 8 : 12) * dt / 1000;
        plates.forEach(q => { q.x -= speed; q.el.style.left = q.x + '%'; });
        plates = plates.filter(q => { if (q.x < -22) { q.el.remove(); return false; } return true; });
        if (t - lastSpawn > (relax ? 1700 : 1250)) { lastSpawn = t; spawn(); }
        raf = requestAnimationFrame(loop);
      };
      next(); raf = requestAnimationFrame(loop);
    });
    UI.closePanel();
    res.got && ['maguro', 'samon', 'tamago'].forEach(id => Math.random() < .5 && eat(id));
    return result('Sushi Putar', res.got, goal, res.miss ? `Salah ambil ${res.miss} kali.` : 'Tanpa salah!');
  }

  // 🚦 Lampu penyeberangan: baca warnanya, menyeberang hanya saat あお
  async function crossGame() {
    await say({ n: 'Di Jepang, lampu hijau untuk pejalan kaki disebut あお (ao), bukan みどり! Menyeberanglah hanya saat lampunya あお.' });
    const goal = 5;
    const p = gamePanel('Menyeberang · しんごう', `
      <div class="cg-light"><span class="cg-word jp">…</span></div>
      <button class="btn block cg-go" type="button">わたる！ (menyeberang)</button>
      <p class="muted small cg-info">Baca tulisan di lampu. Tekan hanya jika あお.</p>`);
    const word = p.querySelector('.cg-word'), light = p.querySelector('.cg-light'), info = p.querySelector('.cg-info');
    const res = await UI.wait(done => {
      let ok = 0, bad = 0, state = 'aka', timer = 0, n = 0, pressed = false;
      const STATES = [['aka', 'あか', '#e35f6b'], ['ao', 'あお', '#3fa06a'], ['kiiro', 'きいろ', '#f2c14e']];
      const change = () => {
        if (!p.isConnected) return;
        n++;
        const s = n % 2 ? STATES[1] : pick([STATES[0], STATES[2], STATES[1], STATES[0]]);
        state = s[0]; pressed = false;
        word.textContent = s[1];
        light.style.setProperty('--c', n <= 3 ? s[2] : '#9aa0aa');
        timer = setTimeout(change, 1100 + Math.random() * 900 + (Save.d.settings.relax ? 700 : 0));
      };
      p.querySelector('.cg-go').onclick = () => {
        if (pressed) return; pressed = true;
        if (state === 'ao') { ok++; Sound.ok(); info.textContent = `あお！ Aman menyeberang. ${ok}/${goal}`; }
        else { bad++; Sound.bad(); info.textContent = `あぶない！ (Bahaya!) Itu ${word.textContent}, bukan あお.`; }
        if (ok >= goal) { clearTimeout(timer); setTimeout(() => done({ ok, bad }), 400); }
      };
      change();
    });
    UI.closePanel();
    return result('Menyeberang', res.ok, goal, res.bad ? `Hampir celaka ${res.bad} kali!` : 'Sangat hati-hati!');
  }

  // 🔔 Lonceng kuil: pukul tepat di tengah
  async function bellGame() {
    await say({ n: 'かね (kane) = lonceng kuil. Pada malam tahun baru, lonceng dipukul 108 kali: じょやのかね.' });
    const tries = 3;
    const p = gamePanel('Pukul Lonceng · かね', `
      <div class="bg-bar"><i class="bg-zone"></i><b class="bg-cur"></b></div>
      <button class="btn block bg-hit" type="button">つく！ (pukul)</button>
      <p class="muted small bg-info">Tekan saat penanda berada di tengah (zona kuning).</p>`);
    const cur = p.querySelector('.bg-cur'), info = p.querySelector('.bg-info');
    const res = await UI.wait(done => {
      let t0 = performance.now(), raf = 0, hit = 0, n = 0, pos = 0;
      const loop = t => { if (!p.isConnected) return; pos = 50 + Math.sin((t - t0) / (Save.d.settings.relax ? 520 : 360)) * 48; cur.style.left = pos + '%'; raf = requestAnimationFrame(loop); };
      p.querySelector('.bg-hit').onclick = () => {
        n++;
        if (Math.abs(pos - 50) < 9) { hit++; Sound.star(); info.textContent = 'ゴーン…！ Bunyinya indah.'; }
        else { Sound.bump(); info.textContent = 'ポン… Kurang pas. Coba lagi!'; }
        if (n >= tries) { cancelAnimationFrame(raf); setTimeout(() => done(hit), 500); }
      };
      raf = requestAnimationFrame(loop);
    });
    UI.closePanel();
    return result('Lonceng kuil', res, tries, res === tries ? 'Sempurna!' : '');
  }

  // 🍵 Upacara teh: susun langkah dengan urutan yang benar
  async function teaGame() {
    const steps = [
      { jp: 'おじぎ を する', ro: 'ojigi wo suru', id: 'membungkuk memberi salam' },
      { jp: 'おかし を たべる', ro: 'okashi wo taberu', id: 'makan manisan dulu' },
      { jp: 'ちゃわん を まわす', ro: 'chawan wo mawasu', id: 'memutar mangkuk teh' },
      { jp: 'おちゃ を のむ', ro: 'ocha wo nomu', id: 'minum tehnya' },
      { jp: 'ちゃわん を かえす', ro: 'chawan wo kaesu', id: 'mengembalikan mangkuk' },
    ];
    const p = gamePanel('Upacara Teh · さどう', `
      <p class="muted small">Ketuk langkah-langkah upacara teh sesuai urutan yang benar.</p>
      <ol class="tg-done"></ol>
      <div class="tg-opts">${shuffle(steps.map((s, i) => ({ ...s, i }))).map(s => `<button class="choice tg-o" type="button" data-i="${s.i}"><span class="jp">${s.jp}</span><small>${romaji() ? s.ro + ' · ' : ''}${s.id}</small></button>`).join('')}</div>`);
    const res = await UI.wait(done => {
      let next = 0, miss = 0;
      const list = p.querySelector('.tg-done');
      p.querySelectorAll('.tg-o').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if (i === next) { Sound.ok(); b.remove(); list.insertAdjacentHTML('beforeend', `<li><span class="jp">${steps[i].jp}</span> — ${steps[i].id}</li>`); Sound.speak(steps[i].jp); next++; if (next === steps.length) setTimeout(() => done(miss), 500); }
        else { miss++; Sound.bad(); b.classList.add('bad'); setTimeout(() => b.classList.remove('bad'), 400); UI.toast(`Belum. Langkah ke-${next + 1}: ${steps[next].id}`); }
      });
    });
    UI.closePanel();
    return result('Upacara teh', Math.max(0, steps.length - res), steps.length, res ? `Salah urutan ${res} kali.` : 'Sangat anggun!');
  }

  // 🎤 Karaoke: lengkapi huruf yang hilang di lirik lagu tradisional
  async function karaoke() {
    const songs = [
      { t: 'さくら さくら', lines: ['さくら さくら', 'やよい の そら は', 'みわたす かぎり'] },
      { t: 'うさぎ', lines: ['うさぎ うさぎ', 'なに みて はねる', 'じゅうごや おつきさま', 'みて はねる'] },
      { t: 'かごめ かごめ', lines: ['かごめ かごめ', 'かご の なか の とり は', 'いつ いつ でやる'] },
    ];
    const song = songs[S().day % songs.length];
    const known = new Set(S().kana);
    Music.play('festival');
    await say({ w: 'staff', e: 'happy', jp: 'カラオケ へ ようこそ！なに を うたいます か？', ro: 'karaoke e youkoso! nani wo utaimasu ka?', id: 'Selamat datang di karaoke! Mau menyanyi lagu apa?' });
    await say({ n: `🎵 Lagu tradisional: 「${song.t}」. Lengkapi huruf yang hilang di liriknya!` });
    for (const line of song.lines) {
      const chars = [...line].map((c, i) => [c, i]).filter(([c]) => c !== ' ' && KANA[c]);
      const pool = chars.filter(([c]) => known.has(c));
      const [c, idx] = pick(pool.length ? pool : chars);
      const blank = [...line].map((x, i) => i === idx ? '＿' : x).join('');
      const others = shuffle(Object.keys(KANA).filter(k => k !== c && !/[ァ-ヿ]/.test(k) && KANA[k].ro !== KANA[c].ro)).slice(0, 2);
      Sound.speak(line);
      await H().runLines([{ q: `🎤 「${blank}」`, o: [{ jp: c, ro: romaji() ? KANA[c].ro : '', ok: true }, ...others.map(k => ({ jp: k, ro: romaji() ? KANA[k].ro : '', why: `Liriknya: 「${line}」. Huruf yang hilang: ${c} (${KANA[c].ro}).` }))] }], ['staff']);
    }
    await say({ n: '🎵 Semua bertepuk tangan! じょうず！ (Pintar!)' });
    if (once('karaoke', 12, 'karaoke')) H().addStamp('karaoke', 'Bernyanyi di karaoke');
  }

  /* ---------- adegan pintu (toko tanpa peta dalam) ---------- */
  async function depato() {
    await say({ w: 'staff', e: 'happy', jp: 'いらっしゃいませ。デパート へ ようこそ。', ro: 'irasshaimase. depaato e youkoso.', id: 'Selamat datang di department store.' });
    const FLOORS = [
      { f: 'ちか', ro: 'chika', id: 'lantai bawah tanah', item: 'たべもの', iro: 'tabemono', iid: 'makanan' },
      { f: 'いっかい', ro: 'ikkai', id: 'lantai 1', item: 'かばん', iro: 'kaban', iid: 'tas' },
      { f: 'にかい', ro: 'nikai', id: 'lantai 2', item: 'ふく', iro: 'fuku', iid: 'pakaian' },
      { f: 'さんがい', ro: 'sangai', id: 'lantai 3', item: 'おもちゃ', iro: 'omocha', iid: 'mainan' },
      { f: 'よんかい', ro: 'yonkai', id: 'lantai 4', item: 'ほん', iro: 'hon', iid: 'buku' },
    ];
    await say({ n: 'Papan petunjuk lantai (フロアガイド): ' + FLOORS.map(x => `${x.f}: ${x.item}`).join(' ・ ') });
    await say({ n: 'Ingat: lantai 3 dibaca さんがい (sangai), bukan さんかい!' });
    const t = pick(FLOORS.slice(1));
    const floorOpts = [t, ...shuffle(FLOORS.filter(x => x !== t)).slice(0, 3)];  // jawaban benar selalu ada
    await H().runLines([{ q: `Kamu mau beli ${t.item} (${t.iid}). Ke lantai berapa?`, o: floorOpts.map(x => x === t ? { jp: x.f, ro: romaji() ? x.ro : '', ok: true } : { jp: x.f, ro: romaji() ? x.ro : '', why: `${t.item} ada di ${t.f} (${t.id}).` }) }], ['staff']);
    await say({ w: 'staff', jp: 'エレベーター は こちら です。うえ に まいります。', ro: 'erebeetaa wa kochira desu. ue ni mairimasu.', id: 'Lift di sebelah sini. Naik ke atas.' });
    await say({ n: `Kamu sampai di ${t.f} dan melihat-lihat ${t.item}. Sebelum pulang, kamu mampir ke ちか: surga makanan (デパちか)!` });
    if (once('depato', 10, 'department store')) H().addStamp('depato', 'Jalan-jalan di デパート');
  }
  async function fuku() {
    await say({ w: 'staff', e: 'happy', jp: 'いらっしゃいませ。なにいろ が いい ですか？', ro: 'irasshaimase. nani iro ga ii desu ka?', id: 'Selamat datang. Mau warna apa?' });
    const COLORS = [['あか', 'aka', 'merah'], ['あお', 'ao', 'biru'], ['しろ', 'shiro', 'putih'], ['くろ', 'kuro', 'hitam'], ['きいろ', 'kiiro', 'kuning']];
    const c = pick(COLORS);
    await H().runLines([{ q: `Kamu ingin kaos warna ${c[2]}. Jawab:`, o: [c, ...shuffle(COLORS.filter(x => x !== c)).slice(0, 2)].map(x => x === c ? { jp: `${x[0]} が いい です。`, ro: romaji() ? `${x[1]} ga ii desu.` : '', ok: true } : { jp: `${x[0]} が いい です。`, ro: '', why: `${x[0]} (${x[1]}) = ${x[2]}. ${c[2]} = ${c[0]}.` }) }], ['staff']);
    await say({ w: 'staff', jp: 'サイズ は？ エス、エム、エル が あります。', ro: 'saizu wa? esu, emu, eru ga arimasu.', id: 'Ukurannya? Ada S, M, L.' });
    await H().runLines([{ q: 'Kamu pakai ukuran M. Pilih:', o: [
      { jp: 'エム', ro: 'emu', ok: true }, { jp: 'エス', ro: 'esu', why: 'エス = S. M = エム.' }, { jp: 'エル', ro: 'eru', why: 'エル = L. M = エム.' },
    ] }], ['staff']);
    await H().runLines([{ q: 'Bagaimana bertanya "Boleh saya coba?"', o: [
      { jp: 'しちゃく して も いい ですか？', ro: 'shichaku shite mo ii desu ka?', ok: true },
      { jp: 'これ は なん ですか？', ro: '', why: 'これ は なん ですか = ini apa? "Boleh dicoba?" = しちゃく して も いい ですか.' },
    ] }], ['staff']);
    await say({ w: 'staff', e: 'happy', jp: 'よく おにあい です！', ro: 'yoku oniai desu!', id: 'Cocok sekali untukmu!' });
    if (once('fuku', 10, 'toko baju')) H().addStamp('fuku', 'Belanja baju');
  }
  async function purikura() {
    await say({ n: 'プリクラ (purikura): mesin foto stiker! Pilih tulisan untuk hiasan fotomu.' });
    const W = [['かわいい', 'kawaii', 'imut'], ['ともだち', 'tomodachi', 'teman'], ['ピース', 'piisu', 'peace ✌'], ['たのしい', 'tanoshii', 'seru']];
    const i = await UI.choose('Tulisan hiasan (baca dulu!):', W.map(w => ({ jp: w[0], ro: romaji() ? w[1] : '' })));
    const w = W[i];
    const cv = document.createElement('canvas'); cv.width = 160; cv.height = 120;
    const c = cv.getContext('2d');
    const g = c.createLinearGradient(0, 0, 160, 120); g.addColorStop(0, '#fbd5e6'); g.addColorStop(1, '#cfe8ff'); c.fillStyle = g; c.fillRect(0, 0, 160, 120);
    c.imageSmoothingEnabled = false;
    const buddy = pick(['yuki', 'kenta', 'hana', 'emma']);
    c.drawImage(Pix.portrait('player', 'happy'), 18, 30, 64, 64); c.drawImage(Pix.portrait(buddy, 'happy'), 80, 30, 64, 64);
    c.fillStyle = '#e0475f'; c.font = '700 20px "Zen Maru Gothic",sans-serif'; c.textAlign = 'center'; c.fillText(w[0], 80, 24);
    for (let k = 0; k < 14; k++) { c.fillStyle = ['#fff', '#f6d44a', '#f28fb0'][k % 3]; c.fillRect(Math.random() * 160, Math.random() * 120, 3, 3); }
    const p = UI.panel(`<div class="win"><div class="w-title">プリクラ 📸</div><div class="pk-photo"></div><p class="muted small">「${w[0]}」 = ${w[2]}. Foto bersama ${CHARACTERS[buddy].name}!</p><button class="btn block" data-a="close" type="button">Simpan</button></div>`, 'scroll');
    p.querySelector('.pk-photo').appendChild(cv);
    Sound.star();
    await UI.wait(done => { p.querySelector('[data-a=close]').onclick = () => { UI.closePanel(); done(); }; });
    S().photos = (S().photos || 0) + 1; Save.write();
    if (once('purikura', 8, 'purikura')) H().addStamp('purikura', 'Foto プリクラ');
  }
  async function soba() {
    await order({ key: 'soba', place: 'toko soba', who: 'staff', menu: ['zarusoba', 'kitsune', 'tenpura'],
      greet: { jp: 'いらっしゃいませ。なんめいさま ですか？', ro: 'irasshaimase. nanmei-sama desu ka?', id: 'Selamat datang. Untuk berapa orang?' },
      extra: async () => { await say({ n: 'Tips: menyeruput mi dengan bunyi ずるずる itu sopan di Jepang.' }); } });
  }
  async function chaya() {
    await say({ w: 'staff', e: 'happy', jp: 'ようこそ。おちゃ を どうぞ。', ro: 'youkoso. ocha wo douzo.', id: 'Selamat datang. Silakan minum teh.' });
    const a = await H().menuChoice('Rumah teh (おちゃや):', ['Ikut upacara teh (さどう) 🍵', 'Pesan manisan & teh', 'Tidak jadi']);
    UI.hideDialog();
    if (a === 0) { await teaGame(); eat('matcha'); H().addStamp('sadou', 'Upacara teh'); }
    if (a === 1) await order({ key: 'chaya', place: 'rumah teh', who: 'staff', menu: ['matcha', 'mitarashi', 'youkan'], greet: { jp: 'なに に なさいます か？', ro: 'nani ni nasaimasu ka?', id: 'Mau pesan apa? (sopan)' } });
  }
  async function omamori() {
    await say({ w: 'obousan', e: 'happy', jp: 'おまもり は いかが ですか？', ro: 'omamori wa ikaga desu ka?', id: 'Mau jimat keberuntungan?' });
    const OM = [['がくぎょう', 'gakugyou', 'belajar / ujian'], ['けんこう', 'kenkou', 'kesehatan'], ['こうつうあんぜん', 'koutsuu anzen', 'keselamatan di jalan'], ['えんむすび', 'enmusubi', 'jodoh / pertemanan']];
    const want = pick(OM);
    await H().runLines([{ q: `Kamu ingin jimat untuk ${want[2]}. Pilih:`, o: OM.map(o => o === want ? { jp: o[0], ro: romaji() ? o[1] : '', ok: true } : { jp: o[0], ro: '', why: `${o[0]} = ${o[2]}. Untuk ${want[2]}: ${want[0]}.` }) }], ['obousan']);
    spend(10);
    const got = S().omamori || (S().omamori = []); if (!got.includes(want[0])) got.push(want[0]); Save.write();
    await say({ w: 'obousan', e: 'happy', jp: 'よい こと が あります ように。', ro: 'yoi koto ga arimasu you ni.', id: 'Semoga hal baik datang. (kamu membayar 🌸10)' });
    if (once('omamori', 6, 'jimat')) H().addStamp('omamori', 'Membeli おまもり');
  }
  const SCENES = { soba, depato, karaoke, fuku, purikura, chaya, omamori };
  async function scene(id) { if (SCENES[id]) await SCENES[id](); }

  /* ---------- kereta: banyak tujuan ---------- */
  const DESTS = [
    { id: 'umi', jp: 'うみ', ro: 'umi', name: 'pantai', price: 150, map: 'umi', at: [5, 5], dir: 'down', desc: 'Pantai: kerang berhuruf, memancing ikan laut, es serut.' },
    { id: 'yama', jp: 'やま', ro: 'yama', name: 'desa gunung', price: 300, map: 'yama', at: [5, 5], dir: 'down', desc: 'Desa gunung: penginapan onsen, toko soba, sawah, daun momiji.' },
    { id: 'tera', jp: 'てら', ro: 'tera', name: 'kota kuil', price: 400, map: 'tera', at: [5, 19], dir: 'right', desc: 'Kota kuil kuno: kuil Buddha, lonceng, upacara teh, rusa.' },
    { id: 'machi', jp: 'まち', ro: 'machi', name: 'kota besar', price: 500, map: 'machi', at: [6, 6], dir: 'down', desc: 'Kota besar: sushi putar, department store, karaoke, purikura.' },
  ];
  const DEST = Object.fromEntries(DESTS.map(d => [d.id, d]));
  async function ticketMachine() {
    await say({ n: 'Mesin tiket (きっぷうりば). Nama tujuan ditulis hiragana. Baca dengan teliti!' });
    if (S().ticket && DEST[S().ticket]) {
      const d = DEST[S().ticket];
      const a = await H().menuChoice(`Kamu sudah punya tiket ke ${d.jp}. Ganti tujuan?`, ['Tetap', 'Ganti tujuan']);
      UI.hideDialog(); if (a === 0) return;
    }
    const i = await UI.choose('Mau ke mana? (pilih nama stasiun)', DESTS.map(d => ({ jp: `${d.jp}　${d.price}えん`, ro: romaji() ? d.ro : '' })));
    const d = DESTS[i];
    await say({ n: `${d.jp} (${d.ro}) = ${d.name}. ${d.desc}` });
    await H().runLines([{ q: `Harga tiket: 「${yen(d.price)}」. Berapa yen?`, o: [
      { jp: `${d.price} yen`, ro: '', ok: true },
      { jp: `${d.price * 10} yen`, ro: '', why: `${yen(d.price)} = ${d.price} yen.` },
      { jp: `${d.price / 10 | 0} yen`, ro: '', why: `${yen(d.price)} = ${d.price} yen.` },
    ] }], []);
    const cost = Math.round(d.price / 50);
    spend(cost); S().ticket = d.id; Save.write();
    UI.toast(`🎫 きっぷ ke ${d.jp} (🌸-${cost})`);
    H().addStamp('kippu', 'Tiket kereta pertama');
  }
  async function board() {
    await say({ n: '🔔 Pengumuman:' });
    await say({ jp: 'まもなく、でんしゃ が まいります。きいろい せん の うちがわ で おまち ください。', ro: 'mamonaku, densha ga mairimasu. kiiroi sen no uchigawa de omachi kudasai.', id: 'Kereta akan tiba. Harap tunggu di belakang garis kuning.' });
    const d = DEST[S().ticket];
    if (!d) return say({ n: 'Kamu belum punya tiket. Beli きっぷ di mesin tiket (lobi, kiri bawah).' });
    const a = await H().menuChoice(`Naik kereta ke ${d.jp} (${d.name})?`, ['Naik 🚃', 'Nanti saja']);
    UI.hideDialog();
    if (a !== 0) return;
    S().ticket = null; Save.write();
    await UI.timecard('🚃 でんしゃ', `Menuju ${d.jp} (${d.name})…`);
    await say({ jp: `つぎ は、${d.jp}。${d.jp} です。`, ro: `tsugi wa, ${d.ro}. ${d.ro} desu.`, id: `Pemberhentian berikutnya: ${d.name}.` });
    UI.hideDialog();
    await H().goTo(d.map, d.at[0], d.at[1], d.dir);
    const first = !(S().visited || []).includes(d.id);
    if (first) { (S().visited = S().visited || []).push(d.id); Save.write(); H().addPoints(15, 'tempat baru'); H().addStamp('trip_' + d.id, `Perjalanan ke ${d.jp}`); await say({ n: `${d.jp} だ！ ${d.desc}` }); }
    if ((S().visited || []).length === DESTS.length) H().addStamp('trip_all', 'Penjelajah Jepang');
  }
  async function timetable() {
    await say({ jp: 'ろせんず', ro: 'rosenzu', id: 'Peta jalur kereta dari Stasiun Sakura:' });
    await say({ n: DESTS.map(d => `${d.jp} (${d.name}) ${d.price}えん`).join(' ・ ') });
  }

  /* ---------- tokoh di peta baru ---------- */
  function npcs(mapId) {
    const SP = (MAPS[mapId] && MAPS[mapId].spots) || {}, out = [];
    const at = (id, dir = 'down', key) => SP[key || id] && out.push({ id, key, x: SP[key || id][0], y: SP[key || id][1], dir, idle: true });
    if (mapId === 'yama') { at('nouka'); at('kid', 'left'); }
    if (mapId === 'machi') { at('emma'); at('ryo', 'left'); }
    if (mapId === 'tera') { at('obousan'); at('emma', 'left'); at('shika', 'right', 'shika1'); at('shika', 'left', 'shika2'); at('shika', 'down', 'shika3'); }
    if (mapId === 'onsen') at('okami');
    if (mapId === 'sushi') at('itamae');
    return out;
  }
  const SONG = { yama: 'home', machi: 'school', tera: 'evening', onsen: 'night', sushi: 'home' };
  const NEW_MAPS = new Set(['yama', 'machi', 'tera', 'onsen', 'sushi']);
  const talks = npc => NEW_MAPS.has(World.map) && ['okami', 'itamae', 'obousan', 'nouka', 'shika', 'emma', 'kid', 'ryo'].includes(npc.id);
  const LINES = {
    'yama:kid': [[{ w: 'kid', e: 'happy', jp: 'やま は すずしい ね！', ro: 'yama wa suzushii ne!', id: 'Di gunung sejuk, ya!' }, { w: 'kid', t: 'すずしい (suzushii) = sejuk. Coba cari daun もみじ (momiji) yang ada hurufnya!' }]],
    'machi:emma': [[{ w: 'emma', e: 'happy', jp: 'まち は ひと が おおい です ね！', ro: 'machi wa hito ga ooi desu ne!', id: 'Kotanya ramai sekali, ya!' }, { w: 'emma', t: 'ひと (hito) = orang, おおい (ooi) = banyak. Jangan lupa: seberangi jalan hanya saat lampu あお!' }]],
    'machi:ryo': [[{ w: 'ryo', e: 'happy', jp: 'カラオケ に いこう！', ro: 'karaoke ni ikou!', id: 'Ayo ke karaoke!' }, { w: 'ryo', t: 'カラオケ asalnya dari bahasa Jepang: から (kosong) + オケ (orkestra).' }]],
    'tera:emma': [[{ w: 'emma', e: 'happy', jp: 'しか が かわいい！', ro: 'shika ga kawaii!', id: 'Rusanya imut!' }, { w: 'emma', t: 'Rusa di sini bisa membungkuk (おじぎ) kalau kamu membungkuk duluan!' }]],
  };
  async function talk(npc) {
    const id = npc.id, m = World.map;
    if (id === 'okami') {
      await say({ w: 'okami', e: 'happy', jp: 'ようこそ おこしくださいました。', ro: 'youkoso okoshi kudasaimashita.', id: 'Selamat datang di penginapan kami. (sangat sopan)' });
      await say({ w: 'okami', t: 'Pemandian ada di sebelah kanan. Ganti ゆかた (yukata) di loker, dan jangan lupa minum コーヒーぎゅうにゅう setelah berendam!' });
      const a = await H().menuChoice('Pesan sesuatu?', ['Telur onsen (おんせんたまご)', 'Tidak, terima kasih']);
      UI.hideDialog();
      if (a === 0) { await say({ w: 'okami', e: 'happy', jp: 'どうぞ。ごゆっくり。', ro: 'douzo. goyukkuri.', id: 'Silakan. Nikmati dengan santai.' }); await say({ n: FOOD.onsentamago.fact }); eat('onsentamago'); }
      return;
    }
    if (id === 'itamae') {
      return order({ key: 'sushi', place: 'sushi', who: 'itamae', menu: ['maguro', 'samon', 'tamago', 'ebi', 'ika', 'ikura'],
        greet: { jp: 'へい、らっしゃい！なに に しましょう？', ro: 'hei, rasshai! nani ni shimashou?', id: 'Selamat datang! Mau yang mana?' },
        extra: async () => { await say({ w: 'itamae', t: 'Teh hijau di restoran sushi disebut あがり (agari), dan jahe acar disebut ガリ (gari).' }); } });
    }
    if (id === 'obousan') {
      await say({ w: 'obousan', e: 'happy', jp: 'ようこそ、おてら へ。', ro: 'youkoso, otera e.', id: 'Selamat datang di kuil Buddha.' });
      await H().runLines([{ q: 'Di おてら (kuil Buddha), apakah kita bertepuk tangan saat berdoa?', o: [
        { jp: 'いいえ。てを あわせる だけ。', ro: 'iie. te wo awaseru dake.', ok: true },
        { jp: 'はい。にかい たたく。', ro: '', why: 'Bertepuk tangan (2 kali) dilakukan di じんじゃ (kuil Shinto). Di おてら cukup menangkupkan tangan (がっしょう).' },
      ] }], ['obousan']);
      await say({ w: 'obousan', t: 'じんじゃ (jinja) = kuil Shinto, ada gerbang とりい. おてら (otera) = kuil Buddha, ada lonceng かね.' });
      once('obousan', 8, 'pelajaran kuil');
      return;
    }
    if (id === 'nouka') {
      await say({ w: 'nouka', e: 'happy', jp: 'これ は たんぼ だよ。おこめ を つくって いる。', ro: 'kore wa tanbo da yo. okome wo tsukutte iru.', id: 'Ini sawah. Aku menanam padi.' });
      await H().runLines([{ q: 'Nasi yang sudah dimasak disebut…', o: [
        { jp: 'ごはん', ro: 'gohan', ok: true },
        { jp: 'こめ', ro: 'kome', why: 'こめ (kome) = beras (belum dimasak). Nasi = ごはん (gohan).' },
        { jp: 'いね', ro: 'ine', why: 'いね (ine) = tanaman padi. Nasi = ごはん (gohan).' },
      ] }], ['nouka']);
      await say({ w: 'nouka', e: 'happy', jp: 'よく できました！', ro: 'yoku dekimashita!', id: 'Bagus sekali!' });
      once('nouka', 8, 'belajar di sawah');
      return;
    }
    if (id === 'shika') {
      await say({ n: 'Seekor rusa (しか) menatapmu dengan penasaran.' });
      const a = await H().menuChoice('Apa yang kamu lakukan?', ['Membungkuk (おじぎ)', 'Beri kerupuk rusa (しかせんべい) 🌸2', 'Mengelus (なでる)']);
      UI.hideDialog();
      if (a === 0) { Sound.heart(); await say({ n: 'Kamu membungkuk… dan rusanya membungkuk balik! おじぎ = membungkuk memberi hormat.' }); once('shika_ojigi', 5, 'rusa membungkuk'); }
      if (a === 1) { spend(2); Sound.ok(); await say({ n: 'Rusa itu memakan しかせんべい dengan lahap. もっと！ (lagi!) seolah katanya.' }); H().addStamp('shika', 'Memberi makan rusa'); }
      if (a === 2) { Sound.heart(); await say({ n: 'Bulunya lembut. かわいい！' }); }
      return;
    }
    const L = LINES[m + ':' + id];
    if (L) await H().runLines(L[S().day % L.length], [id]);
  }

  /* ---------- benda interaktif ---------- */
  const HANDLES = new Set(['door', 'tanbo', 'scarecrow', 'jizo', 'ashiyu', 'leaf', 'signal', 'hachiko', 'bell', 'lantern', 'bath', 'conveyor']);
  function claims(t) {
    const m = World.map;
    if (t.type === 'door') return true;
    if (m === 'eki' && ['machine', 'train', 'notice'].includes(t.type)) return true;
    if (m === 'tera' && t.type === 'shrine') return true;
    if (m === 'onsen' && ['cooler', 'closet'].includes(t.type)) return true;
    return false;
  }
  async function interact(t) {
    switch (t.type) {
      case 'door': return scene(t.door.id);
      case 'machine': return ticketMachine();
      case 'train': return board();
      case 'notice': return timetable();
      case 'shrine': {
        await say({ n: 'Kuil Buddha besar (おてら). Kamu melempar koin (おさいせん), menangkupkan tangan (がっしょう), lalu berdoa dalam hati.' });
        await say({ jp: 'なむ…', ro: 'namu…', id: '(Di おてら tidak bertepuk tangan.)' });
        if (once('tera_pray', 10, 'berdoa di kuil')) H().addStamp('tera', 'Berkunjung ke おてら');
        return;
      }
      case 'cooler': {
        await say({ jp: 'コーヒーぎゅうにゅう', ro: 'koohii gyuunyuu', id: 'Susu kopi dingin dalam botol kaca.' });
        await say({ n: 'Tradisi setelah onsen: minum sambil bertolak pinggang! ごくごく… ぷはー！' });
        eat('kohigyunyu'); return;
      }
      case 'closet': {
        await say({ n: 'Kamu berganti memakai ゆかた (yukata), kimono katun yang santai untuk di penginapan.' });
        await say({ jp: 'ゆかた、にあう？', ro: 'yukata, niau?', id: 'Yukatanya cocok?' });
        once('yukata', 5, 'memakai yukata'); return;
      }
      case 'bath': {
        await say({ n: 'Sebelum masuk onsen, ingat aturannya (マナー)!' });
        const QS = [
          { q: 'Mandi & membersihkan badan dulu sebelum masuk air panas.', a: true, why: 'Benar: からだ を あらって から はいる (cuci badan dulu).' },
          { q: 'Handuk boleh dicelupkan ke dalam air onsen.', a: false, why: 'Salah: タオル は おゆ に いれない (handuk tidak boleh masuk air).' },
          { q: 'Boleh berenang di onsen.', a: false, why: 'Salah: onsen untuk berendam dengan tenang, bukan berenang.' },
        ];
        for (const q of shuffle(QS).slice(0, 2)) {
          await H().runLines([{ q: `○ atau × ? ${q.q}`, o: [
            { jp: q.a ? '○ (benar)' : '× (salah)', ro: '', ok: true },
            { jp: q.a ? '× (salah)' : '○ (benar)', ro: '', why: q.why },
          ] }], ['okami']);
        }
        await say({ n: 'Kamu berendam di air panas. あったかい… きもちいい！ (hangat… nyaman!)' });
        if (once('onsen', 15, 'berendam di onsen')) H().addStamp('onsen', 'Berendam di おんせん');
        return;
      }
      case 'conveyor': return sushiGame();
      case 'signal': return crossGame();
      case 'bell': { await bellGame(); if (once('bell', 5, 'lonceng')) H().addStamp('kane', 'Memukul かね'); return; }
      case 'tanbo': return say({ jp: 'たんぼ', ro: 'tanbo', id: 'Sawah. Padi (いね) tumbuh di air. Setelah dipanen jadi こめ (beras), lalu dimasak jadi ごはん (nasi).' });
      case 'scarecrow': return say({ jp: 'かかし', ro: 'kakashi', id: 'Orang-orangan sawah untuk mengusir burung (とり).' });
      case 'jizo': {
        await say({ jp: 'おじぞうさま', ro: 'ojizou-sama', id: 'Patung jizo, pelindung anak-anak & pengelana. Ada dongeng かさじぞう: kakek memberi topi (かさ) kepada jizo di musim salju.' });
        once('jizo', 3, 'jizo'); return;
      }
      case 'ashiyu': {
        await say({ jp: 'あしゆ', ro: 'ashiyu', id: 'Pemandian kaki gratis. Kamu merendam kaki… あし (kaki) + ゆ (air panas).' });
        await say({ n: 'Orang di sebelahmu berkata: 「いい おゆ です ね。」 (Air panasnya enak, ya.)' });
        once('ashiyu', 5, 'pemandian kaki'); return;
      }
      case 'leaf': {
        const key = `leaf_${t.x}_${t.y}`, d = S().placeDay || (S().placeDay = {});
        if (d[key] === S().day) return say({ n: 'Daun di sini sudah kamu ambil hari ini.' });
        const pool = S().kana.length ? S().kana : ['あ', 'い', 'う'];
        const k = pick(pool), others = shuffle(pool.filter(x => x !== k && KANA[x] && KANA[x].ro !== KANA[k].ro)).slice(0, 2);
        await say({ jp: 'もみじ', ro: 'momiji', id: `Daun maple merah! Ada huruf di atasnya: 「${k}」` });
        await H().runLines([{ q: `Bacanya… 「${k}」`, o: [{ jp: KANA[k].ro, ro: '', ok: true }, ...others.map(x => ({ jp: KANA[x].ro, ro: '', why: `「${k}」 dibaca "${KANA[k].ro}".` }))] }], []);
        d[key] = S().day; S().leaves = (S().leaves || 0) + 1; Save.write(); H().addPoints(3, 'daun momiji');
        if (S().leaves === 10) H().addStamp('momiji', 'Kolektor もみじ (10)');
        return;
      }
      case 'hachiko': {
        await say({ jp: 'ハチこう', ro: 'hachikou', id: 'Patung anjing setia Hachiko di Shibuya. Ia menunggu tuannya di stasiun setiap hari selama 10 tahun.' });
        await say({ n: 'いぬ (inu) = anjing. ちゅうけん (chuuken) = anjing yang setia.' });
        once('hachiko', 3, 'Hachiko'); return;
      }
      case 'lantern': return say({ jp: 'とうろう', ro: 'tourou', id: 'Lentera batu di jalan menuju kuil. Dinyalakan saat festival.' });
    }
  }

  return { npcs, song: m => SONG[m], talks, talk, interact, claims, handles: t => HANDLES.has(t), scene, eat, foodBook, FOODS, DESTS, num };
})();

/* ---------- gabungkan dengan modul tempat sebelumnya (places.js) ---------- */
(() => {
  const P1 = Object.assign({}, Places);
  Places.npcs = (m, ctx) => [...P1.npcs(m, ctx), ...Places2.npcs(m)];
  Places.song = m => Places2.song(m) || P1.song(m);
  Places.talks = npc => Places2.talks(npc) || P1.talks(npc);
  Places.talk = npc => (Places2.talks(npc) ? Places2.talk(npc) : P1.talk(npc));
  Places.claims = t => Places2.claims(t);
  Places.handles = t => Places2.handles(t) || P1.handles(t);
  Places.interact = t => (Places2.claims(t) || Places2.handles(t.type) ? Places2.interact(t) : P1.interact(t));
  Places.scene = id => Places2.scene(id);
  Places.eat = id => Places2.eat(id);
  Places.foodBook = () => Places2.foodBook();
})();
window.Places2 = Places2;
