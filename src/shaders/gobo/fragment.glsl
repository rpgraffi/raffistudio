uniform sampler2D uTexture;
uniform float     uTime;
uniform float     uStrength;
uniform int       uDebugMode;

varying vec2 vUv;

void main() {
  vec4 params = texture2D(uTexture, vUv);

  float s      = params.r;
  float amp1   = params.g * uStrength;
  float phase1 = (params.b - 0.5) * 6.283185;
  float amp23  = params.a * uStrength;

  vec3  waves  = sin(uTime * vec3(1.0, 2.0, 3.0) + phase1 * vec3(1.0, 2.0, 0.5));
  float motion = (amp1 * waves.x) + (amp23 * 0.5 * waves.y) + (amp23 * 0.3 * waves.z);
  float gobo   = clamp(s + motion, 0.0, 1.0);

  // Debug: channel views render directly without FBO blur
  if (uDebugMode == 1) { gl_FragColor = vec4(vec3(params.r), 1.0); return; }
  if (uDebugMode == 2) { gl_FragColor = vec4(vec3(params.g), 1.0); return; }
  if (uDebugMode == 3) { gl_FragColor = vec4(vec3(params.b), 1.0); return; }
  if (uDebugMode == 4) { gl_FragColor = vec4(vec3(params.a), 1.0); return; }
  if (uDebugMode == 5) { gl_FragColor = vec4(params.rgb, 1.0); return; }
  if (uDebugMode == 6) {
    float m = motion * 0.5 + 0.5;
    gl_FragColor = vec4(vec3(m), 1.0); return;
  }

  // Opaque greyscale gobo → written to FBO
  gl_FragColor = vec4(vec3(gobo), 1.0);
}
