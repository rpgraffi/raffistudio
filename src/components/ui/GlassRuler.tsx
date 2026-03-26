"use client";

import { useCallback, useEffect, useId, useRef } from "react";

const W = 600;
const H = 72;
const R = 10;
const PX_CM = 38;
const CM = 15;
const MX0 = (W - CM * PX_CM) / 2;

// ---------------------------------------------------------------------------
// Refraction physics (ported from archisvaze/liquid-glass)
// ---------------------------------------------------------------------------

function surfaceHeight(x: number): number {
  return Math.pow(1 - Math.pow(1 - x, 4), 0.25);
}

function refractionProfile(
  thickness: number,
  bezel: number,
  ior: number,
  samples = 128,
): Float64Array {
  const eta = 1 / ior;
  const out = new Float64Array(samples);
  for (let i = 0; i < samples; i++) {
    const x = i / samples;
    const y = surfaceHeight(x);
    const deriv =
      (surfaceHeight(x + (x < 1 ? 0.0001 : -0.0001)) - y) /
      (x < 1 ? 0.0001 : -0.0001);
    const mag = Math.sqrt(deriv * deriv + 1);
    const nx = -deriv / mag;
    const ny = -1 / mag;
    const k = 1 - eta * eta * (1 - ny * ny);
    if (k < 0) continue;
    const sq = Math.sqrt(k);
    const rx = -(eta * ny + sq) * nx;
    const ry = eta - (eta * ny + sq) * ny;
    out[i] = rx * ((y * bezel + thickness) / ry);
  }
  return out;
}

