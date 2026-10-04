/* =========================================================
   CHAT SEMUA PEMAIN (tanpa backend sendiri)
   Pesan dikirim lewat broker MQTT publik gratis (WebSocket) langsung
   dari browser, jadi tidak perlu server game. Semua pemain yang
   online berlangganan topik yang sama dan menerima pesan seketika.
   - Kanal 🌏 Semua & 📍 Di sini (pemain di peta yang sama)
   - Frasa Jepang siap kirim (latihan), jumlah pemain aktif
   - Keamanan: filter kata kasar, link/nomor HP/email disembunyikan,
     batas 120 huruf, jeda kirim, bisukan pemain (tersimpan di HP)
   Catatan: broker publik tidak terenkripsi end-to-end dan bisa dibaca
   siapa saja, jadi jangan kirim data pribadi.
   Riwayat (log) tidak hilang:
   - disimpan di HP (localStorage terpisah dari data game), jadi tetap
     ada walau halaman dimuat ulang, aplikasi ditutup, atau game di-reset
   - salinan riwayat bersama disimpan di broker sebagai pesan "retained"
     (topik /log). Pemain yang baru masuk langsung melihat pesan lama
     walaupun saat itu tidak ada pemain lain yang online.
   ========================================================= */
const Chat = (() => {
  const BROKERS = ['wss://broker.emqx.io:8084/mqtt', 'wss://broker.hivemq.com:8884/mqtt'];
  const ROOT = 'nihongo-gakkou/jlpt/v1';
  const T_CHAT = ROOT + '/chat', T_HERE = ROOT + '/here', T_PRES = ROOT + '/presence', T_LOG = ROOT + '/log';
  const MAX = 120, GAP = 2500, KEEP = 200, SHARE = 80, LOG_KEY = 'nihongo-gakkou-chatlog';
  const S = () => Save.d;
  const set = () => S().settings;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  // id pemain disimpan juga di luar data game supaya pesan sendiri tetap dikenali setelah reset
  const myId = () => {
    if (!S().chatId) { try { S().chatId = localStorage.getItem('nihongo-gakkou-chatid') || ''; } catch (e) {} }
    if (!S().chatId) S().chatId = 'p' + Math.random().toString(36).slice(2, 10);
    try { localStorage.setItem('nihongo-gakkou-chatid', S().chatId); } catch (e) {}
    return S().chatId;
  };
  const muted = () => (S().chatMuted = S().chatMuted || []);

  /* ---------- penyaring ---------- */
  const BAD = ['anjing', 'anjg', 'bangsat', 'bangsad', 'babi', 'kontol', 'kntl', 'memek', 'mmk', 'ngentot', 'ngntt', 'entot', 'goblok', 'goblog', 'tolol', 'bego', 'kampret', 'asu', 'jancok', 'jancuk', 'cok', 'bajingan', 'keparat', 'brengsek', 'tai', 'taik', 'pepek', 'jembut', 'lonte', 'pelacur', 'sinting',
    'fuck', 'fck', 'shit', 'bitch', 'bastard', 'dick', 'pussy', 'asshole', 'cunt', 'nigger', 'nigga', 'porn', 'sex', 'seks', 'bokep',
    'ばか', 'バカ', 'あほ', 'アホ', 'しね', '死ね', 'くそ', 'クソ'];
  const norm = s => s.toLowerCase().replace(/[0@]/g, 'o').replace(/[1!|]/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/[5$]/g, 's').replace(/7/g, 't');
  function clean(text) {
    let t = String(text || '').replace(/[\u0000-\u001f​-‏‪-‮]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX);
    t = t.replace(/(https?:\/\/|www\.)\S+|\b\S+\.(com|net|org|id|io|me|xyz|ly|gg|link)\b\S*/gi, '[link disembunyikan]');
    t = t.replace(/\S+@\S+\.\S+/g, '[email disembunyikan]');
    t = t.replace(/(\+?\d[\d\s.-]{7,}\d)/g, '[nomor disembunyikan]');
    t = t.replace(/(@\w{3,})/g, '[akun disembunyikan]');
    t = t.split(/(\s+)/).map(w => { const n = norm(w).replace(/[^a-z぀-ヿ一-鿿]/g, ''); return n && BAD.some(b => n === b || (b.length > 3 && n.includes(b))) ? '*'.repeat(Math.min(6, w.length)) : w; }).join('');
    BAD.filter(b => /[぀-ヿ一-鿿]/.test(b)).forEach(b => { t = t.split(b).join('＊＊'); });
    return t;
  }
  const cleanName = n => clean(String(n || 'Pemain').slice(0, 12)).replace(/\[.*?\]/g, '…') || 'Pemain';

  /* ---------- klien MQTT 3.1.1 kecil (WebSocket) ---------- */
  function mqtt(url, cid, h) {
    const enc = new TextEncoder(), dec = new TextDecoder();
    const str = s => { const b = enc.encode(s); return [b.length >> 8, b.length & 255, ...b]; };
    const rem = n => { const o = []; do { let d = n % 128; n = Math.floor(n / 128); if (n > 0) d |= 128; o.push(d); } while (n > 0); return o; };
    const pkt = (type, body) => new Uint8Array([type, ...rem(body.length), ...body]);
    let ws, pid = 1, ping = 0, up = false;
    try { ws = new WebSocket(url, 'mqtt'); } catch (e) { setTimeout(() => h.close(false), 0); return { pub() {}, close() {} }; }
    ws.binaryType = 'arraybuffer';
    ws.onopen = () => ws.send(pkt(0x10, [...str('MQTT'), 4, 0x02, 0, 60, ...str(cid)]));
    ws.onmessage = e => {
      const b = new Uint8Array(e.data); let i = 0;
      while (i < b.length) {
        const type = b[i] >> 4, flags = b[i] & 15; let mul = 1, len = 0, j = i + 1, d;
        do { d = b[j++]; len += (d & 127) * mul; mul *= 128; } while (d & 128 && j < b.length);
        const body = b.subarray(j, j + len); i = j + len;
        if (type === 2) { if (body[1] === 0) { up = true; h.topics.forEach(t => { ws.send(pkt(0x82, [pid >> 8, pid & 255, ...str(t), 0])); pid = pid % 65000 + 1; }); ping = setInterval(() => { try { ws.send(new Uint8Array([0xc0, 0])); } catch (er) {} }, 30000); h.open(); } else ws.close(); }
        else if (type === 3) {
          const tl = (body[0] << 8) | body[1], topic = dec.decode(body.subarray(2, 2 + tl)), qos = (flags >> 1) & 3;
          const payload = dec.decode(body.subarray(2 + tl + (qos ? 2 : 0)));
          try { h.msg(topic, payload); } catch (er) {}
        }
      }
    };
    ws.onclose = () => { clearInterval(ping); h.close(up); up = false; };
    ws.onerror = () => {};
    return {
      pub(topic, s, retain) { if (up && ws.readyState === 1) ws.send(pkt(retain ? 0x31 : 0x30, [...str(topic), ...enc.encode(s)])); },
      close() { up = false; clearInterval(ping); try { ws.send(new Uint8Array([0xe0, 0])); ws.close(); } catch (e) {} },
      get up() { return up; },
    };
  }

  /* ---------- koneksi ---------- */
  let cli = null, status = 'off', bi = 0, retry = 0, retryT = 0, presT = 0, lastSent = 0, unread = 0, open = false, tab = 'all';
  const msgs = [], seen = new Map();   // id → { n, m, at }
  const listeners = new Set();
  const brokers = () => (set().chatBroker ? [set().chatBroker] : BROKERS);
  function setStatus(s) { status = s; refresh(); }
  function connect() {
    if (cli || set().chat === false) return;
    const url = brokers()[bi % brokers().length];
    setStatus('connecting');
    cli = mqtt(url, 'ngk_' + myId() + '_' + Math.random().toString(36).slice(2, 6), {
      topics: [T_CHAT, T_HERE, T_PRES, T_LOG],
      open() { retry = 0; setStatus('on'); presence(); clearInterval(presT); presT = setInterval(presence, 45000); },
      msg: onMsg,
      close(wasUp) {
        cli = null; clearInterval(presT);
        if (set().chat === false) return setStatus('off');
        if (!wasUp) bi++;                       // broker ini gagal → coba broker berikutnya
        setStatus('connecting');
        clearTimeout(retryT); retryT = setTimeout(connect, Math.min(30000, 1500 * 2 ** Math.min(retry++, 4)));
      },
    });
  }
  function disconnect() { clearTimeout(retryT); clearInterval(presT); if (cli) { const c = cli; cli = null; c.close(); } setStatus('off'); }
  const where = () => (window.World && World.map) || 'town';
  function presence() { if (cli) cli.pub(T_PRES, JSON.stringify({ v: 1, id: myId(), n: cleanName(S().name), m: where() })); }
  function active() { const now = Date.now(); let n = 0; seen.forEach(s => { if (now - s.at < 120000) n++; }); return n; }

  /* ---------- riwayat (log) ---------- */
  // Satu pesan: { k (kunci unik), id, n, t, map, ch, at }
  function entry(d, ch) {
    if (!d || typeof d.id !== 'string' || d.id.length > 20 || typeof d.t !== 'string' || !d.t.trim()) return null;
    const at = Math.min(Number(d.ts || d.at) || Date.now(), Date.now() + 60000);
    const t = clean(d.t); if (!t) return null;
    return { k: String(d.k || d.id + '-' + at).slice(0, 40), id: d.id, n: cleanName(d.n), t, map: String(d.m || d.map || '').slice(0, 20), ch: (ch || d.ch) === 'here' ? 'here' : 'all', at };
  }
  let saveT = 0;
  const persist = () => { clearTimeout(saveT); saveT = setTimeout(() => { try { localStorage.setItem(LOG_KEY, JSON.stringify(msgs.map(({ me, ...m }) => m))); } catch (e) {} }, 300); };
  // Tambah pesan (tanpa dobel), urut waktu, simpan. true = pesan baru.
  function add(m) {
    if (!m || msgs.some(x => x.k === m.k)) return false;
    m.me = m.id === myId();
    let i = msgs.length; while (i > 0 && msgs[i - 1].at > m.at) i--;
    msgs.splice(i, 0, m);
    if (msgs.length > KEEP) msgs.splice(0, msgs.length - KEEP);
    persist(); return true;
  }
  function loadLog() {
    try { const l = JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); if (Array.isArray(l)) l.forEach(x => add(entry(x))); } catch (e) {}
  }
  // Salinan riwayat bersama di broker (retained): ditulis pengirim setiap kirim pesan
  function share() {
    if (!cli) return;
    const l = msgs.slice(-SHARE).map(m => ({ k: m.k, id: m.id, n: m.n, t: m.t, m: m.map, ch: m.ch, ts: m.at }));
    cli.pub(T_LOG, JSON.stringify({ v: 1, l }), true);
  }

  function onMsg(topic, raw) {
    let d; try { d = JSON.parse(raw); } catch (e) { return; }
    if (topic === T_LOG) {
      if (!d || d.v !== 1 || !Array.isArray(d.l)) return;
      let n = 0; d.l.slice(-SHARE).forEach(x => { if (add(entry(x))) n++; });
      if (n) refresh();
      return;
    }
    if (!d || d.v !== 1 || typeof d.id !== 'string' || d.id.length > 20) return;
    seen.set(d.id, { n: cleanName(d.n), m: String(d.m || '').slice(0, 20), at: Date.now() });
    if (topic === T_PRES) return refresh();
    if (typeof d.t !== 'string' || !d.t.trim()) return;
    if (!d.k) d.ts = Date.now();                // pesan versi lama tanpa kunci/waktu
    const m = entry(d, topic === T_HERE ? 'here' : 'all');
    if (!m || !add(m)) return;
    if (!m.me && !muted().includes(m.id) && (m.ch === 'all' || m.map === where()) && !open) { unread++; UI.toast(`💬 <b>${esc(m.n)}</b>: ${esc(m.t.slice(0, 40))}`); }
    refresh();
  }

  function send(text, ch = tab) {
    const t = clean(text);
    if (!t) return 'empty';
    if (Date.now() - lastSent < GAP) return 'slow';
    if (!cli || !cli.up) return 'off';
    lastSent = Date.now();
    const d = { v: 1, k: myId() + '-' + lastSent.toString(36), ts: lastSent, id: myId(), n: cleanName(S().name), m: where(), t };
    cli.pub(ch === 'here' ? T_HERE : T_CHAT, JSON.stringify(d));
    add(entry(d, ch)); share(); refresh();
    return 'ok';
  }

  /* ---------- tampilan ---------- */
  const QUICK = [['こんにちは！', 'Halo!'], ['よろしく ね！', 'Salam kenal!'], ['いっしょに べんきょう しよう！', 'Ayo belajar bareng!'], ['どこ に いる？', 'Kamu di mana?'], ['がんばって！', 'Semangat!'], ['ありがとう！', 'Terima kasih!'], ['すごい！', 'Keren!'], ['また ね！', 'Sampai jumpa!']];
  const PLACE = { home: 'Rumah', town: 'Kota Sakura', class: 'Kelas', roof: 'Atap sekolah', library: 'Perpustakaan', club: 'Ruang klub', konbini: 'Konbini', eki: 'Stasiun', umi: 'Pantai' };
  const MAPNAME = m => PLACE[m] || (window.MAPS && MAPS[m] && MAPS[m].name) || m;
  function refresh() {
    const hud = document.querySelector('.hud-chat');
    if (hud) { hud.style.display = set().chat === false ? 'none' : ''; hud.querySelector('b').textContent = unread ? unread : status === 'on' ? '●' : '…'; hud.classList.toggle('new', unread > 0); }
    listeners.forEach(f => f());
  }
  const stamp = at => { const d = new Date(at), hm = d.toTimeString().slice(0, 5); return d.toDateString() === new Date().toDateString() ? hm : `${d.getDate()}/${d.getMonth() + 1} ${hm}`; };
  function panel() {
    open = true; unread = 0;
    if (set().chat === false) { set().chat = true; Save.write(); }
    connect();
    const p = UI.panel(`<div class="win chat">
      <div class="w-title">💬 Chat <small class="chat-st muted"></small></div>
      <div class="chat-tabs"><button type="button" data-tab="all">🌏 Semua</button><button type="button" data-tab="here">📍 Di sini</button></div>
      <div class="chat-list" aria-live="polite"></div>
      <div class="chat-quick">${QUICK.map(([jp, id]) => `<button type="button" class="cq" data-t="${esc(jp)}" title="${esc(id)}">${esc(jp)}</button>`).join('')}</div>
      <form class="chat-form"><input type="text" maxlength="${MAX}" placeholder="Tulis pesan… (boleh bahasa Jepang!)" autocomplete="off" enterkeyhint="send"><button class="btn small" type="submit">Kirim</button></form>
      <p class="muted small chat-note">🔒 Jangan bagikan nama asli, alamat, nomor HP, atau akun media sosial. Link & nomor otomatis disembunyikan. Ketuk nama pemain untuk membisukan.</p>
      <button class="btn block ghost" data-a="close" type="button">Tutup</button></div>`, 'scroll');
    const list = p.querySelector('.chat-list'), st = p.querySelector('.chat-st'), inp = p.querySelector('input');
    const render = () => {
      if (!list.isConnected) return;
      p.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
      st.textContent = status === 'on' ? `· ${Math.max(1, active())} pemain aktif` : status === 'connecting' ? '· menghubungkan…' : '· offline';
      const show = msgs.filter(m => m.ch === tab && !muted().includes(m.id) && (tab === 'all' || m.map === where()));
      const atBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 40;
      list.innerHTML = show.length ? show.map(m => `<div class="cm ${m.me ? 'me' : ''}"><button type="button" class="cm-n" data-id="${esc(m.id)}" data-n="${esc(m.n)}">${esc(m.n)}</button><span class="cm-t">${esc(m.t)}</span><small>${stamp(m.at)}${tab === 'all' && m.map ? ' · ' + esc(MAPNAME(m.map)) : ''}</small></div>`).join('')
        : `<p class="muted small chat-empty">${status === 'on' ? (tab === 'here' ? `Belum ada pesan di ${esc(MAPNAME(where()))}.` : 'Belum ada pesan. Sapa pemain lain, yuk!') : 'Menghubungkan ke chat…'}</p>`;
      if (atBottom) list.scrollTop = list.scrollHeight;
      list.querySelectorAll('.cm-n').forEach(b => b.onclick = () => {
        if (b.dataset.id === myId()) return;
        if (confirm(`Bisukan ${b.dataset.n}? Pesannya tidak akan tampil lagi di HP ini.`)) { muted().push(b.dataset.id); Save.write(); UI.toast(`🔇 ${b.dataset.n} dibisukan`); render(); }
      });
    };
    listeners.add(render); render();
    p.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; Sound.blip(); render(); });
    const go = text => {
      const r = send(text);
      if (r === 'ok') { inp.value = ''; Sound.blip(); }
      else if (r === 'slow') UI.toast('Tunggu sebentar sebelum mengirim lagi.');
      else if (r === 'off') UI.toast('Chat belum terhubung. Coba lagi sebentar.');
    };
    p.querySelector('.chat-form').onsubmit = e => { e.preventDefault(); go(inp.value); };
    p.querySelectorAll('.cq').forEach(b => b.onclick = () => go(b.dataset.t));
    return UI.wait(done => {
      p.querySelector('[data-a=close]').onclick = () => { Sound.blip(); listeners.delete(render); open = false; UI.closePanel(); done(); };
    });
  }

  // tombol 💬 di HUD
  function mountHud() {
    const row = document.querySelector('.hud-row');
    if (!row || row.querySelector('.hud-chat')) return;
    const b = document.createElement('button'); b.className = 'hud-mini hud-chat'; b.type = 'button'; b.innerHTML = '🗨️ <b>…</b>'; b.title = 'Chat semua pemain';
    b.onclick = () => { if (typeof Game !== 'undefined' && !Game.busy && !UI.panelOpen()) panel().catch(() => {}); };
    row.insertBefore(b, row.firstChild);
    refresh();
  }
  function start() { loadLog(); mountHud(); if (set().chat !== false) connect(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(start, 0)); else setTimeout(start, 0);

  return { panel, connect, disconnect, send, clean, get status() { return status; }, get messages() { return msgs.slice(); }, _onMsg: onMsg, _mqtt: mqtt };
})();
