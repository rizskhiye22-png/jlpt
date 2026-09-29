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
declare const UI: { dialogOpen(): boolean; toast(msg: string): void; sleep(ms: number): Promise<void>; hideDialog(): void; say(line: any): Promise<void>; timecard(t: string, s?: string): Promise<void>; fade(fn?: () => any, ms?: number): Promise<void>; panel(html: string, cls?: string): HTMLElement; closePanel(): void; wait<T>(fn: (done: (v: T) => void) => void): Promise<T>; esc(s: string): string; [k: string]: any };
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

/* ---- dipakai modul cerita v3 ---- */
declare const Game: { h: { runLines(lines: any[], cast: string[]): Promise<void>; menuChoice(prompt: string, opts: string[]): Promise<number>; addPoints(n: number, why?: string): void; addStamp(id: string, title: string): void; heart(ids: string[]): void; [k: string]: any }; [k: string]: any };
declare const World: { map: string; load(map: string, x: number, y: number, dir: string, npcs?: any[]): void; setPhase(p: string): void; [k: string]: any };
declare const Music: { play(song: string): void; duck(on: boolean): void; [k: string]: any };
declare const Story: typeof import('./story/engine').Story;
interface Window { Story?: typeof import('./story/engine').Story; Voice?: any }
declare const KANA: Record<string, { ro: string; tip: string; noQuiz?: boolean }>;
declare const SIMILAR: Record<string, string>;
declare const DAYS: Array<{ kana?: string[]; [k: string]: any }>;
declare const IS_KATA: (c: string) => boolean;
