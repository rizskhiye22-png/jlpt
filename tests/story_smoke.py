"""Uji asap cerita v3: prolog, loteng (Hari 9), Surat #1 (Hari 11), Peta Harta (Hari 15), save lama (migrasi).
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/story_smoke.py"""
import json, sys, time, functools
print = functools.partial(print, flush=True)
from playwright.sync_api import sync_playwright

URL = 'http://localhost:4173/'
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
HIRA = list('あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん')
errors = []

def drive(page, done, limit=300, label=''):
    for it in range(limit):
        if done(): return True
        if it % 15 == 0: print('   ·', label, it, ev(page, "[Save.d.day, Save.d.step, Game.busy, document.querySelector('.dialog')?.innerText?.slice(0,40), document.querySelector('.panels')?.innerText?.slice(0,40), document.querySelector('.modals')?.innerText?.slice(0,30)]"))
        if page.locator('.choices .choice').count(): page.keyboard.press('1')
        elif page.locator('.dialog:not(.hide)').count(): page.keyboard.press('Space')
        elif page.locator('.board').count():
            b = page.locator('.board:not(.solid):not(.hollow)').first
            if b.count(): b.click()
        elif page.locator('.timecard').count(): page.locator('.timecard').click()
        elif page.locator('[data-a=sleep]').count(): page.locator('[data-a=sleep]').click()
        elif page.locator('.letterbox [data-a=close]').count(): page.locator('.letterbox [data-a=close]').click()
        elif page.locator('.modals.on button').count(): page.locator('.modals.on button').last.click()
        elif page.locator('.panels.on button').count(): page.locator('.panels.on button').last.click()
        page.wait_for_timeout(150)
    print('TIMEOUT', label); return False

CTX = {}
def boot(page, save=None):
    # konteks browser baru per bagian (tanpa sisa service worker / state lama)
    if CTX.get('ctx'): CTX['ctx'].close()
    ctx = CTX['br'].new_context(viewport={'width': 420, 'height': 860}, service_workers='block')
    pg = ctx.new_page(); CTX['ctx'] = ctx
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: m.type == 'error' and 'Failed to load resource' not in m.text and errors.append('console: ' + m.text))
    fast = {'settings': {'romaji': True, 'voice': False, 'sfx': False, 'rate': 0.85, 'music': 0, 'relax': True, 'quality': 'low', 'fx': False, 'text': 'instant', 'force2d': True, 'narr': False, 'server': '', 'online': False}}
    pg.goto(URL)
    if not save: save = {}
    save = {**save, **fast}
    if save:
        pg.evaluate("s => localStorage.setItem('nihongo-gakkou-v2', JSON.stringify(s))", save)
        pg.reload()
    pg.wait_for_selector('.title', timeout=30000)
    print('  boot ok', 'hari', save.get('day'))
    return pg

def ev(page, js): return page.evaluate(js)

