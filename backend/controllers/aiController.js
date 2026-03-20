import OpenAI from "openai";
import { uploadFile } from "../services/storageService.js";
import https from "https";
import http from "http";

// Lazy-initialize so a missing env var doesn't crash the server at startup
const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  return new OpenAI({ apiKey, timeout: 60000 });
};

const STYLE_PROMPTS = {
  vector: "flat vector art style, bold clean lines, high contrast, limited color palette",
  vintage: "vintage retro t-shirt graphic, distressed texture, worn look, retro color palette",
  streetwear: "streetwear graphic, urban bold design, graffiti influence, modern typography feel",
  anime: "anime illustration style, vibrant colors, dynamic lines, manga-inspired",
  minimalist: "minimalist design, simple clean shapes, monochromatic, elegant",
  realistic: "detailed realistic illustration, painterly style, rich colors and shading",
};

// Download image from URL and return as Buffer
const downloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
};

// POST /api/ai/generate
const generateDesign = async (req, res) => {
  try {
    const { prompt, style = "vector" } = req.body;

    if (!prompt || prompt.trim().length < 3) {
      return res.status(400).json({ success: false, message: "Please provide a design prompt." });
    }

    const styleGuide = STYLE_PROMPTS[style] || STYLE_PROMPTS.vector;

    const enhancedPrompt = `${prompt.trim()}, t-shirt graphic design, ${styleGuide}, transparent background, centered composition, no background, suitable for screen printing, no text, no words`;

    console.log(`AI Design: generating image for prompt: "${enhancedPrompt.substring(0, 80)}..."`);

    const openai = getOpenAI();
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const imageUrl = response.data[0].url;
    const revisedPrompt = response.data[0].revised_prompt;

    // Download the generated image
    const imageBuffer = await downloadImage(imageUrl);

    // Upload to MinIO under ai-designs/ folder
    const uploadedUrl = await uploadFile(imageBuffer, "design.png", "image/png", "ai-designs");

    console.log(`AI Design: uploaded to MinIO: ${uploadedUrl}`);

    return res.json({
      success: true,
      imageUrl: uploadedUrl,
      revisedPrompt,
      originalPrompt: prompt,
    });
  } catch (error) {
    console.error("AI design generation error:", error?.message || error);

    if (error?.message?.includes("OPENAI_API_KEY is not configured")) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured. Please contact support.",
      });
    }

    if (error?.status === 400 && error?.message?.includes("safety")) {
      return res.status(400).json({
        success: false,
        message: "Your prompt was flagged by content filters. Please try a different description.",
      });
    }

    if (error?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI service is busy. Please try again in a moment.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate design. Please try again.",
    });
  }
};

export { generateDesign };
