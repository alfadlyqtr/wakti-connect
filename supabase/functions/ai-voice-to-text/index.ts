
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ 
          error: "OpenAI API key is not configured",
          errorDetails: "The OPENAI_API_KEY is missing from Supabase secrets"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Parse request body
    const requestData = await req.json();
    
    // Check if this is a test request
    if (requestData.test === true) {
      console.log("Running OpenAI API key test");
      try {
        // Test the API key by checking available models
        const testResponse = await fetch("https://api.openai.com/v1/models", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${openAIApiKey}`
          }
        });
        
        if (!testResponse.ok) {
          const errorData = await testResponse.json();
          console.error("OpenAI API test error:", errorData);
          return new Response(
            JSON.stringify({ 
              error: "Invalid OpenAI API key", 
              errorDetails: errorData.error?.message || "The API key test failed"
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
          );
        }
        
        console.log("API key works for models endpoint, testing audio endpoint");
        
        // Test TTS endpoint with minimal content to verify API key works for audio
        try {
          const audioTestResponse = await fetch("https://api.openai.com/v1/audio/speech", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${openAIApiKey}`
            },
            body: JSON.stringify({
              model: "tts-1",
              input: "Hello",
              voice: "alloy"
            })
          });
          
          console.log("Audio endpoint response:", audioTestResponse.status);
          
          if (!audioTestResponse.ok) {
            const audioErrorData = await audioTestResponse.json();
            console.error("OpenAI Audio API test unexpected error:", audioErrorData);
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: "API key valid but audio functionality unavailable",
                errorDetails: audioErrorData.error?.message
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          console.log("OpenAI API key validation passed and API connectivity confirmed");
          return new Response(
            JSON.stringify({ success: true, validConnection: true }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (audioError) {
          console.error("OpenAI Audio API test error:", audioError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              error: "API key valid but audio test failed",
              errorDetails: audioError.message
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (error) {
        console.error("OpenAI API test error:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Failed to validate API key",
            errorDetails: error.message
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Normal text-to-speech request
    const { text, voice = "alloy", model = "tts-1", responseFormat = "mp3" } = requestData;
    
    if (!text) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Call OpenAI TTS API
    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        response_format: responseFormat
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI TTS API error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate speech", 
          errorDetails: errorData.error?.message || "Unknown error from OpenAI TTS API"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: response.status }
      );
    }

    // Get the audio data as ArrayBuffer
    const audioArrayBuffer = await response.arrayBuffer();
    
    // Convert to base64
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioArrayBuffer))
    );

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in voice-to-text function:", error);
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred", 
        errorDetails: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
