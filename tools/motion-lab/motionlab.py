"""motionlab: the render-look-fix loop from the Motion Lab playbook (PLAYBOOK.md), as tools.

    python motionlab.py scan  <index.html> --dur 30                  run render(t) at every 0.1 s and report exceptions (they silently drop frame content)
    python motionlab.py lint  <index.html>                          render-contract + ban-list check (clocks, timers, unseeded random,
                                                                       CSS transitions, unpinned libraries, glow/purple-gradient/particle defaults)
    python motionlab.py graph <index.html> --sel "#hero,.title" [--dur 6 --fps 30]
                                                                       speed graph per element: flags linear motion, dead stops, opacity
                                                                       bounce, and frames where two heroes move at once  -> graph.png + report
    python motionlab.py sheet <video> [--every 12 --cols 4]          contact sheet with frame numbers
    python motionlab.py onion <video> --frames 24-47                  onion skin (spacing that tightens near keys = good easing)
    python motionlab.py gif   <video> [--width 1200 --fps 24]        X-ready GIF: one palette, lanczos, bayer dither, exact loop timing
    python motionlab.py mp4   <video>                                 H.264 High, yuv420p, CRF 18, faststart
    python motionlab.py loop  <video>                                 loop-seam check (last frame -> first frame vs the clip's own motion)

graph seeks the page per frame through whichever hook it has: window.__render(t) (this repo's HyperFrames templates),
window.renderAt(t), window.__timelines.root (GSAP), or ?t= in the URL.
"""
import argparse, json, os, re, struct, subprocess, sys, tempfile
import numpy as np


# ------------------------------------------------------------------------------------------------------------------ lint
RULES = [
    (r"\bDate\.now\s*\(|new Date\s*\(|performance\.now\s*\(", "clock", "time must come from the timeline, not the clock"),
    (r"\bsetTimeout\s*\(|\bsetInterval\s*\(", "timer", "timers break frame-exact rendering"),
    (r"\brequestAnimationFrame\s*\(", "raf", "rAF loops must not drive motion (fine only as a preview loop that calls render(t))"),
    (r"Math\.random\s*\(", "random", "unseeded random: use MK.rng(seed)"),
    (r"transition\s*:\s*(?!none)[^;\"']*\d+(?:\.\d+)?m?s", "css-transition", "CSS transitions are not seekable"),
    (r"@keyframes|animation\s*:\s*(?!none)", "css-animation", "CSS animations: only if driven by the runtime adapter, else not seekable"),
    (r"(cdn\.jsdelivr\.net|unpkg\.com|cdnjs\.cloudflare\.com)/[^\"' ]*@latest|(cdn\.jsdelivr\.net/npm|unpkg\.com)/[a-z0-9@._-]+/(?![^\"' ]*@\d)", "unpinned", "pin every library version"),
    (r"particle", "ban:particles", "floating decorative particles are on the ban list"),
    (r"lens.?flare", "ban:flare", "lens flares are on the ban list"),
    (r"(box|text)-shadow\s*:[^;]*0\s+0\s+(\d{2,})px[^;]*(#(?:[0-9a-f]{3}){1,2}|rgba?\([^)]*\))", "ban:glow", "glow (big zero-offset coloured shadow)"),
    (r"linear-gradient\([^)]*(#[5-9a-f][0-9a-f][0-4][0-9a-f][a-f][0-9a-f]|#[0-4][0-9a-f][0-4][0-9a-f][a-f][0-9a-f]|purple|violet|indigo)", "ban:purple-gradient", "purple/blue gradient default"),
]


def cmd_scan(a):
    """seek every step and catch exceptions thrown inside render(t): an onUpdate that throws makes HyperFrames silently drop every
    later element of that frame (the DOODLE reel lost its whole ending this way). Served over http like the renderer."""
    import functools, http.server, threading
    from playwright.sync_api import sync_playwright
    folder = os.path.dirname(os.path.abspath(a.html))
    class Q(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *x): pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), functools.partial(Q, directory=folder)); threading.Thread(target=srv.serve_forever, daemon=True).start()
    bad = []
    try:
        with sync_playwright() as p:
            b = p.chromium.launch(); pg = b.new_page(viewport={"width": a.w, "height": a.h}); errs = []
            pg.on("pageerror", lambda e: errs.append(str(e)[:200]))
            pg.goto("http://127.0.0.1:%d/%s" % (srv.server_address[1], os.path.basename(a.html)))
            pg.wait_for_function("typeof window.__render==='function'", timeout=90000)
            n = int(a.dur / a.step)
            for i in range(n + 1):
                t = round(i * a.step, 3)
                r = pg.evaluate("t=>{try{window.__render(t);return null}catch(e){return (e.message||String(e)).slice(0,200)}}", t)
                if r: bad.append((t, r))
            b.close()
    finally:
        srv.shutdown()
    if errs: print("page errors:", errs[:3])
    if bad:
        first = {}
        for t, m in bad: first.setdefault(m, t)
        for m, t in first.items(): print("THROWS from t=%.2f: %s" % (t, m))
        print("%d of %d sampled frames throw" % (len(bad), n + 1))
    else: print("clean: %d frames rendered without an exception" % (n + 1))


