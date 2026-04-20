import * as THREE from "three";

export interface AtlasResult {
  texture: THREE.CanvasTexture;
  cols: number;
  rows: number;
  count: number;
  cellSize: number;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Pack a list of icon URLs into a single sprite atlas.
 * Each cell is `cellSize x cellSize` and the image is `object-contain`'d into it.
 */
export async function buildAtlas(
  iconNames: string[],
  basePath = "/images/texture-icons",
  cellSize = 256
): Promise<AtlasResult> {
  const count = iconNames.length;
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);

  const canvas = document.createElement("canvas");
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("[buildAtlas] Failed to acquire 2D context");

  const padding = Math.round(cellSize * 0.08);
  const inner = cellSize - padding * 2;

  const images = await Promise.all(
    iconNames.map((name) => loadImage(`${basePath}/${name}.webp`))
  );

  images.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const cx = col * cellSize;
    const cy = row * cellSize;

    const aspect = img.width / img.height;
    let dw = inner;
    let dh = inner;
    if (aspect > 1) dh = inner / aspect;
    else dw = inner * aspect;

    const dx = cx + padding + (inner - dw) * 0.5;
    const dy = cy + padding + (inner - dh) * 0.5;
    ctx.drawImage(img, dx, dy, dw, dh);
  });

  const texture = new THREE.CanvasTexture(canvas);
  // colorSpace left as default (NoColorSpace / linear) because the Canvas
  // renderer is configured with outputColorSpace = "srgb-linear". The raw
  // canvas pixels are sRGB-encoded and pass through to the display unchanged
  // — no Three.js re-encoding is applied.
  texture.flipY = false;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return { texture, cols, rows, count, cellSize };
}
