
import { supabase } from "@/integrations/supabase/client";
import { fromTable } from "@/integrations/supabase/helper";

/**
 * Sends a contact request to another user
 */
export const sendContactRequest = async (userId: string): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }

  // Check if a contact relationship already exists
  const { data: existingContact } = await fromTable('user_contacts')
    .select('id, status')
    .or(`and(user_id.eq.${session.user.id},contact_id.eq.${userId}),and(user_id.eq.${userId},contact_id.eq.${session.user.id})`)
    .maybeSingle();

  if (existingContact) {
    if (existingContact.status === 'accepted') {
      throw new Error("This user is already in your contacts");
    } else if (existingContact.status === 'pending') {
      throw new Error("A contact request with this user is already pending");
    }
  }

  // Create new contact request - auto-approval is handled by the trigger
  const { error } = await fromTable('user_contacts')
    .insert({
      user_id: session.user.id,
      contact_id: userId,
      status: 'pending'
    });

  if (error) throw error;
  
  return true;
};

/**
 * Responds to an incoming contact request
 */
export const respondToContactRequest = async (
  requestId: string, 
  accept: boolean
): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    throw new Error("No active session");
  }

  const { error } = await fromTable('user_contacts')
    .update({
      status: accept ? 'accepted' : 'rejected',
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .eq('contact_id', session.user.id);

  if (error) throw error;
  
  return true;
};
