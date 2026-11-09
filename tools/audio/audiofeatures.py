"""audiofeatures: everything a music video needs to move with the music, precomputed so the composition stays seek-safe.

    python audiofeatures.py <audio-or-video> [--fps 30] [--start S --dur D] [-o features.json]
        -> features.json (load with audio-react.js) + features.png (look at it: beats, kicks, sections, drops over the waveform)

Per frame (normalised 0..1): rms loudness, low (20-150 Hz: kick/bass), mid (150-2k), high (2k-11k: hats/air), onset (attack
strength), bright (spectral centroid). Events: beats + tempo, downbeats (bar starts), kicks, snares/hats, onsets with strength,
sections (A/B/C labels by similarity, with energy: find the chorus), drops (energy jumps after a quieter stretch), musical key.
"""
import argparse, json, os, subprocess, tempfile
import numpy as np

SR = 22050


def load(path, start=None, dur=None):
    import librosa
    tmp = os.path.join(tempfile.gettempdir(), "af_%d.wav" % os.getpid())
    cmd = ["ffmpeg", "-v", "error", "-y"] + (["-ss", str(start)] if start else []) + ["-i", path] + (["-t", str(dur)] if dur else []) + ["-vn", "-ac", "1", "-ar", str(SR), tmp]
    subprocess.run(cmd, check=True); y, _ = librosa.load(tmp, sr=SR); os.remove(tmp); return y


def norm(x, lo=5, hi=99):
    a, b = np.percentile(x, lo), np.percentile(x, hi); return np.clip((x - a) / (b - a + 1e-9), 0, 1)


def peaks(env, times, thr=0.35, min_gap=0.09):
    import librosa
    e = norm(env, 10, 99.5)
    idx = librosa.util.peak_pick(e, pre_max=3, post_max=3, pre_avg=8, post_avg=8, delta=thr * 0.5, wait=max(1, int(min_gap / (times[1] - times[0]))))
    return [(float(times[i]), float(e[i])) for i in idx if e[i] >= thr]


def key_of(y):
    import librosa
    ch = librosa.feature.chroma_cqt(y=y, sr=SR).mean(1)
    maj = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]); mnr = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
    names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
    sc = [(np.corrcoef(np.roll(maj, i), ch)[0, 1], names[i] + " major") for i in range(12)] + [(np.corrcoef(np.roll(mnr, i), ch)[0, 1], names[i] + " minor") for i in range(12)]
    return max(sc)[1]


