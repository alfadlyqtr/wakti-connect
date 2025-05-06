
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.32.0";
import type { Database } from "../_shared/types.ts";

// Define section types
const SECTION_TYPES = [
  "header",
  "about",
  "gallery",
  "testimonials",
  "contact",
  "hours",
  "booking",
  "instagram",
  "chatbot"
];

// Add CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

interface RequestBody {
  prompt: string;
  pageId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request
    const requestData = await req.text();
    let requestBody: RequestBody;
    
    try {
      requestBody = JSON.parse(requestData) as RequestBody;
    } catch (error) {
      console.error("Error parsing request JSON:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const { prompt, pageId } = requestBody;
    
    if (!prompt || !pageId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: prompt and pageId are required" }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 400 
        }
      );
    }
    
    console.log("Processing request with prompt:", prompt, "for pageId:", pageId);

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    // Get the current page data to reference in the AI prompt
    const { data: pageData, error: pageError } = await supabase
      .from("business_pages")
      .select("*")
      .eq("id", pageId)
      .single();

    if (pageError) {
      console.error("Error fetching page:", pageError);
      return new Response(
        JSON.stringify({ error: "Could not find business page" }),
        { 
          status: 404, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get DeepSeek API key
    const deepseekApiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!deepseekApiKey) {
      console.error("DeepSeek API key is not configured");
      return new Response(
        JSON.stringify({ error: "AI service is not properly configured. Please contact support." }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Construct a prompt for DeepSeek
    const systemPrompt = `
      You are an expert web page designer and developer who builds business landing pages.
      Your task is to create sections for a business landing page based on the user's prompt.
      
      For each section, determine the appropriate section type and content. The available section types are:
      ${SECTION_TYPES.join(", ")}
      
      For each section, generate a detailed JSON structure with the content appropriate for that section type.
      
      IMPORTANT RULES:
      1. Always include a header section with the business name and tagline.
      2. Structure content for each section based on its type.
      3. For 'contact' sections, include fields for name, email, phone, and message.
      4. For 'booking' sections, reference existing booking templates if provided.
      5. For 'instagram' sections, create placeholder image URLs that would be replaced later.
      6. For 'chatbot' sections, create a section that can integrate a chatbot.
      7. For social links, include placeholders that would be populated by the user's actual accounts.
      
      Return ONLY a valid JSON array of section objects with these properties:
      - section_type: one of the allowed section types
      - section_content: an object with appropriate fields for that section type
      
      Do NOT include any explanatory text or markdown, ONLY the JSON array.
    `;

    // Call DeepSeek API
    console.log("Calling DeepSeek API...");
    try {
      const apiResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deepseekApiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `Create a business landing page with the following details:
              Business name: ${pageData.page_title || "My Business"}
              Primary color: ${pageData.primary_color || "#3B82F6"}
              Secondary color: ${pageData.secondary_color || "#60A5FA"}
              
              User prompt: ${prompt}
              
              Please generate appropriate sections for this business.`
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.text();
        console.error("DeepSeek API error:", apiResponse.status, errorData);
        return new Response(
          JSON.stringify({ 
            error: "Failed to generate content with AI", 
            details: `API error: ${apiResponse.status}` 
          }),
          { 
            status: 502, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      const aiResult = await apiResponse.json();
      const aiContent = aiResult.choices[0].message.content;
      
      // Parse the JSON content from the AI
      try {
        console.log("Processing AI response");
        // Extract JSON if it's wrapped in code blocks or other text
        const jsonMatch = aiContent.match(/\[\s*\{.*\}\s*\]/s);
        const jsonContent = jsonMatch ? jsonMatch[0] : aiContent;
        const sectionsData = JSON.parse(jsonContent);
        
        // Validate the structure
        if (!Array.isArray(sectionsData)) {
          throw new Error("AI did not return an array of sections");
        }
        
        console.log("Successfully parsed AI response into sections");
        
        // Transform to our BusinessPageSection format
        const sections = sectionsData.map((section, index) => ({
          id: `temp-${index}`,  // Temporary IDs that will be replaced when saved
          page_id: pageId,
          section_type: section.section_type,
          section_order: index,
          section_content: section.section_content,
          is_visible: true
        }));

        return new Response(
          JSON.stringify({ 
            sections,
            message: "Content generated successfully" 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Error parsing AI response:", error);
        console.error("AI raw response:", aiContent);
        return new Response(
          JSON.stringify({ 
            error: "Failed to parse AI-generated content", 
            details: error.message 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    } catch (apiError) {
      console.error("Error calling DeepSeek API:", apiError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to communicate with AI service", 
          details: apiError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error) {
    console.error("Error in generate-page-content function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }, 
        status: 500 
      }
    );
  }
});
