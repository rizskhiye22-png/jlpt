/* =========================================================
   ONLINE (opsional)
   Terhubung ke server WebSocket (folder server/) untuk melihat
   pemain lain di kota dan saling menyapa dengan stempel frasa Jepang.
   Tidak ada teks bebas: hanya frasa dari daftar di bawah.
   ========================================================= */
const PHRASES = [
  { jp: 'こんにちは！', ro: 'konnichiwa!', id: 'Halo!' },
  { jp: 'おはよう！', ro: 'ohayou!', id: 'Selamat pagi!' },
  { jp: 'こんばんは！', ro: 'konbanwa!', id: 'Selamat malam!' },
  { jp: 'はじめまして！', ro: 'hajimemashite!', id: 'Senang berkenalan!' },
  { jp: 'よろしく ね！', ro: 'yoroshiku ne!', id: 'Salam kenal!' },
  { jp: 'ありがとう！', ro: 'arigatou!', id: 'Terima kasih!' },
  { jp: 'どういたしまして。', ro: 'dou itashimashite.', id: 'Sama-sama.' },
  { jp: 'ごめんね。', ro: 'gomen ne.', id: 'Maaf, ya.' },
  { jp: 'すごい！', ro: 'sugoi!', id: 'Keren!' },
  { jp: 'かわいい！', ro: 'kawaii!', id: 'Lucu!' },
  { jp: 'がんばって！', ro: 'ganbatte!', id: 'Semangat!' },
  { jp: 'いっしょに べんきょう しよう！', ro: 'issho ni benkyou shiyou!', id: 'Ayo belajar bersama!' },
  { jp: 'いっしょに あそぼう！', ro: 'issho ni asobou!', id: 'Ayo main bersama!' },
  { jp: 'どこ に いく？', ro: 'doko ni iku?', id: 'Mau ke mana?' },
  { jp: 'つり を しよう！', ro: 'tsuri o shiyou!', id: 'Ayo memancing!' },
  { jp: 'おいしい！', ro: 'oishii!', id: 'Enak!' },
  { jp: 'はい！', ro: 'hai!', id: 'Iya!' },
  { jp: 'いいえ。', ro: 'iie.', id: 'Tidak.' },
  { jp: 'わかった！', ro: 'wakatta!', id: 'Mengerti!' },
  { jp: 'わからない…', ro: 'wakaranai…', id: 'Tidak mengerti…' },
  { jp: 'また ね！', ro: 'mata ne!', id: 'Sampai jumpa!' },
  { jp: 'おやすみ！', ro: 'oyasumi!', id: 'Selamat tidur!' },
  { jp: '♥', ro: '', id: '(hati)' },
  { jp: '(＾▽＾)', ro: '', id: '(senyum)' },
];

const Online = (() => {
  let ws = null, myId = null, url = '', status = 'off', retry = 0, retryT = null, lastMove = '';
  const players = new Map();
  const S = () => Save.d.settings;

  function setStatus(s) { status = s; UI.setOnline && UI.setOnline(s === 'on' ? players.size + 1 : 0, s); }
  function pushWorld() {
    const list = [...players.values()].map(p => { Pix.registerLook('o_' + p.id, p.look); return { ...p, sprite: 'o_' + p.id }; });
    World.setOthers && World.setOthers(list);
    UI.setOnline && UI.setOnline(status === 'on' ? players.size + 1 : 0, status);
  }

  function connect(u) {
    disconnect(true);
    url = (u || S().server || '').trim();
    if (!url) return;
    if (!/^wss?:\/\//.test(url)) url = (location.protocol === 'https:' ? 'wss://' : 'ws://') + url;
    setStatus('connecting');
    try { ws = new WebSocket(url); } catch (e) { setStatus('error'); return; }
    ws.onopen = () => {
      retry = 0;
      const p = World.player || {};
      ws.send(JSON.stringify({ t: 'hello', name: Save.d.name, look: Save.d.look, map: World.map || 'town', x: p.x || 0, y: p.y || 0, dir: p.dir || 'down' }));
    };
    ws.onmessage = e => {
      let m; try { m = JSON.parse(e.data); } catch (err) { return; }
      if (m.t === 'welcome') { myId = m.id; players.clear(); m.players.forEach(p => players.set(p.id, p)); setStatus('on'); pushWorld(); UI.toast(`🌐 Online! ${players.size} pemain lain di kota.`); }
      else if (m.t === 'join') { players.set(m.player.id, m.player); pushWorld(); UI.toast(`👋 ${m.player.name} bergabung`); }
      else if (m.t === 'leave') { players.delete(m.id); pushWorld(); }
      else if (m.t === 'move') { const p = players.get(m.id); if (p) { Object.assign(p, m); pushWorld(); } }
      else if (m.t === 'look') { const p = players.get(m.id); if (p) { p.look = m.look; Pix.registerLook('o_' + m.id, m.look); World.refreshLook && World.refreshLook('o_' + m.id + ':'); pushWorld(); } }
      else if (m.t === 'say') { const p = players.get(m.id), ph = PHRASES[m.p]; if (p && ph) { World.sayOther(m.id, ph.jp); if (p.map === World.map) Sound.speak(ph.jp); } }
    };
    ws.onclose = () => {
      const was = status; ws = null; players.clear(); pushWorld();
      if (S().online && url) { setStatus('connecting'); clearTimeout(retryT); retryT = setTimeout(() => connect(url), Math.min(30000, 2000 * 2 ** retry++)); }
      else setStatus(was === 'error' ? 'error' : 'off');
    };
    ws.onerror = () => { setStatus('error'); };
  }
  function disconnect(silent) {
    clearTimeout(retryT);
    if (ws) { ws.onclose = null; try { ws.close(); } catch (e) {} ws = null; }
    players.clear(); if (!silent) { setStatus('off'); pushWorld(); }
  }
  const send = m => { if (ws && ws.readyState === 1) ws.send(JSON.stringify(m)); };

  function moved(map, x, y, dir) {
    const key = `${map}:${x}:${y}:${dir}`; if (key === lastMove) return; lastMove = key;
    send({ t: 'move', map, x, y, dir });
    if (status === 'on') pushWorld();
  }
  function lookChanged() { send({ t: 'look', look: Save.d.look }); }

  function say(i) {
    const ph = PHRASES[i]; if (!ph) return;
    send({ t: 'say', p: i });
    World.sayOther('me', ph.jp); Sound.speak(ph.jp);
    Extras.bump('onlineSay'); Extras.checkAch();
  }

  // Palet stempel frasa
  function palette() {
    const m = UI.modal(`<div class="w-title">Stempel frasa</div>
      <p class="muted">${status === 'on' ? `Kirim sapaan ke ${players.size} pemain lain di dekatmu:` : 'Kamu sedang offline. Frasa hanya diucapkan untuk latihan.'}</p>
      <div class="phrase-grid">${PHRASES.map((p, i) => `<button class="phrase" data-i="${i}" type="button"><b class="jp">${p.jp}</b><small>${p.id}</small></button>`).join('')}</div>
      <button class="btn block" data-a="close" type="button">Tutup</button>`, 'phrases');
    m.querySelectorAll('.phrase').forEach(b => b.onclick = () => { say(+b.dataset.i); UI.closeModal(); });
    m.querySelector('[data-a=close]').onclick = () => UI.closeModal();
  }

  function autoStart() { if (S().online && S().server && World.online) connect(S().server); }

  return { connect, disconnect, moved, say, palette, autoStart, lookChanged, get status() { return status; }, get count() { return players.size; } };
})();
