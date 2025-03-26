
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Responds to an event invitation with accept or decline
 */
export const respondToInvitation = async (
  eventId: string,
  response: 'accepted' | 'declined'
): Promise<void> => {
  try {
    // Get the current user's ID
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      console.error("No authenticated user for responding to invitation");
      throw new Error("Authentication required to respond to invitations");
    }
    
    // Find the invitation for this user and event
    const { data: invitation, error: findError } = await supabase
      .from("event_invitations")
      .select("*")
      .eq("event_id", eventId)
      .eq("invited_user_id", session.user.id)
      .single();

    if (findError) {
      console.error("Error finding invitation:", findError);
      throw new Error(`Cannot find invitation: ${findError.message}`);
    }

    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Update the invitation status
    const { error } = await supabase
      .from("event_invitations")
      .update({ status: response })
      .eq("id", invitation.id);

    if (error) {
      console.error("Error updating invitation:", error);
      throw new Error(`Failed to update invitation: ${error.message}`);
    }

    toast({
      title: response === 'accepted' ? "Event Accepted" : "Event Declined",
      description: response === 'accepted' 
        ? "You've accepted the invitation. The event has been added to your calendar." 
        : "You've declined the invitation.",
    });
    
  } catch (error: any) {
    console.error("Error in respondToInvitation:", error);
    toast({
      title: "Response Failed",
      description: error?.message || "An error occurred while responding to the invitation.",
      variant: "destructive",
    });
    throw error;
  }
};
