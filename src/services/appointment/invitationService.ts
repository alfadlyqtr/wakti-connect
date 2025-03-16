
import { supabase } from "@/integrations/supabase/client";

export async function respondToInvitation(
  appointmentId: string, 
  response: 'accepted' | 'declined'
): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error("Authentication required");
  }
  
  const { error } = await supabase
    .from('appointment_invitations')
    .update({ status: response })
    .eq('appointment_id', appointmentId)
    .eq('invitee_id', session.user.id);
  
  if (error) throw error;
  
  return true;
}
