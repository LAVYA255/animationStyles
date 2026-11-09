// Open Bot Avatar launch promo (9:16, 33 s, no VO): a beat-cut motion piece over Mixkit "Pop Track 03" (107.7 BPM,
// its drop on frame 45). Every avatar is drawn by the real open-bot-avatar renderer (vendored, MIT) with
// time = frame / 30, so blinks, idle sway, moods and gaze are the library's own motion, frame-exact and seek-safe.
// Scenes change on bar downbeats; swaps, pops and chips land on beats (B(k) below). Text always finishes and holds >= 1 s.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ALL, BY, CLAPPER, COLOR, DOT, renderAvatarSvg } from "./avatars";
import type { AvatarDefinition } from "./avatars";
import { moodProgress } from "../../vendor/open-bot-avatar/mood";
import type { AvatarMotion, AvatarMotionBlend } from "../../vendor/open-bot-avatar/types";

export const OBA_PROMO_FRAMES = 1010;

/** Beat k in frames: the song's drop (beat 0) sits on frame 45; 107.7 BPM = 16.72 frames a beat. */
export const B = (k: number) => Math.round(45 + 16.72 * k);
const S = { hook: 0, swap: B(0), grid: B(8), chat: B(20), json: B(32), dev: B(44), end: B(50) };

const W = 1080, H = 1920;
const BG = "#0c0c0f";
const SANS = "'Bricolage Grotesque', sans-serif";
const MONO = "'JetBrains Mono', monospace";

// ---------------------------------------------------------------------------------------------------- easing

const cl = (x: number) => Math.max(0, Math.min(1, x));
const oc = (x: number) => 1 - Math.pow(1 - cl(x), 3);
const oe = (x: number) => (cl(x) >= 1 ? 1 : 1 - Math.pow(2, -10 * cl(x)));
const ob = (x: number, k = 2.2) => { const t = cl(x) - 1; return 1 + (k + 1) * t * t * t + k * t * t; };
const io = (x: number) => { const t = cl(x); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rnd = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

/** Last frame in `fs` at or before f (or -999). */
const last = (f: number, fs: number[]) => fs.reduce((a, x) => (x <= f ? x : a), -999);

/** Mood at frame f from [frame, mood] changes, easing in over the library's MOOD_MS like the live mount does. */
const moodAt = (f: number, changes: [number, AvatarMotion][]): { motion: AvatarMotion; blend?: AvatarMotionBlend } => {
  let i = -1;
  changes.forEach(([at], j) => { if (at <= f) i = j; });
  if (i < 0) return { motion: "idle" };
  const [at, motion] = changes[i];
  const t = moodProgress(((f - at) / 30) * 1000);
  return t >= 1 || i === 0 ? { motion } : { motion, blend: { from: changes[i - 1][1], t } };
};

// ---------------------------------------------------------------------------------------------------- pieces

type AvProps = {
  def: AvatarDefinition; x: number; y: number; size: number; f: number; color?: string; motion?: AvatarMotion; blend?: AvatarMotionBlend;
  gaze?: { x: number; y: number; weight?: number }; view?: { yaw: number; pitch: number }; scale?: number; rot?: number; opacity?: number; seed?: number;
};
/** One avatar from the real renderer, centred on (x, y). `seed` offsets the clock so a crowd doesn't blink in unison. */
const Av: React.FC<AvProps> = ({ def, x, y, size, f, color, motion, blend, gaze, view, scale = 1, rot = 0, opacity = 1, seed = 0 }) => {
  if (scale <= 0.001 || opacity <= 0.001) return null;
  const svg = renderAvatarSvg(def, { color: color ?? COLOR[def.id] ?? "#ff6a1a", size, time: f / 30 + seed * 1.37, motion, motionBlend: blend, gaze, view });
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${scale}) rotate(${rot}deg)`, opacity }}
      dangerouslySetInnerHTML={{ __html: svg }} />
  );
};

/** Words rising out of a mask one by one from f0; leave upward from f1. `hi` words take the accent colour. */
const Words: React.FC<{ f: number; text: string; f0: number; f1?: number; y: number; size: number; color?: string; hi?: string[]; accent?: string; weight?: number; stagger?: number; font?: string }> = ({ f, text, f0, f1 = 1e9, y, size, color = "#fff", hi = [], accent = "#ff6a1a", weight = 800, stagger = 3, font = SANS }) => {
  if (f < f0 || f > f1 + 10) return null;
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: y, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.26, fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.03 }}>
      {words.map((w, i) => {
        const pin = oe((f - f0 - i * stagger) / 9), pout = io((f - f1 - i * 1.5) / 8);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.12, marginBottom: -size * 0.12 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - pin) * 105 - pout * 105}%)`, color: hi.includes(w.replace(/[.,!?]/g, "")) ? accent : color }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Radial speed lines bursting out from (cx, cy) at frame fs. */
