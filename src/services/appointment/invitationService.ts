
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function respondToInvitation(
  appointmentId: string, 
  response: 'accepted' | 'declined'
): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const { error } = await supabase
      .from('appointment_invitations')
      .update({ status: response })
      .eq('appointment_id', appointmentId)
      .eq('invited_user_id', session.user.id);
    
    if (error) throw error;
    
    toast({
      title: `Invitation ${response}`,
      description: `You have ${response} the appointment invitation.`
    });
    
    return true;
  } catch (error) {
    console.error("Error responding to invitation:", error);
    toast({
      title: "Failed to respond to invitation",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
}
