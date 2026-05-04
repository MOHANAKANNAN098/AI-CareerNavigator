// Run: node generate-icons.js
// Generates icons/icon-192.png and icons/icon-512.png
const { createCanvas } = require('canvas');
const fs = require('fs');

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e3a5f');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.18);
  ctx.fill();

  // Glow circle
  const glow = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size*0.4);
  glow.addColorStop(0, 'rgba(59,130,246,0.35)');
  glow.addColorStop(1, 'rgba(59,130,246,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);

  // "CF" text
  ctx.fillStyle = '#3b82f6';
  ctx.font = `bold ${size * 0.32}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CF', size / 2, size * 0.44);

  // "AI" subtext
  ctx.fillStyle = '#22d3ee';
  ctx.font = `bold ${size * 0.16}px Arial`;
  ctx.fillText('AI', size / 2, size * 0.72);

  return canvas.toBuffer('image/png');
}

try {
  fs.writeFileSync('icons/icon-192.png', generateIcon(192));
  fs.writeFileSync('icons/icon-512.png', generateIcon(512));
  console.log('Icons generated successfully!');
} catch(e) {
  console.log('canvas module not available, using fallback method');
}