const Speed: React.FC<{ f: number; fs: number; cx: number; cy: number; color?: string; r0?: number }> = ({ f, fs, cx, cy, color = "#fff", r0 = 330 }) => {
  const p = (f - fs) / 9;
  if (p < 0 || p > 1) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2 + rnd(i + fs) * 0.2, r = r0 + 420 * oc(p) + rnd(i * 3 + fs) * 60, len = 260 * (1 - p) + 20;
        return <line key={i} x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r} x2={cx + Math.cos(a) * (r + len)} y2={cy + Math.sin(a) * (r + len)}
          stroke={color} strokeWidth={6 * (1 - p) + 1} strokeLinecap="round" opacity={0.75 * (1 - p)} />;
      })}
    </svg>
  );
};

/** Four-point sparkles flying out of (cx, cy) at fs. */
const Sparkle: React.FC<{ f: number; fs: number; cx: number; cy: number; colors?: string[]; n?: number; spread?: number; size?: number }> = ({ f, fs, cx, cy, colors = ["#fff", "#ffd166"], n = 12, spread = 300, size = 34 }) => {
  const p = (f - fs) / 18;
  if (p < 0 || p > 1) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(i + fs * 7) * 0.5, d = spread * (0.55 + rnd(i * 5 + fs) * 0.5) * oe(p), s = size * (0.6 + rnd(i + 3) * 0.6) * (1 - p) * Math.min(1, p * 6);
        const x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
        return <path key={i} transform={`translate(${x} ${y}) rotate(${p * 120 + i * 30}) scale(${s / 10})`} d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10 Z" fill={colors[i % colors.length]} />;
      })}
    </svg>
  );
};

/** Confetti from (cx, cy) at fs, with gravity. */
const Confetti: React.FC<{ f: number; fs: number; cx: number; cy: number; colors: string[]; n?: number }> = ({ f, fs, cx, cy, colors, n = 36 }) => {
  const t = (f - fs) / 30;
  if (t < 0 || t > 1.4) return null;
  return (
    <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
      {Array.from({ length: n }, (_, i) => {
        const a = -Math.PI / 2 + (rnd(i + fs) - 0.5) * 2.4, v = 900 + rnd(i * 7) * 900;
        const x = cx + Math.cos(a) * v * t, y = cy + Math.sin(a) * v * t + 1500 * t * t;
        return <rect key={i} x={-9} y={-5} width={18} height={10} rx={2} fill={colors[i % colors.length]} opacity={cl((1.4 - t) * 3)}
          transform={`translate(${x} ${y}) rotate(${t * 720 * (rnd(i) - 0.5) + i * 40})`} />;
      })}
    </svg>
  );
};

const Flash: React.FC<{ f: number; at: number[] }> = ({ f, at }) => {
  const d = f - last(f, at);
  const o = d === 0 ? 0.9 : d === 1 ? 0.45 : d === 2 ? 0.15 : 0;
  return o ? <AbsoluteFill style={{ background: "#fff", opacity: o }} /> : null;
};

const Pill: React.FC<{ x: number; y: number; text: string; bg: string; fg?: string; size?: number; scale?: number; font?: string; border?: string }> = ({ x, y, text, bg, fg = "#fff", size = 34, scale = 1, font = MONO, border }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${scale})`, background: bg, color: fg, fontFamily: font, fontWeight: 700, fontSize: size,
    padding: `${size * 0.35}px ${size * 0.75}px`, borderRadius: 999, whiteSpace: "nowrap", border: border ?? "none" }}>{text}</div>
);

/** Background: near-black with a faint dot grid and a soft glow in the scene's accent colour that pulses on beats. */
const Backdrop: React.FC<{ f: number; accent: string; glowY?: number }> = ({ f, accent, glowY = 1000 }) => {
  const beat = (f - 45) / 16.72, pulse = f >= 45 ? Math.pow(1 - (beat - Math.floor(beat)), 3) : 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 2px, transparent 2.5px)", backgroundSize: "48px 48px", backgroundPosition: "24px 24px" }} />
      <div style={{ position: "absolute", left: W / 2 - 700, top: glowY - 700, width: 1400, height: 1400, borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}${Math.round(0x40 + 0x30 * pulse).toString(16)} 0%, ${accent}00 62%)` }} />
    </AbsoluteFill>
  );
};