def analyse(y, fps):
    import librosa
    hop = 512; D = len(y) / SR
    S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop)); f = librosa.fft_frequencies(sr=SR, n_fft=2048); tt = librosa.frames_to_time(np.arange(S.shape[1]), sr=SR, hop_length=hop)
    band = lambda a, b: np.log1p(S[(f >= a) & (f < b)].mean(0) * 100)
    low, mid, high = band(20, 150), band(150, 2000), band(2000, 11000)
    rms = librosa.feature.rms(y=y, hop_length=hop)[0][: len(tt)]
    onset = librosa.onset.onset_strength(y=y, sr=SR, hop_length=hop)[: len(tt)]
    bright = librosa.feature.spectral_centroid(S=S, sr=SR)[0]
    flux = lambda e: np.maximum(0, np.diff(e, prepend=e[0]))
    tempo, beat_f = librosa.beat.beat_track(onset_envelope=onset, sr=SR, hop_length=hop)
    beats = librosa.frames_to_time(beat_f, sr=SR, hop_length=hop)
    # downbeats: the 4/4 phase whose beats carry the most low-end
    lowb = np.interp(beats, tt, norm(low)) if len(beats) else np.array([])
    ph = int(np.argmax([lowb[k::4].mean() if len(lowb[k::4]) else 0 for k in range(4)])) if len(beats) >= 8 else 0
    downbeats = beats[ph::4]
    # sections: agglomerative segmentation on beat-synchronous chroma + MFCC, labelled by similarity
    sections = []
    if len(beats) > 16:
        C = librosa.feature.chroma_cqt(y=y, sr=SR, hop_length=hop); M = librosa.feature.mfcc(y=y, sr=SR, hop_length=hop, n_mfcc=13)
        X = librosa.util.sync(np.vstack([librosa.util.normalize(C), librosa.util.normalize(M)]), beat_f)
        k = int(np.clip(round(D / 14), 2, 10)); bnd = librosa.segment.agglomerative(X, k)
        bt = np.r_[0.0, beats[np.clip(bnd[1:], 0, len(beats) - 1)], D]; bt = np.unique(np.round(bt, 3))
        feats = [X[:, max(0, np.searchsorted(beats, a)):max(1, np.searchsorted(beats, b))].mean(1) for a, b in zip(bt, bt[1:])]
        from sklearn.cluster import AgglomerativeClustering
        lab = AgglomerativeClustering(n_clusters=min(4, len(feats))).fit_predict(np.array(feats)) if len(feats) > 2 else list(range(len(feats)))
        order = {}; letters = []
        for l in lab:                                                            # (setdefault would evaluate "ABCD"[4] eagerly)
            if l not in order: order[l] = "ABCD"[len(order)]
            letters.append(order[l])
        en = [float(np.mean(rms[(tt >= a) & (tt < b)])) if ((tt >= a) & (tt < b)).any() else 0 for a, b in zip(bt, bt[1:])]
        emax = max(en) or 1
        sections = [dict(s=round(float(a), 3), e=round(float(b), 3), label=L, energy=round(e / emax, 2)) for a, b, L, e in zip(bt, bt[1:], letters, en)]
    # drops: smoothed loudness jumps up after >= 2 s of quieter music
    sm = np.convolve(norm(rms), np.ones(int(1.0 * SR / hop)) / int(1.0 * SR / hop), mode="same"); drops = []
    step = int(2.0 * SR / hop)
    for i in range(step, len(sm) - 4):
        if sm[i + 4] - sm[i - step:i].mean() > 0.3 and sm[i - step:i].max() < sm[i + 4] - 0.15 and (not drops or tt[i] - drops[-1] > 8):
            drops.append(round(float(tt[i]), 3))
    for a, b in zip(sections, sections[1:]):                                   # a section that arrives much louder is a drop too
        if b["energy"] - a["energy"] >= 0.25 and all(abs(b["s"] - d) > 4 for d in drops): drops.append(b["s"])
    drops = sorted(drops)
    n = int(round(D * fps)); ft = np.arange(n) / fps
    R = lambda x: [round(float(v), 3) for v in np.interp(ft, tt[: len(x)], x[: len(tt)])]
    return dict(fps=fps, duration=round(D, 3), tempo=round(float(np.atleast_1d(tempo)[0]), 2), key=key_of(y),
                beats=[round(float(b), 3) for b in beats], downbeats=[round(float(b), 3) for b in downbeats],
                kicks=[dict(t=round(t, 3), s=round(s, 2)) for t, s in peaks(flux(low), tt, 0.35)],
                snares=[dict(t=round(t, 3), s=round(s, 2)) for t, s in peaks(flux(high), tt, 0.4)],
                onsets=[dict(t=round(t, 3), s=round(s, 2)) for t, s in peaks(onset, tt, 0.3)],
                sections=sections, drops=drops,
                frames=dict(rms=R(norm(rms)), low=R(norm(low)), mid=R(norm(mid)), high=R(norm(high)), onset=R(norm(onset, 10, 99.5)), bright=R(norm(bright))))


def crop(F, s, d):
    """features of the whole song, cut to [s, s+d) and shifted to start at 0 (use the same excerpt for the audio track)."""
    e = s + d; inr = lambda t: s <= t < e; sh = lambda t: round(t - s, 3)
    f0, f1 = int(round(s * F["fps"])), int(round(e * F["fps"]))
    G = dict(F, duration=round(d, 3), excerpt=[s, e],
             beats=[sh(t) for t in F["beats"] if inr(t)], downbeats=[sh(t) for t in F["downbeats"] if inr(t)], drops=[sh(t) for t in F["drops"] if inr(t)],
             kicks=[dict(x, t=sh(x["t"])) for x in F["kicks"] if inr(x["t"])], snares=[dict(x, t=sh(x["t"])) for x in F["snares"] if inr(x["t"])],
             onsets=[dict(x, t=sh(x["t"])) for x in F["onsets"] if inr(x["t"])],
             sections=[dict(x, s=sh(max(x["s"], s)), e=sh(min(x["e"], e))) for x in F["sections"] if x["e"] > s and x["s"] < e],
             frames={k: v[f0:f1] for k, v in F["frames"].items()})
    return G


