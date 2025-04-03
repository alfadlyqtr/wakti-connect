
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("AI image generation function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const { prompt, model = "dall-e-3" } = await req.json();
    
    if (!prompt) {
      console.error("No prompt provided");
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if OpenAI API key is available
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set");
      throw new Error('OpenAI API key is not configured');
    }

    console.log(`Generating image with prompt: "${prompt}"`);
    
    // Call OpenAI API to generate image
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenAI API error: ${errorData}`);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const result = await response.json();
    console.log("Image generation successful");
    
    // Extract image URL from response
    const imageUrl = result.data[0].url;
    
    // Get user information from JWT token
    const authHeader = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase admin client to store the image data
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: `Bearer ${authHeader}` } } }
    );
    
    // Attempt to extract user ID from JWT
    let userId;
    try {
      const { data: user, error } = await supabaseAdmin.auth.getUser(authHeader);
      if (error) throw error;
      userId = user.user.id;
    } catch (error) {
      console.error("Error getting user from token:", error);
      throw new Error('Failed to authenticate user');
    }
    
    // Store generated image in database
    const { data, error: insertError } = await supabaseAdmin
      .from('ai_generated_images')
      .insert({
        user_id: userId,
        prompt,
        image_url: imageUrl,
        status: 'completed',
        model
      })
      .select()
      .single();
      
    if (insertError) {
      console.error("Error storing image data:", insertError);
      // Continue even if storage fails
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        id: data?.id || null
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Image generation error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "An error occurred during image generation" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
