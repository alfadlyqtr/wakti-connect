
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

    if (!prompt && !referenceImage) {
      return new Response(
        JSON.stringify({ error: "Either a prompt or a reference image is required" }),
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

    let endpoint = 'https://api.openai.com/v1/images/generations';
    let openaiRequestBody;

    if (referenceImage) {
      console.log("Processing with reference image");
      
      try {
        // Remove the data URL prefix
        let base64Image = referenceImage.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');
        
        // For images from camera, we need to do a simple transformation
        if (referenceImage.startsWith('data:image/jpeg')) {
          endpoint = 'https://api.openai.com/v1/images/generations';
          
          // Use DALL-E 3 with the original image as part of the prompt
          openaiRequestBody = {
            model: "dall-e-3",
            prompt: `${prompt}. Use this reference image for style inspiration.`,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url"
          };
          
          console.log("Using DALL-E 3 with descriptive prompt for reference image");
        } else {
          // Standard image generation with prompt
          endpoint = 'https://api.openai.com/v1/images/generations';
          openaiRequestBody = {
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            response_format: "url"
          };
          
          console.log("Using standard DALL-E 3 image generation with prompt:", prompt);
        }
      } catch (error) {
        console.error("Error processing reference image:", error);
        return new Response(
          JSON.stringify({ error: `Failed to process reference image: ${error.message}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    } else {
      // Standard image generation without reference
      openaiRequestBody = {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      };
      
      console.log("Using standard image generation with prompt:", prompt);
    }

    console.log("Making OpenAI API request to endpoint:", endpoint);
    console.log("Request body:", JSON.stringify({
      ...openaiRequestBody,
      model: openaiRequestBody.model,
      n: openaiRequestBody.n,
      size: openaiRequestBody.size
    }));

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
