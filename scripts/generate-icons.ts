/**
 * Generate PWA icons and favicon from the source SVG.
 *
 * Usage:
 *   npx tsx scripts/generate-icons.ts
 *
 * Requires: sharp (dev dependency)
 * Source:   static/icons/lingua.svg
 * Outputs:  static/icons/icon-192.png
 *           static/icons/icon-512.png
 *           static/favicon.png
 *           static/favicon.ico        (32x32 ICO)
 *           static/apple-touch-icon.png (180x180)
 *           static/apple-touch-icon-precomposed.png (180x180)
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'static/icons/lingua.svg');
const svgBuffer = readFileSync(svgPath);

const pngSizes = [
	{ size: 192, output: resolve(root, 'static/icons/icon-192.png') },
	{ size: 512, output: resolve(root, 'static/icons/icon-512.png') },
	{ size: 48, output: resolve(root, 'static/favicon.png') },
	{ size: 180, output: resolve(root, 'static/apple-touch-icon.png') },
	{ size: 180, output: resolve(root, 'static/apple-touch-icon-precomposed.png') }
];

for (const { size, output } of pngSizes) {
	await sharp(svgBuffer).resize(size, size).png().toFile(output);
	console.log(`Generated ${output} (${size}x${size})`);
}

// Generate favicon.ico (32x32 PNG wrapped as ICO — browsers accept PNG-in-ICO)
const ico32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
// ICO header for a single 32x32 PNG image
const icoHeader = Buffer.alloc(6 + 16);
icoHeader.writeUInt16LE(0, 0);       // reserved
icoHeader.writeUInt16LE(1, 2);       // ICO type
icoHeader.writeUInt16LE(1, 4);       // 1 image
icoHeader.writeUInt8(32, 6);         // width
icoHeader.writeUInt8(32, 7);         // height
icoHeader.writeUInt8(0, 8);          // color palette
icoHeader.writeUInt8(0, 9);          // reserved
icoHeader.writeUInt16LE(1, 10);      // color planes
icoHeader.writeUInt16LE(32, 12);     // bits per pixel
icoHeader.writeUInt32LE(ico32.length, 14); // image size
icoHeader.writeUInt32LE(22, 18);     // image offset (6 + 16)
const icoPath = resolve(root, 'static/favicon.ico');
const { writeFileSync } = await import('fs');
writeFileSync(icoPath, Buffer.concat([icoHeader, ico32]));
console.log(`Generated ${icoPath} (32x32 ICO)`);
