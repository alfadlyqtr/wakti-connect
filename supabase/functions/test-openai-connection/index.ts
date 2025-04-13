
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
    // Get OpenAI API key from environment variables
    const openAiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAiApiKey) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'OpenAI API key not configured',
          details: 'Please add your OpenAI API key in the Supabase dashboard'
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 
        }
      );
    }
    
    // Test API key with a simple OpenAI request
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return new Response(
          JSON.stringify({ valid: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        const errorData = await response.json();
        return new Response(
          JSON.stringify({ 
            valid: false, 
            message: 'Invalid API key',
            details: errorData.error?.message || 'OpenAI rejected the API key'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          message: 'Connection error',
          details: error.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }
  } catch (error) {
    console.error('Error in test-openai-connection function:', error);
    
    return new Response(
      JSON.stringify({ 
        valid: false, 
        message: 'Internal server error',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
