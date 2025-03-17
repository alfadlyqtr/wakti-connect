
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Responds to an appointment invitation
 */
export const respondToInvitation = async (
  appointmentId: string,
  response: "accepted" | "declined"
) => {
  try {
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      throw new Error("User must be logged in to respond to invitations");
    }
    
    // Update the invitation status
    const { error } = await supabase
      .from("appointment_invitations")
      .update({ status: response })
      .eq("appointment_id", appointmentId)
      .eq("invited_user_id", session.user.id);
    
    if (error) {
      console.error("Error responding to invitation:", error);
      toast({
        title: "Error",
        description: `Could not ${response === "accepted" ? "accept" : "decline"} invitation: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
    
    // Success notification
    toast({
      title: "Success",
      description: `You have ${response === "accepted" ? "accepted" : "declined"} the invitation.`,
    });
    
    return true;
  } catch (error: any) {
    console.error("Error in respondToInvitation:", error);
    throw error;
  }
};
