/* =========================================================
   PIXEL ART: semua karakter digambar titik demi titik dari kode.
   - Sprite jalan 16x16 (4 arah, 3 frame)
   - Potret wajah 32x32 untuk kotak dialog (4 ekspresi)
   Setiap huruf di peta sprite = satu warna dari palet.
   ========================================================= */
const Pix = (() => {
  // Warna yang sama untuk semua karakter
  const BASE = {
    k: '#2a1f2d', // garis tepi
    s: '#f6d3b8', // kulit
    S: '#dfa586', // bayangan kulit
    r: '#f09a9a', // pipi merona
    w: '#ffffff',
    m: '#a8404f', // mulut
    n: '#3a2c3c', // bayangan gelap
  };

  // Palet tiap karakter: h rambut, H rambut gelap, e mata, E mata terang,
  // o baju, O baju gelap, a aksen (dasi/pita), p rok/celana, b sepatu, c kerah
  const PAL = {
    player: { h: '#3f3a4f', H: '#27232f', e: '#2f2a44', E: '#6b6fa8', o: '#3e4a7a', O: '#2b3459', a: '#d24c5a', p: '#2d3558', b: '#3a2a2a', c: '#f4efe6' },
    yuki:   { h: '#a4633f', H: '#6f3f27', e: '#5a3322', E: '#b0784e', o: '#f4f0e8', O: '#cdc3b2', a: '#d8455d', p: '#34497e', b: '#4a2e22', c: '#34497e' },
    kenta:  { h: '#2d2b3b', H: '#16151d', e: '#2b2b44', E: '#6a6a96', o: '#2b3350', O: '#1a2035', a: '#e8b64a', p: '#2b3350', b: '#1d1d24', c: '#1a2035' },
    sensei: { h: '#4c2f42', H: '#2e1b28', e: '#3d2a4a', E: '#8a6a9a', o: '#6f84ab', O: '#4f6189', a: '#f4efe6', p: '#45506e', b: '#2a2230', c: '#f4efe6', g: '#3a2438' },
    obaa:   { h: '#d6d0da', H: '#9a93a2', e: '#3b2a3a', E: '#7a6a7a', o: '#8a6aa0', O: '#634878', a: '#e9c46a', p: '#634878', b: '#3a2a2a', c: '#e9c46a' },
    tenin:  { h: '#7a5230', H: '#4f341c', e: '#3b2a2a', E: '#8a6a4a', o: '#5aa878', O: '#3d7d56', a: '#f4efe6', p: '#3a3f55', b: '#2a2a2a', c: '#f4efe6' },
    kid:    { h: '#3a2a22', H: '#20160f', e: '#2a2a3a', E: '#6a6a8a', o: '#e8843e', O: '#b96226', a: '#fff1c4', p: '#3f6fb0', b: '#2a2a2a', c: '#fff1c4' },
    ojii:   { h: '#b3b3bd', H: '#7d7d88', e: '#3a3030', E: '#6a6060', o: '#7d9a70', O: '#5a7550', a: '#e8dcc0', p: '#5a4a3a', b: '#2a2a2a', c: '#e8dcc0' },
  };

  // Gaya tiap karakter
  const STYLE = {
    player: { hair: 'short' },
    yuki:   { hair: 'bob', ribbon: true, uniform: 'sailor' },
    kenta:  { hair: 'spiky', uniform: 'gakuran' },
    sensei: { hair: 'long', glasses: true, uniform: 'blazer' },
    obaa:   { hair: 'bun', old: true },
    tenin:  { hair: 'short', uniform: 'apron' },
    kid:    { hair: 'short', kid: true },
    ojii:   { hair: 'bald', old: true, beard: true },
  };

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
    if (st.hair === 'bob' || st.hair === 'long') {
      const until = st.hair === 'long' ? 12 : 9;
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
    if (st.uniform === 'sailor' && dir === 'down') { set(g, 10, 5, 'c'); set(g, 10, 10, 'c'); set(g, 11, 4, 'c'); set(g, 11, 11, 'c'); }
    if (st.uniform === 'gakuran' && dir === 'down') { set(g, 11, 7, 'a'); set(g, 12, 7, 'a'); set(g, 10, 7, 'O'); set(g, 10, 8, 'O'); }
    if (st.uniform === 'apron' && dir === 'down') { for (let y = 11; y <= 13; y++) for (let x = 5; x <= 10; x++) set(g, y, x, 'a'); }
    if (st.kid) { // anak kecil: celana pendek
      if (dir !== 'up') { set(g, 13, 5, 'p'); }
    }
    return g;
  }

  /* ---------- Potret wajah 32x32 (dibuat dari bentuk + garis tepi otomatis) ---------- */
  function portraitGrid(id, expr) {
    const st = STYLE[id] || {};
    const N = 32;
    const g = Array.from({ length: N }, () => Array(N).fill(null));
    const inEll = (x, y, cx, cy, rx, ry) => ((x + .5 - cx) ** 2) / (rx * rx) + ((y + .5 - cy) ** 2) / (ry * ry) <= 1;
    const fill = (test, c) => { for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (test(x, y)) g[y][x] = c; };
    // hanya mewarnai di atas baju (untuk detail seragam)
    const onBody = (test, c) => fill((x, y) => (g[y][x] === 'o' || g[y][x] === 'O') && test(x, y), c);

    const hairLen = st.hair === 'long' ? 31 : st.hair === 'bob' ? 22 : 0;
    // 1. rambut belakang
    if (hairLen) fill((x, y) => (inEll(x, y, 16, 13, 12.5, 11.5) || (y >= 12 && y <= hairLen && x >= 4 && x <= 27)), 'H');
    if (st.hair === 'bun') fill((x, y) => inEll(x, y, 16, 3.5, 5, 3.5), 'h');

    // 2. badan & bahu
    fill((x, y) => { if (y < 24) return false; const w = 7 + (y - 24) * 1.6; return Math.abs(x + .5 - 16) <= w; }, 'o');
    fill((x, y) => { if (y < 24) return false; const w = 7 + (y - 24) * 1.6; return Math.abs(x + .5 - 16) > w - 1.2 && Math.abs(x + .5 - 16) <= w; }, 'O');
    // leher
    fill((x, y) => y >= 20 && y <= 25 && x >= 13 && x <= 18, 'S');
    // detail seragam
    if (st.uniform === 'sailor') {
      onBody((x, y) => y >= 24 && Math.abs(x + .5 - 16) >= 2 && Math.abs(x + .5 - 16) <= 2 + (y - 24) * 1.2 + 2 && y <= 29, 'c');
      onBody((x, y) => y >= 25 && y <= 28 && Math.abs(x + .5 - 16) <= (y - 24) * 0.8, 'a');
    } else if (st.uniform === 'gakuran') {
      onBody((x, y) => y >= 23 && y <= 25 && x >= 12 && x <= 19, 'O');
      [[15, 27], [15, 30]].forEach(([x, y]) => { g[y][x] = 'a'; g[y][x + 1] = 'a'; });
    } else if (st.uniform === 'blazer') {
      onBody((x, y) => y >= 24 && Math.abs(x + .5 - 16) <= Math.max(0, 5 - (y - 24) * 0.9), 'c');
      onBody((x, y) => y >= 25 && Math.abs(x + .5 - 16) > Math.max(0, 5 - (y - 24) * 0.9) && Math.abs(x + .5 - 16) <= Math.max(0, 5 - (y - 24) * 0.9) + 2, 'O');
    } else if (st.uniform === 'apron') {
      onBody((x, y) => y >= 26 && x >= 10 && x <= 21, 'a');
      onBody((x, y) => y >= 24 && y <= 26 && (x === 11 || x === 20), 'a');
    } else {
      onBody((x, y) => y >= 24 && y <= 25 && x >= 12 && x <= 19, 'c');
      if (id === 'player') onBody((x, y) => y >= 25 && y <= 30 && (x === 15 || x === 16), 'a');
    }

    // 3. wajah
    const cy = st.kid ? 15 : 14.5;
    fill((x, y) => inEll(x, y, 16, cy, 9.5, 9.8) && y < 24, 's');
    // telinga
    fill((x, y) => (inEll(x, y, 6.6, 15.5, 1.8, 2.4) || inEll(x, y, 25.4, 15.5, 1.8, 2.4)), 's');
    // bayangan di bawah rambut & dagu
    for (let x = 0; x < N; x++) for (let y = 1; y < N; y++) if (g[y][x] === 's' && y >= 21 && y <= 23 && Math.abs(x + .5 - 16) > 3) g[y][x] = 'S';

    // 4. rambut depan (poni)
    const topEll = (x, y) => inEll(x, y, 16, 12.5, 11, 10.5);
    if (st.hair === 'bald') {
      fill((x, y) => inEll(x, y, 16, 14, 10.5, 10) && y <= 12 && (x <= 7 || x >= 24), 'h');
    } else if (st.hair !== 'bun' || true) {
      const bang = x => {
        // garis bawah poni: bergerigi agar terlihat seperti helaian
        const pattern = {
          short: [9, 10, 11, 10, 9, 10, 11, 12, 11, 10, 11, 12, 11, 10, 11, 12, 11, 10, 9, 10],
          bob:   [12, 12, 11, 12, 13, 12, 11, 12, 13, 12, 12, 13, 12, 11, 12, 13, 12, 11, 12, 12],
          long:  [14, 13, 12, 11, 10, 10, 9, 9, 9, 9, 10, 10, 11, 11, 12, 12, 13, 14, 15, 16],
          spiky: [10, 12, 10, 11, 13, 10, 11, 13, 10, 12, 13, 10, 11, 13, 10, 12, 11, 10, 12, 10],
          bun:   [9, 9, 10, 10, 10, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 9, 9],
        }[st.hair] || [10];
        const i = x - 6;
        return pattern[Math.max(0, Math.min(pattern.length - 1, i))];
      };
      fill((x, y) => topEll(x, y) && y <= bang(x), 'h');
      // sisi rambut menutupi pinggir wajah
      if (st.hair === 'bob' || st.hair === 'long') fill((x, y) => y >= 10 && y <= (st.hair === 'long' ? 24 : 21) && (x === 5 || x === 6 || x === 25 || x === 26), 'h');
      if (st.hair === 'short' || st.hair === 'spiky') fill((x, y) => y >= 9 && y <= 14 && (x === 6 || x === 25), 'h');
      if (st.hair === 'spiky') { // ujung-ujung runcing di atas kepala
        [[8, 3], [9, 2], [13, 1], [14, 0], [19, 1], [20, 0], [23, 3], [24, 2]].forEach(([x, y]) => { g[y][x] = 'h'; });
      }
    }
    // kilau rambut
    for (let x = 10; x <= 21; x++) { const y = 5 + Math.round(Math.abs(x - 15.5) * 0.35); if (g[y] && g[y][x] === 'h' && (x + y) % 3 !== 0) g[y][x] = 'L'; }

    // 5. wajah: mata, alis, mulut, pipi
    const eyeY = st.kid ? 15 : 14;
    const eyes = {
      normal:    ['kkkk', 'eeww', 'eeew', 'eEEe', '.ee.'],
      happy:     ['....', '.kk.', 'k..k', '....', '....'],
      sad:       ['...k', 'kkk.', 'eeew', 'eEEe', '.ee.'],
      surprised: ['.kk.', 'keek', 'ewwe', 'keek', '.kk.'],
    }[expr] || [];
    const drawEye = (x0, flip) => eyes.forEach((row, dy) => row.split('').forEach((c, dx) => {
      if (c === '.') return; const x = flip ? x0 + 3 - dx : x0 + dx; g[eyeY + dy - 1][x] = c;
    }));
    drawEye(10, false); drawEye(18, true);
    if (st.old && expr !== 'happy') { g[eyeY - 1][10] = 's'; g[eyeY - 1][21] = 's'; g[eyeY + 3][11] = 's'; g[eyeY + 3][20] = 's'; }
    // kacamata
    if (st.glasses) {
      const frame = (x0) => { for (let x = x0; x <= x0 + 5; x++) { g[eyeY - 2][x] = 'g'; g[eyeY + 4][x] = 'g'; } for (let y = eyeY - 1; y <= eyeY + 3; y++) { g[y][x0] = 'g'; g[y][x0 + 5] = 'g'; } };
      frame(9); frame(17); g[eyeY][15] = 'g'; g[eyeY][16] = 'g';
    }
    // pipi
    if (!st.old || expr === 'happy') [[8, eyeY + 4], [9, eyeY + 4], [22, eyeY + 4], [23, eyeY + 4]].forEach(([x, y]) => { if (g[y][x] === 's') g[y][x] = 'r'; });
    // mulut
    const my = eyeY + 6;
    const mouth = {
      normal:    [[15, my, 'm'], [16, my, 'm'], [14, my - 1, 'm'], [17, my - 1, 'm']],
      happy:     [[13, my - 1, 'k'], [14, my - 1, 'k'], [15, my - 1, 'k'], [16, my - 1, 'k'], [17, my - 1, 'k'], [18, my - 1, 'k'], [14, my, 'm'], [15, my, 'm'], [16, my, 'm'], [17, my, 'm'], [15, my + 1, 'k'], [16, my + 1, 'k']],
      sad:       [[15, my - 1, 'm'], [16, my - 1, 'm'], [14, my, 'm'], [17, my, 'm']],
      surprised: [[15, my - 1, 'k'], [16, my - 1, 'k'], [14, my, 'k'], [17, my, 'k'], [15, my, 'm'], [16, my, 'm'], [15, my + 1, 'k'], [16, my + 1, 'k']],
    }[expr] || [];
    mouth.forEach(([x, y, c]) => { g[y][x] = c; });
    if (st.beard) fill((x, y) => inEll(x, y, 16, 22, 6, 3.5) && y >= 20 && g[y][x] === 's', 'h');
    if (st.beard) { g[my][15] = 'm'; g[my][16] = 'm'; }
    // pita Yuki
    if (st.ribbon) [[22, 3], [23, 3], [24, 4], [25, 4], [26, 3], [26, 5], [25, 5], [24, 5], [23, 5], [22, 5], [22, 4], [23, 4], [26, 4]].forEach(([x, y]) => { g[y][x] = 'a'; });

    // 6. garis tepi otomatis
    const out = g.map(r => r.slice());
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (g[y][x]) continue;
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g[y + dy] && g[y + dy][x + dx]);
      if (nb) out[y][x] = 'k';
    }
    // garis antara rambut dan wajah
    for (let y = 1; y < N; y++) for (let x = 0; x < N; x++) {
      if (out[y][x] === 's' && (out[y - 1][x] === 'h' || out[y - 1][x] === 'L')) out[y - 1][x] = 'H';
    }
    return out;
  }

  /* ---------- Menggambar ke canvas ---------- */
  const cache = new Map();
  function toCanvas(g, pal, flip) {
    const h = g.length, w = g[0].length;
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const ctx = cv.getContext('2d');
    const colors = Object.assign({ L: lighten(pal.h, 0.28) }, BASE, pal);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const c = g[y][x]; if (!c || c === '.') continue;
      const col = colors[c]; if (!col) continue;
      ctx.fillStyle = col; ctx.fillRect(flip ? w - 1 - x : x, y, 1, 1);
    }
    return cv;
  }
  function lighten(hex, t) {
    const n = parseInt(hex.slice(1), 16);
    const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const f = v => Math.round(v + (255 - v) * t).toString(16).padStart(2, '0');
    return '#' + f(r) + f(g) + f(b);
  }

  function sprite(id, dir = 'down', frame = 0) {
    const key = `s:${id}:${dir}:${frame}`;
    if (!cache.has(key)) {
      const d = dir === 'left' ? 'side' : dir === 'right' ? 'side' : dir;
      cache.set(key, toCanvas(spriteGrid(id, d, frame), PAL[id] || PAL.player, dir === 'left'));
    }
    return cache.get(key);
  }
  function portrait(id, expr = 'normal') {
    const key = `p:${id}:${expr}`;
    if (!cache.has(key)) cache.set(key, toCanvas(portraitGrid(id, expr), PAL[id] || PAL.player, false));
    return cache.get(key);
  }
  // Salin potret ke elemen canvas di halaman (diperbesar tajam lewat CSS)
  function drawPortrait(target, id, expr) {
    const src = portrait(id, expr);
    target.width = src.width; target.height = src.height;
    const ctx = target.getContext('2d'); ctx.clearRect(0, 0, 32, 32); ctx.drawImage(src, 0, 0);
  }

  return { sprite, portrait, drawPortrait, PAL, lighten };
})();
