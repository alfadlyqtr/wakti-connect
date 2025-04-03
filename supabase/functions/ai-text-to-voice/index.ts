
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.20.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Text-to-voice function called");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Check if this is a test request
    const body = await req.json();
    
    if (body.test === true) {
      console.log("Running OpenAI API key test");
      
      // Check if OpenAI API key is available
      const apiKey = Deno.env.get('OPENAI_API_KEY');
      if (!apiKey) {
        console.error("OPENAI_API_KEY is not set");
        throw new Error('OpenAI API key is not configured');
      }
      
      // Validate API key format
      if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
        console.error("OPENAI_API_KEY appears to be invalid");
        throw new Error('OpenAI API key appears to be invalid. It should start with "sk-"');
      }
      
      // Test the OpenAI API with a very small request
      try {
        const testResponse = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            input: 'Test',
            voice: 'alloy',
            response_format: 'mp3',
          }),
        });
        
        if (!testResponse.ok) {
          const errorData = await testResponse.json();
          console.error("OpenAI API test failed:", errorData);
          throw new Error(errorData.error?.message || 'API test failed');
        }
        
        console.log("OpenAI API key test successful");
        return new Response(
          JSON.stringify({ success: true, message: "OpenAI API key is valid" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("OpenAI API test error:", error);
        throw new Error(`API test failed: ${error.message}`);
      }
    }
    
    const { text, voice } = body;

    if (!text) {
      console.error("No text provided");
      throw new Error('Text is required');
    }

    // Check if OpenAI API key is available
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set");
      throw new Error('OpenAI API key is not configured');
    }
    
    // Validate API key format
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      console.error("OPENAI_API_KEY format validation failed");
      throw new Error('OpenAI API key appears to be invalid');
    }

    console.log(`Generating speech for text: "${text.substring(0, 50)}..."${text.length > 50 ? '...' : ''}`);
    console.log(`Using voice: ${voice || 'alloy'}`);
    
    // Generate speech from text
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice || 'alloy',
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(errorData.error?.message || 'Failed to generate speech');
    }

    // Convert audio buffer to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    console.log("Speech generation successful, returning audio data");
    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error("Text-to-voice error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Please check the OpenAI API key in Supabase secrets" 
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