with sync_playwright() as p:
    br = p.chromium.launch(args=['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'])
    CTX['br'] = br

    # 1) Game baru → prolog
    page = boot(None)
    page.click('[data-a=new]')
    page.fill('.name-in', 'Rizki')
    page.click('.wardrobe [data-a=ok]')
    ok = drive(page, lambda: ev(page, "Save.d.story && Save.d.story.flags.prolog_done && !Game.busy"), label='prolog')
    print('prolog:', ok, ev(page, "Object.keys(Save.d.story.flags)"), ev(page, "document.querySelector('.hud-day').textContent"))
    page.screenshot(path=f'{OUT}/01_setelah_prolog.png')

    # 2) Hari 9 malam → loteng
    base = ev(page, "JSON.parse(JSON.stringify(Save.d))")
    s = dict(base); s['day'] = 9; s['step'] = 'night'; s['kana'] = HIRA[:43]
    s['story'] = {'v': 3, 'flags': {'prolog_done': 1, 'attic_seen': 1, 'key_found': 6, 'attic_promise': 7}, 'seen': ['c1_sensei', 'c1_d2_dinner', 'c1_d5_yuki', 'c1_d7_key'], 'items': ['key'], 'pages': [], 'opened': []}
    page = boot(page, s); page.click('[data-a=cont]')
    drive(page, lambda: not ev(page, "Game.busy") and not page.locator('.dialog:not(.hide)').count(), 80, 'lanjut')
    print('  tidur…')
    page.evaluate("void Game.interact({type:'bed'})")
    drive(page, lambda: ev(page, "Save.d.day === 10 && !Game.busy"), label='hari9')
    print('hari9 loteng:', ev(page, "!!Save.d.story.flags.attic_opened"), ev(page, "Save.d.story.items"))
    page.evaluate("void ReactUI.letters()"); page.wait_for_selector('.letterbox')
    page.screenshot(path=f'{OUT}/02_kotak_surat.png')
    page.locator('.lt-env').first.click(); page.wait_for_selector('.lt-paper')
    print('surat #1 (43 huruf):', page.locator('.lt-bar i').get_attribute('style'), 'kabur:', page.locator('.tk.blur').count())
    page.locator('.tk.blur').first.click(); page.wait_for_timeout(200)
    page.screenshot(path=f'{OUT}/03_surat1_kabur.png')
    page.locator('.letterbox [data-a=close]').click()

    # 3) Hari 11 malam → membaca Surat #1
    s = ev(page, "JSON.parse(JSON.stringify(Save.d))"); s['day'] = 11; s['step'] = 'night'; s['kana'] = HIRA
    page = boot(page, s); page.click('[data-a=cont]')
    drive(page, lambda: not ev(page, "Game.busy") and not page.locator('.dialog:not(.hide)').count(), 80, 'lanjut')
    print('  tidur…')
    page.evaluate("void Game.interact({type:'bed'})")
    seen_reader = [False]
    def until11():
        if page.locator('.lt-paper').count() and not seen_reader[0]:
            seen_reader[0] = True; page.screenshot(path=f'{OUT}/04_surat1_hari11.png')
        return ev(page, "Save.d.day === 12 && !Game.busy")
    drive(page, until11, label='hari11')
    print('hari11:', ev(page, "[!!Save.d.story.flags.letter1_read, Save.d.story.pages]"), 'reader muncul:', seen_reader[0])

    # 4) Hari 15 sore: Mai + peta harta (NPC cerita di kota)
    s = ev(page, "JSON.parse(JSON.stringify(Save.d))"); s['day'] = 15; s['step'] = 'after'
    s['kana'] = HIRA + list('アイウエオカキクケコサシスセソタチツテト')
    page = boot(page, s); page.click('[data-a=cont]')
    drive(page, lambda: not ev(page, "Game.busy") and not page.locator('.dialog:not(.hide)').count(), 80, 'lanjut')
    has_mai = ev(page, "Story.npcs('town').map(n => n.id)")
    print('NPC cerita di kota:', has_mai)
    page.evaluate("void Game.interact({type:'npc', npc: Story.npcs('town')[0]})")
    drive(page, lambda: ev(page, "!!Save.d.story.flags.treasure_map && !Game.busy"), label='mai')
    page.evaluate("void ReactUI.letters({tab:'map'})"); page.wait_for_selector('.tm-paper')
    page.screenshot(path=f'{OUT}/05_peta_harta.png')
    page.locator('.letterbox [data-a=close]').click()

    # 5) Save lama (v2, tanpa story) di hari 18
    s = ev(page, "JSON.parse(JSON.stringify(Save.d))"); s.pop('story'); s['day'] = 18; s['step'] = 'wake'
    page = boot(page, s); page.click('[data-a=cont]')
    drive(page, lambda: not ev(page, "Game.busy") and not page.locator('.dialog:not(.hide)').count(), 120, 'migrasi')
    print('migrasi:', ev(page, "[Save.d.story.migrated, Object.keys(Save.d.story.flags).length, Save.d.story.pages, Story.lettersAvailable().map(l=>l.id)]"))

    # 6) Video pelajaran Hari 1 memakai naskah tetap
    shots = ev(page, "(() => { const v = Voice.kana('あ'); return [v.intro, Voice.text(v.read), Voice.ttsText(Voice.text(v.read))]; })()")
    print('naskah video あ:', shots)
    br.close()

print('ERRORS:', len(errors)); [print(' ', e) for e in errors[:20]]
