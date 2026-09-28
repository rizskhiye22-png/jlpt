/* =========================================================
   SUARA
   - Pengucapan bahasa Jepang: Text-to-Speech bawaan browser (gratis, tanpa file)
   - Efek suara 8-bit: dibuat langsung dengan Web Audio
   ========================================================= */
const Sound = (() => {
  const hasTTS = 'speechSynthesis' in window;
  const synth = hasTTS ? window.speechSynthesis : null;
  let voice = null, idVoice = null, ctx = null, all = [];

  const settings = () => (window.Save ? Save.d.settings : { voice: true, sfx: true, rate: 0.85 });
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
      if (synth.speaking || synth.pending) { synth.cancel(); await wait(90); }
      if (synth.paused) synth.resume();
    } catch (e) {}
    if (my !== seq) return;
    return new Promise(res => {
      try {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang; if (v) u.voice = v;
        u.rate = rate; u.pitch = pitch; u.volume = 1;
        let done = false; const end = () => { if (!done) { done = true; clearTimeout(to); res(); } };
        const to = setTimeout(end, 2500 + text.length * (lang === 'ja-JP' ? 260 : 110) / rate);
        u.onend = end; u.onerror = end;
        synth.speak(u);
        // Bug Chrome Android: kadang tertahan dalam status "paused"
        setTimeout(() => { try { if (synth.paused) synth.resume(); } catch (e) {} }, 250);
      } catch (e) { res(); }
    });
  }

  // Mengucapkan teks Jepang. Mengembalikan Promise yang selesai saat suara berhenti.
  function speak(text) {
    if (!text) return Promise.resolve();
    return utter(clean(text), 'ja-JP', voice, settings().rate || 0.85, 1.05);
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

  function stop() { seq++; try { hasTTS && synth.cancel(); } catch (e) {} }

  // Harus dipanggil dari ketukan pertama pengguna (aturan browser HP)
  function unlock() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) {}
    if (hasTTS && !unlock.done) {
      unlock.done = true;
      try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {}
      pickVoice();
    }
  }

  // Nada 8-bit sederhana
  function notes(list, type = 'square', vol = 0.05) {
    if (!settings().sfx) return;
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
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
    speak, speakLang, stop, unlock, hasJa, hasId, voices, voiceName, pickVoice, hasTTS,
    blip:  () => notes([[880, 0.03]], 'square', 0.025),
    ok:    () => notes([[784, 0.08], [1175, 0.14]]),
    bad:   () => notes([[220, 0.12], [185, 0.18]], 'triangle', 0.08),
    bump:  () => notes([[110, 0.06]], 'triangle', 0.06),
    door:  () => notes([[392, 0.06], [523, 0.08]], 'square', 0.03),
    star:  () => notes([[523, 0.09], [659, 0.09], [784, 0.09], [1047, 0.2]]),
    heart: () => notes([[988, 0.07], [1319, 0.12]], 'square', 0.035),
  };
})();
