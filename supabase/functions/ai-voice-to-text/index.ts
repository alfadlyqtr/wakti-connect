
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Voice-to-text request received");
    
    // Check content type and determine how to process the request
    const contentType = req.headers.get('content-type') || '';
    console.log("Content-Type:", contentType);
    
    let audioData;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart form data
      try {
        console.log("Processing as multipart/form-data");
        const formData = await req.formData();
        const audioFile = formData.get('audio');
        
        if (!audioFile || !(audioFile instanceof File)) {
          console.error("No audio file in form data");
          throw new Error('No audio file provided in form data');
        }
        
        console.log(`Received audio file: ${audioFile.name}, size: ${audioFile.size} bytes, type: ${audioFile.type}`);
        audioData = await audioFile.arrayBuffer();
      } catch (e) {
        console.error("Error processing form data:", e);
        throw new Error('Failed to process form data: ' + e.message);
      }
    } else {
      // Handle base64 encoded data in JSON
      try {
        console.log("Processing as JSON with base64 data");
        const requestData = await req.json();
        console.log("JSON payload received, parsing...");
        
        if (requestData && typeof requestData === 'object') {
          const { audio } = requestData;
          
          if (!audio) {
            console.error("No audio data in JSON");
            throw new Error('No audio data provided in JSON');
          }
          
          console.log(`Received base64 audio data of length: ${audio.length}`);
          // Convert base64 to binary
          const binaryString = atob(audio);
          const bytes = new Uint8Array(binaryString.length);
          
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          
          audioData = bytes.buffer;
        } else {
          throw new Error('Invalid JSON format');
        }
      } catch (e) {
        console.error("Error processing JSON request:", e);
        throw new Error('Failed to process JSON request: ' + e.message);
      }
    }
    
    if (!audioData || audioData.byteLength === 0) {
      console.error("Empty audio data");
      throw new Error('Empty audio data received');
    }
    
    console.log(`Processing ${audioData.byteLength} bytes of audio data`);
    
    // Check for OpenAI API key
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key not found");
      throw new Error('OpenAI API key not configured');
    }
    
    // Prepare form data for OpenAI API
    const openAIFormData = new FormData();
    const blob = new Blob([audioData], { type: 'audio/webm' }); // Assume webm format
    openAIFormData.append('file', blob, 'audio.webm');
    openAIFormData.append('model', 'whisper-1');

    console.log("Sending to OpenAI API...");
    
    // Send to OpenAI
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: openAIFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error (${response.status}):`, errorText);
      throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log("Transcription received:", result.text);

    return new Response(
      JSON.stringify({ text: result.text }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in voice-to-text function:", error);
    
    // Return a more detailed error response
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
