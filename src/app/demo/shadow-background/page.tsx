"use client";

import { DEFAULT_CONFIG, type DebugMode, type ShadowConfig } from "@/components/shadows/config";
import { ShadowBackground } from "@/components/shadows/ShadowBackground";
import { useEffect, useRef, useState } from "react";

interface TweakState {
  shadowColor: string;
  bgColor: string;
  shadowX: number;
  shadowY: number;
  shadowScale: number;
  speed: number;
  strength: number;
  shadowOpacity: number;
  goboBlur: number;
  debugMode: DebugMode;
}

const DEFAULT_TWEAK: TweakState = {
  shadowColor: "#3d4459",
  bgColor: "#F9F9F9",
  shadowX: 0,
  shadowY: 0,
  shadowScale: 1.0,
  speed: DEFAULT_CONFIG.speed,
  strength: DEFAULT_CONFIG.strength,
  shadowOpacity: DEFAULT_CONFIG.shadowOpacity,
  goboBlur: DEFAULT_CONFIG.goboBlur,
  debugMode: "none",
};

function tweakToConfig(t: TweakState): ShadowConfig {
  return {
    speed: t.speed,
    strength: t.strength,
    shadowOpacity: t.shadowOpacity,
    goboBlur: t.goboBlur,
    debugMode: t.debugMode,
  };
}

export default function ShadowBackgroundDemo() {
  const [state, setState] = useState<TweakState>({ ...DEFAULT_TWEAK });
  const stateRef = useRef<TweakState>({ ...DEFAULT_TWEAK });

  const panelRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const paneRef = useRef<any>(null);

  const sync = () => setState({ ...stateRef.current });

  useEffect(() => {
    if (!panelRef.current) return;

    import("tweakpane").then(({ Pane }) => {
      if (!panelRef.current) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pane = new Pane({
        container: panelRef.current,
        title: "ShadowBackground v2",
      }) as any;
      paneRef.current = pane;

      const s = stateRef.current;

      // ── Appearance ──────────────────────────────────────────────────────
      const af = pane.addFolder({ title: "Appearance", expanded: true });

      af.addBinding(s, "shadowColor", { label: "shadow color" }).on(
        "change",
        sync,
      );
      af.addBinding(s, "bgColor", { label: "bg color" }).on("change", sync);
      af.addBlade({ view: "separator" });
      af.addBinding(s, "shadowX", {
        label: "pos x",
        min: -1500,
        max: 1500,
        step: 1,
      }).on("change", sync);
      af.addBinding(s, "shadowY", {
        label: "pos y",
        min: -1500,
        max: 1500,
        step: 1,
      }).on("change", sync);
      af.addBinding(s, "shadowScale", {
        label: "scale",
        min: 0.2,
        max: 3.0,
        step: 0.01,
      }).on("change", sync);
      af.addBlade({ view: "separator" });
      af.addBinding(s, "shadowOpacity", {
        label: "opacity",
        min: 0,
        max: 1,
        step: 0.01,
      }).on("change", sync);

      // ── Animation ───────────────────────────────────────────────────────
      const wf = pane.addFolder({ title: "Animation", expanded: true });

      wf.addBinding(s, "speed", {
        label: "speed",
        min: 0.5,
        max: 12.0,
        step: 0.1,
      }).on("change", sync);
      wf.addBinding(s, "strength", {
        label: "strength",
        min: 0,
        max: 1.5,
        step: 0.01,
      }).on("change", sync);
      wf.addBinding(s, "goboBlur", {
        label: "gobo blur",
        min: 0,
        max: 5.0,
        step: 0.1,
      }).on("change", sync);

      // ── Debug ───────────────────────────────────────────────────────────
      const df = pane.addFolder({ title: "Debug", expanded: true });

      df.addBinding(s, "debugMode", {
        label: "view",
        options: {
          "off (normal)": "none",
          "R — base shadow": "channel_r",
          "G — primary amplitude": "channel_g",
          "B — phase offset": "channel_b",
          "A — secondary amplitude": "channel_a",
          "RGB raw": "rgb_raw",
          "Motion only": "motion",
          "Final greyscale": "final_greyscale",
        },
      }).on("change", sync);

      return () => pane.dispose();
    });
  }, []);

  const reset = () => {
    Object.assign(stateRef.current, DEFAULT_TWEAK);
    setState({ ...DEFAULT_TWEAK });
    paneRef.current?.refresh();
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      <ShadowBackground
        config={tweakToConfig(state)}
        shadowColor={state.shadowColor}
        bgColor={state.bgColor}
        offsetX={state.shadowX}
        offsetY={state.shadowY}
        shadowScale={state.shadowScale}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-5 pointer-events-none">
        <div>
          <p className="text-black/25 text-[11px] font-mono tracking-widest uppercase mb-0.5">
            Component Demo
          </p>
          <h1 className="text-black/60 text-sm font-semibold tracking-tight">
            ShadowBackground v2
          </h1>
        </div>
        <button
          onClick={reset}
          className="pointer-events-auto text-black/35 hover:text-black/60 text-[11px] font-mono tracking-widest uppercase transition-colors px-3 py-1.5 rounded-lg border border-black/12 hover:border-black/25 bg-white/60 backdrop-blur-sm"
        >
          Reset
        </button>
      </div>

      {/* Hint */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 text-black/20 text-[11px] font-mono tracking-widest uppercase whitespace-nowrap pointer-events-none">
        Gobo · R shape + G·A amplitude + B phase · 3 sine harmonics
      </p>

      {/* Tweakpane panel */}
      <div
        ref={panelRef}
        className="absolute right-4 z-30"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          maxHeight: "88vh",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,0,0,0.2) transparent",
        }}
      />
    </main>
  );
}
