uniform sampler2D uGobo;
uniform float     uOpacity;
uniform vec3      uShadowColor;
uniform float     uBlurRadius;
uniform vec2      uTexelSize;    // 1.0 / FBO size
uniform int       uDebugMode;

varying vec2 vUv;

#include "gaussianBlur9"

void main() {
  // Debug: greyscale gobo preview (post-blur)
  if (uDebugMode == 7) {
    float g = gaussianBlur9(uGobo, vUv, uTexelSize, uBlurRadius);
    gl_FragColor = vec4(vec3(g), 1.0); return;
  }

  float gobo  = gaussianBlur9(uGobo, vUv, uTexelSize, uBlurRadius);
  float alpha = (1.0 - gobo) * uOpacity;
  gl_FragColor = vec4(uShadowColor, alpha);
}
