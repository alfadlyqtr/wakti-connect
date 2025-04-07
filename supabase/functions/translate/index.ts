
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Default configuration for DeepSeek call
const DEFAULT_SYSTEM_PROMPT = `
You are a professional translator. Your task is to translate the given text accurately while 
preserving the meaning, tone, and style of the original text. Do not add any explanations
or additional content. Just return the translated text.

Additional notes for specific content types:
- For UI elements: Use natural, concise language appropriate for user interfaces
- For error messages: Keep them clear and informative
- For longer content: Maintain paragraph structure and formatting
`;

// Function to call DeepSeek API for translation
async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  try {
    const DEEPSEEP_API_KEY = Deno.env.get("DEEPSEEP_API_KEY");
    
    if (!DEEPSEEP_API_KEY) {
      throw new Error("DeepSeek API key not configured");
    }
    
    // Create system prompt with language direction
    const systemMessage = {
      role: "system",
      content: `${DEFAULT_SYSTEM_PROMPT}\nTranslate from ${sourceLang} to ${targetLang}.`
    };
    
    // User message with text to translate
    const userMessage = {
      role: "user", 
      content: `Translate this: "${text}"`
    };
    
    // Prepare conversation for API
    const conversation = [systemMessage, userMessage];
    
    // Call DeepSeek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEP_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: conversation,
        temperature: 0.2, // Lower temperature for more precise translations
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error response:", errorText);
      throw new Error(`DeepSeek API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    let translation = data.choices[0].message.content.trim();
    
    // Remove quotes if DeepSeek returns the translation in quotes
    if (translation.startsWith('"') && translation.endsWith('"')) {
      translation = translation.slice(1, -1);
    }

    return translation;
  } catch (error) {
    console.error("Error in translation:", error);
    throw error;
  }
}

// Create batch translation function to handle multiple keys at once
async function translateBatch(
  items: Record<string, string>,
  sourceLang: string,
  targetLang: string
): Promise<Record<string, string>> {
  try {
    // Format items into a numbered list
    let batchText = Object.entries(items)
      .map(([key, text], index) => `${index + 1}. ${key}: ${text}`)
      .join("\n");
    
    const systemMessage = {
      role: "system",
      content: `${DEFAULT_SYSTEM_PROMPT}\n
      Translate from ${sourceLang} to ${targetLang}.
      You will receive a numbered list of items in the format "number. key: text".
      Please translate only the text part (after the colon) and keep the same numbered list format.
      Keep the keys unchanged.`
    };
    
    const userMessage = {
      role: "user", 
      content: `Translate these items:\n${batchText}`
    };
    
    const DEEPSEEP_API_KEY = Deno.env.get("DEEPSEEP_API_KEY");
    
    if (!DEEPSEEP_API_KEY) {
      throw new Error("DeepSeek API key not configured");
    }
    
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEP_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [systemMessage, userMessage],
        temperature: 0.2,
        max_tokens: 4000
      })
    });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }
    
    const data = await response.json();
    const translatedText = data.choices[0].message.content;
    
    // Parse the translated response back into a dictionary
    const results: Record<string, string> = {};
    
    // Parse the response line by line to match with original keys
    const lines = translatedText.split('\n').filter(line => line.trim().length > 0);
    const keys = Object.keys(items);
    
    lines.forEach((line) => {
      // Extract the number and text
      const match = line.match(/^\d+\.\s+([^:]+):\s+(.+)$/);
      if (match) {
        const key = match[1].trim();
        const translation = match[2].trim();
        
        // Find matching key from originals 
        // (in case line numbers don't match up or format is different)
        const matchingKey = keys.find(k => k === key);
        
        if (matchingKey) {
          results[matchingKey] = translation;
        }
      }
    });
    
    // For any keys that weren't found, add with original text
    keys.forEach(key => {
      if (!results[key]) {
        results[key] = items[key];  // Fallback to original
      }
    });
    
    return results;
  } catch (error) {
    console.error("Error in batch translation:", error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { text, keys, sourceLang, targetLang } = await req.json();
    
    // Check required params
    if ((!text && !keys) || !sourceLang || !targetLang) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle single text translation
    if (text) {
      const translation = await translateText(text, sourceLang, targetLang);
      
      return new Response(
        JSON.stringify({ translation }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Handle batch translation (multiple keys)
    if (keys && typeof keys === 'object') {
      const translations = await translateBatch(keys, sourceLang, targetLang);
      
      return new Response(
        JSON.stringify({ translations }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If we get here, something went wrong with the parameters
    return new Response(
      JSON.stringify({ error: "Invalid request format" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in translation function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Translation service error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