/** Scene wrapper: snap-zoom in on its first frames (1.14 -> 1 with expo-out), optional per-beat punch. */
const Scene: React.FC<{ f: number; s0: number; s1: number; punch?: boolean; children: React.ReactNode }> = ({ f, s0, s1, punch, children }) => {
  if (f < s0 || f >= s1) return null;
  const beat = (f - 45) / 16.72, bp = punch ? 0.022 * Math.pow(1 - (beat - Math.floor(beat)), 4) : 0;
  const z = 1 + 0.14 * (1 - oe((f - s0) / 9)) + bp;
  return <AbsoluteFill style={{ transform: `scale(${z})` }}>{children}</AbsoluteFill>;
};

// ---------------------------------------------------------------------------------------------------- scenes

/** 0-45: a faceless grey "AI" dot, "your AI agent / needs a face." -> the drop: it bursts and the cat pops out. */
const Hook: React.FC<{ f: number }> = ({ f }) => {
  const shake = f > 30 && f < 45 ? Math.sin(f * 2.6) * (f - 30) * 1.4 : 0;
  const squash = f > 38 && f < 45 ? 1 - (f - 38) * 0.02 : 1;
  const dotIn = ob(f / 10);
  return (
    <>
      <Words f={f} text="your AI agent" f0={2} f1={56} y={430} size={104} />
      <Words f={f} text="needs a face." f0={16} f1={58} y={556} size={104} hi={["face"]} />
      {f < 45 && (
        <svg width={420} height={420} style={{ position: "absolute", left: W / 2 - 210 + shake, top: 1060 - 210, transform: `scale(${dotIn * squash}, ${dotIn / squash})` }}>
          <circle cx={210} cy={210} r={170} fill="#2a2a30" />
          <text x={210} y={250} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={120} fill="#5d5d66">AI</text>
        </svg>
      )}
      {f >= 45 && f < 62 && Array.from({ length: 14 }, (_, i) => {
        const p = (f - 45) / 17, a = (i / 14) * Math.PI * 2, d = 380 * oe(p);
        return <div key={i} style={{ position: "absolute", left: W / 2 + Math.cos(a) * d - 22, top: 1060 + Math.sin(a) * d - 22, width: 44, height: 44, borderRadius: 22, background: "#3a3a42", opacity: 1 - p, transform: `scale(${1 - p})` }} />;
      })}
    </>
  );
};

const SWAPS: [number, string][] = [[B(0), "cat"], [B(2), "ghost"], [B(3), "rocket"], [B(4), "mug"], [B(5), "brain"], [B(6), "bunny"], [B(7), "controller"]];

/** B0-B8: one big avatar swapping on every beat under the title. */
const Swaps: React.FC<{ f: number }> = ({ f }) => {
  const at = last(f, SWAPS.map((s) => s[0]));
  const id = SWAPS.find((s) => s[0] === at)![1];
  const p = ob((f - at) / 8, 2.6);
  const def = BY[id], c = COLOR[id];
  const happy = id === "cat" || id === "controller";
  return (
    <>
      <Backdrop f={f} accent={c} glowY={1040} />
      {f < B(1) + 2 ? null : <Words f={f} text="Open Bot Avatar" f0={B(1)} y={250} size={118} stagger={2} />}
      {f < B(1) + 6 ? null : <Words f={f} text="faces for your AI agents" f0={B(1) + 6} y={392} size={50} color="#9a9aa6" weight={600} stagger={2} />}
      <Speed f={f} fs={at} cx={W / 2} cy={1040} color={c} />
      <Av def={def} x={W / 2} y={1040} size={640} f={f} motion={happy ? "happy" : "idle"} scale={at === B(0) ? ob((f - B(0)) / 10, 3) : lerp(0.82, 1, p) * (1 + 0.1 * (1 - oc((f - at) / 6)))} />
      <Pill x={W / 2} y={1450} text={`${id}.json`} bg={c} fg={id === "mug" || id === "ghost" ? "#111" : "#fff"} scale={0.9 + 0.1 * p} />
      <Sparkle f={f} fs={B(0)} cx={W / 2} cy={1040} colors={["#fff", "#f8a01c", "#ffd166"]} n={16} spread={460} size={44} />
    </>
  );
};

