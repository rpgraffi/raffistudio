"use client";

import { PATHS, Signature } from "@/components/site/Signature";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "sequential" | "stagger" | "manual";

interface StrokeTiming {
  delay: number;
  duration: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STROKE_LABELS = ["Hook", "Body", "Flourish", "Dot"];

const EASINGS = [
  { label: "Ink (default)", value: "cubic-bezier(0.65, 0, 0.35, 1)" },
  { label: "Linear",        value: "linear" },
  { label: "Ease Out",      value: "ease-out" },
  { label: "Ease In/Out",   value: "ease-in-out" },
  { label: "Material",      value: "cubic-bezier(0.4, 0, 0.2, 1)" },
  { label: "Spring",        value: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
  { label: "Expo Out",      value: "cubic-bezier(0.19, 1, 0.22, 1)" },
  { label: "Power3 Out",    value: "cubic-bezier(0.215, 0.61, 0.355, 1)" },
  { label: "Bounce",        value: "cubic-bezier(0.68, -0.55, 0.265, 1.55)" },
];

const MODE_DESCRIPTIONS: Record<Mode, string> = {
  sequential: "Each stroke starts after the previous ends + gap. Negative gap = overlap.",
  stagger:    "Each stroke starts at delay + i × stagger, independent of path lengths.",
  manual:     "Set an absolute start time for each stroke individually.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function measurePaths(): number[] {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 158 71");
  Object.assign(svg.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    top: "-9999px",
  });
  document.body.appendChild(svg);
  const ls = PATHS.map((d) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
    return path.getTotalLength();
  });
  document.body.removeChild(svg);
  return ls;
}

