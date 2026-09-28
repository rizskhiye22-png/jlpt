/* =========================================================
   VIDEO PELAJARAN
   "Video" animasi yang diputar di dalam game saat sensei mengajar:
   - sensei berbicara (mulut bergerak, berkedip) + narasi suara
   - animasi urutan goresan huruf di papan tulis (data KanjiVG)
   - subtitle bahasa Indonesia, contoh kata, huruf yang mirip
   Semua digambar langsung (canvas), jadi tidak butuh file video.
   ========================================================= */
const Video = (() => {
  const VW = 640, VH = 360;
  const BOARD = { x: 236, y: 24, w: 384, h: 250 };
  const SIMILAR = {
    'シ': 'ツ', 'ツ': 'シ', 'ソ': 'ン', 'ン': 'ソ', 'は': 'ほ', 'ほ': 'は', 'ぬ': 'め', 'め': 'ぬ', 'わ': 'れ', 'れ': 'わ', 'ね': 'れ',
    'る': 'ろ', 'ろ': 'る', 'さ': 'き', 'き': 'さ', 'い': 'り', 'り': 'い', 'ロ': 'ろ', 'ク': 'ケ', 'ケ': 'ク', 'ウ': 'ワ', 'ワ': 'ウ',
    'ア': 'マ', 'マ': 'ア', 'チ': 'テ', 'テ': 'チ', 'ヌ': 'ス', 'ス': 'ヌ', 'ユ': 'コ', 'コ': 'ユ', 'ノ': 'ソ', 'へ': 'ヘ', 'ヘ': 'へ',
    'あ': 'お', 'お': 'あ', 'た': 'な', 'な': 'た', 'ち': 'さ', 'う': 'つ', 'つ': 'う',
  };
  const lenCache = new Map();
  function pathLen(d) {
    if (!lenCache.has(d)) {
      let L = 120;
      try { const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); L = p.getTotalLength() || 120; } catch (e) {}
      lenCache.set(d, L);
    }
    return lenCache.get(d);
  }
  const startPt = d => { const m = d.match(/[Mm]\s*([\d.]+)[ ,]([\d.]+)/); return m ? [+m[1], +m[2]] : [0, 0]; };
  const JP = '"Zen Maru Gothic","Hiragino Maru Gothic ProN","Noto Sans JP",sans-serif';

  /* ---------- menggambar adegan ---------- */
  function drawRoom(ctx) {
    ctx.fillStyle = '#efe2c8'; ctx.fillRect(0, 0, VW, VH);
    ctx.fillStyle = '#e4d3b3'; for (let y = 0; y < VH; y += 24) ctx.fillRect(0, y, VW, 2);
    ctx.fillStyle = '#b07a4c'; ctx.fillRect(0, VH - 60, VW, 60);
    ctx.fillStyle = '#8a5a36'; for (let x = 0; x < VW; x += 48) ctx.fillRect(x, VH - 60, 2, 60);
    // papan tulis
    const B = BOARD;
    ctx.fillStyle = '#6a4228'; ctx.fillRect(B.x - 10, B.y - 10, B.w + 20, B.h + 20);
    ctx.fillStyle = '#2f5d50'; ctx.fillRect(B.x, B.y, B.w, B.h);
    const g = ctx.createRadialGradient(B.x + B.w / 2, B.y + B.h / 2, 30, B.x + B.w / 2, B.y + B.h / 2, B.w * .7);
    g.addColorStop(0, 'rgba(255,255,255,.06)'); g.addColorStop(1, 'rgba(0,0,0,.18)');
    ctx.fillStyle = g; ctx.fillRect(B.x, B.y, B.w, B.h);
    ctx.fillStyle = '#8a5a36'; ctx.fillRect(B.x - 10, B.y + B.h + 6, B.w + 20, 8);
    ctx.fillStyle = '#f4f1e6'; ctx.fillRect(B.x + 30, B.y + B.h + 3, 14, 4); ctx.fillStyle = '#f2c14e'; ctx.fillRect(B.x + 52, B.y + B.h + 3, 12, 4);
  }
  function drawSensei(ctx, t, talking) {
    const blink = (t % 3200) < 140;
    const expr = blink ? 'blink' : talking ? (Math.floor(t / 140) % 2 ? 'happy' : 'normal') : 'normal';
    const img = Pix.portrait('sensei', expr);
    ctx.imageSmoothingEnabled = false;
    const bob = talking ? Math.sin(t / 180) * 2 : Math.sin(t / 700) * 1.5;
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.ellipse(112, VH - 22, 80, 10, 0, 0, 7); ctx.fill();
    ctx.drawImage(img, 16, VH - 216 + bob, 192, 192);
    ctx.imageSmoothingEnabled = true;
  }
  function chalk(ctx) { ctx.strokeStyle = '#f7f3e6'; ctx.fillStyle = '#f7f3e6'; ctx.shadowColor = 'rgba(255,255,255,.35)'; ctx.shadowBlur = 3; }
  function noShadow(ctx) { ctx.shadowBlur = 0; }
  function textOnBoard(ctx, text, size, y, color = '#f7f3e6', font = JP) {
    ctx.save(); chalk(ctx); ctx.fillStyle = color; ctx.font = `700 ${size}px ${font}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, BOARD.x + BOARD.w / 2, y); ctx.restore();
  }
  // Gambar huruf dengan urutan goresan; progress 0..1 per seluruh huruf
  function drawStrokes(ctx, k, cx, cy, size, progress, opts = {}) {
    const strokes = STROKES[k]; if (!strokes) { textOnBoard(ctx, k, size * .9, cy); return; }
    const sc = size / 109;
    ctx.save(); ctx.translate(cx - size / 2, cy - size / 2); ctx.scale(sc, sc);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    // bayangan huruf samar
    if (opts.ghost !== false) {
      ctx.strokeStyle = 'rgba(255,255,255,.12)'; ctx.lineWidth = 6.5;
      strokes.forEach(d => ctx.stroke(new Path2D(d)));
    }
    const n = strokes.length, per = 1 / n;
    strokes.forEach((d, i) => {
      const local = Math.max(0, Math.min(1, (progress - i * per) / per));
      if (local <= 0) return;
      const L = pathLen(d);
      ctx.strokeStyle = opts.color || '#f7f3e6'; ctx.lineWidth = opts.width || 5.5;
      ctx.shadowColor = 'rgba(255,255,255,.3)'; ctx.shadowBlur = 2 / sc;
      ctx.setLineDash([L, L]); ctx.lineDashOffset = L * (1 - local);
      ctx.stroke(new Path2D(d));
      ctx.setLineDash([]); ctx.shadowBlur = 0;
      if (opts.numbers !== false) {
        const [sx, sy] = startPt(d);
        ctx.fillStyle = '#f2c14e'; ctx.beginPath(); ctx.arc(sx - 4, sy - 4, 5, 0, 7); ctx.fill();
        ctx.fillStyle = '#2a1f2d'; ctx.font = '700 7px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(i + 1, sx - 4, sy - 3.6);
      }
      // kuas / kapur yang sedang bergerak
      if (local < 1 && opts.pen !== false) {
        try {
          const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d);
          const pt = p.getPointAtLength(L * local);
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(pt.x, pt.y, 3.2, 0, 7); ctx.fill();
        } catch (e) {}
      }
    });
    ctx.restore();
  }

  /* ---------- menyusun naskah video ---------- */
  function buildScript(opts) {
    const { kana = [], intro = [], title = 'Video Pelajaran' } = opts;
    const shots = [];
    const known = new Set([...Save.d.kana, ...kana]);
    const B = BOARD, cx = B.x + B.w / 2, cy = B.y + B.h / 2;
    // pembuka
    shots.push({ dur: 2200, cap: title, draw: (c, t) => { textOnBoard(c, title, 30, cy - 20, '#ffd24a', '"DotGothic16",sans-serif'); textOnBoard(c, kana.join(' '), 40, cy + 36); } });
    intro.forEach(line => shots.push({ dur: 2600, cap: line, narr: line, draw: (c) => { textOnBoard(c, kana.join(' '), 44, cy); } }));
    kana.forEach((k, idx) => {
      const K = KANA[k], strokes = STROKES[k] || [], n = strokes.length || 1;
      const word = WORDS.find(w => w.jp.includes(k) && [...w.jp].every(ch => knownChar(ch, known)));
      const tw = Lesson.twin(k), sim = SIMILAR[k];
      const tag = `${idx + 1}/${kana.length}`;
      shots.push({ dur: 2000, cap: `Huruf ${tag}: ${k}`, narr: `Huruf berikutnya.`, jp: k,
        draw: (c, t, p) => { const s = 150 + Math.sin(Math.min(1, p) * Math.PI) * 16; drawStrokes(c, k, cx, cy, s, 1, { numbers: false, pen: false, ghost: false }); } });
      shots.push({ dur: 2600, cap: `Huruf ini dibaca "${K.ro}".`, narr: `Huruf ini dibaca ${K.ro}.`, jp: k,
        draw: (c) => { drawStrokes(c, k, cx - 60, cy, 170, 1, { numbers: false, pen: false, ghost: false }); c.save(); chalk(c); c.font = '700 64px "DotGothic16",sans-serif'; c.fillStyle = '#ffd24a'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(K.ro, cx + 110, cy); c.restore(); } });
      shots.push({ dur: 1100 + n * 1100, cap: `Perhatikan urutan goresannya: ${n} goresan.`, narr: `Perhatikan urutan goresannya. Ada ${n} goresan.`,
        draw: (c, t, p) => drawStrokes(c, k, cx, cy, 200, Math.min(1, p * 1.08)) });
      shots.push({ dur: 3400, cap: K.tip, narr: K.tip.replace(/[「」"]/g, ''),
        draw: (c, t) => { const s = 180 + Math.sin(t / 300) * 6; drawStrokes(c, k, cx, cy, s, 1, { pen: false }); } });
      if (IS_KATA(k) && KANA[tw]) shots.push({ dur: 2600, cap: `Pasangan hiragananya adalah ${tw}. Bunyinya sama: "${K.ro}".`, narr: `Pasangan hiragananya, bunyinya sama.`, jp: tw,
        draw: (c) => { drawStrokes(c, k, cx - 90, cy, 150, 1, { numbers: false, pen: false }); drawStrokes(c, tw, cx + 90, cy, 150, 1, { numbers: false, pen: false, color: '#bfe3ff' }); textOnBoard(c, '=', 40, cy); } });
      if (sim && KANA[sim]) shots.push({ dur: 3000, cap: `Hati-hati! ${k} (${K.ro}) mirip dengan ${sim} (${KANA[sim].ro}). Perhatikan bedanya.`, narr: `Hati-hati, jangan tertukar dengan huruf yang mirip.`,
        draw: (c, t) => { drawStrokes(c, k, cx - 90, cy - 10, 150, 1, { numbers: false, pen: false }); drawStrokes(c, sim, cx + 90, cy - 10, 150, 1, { numbers: false, pen: false, color: '#f6b2a4' }); c.save(); chalk(c); c.font = '700 28px "DotGothic16",sans-serif'; c.textAlign = 'center'; c.fillStyle = '#ffd24a'; c.fillText(K.ro, cx - 90, cy + 95); c.restore(); c.save(); chalk(c); c.font = '700 28px "DotGothic16",sans-serif'; c.fillStyle = '#f6b2a4'; c.textAlign = 'center'; c.fillText(KANA[sim].ro, cx + 90, cy + 95); c.restore(); } });
      if (word) shots.push({ dur: 3000, cap: `Contoh kata: ${word.jp} (${word.ro}) artinya "${word.id}".`, narr: `Contoh kata. Artinya ${word.id}.`, jp: word.jp,
        draw: (c, t, p) => { textOnBoard(c, word.jp, 76, cy - 18); textOnBoard(c, word.ro, 26, cy + 56, '#ffd24a', '"DotGothic16",sans-serif'); } });
      shots.push({ dur: 1200 + n * 900, cap: 'Sekarang ikuti di udara dengan jarimu, pelan-pelan!', narr: 'Sekarang ikuti dengan jarimu, pelan-pelan.',
        draw: (c, t, p) => drawStrokes(c, k, cx, cy, 200, Math.min(1, p * 1.08)) });
    });
    shots.push({ dur: 2200, cap: opts.outro || 'Bagus! Sekarang giliranmu menulis.', narr: opts.outro || 'Bagus! Sekarang giliranmu menulis.',
      draw: (c) => { textOnBoard(c, 'よく できました！', 40, cy - 10); textOnBoard(c, 'yoku dekimashita!', 22, cy + 40, '#ffd24a', '"DotGothic16",sans-serif'); } });
    return shots;
  }

  /* ---------- pemutar ---------- */
  function play(opts) {
    const shots = buildScript(opts);
    const total = shots.reduce((a, s) => a + s.dur, 0);
    Music.play('home');
    const p = UI.panel(`
      <div class="video">
        <div class="v-top"><span class="v-rec">● VIDEO</span><span class="v-title">${opts.title || 'Video Pelajaran'}</span></div>
        <div class="v-frame"><canvas width="${VW}" height="${VH}"></canvas><div class="v-cap"></div><button class="v-big" type="button" aria-label="Putar">▶</button></div>
        <div class="v-bar"><i></i></div>
        <div class="v-ctrl">
          <button class="vb" data-a="back" type="button" aria-label="Mundur">⏮</button>
          <button class="vb main" data-a="play" type="button" aria-label="Putar/Jeda">⏸</button>
          <button class="vb" data-a="next" type="button" aria-label="Maju">⏭</button>
          <button class="vb txt" data-a="speed" type="button">1x</button>
          <button class="vb txt" data-a="cc" type="button">CC</button>
          <button class="vb txt skip" data-a="skip" type="button">Selesai ▶</button>
        </div>
      </div>`, 'videop');
    const cv = p.querySelector('canvas'), ctx = cv.getContext('2d');
    const cap = p.querySelector('.v-cap'), bar = p.querySelector('.v-bar i'), big = p.querySelector('.v-big'), playBtn = p.querySelector('[data-a=play]');
    let i = 0, t0 = 0, elapsed = 0, playing = true, speed = 1, raf = 0, speechDone = true, cc = true, alive = true;
    const narrOn = () => Save.d.settings.narr !== false;

    function startShot(n) {
      i = Math.max(0, Math.min(shots.length - 1, n)); elapsed = 0; speechDone = true;
      const s = shots[i];
      cap.textContent = s.cap || ''; cap.style.display = cc && s.cap ? '' : 'none';
      if (!playing) return;
      speakShot(s);
    }
    async function speakShot(s) {
      Sound.stop(); speechDone = false;
      const my = i;
      try {
        if (s.narr && narrOn() && Sound.hasId()) await Sound.speakLang(s.narr, 'id-ID');
        if (my !== i || !alive) return;
        if (s.jp && Save.d.settings.voice !== false) await Sound.speak(s.jp);
      } catch (e) {}
      if (my === i) speechDone = true;
    }
    function frame(ts) {
      if (!alive) return;
      const dt = t0 ? Math.min(60, ts - t0) : 16; t0 = ts;
      if (playing) {
        elapsed += dt * speed;
        const s = shots[i];
        if (elapsed >= s.dur && speechDone) {
          if (i < shots.length - 1) startShot(i + 1);
          else { playing = false; playBtn.textContent = '↺'; big.textContent = '↺'; big.classList.add('on'); }
        }
      }
      const s = shots[i], prog = Math.min(1, elapsed / s.dur);
      drawRoom(ctx);
      const talking = playing && (!speechDone || (s.narr && elapsed < s.dur * .7));
      drawSensei(ctx, ts, talking);
      ctx.save(); s.draw(ctx, ts, prog); ctx.restore(); noShadow(ctx);
      const done = shots.slice(0, i).reduce((a, x) => a + x.dur, 0) + Math.min(elapsed, s.dur);
      bar.style.width = (done / total * 100) + '%';
      raf = requestAnimationFrame(frame);
    }
    const setPlaying = on => {
      playing = on; playBtn.textContent = on ? '⏸' : '▶'; big.textContent = '▶'; big.classList.toggle('on', !on);
      if (!on) Sound.stop(); else speakShot(shots[i]);
    };
    startShot(0);
    raf = requestAnimationFrame(frame);

    return UI.wait(done => {
      const finish = () => { alive = false; cancelAnimationFrame(raf); Sound.stop(); done(); };
      playBtn.onclick = () => { if (i === shots.length - 1 && !playing && elapsed >= shots[i].dur) { startShot(0); setPlaying(true); return; } setPlaying(!playing); };
      big.onclick = () => playBtn.onclick();
      p.querySelector('.v-frame canvas').onclick = () => playBtn.onclick();
      p.querySelector('[data-a=back]').onclick = () => { startShot(Math.max(0, i - 1)); };
      p.querySelector('[data-a=next]').onclick = () => { startShot(Math.min(shots.length - 1, i + 1)); };
      p.querySelector('[data-a=speed]').onclick = e => { speed = speed === 1 ? .75 : speed === .75 ? 1.25 : 1; e.target.textContent = speed + 'x'; };
      p.querySelector('[data-a=cc]').onclick = e => { cc = !cc; e.target.classList.toggle('off', !cc); cap.style.display = cc ? '' : 'none'; };
      p.querySelector('[data-a=skip]').onclick = () => { Sound.blip(); finish(); };
    });
  }

  return { play, drawStrokes };
})();
