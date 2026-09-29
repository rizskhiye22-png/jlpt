/* =========================================================
   TITIK MASUK (Vite + TypeScript)
   Memasang mesin 3D baru (karakter manusia 3D realistis) dan antarmuka React
   ke game yang sudah ada. Modul lama tetap di public/js dan dipindah bertahap.
   ========================================================= */
import { World3D } from './world/world3d';
import { Portrait3D } from './world/portrait3d';
import { bumpLook } from './world/spec';
import type { Expr } from './world/spec';
import { mountReactUI } from './ui/mount';

function webgl() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

const use3D = webgl() && !Save.d.settings.force2d;
if (use3D) {
  // Tampilan pemain / pemain online berubah → versi 3D dibuat ulang
  const origSet = Pix.setPlayer, origReg = Pix.registerLook;
  Pix.setPlayer = (look: unknown) => { origSet(look); bumpLook('player'); };
  Pix.registerLook = (key: string, look: unknown) => { origReg(key, look); bumpLook(key); };

  // Potret dialog, video sensei, dan lemari memakai foto dari model 3D
  const pixPortrait = Pix.portrait;
  const has3D = (id: string) => id !== 'mochi' && !id.startsWith('pet_');
  Pix.portrait = (id: string, expr: string = 'normal') => {
    if (!has3D(id)) return pixPortrait(id, expr);
    try { return Portrait3D.get(id, expr as Expr); } catch { return pixPortrait(id, expr); }
  };
  Pix.drawPortrait = (target: HTMLCanvasElement, id: string, expr?: string) => {
    const src = Pix.portrait(id, expr || 'normal');
    target.width = src.width; target.height = src.height;
    target.classList.toggle('hd', src.width > 48);
    const ctx = target.getContext('2d')!; ctx.clearRect(0, 0, src.width, src.height); ctx.drawImage(src, 0, 0);
  };
  window.Char3D = { portrait: Portrait3D.get, full: Portrait3D.full };
  window.World3D = World3D;
}
window.ReactUI = mountReactUI();
if (use3D) window.dispatchEvent(new Event('three-ready'));
