
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user can message another user
 * @param userId The user ID to check messaging permissions for
 * @returns boolean indicating if messaging is allowed
 */
export const canMessageUser = async (userId: string): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      return false;
    }
    
    const currentUserId = sessionData.session.user.id;
    
    // Users can't message themselves
    if (currentUserId === userId) {
      return false;
    }
    
    const { data: contactData } = await supabase
      .from('contacts')
      .select('*');
      
    // Check if they are in each other's contacts
    const isContact = contactData && contactData.some(contact => 
      (contact.user_id === currentUserId && contact.contact_id === userId && contact.status === 'accepted') ||
      (contact.user_id === userId && contact.contact_id === currentUserId && contact.status === 'accepted')
    );
    
    if (isContact) {
      return true;
    }
    
    // Check if it's a business account that accepts messages from anyone
    const { data: businessData } = await supabase
      .from('businesses')
      .select('*');
      
    const isBusiness = businessData && businessData.some(business => 
      business.owner_id === userId && business.settings?.accept_messages === true
    );
    
    if (isBusiness) {
      return true;
    }
    
    // Check if the user is subscribed to the business
    const { data: subscriptionData } = await supabase
      .from('business_subscribers')
      .select('*');
      
    const isSubscribed = subscriptionData && subscriptionData.some(sub => 
      sub.business_id === userId && sub.subscriber_id === currentUserId && sub.status === 'active'
    );
    
    return isSubscribed || false;
  } catch (error) {
    console.error("Error checking message permissions:", error);
    return false;
  }
};
