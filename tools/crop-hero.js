// Pure Node.js PNG cropper — no dependencies (uses built-in zlib)
// Crops assets/Image/HERO.png to a portrait aspect ratio (4:4.6) to match the .arch frame.
const fs = require('fs');
const zlib = require('zlib');

const SRC = 'assets/Image/HERO.png';
const DST = 'assets/Image/HERO-cropped.png';
const TARGET_RATIO = 4 / 4.6; // width / height of the arch frame

const buf = fs.readFileSync(SRC);

// --- Validate signature ---
const sig = [137, 80, 78, 71, 13, 10, 26, 10];
for (let i = 0; i < 8; i++) {
  if (buf[i] !== sig[i]) throw new Error('Not a valid PNG file');
}

// --- Parse chunks ---
let offset = 8;
let width = 0, height = 0, bitDepth = 0, colorType = 0, interlace = 0;
const idatChunks = [];

while (offset < buf.length) {
  const len = buf.readUInt32BE(offset);
  const type = buf.toString('ascii', offset + 4, offset + 8);
  const dataStart = offset + 8;
  const dataEnd = dataStart + len;

  if (type === 'IHDR') {
    width = buf.readUInt32BE(dataStart);
    height = buf.readUInt32BE(dataStart + 4);
    bitDepth = buf[dataStart + 8];
    colorType = buf[dataStart + 9];
    interlace = buf[dataStart + 12];
  } else if (type === 'IDAT') {
    idatChunks.push(buf.slice(dataStart, dataEnd));
  } else if (type === 'IEND') {
    break;
  }

  offset = dataEnd + 4; // skip CRC
}

console.log(`Original: ${width}x${height}, bitDepth=${bitDepth}, colorType=${colorType}, interlace=${interlace}`);

if (bitDepth !== 8) throw new Error('Only 8-bit PNGs supported');
if (interlace !== 0) throw new Error('Interlaced PNGs not supported');
if (colorType !== 6 && colorType !== 2 && colorType !== 0) {
  throw new Error(`Unsupported colorType ${colorType} (only 0, 2, 6 supported)`);
}

const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
const bpp = channels; // bytes per pixel (8-bit)

// --- Decompress IDAT ---
const raw = zlib.inflateSync(Buffer.concat(idatChunks));

// --- Unfilter scanlines ---
const stride = width * bpp;
const pixels = Buffer.alloc(height * stride);

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

for (let y = 0; y < height; y++) {
  const filter = raw[y * (stride + 1)];
  const rowStart = y * (stride + 1) + 1;
  const outStart = y * stride;

  for (let x = 0; x < stride; x++) {
    const rawByte = raw[rowStart + x];
    const left = x >= bpp ? pixels[outStart + x - bpp] : 0;
    const up = y > 0 ? pixels[outStart - stride + x] : 0;
    const upLeft = (y > 0 && x >= bpp) ? pixels[outStart - stride + x - bpp] : 0;

    let val;
    switch (filter) {
      case 0: val = rawByte; break;
      case 1: val = rawByte + left; break;
      case 2: val = rawByte + up; break;
      case 3: val = rawByte + Math.floor((left + up) / 2); break;
      case 4: val = rawByte + paeth(left, up, upLeft); break;
      default: throw new Error(`Unknown filter type ${filter}`);
    }
    pixels[outStart + x] = val & 0xFF;
  }
}

// --- Compute crop region (center crop to target ratio) ---
let cropW = width;
let cropH = height;
const currentRatio = width / height;

if (currentRatio > TARGET_RATIO) {
  // Too wide -> crop width
  cropW = Math.round(height * TARGET_RATIO);
} else {
  // Too tall -> crop height
  cropH = Math.round(width / TARGET_RATIO);
}

const cropX = Math.floor((width - cropW) / 2);
const cropY = Math.floor((height - cropH) / 2);

console.log(`Cropping to ${cropW}x${cropH} at offset (${cropX}, ${cropY})`);

// --- Extract cropped pixels ---
const newStride = cropW * bpp;
const cropped = Buffer.alloc(cropH * newStride);
for (let y = 0; y < cropH; y++) {
  const srcStart = (cropY + y) * stride + cropX * bpp;
  const dstStart = y * newStride;
  pixels.copy(cropped, dstStart, srcStart, srcStart + newStride);
}

// --- Re-filter with filter type 0 (None) and compress ---
const filtered = Buffer.alloc(cropH * (newStride + 1));
for (let y = 0; y < cropH; y++) {
  filtered[y * (newStride + 1)] = 0; // filter None
  cropped.copy(filtered, y * (newStride + 1) + 1, y * newStride, (y + 1) * newStride);
}

const compressed = zlib.deflateSync(filtered, { level: 9 });

// --- Build new PNG ---
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c >>> 0;
  }
  let crc = 0xFFFFFFFF;
  const crcInput = Buffer.concat([typeBuf, data]);
  for (let i = 0; i < crcInput.length; i++) {
    crc = crcTable[(crc ^ crcInput[i]) & 0xFF] ^ (crc >>> 8);
  }
  crcBuf.writeUInt32BE((crc ^ 0xFFFFFFFF) >>> 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(cropW, 0);
ihdr.writeUInt32BE(cropH, 4);
ihdr[8] = bitDepth;
ihdr[9] = colorType;
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

const out = Buffer.concat([
  Buffer.from(sig),
  chunk('IHDR', ihdr),
  chunk('IDAT', compressed),
  chunk('IEND', Buffer.alloc(0)),
]);

fs.writeFileSync(DST, out);
console.log(`Wrote ${DST} (${cropW}x${cropH}, ${out.length} bytes)`);