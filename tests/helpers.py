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
FAST = {'romaji': True, 'voice': False, 'sfx': False, 'rate': 0.85, 'music': 0, 'relax': True, 'quality': 'low', 'fx': False, 'text': 'instant', 'force2d': True, 'narr': False, 'yt': False, 'server': '', 'online': False}
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
          let k = lines.find(x => STROKES[x]);
          if (!k) { const ro = lines.find(x => Object.keys(KANA).some(c => KANA[c].ro === x)); k = ro && Save.d.kana.find(c => KANA[c] && KANA[c].ro === ro && STROKES[c]); }
          if (!k) return null;
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

def ff_step(page):
    try:
        page.evaluate("""() => { const ro = (document.querySelector('.ff-game .muted b') || {}).textContent;
          const b = [...document.querySelectorAll('.ff:not([disabled])')].find(x => KANA[x.dataset.k] && KANA[x.dataset.k].ro === ro); if (b) b.click(); }""")
    except Exception: pass

def taiko_step(page):
    try:
        page.evaluate("""() => { const k = document.querySelector('.tk-note').textContent; const ro = KANA[k] && KANA[k].ro;
          const b = [...document.querySelectorAll('.tk-drum:not([disabled])')].find(x => x.querySelector('small').textContent === ro); if (b) b.click(); }""")
    except Exception: pass

def drive(page, done, limit=400, label=''):
    for it in range(limit):
        if done(): return True
        if it % 25 == 0: print('   ·', label, it, ev(page, "[Save.d.day, Save.d.step, Game.busy, (document.querySelector('.dialog')||{}).innerText?.slice(0,30), (document.querySelector('.panels')||{}).innerText?.slice(0,30)]"))
        if page.locator('.ff-game').count(): ff_step(page)
        elif page.locator('.taiko').count(): taiko_step(page)
        elif page.locator('canvas.trace').count() and page.locator('[data-a=done]').count(): write_card(page)
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

