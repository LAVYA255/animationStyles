"""audiokit: the shared mixer for Weird Worlds reels (from Mira ep 1 v2's build_audio). Voices on top; a Mixkit bed placed so its
drop lands on the showcase word, quiet under the voices, with an envelope and optional tape-stop; room tone; one ElevenLabs SFX
per action (cached by prompt, min 0.5 s); a light duck under voices; loudnorm to -14 LUFS; 0.3 s fade-out (never digital silence)."""
import json, os, subprocess, sys, wave
import numpy as np
VC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "voice"); sys.path.insert(0, VC)
from mixlib import level, read
from sfxgen import sfx
MUSIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "music", "tracks")
SR = 48000
db = lambda x: 10 ** (np.asarray(x) / 20)
mono = lambda x: x if x.ndim == 1 else x.mean(1)


class Mix:
    def __init__(self, reel):
        self.R = reel; T = json.load(open(os.path.join(reel, "vo", "timing.json"))); self.L = T["lines"]; self.D = T["dur"]
        self.N = int(self.D * SR); self.voice = np.zeros(self.N); self.bus = np.zeros(self.N)

    def w(self, i, j): return self.L[i]["words"][j][0]
    def ls(self, i): return self.L[i]["start"]
    def le(self, i): return self.L[i]["end"]

    def put(self, x, at, g=0.0, dur=None, fade=0.015, bus=None):
        bus = self.bus if bus is None else bus; x = mono(x).copy()
        if dur: x = x[: int(dur * SR)]
        f = min(int(fade * SR), len(x) // 2)
        if f: x[:f] *= np.linspace(0, 1, f); x[-f:] *= np.linspace(1, 0, f)
        i = max(0, int(at * SR)); j = min(self.N, i + len(x))
        if j > i: bus[i:j] += x[: j - i] * db(g)

    def fx(self, prompt, secs=0.6, infl=0.55): return level(read(sfx(prompt, max(0.5, secs), infl)), -20)

    def voices(self, gains=None):
        for l in self.L:
            self.put(level(read(os.path.join(self.R, "vo", l["file"])), -16), l["start"], (gains or {}).get(l["i"], 0), fade=0.008, bus=self.voice)

    def music(self, track, drop_in_song, drop_at, base=-14.0, env=(), stop_at=None, stop_len=0.45, level_db=-23):
        """env: [(from, to, db)] over `base`; stop_at: tape-stop the bed there (silence after unless env reopens it)."""
        src = os.path.join(MUSIC, track); start = drop_in_song - drop_at
        out = os.path.join(self.R, "assets", "audio", "music.wav")
        pre = max(0.0, -start); start = max(0.0, start)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "%.3f" % start, "-t", "%.2f" % (self.D + 1), "-i", src, "-ac", "1", "-ar", str(SR), out], check=True)
        m = level(mono(read(out)), level_db); m = np.concatenate([np.zeros(int(pre * SR)), m])[: self.N]; m = np.pad(m, (0, self.N - len(m)))
        e = np.full(self.N, float(base))
        for a, b, v in env: e[int(a * SR):int(b * SR)] = v
        k = int(0.05 * SR); g = db(np.convolve(np.pad(e, (k, k), mode="edge"), np.ones(k) / k, "same")[k:-k]); mm = m * g
        if stop_at is not None:
            i0, n = int(stop_at * SR), int(stop_len * SR); pos = np.cumsum(np.linspace(1, 0, n))
            stop = np.interp(pos, np.arange(len(m) - i0), m[i0:]) * np.linspace(1, 0.15, n) * g[i0]
            seg = mm[i0:i0 + n]; seg[:] = stop[: len(seg)]
        self.bus += mm

    def room(self, prompt, gain=-21, a=0.0, b=None, secs=8.0):
        b = self.D if b is None else b; x = self.fx(prompt, secs, 0.6); t = a
        while t < b - 0.05:
            self.put(x, t, gain, dur=min(secs, b - t + 0.2), fade=0.25); t += secs - 0.1

    def cue(self, at, prompt, secs=0.6, gain=-6, dur=None): self.put(self.fx(prompt, secs), at, gain, dur=dur)

    def finish(self, name="audio.wav"):
        ve = np.convolve((np.abs(self.voice) > 0.01).astype(float), np.ones(int(0.12 * SR)) / int(0.12 * SR), "same")
        out = self.voice + self.bus * db(-3 * np.clip(ve * 3, 0, 1)); f = int(0.3 * SR); out[-f:] *= np.linspace(1, 0, f)
        tmp = os.path.join(self.R, "out", "_mix_raw.wav")
        with wave.open(tmp, "wb") as wv:
            wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR)
            wv.writeframes((np.clip(out / max(1.0, np.abs(out).max() * 1.05), -1, 1) * 32767).astype(np.int16).tobytes())
        dst = os.path.join(self.R, "out", name)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1:LRA=9,volume=1.1dB,alimiter=limit=0.891:level=disabled", "-ar", "48000", "-ac", "2", dst], check=True)
        print(dst)
