import { NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { getProductById } from "@/lib/products";

const descriptionCache = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    // Check cache
    if (descriptionCache.has(productId)) {
      return NextResponse.json({ description: descriptionCache.get(productId) });
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system:
        "You are an expert e-commerce copywriter for Es'Store, a premium electronics retailer. Generate an engaging, detailed product description that highlights key features and benefits. Keep it to 2-3 short paragraphs. Be informative but not overly salesy. Include specific technical details from the specs. Do not use markdown formatting.",
      messages: [
        {
          role: "user",
          content: `Write an enhanced product description for:
Product: ${product.name}
Brand: ${product.brand}
Category: ${product.category}
Price: $${product.price}
Original Description: ${product.description}
Specs: ${Object.entries(product.specs).map(([k, v]) => `${k}: ${v}`).join(", ")}
Tags: ${product.tags.join(", ")}`,
        },
      ],
    });

    const description =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Cache the result
    descriptionCache.set(productId, description);

    return NextResponse.json({ description });
  } catch (error) {
    console.error("AI describe error:", error);
    return NextResponse.json(
      { error: "Failed to generate description" },
      { status: 500 }
    );
  }
}
