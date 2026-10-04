"""Uji Simulasi Kerja: 4 shift lewat Menu → Kerja (tugas fisik dikerjakan sungguhan dengan mouse),
D-pad di ruangan, pintu bangunan di しごとまち, dan tombol pad tetap bisa dipencet saat panel terbuka.
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/kerja_sim.py [folder_screenshot]"""
import sys, os, re, functools
print = functools.partial(print, flush=True)
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
import helpers as H

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
GOAL_JS = """() => {
  const t = (document.querySelector('.ws-obj.on') || {}).textContent || ''; if (!t) return null;
  for (const R of [Kerja._room, ...Object.values(Kerja.ROOMS)].filter(Boolean)) for (const s of Object.values(R.st)) if (t.includes(s.jp + ' ')) {
    const cv = document.querySelector('.ws-stage canvas').getBoundingClientRect();
    return [cv.left + (s.x + .5) / 12 * cv.width, cv.top + (s.y + .5) / 7 * cv.height];
  }
  return null; }"""

def tap(pg, sel):
    try: pg.locator(sel).first.click(timeout=2500); return True
    except Exception: return False

def canvas_pt(pg, sel, x, y, w, h):
    pg.locator(sel).first.scroll_into_view_if_needed()
    r = pg.locator(sel).bounding_box()
    return r['x'] + x / w * r['width'], r['y'] + y / h * r['height']

def do_wash(pg):
    for k in ['water', 'soap', 'rub']: tap(pg, f'.kj-tool[data-k={k}]'); pg.wait_for_timeout(150)
    zones = pg.evaluate("JSON.parse(document.querySelector('.kj-pad').dataset.zones)")
    for _ in range(40):
        for (x, y, w, h) in zones:
            pg.mouse.move(*canvas_pt(pg, '.kj-pad', x + 4, y + 4, 300, 140)); pg.mouse.down()
            for i in range(6): pg.mouse.move(*canvas_pt(pg, '.kj-pad', x + w - 4 if i % 2 == 0 else x + 4, y + h * (i + 1) / 7, 300, 140), steps=3)
            pg.mouse.up()
        sec = int(pg.locator('.kj-timer b').inner_text() or 0)
        if sec >= 30 and all(v >= 100 for v in pg.evaluate("[...document.querySelectorAll('.kj-pad')].length && JSON.parse('[0]')")) or sec >= 30:
            break
        pg.wait_for_timeout(300)
    for k in ['rinse', 'dry', 'alc']:
        tap(pg, f'.kj-tool[data-k={k}]'); pg.wait_for_timeout(200)
        if k == 'rinse' and pg.locator('.kj-tool[data-k=rinse]:not([disabled])').count():   # belum bersih: gosok lagi
            for (x, y, w, h) in zones:
                pg.mouse.move(*canvas_pt(pg, '.kj-pad', x + 4, y + 4, 300, 140)); pg.mouse.down()
                for i in range(10): pg.mouse.move(*canvas_pt(pg, '.kj-pad', x + w - 4 if i % 2 == 0 else x + 4, y + h * (i + 1) / 11, 300, 140), steps=3)
                pg.mouse.up()
            tap(pg, '.kj-tool[data-k=rinse]')

def do_roller(pg):
    pts = pg.evaluate("JSON.parse(document.querySelector('.kj-pad').dataset.specks)")
    box = pg.locator('.kj-pad').bounding_box()
    pt = lambda x, y: (box['x'] + x / 300 * box['width'], box['y'] + y / 160 * box['height'])
    for (x, y) in pts:
        if not pg.locator('.kj-pad[data-specks]').count(): return
        pg.mouse.move(*pt(x - 6, y)); pg.mouse.down(); pg.mouse.move(*pt(x + 6, y), steps=2); pg.mouse.up()
    if pg.locator('.kj-pad[data-specks]').count(): tap(pg, '.ws-box .btn.ghost')

def do_belt(pg):
    for _ in range(400):
        if not pg.locator('.kj-pad.belt').count(): return
        its = pg.evaluate("(document.querySelector('.ws-box')._belt || []).filter(o => !o.gone && !o.ok && o.x > 30 && o.x < 290).map(o => o.x)")
        for x in its: pg.mouse.click(*canvas_pt(pg, '.kj-pad.belt', x, 46, 320, 90))
        pg.wait_for_timeout(120)

