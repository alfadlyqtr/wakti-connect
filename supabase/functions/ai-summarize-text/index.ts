
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.20.1";

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
    const { text, language = 'en' } = await req.json();
    
    if (!text || text.trim().length === 0) {
      throw new Error('No text provided for summarization');
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    // System prompt for the AI
    const systemPrompt = `
      You are an AI specialized in summarizing meetings. 
      Your task is to summarize the provided meeting transcript in a clear, concise way.
      
      Extract the following information:
      1. Key points and decisions
      2. Action items with responsible parties if mentioned
      3. Any deadlines or follow-up dates
      4. Important questions raised during the meeting
      5. The location where the meeting took place (if mentioned)
      6. The names of attendees (if mentioned)
      
      Format the summary in clean, readable paragraphs. Do not add any introductory text like "Meeting Summary" or similar.
      The summary should be in ${language === 'en' ? 'English' : language} language.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text }
      ],
      temperature: 0.5,
      max_tokens: 1000,
    });

    // Extract location and attendees using a follow-up request
    const metadataResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "Extract only the location and attendees from the meeting transcript. Return in JSON format with keys 'location' (string or null) and 'attendees' (array of strings or null)." 
        },
        { role: "user", content: text }
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    let locationData = { location: null, attendees: null };
    try {
      locationData = JSON.parse(metadataResponse.choices[0].message.content || "{}");
    } catch (parseError) {
      console.error("Error parsing metadata:", parseError);
    }

    return new Response(
      JSON.stringify({
        summary: response.choices[0].message.content,
        location: locationData.location,
        attendees: locationData.attendees
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in ai-summarize-text:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred during summarization"
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
