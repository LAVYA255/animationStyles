"""Render a reel's asset_sheet.html to out/asset_sheet.png (2400x2700). Usage: python sheet.py <reel_dir>"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "tools", "doodle"))
import doodle
from playwright.sync_api import sync_playwright
R = sys.argv[1]; out = os.path.join(R, "out", "asset_sheet.png"); srv, url = doodle.serve(R)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 2400, "height": 2700}); errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.goto(url + "asset_sheet.html")
    try: pg.wait_for_function("document.title === 'done'", timeout=20000)
    except Exception: pass
    pg.screenshot(path=out); b.close()
print(out, ("ERRORS: " + "; ".join(errs)) if errs else "ok")