def do_thermo(pg):
    for _ in range(2):
        if not pg.locator('.kj-zone.mid').count(): return
        tap(pg, '.kj-zone.mid'); pg.wait_for_timeout(200)
        b = pg.locator('.kj-hold').bounding_box(); pg.mouse.move(b['x'] + 20, b['y'] + 10); pg.mouse.down(); pg.wait_for_timeout(2400); pg.mouse.up()
        v = str(round(float(pg.locator('.kj-read b').inner_text())))
        for d in v: tap(pg, f'.kj-keys button[data-n="{d}"]')
        tap(pg, '.kj-keys button[data-n="✓"]'); pg.wait_for_timeout(200)
        tap(pg, '.kj-pass' if int(v) >= 75 else '.kj-re'); pg.wait_for_timeout(1900)

def do_dial(pg):
    pg.evaluate("(() => { const r = document.querySelector('.kj-dial input'); r.value = document.querySelector('.ws-box').dataset.target || 40; r.dispatchEvent(new Event('input')); })()")
    tap(pg, '.kj-hand')

def do_feed(pg):
    tap(pg, '.kj-say')
    for _ in range(200):
        if not pg.locator('.kj-spoon').count(): return
        cue = pg.locator('.kj-cue').inner_text()
        if 'ごっくん' in cue or 'いただきます' in cue: tap(pg, '.kj-spoon'); pg.wait_for_timeout(200)
        pg.wait_for_timeout(150)

def do_cash(pg):
    q = pg.locator('.ws-box .ws-q').inner_text().replace(',', '')
    total, paid = [int(n) for n in re.findall(r'(\d+)えん', q)][:2]
    ch = paid - total
    for v in [1000, 500, 100, 50, 10]:
        while ch >= v: tap(pg, f'.kj-coin[data-v="{v}"]'); ch -= v
    tap(pg, '.kj-give')

def do_shisa(pg):
    for _ in range(3):
        p = pg.locator('.kj-pt:not(.done)')
        if not p.count(): return
        p.first.click(); b = pg.locator('.kj-yoshi').bounding_box()
        pg.mouse.move(b['x'] + 20, b['y'] + 10); pg.mouse.down(); pg.wait_for_timeout(1100); pg.mouse.up(); pg.wait_for_timeout(200)

def gest(pg, how, times=1):
    b = pg.locator('.ws-box .kj-target').bounding_box(); cx, cy = b['x'] + b['width'] / 2, b['y'] + b['height'] / 2
    if how and how.startswith('taps:'): how, times = 'taps', int(how.split(':')[1])
    if how == 'hold': pg.mouse.move(cx, cy); pg.mouse.down(); pg.wait_for_timeout(1100); pg.mouse.up()
    elif how == 'swipe':
        pg.mouse.move(cx - 50, cy); pg.mouse.down()
        for i in range(6): pg.mouse.move(cx + (50 if i % 2 == 0 else -50), cy, steps=4)
        pg.mouse.up()
    else:
        for i in range(times or 1): pg.mouse.click(cx, cy); pg.wait_for_timeout(60)

def do_act(pg):
    """Aksi 'act' dan alat+gerakan di tugas lain (mis. バイタル): pilih alat yang diminta, lalu lakukan gerakannya."""
    for _ in range(14):
        if not pg.locator('.ws-box .kj-target').count(): return
        if pg.locator('.ws-box .kj-target.ready').count():
            how, times = pg.evaluate("(() => { const t = document.querySelector('.ws-box .kj-target'), b = document.querySelector('.ws-box'); return [t.dataset.how || b.dataset.how, +b.dataset.times || 1]; })()")
            gest(pg, how, times); pg.wait_for_timeout(700); continue
        if pg.locator('.ws-box .kj-tool2').count() and not pg.locator('.ws-box .kj-tool2.sel').count():
            tool = pg.evaluate("document.querySelector('.ws-box').dataset.tool")
            pg.locator('.kj-tool2').filter(has=pg.locator(f'span:text-is("{tool}")')).first.click(); pg.wait_for_timeout(200); continue
        return

def do_hunt(pg):
    its = pg.evaluate("JSON.parse(document.querySelector('.kj-pad.hunt').dataset.items)")
    for (x, y, bad) in its:
        if bad and pg.locator('.kj-pad.hunt').count(): pg.mouse.click(*canvas_pt(pg, '.kj-pad.hunt', x, y, 320, 160)); pg.wait_for_timeout(120)
    pg.wait_for_timeout(700)
    if pg.locator('.kj-pad.hunt').count(): tap(pg, '.ws-box .btn.ghost')

