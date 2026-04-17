export type DebugMode =
  | "none"
  | "channel_r"
  | "channel_g"
  | "channel_b"
  | "channel_a"
  | "rgb_raw"
  | "motion"
  | "final_greyscale";

export const DEBUG_MODE_VALUES: Record<DebugMode, number> = {
  none:             0,
  channel_r:        1,
  channel_g:        2,
  channel_b:        3,
  channel_a:        4,
  rgb_raw:          5,
  motion:           6,
  final_greyscale:  7,
};

export interface ShadowConfig {
  speed: number;            // time multiplier for the sine waves
  strength: number;         // amplitude multiplier applied to G and A
  shadowOpacity: number;    // 0–1
  goboBlur: number;         // blur radius when sampling the gobo FBO (softens B edges)
  debugMode: DebugMode;
}

export const DEFAULT_CONFIG: ShadowConfig = {
  speed:         1.9,
  strength:      0.64,
  shadowOpacity: 0.15,
  goboBlur:      0.5,
  debugMode:     "none",
};

export const GOBO_RT_SIZE = 512;
