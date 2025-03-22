
import { supabase } from "@/integrations/supabase/client";
import { StaffInvitation } from "../../types";
import { toast } from "@/components/ui/use-toast";

/**
 * Helper function to send notification to business
 */
export const notifyBusinessOwner = async (invitation: StaffInvitation, userId: string) => {
  try {
    console.log("Sending notification to business owner");
    
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: invitation.business_id,
        type: 'staff_joined',
        title: 'New Staff Member Joined',
        content: `${invitation.name} has completed their account setup and joined your team`,
        related_entity_id: userId,
        related_entity_type: 'staff_account'
      });
      
    if (notificationError) {
      console.error("Error sending notification to business owner:", notificationError);
      throw notificationError;
    } else {
      console.log("Notification sent to business owner");
    }
  } catch (error) {
    console.error("Error in notifyBusinessOwner:", error);
    // Don't fail the whole process if notification fails
  }
};

/**
 * Helper function to show welcome toast
 */
export const showWelcomeToast = async (businessId: string) => {
  try {
    const { data: businessData } = await supabase
      .from('profiles')
      .select('business_name')
      .eq('id', businessId)
      .single();
      
    if (businessData?.business_name) {
      // Show welcome toast
      toast({
        title: `Welcome to ${businessData.business_name}!`,
        description: "You've successfully joined as a staff member.",
        duration: 5000,
      });
    }
  } catch (error) {
    console.error("Error fetching business data for notification:", error);
  }
};