def do_harvest(pg):
    fr = pg.evaluate("JSON.parse(document.querySelector('.kj-pad.farm').dataset.fruits)")
    for (x, y, ripe) in fr:
        if ripe and pg.locator('.kj-pad.farm').count(): pg.mouse.click(*canvas_pt(pg, '.kj-pad.farm', x, y, 320, 150)); pg.wait_for_timeout(80)
    pg.wait_for_timeout(500)
    if pg.locator('.kj-pad.farm').count(): tap(pg, '.ws-box .btn.ghost')

def do_scale(pg):
    for _ in range(6):
        if not pg.locator('.kj-scale').count(): return
        kg = float(pg.evaluate("document.querySelector('.ws-box').dataset.kg"))
        tap(pg, '.kj-keys.kg [data-d="0"]')
        while kg >= 5: tap(pg, '.kj-keys.kg [data-d="5"]'); kg -= 5
        while kg >= 1: tap(pg, '.kj-keys.kg [data-d="1"]'); kg -= 1
        if kg >= .5: tap(pg, '.kj-keys.kg [data-d="0.5"]')
        tap(pg, '.kj-feed-go'); pg.wait_for_timeout(500)

def do_sort(pg):
    for _ in range(12):
        if not pg.locator('.kj-bins').count(): return
        ans = pg.evaluate("document.querySelector('.ws-box').dataset.ans")
        tap(pg, f'.kj-bins [data-k="{ans}"]'); pg.wait_for_timeout(250)

PHYS = [('.kj-target', do_act, 'aksi'), ('.kj-pad.hunt', do_hunt, 'cari-bahaya'), ('.kj-pad.farm', do_harvest, 'panen'), ('.kj-scale', do_scale, 'timbang'), ('.kj-bins', do_sort, 'sortir'),
        ('.kj-tool', do_wash, 'cuci'), ('.kj-pad[data-specks]', do_roller, 'rol'), ('.kj-pad.belt', do_belt, 'conveyor'), ('.kj-zone.mid', do_thermo, 'termometer'),
        ('.kj-dial', do_dial, 'dial'), ('.kj-say:not([disabled])', do_feed, 'suap'), ('.kj-drawer', do_cash, 'kasir'), ('.kj-points', do_shisa, 'shisa')]


# ---------- aksi nyata tambahan (kerja-aksi.js) ----------
def do_okopt(pg):
    tap(pg, '.ws-box .ws-o[data-ok="1"]'); pg.wait_for_timeout(300)

def do_talk(pg):
    for _ in range(6):
        if not pg.locator('.ws-box .kj-talk').count(): return
        if pg.locator('.ws-box .ws-o:not([disabled])').count():
            ds = [int(pg.locator('.ws-box .ws-o').nth(i).get_attribute('data-d')) for i in range(pg.locator('.ws-box .ws-o').count())]
            pg.locator('.ws-box .ws-o').nth(ds.index(max(ds))).click(); pg.wait_for_timeout(300)
        tap(pg, '.ws-box .kj-next'); pg.wait_for_timeout(300)

def do_vtable(pg):
    abn = pg.evaluate("document.querySelector('.ws-box').dataset.abn")
    for k in ['temp', 'bp', 'pulse', 'spo2']: tap(pg, f'.kj-vt tr[data-k="{k}"] [data-j="{"ng" if k == abn else "ok"}"]')
    tap(pg, '.ws-box .kj-next'); pg.wait_for_timeout(1100)

def do_dress(pg):
    if pg.locator('.ws-box .kj-prep').count():
        for i in range(pg.locator('.kj-prep .kj-pt[data-ok="1"]').count()): pg.locator('.kj-prep .kj-pt[data-ok="1"]').nth(i).click()
        tap(pg, '.ws-box .kj-next'); pg.wait_for_timeout(300); return
    mahi = pg.evaluate("document.querySelector('.ws-box').dataset.mahi")
    off = 'ぬぐ' in pg.locator('.ws-box .ws-q').inner_text()
    want = ({'R': 'L', 'L': 'R'}[mahi]) if off else mahi
    tap(pg, f'.kj-arm[data-s="{want}"]'); pg.wait_for_timeout(300); tap(pg, '.ws-box .kj-next'); pg.wait_for_timeout(300)

