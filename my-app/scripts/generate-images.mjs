import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

const ai = new GoogleGenAI({ apiKey: "AIzaSyDKkrLAhTPfvAUFKSP9t0bSjqSRXtjtJgA" });

const products = JSON.parse(
  fs.readFileSync(path.join(rootDir, "src/data/products.json"), "utf-8")
);

const outputDir = path.join(rootDir, "public/images/products");
fs.mkdirSync(outputDir, { recursive: true });

async function generateImage(product) {
  const prompt = `Professional product photography of a ${product.name} by ${product.brand}. Clean white background, studio lighting, centered product, high-end commercial product shot. No text, no watermarks, no labels, photorealistic, 4K quality.`;

  // Try multiple models in order of preference
  const models = [
    "imagen-4.0-fast-generate-001",
    "imagen-4.0-generate-001",
    "gemini-2.0-flash-exp-image-generation",
  ];

  for (const model of models) {
    try {
      if (model.startsWith("imagen")) {
        // Imagen uses generateImages API
        const response = await ai.models.generateImages({
          model,
          prompt,
          config: { numberOfImages: 1 },
        });

        if (response.generatedImages?.[0]?.image?.imageBytes) {
          const buffer = Buffer.from(response.generatedImages[0].image.imageBytes, "base64");
          const filename = getFilename(product);
          fs.writeFileSync(path.join(outputDir, filename), buffer);
          console.log(`  Generated: ${filename} (${(buffer.length / 1024).toFixed(0)}KB) [${model}]`);
          return filename;
        }
      } else {
        // Gemini uses generateContent API
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseModalities: ["image", "text"] },
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const buffer = Buffer.from(part.inlineData.data, "base64");
              const filename = getFilename(product);
              fs.writeFileSync(path.join(outputDir, filename), buffer);
              console.log(`  Generated: ${filename} (${(buffer.length / 1024).toFixed(0)}KB) [${model}]`);
              return filename;
            }
          }
        }
      }
    } catch (error) {
      const msg = error.message || "";
      if (msg.includes("429") || msg.includes("quota")) {
        console.log(`  Rate limited on ${model}, waiting 30s...`);
        await new Promise((r) => setTimeout(r, 30000));
        // Retry this model once after waiting
        try {
          if (model.startsWith("imagen")) {
            const response = await ai.models.generateImages({
              model,
              prompt,
              config: { numberOfImages: 1 },
            });
            if (response.generatedImages?.[0]?.image?.imageBytes) {
              const buffer = Buffer.from(response.generatedImages[0].image.imageBytes, "base64");
              const filename = getFilename(product);
              fs.writeFileSync(path.join(outputDir, filename), buffer);
              console.log(`  Generated: ${filename} (${(buffer.length / 1024).toFixed(0)}KB) [${model}]`);
              return filename;
            }
          }
        } catch {
          // Fall through to next model
        }
      }
      console.log(`  ${model}: ${msg.slice(0, 100)}`);
      continue;
    }
  }

  console.log(`  FAILED: Could not generate image for ${product.name}`);
  return null;
}

function getFilename(product) {
  // Extract base name from current image path (handles both .svg and .png)
  const base = path.basename(product.image).replace(/\.(svg|png)$/, "");
  return base + ".png";
}

async function main() {
  console.log(`Generating images for ${products.length} products with Nano Banana...\n`);

  const results = [];

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i + 1}/${products.length}] ${product.name}`);
    const filename = await generateImage(product);
    results.push({ id: product.id, filename });

    // Delay between requests
    if (i < products.length - 1) {
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // Update products.json to point to .png for successful generations
  let updated = 0;
  for (const result of results) {
    if (result.filename) {
      const product = products.find((p) => p.id === result.id);
      if (product) {
        product.image = `/images/products/${result.filename}`;
        product.images = [`/images/products/${result.filename}`];
        updated++;
      }
    }
  }

  fs.writeFileSync(
    path.join(rootDir, "src/data/products.json"),
    JSON.stringify(products, null, 2) + "\n"
  );

  console.log(`\nDone! Generated ${updated}/${products.length} images.`);
  console.log("products.json updated with new image paths.");
}

main();
