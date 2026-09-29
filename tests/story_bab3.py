"""Uji Bab 3: kuis dakuten, video kanji, kasir kafe, pantai (Hari 29), Pasar Pagi & Surat #6 (Hari 34), tamat Bab 3.
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/story_bab3.py [folder_screenshot]"""
import sys, functools
from playwright.sync_api import sync_playwright
print = functools.partial(print, flush=True)
URL = 'http://localhost:4173/'
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'
HIRA = list('あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん')
KATA = list('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン')
DAKU = list('がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ')
KANJI = list('一二三四五六七八九十百円千万')
FAST = {'romaji': True, 'voice': False, 'sfx': False, 'rate': 0.85, 'music': 0, 'relax': True, 'quality': 'low', 'fx': False, 'text': 'instant', 'force2d': True, 'narr': False, 'server': '', 'online': False}
errors = []
CTX = {}

def ev(page, js): return page.evaluate(js)

def kasir_step(page):
    try:
        words = page.locator('.ks-bubble .jp').inner_text().replace('。', '').split()
        items = page.locator('.ks-item:not(.on)')
        for i in range(items.count()):
            b = items.nth(i)
            if b.locator('b').inner_text() in words: b.click(timeout=2000); return True
        opt = page.locator('.ks-opt:not([disabled])')
        if opt.count(): opt.first.click(timeout=2000); return True
    except Exception:
        pass
    return False

def write_card(page):
    """Tulis huruf di kartu menulis dengan mengikuti jalur goresan KanjiVG."""
    try:
        pts = page.evaluate("""() => {
          const cv = document.querySelector('canvas.trace'); if (!cv) return null;
          const lines = document.querySelector('.panels').innerText.split('\\n').map(x => x.trim()).filter(Boolean);
          const k = lines.find(x => STROKES[x]); if (!k) return null;
          const r = cv.getBoundingClientRect();
          return STROKES[k].map(d => { const e = document.createElementNS('http://www.w3.org/2000/svg', 'path'); e.setAttribute('d', d);
            const L = e.getTotalLength(), N = Math.max(6, Math.round(L / 3)), out = [];
            for (let i = 0; i <= N; i++) { const q = e.getPointAtLength(L * i / N); out.push([r.left + r.width * (.06 + q.x * .88 / 109), r.top + r.height * (.06 + q.y * .88 / 109)]); }
            return out; });
        }""")
        if not pts: return False
        for stroke in pts:
            page.mouse.move(*stroke[0]); page.mouse.down()
            for x, y in stroke[1:]: page.mouse.move(x, y, steps=1)
            page.mouse.up()
        page.locator('[data-a=done]').click(timeout=2000); page.wait_for_timeout(300)
        page.locator('[data-a=done]').click(timeout=2000)
        return True
    except Exception as e:
        print('   write err', str(e)[:80]); return False

def drive(page, done, limit=400, label=''):
    for it in range(limit):
        if done(): return True
        if it % 25 == 0: print('   ·', label, it, ev(page, "[Save.d.day, Save.d.step, Game.busy, (document.querySelector('.dialog')||{}).innerText?.slice(0,30), (document.querySelector('.panels')||{}).innerText?.slice(0,30)]"))
        if page.locator('canvas.trace').count() and page.locator('[data-a=done]').count(): write_card(page)
        elif page.locator('.kasir').count(): kasir_step(page)
        elif page.locator('.quiz .opt:not([disabled])').count(): page.locator('.quiz .opt:not([disabled])').first.click()
        elif page.locator('.q-foot button').count(): page.locator('.q-foot button').click()
        elif page.locator('.choices .choice').count(): page.keyboard.press('1')
        elif page.locator('.dialog:not(.hide)').count(): page.keyboard.press('Space')
        elif page.locator('.timecard').count(): page.locator('.timecard').click()
        elif page.locator('[data-a=sleep]').count(): page.locator('[data-a=sleep]').click()
        elif page.locator('.letterbox [data-a=close]').count(): page.locator('.letterbox [data-a=close]').click()
        elif page.locator('.modals.on button:not([disabled])').count(): page.locator('.modals.on button:not([disabled])').last.click()
        elif page.locator('.panels.on button:not([disabled])').count(): page.locator('.panels.on button:not([disabled])').last.click()
        page.wait_for_timeout(120)
    print('TIMEOUT', label); return False