def do_skin(pg):
    its = pg.evaluate("JSON.parse(document.querySelector('.kj-pad.skin').dataset.items)")
    for (x, y, red) in its:
        if red and pg.locator('.kj-pad.skin').count(): pg.mouse.click(*canvas_pt(pg, '.kj-pad.skin', x, y, 320, 110)); pg.wait_for_timeout(150)
    pg.wait_for_timeout(900)
    if pg.locator('.kj-pad.skin').count(): tap(pg, '.ws-box .btn.ghost')

def do_meds(pg):
    for _ in range(6):
        p = pg.locator('.kj-pack:not(.done)')
        if not p.count(): break
        to = p.first.get_attribute('data-to'); p.first.click(); pg.wait_for_timeout(150)
        tap(pg, f'.kj-seat[data-p="{to}"]'); pg.wait_for_timeout(200)
    pg.wait_for_timeout(900)

def do_auto(pg):
    pg.evaluate("document.querySelector('.ws-box')._auto && document.querySelector('.ws-box')._auto(); 0")
    for _ in range(400):
        pg.wait_for_timeout(100)
        if not pg.locator('.ws-box .kj-crane, .ws-box .kj-scaf, .ws-box .kj-yudo').count(): return

def do_bins(pg):
    for _ in range(12):
        if not pg.locator('.ws-box .kj-binrow').count(): return
        ans = pg.evaluate("document.querySelector('.ws-box').dataset.ans")
        tap(pg, f'.kj-bin[data-b="{ans}"]'); pg.wait_for_timeout(800)

def do_rebar(pg):
    pts = pg.evaluate("JSON.parse(document.querySelector('.kj-pad.rebar').dataset.pts)")
    for (x, y) in pts[:2]:   # dua ikatan pertama dengan tahan sungguhan, sisanya cepat
        pg.mouse.move(*canvas_pt(pg, '.kj-pad.rebar', x, y, 320, 140)); pg.mouse.down(); pg.wait_for_timeout(600); pg.mouse.up(); pg.wait_for_timeout(100)
    pg.evaluate("document.querySelector('.ws-box')._tieAll(); 0"); pg.wait_for_timeout(600)
    off = int(pg.evaluate("document.querySelector('.ws-box').dataset.off"))
    x = pg.evaluate(f"JSON.parse(document.querySelector('.kj-pad.rebar').dataset.pts)[{off} * 3][0]")
    pg.mouse.click(*canvas_pt(pg, '.kj-pad.rebar', x, 50, 320, 140)); pg.wait_for_timeout(300)
    tap(pg, '.ws-box .kj-next')

PHYS = [('.kj-talk', do_talk, 'bicara'), ('.kj-vt', do_vtable, 'vital-catat'), ('.kj-prep', do_dress, 'ganti-baju'), ('.kj-arm', do_dress, 'ganti-baju'),
        ('.kj-pad.skin', do_skin, 'kulit'), ('.kj-meds', do_meds, 'obat'), ('.kj-crane', do_auto, 'crane'), ('.kj-scaf', do_auto, 'harness'),
        ('.kj-yudo', do_auto, 'yudo'), ('.kj-binrow', do_bins, 'pilah'), ('.kj-pad.rebar', do_rebar, 'besi'), ('.ws-o[data-ok="1"]', do_okopt, 'kalimat')] + PHYS

