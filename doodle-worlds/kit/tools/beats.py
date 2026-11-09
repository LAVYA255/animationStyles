"""Contact sheet of chosen story moments, straight from index.html (no render needed).
Usage: python tools/beats.py <project_dir> <out.png> "0.1,1.0,3.9,6.2" [cols]
Each tile is labelled with its time. Read it before rendering: every beat should read as a still."""
import io, os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "tools", "doodle"))
import doodle
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw
folder, out = sys.argv[1], sys.argv[2]; times = [float(x) for x in sys.argv[3].split(",")]
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 7; sc = 0.25
srv, url = doodle.serve(folder)
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920})
    pg.goto(url + "index.html"); pg.wait_for_function("!!(window.__timelines && window.__timelines.root)")   # never return the timeline itself
    tiles = []
    for t in times:
        pg.evaluate(f"window.__render({t})")
        im = Image.open(io.BytesIO(pg.screenshot())).convert("RGB").resize((int(1080 * sc), int(1920 * sc)))
        ImageDraw.Draw(im).text((6, 6), f"{t:.2f}", fill=(255, 0, 0)); tiles.append(im)
    b.close()
rows = (len(tiles) + cols - 1) // cols; W, H = tiles[0].size
sheet = Image.new("RGB", (W * cols, H * rows), "white")
for i, im in enumerate(tiles): sheet.paste(im, ((i % cols) * W, (i // cols) * H))
sheet.save(out); print(out)
