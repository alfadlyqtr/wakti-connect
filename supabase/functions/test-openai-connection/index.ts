
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
    console.log("Testing OpenAI API connection");
    
    // Get the OpenAI API key from environment variables
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "OpenAI API key is not configured" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Make a simple request to OpenAI API to verify the key
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`OpenAI API error: ${response.status}`, errorData);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `OpenAI API returned error ${response.status}: ${errorData.error?.message || 'Unknown error'}` 
        }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // API key is valid
    console.log("OpenAI API connection successful");
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OpenAI API connection successful" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error testing OpenAI connection:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Unexpected error testing OpenAI connection" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
