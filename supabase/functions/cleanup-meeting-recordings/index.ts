
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the function
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    console.log("Starting cleanup of expired meeting recordings");
    
    // Find meetings with expired audio recordings
    const { data: expiredMeetings, error: queryError } = await supabaseClient
      .from('meetings')
      .select('id')
      .eq('has_audio', true)
      .lt('audio_expires_at', new Date().toISOString());
      
    if (queryError) {
      throw new Error(`Error querying expired meetings: ${queryError.message}`);
    }
    
    console.log(`Found ${expiredMeetings?.length || 0} expired recordings to clean up`);
    
    if (!expiredMeetings || expiredMeetings.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No expired recordings found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Process each expired meeting
    const results = await Promise.all(expiredMeetings.map(async (meeting) => {
      try {
        // Delete the file from storage
        const { error: storageError } = await supabaseClient.storage
          .from('meeting-recordings')
          .remove([`${meeting.id}.webm`]);
          
        if (storageError) {
          console.error(`Error deleting file for meeting ${meeting.id}:`, storageError);
        }
        
        // Update the meeting record
        const { error: updateError } = await supabaseClient
          .from('meetings')
          .update({
            has_audio: false,
            audio_expires_at: null,
            audio_uploaded_at: null
          })
          .eq('id', meeting.id);
          
        if (updateError) {
          console.error(`Error updating meeting ${meeting.id}:`, updateError);
          return { id: meeting.id, success: false, error: updateError.message };
        }
        
        return { id: meeting.id, success: true };
      } catch (err) {
        console.error(`Error processing meeting ${meeting.id}:`, err);
        return { id: meeting.id, success: false, error: err.message };
      }
    }));
    
    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results: results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in cleanup function:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
