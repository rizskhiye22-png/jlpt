"""Uji riwayat chat tidak hilang: (1) tetap ada setelah muat ulang & reset game,
(2) pemain baru melihat pesan lama dari broker (retained) walau pengirim sudah offline.
Butuh broker MQTT WebSocket lokal di ws://localhost:8888. Jalankan: python3 tests/chat_log.py"""
import sys, os, functools
print = functools.partial(print, flush=True)
sys.path.insert(0, os.path.dirname(__file__))
from playwright.sync_api import sync_playwright
from chat_test import player
import helpers as H

with sync_playwright() as p:
    br = p.chromium.launch(executable_path=os.environ.get('PW_CHROMIUM') or None)
    a = player(br, 'Rizki'); a.wait_for_function("Chat.status === 'on'", timeout=15000)
    tag = str(os.getpid())
    a.evaluate(f"Chat.send('log satu {tag}', 'all')"); a.wait_for_timeout(2700)
    a.evaluate(f"Chat.send('log dua {tag}', 'all')"); a.wait_for_timeout(800)
    texts = lambda pg: [m['t'] for m in pg.evaluate("Chat.messages") if tag in m['t']]
    print('A sebelum reload:', texts(a))
    a.reload(); a.wait_for_selector('.title', timeout=30000); a.wait_for_timeout(800)
    print('A setelah reload:', texts(a), '| milik sendiri:', all(m['me'] for m in a.evaluate("Chat.messages") if tag in m['t']))
    a.evaluate("Save.reset()"); a.reload(); a.wait_for_selector('.title', timeout=30000); a.wait_for_timeout(800)
    print('A setelah reset game:', texts(a))
    a.context.close()
    c = player(br, 'Baru'); c.wait_for_function("Chat.status === 'on'", timeout=15000); c.wait_for_timeout(1000)
    print('Pemain baru (A offline) melihat:', texts(c))
    c.evaluate("setTimeout(() => Chat.panel()); 0"); c.wait_for_timeout(600)
    print('di panel:', [t for t in c.locator('.chat-list .cm-t').all_inner_texts() if tag in t])
    print('ERRORS:', H.errors or 'none')
