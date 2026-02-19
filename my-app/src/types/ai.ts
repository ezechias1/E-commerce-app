export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SearchResult {
  matchedProductIds: string[];
  explanation: string;
  refinedQuery: string;
}

export interface RecommendationRequest {
  productId: string;
  category: string;
}
