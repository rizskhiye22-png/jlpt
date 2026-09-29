/* =========================================================
   Jembatan React ↔ sistem panel lama (UI.panel / UI.wait / tombol B).
   Setiap halaman React dibuka di dalam panel biasa, sehingga tombol B,
   tombol ✕, dan alur game lama tetap bekerja.
   ========================================================= */
import { createRoot } from 'react-dom/client';
import type { ReactElement } from 'react';
import { Friends } from './Friends';

function open(render: (close: () => void) => ReactElement, cls = 'scroll'): Promise<void> {
  const p = UI.panel('<div class="react-page"></div>', cls);
  const el = p.querySelector('.react-page') as HTMLElement;
  const root = createRoot(el);
  return UI.wait<void>(done => {
    let closed = false;
    const close = () => {
      if (closed) return; closed = true;
      Sound.blip(); root.unmount(); UI.closePanel(); done();
    };
    // panel ditutup dari luar (mis. dibatalkan) → lepaskan React juga
    const obs = new MutationObserver(() => { if (!el.isConnected) { obs.disconnect(); if (!closed) { closed = true; root.unmount(); } } });
    obs.observe(document.body, { childList: true, subtree: true });
    root.render(render(close));
  });
}

export const pages = {
  friends: () => open(close => <Friends onClose={close} />),
};
