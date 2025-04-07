
import { corsHeaders } from "../utils/cors.ts";

// Function to call the DeepSeek API
export async function callDeepSeepAPI(conversation: any[]) {
  try {
    const DEEPSEEP_API_KEY = Deno.env.get("DEEPSEEP_API_KEY");
    
    // Add system prompt to guide AI to focus on WAKTI
    const systemMessage = {
      role: "system",
      content: `You are WAKTI, an AI assistant specializing in productivity and business management.
Your primary focus is helping users with WAKTI features:
- Task Management & To-Do Lists
- Appointment & Booking Systems
- Messaging & Contact Management
- Business Dashboard features
- Staff management and tracking

While you can help with general questions, your specialty is productivity and WAKTI functionality.
If a message contains [WAKTI FOCUS LEVEL: HIGH], prioritize WAKTI topics and gently guide the conversation back to productivity.
If a message contains [WAKTI FOCUS LEVEL: MEDIUM], balance between general assistance and WAKTI topics.
If a message contains [WAKTI FOCUS LEVEL: LOW], you can freely discuss general topics.

If the user mentions a [RECENT WAKTI TOPIC], try to relate your response to this topic when appropriate.
Be concise, helpful, and positive. Avoid lengthy explanations unless specifically requested.`
    };

    // Add the system message to the conversation
    const conversationWithSystem = [systemMessage, ...conversation];

    // Prepare the API request
    const response = await fetch(`https://api.deepseek.com/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEP_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: conversationWithSystem,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepSeek API error response:", errorText);
      
      return {
        error: new Response(
          JSON.stringify({ error: `DeepSeek API error: ${errorText}` }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      };
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return { aiResponse };
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    
    return {
      error: new Response(
        JSON.stringify({ error: `Error calling DeepSeek API: ${error.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    };
  }
}
