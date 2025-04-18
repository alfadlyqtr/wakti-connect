
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    console.log("AI Meeting Summary function called");
    
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
    const ELEVENLABS_API_KEY = Deno.env.get('ELEVENLABS_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    // Get request body
    const { text, duration, audioData, language } = await req.json();
    
    if (!text) {
      console.error('No transcription text provided');
      throw new Error('No transcription text provided');
    }

    console.log(`Generating summary for meeting transcript (${text.length} chars, ${duration}s)`);
    console.log(`Language: ${language || 'en'}`);
    
    // Use DeepSeek for the primary analysis
    let summary = '';
    let location = null;
    let attendees = null;
    let actionItems = null;
    
    if (DEEPSEEK_API_KEY) {
      try {
        console.log("Using DeepSeek API for meeting summary");
        const prompt = `
You are an expert meeting assistant. Analyze this meeting transcript and provide:
1. A concise executive summary (5-7 sentences)
2. Key discussion points (bulleted list)
3. Action items with assignees if mentioned (bulleted list)
4. List of attendees mentioned in the conversation
5. Any dates, deadlines, or follow-up meetings mentioned
6. Location information if mentioned

Meeting Duration: ${duration ? Math.floor(duration / 60) + ' minutes ' + duration % 60 + ' seconds' : 'Unknown'}
Transcript:
${text}
`;

        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: "You are an AI assistant that specializes in summarizing meetings."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 2000
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`DeepSeek API error (${response.status}):`, errorText);
          throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        console.log("DeepSeek summary generated successfully");
        
        // Extract location information with regex
        const locationRegex = /location:[\s\n]*(.*?)(?:\n\n|\n(?=[A-Z])|\n?$)/i;
        const locationMatch = result.choices[0].message.content.match(locationRegex);
        if (locationMatch && locationMatch[1]) {
          location = locationMatch[1].trim();
        }
        
        // Extract attendees
        const attendeesRegex = /attendees:[\s\n]*((?:.*\n?)*?)(?:\n\n|\n(?=[A-Z])|\n?$)/i;
        const attendeesMatch = result.choices[0].message.content.match(attendeesRegex);
        if (attendeesMatch && attendeesMatch[1]) {
          attendees = attendeesMatch[1].trim();
        }
        
        // Extract action items
        const actionItemsRegex = /action items:[\s\n]*((?:.*\n?)*?)(?:\n\n|\n(?=[A-Z])|\n?$)/i;
        const actionItemsMatch = result.choices[0].message.content.match(actionItemsRegex);
        if (actionItemsMatch && actionItemsMatch[1]) {
          actionItems = actionItemsMatch[1].trim();
        }
        
        summary = result.choices[0].message.content;
      } catch (error) {
        console.error("DeepSeek summary error:", error);
        throw error;
      }
    } else if (OPENAI_API_KEY) {
      // Fallback to OpenAI if DeepSeek API key is not available
      try {
        console.log("Falling back to OpenAI for meeting summary");
        const prompt = `
Analyze this meeting transcript and provide:
1. A concise executive summary (5-7 sentences)
2. Key discussion points (bulleted list)
3. Action items with assignees if mentioned (bulleted list)
4. List of attendees mentioned in the conversation
5. Any dates, deadlines, or follow-up meetings mentioned
6. Location information if mentioned

Meeting Duration: ${duration ? Math.floor(duration / 60) + ' minutes ' + duration % 60 + ' seconds' : 'Unknown'}
Transcript:
${text}
`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an AI assistant that specializes in summarizing meetings."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.3,
            max_tokens: 2000
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error (${response.status}):`, errorText);
          throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        console.log("OpenAI summary generated successfully");
        
        // Extract location information with regex
        const locationRegex = /location:[\s\n]*(.*?)(?:\n\n|\n(?=[A-Z])|\n?$)/i;
        const locationMatch = result.choices[0].message.content.match(locationRegex);
        if (locationMatch && locationMatch[1]) {
          location = locationMatch[1].trim();
        }
        
        // Extract attendees
        const attendeesRegex = /attendees:[\s\n]*((?:.*\n?)*?)(?:\n\n|\n(?=[A-Z])|\n?$)/i;
        const attendeesMatch = result.choices[0].message.content.match(attendeesRegex);
        if (attendeesMatch && attendeesMatch[1]) {
          attendees = attendeesMatch[1].trim();
        }
        
        // Extract action items
        const actionItemsRegex = /action items:[\s\n]*((?:.*\n?)*?)(?:\n\n|\n(?=[A-Z])|\n?$)/i;
        const actionItemsMatch = result.choices[0].message.content.match(actionItemsRegex);
        if (actionItemsMatch && actionItemsMatch[1]) {
          actionItems = actionItemsMatch[1].trim();
        }
        
        summary = result.choices[0].message.content;
      } catch (error) {
        console.error("OpenAI summary error:", error);
        throw error;
      }
    } else {
      throw new Error("No AI API keys available for generating meeting summary");
    }

    return new Response(
      JSON.stringify({ 
        summary,
        location,
        attendees,
        actionItems,
        audioData
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in meeting summary function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
