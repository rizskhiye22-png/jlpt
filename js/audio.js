/* =========================================================
   SUARA
   - Pengucapan bahasa Jepang: Text-to-Speech bawaan browser (gratis, tanpa file)
   - Efek suara 8-bit: dibuat langsung dengan Web Audio
   ========================================================= */
const Sound = (() => {
  const hasTTS = 'speechSynthesis' in window;
  let voice = null, ctx = null;

  function pickVoice() {
    if (!hasTTS) return;
    const vs = speechSynthesis.getVoices();
    voice = vs.find(v => /^ja[-_]JP/i.test(v.lang)) || vs.find(v => /^ja/i.test(v.lang)) || null;
  }
  if (hasTTS) { pickVoice(); speechSynthesis.addEventListener && speechSynthesis.addEventListener('voiceschanged', pickVoice); }

  const settings = () => (window.Save ? Save.d.settings : { voice: true, sfx: true, rate: 0.85 });

  // Apakah suara bahasa Jepang tersedia di perangkat ini?
  function hasJa() { return hasTTS && !!voice; }

  function clean(t) { return String(t).replace(/[〜~]/g, '').replace(/\s+/g, ' ').trim(); }

  // Mengucapkan teks Jepang. Mengembalikan Promise yang selesai saat suara berhenti.
  function speak(text) {
    if (!hasTTS || !text) return Promise.resolve();
    return new Promise(res => {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(clean(text));
        u.lang = 'ja-JP'; if (voice) u.voice = voice;
        u.rate = settings().rate || 0.85;
        let done = false; const end = () => { if (!done) { done = true; res(); } };
        u.onend = end; u.onerror = end; setTimeout(end, 4000);
        speechSynthesis.speak(u);
      } catch (e) { res(); }
    });
  }
  function stop() { try { hasTTS && speechSynthesis.cancel(); } catch (e) {} }

  // Harus dipanggil dari ketukan pertama pengguna (aturan browser HP)
  function unlock() {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) {}
    if (hasTTS) { try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; speechSynthesis.speak(u); } catch (e) {} pickVoice(); }
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
    speak, stop, unlock, hasJa,
    blip:  () => notes([[880, 0.03]], 'square', 0.025),
    ok:    () => notes([[784, 0.08], [1175, 0.14]]),
    bad:   () => notes([[220, 0.12], [185, 0.18]], 'triangle', 0.08),
    bump:  () => notes([[110, 0.06]], 'triangle', 0.06),
    door:  () => notes([[392, 0.06], [523, 0.08]], 'square', 0.03),
    star:  () => notes([[523, 0.09], [659, 0.09], [784, 0.09], [1047, 0.2]]),
    heart: () => notes([[988, 0.07], [1319, 0.12]], 'square', 0.035),
  };
})();
