"""Lay a reel's verified takes (tools/voice/vo.py -> vo/takes.json) end to end at natural speed: line i starts `gap` seconds
after line i-1 ends (story.json lines[i].gap; negative = overlap for an interruption). Inner pauses are capped at PAUSE s.
Each take is re-transcribed for exact word times. Writes vo/line_XX.wav, vo/timing.json, assets/timing.js and sets
index.html data-duration.  Usage: python timing.py <reel_dir>"""
import json, os, re, subprocess, sys
VC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "..", "tools", "voice")
R = os.path.abspath(sys.argv[1]); PAUSE = 0.28
story = json.load(open(os.path.join(R, "story.json"), encoding="utf-8")); takes = json.load(open(os.path.join(R, "vo", "takes.json")))
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
wavs = []
for i in range(len(story["lines"])):
    src, dst = os.path.join(R, takes[str(i)]["wav"]), os.path.join(R, "vo", f"line_{i:02d}.wav")
    af = f"silenceremove=stop_periods=-1:stop_duration={PAUSE}:stop_threshold=-40dB:stop_silence={PAUSE * 0.9:.3f}"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-af", af, "-ar", "48000", "-ac", "1", dst], check=True)
    wavs.append(dst)
lst, heard = os.path.join(R, "vo", "_t.json"), os.path.join(R, "vo", "_t_heard.json")
json.dump(wavs, open(lst, "w"))
subprocess.run([sys.executable, os.path.join(VC, "transcribe.py"), lst, heard, "small"], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
H = json.load(open(heard)); timing, t = [], 0.0
for i, wv in enumerate(wavs):
    ln = story["lines"][i]; t += ln.get("gap", 0.3); d = dur(wv)
    words = [[round(t + x["s"], 3), round(t + x["e"], 3), x["w"].strip()] for x in H[wv]["words"]]
    timing.append(dict(i=i, who=ln.get("who", "N"), voice=ln["voice"], start=round(t, 3), end=round(t + d, 3), text=ln["text"], file=os.path.basename(wv), words=words))
    t += d
total = round(t + story.get("tail", 1.6), 2)
json.dump(dict(dur=total, lines=timing), open(os.path.join(R, "vo", "timing.json"), "w"), indent=1)
open(os.path.join(R, "assets", "timing.js"), "w", encoding="utf-8").write("window.TIMING = " + json.dumps(dict(dur=total, lines=timing)) + ";\n")
p = os.path.join(R, "index.html"); s = open(p, encoding="utf-8").read()
s = re.sub(r'data-duration="[^"]*"', 'data-duration="%s"' % total, s)
s = re.sub(r"<title>[^<]*</title>", "<title>%s</title>" % story.get("title", "reel"), s)
open(p, "w", encoding="utf-8").write(s)
for l in timing: print("%2d %6.2f-%6.2f %3s " % (l["i"], l["start"], l["end"], l["who"]) + " ".join("%s@%.2f" % (x[2], x[0]) for x in l["words"]))
print("duration", total)
