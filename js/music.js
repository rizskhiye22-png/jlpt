/* =========================================================
   MUSIK LATAR
   Musik dibuat langsung oleh browser (Web Audio), tanpa file MP3.
   Memakai tangga nada pentatonik Jepang (yo / in) supaya terasa
   seperti lagu game Jepang yang santai. Setiap suasana punya lagu sendiri.
   ========================================================= */
const Music = (() => {
  let ctx = null, master = null, delayIn = null, current = null, timer = null;
  let nextTime = 0, step = 0, song = null, bus = null;

  const SCALES = {
    yo:  [0, 2, 5, 7, 9],     // nuansa lagu rakyat Jepang yang ceria
    maj: [0, 2, 4, 7, 9],     // pentatonik mayor
    in:  [0, 1, 5, 7, 8],     // nuansa malam / tenang
  };
  const THEMES = {
    title:    { bpm: 82,  root: 62, scale: 'yo',  seed: 11, lead: 'triangle', prog: [0, 3, 1, 4], drums: 0 },
    morning:  { bpm: 100, root: 64, scale: 'yo',  seed: 23, lead: 'triangle', prog: [0, 2, 3, 1], drums: 1 },
    school:   { bpm: 96,  root: 60, scale: 'maj', seed: 37, lead: 'square',   prog: [0, 3, 4, 2], drums: 1 },
    evening:  { bpm: 78,  root: 57, scale: 'yo',  seed: 41, lead: 'triangle', prog: [0, 4, 3, 1], drums: 0 },
    night:    { bpm: 64,  root: 52, scale: 'in',  seed: 53, lead: 'sine',     prog: [0, 3, 2, 3], drums: 0 },
    home:     { bpm: 74,  root: 60, scale: 'yo',  seed: 67, lead: 'sine',     prog: [0, 1, 3, 2], drums: 0 },
    game:     { bpm: 132, root: 62, scale: 'maj', seed: 71, lead: 'square',   prog: [0, 3, 4, 3], drums: 2 },
    festival: { bpm: 120, root: 65, scale: 'yo',  seed: 83, lead: 'square',   prog: [0, 3, 1, 4], drums: 2 },
  };

  const vol = () => { const s = window.Save ? Save.d.settings : {}; return s.music === undefined ? 0.5 : s.music; };

  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  // Menyusun lagu 4 bar x 2 frasa dari tema (selalu sama untuk tema yang sama)
  function compose(th) {
    const r = rng(th.seed), sc = SCALES[th.scale];
    const noteAt = i => th.root + sc[((i % 5) + 5) % 5] + 12 * Math.floor(i / 5);
    const phrase = () => {
      const out = []; let idx = 5 + Math.floor(r() * 3);
      for (let i = 0; i < 32; i++) {             // 4 bar x 8 not seperdelapan
        const strong = i % 8 === 0;
        if (!strong && r() < .34) { out.push(null); continue; }
        idx += Math.round((r() - .5) * 3.2); idx = Math.max(2, Math.min(11, idx));
        const len = r() < .25 ? 2 : 1;
        out.push({ n: noteAt(idx), len }); if (len === 2) { out.push(null); i++; }
      }
      return out;
    };
    const A = phrase(), B = phrase();
    const A2 = A.map((x, i) => i >= 24 ? B[i] : x);   // variasi di akhir frasa
    return { mel: [...A, ...B, ...A2, ...B], noteAt, prog: th.prog };
  }

  function ensure() {
    if (ctx) return true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
      // gema lembut supaya terdengar hangat
      const d = ctx.createDelay(1); d.delayTime.value = 0.32;
      const fb = ctx.createGain(); fb.gain.value = 0.28;
      const wet = ctx.createGain(); wet.gain.value = 0.22;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2200;
      d.connect(fb); fb.connect(lp); lp.connect(d); d.connect(wet); wet.connect(master);
      delayIn = d;
      return true;
    } catch (e) { return false; }
  }

  const hz = m => 440 * Math.pow(2, (m - 69) / 12);

  function tone(t, midi, dur, type, gain, cutoff, send) {
    const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    o.type = type; o.frequency.value = hz(midi);
    f.type = 'lowpass'; f.frequency.value = cutoff;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    g.gain.exponentialRampToValueAtTime(gain * 0.6, t + dur * 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f); f.connect(g); g.connect(bus); if (send) g.connect(delayIn);
    o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(t, dur, gain, hp) {
    const len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const s = ctx.createBufferSource(), g = ctx.createGain(), f = ctx.createBiquadFilter();
    s.buffer = buf; f.type = 'highpass'; f.frequency.value = hp; g.gain.value = gain;
    s.connect(f); f.connect(g); g.connect(bus); s.start(t);
  }

  function schedule() {
    if (!song || !ctx) return;
    const th = song.th, e = 60 / th.bpm / 2;   // durasi 1/8
    while (nextTime < ctx.currentTime + 0.25) {
      const i = step % song.mel.length, bar = Math.floor(i / 8) % 4, beat = i % 8;
      const chord = song.prog[bar];
      const m = song.mel[i];
      if (m) tone(nextTime, m.n, e * m.len * 1.8, th.lead, th.lead === 'square' ? .035 : .07, th.lead === 'square' ? 1800 : 3000, true);
      // bas & akor
      if (beat === 0 || beat === 4) tone(nextTime, song.noteAt(chord) - 24, e * 3.6, 'sine', .11, 700, false);
      if (beat === 0) [0, 2, 4].forEach(k => tone(nextTime, song.noteAt(chord + k) - 12, e * 7.5, 'sine', .022, 1200, true));
      if (th.drums && beat % 2 === 0) noise(nextTime, .04, beat % 4 === 0 ? .05 : .025, 6000);
      if (th.drums === 2 && (beat === 0 || beat === 4)) tone(nextTime, 36, .12, 'sine', .16, 300, false);
      if (th.drums === 2 && (beat === 2 || beat === 6)) noise(nextTime, .09, .045, 1500);
      nextTime += e; step++;
    }
  }

  function fadeTo(v, sec) {
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(v, t + sec);
  }

  // Putar lagu suasana tertentu (crossfade halus)
  function play(name) {
    if (!THEMES[name] || name === current) return;
    current = name;
    if (!ensure()) return;
    if (ctx.state === 'suspended') ctx.resume();
    const start = () => {
      if (bus) { const old = bus; setTimeout(() => old.disconnect(), 1500); }
      bus = ctx.createGain(); bus.gain.value = 1; bus.connect(master);
      song = Object.assign(compose(THEMES[name]), { th: THEMES[name] });
      step = 0; nextTime = ctx.currentTime + 0.1;
      fadeTo(level(), 1.2);
      if (!timer) timer = setInterval(schedule, 90);
    };
    if (song) { fadeTo(0.0001, 0.6); setTimeout(() => { if (current === name) start(); }, 620); } else start();
  }
  function stop() { current = null; if (ctx) fadeTo(0.0001, .5); setTimeout(() => { if (!current) { song = null; clearInterval(timer); timer = null; } }, 600); }
  let ducked = false;
  const level = () => vol() * 0.9 * (ducked ? 0.3 : 1);
  function setVolume() { if (ctx && song) fadeTo(level(), .3); }
  // Kecilkan musik saat sensei bicara, agar penjelasan terdengar jelas di HP
  function duck(on) { if (ducked === !!on) return; ducked = !!on; setVolume(); }
  function unlock() { if (ensure() && ctx.state === 'suspended') ctx.resume(); }

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend(); else ctx.resume();
  });

  return { play, stop, setVolume, duck, unlock, get current() { return current; } };
})();
