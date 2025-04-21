
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get the Speechify API key from Supabase secrets
const SPEECHIFY_API_KEY = Deno.env.get('SPEECHIFY_API_KEY');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!SPEECHIFY_API_KEY) {
    console.error("Speechify API key missing from Supabase secrets");
    return new Response(JSON.stringify({ error: "Speechify API key missing from Supabase secrets" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log("Returning Speechify API key from secrets");
  return new Response(JSON.stringify({ apiKey: SPEECHIFY_API_KEY }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