def cmd_lint(a):
    src = open(a.html, encoding="utf-8", errors="ignore").read(); lines = src.split("\n"); n = 0
    for pat, tag, why in RULES:
        for m in re.finditer(pat, src, re.I):
            ln = src[:m.start()].count("\n") + 1; code = lines[ln - 1].strip()[:110]
            if tag == "raf" and re.search(r"[?&]t=|__render|renderAt", src): continue
            if tag == "random" and "rng(" in code: continue
            print("%-20s line %-5d %s\n%22s %s" % (tag, ln, why, "", code)); n += 1
    if "@font-face" in src and "font-display:block" not in src.replace(" ", "") and "font-display: block" not in src: print("fonts                font-display:block missing: first frames may render the fallback font"); n += 1
    if "@font-face" in src and "fonts.ready" not in src: print("fonts                document.fonts.ready is never awaited before the first frame"); n += 1
    print("%d issue(s) in %s" % (n, os.path.basename(a.html)))


# ------------------------------------------------------------------------------------------------------------------ graph
SEEK = """async (t) => {
  if (window.__render) window.__render(t);
  else if (window.renderAt) await window.renderAt(t);
  else if (window.__timelines && window.__timelines.root) window.__timelines.root.seek(t, false);
  else return false;
  return true; }"""
MEASURE = """(sels) => sels.map((s) => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
  let op = 1, n = e; while (n && n.nodeType === 1) { op *= parseFloat(getComputedStyle(n).opacity); n = n.parentElement; }
  return [r.left + r.width / 2, r.top + r.height / 2, r.width, r.height, op]; })"""


def cmd_graph(a):
    from playwright.sync_api import sync_playwright
    sels = [s.strip() for s in a.sel.split(",")]; N = int(round(a.dur * a.fps)); url = "file:///" + os.path.abspath(a.html).replace("\\", "/")
    data = []
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": a.w, "height": a.h}); pg.goto(url); pg.wait_for_timeout(600)
        pg.evaluate("document.fonts.ready"); hooked = pg.evaluate(SEEK, 0)
        for f in range(N):
            t = f / a.fps
            if not hooked: pg.goto(url + "?t=%.4f" % t); pg.wait_for_timeout(50)
            else: pg.evaluate(SEEK, t)
            data.append(pg.evaluate(MEASURE, sels))
        b.close()
    rep, series = [], {}
    for k, s in enumerate(sels):
        v = np.array([d[k] if d[k] else [np.nan] * 5 for d in data], float); series[s] = v
        pos = v[:, :2]; spd = np.r_[0, np.hypot(*np.diff(pos, axis=0).T)]; scl = v[:, 2] / np.nanmax(v[:, 2] + 1e-9); op = v[:, 4]
        mx = np.nanmax(spd) if np.isfinite(spd).any() else 0
        if mx < 0.5: rep.append("%s: no positional motion" % s)
        else:
            mv = spd > 0.05 * mx
            for i0, i1 in runs(mv):                                                # each move: check easing
                seg_ = spd[i0:i1]
                # linear: only real moves count (ambient pushes/drifts are meant to be slow and steady)
                if len(seg_) >= 6 and np.mean(seg_) > 0.15 * mx and np.std(seg_) / (np.mean(seg_) + 1e-9) < 0.06:
                    rep.append("%s: LINEAR move frames %d-%d (constant %.1f px/frame): ease it" % (s, i0, i1 - 1, np.mean(seg_)))
                # dead stop/start: only while the element is visible (an ease-out entrance starts fast while fading up from 0: fine)
                if i1 < N and seg_[-1] > 0.35 * mx and np.nan_to_num(op[min(i1, N - 1)]) > 0.6:
                    rep.append("%s: DEAD STOP at frame %d (%.1f px/frame -> 0 in one frame)" % (s, i1, seg_[-1]))
                if i0 > 0 and seg_[0] > 0.35 * mx and np.nan_to_num(op[i0 - 1]) > 0.6:
                    rep.append("%s: DEAD START at frame %d (a resting, visible element jumps to %.1f px/frame)" % (s, i0, seg_[0]))
        d_op = np.diff(op); turns = np.where(np.sign(d_op[1:]) * np.sign(d_op[:-1]) < 0)[0]
        if len(turns) and np.nanmax(np.abs(d_op)) > 0.02:
            small = [int(i + 1) for i in turns if 0.02 < op[i + 1] < 0.98]
            if small: rep.append("%s: opacity changes direction mid-fade at frame(s) %s (opacity must never bounce)" % (s, small[:6]))
    movers = np.array([[np.hypot(*(series[s][f, :2] - series[s][f - 1, :2])) > 1.0 if f else False for s in sels] for f in range(N)])
    both = np.where(movers.sum(1) >= 2)[0]
    if len(both) > 0.1 * N: rep.append("%d frames have 2+ elements moving at once (e.g. %s): one hero per shot, others 150 ms later at 60%% travel" % (len(both), [int(x) for x in both[:8]]))
    out = a.out or os.path.splitext(a.html)[0] + "_graph.png"; plot(series, sels, a.fps, out)
    print("\n".join(rep) or "clean: eased moves, no dead stops, no opacity bounce"); print(out)


