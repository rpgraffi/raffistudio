"use client";

import { useEffect, useRef, useState } from "react";

// ─── Perlin Noise 2D ────────────────────────────────────────────────────────

function createNoise2D(seed: number = 42) {
  const perm = new Uint8Array(512);
  const grad2: [number, number][] = [
    [1, 1],
    [-1, 1],
    [1, -1],
    [-1, -1],
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  let s = seed | 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };

  for (let i = 0; i < 256; i++) perm[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (rand() * (i + 1)) | 0;
    const tmp = perm[i];
    perm[i] = perm[j];
    perm[j] = tmp;
  }
  for (let i = 0; i < 256; i++) perm[256 + i] = perm[i];

  return (x: number, y: number): number => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10);
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10);

    const dot = (gi: number, dx: number, dy: number) => {
      const g = grad2[gi & 7];
      return g[0] * dx + g[1] * dy;
    };

    const aa = perm[perm[xi] + yi];
    const ba = perm[perm[xi + 1] + yi];
    const ab = perm[perm[xi] + yi + 1];
    const bb = perm[perm[xi + 1] + yi + 1];

    const n00 = dot(aa, xf, yf);
    const n10 = dot(ba, xf - 1, yf);
    const n01 = dot(ab, xf, yf - 1);
    const n11 = dot(bb, xf - 1, yf - 1);

    return (
      n00 + u * (n10 - n00) + v * (n01 - n00 + u * (n00 - n10 - n01 + n11))
    );
  };
}

// ─── Normalize an angle delta to [-PI, PI] ──────────────────────────────────

