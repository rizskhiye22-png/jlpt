/* =========================================================
   ANTARMUKA: kotak dialog + potret, pilihan jawaban, panel,
   notifikasi, dan layar transisi.
   ========================================================= */
const UI = (() => {
  let els = {};
  let advanceFn = null;      // dipanggil saat pemain menekan A / mengetuk dialog
  let choice = null;         // { index, count, pick(i) } saat menu pilihan terbuka
  const pending = new Set();

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = s => String(s == null ? '' : s).replace(/\{name\}/g, esc(Save.d.name || 'Kamu'));
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function init() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="screen">
        <canvas id="game" aria-label="Layar game"></canvas>
        <div class="tapcatch"></div>
        <div class="hud">
          <button class="hud-obj" type="button"><span class="pin">▶</span><span class="obj-text"></span></button>
          <div class="hud-day"></div>
        </div>
        <div class="dlg-area">
          <div class="choices" role="listbox"></div>
          <div class="dialog hide" role="dialog" aria-live="polite"></div>
        </div>
      </div>
      <div class="pad">
        <div class="dpad">
          <button class="d up" data-dir="up" aria-label="Atas"></button>
          <button class="d left" data-dir="left" aria-label="Kiri"></button>
          <span class="d mid"></span>
          <button class="d right" data-dir="right" aria-label="Kanan"></button>
          <button class="d down" data-dir="down" aria-label="Bawah"></button>
        </div>
        <div class="pad-mid">
          <button class="pill" data-btn="menu">MENU</button>
          <div class="pad-hint">Ketuk layar untuk berjalan</div>
        </div>
        <div class="ab">
          <button class="round b" data-btn="b" aria-label="Tombol B (batal / menu)">B</button>
          <button class="round a" data-btn="a" aria-label="Tombol A (bicara / pilih)">A</button>
        </div>
      </div>
      <div class="layer panels"></div>
      <div class="layer modals"></div>
      <div class="toast"></div>
      <div class="fade"></div>`;
    els = {
      app, screen: app.querySelector('.screen'), canvas: app.querySelector('#game'),
      tap: app.querySelector('.tapcatch'), hud: app.querySelector('.hud'),
      obj: app.querySelector('.hud-obj'), objText: app.querySelector('.obj-text'), day: app.querySelector('.hud-day'),
      choices: app.querySelector('.choices'), dialog: app.querySelector('.dialog'),
      panels: app.querySelector('.panels'), modals: app.querySelector('.modals'),
      toast: app.querySelector('.toast'), fade: app.querySelector('.fade'), pad: app.querySelector('.pad'),
    };
    els.dialog.addEventListener('click', e => { if (e.target.closest('button')) return; advance(); });
    els.tap.addEventListener('click', () => advance());
  }

  // Menunggu aksi pemain; bisa dibatalkan (misal saat keluar ke judul)
  function wait(setup) {
    return new Promise((resolve, reject) => {
      const entry = { reject };
      pending.add(entry);
      setup(v => { if (!pending.has(entry)) return; pending.delete(entry); resolve(v); });
    });
  }
  function abortAll() {
    const list = [...pending]; pending.clear();
    advanceFn = null; choice = null;
    list.forEach(p => p.reject({ abort: true }));
  }

  /* ---------- kotak dialog ---------- */
  function setBusy(on) { els.tap.classList.toggle('on', on); }

  function say(line) {
    const who = line.w ? CHARACTERS[line.w] : null;
    let face = '';
    if (who) face = `<div class="dlg-face"><canvas width="32" height="32"></canvas></div>`;
    let body = '';
    if (who) body += `<div class="dlg-name" style="--c:${who.color}">${who.name}</div>`;
    if (line.jp) {
      body += `<div class="dlg-jp"><span>${fmt(line.jp)}</span><button class="voice" type="button" aria-label="Dengarkan">♪</button></div>`;
      if (Save.d.settings.romaji && line.ro) body += `<div class="dlg-ro">${fmt(line.ro)}</div>`;
      if (line.id) body += `<div class="dlg-id">${fmt(line.id)}</div>`;
    }
    if (line.t) body += `<div class="dlg-t">${fmt(line.t)}</div>`;
    if (line.n) body += `<div class="dlg-n">${fmt(line.n)}</div>`;
    els.dialog.className = 'dialog' + (who ? ' has-face' : '');
    els.dialog.innerHTML = `${face}<div class="dlg-body">${body}</div><div class="dlg-next">▼</div>`;
    els.choices.innerHTML = '';
    if (who) Pix.drawPortrait(els.dialog.querySelector('.dlg-face canvas'), line.w, line.e || 'normal');
    if (line.jp) {
      const txt = fmt(line.jp).replace(/&amp;/g, '&');
      els.dialog.querySelector('.voice').onclick = e => { e.stopPropagation(); Sound.speak(txt); };
      if (Save.d.settings.voice) Sound.speak(txt);
    }
    setBusy(true);
    const shown = Date.now();
    return wait(done => {
      advanceFn = () => { if (Date.now() - shown < 220) return; advanceFn = null; Sound.blip(); done(); };
    });
  }

  function choose(prompt, options) {
    els.dialog.className = 'dialog';
    els.dialog.innerHTML = `<div class="dlg-body"><div class="dlg-name you" style="--c:#6b5a9a">${esc(Save.d.name || 'Kamu')}</div><div class="dlg-t">${fmt(prompt)}</div></div>`;
    const romaji = Save.d.settings.romaji;
    els.choices.innerHTML = options.map((o, i) =>
      `<button class="choice" type="button" data-i="${i}"><span class="cur">▶</span><span class="c-txt"><span class="c-jp">${o.jp}</span>${romaji && o.ro ? `<span class="c-ro">${o.ro}</span>` : ''}</span></button>`).join('');
    setBusy(true);
    advanceFn = null;
    return wait(done => {
      const btns = [...els.choices.querySelectorAll('.choice')];
      const pick = i => { choice = null; els.choices.innerHTML = ''; Sound.blip(); done(i); };
      const mark = i => { btns.forEach((b, j) => b.classList.toggle('sel', j === i)); choice.index = i; };
      choice = { index: 0, count: options.length, pick, mark };
      mark(0);
      btns.forEach((b, i) => b.onclick = () => pick(i));
    });
  }

  function hideDialog() {
    els.dialog.className = 'dialog hide'; els.dialog.innerHTML = ''; els.choices.innerHTML = '';
    advanceFn = null; choice = null; setBusy(false);
  }

  // Input dari tombol A / keyboard
  function advance() { if (advanceFn) { advanceFn(); return true; } return false; }
  function input(btn) {
    if (choice) {
      if (btn === 'up') { choice.mark((choice.index + choice.count - 1) % choice.count); Sound.blip(); return true; }
      if (btn === 'down') { choice.mark((choice.index + 1) % choice.count); Sound.blip(); return true; }
      if (btn === 'a') { choice.pick(choice.index); return true; }
      if (/^[1-4]$/.test(btn) && +btn <= choice.count) { choice.pick(+btn - 1); return true; }
      return true;
    }
    if (advanceFn) { if (btn === 'a' || btn === 'b') advance(); return true; }
    return false;
  }
  const dialogOpen = () => !!(advanceFn || choice);

  /* ---------- panel (pelajaran, menu, dsb.) ---------- */
  function panel(html, cls = '') {
    els.panels.innerHTML = `<div class="panel ${cls}">${html}</div>`;
    els.panels.classList.add('on');
    return els.panels.firstElementChild;
  }
  function closePanel() { els.panels.innerHTML = ''; els.panels.classList.remove('on'); }
  const panelOpen = () => els.panels.classList.contains('on');

  function modal(html, cls = '') {
    els.modals.innerHTML = `<div class="modal-bg"></div><div class="modal ${cls}">${html}</div>`;
    els.modals.classList.add('on');
    return els.modals.querySelector('.modal');
  }
  function closeModal() { els.modals.innerHTML = ''; els.modals.classList.remove('on'); }
  const modalOpen = () => els.modals.classList.contains('on');

  let toastTimer;
  function toast(msg) {
    els.toast.innerHTML = msg; els.toast.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => els.toast.classList.remove('on'), 1800);
  }

  // Layar hitam sebentar (pindah tempat / ganti hari)
  async function fade(fn, ms = 220) {
    els.fade.classList.add('on'); await sleep(ms);
    if (fn) await fn();
    els.fade.classList.remove('on'); await sleep(ms);
  }

  // Kartu judul besar, contoh: "Hari 2 — Baris KA"
  function timecard(title, sub) {
    const p = modal(`<div class="timecard"><div class="tc-title">${title}</div><div class="tc-sub">${sub || ''}</div><div class="tc-hint">ketuk untuk lanjut</div></div>`, 'bare');
    Sound.star();
    return wait(done => {
      const close = () => { closeModal(); advanceFn = null; done(); };
      const t = setTimeout(close, 2200);
      advanceFn = () => { clearTimeout(t); close(); };
      p.parentElement.onclick = () => { clearTimeout(t); close(); };
    });
  }

  function setObjective(text, onTap) {
    els.objText.textContent = text || '';
    els.obj.style.display = text ? '' : 'none';
    els.obj.onclick = onTap || null;
  }
  function setDay(text) { els.day.textContent = text || ''; }
  function showGame(on) { els.app.classList.toggle('in-game', on); }

  return {
    init, wait, abortAll, sleep, esc, fmt,
    say, choose, hideDialog, advance, input, dialogOpen,
    panel, closePanel, panelOpen, modal, closeModal, modalOpen,
    toast, fade, timecard, setObjective, setDay, showGame,
    get els() { return els; },
  };
})();