def runs(m):
    out, i = [], 0
    while i < len(m):
        if m[i]:
            j = i
            while j < len(m) and m[j]: j += 1
            out.append((i, j)); i = j
        else: i += 1
    return out


def plot(series, sels, fps, path):
    from PIL import Image, ImageDraw
    W, H = 1400, 240 * len(sels); I = Image.new("RGB", (W, H), (16, 16, 18)); d = ImageDraw.Draw(I)
    cols = [(90, 170, 255), (255, 170, 60), (120, 230, 140), (255, 90, 120)]
    for k, s in enumerate(sels):
        v = series[s]; y0 = 240 * k; N = len(v); X = lambda f: 60 + (W - 90) * f / max(N - 1, 1)
        spd = np.r_[0, np.hypot(*np.diff(v[:, :2], axis=0).T)]; tracks = [("speed px/f", spd), ("scale", v[:, 2]), ("opacity", v[:, 4])]
        d.text((10, y0 + 6), s, fill=(240, 240, 240))
        for j, (nm, arr) in enumerate(tracks):
            a = np.nan_to_num(arr); lo, hi = float(a.min()), float(a.max()) or 1
            pts = [(X(f), y0 + 220 - 180 * (a[f] - lo) / (hi - lo + 1e-9)) for f in range(N)]
            d.line(pts, fill=cols[j], width=2); d.text((W - 150, y0 + 24 + 14 * j), nm, fill=cols[j])
        for f in range(0, N, int(fps)): d.line([(X(f), y0 + 30), (X(f), y0 + 225)], fill=(50, 50, 55)); d.text((X(f) + 2, y0 + 226), str(f), fill=(120, 120, 120))
    I.save(path)


# ------------------------------------------------------------------------------------------------------------------ frames
def frames(video, w=480):
    p = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate", "-of", "json", video],
                                  capture_output=True, text=True).stdout)["streams"][0]
    h = int(p["height"] * w / p["width"]) // 2 * 2
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", video, "-vf", "scale=%d:%d" % (w, h), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    n, d = p["r_frame_rate"].split("/"); return np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3), float(n) / float(d)