function computeTimings(
  lengths: number[],
  speed: number,
  gap: number,
  initialDelay: number,
  mode: Mode,
  stagger: number,
  manualDelays: number[],
  manualDurations: number[],
): StrokeTiming[] {
  if (mode === "manual") {
    return lengths.map((len, i) => ({
      delay: manualDelays[i] ?? 0,
      duration: manualDurations[i] ?? len / speed,
    }));
  }
  if (mode === "stagger") {
    return lengths.map((len, i) => ({
      delay: Math.max(0, initialDelay + i * stagger),
      duration: len / speed,
    }));
  }
  const result: StrokeTiming[] = [];
  let cursor = initialDelay;
  for (const len of lengths) {
    result.push({ delay: Math.max(0, cursor), duration: len / speed });
    cursor += len / speed + gap;
  }
  return result;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SliderRow({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  disabled = false,
  accent = false,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  accent?: boolean;
}) {
  return (
    <div className={disabled ? "opacity-30 pointer-events-none select-none" : ""}>
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-xs font-medium ${accent ? "text-zinc-800" : "text-zinc-600"}`}>
          {label}
        </span>
        <span className="text-xs tabular-nums text-zinc-400">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-zinc-800 cursor-pointer"
      />
    </div>
  );
}

function Timeline({
  timings,
  totalDuration,
}: {
  timings: StrokeTiming[];
  totalDuration: number;
}) {
  const safe = totalDuration > 0 ? totalDuration : 1;
  return (
    <div className="flex flex-col gap-2">
      {timings.map((t, i) => {
        const startPct = (t.delay / safe) * 100;
        const widthPct = Math.max(1, (t.duration / safe) * 100);
        const endPct = Math.min(100, startPct + widthPct);
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 w-14 text-right shrink-0">
              {STROKE_LABELS[i]}
            </span>
            <div className="relative flex-1 h-4 rounded-sm overflow-hidden bg-zinc-200">
              <div
                className="absolute h-full bg-zinc-800 rounded-sm transition-all duration-150"
                style={{ left: `${startPct}%`, width: `${endPct - startPct}%` }}
              />
            </div>
            <span className="text-xs tabular-nums text-zinc-400 w-10 shrink-0">
              {t.duration.toFixed(2)}s
            </span>
          </div>
        );
      })}
      {/* Time axis */}
      <div className="flex items-center gap-3 mt-0.5">
        <span className="w-14 shrink-0" />
        <div className="flex-1 flex justify-between">
          <span className="text-xs text-zinc-300">0</span>
          <span className="text-xs text-zinc-300">{(safe / 2).toFixed(1)}s</span>
          <span className="text-xs text-zinc-300">{safe.toFixed(2)}s</span>
        </div>
        <span className="w-10 shrink-0" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignatureDemoPage() {
  const [replayKey, setReplayKey]       = useState(0);
  const [mode, setMode]                 = useState<Mode>("sequential");
  const [speed, setSpeed]               = useState(380);
  const [gap, setGap]                   = useState(0.08);
  const [stagger, setStagger]           = useState(0.3);
  const [initialDelay, setInitialDelay] = useState(0.4);
  const [strokeWidth, setStrokeWidth]   = useState(2);
  const [easing, setEasing]             = useState("cubic-bezier(0.65, 0, 0.35, 1)");
  const [manualDelays, setManualDelays]       = useState<number[]>([0, 0.4, 2.5, 2.9]);
  const [manualDurations, setManualDurations] = useState<number[]>([0.17, 2.1, 0.35, 0.1]);

  const [lengths, setLengths] = useState<number[] | null>(null);
  const [copied, setCopied]   = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setLengths(measurePaths()); }, []);

  const timings: StrokeTiming[] = lengths
    ? computeTimings(lengths, speed, gap, initialDelay, mode, stagger, manualDelays, manualDurations)
    : PATHS.map(() => ({ delay: 0, duration: 0 }));

  const totalEnd = timings.length > 0
    ? Math.max(...timings.map((t) => t.delay + t.duration))
    : 0;

  function setManualDelay(i: number, v: number) {
    setManualDelays((prev) => prev.map((d, j) => (j === i ? v : d)));
  }

  function setManualDuration(i: number, v: number) {
    setManualDurations((prev) => prev.map((d, j) => (j === i ? v : d)));
  }

  // Build config string
  let configProps: string;
  if (mode === "manual") {
    const dArr = manualDelays.map((d) => d.toFixed(2)).join(", ");
    const durArr = manualDurations.map((d) => d.toFixed(2)).join(", ");
    configProps = `strokeDelays={[${dArr}]} strokeDurations={[${durArr}]} strokeWidth={${strokeWidth}} easing="${easing}"`;
  } else if (mode === "stagger") {
    configProps = `speed={${speed}} stagger={${stagger.toFixed(2)}} delay={${initialDelay.toFixed(2)}} strokeWidth={${strokeWidth}} easing="${easing}"`;
  } else {
    configProps = `speed={${speed}} gap={${gap.toFixed(2)}} delay={${initialDelay.toFixed(2)}} strokeWidth={${strokeWidth}} easing="${easing}"`;
  }
  const configStr = `<Signature ${configProps} animate triggerOnView={false} />`;

  function handleCopy() {
    navigator.clipboard.writeText(configStr).catch(() => {});
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background text-zinc-800 font-sans">
      {/* Header */}
      <div className="border-b border-zinc-300 px-8 py-4 flex items-center gap-3">
        <span className="text-sm font-semibold tracking-tight">Signature</span>
        <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-500 font-mono">
          demo
        </span>
        <span className="text-zinc-300 text-xs ml-1">/demo/signature</span>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] min-h-[calc(100vh-53px)]">

        {/* ── Preview pane ── */}
        <div className="flex flex-col items-center justify-center gap-8 px-12 py-16 border-r border-zinc-300">
          <div className="w-full max-w-lg">
            <Signature
              key={replayKey}
              className="w-full text-zinc-800"
              strokeWidth={strokeWidth}
              speed={speed}
              gap={mode === "sequential" ? gap : undefined}
              stagger={mode === "stagger" ? stagger : undefined}
              strokeDelays={mode === "manual" ? manualDelays : undefined}
              strokeDurations={mode === "manual" ? manualDurations : undefined}
              delay={mode !== "manual" ? initialDelay : undefined}
              easing={easing}
              animate
              triggerOnView={false}
            />
          </div>

          <button
            onClick={() => setReplayKey((k) => k + 1)}
            className="px-4 py-2 text-sm font-medium bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 active:scale-95 transition-all"
          >
            Replay
          </button>

          {/* Timeline */}
          {lengths && (
            <div className="w-full max-w-lg">
              <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-widest">
                Timeline
              </p>
              <Timeline timings={timings} totalDuration={totalEnd} />
            </div>
          )}
        </div>

        {/* ── Controls pane ── */}
        <div className="flex flex-col gap-6 px-6 py-8 overflow-y-auto">

          {/* Mode toggle */}
          <div>
            <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">
              Timing mode
            </p>
            <div className="flex rounded-lg overflow-hidden border border-zinc-300 text-xs">
              {(["sequential", "stagger", "manual"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1.5 text-center capitalize transition-colors ${
                    mode === m
                      ? "bg-zinc-800 text-white"
                      : "bg-white text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              {MODE_DESCRIPTIONS[mode]}
            </p>
          </div>

          <div className="border-t border-zinc-200" />

          {/* Speed — always visible */}
          <SliderRow
            label="Speed"
            value={speed}
            display={`${speed} u/s`}
            min={30} max={900} step={10}
            onChange={setSpeed}
          />

          {/* Sequential-only controls */}
          <SliderRow
            label="Gap between strokes"
            value={gap}
            display={`${gap.toFixed(2)}s`}
            min={-1} max={0.8} step={0.01}
            onChange={setGap}
            disabled={mode !== "sequential"}
          />

          {/* Stagger-only control */}
          <SliderRow
            label="Stagger offset"
            value={stagger}
            display={`${stagger.toFixed(2)}s`}
            min={0} max={1.5} step={0.01}
            onChange={setStagger}
            disabled={mode !== "stagger"}
          />

          {/* Initial delay — sequential + stagger */}
          <SliderRow
            label="Initial delay"
            value={initialDelay}
            display={`${initialDelay.toFixed(2)}s`}
            min={0} max={2} step={0.05}
            onChange={setInitialDelay}
            disabled={mode === "manual"}
          />

          {/* Manual per-stroke controls */}
          {mode === "manual" && (
            <div className="flex flex-col gap-5">
              {/* Start times */}
              <div className="flex flex-col gap-4">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                  Stroke start times
                </p>
                {STROKE_LABELS.map((label, i) => (
                  <SliderRow
                    key={i}
                    label={label}
                    value={manualDelays[i] ?? 0}
                    display={`${(manualDelays[i] ?? 0).toFixed(2)}s`}
                    min={0} max={5} step={0.05}
                    onChange={(v) => setManualDelay(i, v)}
                    accent
                  />
                ))}
              </div>

              <div className="border-t border-zinc-200" />

              {/* Durations */}
              <div className="flex flex-col gap-4">
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                  Stroke durations
                </p>
                {STROKE_LABELS.map((label, i) => (
                  <SliderRow
                    key={i}
                    label={label}
                    value={manualDurations[i] ?? 0.2}
                    display={`${(manualDurations[i] ?? 0.2).toFixed(2)}s`}
                    min={0.05} max={3} step={0.05}
                    onChange={(v) => setManualDuration(i, v)}
                    accent
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stroke width — always visible */}
          <SliderRow
            label="Stroke width"
            value={strokeWidth}
            display={`${strokeWidth}px`}
            min={0.5} max={6} step={0.5}
            onChange={setStrokeWidth}
          />

          <div className="border-t border-zinc-200" />

          {/* Easing */}
          <div>
            <p className="text-xs font-medium text-zinc-600 mb-1.5">Easing</p>
            <select
              value={easing}
              onChange={(e) => setEasing(e.target.value)}
              className="w-full text-sm bg-white border border-zinc-300 rounded-md px-3 py-1.5 text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            >
              {EASINGS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <p className="text-xs text-zinc-400 mt-1.5 font-mono break-all">{easing}</p>
          </div>

          <div className="border-t border-zinc-200" />

          {/* Timing stats */}
          {lengths && (
            <div>
              <p className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-widest">
                Stroke timings
              </p>
              <div className="flex flex-col gap-1.5">
                {timings.map((t, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-xs text-zinc-500">{STROKE_LABELS[i]}</span>
                    <span className="text-xs tabular-nums text-zinc-700">
                      {t.delay.toFixed(2)}s → {(t.delay + t.duration).toFixed(2)}s
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-zinc-200 flex justify-between">
                <span className="text-xs font-medium text-zinc-500">Total</span>
                <span className="text-xs tabular-nums font-semibold text-zinc-800">
                  {totalEnd.toFixed(2)}s
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-zinc-200" />

          {/* Copy config */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                Config
              </p>
              <button
                onClick={handleCopy}
                className="text-xs text-zinc-500 hover:text-zinc-800 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-xs bg-zinc-100 rounded-md p-3 text-zinc-600 break-all whitespace-pre-wrap leading-relaxed font-mono">
              {configStr}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
