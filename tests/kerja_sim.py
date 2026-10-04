"""Uji Simulasi Kerja aktif: Menu → Kerja (4 shift) + kawasan しごとまち (kereta, pintu bangunan).
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/kerja_sim.py [folder_screenshot]"""
import sys, os, functools
print = functools.partial(print, flush=True)
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
import helpers as H

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
GOAL_JS = """() => {
  const t = (document.querySelector('.ws-obj.on') || {}).textContent || ''; if (!t) return null;
  for (const R of Object.values(Kerja.ROOMS)) for (const s of Object.values(R.st)) if (t.includes(s.jp)) {
    const cv = document.querySelector('.ws-stage canvas').getBoundingClientRect();
    return [cv.left + (s.x + .5) / 12 * cv.width, cv.top + (s.y + .5) / 7 * cv.height];
  }
  return null; }"""

def tap(pg, sel):
    try: pg.locator(sel).first.click(timeout=2500)
    except Exception: pass

def play(pg, tag):
    shots = set()
    for it in range(5000):
        pg.wait_for_timeout(50)
        if it % 150 == 0: print('  ..', tag, it, pg.evaluate("(document.querySelector('.ws-box')||{}).innerText?.slice(0,60)||''").replace('\n',' '))
        if pg.locator('.kj-rank').count():
            rank = pg.locator('.kj-rank').inner_text()
            pg.screenshot(path=f'{OUT}/kerja_{tag}_hasil.png'); pg.click('.kj [data-a=close]'); pg.wait_for_timeout(700)
            return rank
        g = pg.evaluate(GOAL_JS)
        if g and pg.locator('.ws-obj.on').count():
            if 'goal' not in shots: shots.add('goal'); pg.wait_for_timeout(300); pg.screenshot(path=f'{OUT}/kerja_{tag}_tujuan.png')
            pg.mouse.click(*g); pg.wait_for_timeout(250); continue
        if pg.locator('.ws-next').count():
            if 'say' not in shots: shots.add('say'); pg.screenshot(path=f'{OUT}/kerja_{tag}_instruksi.png')
            tap(pg, '.ws-next'); continue
        if pg.locator('.ws-o:not([disabled])').count():
            if 'quiz' not in shots: shots.add('quiz'); pg.screenshot(path=f'{OUT}/kerja_{tag}_kuis.png')
            tap(pg, '.ws-o:not([disabled])'); continue
        if pg.locator('.ws-box .kj-o').count():
            if 'order' not in shots: shots.add('order'); pg.screenshot(path=f'{OUT}/kerja_{tag}_urut.png')
            b = pg.locator('.ws-box .kj-o'); i = min(int(b.nth(k).get_attribute('data-i')) for k in range(b.count()))
            tap(pg, f'.ws-box .kj-o[data-i="{i}"]'); continue
        if pg.locator('.ws-box [data-a=check]').count():
            if 'pick' not in shots: shots.add('pick'); pg.locator('.kj-t').first.click(); pg.click('[data-a=check]'); pg.screenshot(path=f'{OUT}/kerja_{tag}_pilih.png')
            tap(pg, '.ws-box [data-a=check]'); continue
        if pg.locator('.ws-box .kj-ok').count():
            if 'spot' not in shots: shots.add('spot'); pg.screenshot(path=f'{OUT}/kerja_{tag}_cek.png')
            tap(pg, '.kj-ok' if pg.evaluate("Math.random()<.5") else '.kj-ng'); pg.wait_for_timeout(1450); continue
        if pg.locator('.choices .choice').count(): tap(pg, '.choices .choice'); continue
        if pg.locator('.dialog:not(.hide)').count(): tap(pg, '.dialog'); continue
    pg.screenshot(path=f'{OUT}/kerja_{tag}_TIMEOUT.png'); print(pg.evaluate("document.querySelector('.panels').innerText.slice(0,400)"))
    raise RuntimeError('timeout ' + tag)

with sync_playwright() as p:
    H.CTX['br'] = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
    pg = H.boot(H.base(12, 'after'))
    pg.evaluate("setTimeout(() => Game.menu()); 0"); pg.wait_for_timeout(400)
    pg.click('.mi[data-a=kerja]'); pg.wait_for_timeout(400)
    pg.screenshot(path=f'{OUT}/kerja_menu.png')
    for j in ['food', 'kaigo', 'genba', 'gaishoku']:
        pg.click(f'[data-go={j}]')
        print(j, '→ rank', play(pg, j))
    pg.click('.kj [data-a=close]'); pg.wait_for_timeout(300)
    for _ in range(10):
        if pg.locator('.modals.on .mi[data-a=close]').count(): pg.click('.modals.on .mi[data-a=close]'); break
        pg.wait_for_timeout(200)
    pg.wait_for_timeout(500)
    # kawasan kerja: tiket kereta punya tujuan baru, lalu masuk lewat pintu bangunan
    print('tujuan kereta:', pg.evaluate("Places2.DESTS.map(d => d.id).join(',')"))
    pg.evaluate("setTimeout(() => Game.h.goTo('shigoto', 13, 5, 'up')); 0"); pg.wait_for_timeout(1500)
    pg.screenshot(path=f'{OUT}/kerja_shigotomachi.png')
    print('peta:', pg.evaluate("World.map"), '| npc rina:', pg.evaluate("Places.npcs('shigoto').some(n => n.id === 'rina')"))
    pg.evaluate("setTimeout(() => Places.interact({ type: 'door', door: { id: 'kerja_kaigo' } })); 0"); pg.wait_for_timeout(500)
    print('pintu panti → rank', play(pg, 'pintu'))
    rec = pg.evaluate("JSON.stringify(Save.d.kerja)"); print('save', rec)
    print('ERRORS:', H.errors or 'none')
