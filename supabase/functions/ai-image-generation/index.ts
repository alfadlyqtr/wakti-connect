
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Add CORS headers
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const requestData = await req.json();
    const { prompt, imageUrl } = requestData;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get OpenAI API key from Supabase secrets
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Processing image generation request");
    
    // Set up OpenAI API options
    const apiUrl = 'https://api.openai.com/v1/images/generations';
    let openaiRequestBody;

    if (imageUrl) {
      console.log("Image-based transformation with prompt:", prompt);
      
      // For true image-to-image transformation with DALL-E 3
      // Since we're limited by the DALL-E 3 API capabilities, we need to create a highly
      // descriptive prompt that incorporates elements from both the original image and desired style
      
      // Create a specialized prompt for anime/Gimi style transformation
      const enhancedPrompt = `Transform the following scene into anime/Gimi style: ${prompt}. 
      The anime style should have vibrant colors, clean sharp lines, dramatic lighting, 
      expressive eyes, and stylized features typical of high-quality anime art.
      Maintain the exact same composition, subjects, and scene as the original image, 
      but rendered in perfect anime style artwork.`;
      
      openaiRequestBody = {
        model: "dall-e-3", 
        prompt: enhancedPrompt,
        n: 1,
        size: "1024x1024",
        quality: "hd",        // Using higher quality for better results
        response_format: "url",
        style: "vivid"        // Using vivid style for more artistic results
      };
      
      console.log("Enhanced transformation prompt:", enhancedPrompt);
    } else {
      console.log("Text-based generation with prompt:", prompt);
      
      // Standard image generation with DALL-E 3
      openaiRequestBody = {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      };
    }
    
    console.log("Making OpenAI API request with model:", openaiRequestBody.model);
    
    // Call OpenAI API to generate image
    const openaiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify(openaiRequestBody)
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", errorText);
      
      return new Response(
        JSON.stringify({ error: `OpenAI API error: ${errorText}` }),
        { 
          status: openaiResponse.status, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const data = await openaiResponse.json();
    const generatedImageUrl = data.data[0].url;
    
    console.log("Image generated successfully");

    // Return the image URL and related info
    return new Response(
      JSON.stringify({ 
        id: crypto.randomUUID(),
        imageUrl: generatedImageUrl,
        originalImageUrl: imageUrl || null,
        prompt,
        isTransformation: !!imageUrl
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in image generation:", error);
    
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
