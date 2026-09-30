/* =========================================================
   SUARA
   - Pengucapan bahasa Jepang: Text-to-Speech bawaan browser (gratis, tanpa file)
   - Efek suara 8-bit: dibuat langsung dengan Web Audio
   - Penyesuaian iOS/iPadOS (Safari & aplikasi dari layar utama):
     * satu AudioContext bersama (efek + musik), dibangunkan lagi di setiap ketukan
       karena iOS menghentikannya ("interrupted") setelah TTS bicara, telepon, atau pindah aplikasi
     * sesi audio "playback" supaya suara tetap keluar walau tombol senyap iPhone aktif
       (seperti di Android); untuk iOS lama memakai trik audio senyap yang diputar berulang
     * satu elemen <audio> yang "dibuka" saat ketukan pertama, dipakai ulang untuk rekaman suara
   ========================================================= */
const Sound = (() => {
  const hasTTS = 'speechSynthesis' in window;
  const synth = hasTTS ? window.speechSynthesis : null;
  let voice = null, idVoice = null, ctx = null, all = [];
  const isIOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let unlocked = false;

  /* ---------- AudioContext bersama ---------- */
  function getCtx() {
    if (ctx && ctx.state !== 'closed') return ctx;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      // iOS: state "interrupted"/"suspended" setelah TTS, telepon, atau Siri → coba bangunkan lagi
      ctx.onstatechange = () => { if (unlocked && !document.hidden && ctx.state !== 'running') setTimeout(wake, 300); };
    } catch (e) { ctx = null; }
    return ctx;
  }
  function wake() {
    try { if (ctx && ctx.state !== 'running' && ctx.state !== 'closed' && !document.hidden) { const p = ctx.resume(); if (p && p.catch) p.catch(() => {}); } } catch (e) {}
  }

  /* ---------- sesi audio iOS: tetap bersuara walau mode senyap ---------- */
  function setSession() {
    try { if (navigator.audioSession && navigator.audioSession.type !== 'playback') navigator.audioSession.type = 'playback'; } catch (e) {}
  }
  setSession();
  // WAV senyap kecil dibuat di memori (tanpa file)
  let silentUrl = null;
  function silent() {
    if (silentUrl) return silentUrl;
    const n = 1600, b = new Uint8Array(44 + n), v = new DataView(b.buffer);
    const str = (o, t) => [...t].forEach((c, i) => { b[o + i] = c.charCodeAt(0); });
    str(0, 'RIFF'); v.setUint32(4, 36 + n, true); str(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true); v.setUint32(28, 8000, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); str(36, 'data'); v.setUint32(40, n, true);
    b.fill(128, 44);
    try { silentUrl = URL.createObjectURL(new Blob([b], { type: 'audio/wav' })); } catch (e) { silentUrl = ''; }
    return silentUrl;
  }
  // iOS < 17 tidak punya navigator.audioSession: audio senyap yang berulang memindah sesi ke "playback"
  let silentEl = null;
  function silentLoop() {
    if (!isIOS || navigator.audioSession || !silent()) return;
    if (!silentEl) {
      silentEl = document.createElement('audio');
      silentEl.setAttribute('x-webkit-airplay', 'deny'); silentEl.setAttribute('playsinline', '');
      silentEl.loop = true; silentEl.preload = 'auto'; silentEl.src = silent();
    }
    if (silentEl.paused) { const p = silentEl.play(); if (p && p.catch) p.catch(() => {}); }
  }

  /* ---------- satu elemen <audio> untuk rekaman (iOS menolak Audio() baru di luar ketukan) ---------- */
  let media = null, mediaEnd = null;
  function unlockMedia() {
    if (media) return;
    media = new Audio(); media.preload = 'auto'; media.setAttribute('playsinline', '');
    if (silent()) { media.src = silent(); const p = media.play(); if (p && p.then) p.then(() => media.pause()).catch(() => {}); }
  }
  function stopMedia() { if (mediaEnd) { const f = mediaEnd; mediaEnd = null; f(); } if (media) { try { media.pause(); } catch (e) {} } }
  // Putar file audio (rekaman). Selesai saat berhenti, gagal, atau diganti file lain.
  function playMedia(src, rate = 1, maxMs = 20000) {
    stopMedia();
    const a = media || (media = new Audio());
    return new Promise(res => {
      let done = false;
      const end = () => { if (done) return; done = true; clearTimeout(to); if (mediaEnd === end) mediaEnd = null; a.onended = a.onerror = null; res(); };
      const to = setTimeout(end, maxMs);
      mediaEnd = end;
      try {
        a.onended = end; a.onerror = end;
        a.src = src; a.playbackRate = rate; a.preservesPitch = true;
        const p = a.play(); if (p && p.catch) p.catch(end);
      } catch (e) { end(); }
    });
  }

  const settings = () => (typeof Save !== 'undefined' ? Save.d.settings : { voice: true, sfx: true, rate: 0.85 });
  const isJa = v => /^ja([-_]|$)/i.test(v.lang);
  const isId = v => /^(id|in)([-_]|$)/i.test(v.lang);

  // Beri nilai: suara "natural/neural/online" jauh lebih mirip manusia daripada suara robot bawaan
  function score(v, kind) {
    const n = v.name || '';
    let sc = 0;
    if (/natural|neural|online|premium|enhanced|wavenet|studio/i.test(n)) sc += 6;
    if (/google/i.test(n)) sc += 3;
    if (kind === 'ja' && /nanami|keita|aoi|daichi|mayu|naoki|shiori|kyoko|o-?ren|otoya|hattori|haruka|ayumi|ichiro|sayaka/i.test(n)) sc += 2;
    if (kind === 'id' && /gadis|ardi|damayanti/i.test(n)) sc += 2;
    if (/compact|espeak|robot/i.test(n)) sc -= 4;
    if (kind === 'ja' && /^ja[-_]JP$/i.test(v.lang)) sc += 1;
    if (kind === 'id' && /^id[-_]ID$/i.test(v.lang)) sc += 1;
    if (v.localService === false) sc += 1;
    return sc;
  }
  const best = (list, kind) => list.slice().sort((a, b) => score(b, kind) - score(a, kind))[0] || null;

  function pickVoice() {
    if (!hasTTS) return;
    try { all = synth.getVoices() || []; } catch (e) { all = []; }
    const st = settings();
    const ja = all.filter(isJa), id = all.filter(isId);
    voice = ja.find(v => v.name === st.jaVoice) || best(ja, 'ja');
    idVoice = id.find(v => v.name === st.idVoice) || best(id, 'id');
  }
  if (hasTTS) {
    pickVoice();
    try { synth.addEventListener('voiceschanged', pickVoice); } catch (e) { synth.onvoiceschanged = pickVoice; }
  }
  // Di HP (terutama Android) daftar suara sering baru muncul beberapa detik kemudian
  function ensureVoices() {
    if (!hasTTS) return Promise.resolve();
    if (!all.length) pickVoice();
    if (all.length) return Promise.resolve();
    return new Promise(res => {
      let n = 0;
      const t = setInterval(() => { pickVoice(); if (all.length || ++n > 12) { clearInterval(t); res(); } }, 120);
    });
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));

  // Apakah suara bahasa Jepang tersedia di perangkat ini?
  function hasJa() { if (hasTTS && !all.length) pickVoice(); return hasTTS && !!voice; }
  function hasId() { if (hasTTS && !all.length) pickVoice(); return hasTTS && !!idVoice; }
  // Daftar suara untuk dipilih di Pengaturan
  function voices(kind) { if (hasTTS && !all.length) pickVoice(); return all.filter(kind === 'id' ? isId : isJa).sort((a, b) => score(b, kind) - score(a, kind)); }
  function voiceName(kind) { const v = kind === 'id' ? idVoice : voice; return v ? v.name : ''; }

  function clean(t) { return String(t).replace(/[〜~]/g, '').replace(/\s+/g, ' ').trim(); }

  let seq = 0;
  // Inti: ucapkan satu kalimat. Aman untuk HP (jeda setelah cancel, resume, batas waktu sesuai panjang teks)
  async function utter(text, lang, v, rate, pitch) {
    if (!hasTTS || !text) return;
    const my = ++seq;
    await ensureVoices();
    try {
      if (synth.speaking || synth.pending) { synth.cancel(); await wait(isIOS ? 160 : 90); }
      if (synth.paused) synth.resume();
    } catch (e) {}
    if (my !== seq) return;
    return new Promise(res => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang; if (v) u.voice = v;
        u.rate = rate; u.pitch = pitch; u.volume = 1;
        // simpan referensi: Safari/Chrome kadang membuang ucapan sebelum "onend" terpanggil
        utter.cur = u;
        let done = false; const end = () => { if (!done) { done = true; clearTimeout(to); if (utter.cur === u) utter.cur = null; if (isIOS) setTimeout(wake, 120); res(); } };
        const to = setTimeout(end, 2500 + text.length * (lang === 'ja-JP' ? 260 : 110) / rate);
        u.onend = end; u.onerror = end;
        synth.speak(u);
        // Bug Chrome Android: kadang tertahan dalam status "paused"
        setTimeout(() => { try { if (synth.paused) synth.resume(); } catch (e) {} }, 250);
      } catch (e) { res(); }
    });
  }

  // Mengucapkan teks Jepang. Mengembalikan Promise yang selesai saat suara berhenti.
  /* ---------- rekaman suara asli (opsional) ----------
     Jika ada file audio/ja/<kode>.mp3 (rekaman penutur asli) untuk kalimat itu,
     file itulah yang diputar; kalau tidak, memakai suara TTS perangkat.
     Daftar file ada di audio/manifest.json (dibuat oleh: npm run voice:manifest). */
  let pack = null;
  try {
    fetch('audio/manifest.json', { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (j && Array.isArray(j.files) && j.files.length) pack = new Set(j.files); })
      .catch(() => {});
  } catch (e) {}
  // Kode file = hash FNV-1a dari kalimat (sama dengan scripts/voice-lines.mjs)
  function voiceKey(t) {
    let h = 0x811c9dc5;
    for (const ch of t) { h ^= ch.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; }
    return h.toString(16).padStart(8, '0');
  }
  function playClip(key) {
    return playMedia('audio/ja/' + key + '.mp3', Math.max(0.75, Math.min(1, (settings().rate || 0.85) / 0.85)), 15000);
  }
  const hasRecording = t => !!(pack && pack.has(voiceKey(clean(t))));

  function speak(text) {
    if (!text) return Promise.resolve();
    const t = clean(text);
    if (pack && pack.has(voiceKey(t))) { stop(); return playClip(voiceKey(t)); }
    return utter(t, 'ja-JP', voice, settings().rate || 0.85, 1.05);
  }
  // Narasi bahasa Indonesia (untuk video pelajaran).
  // Mengembalikan false bila perangkat jelas tidak punya suara Indonesia (subtitle tetap tampil).
  async function speakLang(text, lang = 'id-ID') {
    if (!hasTTS || !text) return false;
    await ensureVoices();
    if (all.length && !idVoice) return false;
    const r = Math.max(.85, Math.min(1.15, (settings().rate || .85) / .85));
    await utter(clean(text), lang, idVoice, r, 1.08);
    return true;
  }

  function stop() { seq++; try { hasTTS && synth.cancel(); } catch (e) {} stopMedia(); }

  // Dipanggil dari setiap ketukan/klik/tombol (aturan browser HP, terutama iOS)
  function unlock() {
    unlocked = true;
    setSession();
    const c = getCtx();
    if (c && c.state !== 'running') {
      wake();
      // iOS: memutar buffer 1 sampel di dalam ketukan "membuka" Web Audio
      try { const b = c.createBuffer(1, 1, 22050), src = c.createBufferSource(); src.buffer = b; src.connect(c.destination); src.start(0); } catch (e) {}
    }
    if (settings().sfx !== false || settings().music) silentLoop();
    unlockMedia();
    if (hasTTS && !unlock.done) {
      unlock.done = true;
      try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {}
      pickVoice();
    }
  }
  // Setiap interaksi pengguna membangunkan audio lagi (iOS menghentikannya setelah TTS/telepon/pindah aplikasi)
  ['touchend', 'click', 'keydown'].forEach(ev => document.addEventListener(ev, unlock, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (silentEl) try { silentEl.pause(); } catch (e) {} }
    else if (unlocked) { wake(); if (silentEl) silentLoop(); }
  });

  // Nada 8-bit sederhana
  function notes(list, type = 'square', vol = 0.05) {
    if (!settings().sfx) return;
    try {
      const ctx = getCtx(); if (!ctx) return;
      if (ctx.state !== 'running') wake();
      let t = ctx.currentTime;
      list.forEach(([f, d]) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.value = f;
        g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + d + 0.02);
        t += d * 0.9;
      });
    } catch (e) {}
  }

  return {
    speak, speakLang, stop, unlock, hasJa, hasId, voices, voiceName, pickVoice, hasTTS, voiceKey, hasRecording,
    getCtx, wake, playMedia, stopMedia, isIOS,
    blip:  () => notes([[880, 0.03]], 'square', 0.025),
    ok:    () => notes([[784, 0.08], [1175, 0.14]]),
    bad:   () => notes([[220, 0.12], [185, 0.18]], 'triangle', 0.08),
    bump:  () => notes([[110, 0.06]], 'triangle', 0.06),
    door:  () => notes([[392, 0.06], [523, 0.08]], 'square', 0.03),
    star:  () => notes([[523, 0.09], [659, 0.09], [784, 0.09], [1047, 0.2]]),
    heart: () => notes([[988, 0.07], [1319, 0.12]], 'square', 0.035),
  };
})();
