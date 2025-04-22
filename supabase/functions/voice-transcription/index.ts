
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
    
    const { fileUrl, language = 'auto' } = await req.json();
    
    if (!fileUrl) {
      console.error('No file URL provided');
      throw new Error('No file URL provided');
    }
    
    console.log(`Processing file from URL: ${fileUrl}`);
    
    // Download the audio file
    const audioResponse = await fetch(fileUrl);
    if (!audioResponse.ok) {
      console.error(`Failed to fetch audio file: ${audioResponse.status}`);
      throw new Error('Failed to fetch audio file');
    }
    
    const audioBlob = await audioResponse.blob();
    console.log(`Audio file size: ${audioBlob.size} bytes`);
    
    if (audioBlob.size === 0) {
      throw new Error('Audio file is empty');
    }

    if (audioBlob.size < 5000) { // Check if audio is too short (less than 5KB)
      throw new Error('Recording is too short. Please record for at least a few seconds.');
    }

    // Try Whisper first
    try {
      console.log("Attempting OpenAI Whisper transcription");
      
      // Create form data for Whisper API
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      
      // Set language based on the meeting settings
      if (language === 'english') {
        formData.append('language', 'en');
      } else if (language === 'arabic') {
        formData.append('language', 'ar');
      } // For mixed, let Whisper auto-detect

      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        },
        body: formData
      });

      if (!whisperResponse.ok) {
        throw new Error(`OpenAI Whisper API error: ${await whisperResponse.text()}`);
      }

      const result = await whisperResponse.json();
      
      if (!result.text || result.text.trim().length === 0) {
        throw new Error('No speech detected in the recording');
      }
      
      console.log("Transcription received from OpenAI Whisper");
      
      return new Response(
        JSON.stringify({ text: result.text, source: 'whisper' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error("Whisper transcription failed:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in voice transcription function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: true,
        message: error.message || "Voice transcription error"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
