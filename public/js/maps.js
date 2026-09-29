/* =========================================================
   PETA & UBIN (TILE)
   Setiap huruf di peta = satu ubin 16x16 piksel.
   Bangunan & papan tanda ditaruh sebagai "objek".
   ========================================================= */
const TILE = 16;

const MAPS = {
  town: {
    name: 'Kota Sakura', outdoor: true,
    rows: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'TP,...................,...PT',
      'T.f........................T',
      'TP..................Y.....PT',
      'T..........................T',
      'T.,......................,.T',
      'T.,.....#####==#####...,...T',
      'T............==............T',
      'T.......f....==.L..........T',
      'T............==...f........T',
      'TM...........==...........VT',
      'T==========================T',
      'T==========================T',
      'T.,....L.....==.....L..,...T',
      'TP.f.....P.,.==......,...P.T',
      'T.,WWWWW...b.==............T',
      'TP.WWWWW.....==............T',
      'T..WWWWW..f..==..f.........T',
      'Tf.WWWWW.....==............T',
      'T.P........P.==............T',
      'T......,....L==========....T',
      'TP...f....P..==..f.....,...T',
      'T.......,....==.....,......T',
      'WWWWWWWWWWWWWBBWWWWWWWWWWWWW',
      'WWWWWWWWWWWWWBBWWWWWWWWWWWWW',
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    ],
    buildings: [
      { type: 'school',  x: 8,  y: 1,  w: 12, h: 5, doors: [[13, 5], [14, 5]] },
      { type: 'house',   x: 2,  y: 7,  w: 5,  h: 4, doors: [[4, 10]] },
      { type: 'konbini', x: 20, y: 7,  w: 6,  h: 4, doors: [[22, 10]] },
      { type: 'station', x: 19, y: 15, w: 7,  h: 5, doors: [[22, 19]] },
      { type: 'shrine',  x: 22, y: 1,  w: 3,  h: 2, doors: [] },
    ],
    props: [
      { type: 'torii', x: 22, y: 4, w: 3, solid: [[22, 4], [24, 4]] },
    ],
    signs: [
      { x: 7,  y: 10, text: 'わたしの いえ', note: 'Rumahku' },
      { x: 15, y: 7,  text: 'さくら こうこう', note: 'SMA Sakura' },
      { x: 19, y: 10, text: 'コンビニ', note: 'Konbini (minimarket)' },
      { x: 8,  y: 16, text: 'いけ', note: 'Kolam' },
      { x: 10, y: 14, text: 'さくら', note: 'Bunga sakura' },
      { x: 18, y: 19, text: 'えき', note: 'Stasiun' },
      { x: 12, y: 22, text: 'かわ', note: 'Sungai' },
      { x: 21, y: 5,  text: 'じんじゃ', note: 'Kuil' },
    ],
    warps: [
      { x: 4, y: 10, to: 'home', tx: 6, ty: 6, dir: 'up' },
      { x: 13, y: 5, to: 'class', tx: 5, ty: 8, dir: 'up' },
      { x: 14, y: 5, to: 'class', tx: 5, ty: 8, dir: 'up' },
    ],
    closedDoors: [
      { x: 22, y: 10, msg: 'Pintu konbini terkunci. Tulisan di pintu: 「じゅんびちゅう」(sedang bersiap). Toko ini buka di Bab 2!', until: 12 },
      { x: 22, y: 19, msg: 'Stasiun masih ditutup. Perjalanan ke kota lain dimulai di bab berikutnya!' },
    ],
    spots: {
      gate: [12, 7], home_front: [6, 11], park: [9, 17], konbini: [20, 12], river: [16, 22], shrine: [23, 3],
      tenin: [24, 12], kid: [10, 22], ojii: [17, 20], mochi: [25, 2],
    },
  },
  class: {
    name: 'Kelas 1-A',
    rows: [
      'WWWWWWWWWWW',
      'WWWKKKKKWWW',
      'Wp.......pW',
      'W...TTT...W',
      'W.........W',
      'W.D.D.D.D.W',
      'W.........W',
      'W.D.D.D.D.W',
      'W.........W',
      'WWWWWxWWWWW',
    ],
    warps: [{ x: 5, y: 9, to: 'town', tx: 13, ty: 6, dir: 'down' }],
    spots: { sensei: [5, 2], yuki: [3, 6], kenta: [7, 6], hana: [5, 6] },
  },
  home: {
    name: 'Rumah Nenek Sato',
    rows: [
      'WWWWWWWWWWWWW',
      'WWnWWWWWWnWWW',
      'Wbb..dd..kkFW',
      'Wbb.........W',
      'W........tt.W',
      'W..rrr...tt.W',
      'WC..........W',
      'WWWWWWxWWWWWW',
    ],
    warps: [{ x: 6, y: 7, to: 'town', tx: 4, ty: 11, dir: 'down' }],
    spots: { wake: [3, 3], obaa: [11, 4] },
  },
  roof: {
    name: 'Atap Sekolah', floor: 'roof',
    rows: [
      '###########',
      '#.........#',
      '#.bb...QQ.#',
      '#......QQ.#',
      '#.........#',
      '#..bb.....#',
      '#.........#',
      '#####x#####',
    ],
    warps: [{ x: 5, y: 7, to: 'class', tx: 5, ty: 8, dir: 'up' }],
    spots: { npc: [4, 4], me: [5, 4] },
  },
  library: {
    name: 'Perpustakaan',
    rows: [
      'WWWWWWWWWWW',
      'WSSSSWSSSSW',
      'W.........W',
      'W.tt...tt.W',
      'W.........W',
      'WSS.....SSW',
      'W.........W',
      'WWWWWxWWWWW',
    ],
    warps: [{ x: 5, y: 7, to: 'class', tx: 5, ty: 8, dir: 'up' }],
    spots: { npc: [4, 4], me: [5, 4] },
  },
  club: {
    name: 'Ruang Klub',
    rows: [
      'WWWWWWWWWWW',
      'WWnWWWWWnWW',
      'WmmmmmmmmmW',
      'WmmtmmmtmmW',
      'WmmmmmmmmmW',
      'WmmtmmmtmmW',
      'WmmmmmmmmmW',
      'WWWWWxWWWWW',
    ],
    warps: [{ x: 5, y: 7, to: 'town', tx: 13, ty: 6, dir: 'down' }],
    spots: { npc: [4, 4], me: [5, 4] },
  },
};

// Ubin yang tidak bisa dilewati
// R momiji, q sawah, k orang-orangan sawah, z jizo, a pemandian kaki, g lampu lalu lintas, H Hachiko, E lonceng, l lentera batu, v daun
const SOLID_OUT = new Set(['T', 'P', 'W', '#', 'b', 'L', 'V', 'M', 'Y', 'O', 'u', '*', 'R', 'q', 'k', 'z', 'a', 'g', 'H', 'E', 'l', 'v']);
// G rak barang, I lemari minuman, R kasir, J mesin tiket, g gerbang tiket, Z rel kereta, h bangku, N papan info
const SOLID_IN  = new Set(['W', 'K', 'D', 'T', 'p', 'n', 'b', 'd', 'k', 'F', 't', 'C', 'S', 'Q', '#', 'G', 'I', 'R', 'J', 'g', 'Z', 'h', 'N', 'y', 'o']);

