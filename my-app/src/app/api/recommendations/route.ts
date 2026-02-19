import { NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import {
  getProductById,
  getCatalogSummaryForAI,
  getProductsByCategory,
  getAllProducts,
} from "@/lib/products";

export async function POST(request: Request) {
  try {
    const { productId, category } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const catalogSummary = getCatalogSummaryForAI();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 300,
      system:
        "You are a product recommendation engine for Es'Store, an electronics retailer. Given a product the user is viewing, recommend exactly 4 complementary or similar products from the catalog. Return ONLY a valid JSON array of product IDs, nothing else. Consider: same category alternatives, complementary accessories, similar price range items. Do not recommend the same product the user is viewing.",
      messages: [
        {
          role: "user",
          content: `Currently viewing: [${product.id}] ${product.name} - $${product.price} (${product.category})

Full catalog:
${catalogSummary}

Return exactly 4 product IDs as a JSON array.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "[]";

    let recommendedIds: string[];
    try {
      recommendedIds = JSON.parse(responseText);
    } catch {
      // Fallback: same-category products excluding current
      const fallback = getProductsByCategory(category)
        .filter((p) => p.id !== productId)
        .slice(0, 4);
      return NextResponse.json({ recommendations: fallback });
    }

    // Map IDs to full products, filter out invalid IDs
    const allProducts = getAllProducts();
    const recommendations = recommendedIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined && p.id !== productId)
      .slice(0, 4);

    // If we don't have enough, fill with same-category products
    if (recommendations.length < 4) {
      const fallback = getProductsByCategory(category)
        .filter(
          (p) =>
            p.id !== productId &&
            !recommendations.some((r) => r.id === p.id)
        );
      while (recommendations.length < 4 && fallback.length > 0) {
        recommendations.push(fallback.shift()!);
      }
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("AI recommendations error:", error);

    // Fallback to category-based recommendations
    try {
      const { productId, category } = await request.clone().json();
      const fallback = getProductsByCategory(category)
        .filter((p) => p.id !== productId)
        .slice(0, 4);
      return NextResponse.json({ recommendations: fallback });
    } catch {
      return NextResponse.json({ recommendations: [] });
    }
  }
}
