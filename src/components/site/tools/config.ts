/**
 * Single source of truth for the Tools-section visual parameters.
 *
 * `ToolsSection` reads these directly.
 * The demo page (`/demo/tools`) seeds its leva controls from these values
 * so sliders always start at whatever is live on the production section.
 */

export const TOOL_ICONS = [
  "figma",
  "blender",
  "openai",
  "flutter",
  "dart",
  "swift",
  "directus",
  "docker",
  "fastapi",
  "firebase",
  "git",
  "github",
  "graphql",
  "nginx",
  "postgres",
  "python",
  "react",
  "tailwind",
  "typescript",
  "unity",
  "unreal",
  "webflow",
  "rive",
  "xcode",
];

// ─── Scroll ─────────────────────────────────────────────────────────────────

/** Total section height in vh. 100vh is the pinned viewport; the rest is the
 *  scroll-through distance that drives the stream. */
export const SECTION_HEIGHT_VH = 250;

// ─── Stream ──────────────────────────────────────────────────────────────────

export const STREAM = {
  instanceCount: 40,
  /** Seconds for one patch to travel the full bezier. */
  cycle: 1.0,
  /** Maps full scroll progress → seconds of stream time. */
  scrollSpan: 0.5,
  /** Seconds/frame of idle drift when the user isn't scrolling. */
  idleDrift: 0.01,
} as const;

// ─── Arc ─────────────────────────────────────────────────────────────────────

export const ARC = {
  /** How far the arc bulges (multiplier of viewport half-width). */
  arcOuter: 0.0,
  /** Vertical offset of the arc apex in world units. */
  arcLift: 1.0,
  /** Convergence point height as a fraction of viewport height from the bottom. */
  convergeFromBottom: 0.15,
  /** Off-screen spawn margin in X (world units). */
  margin: 4,
  /** World-Y of the spawn point; should sit above the viewport top. */
  spawnY: 3,
} as const;

// ─── Scatter ─────────────────────────────────────────────────────────────────

export const SCATTER = {
  p0JitterX: 1,
  p0JitterY: 1,
  p1JitterX: 1,
  p1JitterY: 1,
} as const;

// ─── Size ────────────────────────────────────────────────────────────────────

export const SIZE = {
  patchSize: 0.4,
  sizeMin: 0.9,
  sizeMax: 1.1,
  /** Scale multiplier at spawn (t=0). */
  sizeStart: 0.2,
  /** Scale multiplier at convergence (t=1). */
  sizeEnd: 1.0,
} as const;

// ─── Spaghettification ───────────────────────────────────────────────────────

export const STRETCH = {
  stretch: 0.30,
  stretchY: 0.5,
  stretchRange: 1.45,
  squash: 0.05,
  ySegments: 32,
} as const;
