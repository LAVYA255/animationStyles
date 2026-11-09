"""Download the Mixkit music beds the samples use (tracks.json) into tools/music/tracks/, and measure any new one.

    python tools/music/fetch.py            # every track in tracks.json
    python tools/music/fetch.py 729 726    # extra Mixkit ids (from a mixkit.co/free-stock-music/... page) -> added to tracks.json

Mixkit's Free License lets you use the music in videos but not re-share the raw files, so the mp3s are not in the repo.
Each new track is measured with tools/audio/audiofeatures.py (bpm, beats, drops) -> tracks/m<id>.features.json; put the
bed's drop (`drop_in_song`) on your showcase frame in build_audio.py.
"""
import json, os, re, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "tracks"); os.makedirs(OUT, exist_ok=True)
DB = os.path.join(HERE, "tracks.json")
tracks = json.load(open(DB))
for a in sys.argv[1:]: tracks.setdefault(str(int(a)), {})
for i, meta in tracks.items():
    mp3 = os.path.join(OUT, f"m{i}.mp3")
    if not os.path.exists(mp3):
        req = urllib.request.Request(f"https://assets.mixkit.co/music/{i}/{i}.mp3", headers={"User-Agent": "Mozilla/5.0"})
        open(mp3, "wb").write(urllib.request.urlopen(req, timeout=60).read())
        print("downloaded", mp3, flush=True)
    if not meta.get("bpm"):
        r = subprocess.run([sys.executable, os.path.join(HERE, "..", "audio", "audiofeatures.py"), mp3], capture_output=True, text=True)
        line = ([l for l in r.stdout.splitlines() if "BPM" in l] or [""])[-1]
        if line:
            tracks[i] = dict(meta, dur=float(re.search(r"([\d.]+) s", line).group(1)), bpm=float(re.search(r"([\d.]+) BPM", line).group(1)),
                             drops=[float(x) for x in re.findall(r"[\d.]+", line.split("drops")[1])])
            print(i, tracks[i], flush=True)
json.dump(tracks, open(DB, "w"), indent=1)
