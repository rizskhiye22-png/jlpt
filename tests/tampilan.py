"""Audit tampilan: buka layar-layar utama di beberapa ukuran HP, ambil screenshot, dan cek otomatis
(luber ke samping, tombol ✕ menutupi tombol lain, emoji SVG termuat).
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/tampilan.py [folder_screenshot]"""
import sys, os, functools
print = functools.partial(print, flush=True)
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
import helpers as H
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
SIZES = [(360, 640), (390, 844), (412, 915)]
CHECK = """() => {
  const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
  const out = [];
  if (document.documentElement.scrollWidth > innerWidth + 1) out.push('halaman bisa digeser ke samping');
  document.querySelectorAll('.panel, .modal, .win, .ws, .ws-box, .kj-voc, .kj-toolbox, .row, .menu-grid').forEach(e => { if (vis(e) && e.scrollWidth > e.clientWidth + 2) out.push('luber: .' + [...e.classList].join('.')); });
  const x = document.querySelector('.exit-x');
  if (x && vis(x)) { const a = x.getBoundingClientRect(); document.querySelectorAll('.panels button, .panels .ws-score, .panels .w-title, .panels .g-info, .panels .g-title, .panels .q-top').forEach(b => { if (b === x || !vis(b)) return; const r = b.getBoundingClientRect(); if (r.left < a.right - 2 && r.right > a.left + 2 && r.top < a.bottom - 2 && r.bottom > a.top + 2) out.push('✕ menutupi: ' + (b.className || b.tagName) + ' "' + b.textContent.trim().slice(0, 20) + '"'); }); }
  const emo = [...document.querySelectorAll('img.emo')]; const broken = emo.filter(i => i.complete && !i.naturalWidth).length;
  if (broken) out.push(broken + ' emoji SVG gagal dimuat');
  return { masalah: out, emoji: emo.length };
}"""

def shot(pg, name, w):
    pg.wait_for_timeout(700)
    r = pg.evaluate(CHECK)
    pg.screenshot(path=f'{OUT}/ui_{w}_{name}.png')
    print(f'  {name:16} emoji={r["emoji"]:3} ' + ('OK' if not r['masalah'] else '⚠ ' + '; '.join(dict.fromkeys(r['masalah']))))
    return r['masalah']

def bg(pg, js): pg.evaluate(f"setTimeout(() => {{ {js} }}); 0"); pg.wait_for_timeout(600)