/** Grid order: 22 avatars, 4 columns x 6 rows (last row centred). */
const GRID = ALL.map((d, i) => {
  const row = Math.floor(i / 4), col = i % 4, inRow = row === 5 ? 2 : 4;
  return { d, x: W / 2 + (col - (inRow - 1) / 2) * 236, y: 560 + row * 232, i };
});
/** Pointer path through the grid, keyed on beats: [frame, x, y]. */
const PTR: [number, number, number][] = [[B(9), 1180, 1500], [B(10), 820, 1120], [B(11), 300, 700], [B(12), 260, 1500], [B(13), 800, 600], [B(14), W / 2, 1040]];
const ptrAt = (f: number) => {
  for (let i = 0; i < PTR.length - 1; i++) {
    const [a, ax, ay] = PTR[i], [b, bx, by] = PTR[i + 1];
    if (f <= b) { const t = io((f - a) / (b - a)); return { x: lerp(ax, bx, t), y: lerp(ay, by, t) }; }
  }
  return { x: PTR[PTR.length - 1][1], y: PTR[PTR.length - 1][2] };
};

/** B8-B20: all 22 spring into a grid; their eyes follow the pointer; a click turns everyone happy in a ripple. */
const Grid: React.FC<{ f: number }> = ({ f }) => {
  const s0 = S.grid, click = B(14);
  const ptr = ptrAt(Math.max(f, B(9))), ptrOn = cl((f - B(9)) / 8), w = cl((f - B(9) - 4) / 10);
  return (
    <>
      <Backdrop f={f} accent="#8b5cf6" glowY={1000} />
      <Words f={f} text="their eyes follow you" f0={s0 + 4} f1={click - 2} y={250} size={86} hi={["follow"]} accent="#a78bfa" />
      <Words f={f} text="22 faces, ready to go" f0={click + 4} y={250} size={86} hi={["22"]} accent="#a78bfa" />
      {GRID.map(({ d, x, y, i }) => {
        const dx = ptr.x - x, dy = ptr.y - y, dist = Math.hypot(W / 2 - x, 1040 - y);
        const hf = click + 2 + dist / 60;
        const m = moodAt(f, [[0, "idle"], [hf, "happy"]]);
        const hop = f > hf ? Math.sin(cl((f - hf) / 9) * Math.PI) * 26 : 0;
        return <Av key={d.id} def={d} x={x} y={y - hop} size={196} f={f} seed={i} motion={m.motion} blend={m.blend}
          gaze={f > click + 8 ? undefined : { x: Math.max(-1, Math.min(1, dx / 340)), y: Math.max(-1, Math.min(1, dy / 340)), weight: w }}
          scale={ob((f - s0 - i * 1.1) / 11, 2.4)} />;
      })}
      {f >= B(9) && f < click + 14 && (
        <svg width={90} height={110} style={{ position: "absolute", left: ptr.x - 12, top: ptr.y - 8, opacity: ptrOn * (1 - cl((f - click - 6) / 8)), transform: `scale(${f >= click && f < click + 4 ? 0.82 : 1})`, transformOrigin: "12px 8px" }}>
          <path d="M12 8 L12 86 L32 68 L46 100 L60 94 L46 62 L74 62 Z" fill="#fff" stroke="#111" strokeWidth={5} strokeLinejoin="round" />
        </svg>
      )}
      {f >= click && f < click + 16 && <div style={{ position: "absolute", left: W / 2 - 200, top: 1040 - 200, width: 400, height: 400, borderRadius: "50%", border: "6px solid #fff", opacity: 1 - (f - click) / 16, transform: `scale(${0.2 + 2.6 * oe((f - click) / 16)})` }} />}
      <Sparkle f={f} fs={click + 6} cx={W / 2} cy={1040} n={20} spread={620} size={46} colors={["#fff", "#a78bfa", "#ffd166", "#1fbf68"]} />
    </>
  );
};