const Maps = (() => {
  const C = {
    k: '#2a1f2d',
    grass: '#8fcf6f', grassD: '#6fb456', grassL: '#b3e08f',
    path: '#ecd9aa', pathD: '#cfb784', pathL: '#f7ead0',
    water: '#5aa6de', waterD: '#3d82bd', waterL: '#b5e0f7',
    leaf: '#3f8f58', leafD: '#2b6a41', leafL: '#65b572',
    pink: '#f3adc4', pinkD: '#d78aa7', pinkL: '#fcd5e2',
    trunk: '#7a4f35', wood: '#b07a4c', woodD: '#8a5a36', woodL: '#d19a66',
    wall: '#f3e6cf', wallD: '#d8c4a2', roof: '#c9574f', roofD: '#983f3a',
    glass: '#9fd0ee', glassL: '#d8f0fb', white: '#fbf7ef',
    floor: '#d0a57a', floorD: '#b58a61', board: '#2f5d50', boardD: '#244a3f',
  };

  // Toko di jalan belanja (dipakai 2D & 3D)
  const SHOPS = {
    kafe:  { wall: '#f7e7d4', awning: '#5bb3a0', sign: 'カフェ', door: '#8a5a36', board: '#3b8a78', ink: '#fff' },
    honya: { wall: '#efe6d6', awning: '#8a78c8', sign: 'ほんや', door: '#6a4228' },
    ramen: { wall: '#f3e0c4', awning: '#d8455d', sign: 'ラーメン', door: '#6a4228', board: '#2a1f2d', ink: '#f6d44a' },
    koban: { wall: '#e9eef8', awning: '#3f6fb0', sign: 'こうばん', door: '#3a4f86' },
    soba:    { wall: '#e9dcc4', awning: '#3a4f86', sign: 'そば', door: '#6a4228', board: '#2a1f2d', ink: '#fbf7ef' },
    onsen:   { wall: '#efe2cf', awning: '#8a4a78', sign: 'おんせん', door: '#6a4228', board: '#fbf7ef', ink: '#8a4a78' },
    depato:  { wall: '#f4f1ea', awning: '#c9384a', sign: 'デパート', door: '#3a3f55' },
    sushi:   { wall: '#f7efe0', awning: '#3f6fb0', sign: 'すし', door: '#6a4228', board: '#fbf7ef', ink: '#3f6fb0' },
    karaoke: { wall: '#e8def5', awning: '#8a4aa8', sign: 'カラオケ', door: '#3a2a4a', board: '#2a1f2d', ink: '#f6d44a' },
    fuku:    { wall: '#fbeef2', awning: '#f28fb0', sign: 'ふく', door: '#6a4228' },
    game:    { wall: '#e0f0f5', awning: '#5bb3a0', sign: 'プリクラ', door: '#3a3f55', board: '#2a1f2d', ink: '#f28fb0' },
    chaya:   { wall: '#e9dcc4', awning: '#5a7a3a', sign: 'おちゃ', door: '#6a4228', board: '#fbf7ef', ink: '#3f6b38' },
    omamori: { wall: '#f4ecdc', awning: '#d8455d', sign: 'おまもり', door: '#6a4228' },
  };

  const hash = (x, y, s = 0) => {
    let h = (x * 374761393 + y * 668265263 + s * 2147483647) >>> 0;
    h = (h ^ (h >>> 13)) * 1274126177 >>> 0; return (h ^ (h >>> 16)) >>> 0;
  };

  function px(ctx, c, x, y, w = 1, h = 1) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

  function tileAt(map, x, y) { return (map.rows[y] || '')[x] || ' '; }

  /* ---------- ubin luar ruangan ---------- */
  function grass(ctx, X, Y, tx, ty) {
    px(ctx, C.grass, X, Y, 16, 16);
    for (let i = 0; i < 3; i++) {
      const h = hash(tx, ty, i); const x = h % 14, y = (h >> 4) % 14;
      px(ctx, C.grassD, X + x, Y + y + 1, 1, 1); px(ctx, C.grassD, X + x + 1, Y + y, 1, 1); px(ctx, C.grassD, X + x + 2, Y + y + 1, 1, 1);
    }
    const h = hash(tx, ty, 9); if (h % 3 === 0) px(ctx, C.grassL, X + (h >> 3) % 15, Y + (h >> 7) % 15, 1, 1);
  }
  function flower(ctx, X, Y, tx, ty, many) {
    grass(ctx, X, Y, tx, ty);
    const cols = ['#f6e05e', '#f28fb0', '#ffffff', '#b99cf0'];
    const n = many ? 4 : 2;
    for (let i = 0; i < n; i++) {
      const h = hash(tx, ty, i + 20); const x = 2 + h % 11, y = 2 + (h >> 5) % 11; const c = cols[(h >> 9) % cols.length];
      px(ctx, C.grassD, X + x, Y + y + 2, 1, 2);
      px(ctx, c, X + x - 1, Y + y, 3, 1); px(ctx, c, X + x, Y + y - 1, 1, 3); px(ctx, '#f7c948', X + x, Y + y, 1, 1);
    }
  }
  function path(ctx, X, Y, tx, ty, map) {
    px(ctx, C.path, X, Y, 16, 16);
    const isP = (x, y) => '=B'.includes(tileAt(map, x, y));
    if (!isP(tx, ty - 1)) px(ctx, C.pathD, X, Y, 16, 1);
    if (!isP(tx, ty + 1)) px(ctx, C.pathD, X, Y + 15, 16, 1);
    if (!isP(tx - 1, ty)) px(ctx, C.pathD, X, Y, 1, 16);
    if (!isP(tx + 1, ty)) px(ctx, C.pathD, X + 15, Y, 1, 16);
    for (let i = 0; i < 2; i++) { const h = hash(tx, ty, i + 40); px(ctx, C.pathD, X + 2 + h % 12, Y + 2 + (h >> 4) % 12, 2, 1); }
    const h = hash(tx, ty, 50); if (h % 2) px(ctx, C.pathL, X + 3 + h % 10, Y + 3 + (h >> 6) % 10, 1, 1);
  }
  function water(ctx, X, Y, tx, ty, map) {
    px(ctx, C.water, X, Y, 16, 16);
    const h = hash(tx, ty, 60);
    px(ctx, C.waterL, X + h % 10, Y + 4 + (h >> 4) % 8, 4, 1);
    px(ctx, C.waterD, X + (h >> 8) % 10 + 2, Y + (h >> 12) % 12 + 2, 3, 1);
    const up = tileAt(map, tx, ty - 1);
    if (up !== 'W' && up !== 'B' && up !== ' ') { px(ctx, C.waterL, X, Y, 16, 2); px(ctx, C.white, X, Y, 16, 1); }
    const lf = tileAt(map, tx - 1, ty), rt = tileAt(map, tx + 1, ty);
    if (lf !== 'W' && lf !== 'B' && lf !== ' ') px(ctx, C.waterL, X, Y, 1, 16);
    if (rt !== 'W' && rt !== 'B' && rt !== ' ') px(ctx, C.waterL, X + 15, Y, 1, 16);
  }
  function bridge(ctx, X, Y, tx) {
    px(ctx, C.water, X, Y, 16, 16);
    px(ctx, C.wood, X, Y, 16, 16);
    for (let y = 0; y < 16; y += 4) px(ctx, C.woodD, X, Y + y, 16, 1);
    if (tx === 13) { px(ctx, C.woodD, X, Y, 2, 16); px(ctx, C.k, X, Y, 1, 16); }
    else { px(ctx, C.woodD, X + 14, Y, 2, 16); px(ctx, C.k, X + 15, Y, 1, 16); }
  }
  function tree(ctx, X, Y, tx, ty, pink) {
    grass(ctx, X, Y, tx, ty);
    const red = pink === 'red';
    const L = red ? '#d8553d' : pink ? C.pink : C.leaf, D = red ? '#a8352a' : pink ? C.pinkD : C.leafD, H = red ? '#f29b6a' : pink ? C.pinkL : C.leafL;
    px(ctx, 'rgba(0,0,0,.18)', X + 3, Y + 13, 10, 2);
    px(ctx, C.k, X + 6, Y + 10, 4, 5); px(ctx, C.trunk, X + 7, Y + 10, 2, 4);
    // tajuk bulat
    const rows = [[5, 6], [3, 10], [2, 12], [1, 14], [1, 14], [1, 14], [1, 14], [2, 12], [3, 10], [5, 6]];
    rows.forEach(([x, w], i) => { px(ctx, C.k, X + x - 1, Y + i, w + 2, 1); });
    px(ctx, C.k, X + 4, Y - 1 + 0, 8, 1);
    rows.forEach(([x, w], i) => { px(ctx, i > 6 ? D : L, X + x, Y + i, w, 1); });
    px(ctx, H, X + 4, Y + 2, 3, 1); px(ctx, H, X + 3, Y + 3, 2, 1); px(ctx, H, X + 9, Y + 4, 2, 1);
    if (pink) { const h = hash(tx, ty, 70); px(ctx, C.white, X + 4 + h % 7, Y + 5 + (h >> 3) % 3, 1, 1); px(ctx, C.pinkD, X + 6 + (h >> 5) % 5, Y + 3, 1, 1); }
    else { px(ctx, D, X + 5, Y + 5, 1, 1); px(ctx, D, X + 10, Y + 6, 1, 1); }
  }
  function fence(ctx, X, Y, tx, ty) {
    grass(ctx, X, Y, tx, ty);
    px(ctx, C.k, X, Y + 5, 16, 1); px(ctx, C.woodL, X, Y + 6, 16, 2); px(ctx, C.k, X, Y + 8, 16, 1);
    px(ctx, C.k, X, Y + 10, 16, 1); px(ctx, C.woodL, X, Y + 11, 16, 1); px(ctx, C.k, X, Y + 12, 16, 1);
    px(ctx, C.k, X + 2, Y + 3, 4, 12); px(ctx, C.wood, X + 3, Y + 4, 2, 10);
    px(ctx, C.k, X + 10, Y + 3, 4, 12); px(ctx, C.wood, X + 11, Y + 4, 2, 10);
  }
  function bench(ctx, X, Y, tx, ty) {
    grass(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 1, Y + 5, 14, 5); px(ctx, C.wood, X + 2, Y + 6, 12, 1); px(ctx, C.woodL, X + 2, Y + 8, 12, 1);
    px(ctx, C.k, X + 2, Y + 10, 2, 4); px(ctx, C.k, X + 12, Y + 10, 2, 4);
  }

  /* ---------- ubin dalam ruangan ---------- */
  function floor(ctx, X, Y, tx, ty) {
    px(ctx, C.floor, X, Y, 16, 16);
    px(ctx, C.floorD, X, Y + 7, 16, 1); px(ctx, C.floorD, X, Y + 15, 16, 1);
    px(ctx, C.floorD, X + ((tx + ty) % 2 ? 5 : 11), Y, 1, 7); px(ctx, C.floorD, X + ((tx + ty) % 2 ? 12 : 3), Y + 8, 1, 7);
  }
  function wallT(ctx, X, Y, tx, ty, map) {
    const below = tileAt(map, tx, ty + 1);
    px(ctx, '#e8d8bc', X, Y, 16, 16);
    px(ctx, '#decaa8', X, Y + 3, 16, 1); px(ctx, '#decaa8', X, Y + 10, 16, 1);
    if (!'WKn'.includes(below)) { px(ctx, C.woodD, X, Y + 12, 16, 4); px(ctx, C.k, X, Y + 15, 16, 1); px(ctx, C.wood, X, Y + 12, 16, 1); }
  }
  function blackboard(ctx, X, Y, tx, ty, map) {
    wallT(ctx, X, Y, tx, ty, map);
    const l = tileAt(map, tx - 1, ty) !== 'K', r = tileAt(map, tx + 1, ty) !== 'K';
    px(ctx, C.k, X, Y + 1, 16, 12); px(ctx, C.woodD, X, Y + 2, 16, 10);
    px(ctx, C.board, X + (l ? 2 : 0), Y + 3, 16 - (l ? 2 : 0) - (r ? 2 : 0), 8);
    if (l) px(ctx, C.k, X, Y + 1, 1, 12); if (r) px(ctx, C.k, X + 15, Y + 1, 1, 12);
    const h = hash(tx, ty, 80); px(ctx, '#e9efe6', X + 3 + h % 8, Y + 5 + (h >> 4) % 3, 4, 1);
    if (h % 2) px(ctx, '#e9efe6', X + 4 + (h >> 6) % 6, Y + 8, 3, 1);
    px(ctx, C.woodL, X, Y + 12, 16, 1);
  }
  function desk(ctx, X, Y, tx, ty, teacher) {
    floor(ctx, X, Y, tx, ty);
    if (teacher) {
      px(ctx, C.k, X, Y + 2, 16, 12); px(ctx, C.woodL, X, Y + 3, 16, 4); px(ctx, C.wood, X, Y + 7, 16, 6);
      px(ctx, C.woodD, X, Y + 12, 16, 1);
      if (tx === 5) { px(ctx, C.white, X + 4, Y + 3, 6, 3); px(ctx, '#e35f6b', X + 11, Y + 3, 2, 3); }
      return;
    }
    px(ctx, C.k, X + 2, Y + 1, 12, 8); px(ctx, C.woodL, X + 3, Y + 2, 10, 4); px(ctx, C.wood, X + 3, Y + 6, 10, 2);
    px(ctx, C.k, X + 3, Y + 9, 1, 4); px(ctx, C.k, X + 12, Y + 9, 1, 4);
    px(ctx, C.k, X + 4, Y + 11, 8, 5); px(ctx, '#8a8f9e', X + 5, Y + 12, 6, 3);
  }
  function plant(ctx, X, Y, tx, ty) {
    floor(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 4, Y + 9, 8, 7); px(ctx, '#c46b4a', X + 5, Y + 10, 6, 5);
    px(ctx, C.k, X + 3, Y + 1, 10, 9); px(ctx, C.leaf, X + 4, Y + 2, 8, 7); px(ctx, C.leafL, X + 5, Y + 3, 2, 2); px(ctx, C.leafD, X + 8, Y + 6, 3, 2);
  }
  function exitTile(ctx, X, Y) {
    px(ctx, C.floor, X, Y, 16, 16); px(ctx, '#7c9a6a', X + 1, Y + 2, 14, 12); px(ctx, '#95b584', X + 2, Y + 3, 12, 10);
  }
  function bed(ctx, X, Y, tx, ty, map) {
    floor(ctx, X, Y, tx, ty);
    const top = tileAt(map, tx, ty - 1) !== 'b', left = tileAt(map, tx - 1, ty) !== 'b';
    px(ctx, C.k, X + (left ? 1 : 0), Y + (top ? 1 : 0), 16 - (left ? 1 : 0) - (left ? 0 : 1), 16 - (top ? 1 : 0));
    px(ctx, '#f2f0fa', X + (left ? 2 : 0), Y + (top ? 2 : 0), 16 - (left ? 2 : 0) - (left ? 0 : 2), 14 - (top ? 1 : 0));
    if (top) { px(ctx, '#ffffff', X + (left ? 4 : 1), Y + 3, 10, 5); px(ctx, C.k, X + (left ? 4 : 1), Y + 8, 10, 1); }
    else { px(ctx, '#7fa8dd', X + (left ? 2 : 0), Y, 16 - (left ? 2 : 2), 14); px(ctx, '#6390cc', X + (left ? 2 : 0), Y + 4, 16 - 2, 1); px(ctx, '#6390cc', X + (left ? 2 : 0), Y + 9, 16 - 2, 1); }
  }
  function studyDesk(ctx, X, Y, tx, ty, map) {
    floor(ctx, X, Y, tx, ty);
    const left = tileAt(map, tx - 1, ty) !== 'd';
    px(ctx, C.k, X, Y + 1, 16, 11); px(ctx, C.woodL, X + (left ? 1 : 0), Y + 2, left ? 15 : 15, 4); px(ctx, C.wood, X + (left ? 1 : 0), Y + 6, 15, 5);
    if (left) { px(ctx, C.white, X + 4, Y + 2, 7, 3); px(ctx, '#e35f6b', X + 5, Y + 3, 5, 1); }
    else { px(ctx, C.k, X + 5, Y - 4, 6, 7); px(ctx, '#f7d06b', X + 6, Y - 3, 4, 3); }
  }
  function windowWall(ctx, X, Y, tx, ty, map) {
    wallT(ctx, X, Y, tx, ty, map);
    px(ctx, C.k, X + 2, Y + 2, 12, 11); px(ctx, '#2b3566', X + 3, Y + 3, 10, 9);
    px(ctx, '#fff3b0', X + 9, Y + 4, 2, 2); px(ctx, '#ffffff', X + 5, Y + 8, 1, 1); px(ctx, C.k, X + 7, Y + 3, 1, 9);
  }
  function rug(ctx, X, Y, tx, ty, map) {
    floor(ctx, X, Y, tx, ty);
    const l = tileAt(map, tx - 1, ty) !== 'r', r = tileAt(map, tx + 1, ty) !== 'r';
    px(ctx, '#d2667a', X + (l ? 2 : 0), Y + 2, 16 - (l ? 2 : 0) - (r ? 2 : 0), 12);
    px(ctx, '#f0b4bf', X + (l ? 4 : 0), Y + 5, 16 - (l ? 4 : 0) - (r ? 4 : 0), 1);
    px(ctx, '#f0b4bf', X + (l ? 4 : 0), Y + 10, 16 - (l ? 4 : 0) - (r ? 4 : 0), 1);
  }

  /* ---------- bangunan ---------- */
  function building(ctx, b) {
    const X = b.x * TILE, Y = b.y * TILE, W = b.w * TILE, H = b.h * TILE;
    const door = (dx, dy, col = '#8a5a36') => {
      const x = dx * TILE, y = dy * TILE;
      px(ctx, C.k, x + 2, y + 1, 12, 15); px(ctx, col, x + 3, y + 2, 10, 14); px(ctx, '#f7d06b', x + 11, y + 9, 1, 2);
    };
    const win = (x, y, w = 12, h = 10) => { px(ctx, C.k, x, y, w, h); px(ctx, C.glass, x + 1, y + 1, w - 2, h - 2); px(ctx, C.glassL, x + 2, y + 2, 3, 2); px(ctx, C.k, x + Math.floor(w / 2), y, 1, h); };
    px(ctx, 'rgba(0,0,0,.18)', X + 3, Y + H - 2, W - 2, 4);

    if (b.type === 'house') {
      const roofH = 30;
      px(ctx, C.k, X, Y + roofH - 2, W, H - roofH + 2); px(ctx, C.wall, X + 1, Y + roofH, W - 2, H - roofH - 1);
      px(ctx, C.wallD, X + 1, Y + H - 4, W - 2, 3);
      for (let i = 0; i < roofH; i++) { const inset = Math.max(0, 10 - i); px(ctx, C.k, X - 2 + inset, Y + i, W + 4 - inset * 2, 1); px(ctx, i % 5 === 4 ? C.roofD : C.roof, X - 1 + inset, Y + i, W + 2 - inset * 2, 1); }
      px(ctx, C.roofD, X - 1, Y + roofH - 2, W + 2, 2);
      win(X + 8, Y + 38); win(X + W - 20, Y + 38);
      door(b.doors[0][0], b.doors[0][1], '#9a6a44');
    }
    if (b.type === 'school') {
      const roofH = 18;
      px(ctx, C.k, X, Y + roofH - 1, W, H - roofH + 1); px(ctx, '#f6eee0', X + 1, Y + roofH, W - 2, H - roofH - 1);
      px(ctx, '#e5d8c2', X + 1, Y + H - 5, W - 2, 4);
      px(ctx, C.k, X - 3, Y + 6, W + 6, roofH - 5); px(ctx, '#5f74a6', X - 2, Y + 7, W + 4, roofH - 8); px(ctx, '#7d92c2', X - 2, Y + 7, W + 4, 2); px(ctx, '#46598a', X - 2, Y + roofH - 3, W + 4, 2);
      // menara jam
      const cx = X + W / 2;
      px(ctx, C.k, cx - 17, Y - 6, 34, 26); px(ctx, '#f6eee0', cx - 16, Y - 5, 32, 24);
      px(ctx, C.k, cx - 19, Y - 10, 38, 6); px(ctx, '#5f74a6', cx - 18, Y - 9, 36, 4);
      px(ctx, C.k, cx - 7, Y - 2, 14, 14); px(ctx, C.white, cx - 6, Y - 1, 12, 12); px(ctx, C.k, cx, Y + 1, 1, 5); px(ctx, C.k, cx, Y + 5, 4, 1);
      for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) {
        const wx = X + 10 + i * 30 + (i >= 3 ? 12 : 0), wy = Y + 26 + r * 22;
        if (r === 1 && (i === 2 || i === 3)) continue;
        win(wx, wy, 16, 12);
      }
      b.doors.forEach(([dx, dy]) => door(dx, dy, '#6a7fae'));
      px(ctx, C.k, (b.doors[0][0]) * TILE + 1, (b.doors[0][1]) * TILE - 6, 30, 5); px(ctx, '#e35f6b', (b.doors[0][0]) * TILE + 2, (b.doors[0][1]) * TILE - 5, 28, 3);
    }
    if (b.type === 'konbini') {
      px(ctx, C.k, X, Y + 6, W, H - 6); px(ctx, C.white, X + 1, Y + 7, W - 2, H - 8);
      px(ctx, C.k, X - 2, Y + 2, W + 4, 8); px(ctx, '#e9ecef', X - 1, Y + 3, W + 2, 6);
      px(ctx, '#3fa06a', X + 1, Y + 12, W - 2, 4); px(ctx, '#f29b38', X + 1, Y + 16, W - 2, 2); px(ctx, '#3f6fb0', X + 1, Y + 18, W - 2, 4);
      px(ctx, C.k, X + 4, Y + 26, W - 8, 26); px(ctx, C.glass, X + 5, Y + 27, W - 10, 24);
      for (let i = 0; i < 4; i++) px(ctx, C.glassL, X + 8 + i * 22, Y + 29, 4, 2);
      px(ctx, '#e9d8b0', X + 6, Y + 44, 20, 6); px(ctx, '#f28fb0', X + 30, Y + 42, 10, 8); px(ctx, '#f6e05e', X + 72, Y + 43, 12, 7);
      door(b.doors[0][0], b.doors[0][1], '#9fd0ee');
    }
    if (SHOPS[b.type]) {
      const sp = SHOPS[b.type];
      px(ctx, C.k, X, Y + 8, W, H - 8); px(ctx, sp.wall, X + 1, Y + 9, W - 2, H - 10);
      px(ctx, C.k, X - 2, Y + 2, W + 4, 9); for (let i = 0; i < W + 2; i += 8) px(ctx, (i / 8) % 2 ? '#fff' : sp.awning, X - 1 + i, Y + 3, 8, 7);
      px(ctx, C.k, X + 6, Y + 13, W - 12, 12); px(ctx, sp.board || '#fbf7ef', X + 7, Y + 14, W - 14, 10);
      ctx.fillStyle = sp.ink || C.k; ctx.font = '700 9px "Zen Maru Gothic",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(sp.sign, X + W / 2, Y + 19.5);
      win(X + 6, Y + H - 22, 14, 12); win(X + W - 20, Y + H - 22, 14, 12);
      b.doors.forEach(([dx, dy]) => door(dx, dy, sp.door));
    }
    if (b.type === 'station') {
      const roofH = 22;
      px(ctx, C.k, X, Y + roofH - 1, W, H - roofH + 1); px(ctx, '#efe2cf', X + 1, Y + roofH, W - 2, H - roofH - 1);
      for (let i = 0; i < roofH; i++) { const inset = Math.max(0, 8 - i); px(ctx, C.k, X - 2 + inset, Y + i, W + 4 - inset * 2, 1); px(ctx, i % 4 === 3 ? '#6d5a86' : '#8a73a6', X - 1 + inset, Y + i, W + 2 - inset * 2, 1); }
      px(ctx, C.k, X + W / 2 - 22, Y + roofH + 3, 44, 12); px(ctx, C.white, X + W / 2 - 21, Y + roofH + 4, 42, 10);
      px(ctx, '#3f6fb0', X + W / 2 - 18, Y + roofH + 8, 36, 2);
      win(X + 8, Y + 44, 20, 14); win(X + W - 28, Y + 44, 20, 14);
      door(b.doors[0][0], b.doors[0][1], '#6d5a86');
    }
  }

  function sign(ctx, s) {
    const X = s.x * TILE, Y = s.y * TILE;
    px(ctx, C.k, X + 7, Y + 8, 3, 8); px(ctx, C.woodD, X + 8, Y + 9, 1, 7);
    px(ctx, C.k, X + 1, Y + 1, 14, 9); px(ctx, s.kata ? '#fbe3a6' : C.woodL, X + 2, Y + 2, 12, 7);
    px(ctx, C.woodD, X + 4, Y + 4, 8, 1); px(ctx, C.woodD, X + 4, Y + 6, 6, 1);
  }

  /* ---------- gambar seluruh peta sekali ke canvas (hemat performa) ---------- */
  /* ---------- ubin tambahan ---------- */
  function lamp(ctx, X, Y, tx, ty) {
    grass(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 6, Y + 2, 4, 14); px(ctx, '#5b5f6e', X + 7, Y + 3, 2, 12);
    px(ctx, C.k, X + 4, Y, 8, 5); px(ctx, '#fff3b0', X + 5, Y + 1, 6, 3);
  }
  function vending(ctx, X, Y, tx, ty) {
    grass(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 2, Y, 12, 16); px(ctx, '#d8455d', X + 3, Y + 1, 10, 14);
    px(ctx, C.glassL, X + 4, Y + 2, 8, 6); px(ctx, '#f6d44a', X + 5, Y + 4, 2, 3); px(ctx, '#5bb3a0', X + 9, Y + 4, 2, 3);
  }
  function mailbox(ctx, X, Y, tx, ty) {
    grass(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 4, Y + 2, 8, 9); px(ctx, '#d8455d', X + 5, Y + 3, 6, 7); px(ctx, C.k, X + 6, Y + 5, 4, 1);
    px(ctx, C.k, X + 7, Y + 11, 2, 5);
  }
  function block(ctx, X, Y, tx, ty, top, side) {
    floor(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 1, Y + 1, 14, 14); px(ctx, top, X + 2, Y + 2, 12, 8); px(ctx, side, X + 2, Y + 10, 12, 4);
  }
  function tatami(ctx, X, Y, tx, ty) {
    px(ctx, '#c9c07a', X, Y, 16, 16); px(ctx, '#b3aa66', X, Y + (tx % 2 ? 7 : 15), 16, 1);
    px(ctx, '#3f6b58', X + (ty % 2 ? 15 : 0), Y, 1, 16);
    for (let i = 0; i < 4; i++) px(ctx, '#bdb470', X + 2 + i * 4, Y + 3, 1, 10);
  }
  function concrete(ctx, X, Y, tx, ty) {
    px(ctx, '#b9bcc4', X, Y, 16, 16); px(ctx, '#a6a9b2', X, Y + 15, 16, 1); px(ctx, '#a6a9b2', X + 15, Y, 1, 16);
    const h = hash(tx, ty, 90); px(ctx, '#c9ccd3', X + h % 12, Y + (h >> 4) % 12, 2, 1);
  }
  function roofFence(ctx, X, Y, tx, ty) {
    concrete(ctx, X, Y, tx, ty);
    px(ctx, '#3f8f58', X, Y + 4, 16, 2); px(ctx, '#3f8f58', X, Y + 10, 16, 2);
    for (let x = 1; x < 16; x += 4) px(ctx, '#2b6a41', X + x, Y + 2, 1, 12);
  }
  function shrine2d(ctx, b) {
    const X = b.x * TILE, Y = b.y * TILE, W = b.w * TILE, H = b.h * TILE;
    px(ctx, C.k, X, Y + 6, W, H - 6); px(ctx, '#8a5a36', X + 1, Y + 7, W - 2, H - 8);
    px(ctx, C.k, X - 3, Y, W + 6, 10); px(ctx, '#4a5a4f', X - 2, Y + 1, W + 4, 8);
    px(ctx, '#f6f0e0', X + W / 2 - 3, Y + 12, 6, 8); px(ctx, '#e0c060', X + W / 2 - 1, Y + 10, 2, 3);
  }
  function torii2d(ctx, pr) {
    const X = pr.x * TILE, Y = pr.y * TILE, W = pr.w * TILE;
    px(ctx, C.k, X + 4, Y - 10, 8, 26); px(ctx, '#d8455d', X + 5, Y - 9, 6, 24);
    px(ctx, C.k, X + W - 12, Y - 10, 8, 26); px(ctx, '#d8455d', X + W - 11, Y - 9, 6, 24);
    px(ctx, C.k, X - 2, Y - 16, W + 4, 6); px(ctx, '#2a1f2d', X - 1, Y - 15, W + 2, 4);
    px(ctx, C.k, X + 2, Y - 7, W - 4, 4); px(ctx, '#d8455d', X + 3, Y - 6, W - 6, 2);
  }

  /* ---------- ubin tempat baru (konbini, stasiun, kafe, ramen, pantai, taman) ---------- */
  function asphalt(ctx, X, Y, tx, ty) { px(ctx, '#5b5f6e', X, Y, 16, 16); const h = hash(tx, ty, 130); px(ctx, '#6a6e7c', X + h % 14, Y + (h >> 4) % 14, 2, 1); if (ty % 3 === 1 && tx % 4 < 2) px(ctx, '#e9ecef', X, Y + 7, 16, 2); }
  function pavement(ctx, X, Y, tx, ty) { px(ctx, '#c9c4bc', X, Y, 16, 16); px(ctx, '#b3ada4', X, Y + 15, 16, 1); px(ctx, '#b3ada4', X + ((ty % 2) ? 7 : 15), Y, 1, 16); }
  function zebra(ctx, X, Y) { px(ctx, '#5b5f6e', X, Y, 16, 16); for (let i = 0; i < 16; i += 5) px(ctx, '#f4f1ea', X + i, Y + 1, 3, 14); }
  function paddy(ctx, X, Y, tx, ty) {
    px(ctx, '#7aa8b8', X, Y, 16, 16);
    for (let r = 2; r < 16; r += 5) for (let c = 2; c < 16; c += 4) { px(ctx, '#5a9a3a', X + c, Y + r, 2, 3); px(ctx, '#8fcf6f', X + c, Y + r, 1, 1); }
  }
  function statue(ctx, X, Y, tx, ty, body, cap) {
    grass(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 4, Y + 3, 8, 12); px(ctx, body, X + 5, Y + 4, 6, 10);
    if (cap) { px(ctx, C.k, X + 3, Y + 1, 10, 4); px(ctx, cap, X + 4, Y + 2, 8, 2); }
  }
  function sand(ctx, X, Y, tx, ty) {
    px(ctx, '#f1dca6', X, Y, 16, 16);
    for (let i = 0; i < 3; i++) { const h = hash(tx, ty, i + 110); px(ctx, i ? '#e2c98c' : '#fff0c8', X + h % 15, Y + (h >> 4) % 15, 1, 1); }
  }
  function goods(ctx, X, Y, tx, ty) {
    floor(ctx, X, Y, tx, ty);
    px(ctx, C.k, X, Y + 1, 16, 15); px(ctx, '#e9ecef', X + 1, Y + 2, 14, 13);
    const cols = ['#e35f6b', '#f6d44a', '#5bb3a0', '#3f6fb0', '#f29b38', '#f7b6c8'];
    for (let r = 0; r < 3; r++) { px(ctx, '#b9bcc4', X + 1, Y + 6 + r * 4, 14, 1); for (let i = 0; i < 4; i++) px(ctx, cols[(hash(tx, ty, r * 4 + i) >> 3) % cols.length], X + 2 + i * 3, Y + 3 + r * 4, 2, 3); }
  }
  function cooler(ctx, X, Y, tx, ty) {
    floor(ctx, X, Y, tx, ty);
    px(ctx, C.k, X, Y, 16, 16); px(ctx, '#dfe8ee', X + 1, Y + 1, 14, 14); px(ctx, C.glassL, X + 2, Y + 2, 12, 11);
    ['#3f6fb0', '#e35f6b', '#5bb3a0', '#f6d44a'].forEach((c, i) => { px(ctx, c, X + 3 + i * 3, Y + 4, 2, 4); px(ctx, c, X + 3 + i * 3, Y + 9, 2, 3); });
  }
  function register(ctx, X, Y, tx, ty) {
    floor(ctx, X, Y, tx, ty);
    px(ctx, C.k, X, Y + 3, 16, 12); px(ctx, '#f4f1ea', X, Y + 4, 16, 4); px(ctx, '#3fa06a', X, Y + 8, 16, 6);
    if ((tx + ty) % 2) { px(ctx, C.k, X + 4, Y, 8, 6); px(ctx, '#5b5f6e', X + 5, Y + 1, 6, 4); px(ctx, '#9fe0b0', X + 6, Y + 2, 4, 2); }
  }
  function machine(ctx, X, Y, tx, ty) {
    floor(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 1, Y, 14, 16); px(ctx, '#e9ecef', X + 2, Y + 1, 12, 14);
    px(ctx, '#3f6fb0', X + 3, Y + 2, 10, 5);
    for (let i = 0; i < 6; i++) px(ctx, i % 2 ? '#f6d44a' : '#f28fb0', X + 3 + (i % 3) * 4, Y + 8 + Math.floor(i / 3) * 3, 3, 2);
  }
  function gate(ctx, X, Y, tx, ty) {
    floor(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 3, Y + 1, 10, 14); px(ctx, '#c9ccd3', X + 4, Y + 2, 8, 12); px(ctx, '#3fa06a', X + 5, Y + 3, 6, 2); px(ctx, '#f6d44a', X + 5, Y + 9, 6, 1);
  }
  function lane(ctx, X, Y) { px(ctx, '#c9b893', X, Y, 16, 16); px(ctx, '#f6d44a', X + 2, Y + 7, 12, 2); px(ctx, '#3fa06a', X + 6, Y + 2, 4, 3); }
  function rails(ctx, X, Y, tx, ty, map) {
    px(ctx, '#6a6a70', X, Y, 16, 16);
    for (let i = 0; i < 16; i += 4) px(ctx, '#8a5a36', X + i, Y + 2, 3, 12);
    px(ctx, '#c9ccd3', X, Y + 4, 16, 1); px(ctx, '#c9ccd3', X, Y + 11, 16, 1);
    if (tileAt(map, tx, ty + 1) !== 'Z') { px(ctx, '#f4f1ea', X, Y + 14, 16, 2); px(ctx, '#f6d44a', X, Y + 15, 16, 1); }
  }
  function benchIn(ctx, X, Y, tx, ty) { floor(ctx, X, Y, tx, ty); px(ctx, C.k, X + 1, Y + 4, 14, 8); px(ctx, '#3f6fb0', X + 2, Y + 5, 12, 3); px(ctx, '#5b8fd0', X + 2, Y + 8, 12, 3); }
  function notice(ctx, X, Y, tx, ty) {
    floor(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 1, Y, 14, 13); px(ctx, '#2f5d50', X + 2, Y + 1, 12, 10);
    for (let i = 0; i < 3; i++) px(ctx, '#e9efe6', X + 4, Y + 3 + i * 3, 8 - i * 2, 1);
    px(ctx, C.k, X + 7, Y + 13, 2, 3);
  }
  function fountain(ctx, X, Y, tx, ty, map) {
    grass(ctx, X, Y, tx, ty);
    const l = tileAt(map, tx - 1, ty) !== 'O', t = tileAt(map, tx, ty - 1) !== 'O';
    px(ctx, '#c9ccd3', X + (l ? 2 : 0), Y + (t ? 2 : 0), 16 - (l ? 2 : 0), 16 - (t ? 2 : 0));
    px(ctx, C.water, X + (l ? 4 : 0), Y + (t ? 4 : 0), 16 - (l ? 4 : 0) - (l ? 0 : 2), 16 - (t ? 4 : 0) - (t ? 0 : 2));
    if (!l && !t) { px(ctx, '#e9ecef', X, Y, 4, 4); px(ctx, C.waterL, X + 1, Y - 3, 2, 4); }
  }
  function parasol(ctx, X, Y, tx, ty) {
    sand(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 7, Y + 6, 2, 10);
    px(ctx, C.k, X + 1, Y + 1, 14, 6); for (let i = 0; i < 4; i++) px(ctx, i % 2 ? '#fff' : '#e35f6b', X + 2 + i * 3, Y + 2, 3, 4);
  }
  function shell(ctx, X, Y, tx, ty) {
    sand(ctx, X, Y, tx, ty);
    px(ctx, C.k, X + 4, Y + 7, 8, 6); px(ctx, '#f7c6d3', X + 5, Y + 8, 6, 4); px(ctx, '#e89ab0', X + 7, Y + 8, 1, 4); px(ctx, '#fff', X + 5, Y + 8, 1, 1);
  }

  /* ---------- gambar seluruh peta sekali ke canvas (hemat performa) ----------
     opts.ground = true: hanya lantai/tanah (untuk mode 3D, objek dibuat terpisah) */
  function render(mapId, opts = {}) {
    const map = MAPS[mapId];
    const G = !!opts.ground;
    const w = map.rows[0].length, h = map.rows.length;
    const cv = document.createElement('canvas'); cv.width = w * TILE; cv.height = h * TILE;
    const ctx = cv.getContext('2d');
    const base = map.floor === 'roof' ? concrete : floor;
    for (let ty = 0; ty < h; ty++) for (let tx = 0; tx < w; tx++) {
      const t = tileAt(map, tx, ty), X = tx * TILE, Y = ty * TILE;
      if (map.outdoor) {
        if (t === '=') path(ctx, X, Y, tx, ty, map);
        else if (t === 'W') water(ctx, X, Y, tx, ty, map);
        else if (t === 'B') bridge(ctx, X, Y, tx);
        else if (t === ',') flower(ctx, X, Y, tx, ty, false);
        else if (t === 'f') flower(ctx, X, Y, tx, ty, true);
        else if (t === '_' || ((t === 'u' || t === '*') && G)) sand(ctx, X, Y, tx, ty);
        else if (t === 'A') asphalt(ctx, X, Y, tx, ty);
        else if (t === 'c') zebra(ctx, X, Y);
        else if (t === 'q') paddy(ctx, X, Y, tx, ty);
        else if (t === 'p' || (mapId === 'machi' && G)) pavement(ctx, X, Y, tx, ty);
        else if (G) grass(ctx, X, Y, tx, ty);
        else if (t === 'O') fountain(ctx, X, Y, tx, ty, map);
        else if (t === 'u') parasol(ctx, X, Y, tx, ty);
        else if (t === 'R') tree(ctx, X, Y, tx, ty, 'red');
        else if (t === 'k') statue(ctx, X, Y, tx, ty, '#c9a070', '#d9a45a');
        else if (t === 'z') statue(ctx, X, Y, tx, ty, '#a6a9b2', '#e35f6b');
        else if (t === 'H') statue(ctx, X, Y, tx, ty, '#8a7a5a', null);
        else if (t === 'l') statue(ctx, X, Y, tx, ty, '#9a9ea8', '#6a6e7c');
        else if (t === 'E') statue(ctx, X, Y, tx, ty, '#6a4228', '#3a3f55');
        else if (t === 'g') { grass(ctx, X, Y, tx, ty); px(ctx, C.k, X + 7, Y + 5, 2, 11); px(ctx, C.k, X + 4, Y, 8, 7); px(ctx, '#3fa06a', X + 5, Y + 1, 3, 2); px(ctx, '#e35f6b', X + 8, Y + 1, 3, 2); }
        else if (t === 'a') { grass(ctx, X, Y, tx, ty); px(ctx, C.k, X + 1, Y + 3, 14, 11); px(ctx, '#9fd0ee', X + 2, Y + 4, 12, 9); px(ctx, '#fff', X + 5, Y + 1, 1, 3); px(ctx, '#fff', X + 9, Y, 1, 3); }
        else if (t === 'v') { grass(ctx, X, Y, tx, ty); for (let i = 0; i < 5; i++) { const h = hash(tx, ty, i + 140); px(ctx, i % 2 ? '#d8553d' : '#f29b38', X + 3 + h % 9, Y + 5 + (h >> 4) % 7, 3, 2); } }
        else if (t === '*') shell(ctx, X, Y, tx, ty);
        else if (t === 'T') tree(ctx, X, Y, tx, ty, false);
        else if (t === 'P') tree(ctx, X, Y, tx, ty, true);
        else if (t === '#') fence(ctx, X, Y, tx, ty);
        else if (t === 'b') bench(ctx, X, Y, tx, ty);
        else if (t === 'L') lamp(ctx, X, Y, tx, ty);
        else if (t === 'V') vending(ctx, X, Y, tx, ty);
        else if (t === 'M') mailbox(ctx, X, Y, tx, ty);
        else if (t === 'Y') { grass(ctx, X, Y, tx, ty); px(ctx, C.k, X + 1, Y + 6, 14, 10); px(ctx, C.wood, X + 2, Y + 7, 12, 8); for (let i = 0; i < 4; i++) px(ctx, i % 2 ? '#fff' : '#d8455d', X + i * 4, Y + 1, 4, 5); px(ctx, '#f6d44a', X + 6, Y + 9, 4, 3); }
        else grass(ctx, X, Y, tx, ty);
      } else {
        if (t === 'x') exitTile(ctx, X, Y);
        else if (t === 'r') rug(ctx, X, Y, tx, ty, map);
        else if (t === 'm') tatami(ctx, X, Y, tx, ty);
        else if (t === 'j') lane(ctx, X, Y);
        else if (t === 'Z') rails(ctx, X, Y, tx, ty, map);
        else if (G) (mapId === 'club' ? tatami : base)(ctx, X, Y, tx, ty);
        else if (t === 'W') wallT(ctx, X, Y, tx, ty, map);
        else if (t === 'K') blackboard(ctx, X, Y, tx, ty, map);
        else if (t === 'T') desk(ctx, X, Y, tx, ty, true);
        else if (t === 'D') desk(ctx, X, Y, tx, ty, false);
        else if (t === 'p') plant(ctx, X, Y, tx, ty);
        else if (t === 'b') bed(ctx, X, Y, tx, ty, map);
        else if (t === 'd') studyDesk(ctx, X, Y, tx, ty, map);
        else if (t === 'n') windowWall(ctx, X, Y, tx, ty, map);
        else if (t === 'k') block(ctx, X, Y, tx, ty, '#e8e2d6', '#b9b1a2');
        else if (t === 'F') block(ctx, X, Y, tx, ty, '#f4f6f8', '#c9ced6');
        else if (t === 't') block(ctx, X, Y, tx, ty, C.woodL, C.wood);
        else if (t === 'C') block(ctx, X, Y, tx, ty, '#b07a4c', '#8a5a36');
        else if (t === 'S') block(ctx, X, Y, tx, ty, '#7a4f35', '#c9574f');
        else if (t === 'Q') block(ctx, X, Y, tx, ty, '#c9ccd3', '#8a8f9e');
        else if (t === '#') roofFence(ctx, X, Y, tx, ty);
        else if (t === 'G') goods(ctx, X, Y, tx, ty);
        else if (t === 'I') cooler(ctx, X, Y, tx, ty);
        else if (t === 'R') register(ctx, X, Y, tx, ty);
        else if (t === 'J') machine(ctx, X, Y, tx, ty);
        else if (t === 'g') gate(ctx, X, Y, tx, ty);
        else if (t === 'h') benchIn(ctx, X, Y, tx, ty);
        else if (t === 'N') notice(ctx, X, Y, tx, ty);
        else if (t === 'y') { floor(ctx, X, Y, tx, ty); px(ctx, C.k, X, Y + 2, 16, 12); px(ctx, '#c9ccd3', X, Y + 3, 16, 5); px(ctx, '#b07a4c', X, Y + 8, 16, 5); const h = hash(tx, ty, 150); px(ctx, '#fff', X + 3 + h % 6, Y + 4, 5, 3); px(ctx, ['#c9384a', '#f28c5c', '#f6d44a'][h % 3], X + 4 + h % 6, Y + 4, 3, 2); }
        else if (t === 'o') { px(ctx, '#8a9aa6', X, Y, 16, 16); px(ctx, '#7fc0dd', X + 1, Y + 1, 14, 14); px(ctx, '#d8f0fb', X + 3 + (tx % 3) * 3, Y + 4, 4, 1); px(ctx, '#fff', X + 6, Y + 9, 3, 1); }
        else base(ctx, X, Y, tx, ty);
      }
    }
    if (!G) {
      (map.buildings || []).forEach(b => b.type === 'shrine' ? shrine2d(ctx, b) : building(ctx, b));
      (map.props || []).forEach(pr => pr.type === 'torii' && torii2d(ctx, pr));
      (map.signs || []).forEach(s => sign(ctx, s));
    }
    return cv;
  }

  // Apakah ubin (x,y) bisa dilewati?
  function walkable(mapId, x, y) {
    const map = MAPS[mapId];
    if (y < 0 || x < 0 || y >= map.rows.length || x >= map.rows[0].length) return false;
    const t = tileAt(map, x, y);
    const solid = map.outdoor ? SOLID_OUT : SOLID_IN;
    if (solid.has(t)) return false;
    // gerbang tiket: dari lobi hanya bisa lewat kalau punya きっぷ (keluar dari peron selalu boleh)
    if (t === 'j' && window.World && World.map === mapId && World.player.y > y && !(typeof Save !== 'undefined' && Save.d.ticket)) return false;
    for (const pr of map.props || []) if ((pr.solid || []).some(([sx, sy]) => sx === x && sy === y)) return false;
    if ((map.signs || []).some(s => s.x === x && s.y === y)) return false;
    if ((map.closedDoors || []).some(d => d.x === x && d.y === y && d.kind !== 'gate')) return false;
    for (const b of map.buildings || []) {
      if (x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h) return b.doors.some(([dx, dy]) => dx === x && dy === y);
    }
    return true;
  }

  // Benda yang bisa diperiksa dengan tombol A
  function interactAt(mapId, x, y) {
    const map = MAPS[mapId], t = tileAt(map, x, y);
    const sign = (map.signs || []).find(s => s.x === x && s.y === y);
    if (sign) return { type: 'sign', sign };
    const door = (map.closedDoors || []).find(d => d.x === x && d.y === y && d.kind === 'scene');
    if (door) return { type: 'door', door };
    if (map.outdoor) {
      if (t === 'M') return { type: 'mailbox' };
      if (t === 'V') return { type: 'vending' };
      if (t === 'Y') return { type: 'yatai' };
      if (t === 'b') return { type: 'bench' };
      if (t === 'W') return { type: 'water', where: mapId === 'umi' ? 'sea' : mapId === 'tera' ? 'pond' : mapId === 'yama' ? 'river' : x <= 8 && y >= 14 && y <= 19 ? 'pond' : 'river' };
      const O2 = { q: 'tanbo', k: 'scarecrow', z: 'jizo', a: 'ashiyu', g: 'signal', H: 'hachiko', E: 'bell', l: 'lantern' };
      if (O2[t]) return { type: O2[t] };
      if (t === 'v') return { type: 'leaf', x, y };
      if (t === 'O') return { type: 'fountain' };
      if (t === '*') return { type: 'shell', x, y };
      if (t === 'u') return { type: 'parasol' };
      if ((map.buildings || []).some(b => b.type === 'shrine' && x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h)) return { type: 'shrine' };
      return null;
    }
    return { b: { type: 'bed' }, d: { type: 'desk' }, C: { type: 'closet' }, K: { type: 'board' }, S: { type: 'shelf' }, F: { type: 'fridge' },
      G: { type: 'goods', x }, I: { type: 'cooler' }, J: { type: 'machine' }, Z: { type: 'train' }, h: { type: 'bench' }, N: { type: 'notice' },
      y: { type: 'conveyor' }, o: { type: 'bath' } }[t] || null;
  }
  // Bisa bicara melewati ubin ini (meja, konter)
  const across = (mapId, x, y) => !MAPS[mapId].outdoor && 'TtkRy'.includes(tileAt(MAPS[mapId], x, y));

  return { render, walkable, interactAt, across, tileAt: (id, x, y) => tileAt(MAPS[id], x, y), C, hash, SHOPS };
})();