def boot(save):
    if CTX.get('ctx'): CTX['ctx'].close()
    ctx = CTX['br'].new_context(viewport={'width': 420, 'height': 860}, service_workers='block')
    pg = ctx.new_page(); CTX['ctx'] = ctx
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: m.type == 'error' and 'Failed to load resource' not in m.text and errors.append('console: ' + m.text))
    pg.goto(URL)
    pg.evaluate("s => localStorage.setItem('nihongo-gakkou-v2', JSON.stringify(s))", {**save, 'settings': FAST})
    pg.reload(); pg.wait_for_selector('.title', timeout=30000)
    pg.click('[data-a=cont]')
    pg.evaluate("Save.d.story.seen = Story._debug.SCENES.filter(s => s.from < Save.d.day && !s.slot.startsWith('event:')).map(s => s.id)")
    drive(pg, lambda: not ev(pg, "Game.busy") and not pg.locator('.dialog:not(.hide)').count(), 80, 'start')
    return pg

def base(day, step, extra_flags=None, kana=None):
    flags = {f: 1 for f in ['prolog_done', 'attic_seen', 'key_found', 'attic_promise', 'attic_opened', 'letterbox_unlocked', 'letter1_read', 'ch1_done', 'letter2_open', 'treasure_map', 'page2', 'sato_knows', 'letter3_open', 'letter3_read', 'ch2_done']}
    flags.update(extra_flags or {})
    return {'name': 'Rizki', 'day': day, 'step': step, 'kana': kana or HIRA + KATA, 'friends': {'yuki': 8, 'kenta': 6, 'hana': 6},
            'story': {'v': 3, 'flags': flags, 'seen': [], 'items': ['key', 'sepia', 'map1976', 'camera'], 'pages': [1, 2], 'opened': []}}