/** B20-B32: an agent chat. The brain avatar goes idle -> thinking (while it works) -> happy (when it's done). */
const Chat: React.FC<{ f: number }> = ({ f }) => {
  const s0 = S.chat, c = COLOR.brain;
  const sent = B(21), think = B(22), done = B(26), thanks = B(28);
  const m = moodAt(f, [[0, "idle"], [think, "thinking"], [done, "happy"]]);
  const mood = f >= done ? 2 : f >= think ? 1 : 0;
  const bubble = (at: number) => ({ opacity: cl((f - at) / 4), transform: `translateY(${(1 - oe((f - at) / 10)) * 40}px) scale(${lerp(0.9, 1, oe((f - at) / 10))})` });
  const hop = f > done ? Math.abs(Math.sin(((f - done) / 16.72) * Math.PI)) * 30 * Math.max(0, 1 - (f - done) / 70) : 0;
  return (
    <>
      <Backdrop f={f} accent={c} glowY={760} />
      <Words f={f} text="it reacts to your agent" f0={s0 + 4} y={170} size={84} hi={["reacts"]} accent="#f472b6" />
      <Av def={BY.brain} x={W / 2} y={720 - hop} size={470} f={f} motion={m.motion} blend={m.blend} scale={ob((f - s0 - 3) / 11)} />
      {(["idle", "thinking", "happy"] as const).map((t, i) => (
        <Pill key={t} x={W / 2 + (i - 1) * 270} y={1030} text={t} size={34} bg={mood === i ? c : "#1c1c22"} fg={mood === i ? "#fff" : "#777"}
          scale={(mood === i ? 1.08 : 0.95) * ob((f - s0 - 8 - i * 2) / 10)} border={mood === i ? "none" : "2px solid #2c2c34"} />
      ))}
      <div style={{ position: "absolute", left: 60, right: 60, top: 1130, height: 640, borderRadius: 44, background: "#141418", border: "2px solid #26262e", opacity: cl((f - s0 - 6) / 6),
        transform: `translateY(${(1 - oe((f - s0 - 6) / 12)) * 120}px)`, fontFamily: SANS, fontSize: 50, fontWeight: 600, padding: 44, display: "flex", flexDirection: "column", gap: 30 }}>
        {f >= sent && <div style={{ alignSelf: "flex-end", background: "#2a2a33", color: "#fff", padding: "22px 32px", borderRadius: "34px 34px 8px 34px", ...bubble(sent) }}>clean up my downloads folder</div>}
        {f >= think && f < done && (
          <div style={{ alignSelf: "flex-start", background: `${c}33`, padding: "26px 34px", borderRadius: "34px 34px 34px 8px", display: "flex", gap: 14, ...bubble(think) }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 20, height: 20, borderRadius: 10, background: c, transform: `translateY(${Math.sin((f - think) / 4 - i * 0.9) * 8}px)` }} />)}
          </div>
        )}
        {f >= done && <div style={{ alignSelf: "flex-start", background: c, color: "#fff", padding: "22px 32px", borderRadius: "34px 34px 34px 8px", ...bubble(done) }}>done! sorted 1,284 files</div>}
        {f >= thanks && <div style={{ alignSelf: "flex-end", background: "#2a2a33", color: "#fff", padding: "22px 32px", borderRadius: "34px 34px 8px 34px", ...bubble(thanks) }}>you're the best</div>}
      </div>
      <Confetti f={f} fs={done} cx={W / 2} cy={760} colors={[c, "#ffd166", "#fff", "#1fbf68", "#1f7cf2"]} n={40} />
      <Sparkle f={f} fs={thanks + 2} cx={W / 2} cy={720} n={14} spread={330} colors={["#fff", "#f472b6", "#ffd166"]} />
    </>
  );
};

