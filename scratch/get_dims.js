import fs from 'fs';

function getWebpDimensions(filepath) {
  const buffer = fs.readFileSync(filepath);
  
  // Check RIFF header
  if (buffer.toString('ascii', 0, 4) !== 'RIFF' || buffer.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Not a valid WebP file');
  }

  const type = buffer.toString('ascii', 12, 16);
  if (type === 'VP8 ') {
    // Simple lossy WebP
    const width = buffer.readUInt16LE(26) & 0x3fff;
    const height = buffer.readUInt16LE(28) & 0x3fff;
    return { width, height, type: 'lossy' };
  } else if (type === 'VP8L') {
    // Lossless WebP
    const n = buffer.readUInt32LE(21);
    const width = (n & 0x3fff) + 1;
    const height = ((n >> 14) & 0x3fff) + 1;
    return { width, height, type: 'lossless' };
  } else if (type === 'VP8X') {
    // Extended WebP
    const width = (buffer.readUInt32LE(24) & 0xffffff) + 1;
    const height = (buffer.readUInt32LE(27) & 0xffffff) + 1;
    return { width, height, type: 'extended' };
  }
  
  throw new Error('Unsupported WebP format chunk: ' + type);
}

try {
  console.log('produkt__1-1.webp:', getWebpDimensions('public/produkt__1-1.webp'));
  console.log('produkt__1-2.webp:', getWebpDimensions('public/produkt__1-2.webp'));
  console.log('produkt__1-3.webp:', getWebpDimensions('public/produkt__1-3.webp'));
} catch (err) {
  console.error(err);
}
