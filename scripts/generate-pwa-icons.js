/**
 * Generates PWA PNG icons without any external dependencies.
 * Uses Node.js built-in zlib for deflate compression and implements
 * a minimal PNG encoder with a correct CRC32 implementation.
 *
 * Produces:
 *   public/icons/pwa-192x192.png  – 192×192 standard icon
 *   public/icons/pwa-512x512.png  – 512×512 standard icon
 *   public/icons/pwa-maskable.png – 512×512 full-bleed maskable icon
 */

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/icons");
mkdirSync(OUT, { recursive: true });

// ── CRC32 ──────────────────────────────────────────────────────────────────
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[i] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ── PNG chunk helper ───────────────────────────────────────────────────────
function pngChunk(type, data) {
  const t = Buffer.from(type, "ascii");
  const len = Buffer.allocUnsafe(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.allocUnsafe(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
}

// ── PNG encoder ────────────────────────────────────────────────────────────
// drawPixel(x, y, size) must return [r, g, b]
function makePNG(size, drawPixel) {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: RGB (truecolour)

  const rowLen = 1 + size * 3; // 1 filter byte + 3 bytes per pixel
  const raw = Buffer.alloc(rowLen * size);

  for (let y = 0; y < size; y++) {
    raw[y * rowLen] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const [r, g, b] = drawPixel(x, y, size);
      const off = y * rowLen + 1 + x * 3;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
    }
  }

  return Buffer.concat([
    SIG,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

// ── App palette ────────────────────────────────────────────────────────────
const DARK = [15, 23, 42]; // #0f172a  – app dark background
const BLUE = [59, 130, 246]; // #3b82f6  – accent blue

// ── Icon designs ───────────────────────────────────────────────────────────

// Standard icon: dark background + blue filled circle (38% radius)
function standardPixel(x, y, size) {
  const cx = size / 2,
    cy = size / 2,
    r = size * 0.38;
  return Math.hypot(x - cx, y - cy) <= r ? BLUE : DARK;
}

// Maskable icon: full-bleed blue background + dark circle marker in centre
// The "safe zone" for maskable icons is the inner 80% – the dark circle sits
// well inside it so the icon looks good after any system masking shape.
function maskablePixel(x, y, size) {
  const cx = size / 2,
    cy = size / 2,
    r = size * 0.28;
  return Math.hypot(x - cx, y - cy) <= r ? DARK : BLUE;
}

// ── Write files ────────────────────────────────────────────────────────────
const icons = [
  { file: "pwa-192x192.png", size: 192, fn: standardPixel },
  { file: "pwa-512x512.png", size: 512, fn: standardPixel },
  { file: "pwa-maskable.png", size: 512, fn: maskablePixel },
];

for (const { file, size, fn } of icons) {
  writeFileSync(resolve(OUT, file), makePNG(size, fn));
  console.log(`✓ Generated public/icons/${file}  (${size}×${size})`);
}
