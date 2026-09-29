/* Modul lama (JavaScript biasa di public/js) memasang objek global.
   Deklarasi ini membuat TypeScript mengenalnya tanpa menulis ulang semuanya sekaligus. */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Dir = 'up' | 'down' | 'left' | 'right';

interface LegacyMaps {
  render(id: string, opts?: { ground?: boolean }): HTMLCanvasElement;
  tileAt(id: string, x: number, y: number): string;
  walkable(id: string, x: number, y: number): boolean;
  interactAt(id: string, x: number, y: number): any;
  across(id: string, x: number, y: number): boolean;
  hash(x: number, y: number, s?: number): number;
}

declare const MAPS: Record<string, any>;
declare const Maps: LegacyMaps;
declare const Save: { d: any; write(): void };
declare const Sound: { bump(): void; blip(): void; [k: string]: any };
declare const UI: { dialogOpen(): boolean; panel(html: string, cls?: string): HTMLElement; closePanel(): void; wait<T>(fn: (done: (v: T) => void) => void): Promise<T>; esc(s: string): string; [k: string]: any };
declare const Pix: {
  PAL: Record<string, Record<string, string>>;
  STYLE: Record<string, Record<string, any>>;
  sprite(id: string, dir?: string, frame?: number): HTMLCanvasElement;
  portrait(id: string, expr?: string): HTMLCanvasElement;
  drawPortrait(target: HTMLCanvasElement, id: string, expr?: string): void;
  shade(hex: string, t: number): string;
  [k: string]: any;
};
declare const CHARACTERS: Record<string, { name: string; color: string; [k: string]: any }>;
declare const PETS: Array<{ id: string; kind: string; name?: string; pal?: Record<string, string>; [k: string]: any }> | undefined;

interface Window {
  World3D: any;
  ReactUI?: any;
}
