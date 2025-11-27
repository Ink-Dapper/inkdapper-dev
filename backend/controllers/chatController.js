import OpenAI from "openai";

// Initialize OpenAI client using API key from environment or fallback
const apiKey = process.env.OPENAI_API_KEY || "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";

console.log("OpenAI API Key Status:", {
  hasKey: !!apiKey,
  keyLength: apiKey?.length,
  keyPrefix: apiKey?.substring(0, 10) + "...",
  fromEnv: !!process.env.OPENAI_API_KEY,
});

if (!apiKey || apiKey.length < 20) {
  console.warn("Warning: OpenAI API key appears to be invalid or missing");
}

// Initialize OpenAI client with the provided API key
const openai = new OpenAI({
  apiKey: apiKey,
  timeout: 30000, // 30 seconds timeout
});

console.log("OpenAI client initialized successfully");

// Basic health check for the chat controller
const chatHealth = async (req, res) => {
  try {
    console.log("Health check: Testing OpenAI connection...");
    // Test OpenAI connection with a simple request
    const testCompletion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "user", content: "Say 'OK' if you can hear me." }],
      max_tokens: 10,
    });
    
    console.log("Health check: OpenAI test successful");
    return res.json({
      success: true,
      message: "AI chat endpoint is running",
      openaiConnected: true,
      testResponse: testCompletion.choices?.[0]?.message?.content || "No response",
    });
  } catch (error) {
    console.error("Health check OpenAI test failed:", error);
    console.error("Health check error details:", {
      message: error.message,
      status: error.status,
      code: error.code,
      response: error.response?.data,
    });
    return res.json({
      success: true,
      message: "AI chat endpoint is running",
      openaiConnected: false,
      error: error.message,
      errorDetails: process.env.NODE_ENV === 'development' ? {
        status: error.status,
        code: error.code,
        response: error.response?.data,
      } : undefined,
    });
  }
};

// Main AI chat handler
const aiChat = async (req, res) => {
  try {
    const { message, history } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    console.log("AI Chat Request:", {
      messageLength: message.length,
      hasHistory: !!history,
      apiKeyPresent: !!apiKey,
      apiKeyLength: apiKey?.length,
      apiKeyPrefix: apiKey?.substring(0, 7),
    });

    // Build conversation context
    const messages = [
      {
        role: "system",
        content:
          "You are Ink Dapper's virtual assistant. Be clear, concise and friendly. " +
          "You answer questions about Ink Dapper t-shirts, products, orders, shipping, returns, refunds, and support. " +
          "You do NOT have direct access to the database or user orders; if the user asks about a specific order, " +
          "politely tell them to check the My Orders section on the website or share their order ID with the site chatbot, which can look it up. " +
          "Never mention that you are calling an external API. Keep answers short and practical.",
      },
    ];

    if (Array.isArray(history)) {
      history.forEach((item) => {
        if (item && item.role && item.content) {
          messages.push({
            role: item.role,
            content: String(item.content).slice(0, 1000),
          });
        }
      });
    }

    messages.push({
      role: "user",
      content: message.slice(0, 2000),
    });

    console.log("Sending request to OpenAI with", messages.length, "messages");
    console.log("Request details:", {
      model: "gpt-4o-mini",
      messageCount: messages.length,
      lastMessage: messages[messages.length - 1]?.content?.substring(0, 50) + "...",
    });

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages,
        temperature: 0.6,
        max_tokens: 350,
      });
      console.log("OpenAI response received successfully:", {
        hasChoices: !!completion.choices,
        choicesLength: completion.choices?.length,
        usage: completion.usage,
      });
    } catch (openaiError) {
      console.error("OpenAI API call failed:", openaiError);
      console.error("OpenAI error details:", {
        message: openaiError.message,
        status: openaiError.status,
        code: openaiError.code,
        type: openaiError.type,
        response: openaiError.response?.data,
      });
      throw openaiError; // Re-throw to be caught by outer catch
    }

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I could not generate a response right now.";

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI chat error - Full Error Object:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.request) {
      console.error("Error request details:", {
        method: error.config?.method,
        url: error.config?.url,
        headers: error.config?.headers,
      });
    }
    
    // Provide more specific error messages
    let errorMessage = "Failed to generate AI reply. Please try again later.";
    let statusCode = 500;
    
    // Check for quota/rate limit errors first
    if (error.code === 'insufficient_quota' || error.type === 'insufficient_quota' || 
        (error.error && error.error.code === 'insufficient_quota')) {
      statusCode = 429;
      errorMessage = "The AI service quota has been exceeded. Please contact support or try again later. For now, you can still ask about orders, products, shipping, or returns using the quick options below.";
    } else if (error.response) {
      statusCode = error.response.status;
      if (statusCode === 401) {
        errorMessage = "AI service authentication failed. The API key may be invalid or expired.";
      } else if (statusCode === 429) {
        // Check if it's a quota issue or rate limit
        if (error.error?.code === 'insufficient_quota' || error.code === 'insufficient_quota') {
          errorMessage = "The AI service quota has been exceeded. Please contact support or try again later. For now, you can still ask about orders, products, shipping, or returns using the quick options below.";
        } else {
          errorMessage = "AI service is temporarily rate-limited. Please try again in a moment.";
        }
      } else if (statusCode === 400) {
        errorMessage = "Invalid request to AI service. Please try rephrasing your question.";
      } else if (statusCode === 500 || statusCode === 502 || statusCode === 503) {
        errorMessage = "AI service is temporarily unavailable. Please try again in a moment.";
      }
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = "Could not connect to AI service. Please check your internet connection.";
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = "Request to AI service timed out. Please try again.";
    } else if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      errorMessage = "AI service authentication failed. Please check API key configuration.";
    } else if (error.message?.includes('quota') || error.message?.includes('exceeded')) {
      statusCode = 429;
      errorMessage = "The AI service quota has been exceeded. Please contact support or try again later. For now, you can still ask about orders, products, shipping, or returns using the quick options below.";
    }
    
    return res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        responseData: error.response?.data,
      } : undefined,
    });
  }
};

export { aiChat, chatHealth };


