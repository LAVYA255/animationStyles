"""Shared audio pieces for the beach reels: loading, voice FX, placement."""
import os, subprocess, wave
import numpy as np

SR = 48000
db = lambda x: 10 ** (x / 20)


def read(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def band(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    g = (1 / (1 + (f / hi) ** 6)) * (1 - 1 / (1 + (np.maximum(f, 1) / lo) ** 6))
    return np.fft.irfft(X * g, len(x))


def speech_rms(x):
    fr = x[: len(x) // 480 * 480].reshape(-1, 480); r = np.sqrt((fr ** 2).mean(1))
    act = r[r > 0.1 * r.max()]
    return float(np.sqrt((act ** 2).mean())) if len(act) else 1e-6


def level(x, target_db=-20.0):
    return x * db(target_db) / speech_rms(x)


def megaphone(x, amount=0.45):
    """parallel megaphone: the dry voice keeps its chest, a band-limited crunchy copy adds the horn"""
    m = band(x, 450, 3400); m = np.tanh(m / (np.abs(m).max() + 1e-9) * 3.0)
    m *= speech_rms(x) / speech_rms(m)
    return 0.85 * x + amount * m


def ghost(x, rng):
    n = int(1.8 * SR); t = np.arange(n) / SR
    ir = rng.standard_normal(n) * np.exp(-t * 3.2); ir[0] = 1.0
    wet = np.fft.irfft(np.fft.rfft(np.pad(x, (0, n))) * np.fft.rfft(ir, len(x) + n), len(x) + n)
    wet = band(wet, 200, 5000); wet *= speech_rms(x) / speech_rms(wet)
    return 0.9 * np.pad(x, (0, n)) + 0.3 * wet      # keep the words: a whispered read smears under heavy reverb


def cut_glitch(x, at, stutters=3, slice_s=0.07):
    """chop a take mid-word and stutter the last slice: 'perc-perc-perc—'"""
    i = int(at * SR); sl = x[max(0, i - int(slice_s * SR)): i].copy()
    fade = np.minimum(1, np.arange(len(sl))[::-1] / (0.008 * SR))
    parts = [x[:i] * np.r_[np.ones(max(0, i - 400)), np.linspace(1, 0.7, min(i, 400))]]
    for k in range(stutters):
        parts.append(sl * fade * (0.8 ** (k + 1)))
    return np.concatenate(parts)


class Bus:
    def __init__(self, dur):
        self.n = int(dur * SR); self.L = np.zeros(self.n); self.R = np.zeros(self.n)

    def add(self, x, at, gain_db=0.0, pan=0.0):
        i = int(at * SR)
        if i >= self.n: return
        x = x[: self.n - i] * db(gain_db)
        self.L[i:i + len(x)] += x * np.sqrt((1 - pan) / 2) * 1.414
        self.R[i:i + len(x)] += x * np.sqrt((1 + pan) / 2) * 1.414

    def write(self, path, dur, head=0.25, tail=0.8):
        t = np.arange(self.n) / SR
        fade = np.minimum(1, np.minimum(t / head, (dur - t) / tail))
        mix = np.stack([self.L, self.R], 1) * fade[:, None]
        mix *= db(-1) / np.abs(mix).max()
        with wave.open(path, "wb") as w:
            w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
            w.writeframes((mix * 32767).astype(np.int16).tobytes())
        return 20 * np.log10(np.sqrt(np.mean(mix ** 2)))
