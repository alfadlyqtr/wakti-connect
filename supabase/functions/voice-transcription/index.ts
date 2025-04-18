
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    console.log("Voice transcription service starting");
    
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    // Get request body
    const requestData = await req.json();
    const { fileUrl, language = 'en' } = requestData;
    
    if (!fileUrl) {
      console.error('No file URL provided');
      throw new Error('No file URL provided');
    }
    
    console.log(`Processing file from URL: ${fileUrl}`);
    
    // Check if we have an ElevenLabs API key - Priority 1
    if (ELEVENLABS_API_KEY) {
      try {
        console.log("Attempting ElevenLabs transcription");
        
        // Call ElevenLabs API with increased timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
        
        // Use the file URL directly
        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio_url: fileUrl,
            model_id: 'whisper-1',
            language: language,
          }),
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`ElevenLabs API error (${response.status}):`, errorText);
          throw new Error(`ElevenLabs API error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        console.log("Transcription received from ElevenLabs:", result.text);

        return new Response(
          JSON.stringify({ 
            text: result.text,
            source: 'elevenlabs',
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error("ElevenLabs transcription failed, falling back to OpenAI:", error);
      }
    } else {
      console.log("No ElevenLabs API key found, falling back to OpenAI");
    }
    
    // Fallback to OpenAI Whisper API - Priority 2
    if (OPENAI_API_KEY) {
      try {
        console.log("Attempting OpenAI Whisper transcription");
        
        // Fetch the file from the URL
        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
          throw new Error(`Failed to fetch audio file: ${fileResponse.status}`);
        }
        
        // Get the file as a blob
        const fileBlob = await fileResponse.blob();
        
        // Create FormData for OpenAI API
        const formData = new FormData();
        formData.append('file', fileBlob, 'audio.webm');
        formData.append('model', 'whisper-1');
        if (language && language !== 'auto') {
          formData.append('language', language);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout
        
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI Whisper API error (${response.status}):`, errorText);
          throw new Error(`OpenAI Whisper API error (${response.status}): ${errorText}`);
        }
        
        const result = await response.json();
        console.log("Transcription received from OpenAI Whisper:", result.text);
        
        return new Response(
          JSON.stringify({ 
            text: result.text,
            source: 'whisper',
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
          }
        );
      } catch (error) {
        console.error("OpenAI Whisper transcription failed:", error);
        throw error; // No more fallbacks, propagate the error
      }
    } else {
      console.log("No OpenAI API key found");
      throw new Error('No transcription services available');
    }
    
  } catch (error) {
    console.error("Error in voice transcription function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: true,
        message: "Voice transcription error. Using browser fallback."
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
