"""doodle: pick icons and single-stroke fonts for doodle-kit.js and put them (plus the libraries) into a HyperFrames project.

    python doodle.py icons <word> [<word> ...]                search the 2,159 Lucide icons by name and tags (e.g. "brain idea")
    python doodle.py fonts                                    list the single-stroke fonts (Hershey / EMS)
    python doodle.py add <project> --icons brain,heart [--fonts HersheyScript1,EMSAllure]
                                                                -> <project>/assets/doodle/{icons,fonts}/ + assets/lib/{rough,svg2roughjs,doodle-kit}.js
    python doodle.py sheet [--fonts]                          render a specimen of every handwriting font (doodle/fonts_sheet.png)
"""
import argparse, json, os, shutil, subprocess, sys
if hasattr(sys.stdout, "reconfigure"): sys.stdout.reconfigure(encoding="utf-8", errors="replace")   # icon tags contain emoji

HERE = os.path.dirname(os.path.abspath(__file__)); ST = os.path.dirname(HERE)
NM = os.path.join(ST, "libs", "node_modules"); ICONS = os.path.join(NM, "lucide-static", "icons"); FONTS = os.path.join(NM, "hersheytext", "svg_fonts")
FONT_NOTES = {"HersheyScript1": "joined script, single stroke: classic handwriting", "HersheyScriptMed": "script, double stroke (bolder)",
              "EMSAllure": "elegant casual script", "EMSFelix": "informal print (marker on whiteboard)", "EMSElfin": "playful print",
              "EMSNixish": "neat print", "EMSReadability": "clean sans print", "EMSTech": "technical lettering", "EMSOsmotron": "round geometric",
              "HersheySans1": "single-stroke sans (engineering)", "HersheySerifMed": "serif", "HersheyGothEnglish": "blackletter"}


def cmd_icons(a):
    tags = json.load(open(os.path.join(NM, "lucide-static", "tags.json"), encoding="utf-8"))
    names = [f[:-4] for f in os.listdir(ICONS) if f.endswith(".svg")]
    words = [w.lower() for w in a.words]; hits = []
    for n in names:
        hay = n.replace("-", " ") + " " + " ".join(tags.get(n, []))
        score = sum((3 if w in n.split("-") else 2 if w in n else 1 if w in hay else 0) for w in words)
        if score: hits.append((score, n))
    for s, n in sorted(hits, key=lambda x: (-x[0], len(x[1])))[:40]: print("  %-28s %s" % (n, ", ".join(tags.get(n, [])[:6])))
    print("%d match(es)" % len(hits))


def cmd_fonts(a):
    for f in sorted(os.listdir(FONTS)):
        if f.endswith(".svg"): n = f[:-4]; print("  %-24s %s" % (n, FONT_NOTES.get(n, "")))


def cmd_add(a):
    proj = os.path.abspath(a.project); d = os.path.join(proj, "assets", "doodle"); os.makedirs(os.path.join(d, "icons"), exist_ok=True); os.makedirs(os.path.join(d, "fonts"), exist_ok=True)
    for n in [x for x in (a.icons or "").split(",") if x]:
        p = os.path.join(ICONS, n + ".svg")
        if not os.path.exists(p): raise SystemExit("no icon %r (try: doodle.py icons %s)" % (n, n.split("-")[0]))
        shutil.copy(p, os.path.join(d, "icons", n + ".svg"))
    for n in [x for x in (a.fonts or "").split(",") if x]:
        shutil.copy(os.path.join(FONTS, n + ".svg"), os.path.join(d, "fonts", n + ".svg"))
    shutil.copy(os.path.join(NM, "hersheytext", "LICENSE"), os.path.join(d, "fonts", "LICENSE-hershey.txt"))
    open(os.path.join(d, "fonts", "ATTRIBUTION.txt"), "w").write("The Hershey Fonts were originally created by Dr. A. V. Hershey while working at the U. S. National Bureau of Standards.\n"
                                                            "SVG conversion and EMS fonts: Windell H. Oskay, Evil Mad Scientist Laboratories (hersheytext, MIT).\nIcons: Lucide (ISC).\n")
    subprocess.run([sys.executable, os.path.join(ST, "libs", "libs.py"), "use", proj, "roughjs", "svg2roughjs", "doodle-kit"], check=True)


def cmd_sheet(a):
    """specimen of every handwriting font, rendered through doodle-kit itself (also a regression test of handwriting())."""
    from playwright.sync_api import sync_playwright
    tmp = os.path.join(HERE, "_specimen"); shutil.rmtree(tmp, ignore_errors=True); os.makedirs(os.path.join(tmp, "f"))
    fonts = sorted(f[:-4] for f in os.listdir(FONTS) if f.endswith(".svg"))
    for f in fonts: shutil.copy(os.path.join(FONTS, f + ".svg"), os.path.join(tmp, "f", f + ".svg"))
    shutil.copy(os.path.join(HERE, "doodle-kit.js"), tmp)
    html = """<html><body style="margin:0;background:#fffdf7"><svg id=s width=1800 height=%d></svg><script src="doodle-kit.js"></script><script>
    (async()=>{const fonts=%s;let y=70;for(const n of fonts){const f=await Doodle.loadFont('f/'+n+'.svg');
    const hw=Doodle.handwriting(document.getElementById('s'),n+'  The quick brown fox, 0123',{font:f,size:56,x:30,y:y,color:'#1b1b1b',width:2.4});hw.render(999);y+=82;}
    document.title='done';})();</script></body></html>""" % (82 * len(fonts) + 40, json.dumps(fonts))
    open(os.path.join(tmp, "index.html"), "w").write(html)
    out = os.path.join(HERE, "fonts_sheet.png")
    srv, url = serve(tmp)                                                       # fetch() is blocked on file:// (HyperFrames serves over http too)
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1800, "height": 82 * len(fonts) + 40}); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)))
            pg.goto(url + "index.html")
            try: pg.wait_for_function("document.title==='done'", timeout=30000)
            except Exception: raise SystemExit("specimen failed: %s" % errs)
            pg.screenshot(path=out, full_page=True); b.close()
    finally:
        srv.shutdown(); shutil.rmtree(tmp, ignore_errors=True)
    print(out)


def serve(folder):
    import functools, http.server, threading
    class Quiet(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    h = functools.partial(Quiet, directory=folder)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), h); threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, "http://127.0.0.1:%d/" % srv.server_address[1]


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0]); sp = ap.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("icons"); s.add_argument("words", nargs="+")
    sp.add_parser("fonts")
    s = sp.add_parser("add"); s.add_argument("project"); s.add_argument("--icons"); s.add_argument("--fonts")
    sp.add_parser("sheet")
    a = ap.parse_args(); globals()["cmd_" + a.cmd](a)


if __name__ == "__main__":
    main()
