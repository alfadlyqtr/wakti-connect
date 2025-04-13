
import { supabase } from "@/integrations/supabase/client";
import { getStaffBusinessId } from "@/utils/staffUtils";
import { createNotification } from "@/services/notifications";

/**
 * Send a notification to the business owner about a job card event
 */
export const sendJobCardNotification = async (
  jobCardId: string,
  eventType: 'created' | 'completed' | 'deleted',
  staffName?: string
): Promise<boolean> => {
  try {
    // Get the business ID (owner's user ID)
    const businessId = await getStaffBusinessId();
    if (!businessId) {
      console.error("Could not determine business ID for notification");
      return false;
    }
    
    // Get job details
    const { data: jobCard } = await supabase
      .from('job_cards')
      .select(`
        id,
        jobs:job_id (name),
        staff_relation_id,
        business_staff:staff_relation_id (name)
      `)
      .eq('id', jobCardId)
      .single();
      
    if (!jobCard) {
      console.error("Job card not found for notification");
      return false;
    }
    
    // Determine notification content based on event type
    let title = '';
    let message = '';
    const staffDisplayName = staffName || jobCard.business_staff?.name || 'A staff member';
    const jobName = jobCard.jobs?.name || 'a job';
    
    switch (eventType) {
      case 'created':
        title = 'New Job Card Created';
        message = `${staffDisplayName} has started ${jobName}`;
        break;
      case 'completed':
        title = 'Job Card Completed';
        message = `${staffDisplayName} has completed ${jobName}`;
        break;
      case 'deleted':
        title = 'Job Card Deleted';
        message = `A job card for ${jobName} has been deleted`;
        break;
    }
    
    // Send notification to business owner
    await createNotification(
      businessId,
      title,
      message,
      'job',
      jobCardId,
      'job_cards'
    );
    
    console.log(`Job card notification sent to business owner (${businessId})`);
    return true;
  } catch (error) {
    console.error("Error sending job card notification:", error);
    return false;
  }
};