def plot(F, y, path):
    from PIL import Image, ImageDraw
    W, H, D = 1600, 420, F["duration"]; I = Image.new("RGB", (W, H), (16, 16, 18)); d = ImageDraw.Draw(I); X = lambda t: int(30 + (W - 60) * t / D)
    cols = {"A": (60, 90, 160), "B": (150, 70, 90), "C": (70, 140, 90), "D": (160, 130, 60)}
    for s in F["sections"]: d.rectangle([X(s["s"]), 20, X(s["e"]) - 1, 60], fill=cols[s["label"]]); d.text((X(s["s"]) + 4, 26), "%s %.0f%%" % (s["label"], 100 * s["energy"]), fill=(255, 255, 255))
    env = np.abs(y); seg = max(1, len(env) // (W - 60))
    for i in range(W - 60):
        a = env[i * seg:(i + 1) * seg]; h = (a.max() if len(a) else 0) * 90; d.line([(30 + i, 160 - h), (30 + i, 160 + h)], fill=(90, 90, 100))
    for k, (name, col, y0) in enumerate([("low", (255, 120, 80), 360), ("mid", (120, 200, 255), 360), ("high", (160, 255, 160), 360)]):
        v = F["frames"][name]; pts = [(X(i / F["fps"]), y0 - 100 * v[i]) for i in range(0, len(v), 2)]; d.line(pts, fill=col, width=1)
    for b in F["beats"]: d.line([(X(b), 262), (X(b), 270)], fill=(200, 200, 200))
    for b in F["downbeats"]: d.line([(X(b), 258), (X(b), 274)], fill=(255, 255, 255), width=2)
    for k in F["kicks"]: d.ellipse([X(k["t"]) - 2, 244, X(k["t"]) + 2, 248], fill=(255, 120, 80))
    for k in F["snares"]: d.ellipse([X(k["t"]) - 2, 234, X(k["t"]) + 2, 238], fill=(160, 255, 160))
    for t in F["drops"]: d.line([(X(t), 20), (X(t), 400)], fill=(255, 60, 60), width=2); d.text((X(t) + 4, 66), "DROP", fill=(255, 90, 90))
    d.text((30, 396), "%.1f BPM  key %s  |  sections A-D  white=downbeats  orange=kicks  green=snares/hats  curves: low/mid/high" % (F["tempo"], F["key"]), fill=(220, 220, 220))
    I.save(path)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("src"); ap.add_argument("--fps", type=float, default=30); ap.add_argument("--start", type=float); ap.add_argument("--dur", type=float); ap.add_argument("-o")
    a = ap.parse_args(); y = load(a.src); F = analyse(y, a.fps)                  # whole song: sections and drops need context
    if a.start or a.dur: F = crop(F, a.start or 0.0, a.dur or F["duration"] - (a.start or 0.0)); y = y[int((a.start or 0) * SR):int(((a.start or 0) + F["duration"]) * SR)]
    out = a.o or os.path.splitext(a.src)[0] + ".features.json"
    json.dump(F, open(out, "w"), separators=(",", ":")); plot(F, y, out.replace(".json", ".png"))
    print("%s  %.1f s  %.1f BPM  %s  beats %d  downbeats %d  kicks %d  snares %d  sections %s  drops %s" % (out, F["duration"], F["tempo"], F["key"], len(F["beats"]), len(F["downbeats"]),
          len(F["kicks"]), len(F["snares"]), "".join(s["label"] for s in F["sections"]), F["drops"]))


if __name__ == "__main__":
    main()
