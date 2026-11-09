"""Generate a project's voiceover with ElevenLabs eleven_v3, one take per line, transcript-verified.

    python vo.py <project_dir>

- story.json lines carry  voice (a key into cast.json), tts (text with v3 audio tags), text (the caption)
- takes are cached by hash(voice, tts, settings) in <project>/vo/raw, so re-runs never re-bill
- every take is trimmed, then whisper checks it says the caption's words; a misread take is
  regenerated (up to 3 tries) and the best one kept
- writes <project>/vo/takes.json: per line -> wav path, duration, words with timestamps, match score
"""
import hashlib, json, os, re, subprocess, sys
from el import post

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.abspath(sys.argv[1])
CAST = json.load(open(os.path.join(HERE, "cast.json")))
story = json.load(open(os.path.join(PROJ, "story.json"), encoding="utf-8"))
RAW, WAV = os.path.join(PROJ, "vo", "raw"), os.path.join(PROJ, "vo", "wav")
os.makedirs(RAW, exist_ok=True); os.makedirs(WAV, exist_ok=True)
SETTINGS = {"stability": 0.5}
NUM = {"1518": "fifteen eighteen", "500": "five hundred", "30": "thirty", "6": "six", "74": "seventy four", "1831": "eighteen thirty one", "25": "twenty five", "50": "fifty", "12": "twelve", "11": "eleven", "100": "a hundred", "100,000": "a hundred thousand", "4 million": "four million", "15": "fifteen", "4,500": "four thousand five hundred", "4500": "four thousand five hundred", "4": "four", "5,000": "five thousand", "5000": "five thousand", "3": "three", "140": "a hundred and forty", "58": "fifty eight", "24": "twenty four", "14": "fourteen", "10": "ten", "1 in 5": "one in five", "40%": "forty percent", "366": "three hundred sixty six", "365": "three hundred sixty five", "38": "thirty eight", "1%": "one percent", "300": "three hundred", "47": "forty seven", "4000": "four thousand", "4,000": "four thousand", "12": "twelve", "13": "thirteen", "99": "ninety nine"}


def words(s):
    s = s.lower().replace("+", " ").replace("—", " ").replace("-", " ").replace("a.p.i", "api")
    for k, v in NUM.items(): s = s.replace(k, v)
    s = re.sub(r"\[[^\]]*\]", " ", s)
    return re.sub(r"[^a-z' ]", " ", s).split()


def score(want, heard):
    w, h = words(want), words(heard)
    return sum(x in h for x in w) / max(1, len(w))


def take(line, attempt):
    st = dict(SETTINGS, **line.get("settings", {}))  # per-line voice_settings (e.g. {"speed": 1.08}) on top of the defaults
    key = hashlib.sha1(json.dumps([CAST.get(line["voice"], line["voice"]), line["tts"], st, attempt]).encode()).hexdigest()[:12]
    mp3 = os.path.join(RAW, key + ".mp3")
    if not os.path.exists(mp3):
        audio = post("/v1/text-to-speech/%s" % CAST.get(line["voice"], line["voice"]), {"text": line["tts"], "model_id": line.get("model", "eleven_v3"), "voice_settings": st},
                     raw=True, output_format="mp3_44100_192")
        open(mp3, "wb").write(audio)
        print("  generated", key, "(%d chars)" % len(line["tts"]), flush=True)
    wav = os.path.join(WAV, key + "_v2.wav")          # v2: pauses inside a line capped at ~0.3 s
    if not os.path.exists(wav):   # trim silence at both ends, keep 40 ms of air
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp3, "-af",
                        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,"
                        "silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,"
                        "silenceremove=stop_periods=-1:stop_duration=0.3:stop_threshold=-42dB:stop_silence=0.26",
                        "-ar", "48000", "-ac", "1", wav], check=True)
    return wav


def transcribe(wavs):
    lst = os.path.join(PROJ, "vo", "_batch.json"); out = os.path.join(PROJ, "vo", "_heard.json")
    json.dump(wavs, open(lst, "w"))
    subprocess.run([sys.executable, os.path.join(HERE, "transcribe.py"), lst, out, "small"], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return json.load(open(out))


def dur(wav):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav], capture_output=True, text=True).stdout)


takes_path = os.path.join(PROJ, "vo", "takes.json")
best = json.load(open(takes_path)) if os.path.exists(takes_path) else {}
for attempt in range(3):
    todo = [(i, l) for i, l in enumerate(story["lines"]) if str(i) not in best or (best[str(i)]["score"] < 0.85 and best[str(i)]["attempt"] < attempt)
            or best[str(i)]["tts"] != l["tts"] or best[str(i)]["voice"] != l["voice"]]
    if not todo: break
    print("round %d: %d lines" % (attempt + 1, len(todo)), flush=True)
    wavs = {i: take(l, attempt) for i, l in todo}
    heard = transcribe(list(wavs.values()))
    for i, l in todo:
        h = heard[wavs[i]]; sc = score(l["text"], h["text"])
        prev = best.get(str(i))
        if prev is None or prev["tts"] != l["tts"] or prev["voice"] != l["voice"] or sc > prev["score"]:
            best[str(i)] = dict(wav=os.path.relpath(wavs[i], PROJ).replace("\\", "/"), dur=dur(wavs[i]), words=h["words"], heard=h["text"],
                                score=sc, attempt=attempt, tts=l["tts"], voice=l["voice"])
        else:
            best[str(i)]["attempt"] = attempt
json.dump(best, open(takes_path, "w"), indent=1)
for i, l in enumerate(story["lines"]):
    b = best[str(i)]
    print("%2d %-6s %4.2fs  %3.0f%%  %-40s | heard: %s" % (i, l["voice"], b["dur"], 100 * b["score"], l["text"][:40], b["heard"][:60]))