function wrapAngle(a: number) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface Agent {
  x: number;
  y: number;
  px: number;
  py: number;
  baseAngle: number;
  turnRate: number;
  baseSpeed: number;
  spreadWeight: number;
  spreadMax: number;
  noff: number;
  color: [number, number, number];
  alpha: number;
  w: number;
  age: number;
  life: number;
  btimer: number;
  bcount: number;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const COLORS: [number, number, number][] = [
  [255, 216, 40], // Yellow
  [255, 144, 32], // Orange
  [255, 60, 90], // Red
  [170, 90, 255], // Violet
  [70, 140, 255], // Blue
];

// Yellow hugs center, darker/cooler colors fan out further
const SPREAD_WEIGHTS = [
  0.1, // Yellow — nearly on the center line
  -0.45, // Orange — slight left
  0.45, // Red — slight right
  -1.3, // Violet — wide left
  1.3, // Blue — wide right
];

const MAX_AGENTS = 400;
const CANVAS_FADE = 0.028;
const HISTORY_SIZE = 16;

// ─── Component ──────────────────────────────────────────────────────────────

export default function BoidsDemoPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true })!;

    let W = 0;
    let H = 0;
    let raf = 0;
    const noise = createNoise2D(42);

    let mx = 0,
      my = 0,
      pmx = 0,
      pmy = 0;
    let smoothSpeed = 0;
    let lastAngle = 0;
    let onCanvas = false;
    let wasMoving = false;
    let time = 0;
    let interacted = false;
    let stillFrames = 0;

    // Rolling position history for curvature estimation
    const posHist: { x: number; y: number }[] = [];

    const agents: Agent[] = [];

    // ── Resize ──

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.width = W + "px";
      canvas!.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // ── Curvature: average angular velocity from recent path ──

    function computeTurnRate(): number {
      if (posHist.length < 4) return 0;

      let total = 0;
      let count = 0;

      for (let i = 2; i < posHist.length; i++) {
        const p0 = posHist[i - 2];
        const p1 = posHist[i - 1];
        const p2 = posHist[i];

        const d1 = Math.hypot(p1.x - p0.x, p1.y - p0.y);
        const d2 = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        if (d1 < 1 || d2 < 1) continue;

        const a1 = Math.atan2(p1.y - p0.y, p1.x - p0.x);
        const a2 = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        total += wrapAngle(a2 - a1);
        count++;
      }

      if (count === 0) return 0;
      const avg = total / count;
      return Math.max(-0.025, Math.min(0.025, avg));
    }

    // ── Input — track velocity, direction & curvature ──

    function onPointerMove(e: PointerEvent) {
      pmx = mx;
      pmy = my;
      mx = e.clientX;
      my = e.clientY;

      const dx = mx - pmx;
      const dy = my - pmy;
      const speed = Math.hypot(dx, dy);
      smoothSpeed = smoothSpeed * 0.7 + speed * 0.3;

      if (speed > 1.5) {
        lastAngle = Math.atan2(dy, dx);
        wasMoving = true;
        stillFrames = 0;

        posHist.push({ x: mx, y: my });
        if (posHist.length > HISTORY_SIZE) posHist.shift();
      }

      if (!interacted) {
        interacted = true;
        setHintVisible(false);
      }
    }

    function onPointerEnter(e: PointerEvent) {
      onCanvas = true;
      mx = e.clientX;
      my = e.clientY;
      pmx = mx;
      pmy = my;
      smoothSpeed = 0;
      posHist.length = 0;
    }

    function onPointerLeave() {
      onCanvas = false;
      if (wasMoving) {
        spawn();
        wasMoving = false;
      }
    }

    // ── Spawn: strokes bloom from cursor on pause ──

    function spawn() {
      const baseSpeed = Math.min(3.0, Math.max(0.8, smoothSpeed * 0.1));
      const spreadMax = 0.1 + Math.random() * 0.05;
      const turnRate = computeTurnRate();

      for (let i = 0; i < 5; i++) {
        agents.push({
          x: mx,
          y: my,
          px: mx,
          py: my,
          baseAngle: lastAngle,
          turnRate,
          baseSpeed: baseSpeed * (0.88 + Math.random() * 0.24),
          spreadWeight: SPREAD_WEIGHTS[i],
          spreadMax,
          noff: Math.random() * 1000,
          color: COLORS[i],
          alpha: 0.22 + Math.random() * 0.06,
          w: 2.0 * (0.7 + Math.random() * 0.4),
          age: 0,
          life: 130 + Math.random() * 70, // ~2.2–3.3s
          btimer: 35 + Math.random() * 45,
          bcount: 0,
        });
      }

      wasMoving = false;
      stillFrames = 0;
      posHist.length = 0;
    }

    // ── Update & render agents ──

    function updateAgents() {
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      const spawns: Agent[] = [];

      for (let i = agents.length - 1; i >= 0; i--) {
        const a = agents[i];
        a.age++;
        if (a.age > a.life) {
          agents.splice(i, 1);
          continue;
        }

        const t = a.age / a.life;

        // Arc continuation: inherited curvature, slowly decaying
        a.baseAngle += a.turnRate;
        a.turnRate *= 0.995;

        // Gradual prism spread: combined first 12%, then fans apart
        const spreadEase = t < 0.12 ? 0 : ((t - 0.12) / 0.88) ** 1.6;
        const spreadAngle = a.spreadWeight * a.spreadMax * spreadEase;

        // Subtle noise wobble
        const n = noise(a.x * 0.002 + a.noff, a.y * 0.002 + time * 0.12);
        const noiseAngle = n * 0.08;

        const angle = a.baseAngle + spreadAngle + noiseAngle;

        // Speed gently decays
        const currentSpeed = a.baseSpeed * (1 - t * 0.3);

        a.px = a.x;
        a.py = a.y;
        a.x += Math.cos(angle) * currentSpeed;
        a.y += Math.sin(angle) * currentSpeed;

        // Soft boundary repulsion blended into angle
        const M = 40;
        let bfx = 0,
          bfy = 0;
        if (a.x < M) bfx += (M - a.x) / M;
        if (a.x > W - M) bfx -= (a.x - (W - M)) / M;
        if (a.y < M) bfy += (M - a.y) / M;
        if (a.y > H - M) bfy -= (a.y - (H - M)) / M;
        if (bfx !== 0 || bfy !== 0) {
          a.baseAngle = Math.atan2(
            Math.sin(a.baseAngle) + bfy * 0.04,
            Math.cos(a.baseAngle) + bfx * 0.04
          );
        }

        // Steep (1-t)^2 opacity — fully invisible before end of life
        const fadeOut = (1 - t) * (1 - t);
        const fadeIn = Math.min(1, a.age / 6);
        const op = a.alpha * fadeOut * fadeIn;
        const w = a.w * Math.max(0, 1 - t * 0.5);

        if (w > 0.05 && op > 0.002) {
          const [r, g, b] = a.color;

          ctx.strokeStyle = `rgba(${r},${g},${b},${op})`;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();

          ctx.strokeStyle = `rgba(${r},${g},${b},${op * 0.22})`;
          ctx.lineWidth = w * 3;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(a.x, a.y);
          ctx.stroke();
        }

        // Subtle branching — one child max
        a.btimer--;
        if (
          a.btimer <= 0 &&
          a.bcount < 1 &&
          agents.length + spawns.length < MAX_AGENTS
        ) {
          const branchAngle = angle + (Math.random() - 0.5) * 0.5;
          spawns.push({
            x: a.x,
            y: a.y,
            px: a.x,
            py: a.y,
            baseAngle: branchAngle,
            turnRate: a.turnRate * 0.5,
            baseSpeed: a.baseSpeed * 0.5,
            spreadWeight: 0,
            spreadMax: 0.02,
            noff: Math.random() * 1000,
            color: a.color,
            alpha: a.alpha * 0.4,
            w: a.w * 0.4,
            age: 0,
            life: a.life * 0.28,
            btimer: 1e9,
            bcount: 1,
          });
          a.bcount++;
          a.btimer = 1e9;
        }
      }

      for (const s of spawns) agents.push(s);
    }

    // ── Animation loop ──

    function frame() {
      time += 0.016;

      // Aggressive canvas fade — guarantees complete vanish
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(0,0,0,${CANVAS_FADE})`;
      ctx.fillRect(0, 0, W, H);

      // Release detection
      if (onCanvas && wasMoving) {
        if (smoothSpeed < 1.5) {
          stillFrames++;
          if (stillFrames > 6) spawn();
        } else {
          stillFrames = 0;
        }
      }

      smoothSpeed *= 0.9;

      updateAgents();

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerenter", onPointerEnter);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0" style={{ background: "#f0f0f0" }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: "crosshair", touchAction: "none" }}
      />

      <div className="absolute top-6 left-8 pointer-events-none select-none">
        <h1 className="text-zinc-300 text-xs tracking-[0.25em] uppercase font-medium">
          Pencil Stroke Boids
        </h1>
      </div>

      <div
        className="absolute bottom-8 inset-x-0 text-center pointer-events-none select-none"
        style={{
          opacity: hintVisible ? 1 : 0,
          transition: "opacity 1.5s ease-out",
        }}
      >
        <p className="text-zinc-400 text-sm">
          Move your cursor, then pause — strokes bloom from the stillness
        </p>
      </div>
    </div>
  );
}
