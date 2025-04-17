
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Auth context of the user making the request
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get the storage buckets
    const { data: buckets, error: bucketsError } = await supabaseClient.storage
      .listBuckets();

    if (bucketsError) {
      throw new Error(`Error listing buckets: ${bucketsError.message}`);
    }

    // Check if meeting-recordings bucket exists
    const meetingRecordingsBucket = buckets.find(
      (bucket) => bucket.name === "meeting-recordings"
    );

    let filesData = null;
    let filesError = null;

    // If bucket exists, list the files
    if (meetingRecordingsBucket) {
      const { data, error } = await supabaseClient.storage
        .from("meeting-recordings")
        .list();

      filesData = data;
      filesError = error;
    }

    return new Response(
      JSON.stringify({
        success: true,
        buckets: buckets,
        meetingRecordingsBucketExists: !!meetingRecordingsBucket,
        files: filesData,
        filesError: filesError,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
