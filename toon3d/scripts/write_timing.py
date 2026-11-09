"""Write shorts/<name>/vo/timing.json (what tools/audio/audiokit.py's Mix reads) from voice/lines.json + vo/takes.json.
Run after assemble_voice.py:  python scripts/write_timing.py shorts/<name> [tail_frames=45]"""
import json, os, sys

root = sys.argv[1]; tail = int(sys.argv[2]) if len(sys.argv) > 2 else 45
L = json.load(open(os.path.join(root, "voice", "lines.json"))); T = json.load(open(os.path.join(root, "vo", "takes.json")))
lines = []
for l in L:
    tk = T[str(l["i"])]; st = l["s"]
    lines.append(dict(i=l["i"], who="N", start=st, end=l["e"], text=l["text"], file=tk["wav"].replace("vo/", ""),
                      words=[[round(st + w["s"], 3), round(st + w["e"], 3), w["w"].strip()] for w in tk["words"]]))
dur = round((round(L[-1]["e"] * 30) + tail) / 30, 3)
json.dump(dict(dur=dur, lines=lines), open(os.path.join(root, "vo", "timing.json"), "w"), indent=1)
print("timing.json:", len(lines), "lines,", dur, "s ->", "TOTAL =", round(dur * 30), "frames")
