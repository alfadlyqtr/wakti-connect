
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

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
        return new Response(
          JSON.stringify({ 
            error: 'OpenAI API key is not configured',
            details: "Please add the OPENAI_API_KEY secret in Supabase Edge Function settings" 
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Validate API key format
      if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
        console.error("OPENAI_API_KEY appears to be invalid");
        return new Response(
          JSON.stringify({ 
            error: 'OpenAI API key appears to be invalid. It should start with "sk-"',
            details: "Please check the format of your OpenAI API key"
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      // Test the OpenAI API with a very small request
      try {
        console.log("Testing OpenAI API connectivity");
        const testResponse = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!testResponse.ok) {
          const errorData = await testResponse.json();
          console.error("OpenAI API test failed:", errorData);
          return new Response(
            JSON.stringify({ 
              error: errorData.error?.message || 'API test failed',
              details: "The API key may be invalid or have restricted permissions"
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        
        console.log("OpenAI API key test successful");
        return new Response(
          JSON.stringify({ success: true, message: "OpenAI API key is valid" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("OpenAI API test error:", error);
        return new Response(
          JSON.stringify({ 
            error: `API test failed: ${error.message}`,
            details: "There was a network or connectivity issue"
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }
    
    const { text, voice } = body;

    if (!text) {
      console.error("No text provided");
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check if OpenAI API key is available
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error("OPENAI_API_KEY is not set");
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured',
          details: "Please add the OPENAI_API_KEY secret in Supabase Edge Function settings"
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Validate API key format
    if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
      console.error("OPENAI_API_KEY format validation failed");
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key appears to be invalid',
          details: "Please check the format of your OpenAI API key"
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate the voice parameter - make sure it's one of the allowed values
    const allowedVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    const selectedVoice = voice && allowedVoices.includes(voice) ? voice : 'alloy';
    
    // Limit text length to prevent memory issues
    const maxTextLength = 4000;
    const truncatedText = text.length > maxTextLength ? text.substring(0, maxTextLength) : text;
    
    console.log(`Generating speech for text (${truncatedText.length} chars), using voice: ${selectedVoice}`);
    
    // Generate speech from text
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: truncatedText,
        voice: selectedVoice,
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: errorData.error?.message || 'Failed to generate speech',
          details: "The OpenAI API returned an error"
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Process audio in safe chunks to avoid memory issues
    console.log("Processing audio response");
    const arrayBuffer = await response.arrayBuffer();
    
    // Use a more efficient way to convert the binary data to base64
    // that avoids recursive calls and stack overflows
    const uint8Array = new Uint8Array(arrayBuffer);
    const chunks = [];
    const chunkSize = 32768;
    
    // Process in chunks to avoid call stack issues
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      chunks.push(String.fromCharCode.apply(null, chunk));
    }
    
    const binaryString = chunks.join('');
    const base64Audio = btoa(binaryString);

    console.log("Speech generation successful, returning audio data");
    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Text-to-voice error:", error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "An unexpected error occurred in the text-to-voice function" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
