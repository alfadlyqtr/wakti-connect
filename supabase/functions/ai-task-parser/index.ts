
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    // Get API keys
    const DEEPSEEP_API_KEY = Deno.env.get("DEEPSEEP_API_KEY");
    
    if (!DEEPSEEP_API_KEY) {
      throw new Error("DeepSeek API key not configured");
    }

    // Parse request
    const { text } = await req.json();
    
    if (!text || typeof text !== 'string') {
      throw new Error("Missing or invalid text input");
    }
    
    console.log("Received task text for parsing:", text);

    // Prepare the prompt for DeepSeek
    const prompt = `
Parse the following text into a structured task with the following format:
- title: A clear, concise title for the task (maximum 80 characters)
- due_date: Extract any time reference like "tonight", "tomorrow at 3pm", etc. Convert to ISO format.
- due_time: Extract any specific time mentioned, in HH:MM format with AM/PM
- priority: Detect priority based on urgency words ("urgent", "asap", "important" = high; "sometime", "when you can" = low; otherwise = normal)
- subtasks: Break down any list of items, locations to visit, or sequential actions into separate subtasks
- location: Extract any location mentioned that's relevant to the task

Respond with ONLY a valid JSON object containing these fields. Make intelligent decisions about structuring the task properly. If a field can't be determined, use null.

Text to parse: ${text}
`;

    console.log("Calling DeepSeek API for task parsing");

    // Call DeepSeek API
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEP_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a task parsing assistant that extracts structured information from natural language. Return only valid JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2, // Low temperature for more consistent, precise results
        response_format: { type: "json_object" } // Ensure response is formatted as JSON
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error:", errorText);
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    // Parse DeepSeek response
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log("Raw DeepSeek response:", aiResponse);
    
    // Parse the JSON from the response text
    let parsedTask;
    try {
      parsedTask = JSON.parse(aiResponse);
      
      // Validate the parsed task has the required fields
      if (!parsedTask.title) {
        throw new Error("Parsing failed: No title extracted");
      }
      
      console.log("Successfully parsed task:", parsedTask);
    } catch (parseError) {
      console.error("Error parsing DeepSeek response as JSON:", parseError);
      throw new Error("Failed to parse task information from AI response");
    }

    // Return the parsed task
    return new Response(
      JSON.stringify(parsedTask),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in AI task parser:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to parse task", 
        timestamp: new Date().toISOString() 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
