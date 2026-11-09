"""Assemble a short's narration from tools/voice/vo.py takes into voice/voice.wav (48 kHz mono) + voice/words.json
([{w, s, e, line}] in seconds) + voice/lines.json (per-line start/end), the files the toon3d pipeline is timed to.
Usage: python scripts/assemble_voice.py shorts/<name> [lead=0.08] [gap=0.12] [pause=i:sec,i:sec,...]
  pause overrides the gap BEFORE line i (beats: after the hook, before "You see", before the twist)."""
import json, os, subprocess, sys
import numpy as np

root = sys.argv[1]
lead = float(sys.argv[2]) if len(sys.argv) > 2 else 0.08
gap = float(sys.argv[3]) if len(sys.argv) > 3 else 0.12
pauses = {int(a): float(b) for a, b in (p.split(":") for p in sys.argv[4].split(","))} if len(sys.argv) > 4 and sys.argv[4] else {}
SR = 48000
takes = json.load(open(os.path.join(root, "vo", "takes.json")))
vo = os.path.join(root, "vo")
out = os.path.join(root, "voice"); os.makedirs(out, exist_ok=True)

def load(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32)

parts, words, lines, t = [], [], [], lead
parts.append(np.zeros(int(lead * SR), np.float32))
for i in sorted(takes, key=int):
    tk = takes[i]; i = int(i)
    if i > 0:
        g = pauses.get(i, gap); parts.append(np.zeros(int(g * SR), np.float32)); t += g
    cand = [tk["wav"], os.path.join(root, tk["wav"]), os.path.join(vo, tk["wav"]), os.path.join(vo, "wav", os.path.basename(tk["wav"]))]
    x = load(next(c for c in cand if os.path.exists(c)))
    parts.append(x)
    for w in tk["words"]:
        words.append({"w": w["w"].strip(), "s": round(t + w["s"], 3), "e": round(t + w["e"], 3), "line": i})
    lines.append({"i": i, "s": round(t, 3), "e": round(t + len(x) / SR, 3), "text": tk["tts"]})
    t += len(x) / SR
parts.append(np.zeros(int(0.5 * SR), np.float32))
y = np.concatenate(parts)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "pcm_s16le", os.path.join(out, "voice.wav")], input=y.tobytes())
json.dump(words, open(os.path.join(out, "words.json"), "w"), indent=0)
json.dump(lines, open(os.path.join(out, "lines.json"), "w"), indent=1)
print("voice %.2f s, %d words, %d lines -> %s" % (len(y) / SR, len(words), len(lines), out))
for l in lines: print("%2d %6.2f-%6.2f f%4d-%4d  %s" % (l["i"], l["s"], l["e"], round(l["s"] * 30), round(l["e"] * 30), l["text"][:60]))
