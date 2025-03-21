
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to slugify business name
function slugifyBusinessName(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
}

serve(async (req) => {
  console.log("Staff invitation email function called");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key (for admin operations)
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Initialize Resend for email sending
    const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
    
    // Get the invitation ID from the request
    const { invitationId } = await req.json();
    
    if (!invitationId) {
      return new Response(
        JSON.stringify({ error: "Invitation ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Processing invitation ID: ${invitationId}`);
    
    // Use the database function to get invitation details
    const { data: invitationDetails, error: dbError } = await supabase.rpc(
      'get_invitation_details',
      { invitation_id: invitationId }
    );
    
    if (dbError || !invitationDetails || invitationDetails.length === 0) {
      console.error("Error fetching invitation details:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to retrieve invitation details" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const invitation = invitationDetails[0];
    console.log("Invitation details:", invitation);
    
    // Generate the invitation link with business name
    const businessSlug = slugifyBusinessName(invitation.business_name);
    const inviteUrl = `${req.headers.get("origin")}/auth/staff-signup?token=${invitation.token}&business=${businessSlug}`;
    
    // Send the email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "WAKTI <noreply@resend.dev>",
      to: [invitation.email],
      subject: `${invitation.business_name} has invited you to join their team on WAKTI`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>You've been invited to join ${invitation.business_name}</h2>
          <p>Hello ${invitation.name},</p>
          <p>${invitation.business_name} has invited you to join their team on WAKTI as a staff member.</p>
          <p>To accept this invitation, please click the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; background-color: #f1f5f9; padding: 10px; border-radius: 4px;">
            ${inviteUrl}
          </p>
          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
            This invitation is valid for 48 hours. If you didn't expect this invitation, you can ignore this email.
          </p>
        </div>
      `
    });
    
    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(
        JSON.stringify({ error: "Failed to send invitation email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Log the successful email send to the database
    const { error: logError } = await supabase
      .from('staff_email_logs')
      .insert({
        invitation_id: invitationId,
        status: 'sent'
      });
    
    if (logError) {
      console.error("Error logging email send:", logError);
      // Continue despite logging error
    }
    
    console.log("Invitation email sent successfully");
    return new Response(
      JSON.stringify({ success: true, message: "Invitation email sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Unexpected error in send-staff-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
