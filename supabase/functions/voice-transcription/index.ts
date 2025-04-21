
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
    
    // Get the form data with the audio file
    const formData = await req.formData();
    const audioFile = formData.get('file');
    
    if (!audioFile || !(audioFile instanceof File)) {
      console.error('No audio file provided in form data');
      throw new Error('No audio file provided');
    }
    
    console.log(`Processing audio file: ${audioFile.name}, size: ${audioFile.size} bytes`);
    
    if (audioFile.size === 0) {
      throw new Error('Audio file is empty');
    }

    // Try Whisper first
    try {
      console.log("Attempting OpenAI Whisper transcription");
      
      // Create form data for Whisper API
      const whisperFormData = new FormData();
      whisperFormData.append('file', audioFile);
      whisperFormData.append('model', 'whisper-1');

      const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        },
        body: whisperFormData
      });

      if (!whisperResponse.ok) {
        const errorText = await whisperResponse.text();
        console.error(`OpenAI Whisper API error: ${errorText}`);
        throw new Error(`OpenAI Whisper API error: ${errorText}`);
      }

      const result = await whisperResponse.json();
      console.log("Transcription received from OpenAI Whisper");
      
      return new Response(
        JSON.stringify({ text: result.text, source: 'whisper' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (whisperError) {
      console.error("Whisper transcription failed:", whisperError);
      console.log("Falling back to DeepSeek...");

      // Try DeepSeek as fallback
      try {
        const deepseekFormData = new FormData();
        deepseekFormData.append('file', audioFile);
        
        const deepseekResponse = await fetch('https://api.deepseek.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
          },
          body: deepseekFormData
        });

        if (!deepseekResponse.ok) {
          const errorText = await deepseekResponse.text();
          console.error(`DeepSeek API error: ${errorText}`);
          throw new Error(`DeepSeek API error: ${errorText}`);
        }

        const deepseekResult = await deepseekResponse.json();
        console.log("Transcription received from DeepSeek");

        return new Response(
          JSON.stringify({ text: deepseekResult.text, source: 'deepseek' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      } catch (deepseekError) {
        console.error("DeepSeek transcription also failed:", deepseekError);
        throw new Error("All transcription services failed");
      }
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
