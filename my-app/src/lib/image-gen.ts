import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY! });

export async function generateProductImage(
  productName: string,
  category: string
): Promise<Buffer | null> {
  const prompt = `Professional product photography of ${productName}, ${category} category. Clean white background, studio lighting, high-end commercial product shot, 4K quality, no text or watermarks.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: prompt,
      config: {
        responseModalities: ["image", "text"],
      },
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return Buffer.from(part.inlineData.data!, "base64");
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
}
