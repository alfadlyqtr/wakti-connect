
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  console.log("Voice-to-text function called");
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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
      
      // Basic validation of the API key format
      if (!apiKey.startsWith('sk-') || apiKey.length < 20) {
        console.error("OPENAI_API_KEY appears to be invalid");
        throw new Error('OpenAI API key appears to be invalid. It should start with "sk-"');
      }
      
      // Try a simple API request to test connectivity and permissions
      try {
        console.log("Testing API key with a models request");
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("OpenAI API test failed:", errorData);
          throw new Error(errorData.error?.message || 'API test failed');
        }
        
        // If we get here, the API key works - test a small audio request
        console.log("API key works for models endpoint, testing audio endpoint");
        const audioTestResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'whisper-1',
          }),
        });
        
        // We expect this to fail with a 400 (missing file), but it should indicate the endpoint is accessible
        console.log("Audio endpoint response:", audioTestResponse.status);
        if (audioTestResponse.status !== 400 && audioTestResponse.status !== 200) {
          const audioError = await audioTestResponse.json();
          console.error("OpenAI Audio API test unexpected error:", audioError);
          throw new Error(audioError.error?.message || 'Audio API test failed unexpectedly');
        }
        
        console.log("OpenAI API key validation passed and API connectivity confirmed");
      } catch (error) {
        console.error("OpenAI API test error:", error);
        throw new Error(`API test failed: ${error.message}`);
      }
      
      console.log("OpenAI API key validation passed");
      return new Response(
        JSON.stringify({ success: true, message: "OpenAI API key format is valid and API is accessible" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { audio } = body;
    
    if (!audio) {
      console.error("No audio data provided");
      throw new Error('No audio data provided');
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
    
    console.log("Processing audio data");
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio);
    
    // Prepare form data
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    console.log("Sending request to OpenAI");
    // Send to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${errorText}`);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    console.log("Transcription successful:", result.text?.substring(0, 50) + "...");

    return new Response(
      JSON.stringify({ text: result.text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Voice-to-text error:", error.message);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: "Please check the OpenAI API key in Supabase secrets" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
