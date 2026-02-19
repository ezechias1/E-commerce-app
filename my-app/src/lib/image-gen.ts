import { GoogleGenAI } from "@google/genai";

let _ai: GoogleGenAI | null = null;

function getAI() {
  if (!_ai) {
    const key = process.env.GOOGLE_GENAI_API_KEY;
    if (!key) throw new Error("GOOGLE_GENAI_API_KEY is not set");
    _ai = new GoogleGenAI({ apiKey: key });
  }
  return _ai;
}

export async function generateProductImage(
  productName: string,
  category: string
): Promise<Buffer | null> {
  const prompt = `Professional product photography of ${productName}, ${category} category. Clean white background, studio lighting, high-end commercial product shot, 4K quality, no text or watermarks.`;

  try {
    const response = await getAI().models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
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
