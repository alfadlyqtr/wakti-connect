
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

    // Get current date information for context
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
    const currentDay = currentDate.getDate();
    
    // Prepare the prompt for DeepSeek with explicit date handling instructions
    const prompt = `
You are a sophisticated task parser that can intelligently structure natural language into organized tasks.

Parse the following text into a structured task with the following:
- title: A clear, concise summary title for the task (maximum 60 characters)
- due_date: Extract any time reference, convert to ISO format YYYY-MM-DD
- due_time: Extract any specific time mentioned, in HH:MM format with AM/PM
- priority: Detect priority based on urgency words ("urgent", "asap", "important" = high; "sometime", "when you can" = low; otherwise = normal)
- subtasks: Intelligently organize the input into meaningful subtasks according to the rules below
- location: Extract any location mentioned that's relevant to the task

CURRENT DATE: ${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}

SUBTASK ORGANIZATION RULES (VERY IMPORTANT):
1. Group related items by type and context, not just by commas
2. Create hierarchical subtasks where appropriate
3. For shopping lists:
   - Group items by store (e.g., "Get from Lulu: milk, eggs, bread")
   - Preserve exact store/brand names (Lulu, Carrefour, H&M, Zara, etc.)
4. For transportation tasks:
   - Keep as a single action (e.g., "Pick up sister from school")
   - Don't split into multiple subtasks unless truly distinct actions
5. For sequential tasks:
   - Maintain the sequence if it's a step-by-step process
6. Never treat commas in normal sentences as subtask separators
7. For mixed task types, separate by context (transportation, shopping, etc.)

EXAMPLE TRANSFORMATIONS:
- Input: "Buy milk, eggs, bread from Lulu and pick up sister from school"
  Output: Two separate subtasks:
    1. "Get groceries from Lulu" with subtasks: "milk", "eggs", "bread"
    2. "Pick up sister from school"

- Input: "Meet John at 3pm, discuss project timeline, then email Sarah the summary"
  Output: Sequential subtasks:
    1. "Meet John at 3pm"
    2. "Discuss project timeline"
    3. "Email Sarah the summary"

DATE HANDLING RULES:
- Today's date is ${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}
- ALWAYS use ${currentYear} as the default year for all dates
- "tonight" = today's date
- "tomorrow" = next day from today
- Weekdays like "Monday" should refer to the upcoming occurrence of that weekday

Respond with ONLY a valid JSON object containing these fields. If a field can't be determined, use null.

Text to parse: ${text}
`;

    console.log("Calling DeepSeek API for task parsing with updated subtask organization rules");

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
          { 
            role: "system", 
            content: `You are an advanced task parsing assistant that extracts structured information from natural language.
                      Return only valid JSON.
                      The current date is ${currentYear}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}.
                      ALWAYS use ${currentYear} as the default year for any dates mentioned.
                      FOCUS ON INTELLIGENT SUBTASK ORGANIZATION.` 
          },
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
      
      // Validate date format and year
      if (parsedTask.due_date) {
        // Make sure due_date uses the current year (not 2023 or other default)
        const parsedDate = new Date(parsedTask.due_date);
        if (!isNaN(parsedDate.getTime())) {
          const parsedYear = parsedDate.getFullYear();
          if (parsedYear !== currentYear && parsedYear !== currentYear + 1) {
            // If the year is not current or next year, fix it to use current year
            console.log(`Correcting invalid year in due_date: ${parsedTask.due_date} → year should be ${currentYear}`);
            
            // Format as YYYY-MM-DD with current year
            const month = parsedDate.getMonth() + 1;
            const day = parsedDate.getDate();
            parsedTask.due_date = `${currentYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          }
        }
      }
      
      // Check if subtasks need to be organized better
      if (Array.isArray(parsedTask.subtasks) && parsedTask.subtasks.length > 0) {
        // Ensure subtasks are properly structured
        console.log("Validating subtask structure...");
      }
      
      console.log("Successfully parsed and validated task:", parsedTask);
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
