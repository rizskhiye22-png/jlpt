"""Uji audio ala iOS (v3.6.1) di Chromium dengan user agent iPhone:
AudioContext bersama, bangun lagi setelah suspend lewat ketukan, sesi 'playback', audio senyap (iOS lama), elemen rekaman dipakai ulang.
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/audio_ios.py"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))
exec(open(os.path.join(os.path.dirname(__file__), 'helpers.py')).read())
UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
SPY = """
window.__plays = [];
const op = HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play = function () { window.__plays.push(this.src.slice(0, 5)); return op.call(this).catch(() => {}); };
"""
def run(session):
    ctx = CTX['br'].new_context(viewport={'width': 390, 'height': 844}, user_agent=UA, has_touch=True, is_mobile=True, service_workers='block')
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.add_init_script(SPY + ("navigator.audioSession = { type: 'auto' };" if session else ""))
    pg.goto(URL); pg.wait_for_selector('.title', timeout=30000)
    before = pg.evaluate("[Sound.isIOS, Sound.getCtx().state, navigator.audioSession ? navigator.audioSession.type : null]")
    pg.locator('[data-a]').first.click(); pg.wait_for_timeout(400)
    after = pg.evaluate("[Sound.getCtx().state, navigator.audioSession ? navigator.audioSession.type : null, window.__plays.length]")
    pg.evaluate("Sound.getCtx().suspend()"); pg.wait_for_timeout(200)
    mid = pg.evaluate("Sound.getCtx().state")
    pg.mouse.click(200, 400); pg.wait_for_timeout(300)
    woke = pg.evaluate("Sound.getCtx().state")
    shared = pg.evaluate("(() => { Music.play('night'); return true; })()")
    media = pg.evaluate("Sound.playMedia('audio/tidak-ada.mp3', 1, 2000).then(() => 'selesai')")
    print(f"sesi={'ada' if session else 'iOS lama'} | awal:{before} | setelah ketuk:{after} | suspend:{mid} → ketuk:{woke} | musik:{shared} | rekaman hilang:{media}")
    ctx.close()
    return woke == 'running'
with sync_playwright() as p:
    CTX['br'] = p.chromium.launch(args=['--autoplay-policy=user-gesture-required'])
    ok1 = run(True); ok2 = run(False)
    CTX['br'].close()
print('bangun lagi:', ok1, ok2)
print('ERRORS:', len(errors)); [print(' ', e) for e in errors[:20]]