with sync_playwright() as p:
    br = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
    H.CTX['br'] = br
    total = 0
    for (w, h) in SIZES:
        print(f'== {w}x{h}')
        ctx = br.new_context(viewport={'width': w, 'height': h}, device_scale_factor=2, is_mobile=True, has_touch=True, service_workers='block')
        H.CTX['ctx'] = ctx
        pg = ctx.new_page(); pg.on('pageerror', lambda e: H.errors.append(str(e)))
        pg.goto(H.URL); pg.evaluate("s => localStorage.setItem('nihongo-gakkou-v2', JSON.stringify(s))", {**H.base(12, 'after'), 'settings': {**H.FAST, 'force2d': True}})
        pg.reload(); pg.wait_for_selector('.title', timeout=30000)
        total += len(shot(pg, 'judul', w))
        pg.click('[data-a=cont]'); pg.wait_for_timeout(2500)
        for _ in range(30):
            if pg.locator('.dialog:not(.hide)').count(): pg.locator('.dialog').click(); pg.wait_for_timeout(150)
            else: break
        total += len(shot(pg, 'kota_hud', w))
        bg(pg, "UI.say({ w: 'sensei', jp: 'きょう は しごと の ことば を べんきょう します。', ro: 'kyou wa shigoto no kotoba wo benkyou shimasu.', id: 'Hari ini kita belajar kosakata kerja. 🍙🧓🏗🍶🌱🐄' })")
        total += len(shot(pg, 'dialog', w)); pg.locator('.dialog').click(); pg.wait_for_timeout(300)
        bg(pg, "Game.menu()"); total += len(shot(pg, 'menu', w))
        pg.click('.mi[data-a=settings]'); total += len(shot(pg, 'pengaturan', w)); pg.click('.settings [data-a=close]'); pg.wait_for_timeout(300)
        pg.click('.mi[data-a=chat]'); total += len(shot(pg, 'chat', w)); pg.click('.chat [data-a=close]'); pg.wait_for_timeout(300)
        pg.click('.mi[data-a=kerja]'); total += len(shot(pg, 'kerja_menu', w))
        pg.click('[data-kotoba=nogyo]'); total += len(shot(pg, 'kamus', w)); pg.click('.kj [data-a=close]'); pg.wait_for_timeout(300)
        pg.click('[data-list=kaigo]'); total += len(shot(pg, 'pilih_hari', w)); pg.click('.kj [data-a=close]'); pg.wait_for_timeout(300)
        pg.click('[data-info=chikusan]'); total += len(shot(pg, 'info', w)); pg.click('.kj [data-a=close]'); pg.wait_for_timeout(300)
        pg.click('.kj [data-a=close]'); pg.wait_for_timeout(300)
        if pg.locator('.modals.on .mi[data-a=close]').count(): pg.click('.modals.on .mi[data-a=close]')
        pg.wait_for_timeout(400)

        # semua isi menu (dibuka satu per satu, ditutup dengan tombol B di pad)
        for a in ['review', 'book', 'letters', 'drill', 'bag', 'friends', 'food', 'pets', 'fish', 'ach', 'quests', 'report', 'wardrobe']:
            bg(pg, "Game.menu()")
            if not pg.locator(f'.mi[data-a={a}]').count(): continue
            pg.click(f'.mi[data-a={a}]'); pg.wait_for_timeout(500)
            total += len(shot(pg, 'menu_' + a, w))
            for _ in range(6):
                if not (pg.locator('.panels.on').count() or pg.locator('.modals.on').count() or pg.locator('.dialog:not(.hide)').count()): break
                if pg.locator('.dialog:not(.hide)').count() and not pg.locator('.panels.on').count(): pg.locator('.dialog').click()
                else: pg.locator('.pad [data-btn=b]').dispatch_event('pointerdown')
                pg.wait_for_timeout(350)
            if pg.locator('.exit-x').count(): pg.once('dialog', lambda d: d.accept()); pg.locator('.exit-x').click(); pg.wait_for_timeout(300)
        # layar belajar & mini-game
        for name, js in [('kuis', "Lesson.quiz({ focus: ['あ','い','う'], count: 3, title: 'Kuis' })"), ('karuta', "Games.karuta({ pool: ['あ','い','う','え','お','か'], rounds: 3, title: 'Karuta' })"),
                         ('video', "Video.play({ kana: ['か'], title: 'Video: か' })"), ('menulis', "Games.shodoCard('あ', { title: 'Latihan Menulis', info: '1/1' })")]:
            bg(pg, js); pg.wait_for_timeout(800); total += len(shot(pg, name, w))
            pg.once('dialog', lambda d: d.accept())
            if pg.locator('.exit-x').count(): pg.locator('.exit-x').click()
            pg.wait_for_timeout(400); pg.evaluate("UI.closePanel(); UI.closeModal(); UI.hideDialog(); 0")
        bg(pg, "Kerja.day('food', 3)"); pg.wait_for_selector('.ws-obj.on', timeout=10000); total += len(shot(pg, 'kerja_ruang', w))
        # langsung ke tugas aksi: lewati sampai muncul .kj-target
        for _ in range(200):
            if pg.locator('.kj-target').count(): break
            if pg.locator('.ws-obj.on').count():
                pos = pg.evaluate("""() => { const t = document.querySelector('.ws-obj.on').textContent; for (const s of Object.values(Kerja._room.st)) if (t.includes(s.jp + ' ')) { const c = document.querySelector('.ws-stage canvas').getBoundingClientRect(); return [c.left + (s.x + .5) / 12 * c.width, c.top + (s.y + .5) / 7 * c.height]; } }""")
                if pos: pg.mouse.click(*pos)
            elif pg.locator('.ws-next').count(): pg.locator('.ws-next').first.click()
            elif pg.locator('.ws-o:not([disabled])').count(): pg.locator('.ws-o:not([disabled])').first.click()
            elif pg.locator('.kj-tool').count():
                for k in ['water', 'soap', 'rub', 'rinse', 'dry', 'alc']: pg.locator(f'.kj-tool[data-k={k}]').click()
                total += len(shot(pg, 'cuci_tangan', w)); pg.keyboard.press('Escape'); break
            pg.wait_for_timeout(250)
        if pg.locator('.kj-target').count(): total += len(shot(pg, 'aksi', w))
        ctx.close()
    print('TOTAL MASALAH:', total, '| ERRORS:', H.errors or 'none')
