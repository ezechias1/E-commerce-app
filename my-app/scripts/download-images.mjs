import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");
const outputDir = path.join(rootDir, "public/images/products");

// Curated Unsplash photo IDs for each product (royalty-free)
const imageMap = {
  "macbook-pro-16": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
  "macbook-air-15": "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop",
  "dell-xps-16": "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop",
  "thinkpad-x1-carbon": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&h=600&fit=crop",
  "iphone-16-pro-max": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
  "samsung-galaxy-s25-ultra": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop",
  "google-pixel-9-pro": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop",
  "ipad-pro-13": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
  "samsung-galaxy-tab-s10": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop",
  "sony-wh1000xm6": "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop",
  "airpods-pro-3": "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=600&fit=crop",
  "bose-qc-ultra": "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop",
  "sony-a7rv": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop",
  "canon-eos-r5-ii": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop",
  "dji-mavic-4-pro": "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=600&h=600&fit=crop",
  "apple-watch-ultra-3": "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600&h=600&fit=crop",
  "samsung-galaxy-watch-7-ultra": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop",
  "nvidia-rtx-5090": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&h=600&fit=crop",
  "logitech-mx-master-4": "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&h=600&fit=crop",
  "samsung-odyssey-g9": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop",
  "sonos-era-300": "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&h=600&fit=crop",
  "steam-deck-oled": "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&h=600&fit=crop",
  "anker-prime-250w": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop",
  "razer-blackwidow-v5": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop",
};

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    const request = (u) => {
      https.get(u, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Follow redirect
          request(res.headers.location);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const buffer = Buffer.concat(chunks);
          fs.writeFileSync(filepath, buffer);
          resolve(buffer.length);
        });
        res.on("error", reject);
      }).on("error", reject);
    };
    request(url);
  });
}

async function main() {
  console.log("Downloading product images from Unsplash...\n");

  const products = JSON.parse(
    fs.readFileSync(path.join(rootDir, "src/data/products.json"), "utf-8")
  );

  let success = 0;

  for (const product of products) {
    const url = imageMap[product.id];
    if (!url) {
      console.log(`  SKIP: No image URL for ${product.id}`);
      continue;
    }

    const filename = `${product.id}.jpg`;
    const filepath = path.join(outputDir, filename);

    try {
      process.stdout.write(`[${success + 1}/${products.length}] ${product.name}...`);
      const size = await download(url, filepath);
      console.log(` ${(size / 1024).toFixed(0)}KB`);

      // Update product data
      product.image = `/images/products/${filename}`;
      product.images = [`/images/products/${filename}`];
      success++;
    } catch (err) {
      console.log(` FAILED: ${err.message}`);
    }

    // Small delay
    await new Promise((r) => setTimeout(r, 300));
  }

  // Save updated products.json
  fs.writeFileSync(
    path.join(rootDir, "src/data/products.json"),
    JSON.stringify(products, null, 2) + "\n"
  );

  console.log(`\nDone! Downloaded ${success}/${products.length} images.`);
}

main();
