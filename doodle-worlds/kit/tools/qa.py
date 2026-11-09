"""Render + QA a Weird Worlds reel end to end.
    python qa.py <reel_dir> check      lint + seek-scan every frame + caption holds (no render)
    python qa.py <reel_dir> beats "t1,t2,..."   contact sheet of chosen moments -> out/beats.png
    python qa.py <reel_dir> final      check, render, mux with out/audio.wav, 2 fps sheet, loudness, copy to _delivery/
Fails loudly on: lint issues, frame exceptions, a caption group holding < 1 s after it is fully written (hard cuts allowed
0.6 s), loudness outside -15..-13 LUFS, video/audio length mismatch."""
import json, os, re, shutil, subprocess, sys
TOOLS = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.join(TOOLS, "..", "..", "..")  # repo root
R = os.path.abspath(sys.argv[1]); MODE = sys.argv[2]
ML = os.path.join(ROOT, "tools", "motion-lab", "motionlab.py")
story = json.load(open(os.path.join(R, "story.json"), encoding="utf-8")); T = json.load(open(os.path.join(R, "vo", "timing.json")))
run = lambda c, **k: subprocess.run(c, capture_output=True, text=True, **k)


def captions():
    sys.path.insert(0, os.path.join(ROOT, "tools", "doodle")); import doodle
    from playwright.sync_api import sync_playwright
    srv, url = doodle.serve(R)
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={"width": 1080, "height": 1920}); pg.goto(url + "index.html")
        pg.wait_for_function("!!(window.__timelines && window.__timelines.root)", timeout=30000); c = pg.evaluate("window.__captions || []"); b.close()
    bad = [g for g in c if g["hold"] < (0.6 if g["hard"] else 0.98)]
    return c, bad


def check():
    lint = run([sys.executable, ML, "lint", os.path.join(R, "index.html")]).stdout.strip().splitlines()[-1]
    scan = run([sys.executable, ML, "scan", os.path.join(R, "index.html"), "--dur", str(T["dur"]), "--w", "1080", "--h", "1920"]).stdout.strip().splitlines()[-1]
    c, bad = captions()
    print("lint:", lint); print("scan:", scan); print("captions:", len(c), "groups;", "short holds:", bad if bad else "none")
    ok = lint.startswith("0 issue") and scan.startswith("clean") and not bad
    print("CHECK", "OK" if ok else "FAILED"); return ok


if MODE == "check": sys.exit(0 if check() else 1)
if MODE == "beats":
    print(run([sys.executable, os.path.join(TOOLS, "beats.py"), R, os.path.join(R, "out", "beats.png"), sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else "7"]).stdout.strip()); sys.exit(0)
if MODE == "final":
    if not check(): sys.exit(1)
    title = re.sub(r"[^A-Za-z0-9]+", "_", story["title"]).strip("_")
    # render scratch lives in the system temp folder; only the muxed final lands in out/
    import tempfile; tmpd = os.path.join(tempfile.gettempdir(), "worlds-render"); os.makedirs(tmpd, exist_ok=True)
    raw, final = os.path.join(tmpd, os.path.basename(R) + "-raw.mp4"), os.path.join(R, "out", title + ".mp4")
    r = subprocess.run(["npx", "--yes", "hyperframes@0.7.87", "render", "-q", "high", "-f", "30", "-o", raw], cwd=R, capture_output=True, text=True, shell=True)
    if not os.path.exists(raw): print(r.stdout[-1500:], r.stderr[-1500:]); sys.exit(1)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-i", os.path.join(R, "out", "audio.wav"), "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "-shortest", final], check=True)
    os.remove(raw)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", final, "-vf", "fps=2,scale=180:-1,tile=12x10", "-frames:v", "1", os.path.join(R, "out", "final_sheet.jpg")], check=True)
    probe = run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,duration", "-of", "csv=p=0", final]).stdout.split()
    lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", run(["ffmpeg", "-hide_banner", "-i", final, "-af", "ebur128", "-f", "null", "-"]).stderr)[-1])
    durs = [float(x.split(",")[1]) for x in probe]
    print("streams:", probe, " loudness:", lufs, "LUFS")
    ok = -15.0 <= lufs <= -13.0 and abs(durs[0] - durs[1]) < 0.15
    nn = os.path.basename(R).split("-")[0]
    if ok:
        os.makedirs(os.path.join(ROOT, "doodle-worlds", "_delivery"), exist_ok=True)
        shutil.copy(final, os.path.join(ROOT, "doodle-worlds", "_delivery", "%s-%s.mp4" % (nn, title)))
    print("FINAL", "OK" if ok else "FAILED", final); sys.exit(0 if ok else 1)