function displacementMap(
  w: number,
  h: number,
  radius: number,
  bezel: number,
  profile: Float64Array,
  maxDisp: number,
): string {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = 128;
    d[i + 1] = 128;
    d[i + 2] = 0;
    d[i + 3] = 255;
  }
  const r = radius,
    rSq = r * r,
    r1Sq = (r + 1) ** 2,
    rBSq = Math.max(r - bezel, 0) ** 2,
    wB = w - r * 2,
    hB = h - r * 2,
    S = profile.length;
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op =
        dSq < rSq
          ? 1
          : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const bi = Math.min(((fromSide / bezel) * S) | 0, S - 1);
      const disp = profile[bi] || 0;
      const dx = (-(x / dist) * disp) / maxDisp;
      const dy = (-(y / dist) * disp) / maxDisp;
      const idx = (y1 * w + x1) * 4;
      d[idx] = (128 + dx * 127 * op + 0.5) | 0;
      d[idx + 1] = (128 + dy * 127 * op + 0.5) | 0;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function specularMap(
  w: number,
  h: number,
  radius: number,
  bezel: number,
  angle = Math.PI / 3,
): string {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  const d = img.data;
  d.fill(0);
  const r = radius,
    rSq = r * r,
    r1Sq = (r + 1) ** 2,
    rBSq = Math.max(r - bezel, 0) ** 2,
    wB = w - r * 2,
    hB = h - r * 2,
    sv = [Math.cos(angle), Math.sin(angle)];
  for (let y1 = 0; y1 < h; y1++) {
    for (let x1 = 0; x1 < w; x1++) {
      const x = x1 < r ? x1 - r : x1 >= w - r ? x1 - r - wB : 0;
      const y = y1 < r ? y1 - r : y1 >= h - r ? y1 - r - hB : 0;
      const dSq = x * x + y * y;
      if (dSq > r1Sq || dSq < rBSq) continue;
      const dist = Math.sqrt(dSq);
      const fromSide = r - dist;
      const op =
        dSq < rSq
          ? 1
          : 1 - (dist - Math.sqrt(rSq)) / (Math.sqrt(r1Sq) - Math.sqrt(rSq));
      if (op <= 0 || dist === 0) continue;
      const dot = Math.abs((x / dist) * sv[0] + (-y / dist) * sv[1]);
      const edge = Math.sqrt(Math.max(0, 1 - (1 - fromSide) ** 2));
      const coeff = dot * edge;
      const col = (255 * coeff) | 0;
      const alpha = (col * coeff * op) | 0;
      const idx = (y1 * w + x1) * 4;
      d[idx] = col;
      d[idx + 1] = col;
      d[idx + 2] = col;
      d[idx + 3] = alpha;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
}

function buildFilter(w: number, h: number, radius: number, id: string): string {
  const bezel = Math.min(60, radius - 1, Math.min(w, h) / 2 - 1);
  const profile = refractionProfile(80, bezel, 3.0);
  const maxD = Math.max(...Array.from(profile).map(Math.abs)) || 1;
  const dUrl = displacementMap(w, h, radius, bezel, profile, maxD);
  const sUrl = specularMap(w, h, radius, bezel * 2.5);
  return `
    <filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blurred"/>
      <feImage href="${dUrl}" x="0" y="0" width="${w}" height="${h}" result="disp"/>
      <feDisplacementMap in="blurred" in2="disp" scale="${maxD}" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
      <feColorMatrix in="displaced" type="saturate" values="4" result="dsat"/>
      <feImage href="${sUrl}" x="0" y="0" width="${w}" height="${h}" result="spec"/>
      <feComposite in="dsat" in2="spec" operator="in" result="smask"/>
      <feComponentTransfer in="spec" result="sfade"><feFuncA type="linear" slope="0.5"/></feComponentTransfer>
      <feBlend in="smask" in2="displaced" mode="normal" result="wsat"/>
      <feBlend in="sfade" in2="wsat" mode="normal"/>
    </filter>`;
}

// ---------------------------------------------------------------------------
// Pre-computed ruler marks
// ---------------------------------------------------------------------------

const MARKS = (() => {
  const p: string[] = [];
  for (let mm = 0; mm <= CM * 10; mm++) {
    const x = MX0 + mm * (PX_CM / 10);
    const h = mm % 10 === 0 ? 20 : mm % 5 === 0 ? 13 : 7;
    p.push(`M${x.toFixed(1)} 0V${h}`);
  }
  return p.join("");
})();

const LABELS = (() => {
  const out: { x: number; t: string }[] = [];
  for (let mm = 0; mm <= CM * 10; mm += 10)
    out.push({ x: MX0 + mm * (PX_CM / 10), t: String(mm / 10) });
  return out;
})();

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface DragState {
  x: number;
  y: number;
  angle: number;
  mode: "idle" | "drag" | "rotate";
  mx0: number;
  my0: number;
  x0: number;
  y0: number;
  a0: number;
  rot0: number;
}

export function GlassRuler() {
  const uid = useId().replace(/:/g, "");
  const cls = `glr-${uid}`;
  const fid = `glr-f-${uid}`;

  const elRef = useRef<HTMLDivElement>(null);
  const defsRef = useRef<SVGDefsElement>(null);
  const st = useRef<DragState>({
    x: 0,
    y: 0,
    angle: 0,
    mode: "idle",
    mx0: 0,
    my0: 0,
    x0: 0,
    y0: 0,
    a0: 0,
    rot0: 0,
  });

  function sync() {
    const s = st.current;
    const el = elRef.current;
    if (!el) return;
    el.style.transform = `translate(${s.x - W / 2}px, ${s.y - H / 2}px) rotate(${s.angle}rad)`;
    if (el.style.opacity === "0") el.style.opacity = "1";
  }

  useEffect(() => {
    const isChromium = /Chrome|Chromium/.test(navigator.userAgent);
    if (isChromium && defsRef.current) {
      defsRef.current.innerHTML = buildFilter(W, H, R, fid);
      requestAnimationFrame(() =>
        elRef.current?.classList.add("glass-refraction"),
      );
    }

    const startPadding = 24;
    st.current.x = startPadding + W / 2;
    st.current.y = window.scrollY + startPadding + H / 2;
    st.current.angle = -0.12;
    sync();
  }, [fid]);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const s = st.current;
      if (s.mode === "drag") {
        s.x = s.x0 + (e.clientX - s.mx0);
        s.y = s.y0 + (e.clientY - s.my0);
        sync();
      } else if (s.mode === "rotate") {
        const ry = s.y - window.scrollY;
        s.angle =
          s.rot0 + (Math.atan2(e.clientY - ry, e.clientX - s.x) - s.a0);
        sync();
      }
    }
    function onUp() {
      st.current.mode = "idle";
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, []);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      st.current.angle += e.deltaY * 0.002;
      sync();
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const s = st.current;
    const el = elRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const localX =
      Math.cos(-s.angle) * (e.clientX - cx) -
      Math.sin(-s.angle) * (e.clientY - cy);
    const localY =
      Math.sin(-s.angle) * (e.clientX - cx) +
      Math.cos(-s.angle) * (e.clientY - cy);

    const isNearBottomRight =
      localX > W / 2 - 44 && localY > H / 2 - 44;

    if (isNearBottomRight) {
      s.mode = "rotate";
      s.a0 = Math.atan2(e.clientY - (s.y - window.scrollY), e.clientX - s.x);
      s.rot0 = s.angle;
      return;
    }

    s.mode = "drag";
    s.mx0 = e.clientX;
    s.my0 = e.clientY;
    s.x0 = s.x;
    s.y0 = s.y;
  }, []);

  return (
    <>
      <div
        ref={elRef}
        className={cls}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          borderRadius: R,
          transformOrigin: "50% 50%",
          zIndex: 50,
          opacity: 0,
          cursor: "grab",
          isolation: "isolate",
          touchAction: "none",
          boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.18)",
        }}
        onPointerDown={onDown}
      >
        <svg
          width={W}
          height={H}
          style={{
            position: "relative",
            zIndex: 2,
            overflow: "visible",
          }}
        >
          <path
            d={MARKS}
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="0.75"
            fill="none"
          />
          {LABELS.map((l) => (
            <text
              key={l.t}
              x={l.x}
              y={32}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(0,0,0,0.4)"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {l.t}
            </text>
          ))}
        </svg>

        <div
          className="absolute right-2.5 bottom-2.5 w-4 h-4 rounded-full border border-black/10 flex items-center justify-center"
          style={{ zIndex: 3, cursor: "pointer" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-black/15" />
        </div>
      </div>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="0"
        height="0"
        style={{ position: "absolute", overflow: "hidden" }}
      >
        <defs ref={defsRef} />
      </svg>

      <style>{`
        .${cls}:active { cursor: grabbing; }
        .${cls}::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          border-radius: inherit;
          box-shadow: inset 0 0 20px -5px rgba(255, 255, 255, 0.45);
          background-color: rgba(255, 255, 255, 0.06);
          pointer-events: none;
        }
        .${cls}::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          isolation: isolate;
          backdrop-filter: blur(12px) saturate(1.4);
          -webkit-backdrop-filter: blur(12px) saturate(1.4);
          background-color: rgba(255, 255, 255, 0.15);
        }
        .${cls}.glass-refraction::after {
          backdrop-filter: url(#${fid});
          -webkit-backdrop-filter: url(#${fid});
          background-color: rgba(255, 255, 255, 0.04);
        }
      `}</style>
    </>
  );
}
