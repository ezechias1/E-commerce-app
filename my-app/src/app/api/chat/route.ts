import anthropic from "@/lib/anthropic";
import { getCatalogSummaryForAI } from "@/lib/products";

export async function POST(request: Request) {
  try {
    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("messages array is required", { status: 400 });
    }

    const catalogSummary = getCatalogSummaryForAI();

    const systemPrompt = `You are a friendly and knowledgeable AI shopping assistant for Es'Store, a premium electronics retailer. You help customers find the right products, compare options, answer technical questions, and provide personalized recommendations.

You have access to the store's product catalog:
${catalogSummary}

Current context:
- User is on page: ${context?.currentPage || "unknown"}

Guidelines:
- Be conversational but concise (2-3 sentences for simple questions, more for comparisons)
- Always reference specific products from the catalog with their exact names and prices
- If asked about products not in the catalog, say so honestly
- Format product mentions as: **Product Name** ($price)
- When comparing products, use brief bullet points
- If the user seems ready to buy, suggest they visit the product page
- Never make up products or prices — only use what's in the catalog`;

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(
                new TextEncoder().encode(event.delta.text)
              );
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return new Response("Failed to process chat message", { status: 500 });
  }
}
