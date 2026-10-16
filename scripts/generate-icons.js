import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const svgBuffer = fs.readFileSync('public/icon.svg');

async function generate() {
  console.log('Generating PWA icons...');

  // 192x192 PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile('public/pwa-192x192.png');
  console.log('✓ Created public/pwa-192x192.png');

  // 512x512 PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile('public/pwa-512x512.png');
  console.log('✓ Created public/pwa-512x512.png');

  // Apple Touch Icon 180x180
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile('public/apple-touch-icon.png');
  console.log('✓ Created public/apple-touch-icon.png');

  // Maskable 512x512 with safe padding (80% size centered on background)
  const innerSize = Math.round(512 * 0.8);
  const padding = Math.round((512 - innerSize) / 2);
  const innerIcon = await sharp(svgBuffer).resize(innerSize, innerSize).png().toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 11, g: 16, b: 33, alpha: 1 } // matches dark brand background
    }
  })
    .composite([{ input: innerIcon, top: padding, left: padding }])
    .png()
    .toFile('public/pwa-maskable-512x512.png');
  console.log('✓ Created public/pwa-maskable-512x512.png');

  // Favicon 48x48 PNG (browsers accept PNG favicon)
  await sharp(svgBuffer)
    .resize(48, 48)
    .png()
    .toFile('public/favicon.ico');
  console.log('✓ Created public/favicon.ico');

  console.log('All PWA icons generated successfully!');
}

generate().catch(console.error);
