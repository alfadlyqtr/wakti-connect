
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a user can message another user
 */
export const canMessageUser = async (
  recipientId: string
): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const currentUserId = session.user.id;

    // Check if they're in contacts
    const { data: contactData, error: contactError } = await supabase
      .from("user_contacts")
      .select("*")
      .eq("user_id", currentUserId)
      .eq("contact_id", recipientId)
      .eq("status", "accepted")
      .maybeSingle();

    if (contactError) {
      console.error("Error checking contact:", contactError);
      return false;
    }

    // If they're in contacts, allow messaging
    if (contactData) {
      return true;
    }

    // Check if the current user is a business and the recipient is a subscriber
    const { data: currentUserData } = await supabase
      .from("profiles")
      .select("account_type")
      .eq("id", currentUserId)
      .single();

    if (currentUserData?.account_type === "business") {
      // Check if recipient is a subscriber
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from("business_subscribers")
        .select("*")
        .eq("business_id", currentUserId)
        .eq("subscriber_id", recipientId)
        .maybeSingle();

      if (subscriptionError) {
        console.error("Error checking subscription:", subscriptionError);
        return false;
      }

      if (subscriptionData) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error in canMessageUser:", error);
    return false;
  }
};
