/* =========================================================
   POTRET KARAKTER 48x48 (untuk kotak dialog)
   Digambar dari bentuk dasar + pola mata/mulut buatan tangan,
   lalu diberi bayangan dan garis tepi berwarna (bukan hitam polos)
   supaya terlihat seperti pixel art buatan tangan.
   Ekspresi: normal, happy, sad, surprised, blink (berkedip)
   ========================================================= */
const Portrait = (() => {
  const N = 48, CX = 24;

  // Pola mata kiri (kolom 0 = sudut luar). Mata kanan = cermin.
  const EYES = {
    normal:    ['kkkkkkk', '.weeeek', '.wewwek', '.weEEek', '.wEeeEk', '.wEIIEk', '..TTTT.'],
    happy:     ['.......', '.......', '..kkk..', '.k...k.', 'k.....k', '.......', '.......'],
    sad:       ['.......', 'kkkkkkk', '.weeeek', '.wewwek', '.wEeeEk', '.wEIIEk', '..TTTT.'],
    surprised: ['.kkkkk.', 'kwwwwwk', '.wweeww', '.wewEww', '.wwEEww', '.wwwwww', '..TTTT.'],
    blink:     ['.......', '.......', '.......', '.......', 'kkkkkkk', '..TTT..', '.......'],
  };

  function build(st, expr) {
    const g = Array.from({ length: N }, () => Array(N).fill(null));
    const inE = (x, y, cx, cy, rx, ry) => ((x + .5 - cx) / rx) ** 2 + ((y + .5 - cy) / ry) ** 2 <= 1;
    const fill = (test, c) => { for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (test(x, y)) g[y][x] = c; };
    const put = (x, y, c) => { if (y >= 0 && y < N && x >= 0 && x < N) g[y][x] = c; };
    const at = (x, y) => (y >= 0 && y < N && x >= 0 && x < N) ? g[y][x] : null;

    const hair = st.hair || 'short';
    const FY = st.kid ? 23 : 22;                 // pusat wajah
    const face = (x, y) => {
      const dy = (y + .5 - FY) / 13.2; if (dy < -1 || dy > 1) return false;
      let w = 12.4 * Math.sqrt(1 - dy * dy); if (dy > .15) w *= 1 - (dy - .15) * .5;
      return Math.abs(x + .5 - CX) <= w;
    };

    // 1. rambut belakang
    const backLen = { long: 47, bob: 34, bun: 0, short: 0, spiky: 0, bald: 0, twin: 40 }[hair];
    if (backLen) fill((x, y) => inE(x, y, CX, 18, 15.5, 15) || (y >= 18 && y <= backLen && x >= 8 && x <= 39), 'H');
    if (hair === 'twin') { fill((x, y) => inE(x, y, 7, 30, 4, 11) || inE(x, y, 40, 30, 4, 11), 'h'); }
    if (hair === 'bun') fill((x, y) => inE(x, y, CX, 5, 6, 4.5), 'h');

    // 2. badan
    const bodyW = y => Math.min(24, 8.5 + (y - 37) * 2.4);
    fill((x, y) => y >= 37 && Math.abs(x + .5 - CX) <= bodyW(y), 'o');
    fill((x, y) => y >= 38 && Math.abs(x + .5 - CX) <= bodyW(y) && x + .5 - CX > bodyW(y) - 5, 'O');
    const onB = (test, c) => fill((x, y) => (g[y][x] === 'o' || g[y][x] === 'O') && test(x, y), c);
    const u = st.uniform || 'plain';
    if (u === 'sailor') {
      onB((x, y) => { const d = Math.abs(x + .5 - CX); return y <= 45 && d >= (y - 37) * 0.9 - 1 && d <= (y - 37) * 0.9 + 6; }, 'c');
      onB((x, y) => { const d = Math.abs(x + .5 - CX); return y <= 45 && Math.abs(d - ((y - 37) * 0.9 + 4)) < .6; }, 'w');
      onB((x, y) => { const d = Math.abs(x + .5 - CX); return y >= 42 && y <= 47 && d <= 2 + (y - 42) * .6; }, 'a');
      onB((x, y) => y >= 41 && y <= 43 && Math.abs(x + .5 - CX) <= 3, 'a');
    } else if (u === 'gakuran') {
      onB((x, y) => y >= 36 && y <= 39 && Math.abs(x + .5 - CX) <= 6, 'O');
      [[23, 42], [23, 46]].forEach(([x, y]) => { put(x, y, 'a'); put(x + 1, y, 'a'); });
      onB((x, y) => y >= 40 && (x === 21 || x === 26) && y % 2, 'O');
    } else if (u === 'blazer') {
      onB((x, y) => y >= 37 && Math.abs(x + .5 - CX) <= Math.max(0, 6 - (y - 37) * .55), 'c');
      onB((x, y) => { const d = Math.abs(x + .5 - CX), e = Math.max(0, 6 - (y - 37) * .55); return y >= 38 && d > e && d <= e + 3; }, 'O');
      onB((x, y) => y >= 39 && Math.abs(x + .5 - CX) <= (y < 41 ? 1 : 1.2) && y <= 47, 'a');
    } else if (u === 'apron') {
      onB((x, y) => y >= 41 && x >= 16 && x <= 31, 'a');
      onB((x, y) => y >= 37 && y <= 41 && (x === 17 || x === 30), 'a');
    } else if (u === 'kimono') {
      onB((x, y) => { const d = x + .5 - CX; return y >= 37 && Math.abs(d + (y - 37) * .8) < 1.4 || (y >= 37 && Math.abs(-d + (y - 37) * .8) < 1.4 && d > 0); }, 'c');
      onB((x, y) => y >= 45, 'a');
    } else if (u === 'cardigan') {
      onB((x, y) => y >= 37 && Math.abs(x + .5 - CX) <= Math.max(0, 5 - (y - 37) * .6), 'c');
      [[22, 42], [22, 46]].forEach(([x, y]) => put(x, y, 'a'));
    } else if (u === 'tee') {
      onB((x, y) => y >= 37 && y <= 38 && Math.abs(x + .5 - CX) <= 5, 'O');
      onB((x, y) => y >= 43 && y <= 44, 'a');
    }

    // 3. leher & wajah
    fill((x, y) => y >= 31 && y <= 38 && x >= 20 && x <= 27, 'S');
    fill((x, y) => y >= 31 && y <= 33 && x >= 20 && x <= 27, 'T');
    fill(face, 's');
    fill((x, y) => inE(x, y, 11.3, FY + 1, 1.9, 3) || inE(x, y, 36.7, FY + 1, 1.9, 3), 's');
    // bayangan pipi kanan (cahaya dari kiri atas)
    fill((x, y) => g[y][x] === 's' && x + .5 - CX > 8 && y > FY - 4, 'S');
    fill((x, y) => g[y][x] === 's' && y >= FY + 9 && Math.abs(x + .5 - CX) > 5, 'S');

    // 4. rambut depan
    const tri = (x, p, a) => { const t = ((x % p) + p) % p; return a * (1 - Math.abs(t - p / 2) / (p / 2)); };
    const bangs = {
      short: x => 13 + tri(x, 5, 3.5),
      bob:   x => 16 + (x % 4 === 0 ? 1 : 0) - (Math.abs(x - CX) > 9 ? 0 : 0),
      long:  x => Math.min(18, 10 + Math.max(0, x - 18) * .45 + tri(x, 6, 2)),
      spiky: x => 11 + tri(x, 4, 5),
      bun:   x => 11 + tri(x, 8, 1.5),
      twin:  x => 15 + tri(x, 4, 2),
      bald:  () => -1,
    }[hair] || (x => 13);
    const top = (x, y) => inE(x, y, CX, 18, 14.5, 14.5);
    fill((x, y) => top(x, y) && y <= bangs(x), 'h');
    if (hair === 'bald') fill((x, y) => inE(x, y, CX, 20, 13.5, 13) && y <= 22 && y >= 13 && Math.abs(x + .5 - CX) >= 10, 'h');
    if (hair === 'spiky') fill((x, y) => y >= 1 && y <= 6 && inE(x, y, CX, 9, 12, 9) && tri(x, 6, 5) > 6 - y, 'h');
    // sisi rambut
    const side = { bob: [14, 34, 3], long: [14, 40, 3], twin: [14, 30, 2], short: [13, 24, 2], spiky: [12, 24, 2], bun: [13, 22, 1] }[hair];
    if (side) {
      const [y0, y1, w] = side;
      fill((x, y) => y >= y0 && y <= y1 && ((x >= 10 && x < 10 + w + (y < 20 ? 1 : 0)) || (x <= 37 && x > 37 - w - (y < 20 ? 1 : 0))), 'h');
    }
    // bayangan & kilau rambut
    for (let y = 1; y < N; y++) for (let x = 0; x < N; x++) {
      if (g[y][x] !== 'h') continue;
      const below = at(x, y + 1), below2 = at(x, y + 2);
      if ((below === 's' || below === 'S') || (below2 === 's' || below2 === 'S') && y > 12) g[y][x] = 'H';
      else if (x + .5 - CX > 9) g[y][x] = 'H';
    }
    for (let x = 12; x <= 36; x++) {
      const y = Math.round(8 + ((x - 22) / 12) ** 2 * 5);
      if (at(x, y) === 'h' && x % 5 !== 0) { g[y][x] = 'L'; if (x > 15 && x < 30 && at(x, y + 1) === 'h') g[y + 1][x] = 'L'; }
    }

    // 5. wajah: alis, mata, hidung, mulut, pipi
    const EY = FY - 3;
    const brow = { normal: [0, 0], happy: [-1, -1], sad: [1, -1], surprised: [-2, -2], blink: [0, 0] }[expr] || [0, 0];
    for (let i = 0; i < 5; i++) {
      const lx = 14 + i, rx = 33 - i;
      const lift = expr === 'sad' ? (i >= 3 ? -1 : 0) : 0;
      [[lx], [rx]].forEach(([x]) => { const y = EY - 3 + brow[0] + lift; if (at(x, y) === 's' || at(x, y) === 'S') g[y][x] = 'H'; });
    }
    const eye = EYES[expr] || EYES.normal;
    eye.forEach((row, dy) => [...row].forEach((c, dx) => {
      if (c === '.') return;
      put(13 + dx, EY + dy, c);           // kiri
      put(34 - dx, EY + dy, c);           // kanan (cermin)
    }));
    // kilau kecil di mata kanan juga di sisi yang sama (lebih natural)
    if (expr === 'normal' || expr === 'sad') { put(30, EY + 2, 'w'); put(31, EY + 2, 'w'); put(32, EY + 2, 'e'); }
    // kacamata
    if (st.glasses) {
      const fr = x0 => { for (let x = x0; x <= x0 + 8; x++) { put(x, EY - 1, 'g'); put(x, EY + 7, 'g'); } for (let y = EY; y <= EY + 6; y++) { put(x0, y, 'g'); put(x0 + 8, y, 'g'); } };
      fr(12); fr(27); for (let x = 21; x <= 26; x++) put(x, EY + 1, 'g');
    }
    // pipi
    if (!st.old || expr === 'happy') [[15, 16, 17], [30, 31, 32]].forEach(xs => xs.forEach((x, i) => { put(x, EY + 7, i === 1 ? 'r' : (at(x, EY + 7) === 'T' ? 'T' : 'R')); }));
    // hidung
    put(24, FY + 4, 'T');
    // mulut
    const MY = FY + 7;
    const mouths = {
      normal:    [[22, MY - 1, 'T'], [23, MY, 'm'], [24, MY, 'm'], [25, MY - 1, 'T']],
      blink:     [[22, MY - 1, 'T'], [23, MY, 'm'], [24, MY, 'm'], [25, MY - 1, 'T']],
      happy:     [[21, MY - 1, 'm'], [22, MY - 1, 'm'], [23, MY - 1, 'm'], [24, MY - 1, 'm'], [25, MY - 1, 'm'], [26, MY - 1, 'm'], [22, MY, 'm'], [23, MY, 'n'], [24, MY, 'n'], [25, MY, 'm'], [23, MY + 1, 'm'], [24, MY + 1, 'm']],
      sad:       [[23, MY - 1, 'm'], [24, MY - 1, 'm'], [22, MY, 'T'], [25, MY, 'T']],
      surprised: [[23, MY - 1, 'm'], [24, MY - 1, 'm'], [22, MY, 'm'], [23, MY, 'n'], [24, MY, 'n'], [25, MY, 'm'], [23, MY + 1, 'm'], [24, MY + 1, 'm']],
    }[expr] || [];
    mouths.forEach(([x, y, c]) => put(x, y, c));
    if (st.old) { put(13, EY + 5, 'T'); put(34, EY + 5, 'T'); put(20, FY + 6, 'T'); put(27, FY + 6, 'T'); }
    if (st.beard) { fill((x, y) => face(x, y) && y >= FY + 6 && Math.abs(x + .5 - CX) <= 7 && !(y === MY && Math.abs(x + .5 - CX) < 2), 'h'); put(23, MY, 'm'); put(24, MY, 'm'); }

    // 6. aksesori
    if (st.ribbon) {
      const R = [[31, 5], [32, 4], [33, 4], [34, 5], [34, 6], [33, 7], [32, 7], [31, 6], [32, 5], [33, 5], [32, 6], [33, 6],
        [38, 4], [39, 5], [39, 6], [38, 7], [37, 7], [36, 6], [36, 5], [37, 4], [37, 5], [38, 5], [37, 6], [38, 6], [35, 5], [35, 6]];
      R.forEach(([x, y]) => put(x, y, 'a')); put(35, 5, 'A'); put(35, 6, 'A');
    }
    if (st.headband) fill((x, y) => (y === 10 || y === 11) && (g[y][x] === 'h' || g[y][x] === 'H' || g[y][x] === 'L'), 'a');
    if (st.cap) {
      fill((x, y) => inE(x, y, CX, 11, 14.5, 9) && y <= 11, 'a');
      fill((x, y) => y >= 11 && y <= 12 && x >= 10 && x <= 38, 'A');
    }
    if (st.flower) [[14, 6], [15, 5], [15, 7], [16, 6], [13, 6]].forEach(([x, y], i) => put(x, y, i === 0 ? 'Y' : 'a'));

    // 7. garis tepi berwarna: pixel kosong di samping bentuk = warna tetangga yang digelapkan
    const out = g.map(r => r.slice());
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      if (g[y][x]) continue;
      for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const n = at(x + dx, y + dy);
        if (n && n !== 'k') { out[y][x] = '~' + n; break; }
      }
    }
    // garis antara rambut dan wajah
    for (let y = 1; y < N; y++) for (let x = 0; x < N; x++) {
      if ((out[y][x] === 's' || out[y][x] === 'S') && ['h', 'H', 'L'].includes(out[y - 1][x])) out[y - 1][x] = '~h';
    }
    return out;
  }

  return { build, N };
})();
