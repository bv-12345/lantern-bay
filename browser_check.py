"""Reproducible simulated learner journeys; no child data is collected."""
import json
import functools
import http.server
import threading
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).parent
class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server = http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(QuietHandler,directory=str(ROOT)))
threading.Thread(target=server.serve_forever,daemon=True).start()
BASE = f'http://127.0.0.1:{server.server_port}/'
results = []

def dismiss(page):
    if page.locator('#demo-done').count(): page.locator('#demo-done').click()

def resize_checks(page, label):
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), label+' horizontal overflow'
    assert page.locator('.slot').count()==10, label+' slots'
    for box in page.locator('.slot').all():
        r=box.bounding_box()
        assert r['width']>=48 and r['height']>=48, (label,r)

def solve(page, delta):
    for _ in range(abs(delta)): page.locator('#plus' if delta>0 else '#minus').click()
    page.locator('#check').click()
    assert page.locator('#next').count()==1, page.locator('#feedback').inner_text()

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True,args=['--no-sandbox'])
    version = browser.version
    for width in (360,768,1280):
        context=browser.new_context(viewport={'width':width,'height':900},has_touch=width==360,reduced_motion='reduce')
        page=context.new_page(); errors=[]; external=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        page.on('request',lambda req: external.append(req.url) if not req.url.startswith(BASE) else None)
        page.goto(BASE)
        assert page.title().startswith('Lantern Bay')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
        page.screenshot(path=str(ROOT/f'evidence/01-welcome-{width}.png'),full_page=True)
        page.locator('#start').click();dismiss(page)
        resize_checks(page,str(width))
        # Wrong answer, hint, replay, and reset do not mark completion.
        page.locator('#check').click();assert "another look" in page.locator('#feedback').inner_text()
        page.locator('#hint').click();assert 'Touch each light' in page.locator('#feedback').inner_text()
        page.locator('#scaffold').select_option('explore');assert page.locator('.slot-number').first.inner_text()=='·'
        page.locator('#scaffold').select_option('together')
        page.locator('#replay-demo').click();dismiss(page)
        page.locator('#retry').click();assert page.locator('progress').get_attribute('value')=='0'
        # Numeral quantity is independent of placement; includes zero and ten.
        for i in [9,4,7]:
            if width==360: page.locator(f'#slot-{i}').tap()
            else: page.locator(f'#slot-{i}').click()
        page.locator('#check').click();assert page.locator('#next').count()==1
        page.screenshot(path=str(ROOT/f'evidence/02-build-{width}.png'),full_page=True)
        page.locator('#check').click();assert page.locator('progress').get_attribute('value')=='1'
        page.locator('#next').click();solve(page,0)
        assert 'Zero is a number' in page.locator('#feedback').inner_text()
        page.locator('#next').click();solve(page,7)
        page.locator('#next').click();solve(page,10)
        page.locator('#next').click();dismiss(page)
        # All number bonds, including seven plus three, five plus five, zero plus ten.
        for i,start in enumerate([7,5,0,8,2,6]):
            resize_checks(page,f'{width} bond{i}')
            solve(page,10-start)
            assert page.locator('.equation').inner_text()==f'{start} + {10-start} = 10'
            if i==0:page.screenshot(path=str(ROOT/f'evidence/03-make-ten-{width}.png'),full_page=True)
            page.locator('#next').click()
        dismiss(page)
        # All six story equations are based on the declared situation.
        for i,delta in enumerate([3,-4,4,-2,5,-4]):
            solve(page,delta)
            if i==1:
                assert page.locator('.equation').inner_text()=='9 − 4 = 5'
                page.screenshot(path=str(ROOT/f'evidence/04-story-{width}.png'),full_page=True)
            page.locator('#next').click()
        # Fresh transfer, with optional hints.
        page.locator('#hint').click();solve(page,6)
        page.locator('#next').click();solve(page,-2)
        assert page.locator('.equation').inner_text()=='10 − 2 = 8'
        page.screenshot(path=str(ROOT/f'evidence/05-final-{width}.png'),full_page=True)
        page.locator('#next').click()
        assert 'A whole bay of discoveries.' in page.locator('h1').inner_text()
        page.screenshot(path=str(ROOT/f'evidence/06-summary-{width}.png'),full_page=True)
        page.locator('#reset-all').click();page.locator('#start').click();dismiss(page)
        assert page.locator('progress').get_attribute('value')=='0'
        assert '0 lights' in page.locator('#quantity').inner_text()
        # Keyboard activation, focus preservation and bounded subtraction.
        page.locator('#slot-0').focus();page.keyboard.press('Space')
        assert page.locator('#slot-0').get_attribute('aria-pressed')=='true'
        assert page.evaluate('document.activeElement.id')=='slot-0'
        page.keyboard.press('Space');assert page.locator('#slot-0').get_attribute('aria-pressed')=='false'
        page.locator('#plus').focus();page.keyboard.press('Enter');assert '1 light' in page.locator('#quantity').inner_text()
        page.keyboard.press('Tab');assert page.evaluate('!!document.activeElement.id')
        page.locator('#minus').click();page.locator('#minus').click();assert '0 lights' in page.locator('#quantity').inner_text()
        # Voice unavailable fallback and no hard dependency on speech APIs.
        page.evaluate('window.speechSynthesis.getVoices = () => []')
        page.locator('#read').click();assert 'Read together:' in page.locator('#feedback').inner_text()
        page.locator('#mute').click();assert page.locator('#mute').inner_text()=='Text mode'
        page.locator('#exit').click();assert page.locator('#start').count()==1
        page.reload();assert page.locator('#start').count()==1
        assert not errors,errors
        assert not external,external
        results.append({'viewport':f'{width}x900','browser':'Chromium '+version,'result':'pass','touch_emulated':width==360,'reduced_motion':True,'page_errors':errors,'external_requests':external,'journey':'all 18 tasks, retry, reset, hints, two scaffolds, keyboard activation, speech unavailable fallback, refresh'})
        context.close()
    browser.close()
(ROOT/'evidence/browser-results.json').write_text(json.dumps(results,indent=2)+'\n')
server.shutdown()
print(json.dumps(results,indent=2))
