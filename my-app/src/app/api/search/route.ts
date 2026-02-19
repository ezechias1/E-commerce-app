import { NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import {
  getCatalogSummaryForAI,
  getAllProducts,
  searchProducts,
} from "@/lib/products";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const catalogSummary = getCatalogSummaryForAI();

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system: `You are a search engine for Es'Store, an electronics retailer. The user will describe what they're looking for in natural language. Analyze their query to understand: desired product type, budget constraints, use case requirements, and any specific features mentioned.

Return a JSON object with:
{
  "matchedProductIds": ["id1", "id2", ...],
  "explanation": "Brief explanation of why these products match",
  "refinedQuery": "A more specific version of the user's query"
}

Only return products that genuinely match. If nothing matches well, return an empty array with an explanation. Return ONLY valid JSON, no markdown.`,
      messages: [
        {
          role: "user",
          content: `Search query: "${query}"

Product catalog:
${catalogSummary}`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "{}";

    let searchResult;
    try {
      searchResult = JSON.parse(responseText);
    } catch {
      // Fallback to basic keyword search
      const fallbackProducts = searchProducts(query);
      return NextResponse.json({
        products: fallbackProducts,
        explanation: `Showing results for "${query}"`,
        refinedQuery: query,
      });
    }

    const allProducts = getAllProducts();
    const matchedProducts = (searchResult.matchedProductIds || [])
      .map((id: string) => allProducts.find((p) => p.id === id))
      .filter((p: unknown): p is NonNullable<typeof p> => p !== undefined);

    return NextResponse.json({
      products: matchedProducts,
      explanation: searchResult.explanation || "",
      refinedQuery: searchResult.refinedQuery || query,
    });
  } catch (error) {
    console.error("AI search error:", error);

    // Fallback to basic search
    try {
      const { query } = await request.clone().json();
      const fallbackProducts = searchProducts(query);
      return NextResponse.json({
        products: fallbackProducts,
        explanation: `Showing results for "${query}"`,
        refinedQuery: query,
      });
    } catch {
      return NextResponse.json({ products: [], explanation: "Search failed", refinedQuery: "" });
    }
  }
}
