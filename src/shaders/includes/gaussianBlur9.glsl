// 9-tap horizontal/diagonal Gaussian blur, sampling the red channel of `tex`.
// `texelSize` should be 1.0 / texture size. `radius` of 0 disables the blur.
float gaussianBlur9(sampler2D tex, vec2 uv, vec2 texelSize, float radius) {
  if (radius < 0.01) {
    return texture2D(tex, uv).r;
  }

  float sum = 0.0;
  sum += texture2D(tex, uv).r                                  * 0.1633;
  sum += texture2D(tex, uv - texelSize * radius).r             * 0.1531;
  sum += texture2D(tex, uv + texelSize * radius).r             * 0.1531;
  sum += texture2D(tex, uv - texelSize * radius * 2.0).r       * 0.12245;
  sum += texture2D(tex, uv + texelSize * radius * 2.0).r       * 0.12245;
  sum += texture2D(tex, uv - texelSize * radius * 3.0).r       * 0.0918;
  sum += texture2D(tex, uv + texelSize * radius * 3.0).r       * 0.0918;
  sum += texture2D(tex, uv - texelSize * radius * 4.0).r       * 0.051;
  sum += texture2D(tex, uv + texelSize * radius * 4.0).r       * 0.051;
  return sum;
}
