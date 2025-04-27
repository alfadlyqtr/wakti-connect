
import { supabase } from "@/integrations/supabase/client";

export const canMessageUser = async (recipientId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    // Check if users are connected in the user_contacts table with status 'accepted'
    const { data: contactData } = await supabase
      .from('user_contacts')
      .select('id')
      .eq('status', 'accepted')
      .or(`and(user_id.eq.${session.user.id},contact_id.eq.${recipientId}),and(user_id.eq.${recipientId},contact_id.eq.${session.user.id})`)
      .maybeSingle();

    return !!contactData;
  } catch (error) {
    console.error("Error checking messaging permissions:", error);
    return false;
  }
};
