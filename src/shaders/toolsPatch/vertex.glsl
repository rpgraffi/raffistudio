// Per-instance attributes
attribute float aSide;        // -1.0 (left) or +1.0 (right)
attribute float aAtlasIndex;  // which icon cell in the atlas
attribute float aPhase;       // [0..1) per-instance offset for staggered stream
attribute float aSize;        // size jitter around 1.0
attribute vec2 aP0Jitter;    // small randomization of the off-screen start
attribute vec2 aP1Jitter;    // small randomization of the bezier control point

// Uniforms
uniform float uTime;          // global stream clock (driven by scroll)
uniform float uCycle;         // duration of one full traversal
uniform float uHalfW;         // viewport half width in world units
uniform float uSpawnY;        // world Y of the spawn point (P0.y)
uniform float uBottomY;       // world Y of the convergence point (P2.y)
uniform float uMargin;        // off-screen margin in X (so spawn is hidden)
uniform float uPatchSize;     // base patch size in world units
uniform float uArcOuter;      // how far out the arc bulges (multiplier of halfW)
uniform float uArcLift;       // vertical offset of the arc apex (world units)
uniform float uStretch;       // max bezier-T advancement at the leading edge
uniform float uStretchY;      // world Y where the spaghetti ramp begins (downward)
uniform float uStretchRange;  // world units below uStretchY across which the ramp completes
uniform float uSquash;        // perpendicular thinning when fully spaghettified
uniform float uSizeStart;     // size multiplier at t=0 (typically <= 1)
uniform float uSizeEnd;       // size multiplier at t=1 (typically >= uSizeStart)
uniform float uAtlasCols;
uniform float uAtlasRows;

// Varyings
varying vec2 vUv;
varying vec2 vUvOffset;
varying vec2 vUvScale;
varying float vT;

vec2 bezier(vec2 a, vec2 b, vec2 c, float t) {
  float u = 1.0 - t;
  return u * u * a + 2.0 * u * t * b + t * t * c;
}

vec2 bezierTangent(vec2 a, vec2 b, vec2 c, float t) {
  return 2.0 * (1.0 - t) * (b - a) + 2.0 * t * (c - b);
}

void main() {
  // Per-instance head progress along the path.
  float t = fract((uTime + aPhase) / uCycle);
  vT = t;

  // Bezier control points in world XY.
  vec2 P0 = vec2(aSide * (uHalfW + uMargin) + aP0Jitter.x, uSpawnY + aP0Jitter.y);
  vec2 P1 = vec2(aSide * uHalfW * uArcOuter + aP1Jitter.x, uArcLift + aP1Jitter.y);
  vec2 P2 = vec2(0.0, uBottomY);

  // Head position and tangent at this instance's progress (used for billboarding).
  vec2 headCenter = bezier(P0, P1, P2, t);
  vec2 headTangent = bezierTangent(P0, P1, P2, t);
  vec2 tDir = length(headTangent) > 1e-5 ? normalize(headTangent) : vec2(0.0, -1.0);
  vec2 nDir = vec2(-tDir.y, tDir.x);

  // Subtle progressive scale: small at spawn, larger as the patch nears the end.
  float progressScale = mix(uSizeStart, uSizeEnd, t);
  float size = uPatchSize * aSize * progressScale;

  // Natural billboarded vertex position (sprite-shaped, no spaghetti yet).
  vec2 naturalPos = headCenter + position.x * size * nDir + position.y * size * tDir;

  // Per-vertex spaghetti ramp: 0 above the threshold (vertex unaffected), ramps
  // up to 1 once the vertex's own natural Y has dipped uStretchRange below the
  // threshold. This is what makes only the vertices "inside the area" stretch.
  float vertexRamp = 1.0 - smoothstep(uStretchY - uStretchRange, uStretchY, naturalPos.y);

  // For below-threshold vertices, advance their effective time along the bezier
  // toward the convergence. The leading edge (position.y = +0.5) advances most;
  // the trailing edge (position.y = -0.5) advances not at all -> it stays put
  // even after crossing the threshold, until naturally swept along.
  float advance = uStretch * vertexRamp * (position.y + 0.5);
  float pulledT = clamp(t + advance, 0.0, 1.0);

  vec2 pulledTangent = bezierTangent(P0, P1, P2, pulledT);
  vec2 ptDir = length(pulledTangent) > 1e-5 ? normalize(pulledTangent) : tDir;
  vec2 pnDir = vec2(-ptDir.y, ptDir.x);

  // Pulled position keeps the perpendicular X offset (with optional squash) so
  // the noodle has thickness at the head end too.
  float squashFactor = mix(1.0, uSquash, vertexRamp);
  vec2 pulledPos = bezier(P0, P1, P2, pulledT) + position.x * size * squashFactor * pnDir;

  // Blend natural and pulled positions by the per-vertex ramp. Above the
  // threshold the vertex is exactly at its natural sprite position; below the
  // threshold it sits along the curve at its advanced t.
  vec2 finalPos = mix(naturalPos, pulledPos, vertexRamp);

  gl_Position = projectionMatrix * viewMatrix * vec4(vec3(finalPos, 0.0), 1.0);

  // Atlas UV. The atlas texture is uploaded with flipY = false, so UVs run
  // top-to-bottom in lockstep with the canvas pixel rows.
  float col = mod(aAtlasIndex, uAtlasCols);
  float row = floor(aAtlasIndex / uAtlasCols);
  vUvOffset = vec2(col, row) / vec2(uAtlasCols, uAtlasRows);
  vUvScale = 1.0 / vec2(uAtlasCols, uAtlasRows);
  vUv = uv;
}
