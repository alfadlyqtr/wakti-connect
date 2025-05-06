
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

interface RequestBody {
  prompt: string;
  pageId: string;
}

serve(async (req) => {
  try {
    // Parse request
    const { prompt, pageId } = await req.json() as RequestBody;
    
    if (!prompt || !pageId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Create a Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient<Database>(supabaseUrl, supabaseKey);

    // Get the current page data to reference in the AI prompt
    const { data: pageData, error: pageError } = await supabase
      .from("business_pages")
      .select("*")
      .eq("id", pageId)
      .single();

    if (pageError) {
      console.error("Error fetching page:", pageError);
      throw new Error("Could not find business page");
    }

    // Get DeepSeek API key
    const deepseekApiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!deepseekApiKey) {
      throw new Error("DeepSeek API key is not configured");
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
      const errorText = await apiResponse.text();
      console.error("DeepSeek API error:", errorText);
      throw new Error("Failed to generate content with AI");
    }

    const aiResult = await apiResponse.json();
    const aiContent = aiResult.choices[0].message.content;
    
    // Parse the JSON content from the AI
    let sectionsData;
    try {
      // Extract JSON if it's wrapped in code blocks or other text
      const jsonMatch = aiContent.match(/\[\s*\{.*\}\s*\]/s);
      const jsonContent = jsonMatch ? jsonMatch[0] : aiContent;
      sectionsData = JSON.parse(jsonContent);
      
      // Validate the structure
      if (!Array.isArray(sectionsData)) {
        throw new Error("AI did not return an array of sections");
      }
      
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
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.error("AI raw response:", aiContent);
      throw new Error("Failed to parse AI-generated content");
    }
  } catch (error) {
    console.error("Error in generate-page-content function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { headers: { "Content-Type": "application/json" }, status: 500 }
    );
  }
});
