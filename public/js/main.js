/* =========================================================
   PEMBUKA: menyiapkan layar, tombol, keyboard, lalu layar judul.
   ========================================================= */
(function () {
  UI.init();

  // Pilih mesin dunia: 3D (Three.js) bila didukung, 2D sebagai cadangan
  function webgl() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; } }
  let booted = false;
  function boot(use3D) {
    if (booted) return; booted = true;
    const bootEl = document.getElementById('boot'); if (bootEl) bootEl.remove();
    window.World = use3D ? World3D : World2D;
    try { World.init(UI.els.canvas, { interact: Game.interact, warp: Game.warp, blocked: Game.blocked, moved: (m, x, y, d) => Online.moved(m, x, y, d) }); }
    catch (e) { console.warn('3D gagal, pakai 2D', e); if (use3D) { booted = false; const c = UI.els.canvas, n = c.cloneNode(); c.replaceWith(n); UI.els.canvas = n; return boot(false); } throw e; }
    if (use3D) World.setQuality(Save.d.settings.quality || 'normal');
    Game.title();
  }
  if (Save.d.settings.force2d || !webgl()) boot(false);
  else if (window.World3D) boot(true);
  else {
    window.addEventListener('three-ready', () => boot(true), { once: true });
    setTimeout(() => boot(!!window.World3D), 8000);
  }

  const DIRS = ['up', 'down', 'left', 'right'];

  // Panel & modal berhenti di atas pad, jadi D-pad / A / B / MENU tetap bisa dipencet
  const padEl = document.querySelector('.pad');
  const syncPad = () => { if (padEl) document.getElementById('app').style.setProperty('--pad-h', padEl.offsetHeight + 'px'); };
  syncPad(); window.addEventListener('resize', syncPad); setTimeout(syncPad, 500);
  const keyHook = btn => typeof Kerja !== 'undefined' && Kerja._keys && Kerja._keys(btn);

  // Semua tombol (layar sentuh & keyboard) lewat sini
  function press(btn) {
    if (UI.modalOpen()) {
      if (UI.input(btn)) return;
      if (btn === 'b' || btn === 'menu') { if (!UI.back() && Game._menuClose) Game._menuClose(); }
      return;
    }
    if (UI.panelOpen()) {
      if (keyHook(btn)) return;
      if (Lesson._keys && Lesson._keys(btn)) return;
      if (UI.input(btn)) return;
      if (btn === 'b' || btn === 'menu') UI.back();
      return;
    }
    if (UI.input(btn)) return;
    if (Game.busy) return;
    if (!window.World) return;
    if (DIRS.includes(btn)) { Game.cancelAuto(); World.hold(btn); }
    else if (btn === 'a') World.action();
    else if (btn === 'b' || btn === 'menu') Game.menu();
  }
  function release(btn) { if (typeof Kerja !== 'undefined' && Kerja._release) Kerja._release(btn); if (DIRS.includes(btn) && window.World) World.release(btn); }

  // D-pad: tahan untuk terus berjalan
  document.querySelectorAll('.dpad [data-dir]').forEach(b => {
    const dir = b.dataset.dir;
    b.addEventListener('pointerdown', e => { e.preventDefault(); Sound.unlock(); Music.unlock(); b.classList.add('on'); press(dir); });
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

  // Mode offline (bisa dipasang di layar utama HP)
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update && r.update()).catch(() => {}));
    // versi baru terpasang → muat ulang sekali supaya CSS/JS lama tidak tercampur
    const hadController = !!navigator.serviceWorker.controller; let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController && !reloaded) { reloaded = true; location.reload(); } });
  }
})();