with sync_playwright() as p:
    CTX['br'] = p.chromium.launch()
    # 1) data & kuis
    page = boot(base(28, 'wake', kana=HIRA + KATA + DAKU + KANJI[:5]))
    info = ev(page, "[DAYS.length, CHAPTERS.map(c=>c.n+':'+c.from+'-'+c.to).join(' '), Object.keys(KANA).length, weatherFor(23), EVENT_BY_DAY[24], STROKES['が'].length, STROKES['百'].length]")
    print('data:', info)
    page.evaluate("void Lesson.quiz({ focus: [], count: 3, title: 'Tes', pool: 'daku' }).then(r => { window.__qr = r; UI.closePanel(); })")
    page.wait_for_selector('.quiz')
    q = ev(page, "[document.querySelector('.q-main').innerText, [...document.querySelectorAll('.opt')].map(b=>b.innerText)]")
    print('kuis dakuten:', q)
    page.screenshot(path=f'{OUT}/b3_01_kuis.png')
    drive(page, lambda: ev(page, "!!window.__qr"), 60, 'kuis'); print('hasil kuis:', ev(page, "window.__qr"))
    # video kanji: pastikan naskah tetap dipakai
    page.evaluate("void Video.play({ kana: ['一'], title: 'Video: 一', day: 27 })")
    page.wait_for_selector('.video'); page.wait_for_timeout(1500)
    page.screenshot(path=f'{OUT}/b3_02_video_kanji.png')
    page.locator('[data-a=skip]').click(); page.wait_for_timeout(300)
    ev(page, "UI.closePanel()")
    # buku catatan tab Tenten
    page.evaluate("void Game.menu()"); page.wait_for_selector('.menu-grid')
    page.locator('[data-a=book]').click(); page.wait_for_selector('.book')
    page.locator('[data-tab=daku]').click(); page.wait_for_timeout(300)
    page.screenshot(path=f'{OUT}/b3_03_buku_tenten.png')
    print('tab buku:', ev(page, "[...document.querySelectorAll('.tab')].map(t=>t.innerText)"))

    # 2) Kerja paruh waktu di kafe (Hari 26: bingkai → halaman #4)
    page = boot(base(26, 'after', {'baito_cafe': 24}, HIRA + KATA + DAKU))
    page.evaluate("void Game.warp({ to: 'kafe', tx: 5, ty: 7, dir: 'up' })")
    drive(page, lambda: ev(page, "World.map === 'kafe' && !Game.busy"), 40, 'ke kafe')
    page.evaluate("void Game.interact({ type: 'npc', npc: { id: 'mama' } })")
    drive(page, lambda: ev(page, "!!Save.d.story.flags.page4 && !Game.busy"), 200, 'bingkai')
    print('halaman #4:', ev(page, "Save.d.story.pages"), 'kota:', ev(page, "Save.d.story.town"))
    page.evaluate("void Game.interact({ type: 'npc', npc: { id: 'mama' } })")
    page.wait_for_selector('.choices .choice'); page.keyboard.press('1')
    for _ in range(30):
        if page.locator('.kasir').count(): break
        page.keyboard.press('Space'); page.wait_for_timeout(200)
    page.wait_for_timeout(400)
    page.screenshot(path=f'{OUT}/b3_04_kasir.png')
    drive(page, lambda: ev(page, "Save.d.story.baitoDay === 26 && !Game.busy"), 200, 'kasir')
    print('kasir selesai:', ev(page, "[Save.d.story.baito, Save.d.points]"))

    # 3) Hari 29 sore: pantai
    page = boot(base(29, 'after', {'baito_cafe': 24, 'page4': 26}, HIRA + KATA + DAKU + KANJI[:5]))
    npc = ev(page, "DAYS[28].brk.npc")
    page.evaluate("void Game.interact({ type: 'npc', npc: World.npcs ? (World.npcs.find(n => n.script) || { id: DAYS[28].brk.npc, script: DAYS[28].brk }) : { id: DAYS[28].brk.npc, script: DAYS[28].brk } })")
    shot = [False]
    def at_beach():
        if not shot[0] and ev(page, "World.map === 'umi'"): shot[0] = True; page.screenshot(path=f'{OUT}/b3_05_pantai.png')
        return ev(page, "!!Save.d.story.flags.page3 && !Game.busy")
    drive(page, at_beach, 200, 'pantai')
    print('pantai:', ev(page, "[Save.d.story.pages, Save.d.step, World.map]"), 'sempat di umi:', shot[0])

    # 4) Hari 34 sore: Pasar Pagi, lalu malam: Surat #6, lalu tamat bab
    page = boot(base(34, 'after', {'baito_cafe': 24, 'page4': 26, 'page3': 29, 'market_plan': 32, 'letter5_open': 28}, HIRA + KATA + DAKU + KANJI))
    page.evaluate("void Game.interact({ type: 'npc', npc: { id: DAYS[33].brk.npc, script: DAYS[33].brk } })")
    drive(page, lambda: ev(page, "!!Save.d.story.flags.market_done && !Game.busy"), 400, 'pasar')
    print('pasar:', ev(page, "[Save.d.story.town, Save.d.step]"))
    ev(page, "Save.d.step = 'night'")
    page.evaluate("void Game.interact({ type: 'bed' })")
    seen = [False]
    def until_end():
        if page.locator('.lt-paper').count() and not seen[0]:
            seen[0] = True; page.screenshot(path=f'{OUT}/b3_06_surat6.png')
        return ev(page, "Save.d.day === 35")
    drive(page, until_end, 300, 'malam34')
    page.wait_for_timeout(800)
    page.screenshot(path=f'{OUT}/b3_07_tamat.png')
    print('akhir bab:', ev(page, "[!!Save.d.story.flags.ch3_done, !!Save.d.story.flags.letter6_read, Save.d.day]"), 'surat tampil:', seen[0])
    # Jurnal
    page = boot(base(35, 'wake', {'journal_unlocked': 23, 'mori_met': 4, 'cafe_photo_seen': 19, 'page3': 29, 'mori_cafe': 30, 'letter6_read': 34}, HIRA + KATA + DAKU + KANJI))
    page.evaluate("void ReactUI.letters({ tab: 'journal' })"); page.wait_for_selector('.jr-board')
    page.screenshot(path=f'{OUT}/b3_08_jurnal.png')
    print('surat tersedia:', ev(page, "Story.lettersAvailable().map(l=>l.id)"))
    CTX['br'].close()
print('ERRORS:', len(errors)); [print(' ', e) for e in errors[:20]]
