/* =========================================================
   PIXEL ART: semua karakter digambar titik demi titik dari kode.
   - Sprite jalan 16x16 (4 arah, 3 frame)
   - Potret 48x48 untuk dialog (lihat portrait.js)
   Setiap huruf di peta sprite = satu warna dari palet.
   ========================================================= */
const Pix = (() => {
  // Warna yang sama untuk semua karakter
  const BASE = {
    k: '#2a1f2d', // garis tepi
    s: '#f8d9c0', // kulit
    S: '#eab394', // bayangan kulit
    T: '#c98a70', // bayangan kulit gelap / garis wajah
    r: '#f28c8c', // pipi merona
    R: '#f6b2a4',
    w: '#ffffff',
    m: '#9c3446', // mulut
    n: '#e57a88', // lidah
    Y: '#f6d44a',
  };

  // Palet tiap karakter: h rambut, H rambut gelap, e mata, E iris, I iris terang,
  // o baju, O baju gelap, a aksen, A aksen gelap, p rok/celana, b sepatu, c kerah, g kacamata
  const PAL = {
    player: {},
    yuki:   { h: '#b0683f', H: '#7a4128', e: '#4a2718', E: '#a8643c', I: '#e6a66a', o: '#f7f3ea', O: '#d3c7b3', a: '#e0475f', A: '#a82f45', p: '#34497e', b: '#4a2e22', c: '#2f4378' },
    kenta:  { h: '#2f2c40', H: '#191824', e: '#1f2033', E: '#4f5690', I: '#8d95d8', o: '#2b3350', O: '#1a2035', a: '#f0c14a', A: '#b88a22', p: '#2b3350', b: '#1d1d24', c: '#1a2035' },
    sensei: { h: '#553047', H: '#35192c', e: '#2e1e3a', E: '#7a5596', I: '#b894d0', o: '#6c82ad', O: '#4d5f8a', a: '#d24c5a', A: '#9c3446', p: '#45506e', b: '#2a2230', c: '#f7f3ea', g: '#3a2438' },
    obaa:   { h: '#dcd6e0', H: '#a79eb0', e: '#3b2a3a', E: '#6d5a78', I: '#a893b4', o: '#8b6aa2', O: '#654a7a', a: '#e9c46a', A: '#b8913a', p: '#654a7a', b: '#3a2a2a', c: '#f4ecdc' },
    tenin:  { h: '#7d5431', H: '#51351d', e: '#3b2a2a', E: '#7e5b3c', I: '#c29466', o: '#5aa878', O: '#3d7d56', a: '#f7f3ea', A: '#d9cfbc', p: '#3a3f55', b: '#2a2a2a', c: '#f7f3ea' },
    kid:    { h: '#3b2a22', H: '#21160f', e: '#2a2a3a', E: '#5a5f8f', I: '#9aa2d6', o: '#ec8a42', O: '#bd6427', a: '#fff1c4', A: '#e0c98a', p: '#3f6fb0', b: '#2a2a2a', c: '#fff1c4' },
    ojii:   { h: '#bdbdc6', H: '#83838e', e: '#3a3030', E: '#6a6060', I: '#a09494', o: '#7e9b72', O: '#5a7550', a: '#e8dcc0', A: '#b7a986', p: '#5a4a3a', b: '#2a2a2a', c: '#efe6d2' },
    hana:   { h: '#1f2a44', H: '#121a2e', e: '#1d2233', E: '#3f7a8c', I: '#88c8d4', o: '#f7f3ea', O: '#d3c7b3', a: '#5bb3a0', A: '#3b8a78', p: '#34497e', b: '#2a2a2a', c: '#2f4378' },
    mochi:  { h: '#f4f0ea', H: '#d9c9b4', e: '#2a1f2d', o: '#f0a45a', O: '#c97a35', a: '#f28c8c' },
  };

  // Gaya tiap karakter
  const STYLE = {
    player: { hair: 'short', uniform: 'blazer' },
    yuki:   { hair: 'bob', ribbon: true, uniform: 'sailor' },
    kenta:  { hair: 'spiky', uniform: 'gakuran' },
    sensei: { hair: 'long', glasses: true, uniform: 'blazer' },
    obaa:   { hair: 'bun', old: true, uniform: 'kimono' },
    tenin:  { hair: 'short', uniform: 'apron' },
    kid:    { hair: 'short', kid: true, uniform: 'tee' },
    ojii:   { hair: 'bald', old: true, beard: true, uniform: 'cardigan' },
    hana:   { hair: 'twin', uniform: 'sailor', flower: true },
  };

  /* ---------- Kustomisasi pemain ---------- */
  const PLAYER_OPTIONS = {
    hair: [['short', 'Pendek'], ['bob', 'Bob'], ['long', 'Panjang'], ['spiky', 'Jabrik'], ['twin', 'Kuncir']],
    hairColor: [['#3f3a4f', 'Hitam'], ['#6b4430', 'Cokelat'], ['#b0683f', 'Karamel'], ['#d9a45a', 'Pirang'], ['#8a4a78', 'Plum'], ['#4f7fb0', 'Biru']],
    skin: [['#f8d9c0', 'Terang'], ['#e9bd98', 'Sawo'], ['#c89370', 'Cokelat']],
    uniform: [['blazer', 'Blazer'], ['sailor', 'Pelaut'], ['gakuran', 'Gakuran']],
    uniformColor: [['#3e4a7a', 'Biru tua'], ['#3f6b58', 'Hijau'], ['#6b3f5a', 'Anggur'], ['#4a4a55', 'Abu']],
    accessory: [['none', 'Tanpa'], ['ribbon', 'Pita'], ['glasses', 'Kacamata'], ['headband', 'Bando'], ['cap', 'Topi'], ['flower', 'Jepit bunga']],
    accColor: [['#e0475f', 'Merah'], ['#f0c14a', 'Kuning'], ['#5bb3a0', 'Tosca'], ['#8a78c8', 'Ungu']],
  };
  function shade(hex, t) { // t<0 gelap, t>0 terang
    const n = parseInt(hex.slice(1), 16);
    const f = v => Math.max(0, Math.min(255, Math.round(t < 0 ? v * (1 + t) : v + (255 - v) * t))).toString(16).padStart(2, '0');
    return '#' + f(n >> 16) + f((n >> 8) & 255) + f(n & 255);
  }
  function setPlayer(look) {
    const L = Object.assign({ hair: 'short', hairColor: '#3f3a4f', skin: '#f8d9c0', uniform: 'blazer', uniformColor: '#3e4a7a', accessory: 'none', accColor: '#e0475f' }, look || {});
    const sailor = L.uniform === 'sailor';
    PAL.player = {
      h: L.hairColor, H: shade(L.hairColor, -.35), e: '#2a2238', E: shade(L.hairColor, .1), I: shade(L.hairColor, .5),
      o: sailor ? '#f7f3ea' : L.uniformColor, O: sailor ? '#d3c7b3' : shade(L.uniformColor, -.3),
      a: L.accessory === 'none' || L.accessory === 'glasses' ? '#d24c5a' : L.accColor, A: shade(L.accColor, -.3),
      p: shade(L.uniformColor, -.2), b: '#3a2a2a', c: sailor ? L.uniformColor : '#f7f3ea', g: '#3a2438',
      s: L.skin, S: shade(L.skin, -.1), T: shade(L.skin, -.25),
    };
    STYLE.player = {
      hair: L.hair, uniform: L.uniform,
      ribbon: L.accessory === 'ribbon', glasses: L.accessory === 'glasses', headband: L.accessory === 'headband',
      cap: L.accessory === 'cap', flower: L.accessory === 'flower',
    };
    [...cache.keys()].forEach(k => { if (k.includes(':player:')) cache.delete(k); });
  }

  /* ---------- Sprite jalan 16x16 ---------- */
  const DOWN = [
    '................',
    '.....kkkkkk.....',
    '...kkhhhhhhkk...',
    '..khhhhhhhhhhk..',
    '..khhhhhhhhhhk..',
    '..khhsssssshhk..',
    '..khsssssssshk..',
    '..kssessssessk..',
    '..ksressssersk..',
    '...kSssssssSk...',
    '....kocaacok....',
    '...kOooooooOk...',
    '...ksoooooosk...',
    '....kppppppk....',
    '....kssk.kssk...',
    '....kbbk.kbbk...',
  ];
  const UP = [
    '................',
    '.....kkkkkk.....',
    '...kkhhhhhhkk...',
    '..khhhhhhhhhhk..',
    '..khhhhhhhhhhk..',
    '..khhhhhhhhhhk..',
    '..khhhhhhhhhhk..',
    '..khhhhhhhhhhk..',
    '..kHhhhhhhhhHk..',
    '...kHHHHHHHHk...',
    '....kooooook....',
    '...kOooooooOk...',
    '...ksoooooosk...',
    '....kppppppk....',
    '....kssk.kssk...',
    '....kbbk.kbbk...',
  ];
  const SIDE = [ // menghadap kanan
    '................',
    '.....kkkkkk.....',
    '...kkhhhhhhkk...',
    '..khhhhhhhhhhk..',
    '..khhhhhhhhhhk..',
    '..khhhhhhssshk..',
    '..khhhhhsssssk..',
    '..khhhsssssesk..',
    '..khhhssssresk..',
    '...kHhSsssssk...',
    '....kooccok.....',
    '....kOooooOk....',
    '....kooosook....',
    '....kppppppk....',
    '.....kssk.......',
    '.....kbbk.......',
  ];
  const LEGS = {
    down: [['....kssk.kssk...', '....kbbk.kbbk...'],
           ['....kssk.kbbk...', '....kbbk........'],
           ['....kbbk.kssk...', '.........kbbk...']],
    side: [['.....kssk.......', '.....kbbk.......'],
           ['....ksk..ksk....', '....kbk..kbk....'],
           ['.....kssk.......', '......kbbk......']],
  };

  const grid = rows => rows.map(r => r.split(''));
  const set = (g, y, x, c) => { if (g[y] && x >= 0 && x < g[y].length) g[y][x] = c; };

  function spriteGrid(id, dir, frame) {
    const st = STYLE[id] || {};
    const base = dir === 'up' ? UP : dir === 'down' ? DOWN : SIDE;
    const g = grid(base);
    const legs = (dir === 'down' || dir === 'up') ? LEGS.down[frame] : LEGS.side[frame];
    g[14] = legs[0].split(''); g[15] = legs[1].split('');

    // --- gaya rambut ---
    if (st.hair === 'bob' || st.hair === 'long' || st.hair === 'twin') {
      const until = st.hair === 'long' ? 12 : st.hair === 'twin' ? 11 : 9;
      if (dir === 'down') {
        for (let y = 6; y <= until; y++) { set(g, y, 2, 'k'); set(g, y, 3, 'h'); set(g, y, 12, 'h'); set(g, y, 13, 'k'); }
        if (st.hair === 'long') for (let y = 9; y <= until; y++) { set(g, y, 1, 'k'); set(g, y, 14, 'k'); set(g, y, 2, 'h'); set(g, y, 13, 'h'); }
      } else if (dir === 'up') {
        for (let y = 9; y <= until; y++) for (let x = 3; x <= 12; x++) set(g, y, x, y === until ? 'H' : 'h');
        for (let y = 9; y <= until; y++) { set(g, y, 2, 'k'); set(g, y, 13, 'k'); }
        set(g, until + 1, 3, 'k'); set(g, until + 1, 12, 'k');
      } else {
        for (let y = 8; y <= until; y++) { set(g, y, 2, 'k'); set(g, y, 3, 'h'); set(g, y, 4, 'h'); set(g, y, 5, 'H'); }
      }
    }
    if (st.hair === 'spiky') {
      if (dir === 'side') { set(g, 0, 4, 'k'); set(g, 1, 3, 'k'); set(g, 1, 4, 'h'); set(g, 2, 2, 'k'); set(g, 2, 3, 'h'); set(g, 0, 8, 'k'); set(g, 1, 8, 'h'); }
      else { set(g, 0, 4, 'k'); set(g, 0, 8, 'k'); set(g, 0, 11, 'k'); set(g, 1, 4, 'h'); set(g, 1, 8, 'h'); set(g, 1, 11, 'h'); set(g, 1, 12, 'k'); set(g, 1, 3, 'k'); }
      if (dir === 'down') { set(g, 5, 6, 'h'); set(g, 5, 9, 'h'); }
    }
    if (st.hair === 'bun') {
      set(g, 0, 6, 'k'); set(g, 0, 7, 'k'); set(g, 0, 8, 'k'); set(g, 0, 9, 'k');
      if (dir !== 'down') { set(g, 1, 6, 'h'); set(g, 1, 7, 'h'); set(g, 1, 8, 'h'); set(g, 1, 9, 'h'); }
    }
    if (st.hair === 'bald') {
      if (dir === 'down') { for (let x = 5; x <= 10; x++) { set(g, 2, x, 's'); set(g, 3, x, 's'); set(g, 4, x, 's'); } set(g, 1, 5, 'k'); }
      if (dir === 'side') { for (let x = 6; x <= 11; x++) { set(g, 2, x, 's'); set(g, 3, x, 's'); } }
    }
    if (st.beard && dir === 'down') { for (let x = 5; x <= 10; x++) set(g, 9, x, 'h'); set(g, 8, 6, 'h'); set(g, 8, 9, 'h'); }
    if (st.beard && dir === 'side') { set(g, 9, 8, 'h'); set(g, 9, 9, 'h'); set(g, 9, 10, 'h'); }

    // --- aksesori ---
    if (st.ribbon) {
      if (dir === 'down') { set(g, 1, 11, 'k'); set(g, 1, 12, 'a'); set(g, 1, 13, 'k'); set(g, 2, 12, 'a'); set(g, 2, 13, 'a'); set(g, 2, 14, 'k'); }
      else if (dir === 'up') { set(g, 1, 3, 'k'); set(g, 1, 4, 'a'); set(g, 2, 3, 'a'); set(g, 2, 2, 'k'); }
      else { set(g, 1, 4, 'k'); set(g, 2, 3, 'a'); set(g, 2, 4, 'a'); set(g, 3, 2, 'a'); }
    }
    if (st.glasses) {
      if (dir === 'down') { set(g, 7, 4, 'g'); set(g, 7, 6, 'g'); set(g, 7, 9, 'g'); set(g, 7, 11, 'g'); set(g, 6, 5, 'g'); set(g, 6, 10, 'g'); set(g, 7, 7, 'g'); set(g, 7, 8, 'g'); }
      if (dir === 'side') { set(g, 7, 9, 'g'); set(g, 7, 11, 'g'); set(g, 6, 10, 'g'); }
    }
    if (st.headband) { for (let x = 3; x <= 12; x++) if ('hH'.includes(g[3][x])) g[3][x] = 'a'; }
    if (st.cap) { for (let x = 3; x <= 12; x++) { if (g[2][x] !== '.') g[2][x] = 'a'; if (g[3][x] !== '.') g[3][x] = 'a'; } if (dir === 'down') for (let x = 4; x <= 11; x++) g[4][x] = 'A'; if (dir === 'right' || dir === 'left' || dir === 'side') { set(g, 4, 12, 'A'); set(g, 4, 13, 'A'); } }
    if (st.flower && dir !== 'up') { set(g, 2, 4, 'Y'); set(g, 1, 4, 'a'); set(g, 2, 3, 'a'); }
    if (st.uniform === 'sailor' && dir === 'down') { set(g, 10, 5, 'c'); set(g, 10, 10, 'c'); set(g, 11, 4, 'c'); set(g, 11, 11, 'c'); }
    if (st.uniform === 'gakuran' && dir === 'down') { set(g, 11, 7, 'a'); set(g, 12, 7, 'a'); set(g, 10, 7, 'O'); set(g, 10, 8, 'O'); }
    if (st.uniform === 'apron' && dir === 'down') { for (let y = 11; y <= 13; y++) for (let x = 5; x <= 10; x++) set(g, y, x, 'a'); }
    if (st.kid) { // anak kecil: celana pendek
      if (dir !== 'up') { set(g, 13, 5, 'p'); }
    }
    return g;
  }

  /* ---------- Kucing (Mochi) 16x16 ---------- */
  const CAT = [
    '................',
    '................',
    '................',
    '................',
    '....k.....k.....',
    '...kok...kok....',
    '...khhkkkhhk....',
    '...khhhhhhhk....',
    '...khehhhehk....',
    '...khhhahhhk..k.',
    '....khhhhhk..kok',
    '...khhhhhhhk.kok',
    '..khhoohhhhhkok.',
    '..khhoohhhhhhk..',
    '...khkkhkkhhk...',
    '....k..k..kk....',
  ];

  /* ---------- Menggambar ke canvas ---------- */
  const cache = new Map();
  function toCanvas(g, pal, flip) {
    const h = g.length, w = g[0].length;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');
    const colors = Object.assign({}, BASE, pal);
    colors.L = colors.L || shade(colors.h || '#888888', .3);
    colors.I = colors.I || shade(colors.E || '#666666', .4);
    colors.A = colors.A || shade(colors.a || '#888888', -.3);
    colors.g = colors.g || '#3a2438';
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const c = g[y][x]; if (!c || c === '.') continue;
      let col;
      if (c[0] === '~') col = shade(colors[c.slice(1)] || BASE.k, -.55);
      else col = colors[c];
      if (!col) continue;
      ctx.fillStyle = col; ctx.fillRect(flip ? w - 1 - x : x, y, 1, 1);
    }
    return cv;
  }

  function sprite(id, dir = 'down', frame = 0) {
    const key = `s:${id}:${dir}:${frame}`;
    if (!cache.has(key)) {
      if (id === 'mochi') {
        const g = CAT.map(r => r.split(''));
        if (frame === 1) { g[15] = '...k..k...kk....'.split(''); }
        cache.set(key, toCanvas(g, PAL.mochi, dir === 'left'));
      } else {
        const d = dir === 'left' ? 'side' : dir === 'right' ? 'side' : dir;
        cache.set(key, toCanvas(spriteGrid(id, d, frame), PAL[id] || PAL.player, dir === 'left'));
      }
    }
    return cache.get(key);
  }
  function portrait(id, expr = 'normal') {
    const key = `p:${id}:${expr}`;
    if (!cache.has(key)) cache.set(key, toCanvas(Portrait.build(STYLE[id] || {}, expr), PAL[id] || PAL.player, false));
    return cache.get(key);
  }
  // Salin potret ke elemen canvas di halaman (diperbesar tajam lewat CSS)
  function drawPortrait(target, id, expr) {
    const src = portrait(id, expr);
    target.width = src.width; target.height = src.height;
    const ctx = target.getContext('2d'); ctx.clearRect(0, 0, src.width, src.height); ctx.drawImage(src, 0, 0);
  }

  setPlayer();
  return { sprite, portrait, drawPortrait, setPlayer, shade, PAL, STYLE, PLAYER_OPTIONS };
})();