def play(pg, tag, keep=False):
    shots = set()
    for it in range(4000):
        pg.wait_for_timeout(60)
        if it % 200 == 0: print('  ..', tag, it, pg.evaluate("(document.querySelector('.ws-box')||{}).innerText?.slice(0,50)||''").replace('\n', ' '))
        if pg.locator('.kj-rank').count():
            rank = pg.locator('.kj-rank').inner_text()
            pg.screenshot(path=f'{OUT}/kerja_{tag}_hasil.png', full_page=True); tap(pg, '.kj [data-a=close]'); pg.wait_for_timeout(700)
            if keep: return rank
            return rank
        g = pg.evaluate(GOAL_JS)
        if g and pg.locator('.ws-obj.on').count():
            if 'goal' not in shots: shots.add('goal'); pg.wait_for_timeout(300); pg.screenshot(path=f'{OUT}/kerja_{tag}_tujuan.png')
            pg.mouse.click(*g); pg.wait_for_timeout(250); continue
        hit = False
        for sel, fn, name in PHYS:
            if pg.locator('.ws-box ' + sel).count():
                pg.wait_for_timeout(200); pg.screenshot(path=f'{OUT}/kerja_{tag}_{name}.png')
                fn(pg); print('     fisik:', name); hit = True; break
        if hit: continue
        if pg.locator('.ws-box .kj-next').count(): tap(pg, '.ws-box .kj-next'); continue
        if pg.locator('.ws-next').count():
            if 'say' not in shots: shots.add('say'); pg.screenshot(path=f'{OUT}/kerja_{tag}_instruksi.png')
            tap(pg, '.ws-next'); continue
        if pg.locator('.ws-o:not([disabled])').count(): tap(pg, '.ws-o:not([disabled])'); continue
        if pg.locator('.ws-box .kj-o').count():
            b = pg.locator('.ws-box .kj-o'); i = min(int(b.nth(k).get_attribute('data-i')) for k in range(b.count()))
            tap(pg, f'.ws-box .kj-o[data-i="{i}"]'); continue
        if pg.locator('.ws-box [data-a=check]').count(): tap(pg, '.ws-box [data-a=check]'); continue
        if pg.locator('.ws-box .kj-ok').count(): tap(pg, '.kj-ok' if pg.evaluate("Math.random()<.5") else '.kj-ng'); pg.wait_for_timeout(1450); continue
        if pg.locator('.choices .choice').count(): tap(pg, '.choices .choice'); continue
        if pg.locator('.dialog:not(.hide)').count(): tap(pg, '.dialog'); continue
    pg.screenshot(path=f'{OUT}/kerja_{tag}_TIMEOUT.png'); print(pg.evaluate("document.querySelector('.panels').innerText.slice(0,400)"))
    raise RuntimeError('timeout ' + tag)

if __name__ == '__main__':
  with sync_playwright() as p:
      H.CTX['br'] = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
      pg = H.boot(H.base(12, 'after'))
      # pad tidak tertutup panel: tombol MENU/B tetap bisa dipencet
      pg.evaluate("setTimeout(() => Game.menu()); 0"); pg.wait_for_timeout(400)
      pg.click('.mi[data-a=settings]'); pg.wait_for_timeout(300)
      hitB = pg.evaluate("(() => { const b = document.querySelector('.pad [data-btn=b]').getBoundingClientRect(); const e = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2); return !!(e && e.closest('.pad')); })()")
      print('pad bisa dipencet saat Pengaturan terbuka:', hitB)
      pg.click('.settings [data-a=close]'); pg.wait_for_timeout(300)
      pg.locator('.pad [data-btn=b]').dispatch_event('pointerdown'); pg.wait_for_timeout(300)
      print('B menutup menu:', pg.locator('.modals.on').count() == 0)
      # D-pad di ruangan kerja: dari (2,3) ke loker (1,2) dengan ← lalu ↑
      pg.wait_for_timeout(300)
      pg.evaluate("setTimeout(() => Kerja.run('food')); 0"); pg.wait_for_selector('.ws-obj.on', timeout=10000)
      pg.keyboard.press('ArrowLeft'); pg.wait_for_timeout(450); pg.keyboard.press('ArrowUp'); pg.wait_for_timeout(1200)
      print('D-pad sampai ke pos:', pg.locator('.ws-obj.on').count() == 0)
      print('food (D-pad) → rank', play(pg, 'food'))
      pg.evaluate("setTimeout(() => Kerja.open()); 0"); pg.wait_for_timeout(500)
      for j in ['kaigo', 'genba', 'gaishoku']:
          pg.click(f'[data-go={j}]')
          print(j, '→ rank', play(pg, j))
      pg.click('.kj [data-a=close]'); pg.wait_for_timeout(500)
      pg.evaluate("setTimeout(() => Game.h.goTo('shigoto', 13, 5, 'up')); 0"); pg.wait_for_timeout(1500)
      print('peta:', pg.evaluate("World.map"), '| tujuan kereta:', pg.evaluate("Places2.DESTS.map(d => d.id).join(',')"))
      pg.evaluate("setTimeout(() => Places.interact({ type: 'door', door: { id: 'kerja_gaishoku' } })); 0"); pg.wait_for_timeout(500)
      print('pintu izakaya → rank', play(pg, 'pintu'))
      print('evaluasi tersimpan:', pg.evaluate("JSON.stringify(Save.d.kerja.food.stars)"))
      print('ERRORS:', H.errors or 'none')