const JSON_LINES: [string, string][][] = [
  [["p", "{"]],
  [["p", '  '], ["k", '"id"'], ["p", ": "], ["s", '"clapper"'], ["p", ","]],
  [["p", '  '], ["k", '"name"'], ["p", ": "], ["s", '"Clapper"'], ["p", ","]],
  [["p", '  '], ["k", '"body"'], ["p", ": { "], ["k", '"path"'], ["p", ": "], ["s", '"M23 44 H77 Q85…"'], ["p", " },"]],
  [["p", '  '], ["k", '"eyes"'], ["p", ": { "], ["k", '"x"'], ["p", ": "], ["n", "50"], ["p", ", "], ["k", '"y"'], ["p", ": "], ["n", "66"], ["p", ","]],
  [["p", '            '], ["k", '"spacing"'], ["p", ": "], ["n", "19"], ["p", " }"]],
  [["p", "}"]],
];
const SYN: Record<string, string> = { p: "#8a8a96", k: "#9ecbff", s: "#ffb86b", n: "#c3e88d" };
const PROMPT = "a clapperboard for my video bot";
const CLAP_COLORS: [number, string][] = [[B(38), "#f2384b"], [B(39), "#1f7cf2"], [B(40), "#1fbf68"], [B(41), "#8b5cf6"], [B(42), "#f8a01c"], [B(43), "#ec4899"]];

