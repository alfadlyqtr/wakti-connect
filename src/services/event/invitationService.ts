
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export async function respondToInvitation(
  eventId: string, 
  response: 'accepted' | 'declined'
): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("Authentication required");
    }
    
    const { error } = await supabase
      .from('event_invitations')
      .update({ status: response })
      .eq('event_id', eventId)
      .eq('invited_user_id', session.user.id);
    
    if (error) throw error;
    
    toast({
      title: `Event ${response}`,
      description: `You have ${response} the event invitation.`
    });
    
    return true;
  } catch (error) {
    console.error("Error responding to event invitation:", error);
    toast({
      title: "Failed to respond to invitation",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    return false;
  }
}
