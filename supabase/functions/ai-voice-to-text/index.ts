
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
      
      // Basic validation of the API key format
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
      
      // Try a simple API request to test connectivity and permissions
      try {
        console.log("Testing OpenAI API connectivity");
        const response = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
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
    
    const { audio } = body;
    
    if (!audio) {
      console.error("No audio data provided");
      return new Response(
        JSON.stringify({ error: 'No audio data provided' }),
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
    
    console.log("Processing audio data");
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio);
    
    // Prepare form data
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/mp3' }); // Changed to mp3 format
    formData.append('file', blob, 'audio.mp3'); // Changed to mp3 format
    formData.append('model', 'whisper-1');
    
    console.log("Audio blob size:", blob.size, "bytes");
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
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${errorText}`,
          details: "The API returned an error response"
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
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