/** B32-B44: describe it -> the JSON streams in -> its path draws -> it fills, gets eyes and cycles colours on beats. */
const Json: React.FC<{ f: number }> = ({ f }) => {
  const s0 = S.json, send = B(34), drawAt = B(37), fillAt = B(38);
  const typed = Math.floor(cl((f - s0 - 6) / 26) * PROMPT.length);
  const total = JSON_LINES.flat().reduce((a, [, t]) => a + t.length, 0);
  let budget = Math.floor(cl((f - send - 3) / 40) * total);
  const cAt = last(f, CLAP_COLORS.map((c) => c[0])), col = CLAP_COLORS.find((c) => c[0] === cAt)?.[1] ?? "#f2384b";
  const cy = 1430, size = 520, draw = cl((f - drawAt) / 14);
  return (
    <>
      <Backdrop f={f} accent={f >= fillAt ? col : "#1f7cf2"} glowY={cy} />
      <Words f={f} text="describe it." f0={s0 + 4} f1={B(37) - 2} y={140} size={92} hi={["describe"]} accent="#60a5fa" />
      <Words f={f} text="and it comes alive." f0={B(38) + 2} y={140} size={92} hi={["alive"]} accent={col} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 300, height: 120, borderRadius: 60, background: "#17171c", border: `3px solid ${f >= send && f < send + 8 ? "#60a5fa" : "#2a2a33"}`,
        fontFamily: SANS, fontSize: 46, fontWeight: 600, color: "#eee", display: "flex", alignItems: "center", padding: "0 40px", opacity: cl((f - s0 - 2) / 5), transform: `scale(${ob((f - s0 - 2) / 10)})` }}>
        {PROMPT.slice(0, typed)}<span style={{ opacity: f < send && Math.floor(f / 8) % 2 === 0 ? 1 : 0, color: "#60a5fa" }}>|</span>
        <div style={{ marginLeft: "auto", width: 76, height: 76, borderRadius: 38, background: f >= send ? "#60a5fa" : "#2a2a33", transform: `scale(${f >= send && f < send + 6 ? 0.85 : 1})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, color: "#0c0c0f" }}>↑</div>
      </div>
      {f >= send && (
        <div style={{ position: "absolute", left: 60, right: 60, top: 460, borderRadius: 36, background: "#111116", border: "2px solid #26262e", padding: "30px 30px", fontFamily: MONO, fontSize: 34, fontWeight: 500, lineHeight: 1.45, whiteSpace: "pre",
          opacity: cl((f - send) / 5), transform: `translateY(${(1 - oe((f - send) / 10)) * 60}px)` }}>
          {JSON_LINES.map((line, li) => (
            <div key={li} style={{ minHeight: 49 }}>{line.map(([k, t], ti) => {
              const shown = t.slice(0, Math.max(0, budget)); budget -= t.length;
              return <span key={ti} style={{ color: SYN[k] }}>{shown}</span>;
            })}</div>
          ))}
        </div>
      )}
      {f >= send + 2 && f < drawAt && (
        <>
          <Av def={BY.lightbulb} x={W / 2} y={cy - 30} size={400} f={f} motion="thinking" blend={{ from: "idle", t: cl((f - send - 2) / 12) }}
            scale={ob((f - send - 2) / 10, 2.6) * (f > drawAt - 5 ? 1 - (f - drawAt + 5) / 5 : 1)} />
          <Pill x={W / 2} y={cy + 230} text={"writing" + ".".repeat(1 + (Math.floor(f / 6) % 3))} bg="#17171c" fg="#f8a01c" size={34} border="2px solid #2c2c34" scale={ob((f - send - 6) / 10)} />
        </>
      )}
      <Sparkle f={f} fs={drawAt - 1} cx={W / 2} cy={cy - 30} n={12} spread={300} colors={["#fff", "#f8a01c"]} />
      {f >= drawAt && f < fillAt + 3 && (
        <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: "absolute", left: W / 2 - size / 2, top: cy - size / 2, overflow: "visible", opacity: f >= fillAt ? 1 - (f - fillAt) / 3 : 1 }}>
          <path d={CLAPPER.body.path} fill={f >= fillAt - 3 ? `${col}${Math.round(cl((f - fillAt + 3) / 3) * 255).toString(16).padStart(2, "0")}` : "none"} stroke="#fff" strokeWidth={1.1} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </svg>
      )}
      {f >= fillAt && <Av def={CLAPPER} x={W / 2} y={cy} size={size} f={f} color={col} motion={f >= B(39) ? "happy" : "idle"} scale={(1 + 0.12 * (1 - oc((f - cAt) / 7))) * lerp(0.9, 1, ob((f - fillAt) / 8))} />}
      {f >= fillAt && <Speed f={f} fs={cAt} cx={W / 2} cy={cy} color={col} r0={300} />}
      <Sparkle f={f} fs={fillAt} cx={W / 2} cy={cy} n={16} spread={420} colors={["#fff", "#ffd166", col]} />
    </>
  );
};

const CHIPS: [number, string, string][] = [[B(46), "open source", "#1fbf68"], [B(47), "MIT licensed", "#1f7cf2"], [B(48), "zero dependencies", "#ff6a1a"]];
const PEEK = ["ghost", "cat", "rocket", "sprout", "bull", "chat"];

/** B44-B50: the install line, then the licence chips pop on beats while avatars peek up from the bottom edge. */
const Dev: React.FC<{ f: number }> = ({ f }) => {
  const s0 = S.dev, cmd = "pnpm add open-bot-avatar", typed = Math.floor(cl((f - s0 - 6) / 20) * cmd.length), ok = s0 + 30;
  return (
    <>
      <Backdrop f={f} accent="#1fbf68" glowY={900} />
      <Words f={f} text="free for everyone" f0={s0 + 3} y={330} size={96} hi={["free"]} accent="#1fbf68" />
      <div style={{ position: "absolute", left: 60, right: 60, top: 560, borderRadius: 32, background: "#111116", border: "2px solid #26262e", padding: "30px 40px 40px", fontFamily: MONO, fontSize: 40, fontWeight: 700,
        transform: `scale(${ob((f - s0) / 10)})` }}>
        <div style={{ display: "flex", gap: 14, marginBottom: 28 }}>{["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 11, background: c }} />)}</div>
        <div style={{ color: "#eee" }}><span style={{ color: "#1fbf68" }}>$ </span>{cmd.slice(0, typed)}<span style={{ opacity: f < ok && Math.floor(f / 7) % 2 === 0 ? 1 : 0 }}>▋</span></div>
        {f >= ok && <div style={{ color: "#1fbf68", marginTop: 16, fontWeight: 500, opacity: cl((f - ok) / 4) }}>+ open-bot-avatar 0.1.1</div>}
      </div>
      {CHIPS.map(([at, t, c], i) => f >= at && <Pill key={t} x={W / 2} y={1010 + i * 120} text={t} bg={c} size={44} font={SANS} scale={ob((f - at) / 9, 3)} />)}
      {PEEK.map((id, i) => {
        const x = 120 + i * 168, rise = oe((f - s0 - 8 - i * 2) / 12);
        return <Av key={id} def={BY[id]} x={x} y={1960 - 230 * rise} size={200} f={f} seed={i} gaze={{ x: (W / 2 - x) / 500, y: -1 }} />;
      })}
    </>
  );
};

const ROW = ["controller", "ghost", "cat", "brain", "rocket", "bunny", "mug"];

/** B50-end: title, repo, credit; the row bounces on beats; the faceless dot from the hook rolls in and gets its face. */
const End: React.FC<{ f: number }> = ({ f }) => {
  const s0 = S.end, dotIn = B(53), faceAt = B(55);
  const dx = lerp(W + 160, 880, oe((f - dotIn) / 14));
  const beat = (f - 45) / 16.72, bounce = Math.pow(1 - (beat - Math.floor(beat)), 2.5) * 22;
  const lookDot = f >= dotIn + 4 && f < faceAt + 14;
  return (
    <>
      <Backdrop f={f} accent="#ff6a1a" glowY={760} />
      <Words f={f} text="Open Bot Avatar" f0={s0 + 3} y={520} size={124} stagger={2} />
      <Words f={f} text="by @dom_scholz" f0={s0 + 9} y={690} size={46} color="#9a9aa6" weight={600} stagger={2} />
      <Pill x={W / 2} y={850} text="github.com/DominikScholz/open-bot-avatar" bg="#17171c" border="2px solid #2c2c34" size={30} scale={ob((f - s0 - 12) / 10)} />
      {ROW.map((id, i) => {
        const x = W / 2 + (i - 3) * 142;
        return <Av key={id} def={BY[id]} x={x} y={1200 - bounce * (i % 2 ? 0.6 : 1)} size={148} f={f} seed={i} motion={f >= faceAt + 2 ? "happy" : "idle"}
          gaze={lookDot ? { x: Math.max(-1, Math.min(1, (dx - x) / 300)), y: 1 } : undefined} scale={ob((f - s0 - 4 - i * 1.5) / 10, 2.6)} />;
      })}
      {f >= dotIn && f < faceAt && (
        <svg width={260} height={260} style={{ position: "absolute", left: dx - 130, top: 1560 - 130, transform: `rotate(${(dx - 880) * 0.5}deg) scale(${f > faceAt - 6 ? 1 + 0.05 * Math.sin(f * 2.5) : 1})` }}>
          <circle cx={130} cy={130} r={94} fill="#2a2a30" />
          <text x={130} y={160} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={72} fill="#5d5d66">AI</text>
        </svg>
      )}
      {f >= faceAt && <Av def={DOT} x={880} y={1560} size={260} f={f} color="#ff6a1a" motion="happy" scale={ob((f - faceAt) / 9, 3)} />}
      <Sparkle f={f} fs={faceAt} cx={880} cy={1560} n={14} spread={260} colors={["#fff", "#ff6a1a", "#ffd166"]} />
    </>
  );
};

// ---------------------------------------------------------------------------------------------------- root

const useFonts = () => {
  const [h] = useState(() => delayRender("oba fonts"));
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet"; link.href = staticFile("assets/fonts/fonts.css");
    document.head.appendChild(link);
    link.onload = () => Promise.all(["800 40px 'Bricolage Grotesque'", "600 40px 'Bricolage Grotesque'", "500 40px 'JetBrains Mono'", "700 40px 'JetBrains Mono'"].map((s) => document.fonts.load(s)))
      .then(() => continueRender(h));
  }, [h]);
};

export const ObaPromo: React.FC = () => {
  const f = useCurrentFrame();
  useFonts();
  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      {f < S.swap && <Backdrop f={f} accent="#3a3a44" glowY={1060} />}
      <Scene f={f} s0={-20} s1={S.swap}><Hook f={f} /></Scene>
      <Scene f={f} s0={S.swap} s1={S.grid} punch><Swaps f={f} /></Scene>
      {f >= S.swap && f < S.swap + 20 && <Hook f={f} />}
      <Scene f={f} s0={S.grid} s1={S.chat}><Grid f={f} /></Scene>
      <Scene f={f} s0={S.chat} s1={S.json}><Chat f={f} /></Scene>
      <Scene f={f} s0={S.json} s1={S.dev}><Json f={f} /></Scene>
      <Scene f={f} s0={S.dev} s1={S.end}><Dev f={f} /></Scene>
      <Scene f={f} s0={S.end} s1={OBA_PROMO_FRAMES} punch><End f={f} /></Scene>
      <Flash f={f} at={[S.swap, S.grid, S.chat, S.json, S.dev, S.end]} />
    </AbsoluteFill>
  );
};
