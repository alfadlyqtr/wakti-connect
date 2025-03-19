
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface StaffInvitationRequest {
  invitationId: string;
  email: string;
  name: string;
  businessName: string;
  role: string;
  inviteUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received invitation request");
    const { invitationId, email, name, businessName, role, inviteUrl }: StaffInvitationRequest = await req.json();

    console.log(`Sending invitation to ${email} for business ${businessName}`);

    const emailResponse = await resend.emails.send({
      from: "WAKTI Team <onboarding@resend.dev>",
      to: [email],
      subject: `Invitation to join ${businessName} on WAKTI`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
          <h1 style="color: #3B82F6; text-align: center;">WAKTI Staff Invitation</h1>
          <p>Hello ${name},</p>
          <p>You have been invited to join <strong>${businessName}</strong> as a <strong>${role}</strong> on the WAKTI platform.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteUrl}" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Accept Invitation
            </a>
          </div>
          <p>This invitation link will expire in 7 days.</p>
          <p>If you have any questions, please contact the business owner directly.</p>
          <p style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e4e4e4; font-size: 12px; color: #666;">
            If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-staff-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
