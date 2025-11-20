
export const lightSourceVars = {
  x: "var(--light-source-x, 0)",
  angle: "var(--light-angle, 0deg)",
};

export const lightShadows = {
  // Standard surface shadow (like in LightCard)
  surface: `
    calc(${lightSourceVars.x} * -5px) 5px 5px rgba(0,0,0,0.05),
    calc(${lightSourceVars.x} * -3px) 3px 2px rgba(0,0,0,0.03),
    inset calc(${lightSourceVars.x} * -2px) 1px 2px rgba(255,255,255,0.3),
    inset 0 0 0 1px rgba(255,255,255,0.1)
  `,

  // Dark surface shadow (derived from LightButton dark variant)
  surfaceDark: `
    calc(${lightSourceVars.x} * -8px) 8px 16px rgba(0,0,0,0.3),
    calc(${lightSourceVars.x} * -2px) 2px 4px rgba(0,0,0,0.2),
    inset calc(${lightSourceVars.x} * -1px) 1px 1px rgba(255,255,255,0.2),
    inset 0 0 0 1px rgba(255,255,255,0.1)
  `,

  // Deep inset shadow (like in InsetFrame outer)
  insetDeep: `
    inset calc(${lightSourceVars.x} * -10px) 10px 15px rgba(0,0,0,0.05),
    inset calc(${lightSourceVars.x} * -3px) 3px 4px rgba(0,0,0,0.05),
    inset calc(${lightSourceVars.x} * -1px) 1px 2px rgba(0,0,0,0.05)
  `,

  // Inner highlight for inset frames (like in InsetFrame inner)
  insetHighlight: `
    inset calc(${lightSourceVars.x} * 6px) -6px 6px rgba(255,255,255,0.2),
    inset calc(${lightSourceVars.x} * 2px) -2px 2px rgba(255,255,255,0.5)
  `
};

