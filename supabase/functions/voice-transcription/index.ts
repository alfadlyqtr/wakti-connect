
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
    const { audio, language = 'en' } = requestData;
    
    if (!audio) {
      console.error('No audio data provided');
      throw new Error('No audio data provided');
    }

    console.log("Audio data received, length:", audio.length);
    console.log("Language setting:", language);
    
    // Map language codes to proper format
    const languageMap: Record<string, string> = {
      'en': 'en-US',
      'ar': 'ar',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
    };
    
    const languageCode = languageMap[language] || 'en-US';
    
    // Check if we have an OpenAI API key - Primary transcription service
    if (OPENAI_API_KEY) {
      try {
        console.log(`Attempting OpenAI transcription with language: ${languageCode}`);
        
        // Process the base64 audio
        const binaryAudio = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
        const blob = new Blob([binaryAudio], { type: 'audio/webm' });
        
        // Create FormData for OpenAI API
        const formData = new FormData();
        formData.append('file', blob, 'audio.webm');
        formData.append('model', 'whisper-1');
        formData.append('language', languageCode.split('-')[0]);
        
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: formData,
        });
        
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
        // Fall through to ElevenLabs fallback
      }
    } else {
      console.log("No OpenAI API key found, falling back to ElevenLabs");
    }
    
    // Fallback to ElevenLabs if OpenAI fails
    if (ELEVENLABS_API_KEY) {
      try {
        console.log("Attempting ElevenLabs transcription");
        
        // Call ElevenLabs API
        const response = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audio: audio,
            model_id: 'whisper-1',
          }),
        });
        
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
        console.error("ElevenLabs transcription failed:", error);
        // Fall through to browser fallback message
      }
    }
    
    // If we got here, both OpenAI and ElevenLabs fallbacks failed
    console.warn("Browser fallback activated - both OpenAI and ElevenLabs transcription failed");
    
    return new Response(
      JSON.stringify({ 
        text: null,
        source: 'none',
        fallback: true,
        message: "API transcription services unavailable. Using browser fallback."
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200  // Still return 200 to handle gracefully
      }
    );

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
