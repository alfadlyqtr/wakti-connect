
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Delegate a task to another user or via email
 * @param taskId The ID of the task to delegate
 * @param userId Optional user ID to delegate to (if they are in the system)
 * @param email Optional email to delegate to (for users not in the system)
 */
export async function delegateTask(
  taskId: string,
  userId?: string,
  email?: string
): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("You must be logged in to delegate tasks");
    }
    
    // First, check if the authenticated user is a business account
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    if (profileError) throw profileError;
    
    if (profileData.account_type !== 'business') {
      throw new Error("Only business accounts can delegate tasks");
    }
    
    // Check if the task exists and belongs to the current user
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('user_id', session.user.id)
      .single();
      
    if (taskError) throw taskError;
    
    if (!taskData) {
      throw new Error("Task not found or you don't have permission to delegate it");
    }
    
    const updates: Record<string, any> = { 
      is_team_task: true,
      updated_at: new Date().toISOString()
    };
    
    // Update the task with delegation information
    if (userId) {
      updates.delegated_to = userId;
    }
    
    if (email) {
      updates.delegated_email = email;
      
      // If email is provided but user isn't in the system, we could send an email invitation
      // This would be handled by a separate function/service
      try {
        await sendDelegationEmail(email, taskData.title, session.user.id);
      } catch (emailError) {
        console.error("Failed to send delegation email:", emailError);
        // Continue with the delegation even if email fails
      }
    }
    
    // Update the task with delegation info
    const { error: updateError } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);
      
    if (updateError) throw updateError;
    
    // Create notification for the delegated user if they are in the system
    if (userId) {
      await createDelegationNotification(taskId, session.user.id, userId, taskData.title);
    }
    
    toast({
      title: "Task delegated successfully",
      description: userId 
        ? "The task has been delegated to the selected user" 
        : "The task has been delegated via email",
    });
    
  } catch (error) {
    console.error("Error delegating task:", error);
    toast({
      title: "Failed to delegate task",
      description: error instanceof Error ? error.message : "An unknown error occurred",
      variant: "destructive",
    });
    throw error;
  }
}

/**
 * Create a notification for the delegated user
 */
async function createDelegationNotification(
  taskId: string,
  delegatorId: string,
  delegatedUserId: string,
  taskTitle: string
): Promise<void> {
  try {
    const { data: delegatorData } = await supabase
      .from('profiles')
      .select('display_name, full_name, business_name')
      .eq('id', delegatorId)
      .single();
      
    const delegatorName = delegatorData?.business_name || 
                          delegatorData?.display_name || 
                          delegatorData?.full_name || 
                          "A business";
    
    await supabase
      .from('notifications')
      .insert({
        user_id: delegatedUserId,
        title: "Task Delegated to You",
        content: `${delegatorName} has delegated the task "${taskTitle}" to you`,
        type: "task_delegated",
        related_entity_id: taskId,
        related_entity_type: "task"
      });
      
  } catch (error) {
    console.error("Error creating delegation notification:", error);
    // Don't fail the whole delegation if notification creation fails
  }
}

/**
 * Send an email to the delegated user
 * This is a placeholder function - in a real application, this would use an email service
 */
async function sendDelegationEmail(
  email: string,
  taskTitle: string,
  businessId: string
): Promise<void> {
  try {
    // This is where you would integrate with an email service
    // For now, we'll just log the attempt
    console.log(`Would send delegation email to ${email} for task "${taskTitle}"`);
    
    // Get business info for the email
    const { data: businessData } = await supabase
      .from('profiles')
      .select('business_name, display_name, full_name')
      .eq('id', businessId)
      .single();
      
    const businessName = businessData?.business_name || 
                         businessData?.display_name || 
                         businessData?.full_name || 
                         "A business";
                         
    console.log(`Email would be from: ${businessName}`);
    
    // In a real implementation, this would call an Edge Function to send the email
    
  } catch (error) {
    console.error("Error in sendDelegationEmail:", error);
    throw error;
  }
}
