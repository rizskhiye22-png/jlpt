"""Uji Chat semua pemain: dua pemain saling kirim pesan lewat broker MQTT.
Butuh broker MQTT WebSocket lokal di ws://localhost:8888 (mis. aedes + websocket-stream).
Jalankan: npm run build && npx vite preview --port 4173 &  lalu  python3 tests/chat_test.py [folder_screenshot]"""
import sys, os, functools
print = functools.partial(print, flush=True)
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
import helpers as H
OUT = sys.argv[1] if len(sys.argv) > 1 else '.'

def player(br, name):
    ctx = br.new_context(viewport={'width': 420, 'height': 860}, service_workers='block')
    pg = ctx.new_page(); pg.on('pageerror', lambda e: H.errors.append(name + ': ' + str(e)))
    pg.goto(H.URL)
    save = {**H.base(12, 'after'), 'name': name, 'settings': {**H.FAST, 'chat': True, 'chatBroker': 'ws://localhost:8888'}}
    pg.evaluate("s => localStorage.setItem('nihongo-gakkou-v2', JSON.stringify(s))", save)
    pg.reload(); pg.wait_for_selector('.title', timeout=30000); pg.click('[data-a=cont]'); pg.wait_for_timeout(2500)
    for _ in range(40):
        if pg.locator('.dialog:not(.hide)').count(): pg.locator('.dialog').click(); pg.wait_for_timeout(150)
        else: break
    return pg

if __name__ == '__main__':
  with sync_playwright() as p:
        br = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
        a, b = player(br, 'Rizki'), player(br, 'Sari')
        for pg in (a, b): pg.wait_for_function("Chat.status === 'on'", timeout=15000)
        print('status:', a.evaluate('Chat.status'), b.evaluate('Chat.status'))
        a.evaluate("setTimeout(() => Chat.panel()); 0"); b.evaluate("setTimeout(() => Chat.panel()); 0"); a.wait_for_timeout(600)
        a.fill('.chat-form input', 'Halo Sari! こんにちは'); a.click('.chat-form button'); a.wait_for_timeout(800)
        print('Sari menerima:', b.locator('.chat-list .cm-t').all_inner_texts())
        b.wait_for_timeout(2600); b.click('.cq >> nth=1'); b.wait_for_timeout(800)
        a.wait_for_timeout(2600); a.fill('.chat-form input', 'wa aku 081234567890 anjing'); a.click('.chat-form button'); a.wait_for_timeout(800)
        print('Rizki melihat:', a.locator('.chat-list .cm-t').all_inner_texts())
        print('Sari melihat :', b.locator('.chat-list .cm-t').all_inner_texts())
        print('jumlah aktif (Sari):', b.locator('.chat-st').inner_text())
        b.screenshot(path=f'{OUT}/chat_sari.png')
        # kanal "Di sini": Sari pindah peta → pesan Di sini dari Rizki tidak tampil
        b.click('[data-tab=here]'); a.click('[data-tab=here]')
        b.evaluate("setTimeout(() => Game.h.goTo('umi', 5, 5, 'down')); 0"); b.wait_for_timeout(1500); print('peta Sari:', b.evaluate('World.map'))
        a.wait_for_timeout(2600); a.fill('.chat-form input', 'ada yang di kota?'); a.click('.chat-form button'); a.wait_for_timeout(800)
        print('pesan Di sini yang diterima Sari:', b.evaluate("Chat.messages.filter(m => m.ch === 'here').map(m => m.t)"))
        print('Di sini — Rizki:', a.locator('.chat-list .cm-t').all_inner_texts(), '| Sari (di pantai):', b.locator('.chat-list .cm-t').all_inner_texts())
        # bisukan: Sari membisukan Rizki
        b.click('[data-tab=all]'); b.once('dialog', lambda d: d.accept())
        b.locator('.cm-n', has_text='Rizki').first.click(); b.wait_for_timeout(300)
        a.click('[data-tab=all]'); a.wait_for_timeout(2600); a.fill('.chat-form input', 'pesan setelah dibisukan'); a.click('.chat-form button'); a.wait_for_timeout(800)
        print('Sari setelah membisukan Rizki:', b.locator('.chat-list .cm-t').all_inner_texts())
        # pad tetap bisa: B menutup panel chat
        b.locator('.pad [data-btn=b]').dispatch_event('pointerdown'); b.wait_for_timeout(300)
        print('B menutup chat:', b.locator('.chat').count() == 0)
        print('ERRORS:', H.errors or 'none')
