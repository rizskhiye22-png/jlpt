/* =========================================================
   TITIK MASUK (Vite + TypeScript)
   Memasang mesin cerita v3, mesin 3D (TypeScript), dan antarmuka React ke game yang sudah ada.
   Karakter tetap pixel art 2D yang lucu (dibuat dari kode di public/js/pixel.js).
   Modul lama tetap di public/js dan dipindah bertahap.
   ========================================================= */
import { World3D } from './world/world3d';
import { mountReactUI } from './ui/mount';
import { Story } from './story/engine';
import { Voice } from './systems/voice';

// Cerita & suara dipasang lebih dulu supaya game.js bisa langsung memakainya.
try { Story.init(); window.Story = Story; } catch (e) { console.error('Story gagal dimuat', e); }
try { window.Voice = Voice; Voice.init(); } catch (e) { console.error('Voice gagal dimuat', e); }

function webgl() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}

const use3D = webgl() && !Save.d.settings.force2d;
if (use3D) window.World3D = World3D;
window.ReactUI = mountReactUI();
if (use3D) window.dispatchEvent(new Event('three-ready'));