def cmd_sheet(a):
    from PIL import Image, ImageDraw
    F, fps = frames(a.video, 400); idx = list(range(0, len(F), a.every)); h, w = F.shape[1:3]; rows = (len(idx) + a.cols - 1) // a.cols
    I = Image.new("RGB", (a.cols * w, rows * (h + 18)), (12, 12, 12)); d = ImageDraw.Draw(I)
    for k, f in enumerate(idx):
        x, y = (k % a.cols) * w, (k // a.cols) * (h + 18); I.paste(Image.fromarray(F[f]), (x, y + 18)); d.text((x + 4, y + 3), "f%d  %.2fs" % (f, f / fps), fill=(255, 220, 90))
    out = a.out or os.path.splitext(a.video)[0] + "_sheet.jpg"; I.save(out, quality=88); print(out)


def cmd_onion(a):
    from PIL import Image
    F, fps = frames(a.video, 960); f0, f1 = (int(x) for x in a.frames.split("-")); S = F[f0:f1 + 1].astype(float)
    base = S.mean(0); acc = base.copy()
    for k, fr in enumerate(S):                                                   # each frame at ~25%: spacing of the ghosts shows the easing
        diff = np.abs(fr - base).sum(2, keepdims=True) > 30; acc = np.where(diff, acc * 0.75 + fr * 0.25, acc)
    out = a.out or os.path.splitext(a.video)[0] + "_onion_%d-%d.png" % (f0, f1); Image.fromarray(np.clip(acc, 0, 255).astype(np.uint8)).save(out); print(out)


# ------------------------------------------------------------------------------------------------------------------ export
def cmd_mp4(a):
    out = a.out or os.path.splitext(a.video)[0] + "_post.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p", "-crf", "18", "-movflags", "+faststart",
                    "-c:a", "aac", "-b:a", "192k", out], check=True); print(out)


def gif_delays(path, fps):
    """GIF delays are whole hundredths of a second: rewrite them so the loop keeps its real length (24 fps -> 4,4,4,4,4,5 ... cs)."""
    b = bytearray(open(path, "rb").read()); i, k = 0, 0
    while True:
        i = b.find(b"\x21\xF9\x04", i)
        if i < 0: break
        cs = int(round((k + 1) * 100 / fps)) - int(round(k * 100 / fps))            # per-frame delay from exact cumulative time: no drift
        b[i + 4:i + 6] = struct.pack("<H", cs); i += 8; k += 1
    open(path, "wb").write(b); return k


def cmd_gif(a):
    out = a.out or os.path.splitext(a.video)[0] + ".gif"; pal = os.path.join(tempfile.gettempdir(), "mlab_pal.png")
    vf = "fps=%g,scale=%d:-1:flags=lanczos" % (a.fps, a.width)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-vf", vf + ",palettegen=stats_mode=full", pal], check=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-i", pal, "-lavfi", vf + "[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4", "-loop", "0", out], check=True)
    n = gif_delays(out, a.fps); mb = os.path.getsize(out) / 1e6
    print("%s  %d frames, %.2f s, %.1f MB%s" % (out, n, n / a.fps, mb, "  (X limit: 15 MB / 350 frames)" if mb > 15 or n > 350 else ""))


def cmd_loop(a):
    F, fps = frames(a.video, 480); F = F.astype(float)
    inner = np.array([np.abs(F[i] - F[i - 1]).mean() for i in range(1, len(F))]); seam = np.abs(F[0] - F[-1]).mean()
    med = float(np.median(inner)); ratio = seam / (med + 1e-6)
    print("seam %.2f vs median frame step %.2f (x%.1f) -> %s" % (seam, med, ratio, "seamless" if ratio < 2.5 else "HICCUP: render frames 0..N-1 and drive motion by phase = frame/N with whole cycles"))


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0]); sp = ap.add_subparsers(dest="cmd", required=True)
    s = sp.add_parser("lint"); s.add_argument("html")
    s = sp.add_parser("scan"); s.add_argument("html"); s.add_argument("--dur", type=float, required=True); s.add_argument("--step", type=float, default=0.1)
    s.add_argument("--w", type=int, default=1920); s.add_argument("--h", type=int, default=1080)
    s = sp.add_parser("graph"); s.add_argument("html"); s.add_argument("--sel", required=True); s.add_argument("--dur", type=float, default=6); s.add_argument("--fps", type=float, default=30)
    s.add_argument("--w", type=int, default=1920); s.add_argument("--h", type=int, default=1080); s.add_argument("--out")
    s = sp.add_parser("sheet"); s.add_argument("video"); s.add_argument("--every", type=int, default=12); s.add_argument("--cols", type=int, default=4); s.add_argument("--out")
    s = sp.add_parser("onion"); s.add_argument("video"); s.add_argument("--frames", required=True); s.add_argument("--out")
    s = sp.add_parser("gif"); s.add_argument("video"); s.add_argument("--width", type=int, default=1200); s.add_argument("--fps", type=float, default=24); s.add_argument("--out")
    s = sp.add_parser("mp4"); s.add_argument("video"); s.add_argument("--out")
    s = sp.add_parser("loop"); s.add_argument("video")
    a = ap.parse_args(); globals()["cmd_" + a.cmd](a)


if __name__ == "__main__":
    main()
