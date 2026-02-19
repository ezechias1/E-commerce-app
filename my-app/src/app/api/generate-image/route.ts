import { NextResponse } from "next/server";
import { generateProductImage } from "@/lib/image-gen";
import { getProductById } from "@/lib/products";
import * as fs from "node:fs";
import * as path from "node:path";

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const imageBuffer = await generateProductImage(product.name, product.category);

    if (!imageBuffer) {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 });
    }

    // Save to public/images/products/
    const imagePath = path.join(process.cwd(), "public", "images", "products", `${productId}.png`);
    fs.writeFileSync(imagePath, imageBuffer);

    return NextResponse.json({
      success: true,
      imagePath: `/images/products/${productId}.png`,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}
