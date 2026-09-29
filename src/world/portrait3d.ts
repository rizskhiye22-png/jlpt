/* =========================================================
   POTRET 3D: foto kepala & bahu tokoh dari model 3D-nya
   (untuk kotak dialog, video sensei, lemari, halaman Teman).
   Memakai satu renderer kecil terpisah; hasilnya disimpan (cache) sebagai kanvas 2D.
   ========================================================= */
import * as THREE from 'three';
import { Humanoid } from './humanoid';
import { specFor } from './spec';
import type { Expr } from './spec';

const SIZE = 256;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene, camera: THREE.PerspectiveCamera;
const cache = new Map<string, HTMLCanvasElement>();

function setup() {
  if (renderer) return renderer;
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(SIZE, SIZE, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(22, 1, .05, 20);
  // pencahayaan studio: utama hangat, pengisi lembut, cahaya tepi dari belakang
  scene.add(new THREE.HemisphereLight(0xfff6ee, 0x8a7a88, .9));
  const key = new THREE.DirectionalLight(0xfff0e0, 1.7); key.position.set(-1.2, 1.6, 2.2); scene.add(key);
  const fill = new THREE.DirectionalLight(0xdfe8ff, .7); fill.position.set(1.6, .4, 1.5); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.6); rim.position.set(.6, 1.4, -2.4); scene.add(rim);
  return renderer;
}

function shoot(id: string, expr: Expr, full: boolean, w: number, h: number): HTMLCanvasElement {
  const r = setup();
  r.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  const hm = new Humanoid(specFor(id));
  hm.face('down', true);
  if (full) hm.update(16, false); else hm.pose(expr);
  scene.add(hm.root); hm.root.updateMatrixWorld(true);
  const H = hm.height;
  if (full) {
    camera.fov = 26; camera.updateProjectionMatrix();
    const d = (H * .62) / Math.tan(13 * Math.PI / 180);
    camera.position.set(H * .12, H * .62, d); camera.lookAt(0, H * .5, 0);
  } else {
    camera.fov = 22; camera.updateProjectionMatrix();
    const head = hm.headWorld;
    const d = H * .95;
    camera.position.set(head.x + H * .06, head.y + H * .02, head.z + d);
    camera.lookAt(head.x, head.y - H * .06, head.z);
  }
  r.render(scene, camera);
  const out = document.createElement('canvas'); out.width = w; out.height = h;
  out.getContext('2d')!.drawImage(r.domElement, 0, 0, w, h);
  scene.remove(hm.root); hm.dispose();
  return out;
}

export const Portrait3D = {
  // Potret kepala & bahu (256x256)
  get(id: string, expr: Expr = 'normal'): HTMLCanvasElement {
    const key = specFor(id).key + ':' + expr;
    let c = cache.get(key);
    if (!c) {
      c = shoot(id, expr, false, SIZE, SIZE);
      cache.set(key, c);
      if (cache.size > 80) cache.delete(cache.keys().next().value!);
    }
    return c;
  },
  // Seluruh badan (untuk lemari)
  full(id: string, w = 160, h = 240): HTMLCanvasElement { return shoot(id, 'happy', true, w, h); },
  available(): boolean { try { setup(); return true; } catch { return false; } },
};
