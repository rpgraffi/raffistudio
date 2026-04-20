uniform sampler2D uAtlas;
varying vec2 vUv;
varying vec2 vUvOffset;
varying vec2 vUvScale;
varying float vT;
void main() {
  vec2 uv = vUvOffset + vUv * vUvScale;
  vec4 tex = texture2D(uAtlas, uv);
  float fadeIn = smoothstep(0.00, 0.08, vT);
  float fadeOut = 1.0 - smoothstep(0.85, 1.0, vT);
  float a = fadeIn * fadeOut;
  if(tex.a * a < 0.01)
    discard;
  gl_FragColor = vec4(tex.rgb, tex.a * a);
}