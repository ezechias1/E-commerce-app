const fs = require('fs');
const path = require('path');

// Paths
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const publicDir = path.join(__dirname, '..', 'public');

// Load products
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Category emoji mapping
const categoryEmojis = {
  laptops: '\uD83D\uDCBB',     // laptop
  phones: '\uD83D\uDCF1',      // mobile phone
  tablets: '\uD83D\uDCDD',     // memo / tablet
  headphones: '\uD83C\uDFA7',  // headphone
  cameras: '\uD83D\uDCF7',     // camera
  accessories: '\uD83D\uDD27', // wrench / accessory
};

/**
 * Wrap text into multiple lines that fit within a given width.
 * Approximate: ~8px per character at font-size 22.
 */
function wrapText(text, maxCharsPerLine = 26) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Escape XML special characters for safe embedding in SVG.
 */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate an SVG placeholder for a product.
 */
function generateSvg(product) {
  const width = 400;
  const height = 400;
  const emoji = categoryEmojis[product.category] || '\uD83D\uDCE6'; // fallback: package
  const brand = escapeXml(product.brand);
  const nameLines = wrapText(product.name);

  // Vertical positioning: emoji at center-60, brand below it, then name lines
  const emojiY = 150;
  const brandY = emojiY + 45;
  const nameStartY = brandY + 35;
  const lineHeight = 28;

  const nameTextElements = nameLines
    .map((line, i) => {
      const y = nameStartY + i * lineHeight;
      return `    <text x="${width / 2}" y="${y}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="20" font-weight="600" fill="#1f2937">${escapeXml(line)}</text>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="#f3f4f6" rx="12" ry="12"/>
  <text x="${width / 2}" y="${emojiY}" text-anchor="middle" font-size="64">${emoji}</text>
  <text x="${width / 2}" y="${brandY}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="14" font-weight="400" fill="#6b7280" letter-spacing="1.5">${brand.toUpperCase()}</text>
${nameTextElements}
  <rect x="100" y="${nameStartY + nameLines.length * lineHeight + 15}" width="200" height="1" fill="#d1d5db"/>
  <text x="${width / 2}" y="${nameStartY + nameLines.length * lineHeight + 40}" text-anchor="middle" font-family="system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif" font-size="12" fill="#9ca3af">${escapeXml(product.category.charAt(0).toUpperCase() + product.category.slice(1))} — Placeholder</text>
</svg>`;
}

// Generate all placeholders
let created = 0;
let skipped = 0;

for (const product of products) {
  // The image field is like "/images/products/foo.png"
  // We write an SVG at the same base name but with .svg extension,
  // AND we also write a .png version (actually SVG content, but browsers handle it)
  // Actually, Next.js Image component can serve SVG just fine if we name it .svg.
  // But the products.json references .png — so let's write .svg alongside and
  // also create the file at the exact .png path (SVG content works in <img> tags too).

  const imagePath = product.image; // e.g. "/images/products/macbook-pro-16.png"
  const absPath = path.join(publicDir, imagePath);
  const dir = path.dirname(absPath);

  // Ensure directory exists
  fs.mkdirSync(dir, { recursive: true });

  // Generate SVG content
  const svg = generateSvg(product);

  // Write SVG file at the .svg path
  const svgPath = absPath.replace(/\.\w+$/, '.svg');
  fs.writeFileSync(svgPath, svg, 'utf-8');

  // Also write at the original path (even if .png) so the existing references work
  // SVG content served as .png will still render in most browsers via <img>
  fs.writeFileSync(absPath, svg, 'utf-8');

  created++;
  console.log(`  [OK] ${product.name}`);
  console.log(`       -> ${path.relative(publicDir, svgPath)}`);
  if (svgPath !== absPath) {
    console.log(`       -> ${path.relative(publicDir, absPath)}`);
  }
}

console.log(`\nDone! Created placeholders for ${created} products.`);
if (skipped > 0) console.log(`Skipped ${skipped} (already existed).`);
