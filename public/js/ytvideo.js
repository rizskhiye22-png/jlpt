/* =========================================================
   VIDEO SENSEI ASLI (YouTube)
   Video pelajaran memakai video YouTube guru sungguhan. Satu video
   berisi semua huruf, jadi setiap hari hanya diputar bagian baris
   yang sedang dipelajari (hari あいうえお → bagian あ い う え お saja).
   - Waktu tiap baris diambil dari SEG di bawah. Kalau belum diisi,
     dipakai posisi perkiraan (dihitung dari panjang video).
   - Pemain bisa menandai sendiri waktu yang pas (⚙ Atur waktu);
     tersimpan di HP, dan bisa disalin sebagai kode untuk mengisi SEG.
   - Offline / YouTube gagal dimuat → kembali ke video animasi.
   ========================================================= */
const YTSensei = (() => {
  const VIDEOS = {
    hira: { id: 'icK6kVTegDA', title: 'Video Sensei: Hiragana' },
    kata: { id: '5lC9rhjrHxU', title: 'Video Sensei: Katakana ("Kana Card", WaGoMu #JapaneseClass)' },
  };
  // Bagian video, urut sesuai waktu tayang: [kunci, huruf yang dibahas].
  // Kunci khusus: ゛ tenten · ゜ maru · ゃ yōon (huruf + ゃゅょ kecil) · っ tsu kecil · ー bunyi panjang
  const ROWS = {
    hira: [['゛', 'がぎぐげござじずぜぞだぢづでどばびぶべぼ'], ['゜', 'ぱぴぷぺぽ'], ['ゃ', ''], ['っ', 'っッ'], ['ー', 'ー'],
      ['あ', 'あいうえお'], ['か', 'かきくけこ'], ['さ', 'さしすせそ'], ['た', 'たちつてと'], ['な', 'なにぬねの'], ['は', 'はひふへほ'], ['ま', 'まみむめも'], ['や', 'やゆよ'], ['ら', 'らりるれろ'], ['わ', 'わをん']],
    kata: [['゛', 'ガギグゲゴザジズゼゾダヂヅデドバビブベボ'], ['゜', 'パピプペポ'], ['ゃ', ''],
      ['ア', 'アイウエオ'], ['カ', 'カキクケコ'], ['サ', 'サシスセソ'], ['タ', 'タチツテト'], ['ナ', 'ナニヌネノ'], ['ハ', 'ハヒフヘホ'], ['マ', 'マミムメモ'], ['ヤ', 'ヤユヨ'], ['ラ', 'ラリルレロ'], ['ワ', 'ワヲン']],
  };
  const LABEL = { '゛': 'Tenten ゛', '゜': 'Maru ゜', 'ゃ': 'Yōon ゃゅょ', 'っ': 'っ kecil', 'ー': 'Bunyi panjang' };
  // Waktu tiap bagian dalam detik: [mulai, selesai].
  // Baris huruf: dari awal baris (penjelasan tiap huruf) sampai akhir latihan baca.
  // Sumber: peta waktu video J-Class (huruf ±2 detik, awal baris & aturan tambahan ±5–10 detik).
  const SEG = {
    hira: {
      '゛': [358, 382], '゜': [378, 397], 'ゃ': [393, 422], 'っ': [418, 447], 'ー': [443, 475],
      'あ': [475, 635], 'か': [640, 827], 'さ': [835, 1016], 'た': [1020, 1190], 'な': [1195, 1382],
      'は': [1385, 1559], 'ま': [1560, 1726], 'や': [1730, 1860], 'ら': [1863, 2031], 'わ': [2035, 2190],
    },
    kata: {
      '゛': [98, 162], '゜': [158, 182], 'ゃ': [178, 212],
      'ア': [300, 477], 'カ': [480, 685], 'サ': [690, 901], 'タ': [902, 1119], 'ナ': [1120, 1358],
      'ハ': [1360, 1596], 'マ': [1600, 1841], 'ヤ': [1842, 2017], 'ラ': [2020, 2241], 'ワ': [2242, 2420],
    },
  };
  // Huruf k dibahas di bagian row?
  const YOON = /[ゃゅょャュョ]/;
  const inRow = (k, [key, chars]) => (key === 'ゃ' ? YOON.test(k) && k.length > 1 : k.length === 1 && chars.includes(k));

  const S = () => Save.d;
  const user = () => (S().ytSeg = S().ytSeg || { hira: {}, kata: {} });
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;

  // Baris-baris video yang memuat huruf pelajaran ini
  function rowsFor(kana) {
    for (const kind of ['hira', 'kata']) {
      const rows = ROWS[kind].filter(r => kana.some(k => inRow(k, r)));
      if (rows.length) return { kind, rows: rows.map(r => r[0]) };
    }
    return null;
  }
  const available = kana => !!(kana && kana.length && rowsFor(kana));

  // Perkiraan posisi baris: video dibagi rata per huruf, dengan pembuka & penutup
  function estimate(kind, key, dur) {
    const all = ROWS[kind].filter(([k]) => !LABEL[k]), total = all.reduce((a, [, c]) => a + c.length, 0);
    const pad = Math.min(30, dur * .04), body = dur - pad * 2;
    let cum = 0;
    for (const [k, c] of all) { if (k === key) return [Math.max(0, pad + body * cum / total - 2), pad + body * (cum + c.length) / total]; cum += c.length; }
    return [0, dur];
  }
  function segOf(kind, key, dur) {
    const u = user()[kind][key], b = SEG[kind][key];
    if (u) return { t: u, src: 'user' };
    if (b) return { t: b, src: 'set' };
    return { t: estimate(kind, key, dur), src: 'est' };
  }

  /* ---------- memuat YouTube IFrame API ---------- */
  let apiP = null;
  function loadApi() {
    if (window.YT && YT.Player) return Promise.resolve();
    if (apiP) return apiP;
    apiP = new Promise((res, rej) => {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => { if (prev) try { prev(); } catch (e) {} res(); };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api'; s.async = true;
      s.onerror = () => { apiP = null; rej(new Error('yt')); };
      document.head.appendChild(s);
      setTimeout(() => rej(new Error('timeout')), 10000);
    });
    return apiP;
  }

  /* ---------- pemutar ---------- */
  // Hasil: 'done' (selesai menonton) · 'anim' (pilih video animasi)
  function play(opts) {
    const info = rowsFor(opts.kana || []);
    const V = VIDEOS[info.kind];
    const label = info.rows.map(k => LABEL[k] || ROWS[info.kind].find(r => r[0] === k)[1].split('').join(' ')).join(' · ');
    if (window.Music) Music.duck(true);
    Sound.stop();
    const p = UI.panel(`
      <div class="video yt">
        <div class="v-top"><span class="v-rec">▶ YouTube</span><span class="v-title">${esc(opts.title || V.title)}</span></div>
        <div class="yt-frame"><div class="yt-slot"></div><div class="yt-load">Memuat video sensei…</div></div>
        <div class="yt-info"><b class="jp">${esc(label)}</b><small class="yt-src"></small></div>
        <div class="v-ctrl">
          <button class="vb txt" data-a="replay" type="button">↺ Ulang bagian</button>
          <button class="vb txt" data-a="anim" type="button">🎨 Video animasi</button>
          <button class="vb txt skip" data-a="done" type="button">Selesai ▶</button>
        </div>
        <button class="yt-cal-t" data-a="cal" type="button">⚙ Atur waktu bagian ini</button>
        <div class="yt-cal" hidden></div>
      </div>`, 'videop');
    const load = p.querySelector('.yt-load'), src = p.querySelector('.yt-src'), cal = p.querySelector('.yt-cal');
    let player = null, seg = [0, 0], alive = true;

    const range = () => {
      const dur = player && player.getDuration ? player.getDuration() || 0 : 0;
      const a = segOf(info.kind, info.rows[0], dur), b = segOf(info.kind, info.rows[info.rows.length - 1], dur);
      seg = [a.t[0], b.t[1]];
      const srcs = new Set([a.src, b.src]);
      src.textContent = `Bagian ${mmss(seg[0])}–${mmss(seg[1])}` + (srcs.has('est') ? ' · posisi perkiraan, ketuk ⚙ kalau kurang pas' : srcs.has('user') ? ' · waktu tandaanmu' : '');
      return seg;
    };
    const cue = (auto) => {
      const [s, e] = range();
      const o = { videoId: V.id, startSeconds: Math.floor(s), endSeconds: Math.ceil(e) };
      if (auto) player.loadVideoById(o); else player.cueVideoById(o);
    };
    const renderCal = () => {
      const u = user()[info.kind];
      cal.innerHTML = `<p class="small muted">Putar video, lalu ketuk tombol tepat saat bagian baris dimulai / selesai.</p>` +
        info.rows.map(k => {
          const dur = player && player.getDuration ? player.getDuration() || 0 : 0, sg = segOf(info.kind, k, dur);
          return `<div class="yt-row"><b class="jp">${k}</b>
            <button class="btn ghost small" data-set="${k}" data-i="0" type="button">⏱ Mulai ${mmss(sg.t[0])}</button>
            <button class="btn ghost small" data-set="${k}" data-i="1" type="button">⏱ Selesai ${mmss(sg.t[1])}</button>
            ${u[k] ? `<button class="btn ghost small" data-reset="${k}" type="button">↺</button>` : ''}</div>`;
        }).join('') +
        `<button class="btn ghost small" data-a="copy" type="button">📋 Salin kode waktu</button>`;
      cal.querySelectorAll('[data-set]').forEach(b => b.onclick = () => {
        if (!player || !player.getCurrentTime) return;
        const k = b.dataset.set, i = +b.dataset.i, dur = player.getDuration() || 0;
        const cur = (user()[info.kind][k] || segOf(info.kind, k, dur).t).slice();
        cur[i] = Math.round(player.getCurrentTime());
        if (cur[1] <= cur[0]) cur[1 - i] = i ? Math.max(0, cur[1] - 5) : cur[0] + 60;
        user()[info.kind][k] = cur; Save.write(); Sound.blip();
        UI.toast(`${k}: ${i ? 'selesai' : 'mulai'} = ${mmss(cur[i])}`);
        range(); renderCal();
      });
      cal.querySelectorAll('[data-reset]').forEach(b => b.onclick = () => { delete user()[info.kind][b.dataset.reset]; Save.write(); range(); renderCal(); });
      cal.querySelector('[data-a=copy]').onclick = async () => {
        const code = JSON.stringify(user());
        try { await navigator.clipboard.writeText(code); UI.toast('Kode waktu disalin. Kirimkan ke pengembang.'); }
        catch (e) { prompt('Salin kode ini:', code); }
      };
    };

    loadApi().then(() => {
      if (!alive) return;
      player = new YT.Player(p.querySelector('.yt-slot'), {
        videoId: V.id, width: '100%', height: '100%',
        host: 'https://www.youtube-nocookie.com',
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1, hl: 'id' },
        events: {
          onReady: () => { load.remove(); cue(false); if (!cal.hidden) renderCal(); },
          onStateChange: e => { if (e.data === 0) { p.querySelector('[data-a=done]').classList.add('pulse'); UI.toast('Bagian ini selesai. Tekan Selesai ▶ untuk lanjut menulis.'); } },
          onError: () => { load.textContent = 'Video tidak bisa diputar di sini. Pakai video animasi, ya.'; },
        },
      });
    }).catch(() => { load.textContent = 'Tidak ada internet / YouTube tidak bisa dimuat. Pakai video animasi, ya.'; });

    return UI.wait(done => {
      const end = r => { alive = false; try { player && player.destroy(); } catch (e) {} if (window.Music) Music.duck(false); UI.closePanel(); done(r); };
      p.querySelector('[data-a=replay]').onclick = () => { if (player && player.loadVideoById) cue(true); };
      p.querySelector('[data-a=anim]').onclick = () => { Sound.blip(); end('anim'); };
      p.querySelector('[data-a=done]').onclick = () => { Sound.blip(); end('done'); };
      p.querySelector('[data-a=cal]').onclick = () => { cal.hidden = !cal.hidden; if (!cal.hidden) renderCal(); };
    });
  }

  return { available, play, rowsFor, VIDEOS, ROWS, SEG };
})();
