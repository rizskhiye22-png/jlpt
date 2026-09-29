/* =========================================================
   HEWAN 3D (kucing Mochi & hewan peliharaan): bentuk lembut + animasi jalan
   ========================================================= */
import * as THREE from 'three';

type Kind = 'neko' | 'inu' | 'usagi' | 'hiyoko';

export class Animal {
  readonly root = new THREE.Group();
  readonly hitbox: THREE.Mesh;
  private legs: THREE.Object3D[] = [];
  private body = new THREE.Group();
  private head = new THREE.Group();
  private tail: THREE.Object3D | null = null;
  private t = Math.random() * 10;
  private yaw = 0; private yawTarget = 0; private walk = 0;
  readonly kind: Kind;

  constructor(id: string, lite = false) {
    const pet = id.startsWith('pet_') && typeof PETS !== 'undefined' ? PETS.find(p => p.id === id) : null;
    this.kind = (pet?.kind as Kind) || 'neko';
    const pal = pet?.pal || (Pix.PAL.mochi as Record<string, string>);
    const M = (c: string, r = .8) => lite ? new THREE.MeshLambertMaterial({ color: c }) : new THREE.MeshStandardMaterial({ color: c, roughness: r });
    const fur = M(pal.h), dark = M(pal.H || pal.h), light = M(pal.o || '#fff'), acc = M(pal.a || '#f28c8c', .6), eye = M('#1a1216', .25);
    this.root.add(this.body);
    const add = (p: THREE.Object3D, g: THREE.BufferGeometry, m: THREE.Material, pos: number[], sc: number[] = [1, 1, 1], rot: number[] = [0, 0, 0]) => {
      const mesh = new THREE.Mesh(g, m); mesh.position.set(pos[0], pos[1], pos[2]); mesh.scale.set(sc[0], sc[1], sc[2]); mesh.rotation.set(rot[0], rot[1], rot[2]);
      mesh.castShadow = true; p.add(mesh); return mesh;
    };
    const k = this.kind;
    if (k === 'hiyoko') {
      add(this.body, new THREE.SphereGeometry(.13, 16, 12), fur, [0, .15, 0], [1, .95, 1.05]);
      this.head.position.set(0, .3, .04); this.body.add(this.head);
      add(this.head, new THREE.SphereGeometry(.09, 16, 12), fur, [0, 0, 0]);
      add(this.head, new THREE.ConeGeometry(.03, .06, 6), acc, [0, -.01, .1], [1, 1, 1], [Math.PI / 2, 0, 0]);
      [-1, 1].forEach(s => add(this.head, new THREE.SphereGeometry(.014, 8, 6), eye, [s * .04, .02, .075]));
      [-1, 1].forEach(s => add(this.body, new THREE.SphereGeometry(.06, 10, 8), dark, [s * .12, .16, -.01], [.4, .9, 1.2]));
      [-1, 1].forEach(s => { const l = new THREE.Group(); l.position.set(s * .05, .05, 0); this.body.add(l); add(l, new THREE.CylinderGeometry(.01, .01, .06, 6), acc, [0, -.02, 0]); this.legs.push(l); });
    } else {
      const long = k === 'inu' ? 1.15 : k === 'usagi' ? .8 : 1;
      const h = k === 'usagi' ? .12 : .17;
      add(this.body, new THREE.CapsuleGeometry(.09, .16 * long, 6, 12), fur, [0, h + .06, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
      add(this.body, new THREE.SphereGeometry(.075, 12, 10), light, [0, h + .02, .06], [1, .8, 1.3]);
      this.head.position.set(0, h + .16, .16 * long); this.body.add(this.head);
      add(this.head, new THREE.SphereGeometry(.1, 18, 14), fur, [0, 0, 0], [1.05, .95, 1]);
      add(this.head, new THREE.SphereGeometry(.05, 12, 10), light, [0, -.035, .07], [1.2, .8, .8]);
      add(this.head, new THREE.SphereGeometry(.013, 8, 6), acc, [0, -.015, .115]);
      [-1, 1].forEach(s => add(this.head, new THREE.SphereGeometry(.017, 10, 8), eye, [s * .045, .02, .085], [1, 1.2, .8]));
      if (k === 'neko') [-1, 1].forEach(s => add(this.head, new THREE.ConeGeometry(.04, .07, 4), fur, [s * .06, .09, -.01], [1, 1, .6], [0, 0, s * -.25]));
      if (k === 'inu') [-1, 1].forEach(s => add(this.head, new THREE.SphereGeometry(.045, 10, 8), dark, [s * .09, .02, -.02], [.45, 1.2, .8], [0, 0, s * .3]));
      if (k === 'usagi') [-1, 1].forEach(s => add(this.head, new THREE.CapsuleGeometry(.025, .12, 4, 8), fur, [s * .035, .15, -.02], [1, 1, .55], [-.15, 0, s * .12]));
      if (k === 'inu' || k === 'neko') add(this.head, new THREE.TorusGeometry(.07, .012, 6, 16), acc, [0, -.07, -.02], [1, 1, 1], [Math.PI / 2 - .3, 0, 0]);
      const legH = h + .02;
      [[-1, 1], [1, 1], [-1, -1], [1, -1]].forEach(([sx, sz]) => {
        const l = new THREE.Group(); l.position.set(sx * .055, legH, sz * .09 * long); this.body.add(l);
        add(l, new THREE.CylinderGeometry(.026, .022, legH, 8), k === 'neko' && sz < 0 ? dark : fur, [0, -legH / 2, 0]);
        add(l, new THREE.SphereGeometry(.026, 8, 6), light, [0, -legH + .01, .01], [1, .6, 1.2]);
        this.legs.push(l);
      });
      const tail = new THREE.Group(); tail.position.set(0, h + .1, -.16 * long); this.body.add(tail);
      if (k === 'usagi') add(tail, new THREE.SphereGeometry(.04, 10, 8), light, [0, 0, -.02]);
      else add(tail, new THREE.CapsuleGeometry(.02, k === 'inu' ? .1 : .16, 4, 8), k === 'neko' ? dark : fur, [0, .07, -.03], [1, 1, 1], [-.5, 0, 0]);
      this.tail = tail;
    }
    this.hitbox = new THREE.Mesh(new THREE.BoxGeometry(.5, .5, .6), new THREE.MeshBasicMaterial({ visible: false }));
    this.hitbox.position.y = .25; this.root.add(this.hitbox);
  }

  face(dir: string) { this.yawTarget = ({ down: 0, right: Math.PI / 2, up: Math.PI, left: -Math.PI / 2 } as Record<string, number>)[dir] ?? 0; }

  update(dt: number, walking: boolean) {
    this.t += dt * .001;
    this.walk += ((walking ? 1 : 0) - this.walk) * Math.min(1, dt / 100);
    let d = this.yawTarget - this.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    this.yaw += d * Math.min(1, dt / 80); this.root.rotation.y = this.yaw;
    const w = this.walk, ph = this.t * 14;
    this.legs.forEach((l, i) => { l.rotation.x = Math.sin(ph + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI : 0)) * .6 * w; });
    if (this.kind === 'usagi' || this.kind === 'hiyoko') this.body.position.y = Math.abs(Math.sin(ph * .5)) * .05 * w;
    else this.body.position.y = Math.abs(Math.sin(ph)) * .01 * w;
    if (this.tail) this.tail.rotation.y = Math.sin(this.t * (this.kind === 'inu' ? 9 : 2)) * (this.kind === 'inu' ? .6 : .35);
    this.head.rotation.y = Math.sin(this.t * .6) * .3 * (1 - w);
    this.head.rotation.x = Math.sin(this.t * 1.1) * .06;
  }

  dispose() {
    this.root.traverse(o => { const m = o as THREE.Mesh; if (m.geometry) m.geometry.dispose(); if (m.material) (m.material as THREE.Material).dispose(); });
  }
}
