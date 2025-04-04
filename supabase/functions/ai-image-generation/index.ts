
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const { prompt, referenceImage } = requestData;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    let openaiRequestBody;
    let endpoint = 'https://api.openai.com/v1/images/generations';
    
    if (referenceImage) {
      console.log("Using reference image for style transfer with prompt:", prompt);
      
      // Convert base64 data URL to raw base64 string
      const base64Image = referenceImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
      
      // For reference image, we use the image variations API with the image edited based on prompt
      endpoint = 'https://api.openai.com/v1/images/variations';
      
      openaiRequestBody = {
        image: base64Image,
        n: 1,
        size: "1024x1024",
        response_format: "url"
      };
      
      console.log("Using image variations API with reference image");
    } else {
      // Standard image generation without reference
      openaiRequestBody = {
        prompt: prompt,
        model: "dall-e-3",
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      };
      
      console.log("Using standard image generation with prompt:", prompt);
    }

    // Call OpenAI API to generate image
    const openaiResponse = await fetch(endpoint, {
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
    const imageUrl = data.data[0].url;
    
    console.log("Image generated successfully");

    return new Response(
      JSON.stringify({ 
        id: crypto.randomUUID(),
        imageUrl,
        prompt
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
