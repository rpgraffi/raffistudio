"use client";

import { TransitionLink } from "@/components/layout/PageTransition";
import {
  animate as fmAnimate,
  AnimatePresence,
  motion,
  MotionValue,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type Approach =
  | "progressive-mask"
  | "progressive-stacked"
  | "scale-circle-backdrop"
  | "scale-circle-bg"
  | "clip-path";

interface BlurConfig {
  approach: Approach;
  blurAmount: number;
  duration: number;
  contentFadeDelay: number;
  // progressive-mask / progressive-stacked
  maxRadius: number;
  innerRadiusPct: number;
  // scale-circle
  scaleTo: number;
  baseSize: number;
}

const APPROACHES: { value: Approach; label: string; desc: string }[] = [
  {
    value: "progressive-mask",
    label: "Progressive mask (recommended)",
    desc: "Full-screen backdrop-filter + animated radial mask-image. Smooth gradient blur from click point.",
  },
  {
    value: "progressive-stacked",
    label: "Progressive stacked (2 layers)",
    desc: "2 stacked backdrop-filter layers: soft outer (4px) + strong inner (16px). True varying blur intensity.",
  },
  {
    value: "scale-circle-backdrop",
    label: "Scale circle + backdrop-filter",
    desc: "Scales a rounded-full element with backdrop-filter. Hard edge.",
  },
  {
    value: "scale-circle-bg",
    label: "Scale circle + colored bg (debug)",
    desc: "Same scale animation but with rgba bg — verifies the geometry.",
  },
  {
    value: "clip-path",
    label: "Clip-path + backdrop-filter",
    desc: "Full-screen element with animated clipPath: circle().",
  },
];

export default function TransitionDemo() {
  const [config, setConfig] = useState<BlurConfig>({
    approach: "progressive-mask",
    blurAmount: 14,
    duration: 0.6,
    contentFadeDelay: 0.2,
    maxRadius: 2500,
    innerRadiusPct: 0.25,
    scaleTo: 2.5,
    baseSize: 100,
  });
  const [isBlurring, setIsBlurring] = useState(false);
  const [clickPos, setClickPos] = useState({ x: 400, y: 400 });
  const [log, setLog] = useState<string[]>([]);
  const [frozen, setFrozen] = useState(false);

  const addLog = useCallback((msg: string) => {
    setLog((prev) => [
      ...prev.slice(-30),
      `${new Date().toISOString().slice(11, 23)} ${msg}`,
    ]);
  }, []);

  // ── motion values for progressive blur ──
  const radius = useMotionValue(0);
  const animRef = useRef<ReturnType<typeof fmAnimate> | null>(null);

  const triggerBloom = useCallback(
    (e: React.MouseEvent) => {
      if (isBlurring && !frozen) return;
      const pos = { x: e.clientX, y: e.clientY };
      setClickPos(pos);
      setIsBlurring(true);

      animRef.current?.stop();
      radius.jump(0);
      animRef.current = fmAnimate(radius, config.maxRadius, {
        duration: config.duration,
        ease: [0.4, 0, 0.2, 1],
      });

      addLog(
        `[${config.approach}] at (${pos.x},${pos.y}) blur=${config.blurAmount}px r=${config.maxRadius}px dur=${config.duration}s`,
      );

      if (!frozen) {
        setTimeout(() => {
          setIsBlurring(false);
          addLog("dismissed");
        }, config.duration * 1000 + 800);
      }
    },
    [config, isBlurring, frozen, addLog, radius],
  );

  useEffect(() => {
    if (!isBlurring) {
      animRef.current?.stop();
      radius.jump(0);
    }
  }, [isBlurring, radius]);

  const toggleFreeze = () => {
    if (frozen) {
      setIsBlurring(false);
      setFrozen(false);
      addLog("unfrozen");
    } else {
      setFrozen(true);
      addLog("freeze ON — next bloom stays");
    }
  };

  const update = <K extends keyof BlurConfig>(key: K, val: BlurConfig[K]) =>
    setConfig((c) => ({ ...c, [key]: val }));

  const isProgressive =
    config.approach === "progressive-mask" ||
    config.approach === "progressive-stacked";

  return (
    <div className="min-h-screen relative">
      <motion.div
        className="min-h-screen p-8 cursor-crosshair"
        onClick={triggerBloom}
        animate={{ opacity: isBlurring ? 0 : 1 }}
        transition={{
          duration: isBlurring ? config.duration - config.contentFadeDelay : 0.4,
          delay: isBlurring ? config.contentFadeDelay : 0,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Radial Blur Transition Playground
        </h1>
        <p className="text-lg opacity-70 mb-8">
          Click anywhere to trigger the bloom. Use the panel to tweak
          parameters.
        </p>
        <ContentGrid />

        <div className="mt-12 space-y-4">
          <h2 className="text-2xl font-semibold">Navigation test</h2>
          <p className="opacity-60 text-sm">
            These use the real PageTransition system:
          </p>
          <div className="flex gap-4 flex-wrap">
            <TransitionLink
              href="/demo/transition/target"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Target page &rarr;
            </TransitionLink>
            <TransitionLink
              href="/"
              className="px-4 py-2 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors"
            >
              Homepage &rarr;
            </TransitionLink>
          </div>
        </div>
      </motion.div>

      {/* ─── Progressive blur overlays (always mounted, visibility via mask) ─── */}
      {config.approach === "progressive-mask" && (
        <ProgressiveMaskOverlay
          isActive={isBlurring}
          clickPos={clickPos}
          radius={radius}
          config={config}
        />
      )}
      {config.approach === "progressive-stacked" && (
        <ProgressiveStackedOverlay
          isActive={isBlurring}
          clickPos={clickPos}
          radius={radius}
          config={config}
        />
      )}

      {/* ─── Non-progressive overlays (AnimatePresence) ─── */}
      <AnimatePresence>
        {isBlurring &&
          !isProgressive &&
          (config.approach === "scale-circle-backdrop" ||
            config.approach === "scale-circle-bg") && (
            <>
              <motion.div
                key={`scale-${config.approach}`}
                className="fixed pointer-events-none rounded-full"
                style={{
                  zIndex: 99998,
                  width: `${config.baseSize}vmax`,
                  height: `${config.baseSize}vmax`,
                  left: clickPos.x,
                  top: clickPos.y,
                  x: "-50%",
                  y: "-50%",
                  ...(config.approach === "scale-circle-backdrop"
                    ? {
                        backdropFilter: `blur(${config.blurAmount}px)`,
                        WebkitBackdropFilter: `blur(${config.blurAmount}px)`,
                      }
                    : {
                        background:
                          "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.1) 60%, transparent 100%)",
                      }),
                }}
                initial={{ scale: 0 }}
                animate={{ scale: config.scaleTo }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{
                  duration: config.duration,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
              <motion.div
                key="debug-ring"
                className="fixed pointer-events-none rounded-full"
                style={{
                  zIndex: 99999,
                  width: `${config.baseSize}vmax`,
                  height: `${config.baseSize}vmax`,
                  left: clickPos.x,
                  top: clickPos.y,
                  x: "-50%",
                  y: "-50%",
                  border: "2px dashed rgba(255,0,0,0.35)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: config.scaleTo }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{
                  duration: config.duration,
                  ease: [0.4, 0, 0.2, 1],
                }}
              />
            </>
          )}
        {isBlurring && config.approach === "clip-path" && (
          <motion.div
            key="clip-path"
            className="fixed inset-0 pointer-events-none"
            style={{
              zIndex: 99998,
              backdropFilter: `blur(${config.blurAmount}px)`,
              WebkitBackdropFilter: `blur(${config.blurAmount}px)`,
            }}
            initial={{
              clipPath: `circle(0px at ${clickPos.x}px ${clickPos.y}px)`,
            }}
            animate={{
              clipPath: `circle(${config.maxRadius}px at ${clickPos.x}px ${clickPos.y}px)`,
            }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{
              duration: config.duration,
              ease: [0.4, 0, 0.2, 1],
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Controls panel ─── */}
      <div className="fixed top-4 right-4 z-99999 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-black/80 backdrop-blur-md text-white rounded-xl p-4 text-sm space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">Debug Controls</h3>
          <button
            onClick={toggleFreeze}
            className={`px-2 py-1 rounded text-xs font-mono ${frozen ? "bg-red-600" : "bg-neutral-700 hover:bg-neutral-600"}`}
          >
            {frozen ? "Unfreeze" : "Freeze bloom"}
          </button>
        </div>

        <fieldset className="space-y-1.5">
          <legend className="font-semibold text-xs uppercase tracking-wider opacity-60 mb-1">
            Approach
          </legend>
          {APPROACHES.map((a) => (
            <label
              key={a.value}
              className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${config.approach === a.value ? "bg-white/15" : "hover:bg-white/5"}`}
            >
              <input
                type="radio"
                name="approach"
                checked={config.approach === a.value}
                onChange={() => update("approach", a.value)}
                className="mt-1 accent-blue-500"
              />
              <div>
                <div className="font-medium text-xs">{a.label}</div>
                <div className="text-[10px] opacity-40 leading-snug">
                  {a.desc}
                </div>
              </div>
            </label>
          ))}
        </fieldset>

        <div className="space-y-3">
          <Slider
            label="Blur"
            unit="px"
            value={config.blurAmount}
            min={0}
            max={40}
            step={1}
            onChange={(v) => update("blurAmount", v)}
          />
          <Slider
            label="Duration"
            unit="s"
            value={config.duration}
            min={0.1}
            max={3}
            step={0.05}
            onChange={(v) => update("duration", v)}
          />
          <Slider
            label="Content fade delay"
            unit="s"
            value={config.contentFadeDelay}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => update("contentFadeDelay", v)}
          />

          {isProgressive && (
            <>
              <Slider
                label="Max radius"
                unit="px"
                value={config.maxRadius}
                min={200}
                max={5000}
                step={100}
                onChange={(v) => update("maxRadius", v)}
              />
              <Slider
                label="Inner radius %"
                value={config.innerRadiusPct}
                min={0}
                max={0.8}
                step={0.05}
                onChange={(v) => update("innerRadiusPct", v)}
              />
            </>
          )}

          {!isProgressive && config.approach !== "clip-path" && (
            <>
              <Slider
                label="Scale to"
                value={config.scaleTo}
                min={0.1}
                max={5}
                step={0.1}
                onChange={(v) => update("scaleTo", v)}
              />
              <Slider
                label="Base size"
                unit="vmax"
                value={config.baseSize}
                min={10}
                max={200}
                step={5}
                onChange={(v) => update("baseSize", v)}
              />
            </>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="font-semibold text-xs uppercase tracking-wider opacity-60">
              Log
            </span>
            <button
              onClick={() => setLog([])}
              className="text-xs opacity-40 hover:opacity-80"
            >
              clear
            </button>
          </div>
          <div className="bg-black/40 rounded-lg p-2 max-h-32 overflow-y-auto font-mono text-[10px] leading-relaxed space-y-0.5">
            {log.length === 0 && (
              <span className="opacity-30">click anywhere to start</span>
            )}
            {log.map((l, i) => (
              <div key={i} className="opacity-70">
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Progressive mask overlay — SINGLE layer with radial gradient mask
   Uses useMotionTemplate for per-frame reactive mask-image updates
   ═══════════════════════════════════════════════════════════════════════════ */

function ProgressiveMaskOverlay({
  isActive,
  clickPos,
  radius,
  config,
}: {
  isActive: boolean;
  clickPos: { x: number; y: number };
  radius: MotionValue<number>;
  config: BlurConfig;
}) {
  const inner = useTransform(radius, (r) => r * config.innerRadiusPct);

  const maskImage = useMotionTemplate`radial-gradient(circle at ${clickPos.x}px ${clickPos.y}px, black ${inner}px, transparent ${radius}px)`;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 99998,
        backdropFilter: `blur(${config.blurAmount}px)`,
        WebkitBackdropFilter: `blur(${config.blurAmount}px)`,
        maskImage,
        WebkitMaskImage: maskImage,
      }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ opacity: { duration: isActive ? 0 : 0.3 } }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Progressive stacked overlay — 4 layers with decreasing blur & size
   ═══════════════════════════════════════════════════════════════════════════ */

const STACK_LAYERS = [
  { blur: 4, sizePct: 1.0, innerPct: 0.5 },
  { blur: 16, sizePct: 0.45, innerPct: 0.25 },
];

function ProgressiveStackedOverlay({
  isActive,
  clickPos,
  radius,
  config,
}: {
  isActive: boolean;
  clickPos: { x: number; y: number };
  radius: MotionValue<number>;
  config: BlurConfig;
}) {
  return (
    <>
      {STACK_LAYERS.map((layer, i) => (
        <StackedLayer
          key={i}
          isActive={isActive}
          clickPos={clickPos}
          radius={radius}
          blur={layer.blur}
          sizePct={layer.sizePct}
          innerPct={layer.innerPct}
        />
      ))}
    </>
  );
}

function StackedLayer({
  isActive,
  clickPos,
  radius,
  blur,
  sizePct,
  innerPct,
}: {
  isActive: boolean;
  clickPos: { x: number; y: number };
  radius: MotionValue<number>;
  blur: number;
  sizePct: number;
  innerPct: number;
}) {
  const outerR = useTransform(radius, (r) => r * sizePct);
  const innerR = useTransform(outerR, (r) => r * innerPct);
  const maskImage = useMotionTemplate`radial-gradient(circle at ${clickPos.x}px ${clickPos.y}px, black ${innerR}px, transparent ${outerR}px)`;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 99998,
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        maskImage,
        WebkitMaskImage: maskImage,
      }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ opacity: { duration: isActive ? 0 : 0.3 } }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

function ContentGrid() {
  return (
    <div className="grid grid-cols-3 gap-6 max-w-4xl">
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="rounded-xl p-6 space-y-3"
          style={{
            background: `hsl(${i * 55}, 50%, 92%)`,
            color: `hsl(${i * 55}, 40%, 25%)`,
          }}
        >
          <div className="text-lg font-bold">Card {i + 1}</div>
          <p className="text-sm leading-relaxed">
            Sample content to test blur rendering against real DOM elements. The
            quick brown fox jumps over the lazy dog.
          </p>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-black/10 text-xs">
              tag-a
            </span>
            <span className="px-2 py-0.5 rounded bg-black/10 text-xs">
              tag-b
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <div className="flex justify-between mb-1">
        <span className="opacity-80">{label}</span>
        <span className="font-mono text-xs opacity-50">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-500"
      />
    </label>
  );
}
