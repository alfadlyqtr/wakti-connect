
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample section templates
const sectionTemplates = {
  header: {
    title: "Welcome to Our Business",
    subtitle: "Providing quality services since 2020",
    image_url: null,
    cta_text: "Get Started",
    cta_link: "#contact"
  },
  about: {
    title: "About Us",
    content: "We are dedicated to providing the best service to our customers.",
    showMessageForm: false,
    messageFormTitle: "Send us a message",
    messageInputPlaceholder: "Type your message here..."
  },
  contact: {
    title: "Get in Touch",
    description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
    background_color: "#f8f9fa",
    text_color: "#333333"
  },
  gallery: {
    title: "Our Gallery",
    images: []
  },
  hours: {
    title: "Business Hours",
    description: "Visit us during our opening hours",
    days: [
      { day: "Monday", open: "09:00", close: "17:00", closed: false },
      { day: "Tuesday", open: "09:00", close: "17:00", closed: false },
      { day: "Wednesday", open: "09:00", close: "17:00", closed: false },
      { day: "Thursday", open: "09:00", close: "17:00", closed: false },
      { day: "Friday", open: "09:00", close: "17:00", closed: false },
      { day: "Saturday", open: "10:00", close: "15:00", closed: false },
      { day: "Sunday", open: "00:00", close: "00:00", closed: true }
    ]
  },
  testimonials: {
    title: "What Our Customers Say",
    testimonials: []
  },
  booking: {
    title: "Book an Appointment",
    description: "Schedule a time to meet with us",
    buttonText: "View Available Times",
    buttonLink: "#",
    showServiceSelection: true,
    showStaffSelection: true
  },
  instagram: {
    title: "Follow Us on Instagram",
    description: "Check out our latest posts",
    username: "",
    display_count: 6,
    layout: "grid"
  },
  chatbot: {
    enabled: true,
    section_title: "Chat with Us",
    section_description: "Our AI assistant is here to help answer your questions.",
    chatbot_code: "",
    chatbot_size: "medium",
    background_pattern: "none"
  }
};

// Business type to section mapping
const businessTypeSections = {
  salon: ["header", "about", "gallery", "booking", "testimonials", "contact", "hours", "instagram"],
  restaurant: ["header", "about", "hours", "gallery", "contact", "instagram"],
  retail: ["header", "about", "gallery", "contact", "hours", "instagram"],
  fitness: ["header", "about", "booking", "testimonials", "contact", "hours"],
  medical: ["header", "about", "booking", "testimonials", "contact", "hours"],
  legal: ["header", "about", "contact", "testimonials"],
  technology: ["header", "about", "contact", "testimonials", "chatbot"],
  default: ["header", "about", "contact", "hours", "gallery"]
};

// DeepSeek AI prompt template
const getPrompt = (userPrompt: string) => `
You are an AI assistant that helps create business landing pages. Your task is to interpret the user's prompt and generate content for different sections of a business landing page.

User Prompt: "${userPrompt}"

Based on this prompt, I need you to:
1. Determine the business type/industry
2. Generate appropriate sections for this business type
3. For each section, provide content that would be relevant and engaging

Please provide your response in the following JSON format:
{
  "businessType": "type of business (e.g., salon, restaurant, retail, etc.)",
  "sections": [
    {
      "section_type": "header",
      "section_content": {
        "title": "Main headline for the business",
        "subtitle": "Supporting text or tagline",
        "cta_text": "Call to action button text",
        "cta_link": "link for the button"
      }
    },
    {
      "section_type": "about",
      "section_content": {
        "title": "About Us",
        "content": "Detailed paragraph about the business"
      }
    },
    // Additional sections based on business type...
  ]
}

The output should only include sections that make sense for this business based on their description. Make the content compelling, professional, and specific to the business described.

Remember to ONLY output valid JSON - no explanations, comments, or text outside the JSON object.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { prompt, pageId } = await req.json();
    
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let businessPageData;
    
    // Get the business page if pageId is provided
    if (pageId) {
      const { data: pageData, error: pageError } = await supabase
        .from('business_pages')
        .select('*')
        .eq('id', pageId)
        .single();
        
      if (pageError && pageError.code !== 'PGRST116') {
        console.error("Error fetching business page:", pageError);
        return new Response(JSON.stringify({ error: "Error fetching business page" }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      businessPageData = pageData;
      console.log("Retrieved business page data:", businessPageData);
    }

    if (!DEEPSEEK_API_KEY) {
      // Return dummy results for testing if no API key available
      console.log("No DeepSeek API key found, returning mock data");
      
      const mockBusinessType = "salon";
      const mockSections = businessTypeSections[mockBusinessType]
        .map((sectionType) => ({
          section_type: sectionType,
          section_content: sectionTemplates[sectionType],
          is_visible: true
        }));
      
      return new Response(JSON.stringify({ 
        sections: mockSections,
        businessType: mockBusinessType
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call DeepSeek AI to generate the page content
    console.log("Calling DeepSeek AI with prompt:", prompt);
    
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are an AI assistant that generates business landing page content." },
          { role: "user", content: getPrompt(prompt) }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("DeepSeek API error:", errorData);
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }
    
    const aiData = await response.json();
    const aiContent = aiData.choices[0].message.content;
    
    try {
      // Extract the JSON from the AI response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : null;
      
      if (!jsonString) {
        throw new Error("Could not extract JSON from AI response");
      }
      
      const parsedContent = JSON.parse(jsonString);
      const { businessType, sections } = parsedContent;
      
      // Process each section to ensure it has the correct structure
      const processedSections = sections.map((section) => {
        const template = sectionTemplates[section.section_type] || {};
        return {
          section_type: section.section_type,
          section_content: { ...template, ...section.section_content },
          is_visible: true
        };
      });
      
      console.log("Generated sections:", processedSections);
      
      return new Response(JSON.stringify({ 
        sections: processedSections,
        businessType
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error("Error parsing AI response:", error);
      console.error("Raw AI response:", aiContent);
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("Error in generate-page-content function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
