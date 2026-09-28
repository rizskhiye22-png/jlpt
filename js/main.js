/* =========================================================
   PEMBUKA: menyiapkan layar, tombol, keyboard, lalu layar judul.
   ========================================================= */
(function () {
  UI.init();
  World.init(UI.els.canvas, { interact: Game.interact, warp: Game.warp, blocked: Game.blocked });

  const DIRS = ['up', 'down', 'left', 'right'];

  // Semua tombol (layar sentuh & keyboard) lewat sini
  function press(btn) {
    if (UI.modalOpen()) {
      if (UI.input(btn)) return;
      if ((btn === 'b' || btn === 'menu') && Game._menuClose) Game._menuClose();
      return;
    }
    if (UI.panelOpen()) {
      if (Lesson._keys && Lesson._keys(btn)) return;
      UI.input(btn);
      return;
    }
    if (UI.input(btn)) return;
    if (Game.busy) return;
    if (DIRS.includes(btn)) { Game.cancelAuto(); World.hold(btn); }
    else if (btn === 'a') World.action();
    else if (btn === 'b' || btn === 'menu') Game.menu();
  }
  function release(btn) { if (DIRS.includes(btn)) World.release(btn); }

  // D-pad: tahan untuk terus berjalan
  document.querySelectorAll('.dpad [data-dir]').forEach(b => {
    const dir = b.dataset.dir;
    b.addEventListener('pointerdown', e => { e.preventDefault(); Sound.unlock(); b.classList.add('on'); press(dir); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => { b.classList.remove('on'); release(dir); }));
  });
  document.querySelectorAll('.pad [data-btn]').forEach(b => {
    b.addEventListener('pointerdown', e => { e.preventDefault(); Sound.unlock(); press(b.dataset.btn); });
  });

  const KEYMAP = {
    ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
    w: 'up', s: 'down', a: 'left', d: 'right',
    ' ': 'a', Enter: 'a', z: 'a', x: 'b', Escape: 'b', m: 'menu',
    1: '1', 2: '2', 3: '3', 4: '4',
  };
  document.addEventListener('keydown', e => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (t && t.tagName === 'BUTTON' && (e.key === 'Enter' || e.key === ' ')) return;
    const btn = KEYMAP[e.key] || KEYMAP[e.key.toLowerCase()];
    if (!btn) return;
    e.preventDefault();
    if (e.repeat && !DIRS.includes(btn)) return;
    if (e.repeat) return;
    press(btn);
  });
  document.addEventListener('keyup', e => { const btn = KEYMAP[e.key] || KEYMAP[(e.key || '').toLowerCase()]; if (btn) release(btn); });
  window.addEventListener('blur', () => DIRS.forEach(release));

  // Mencegah zoom tidak sengaja saat mengetuk cepat di HP
  document.addEventListener('dblclick', e => e.preventDefault());

  Game.title();

  // Mode offline (bisa dipasang di layar utama HP)
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
