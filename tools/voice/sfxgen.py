"""ElevenLabs sound effects (walla, ambience), cached by prompt so a rebuild never re-bills."""
import hashlib, json, os, subprocess
from el import post

HERE = os.path.dirname(os.path.abspath(__file__))
CACHE = os.path.join(HERE, "sfx_cache"); os.makedirs(CACHE, exist_ok=True)


def sfx(prompt, seconds, influence=0.45):
    key = hashlib.sha1(json.dumps([prompt, seconds, influence]).encode()).hexdigest()[:12]
    wav = os.path.join(CACHE, key + ".wav")
    if not os.path.exists(wav):
        mp3 = os.path.join(CACHE, key + ".mp3")
        if not os.path.exists(mp3):
            data = post("/v1/sound-generation", {"text": prompt, "duration_seconds": seconds, "prompt_influence": influence}, raw=True)
            open(mp3, "wb").write(data)          # write only after a successful download, so a failed call never caches an empty file
            print("  sfx generated:", prompt[:60], flush=True)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp3, "-ar", "48000", "-ac", "1", wav], check=True)
    return wav
