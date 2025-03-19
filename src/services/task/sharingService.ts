
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Share a task with another user
 */
export async function shareTask(taskId: string, userId: string): Promise<boolean> {
  try {
    // First verify if the task exists and belongs to the current user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session");
    }
    
    const { data: taskData, error: taskError } = await supabase
      .from('tasks')
      .select('id, user_id')
      .eq('id', taskId)
      .single();
      
    if (taskError) {
      throw new Error("Failed to verify task ownership");
    }
    
    if (taskData.user_id !== session.user.id) {
      throw new Error("You can only share tasks you own");
    }
    
    // Check if the task is already shared with this user
    const { data: existingShare, error: shareCheckError } = await supabase
      .from('shared_tasks')
      .select('id')
      .eq('task_id', taskId)
      .eq('shared_with', userId);
      
    if (shareCheckError) {
      throw shareCheckError;
    }
    
    if (existingShare && existingShare.length > 0) {
      toast({
        title: "Already shared",
        description: "This task is already shared with this user",
      });
      return true; // Already shared, so we consider it a success
    }
    
    // Share the task
    const { error } = await supabase
      .from('shared_tasks')
      .insert({
        task_id: taskId,
        shared_with: userId
      });
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error sharing task:", error);
    toast({
      title: "Failed to share task",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
}

/**
 * Assign a task to a staff member (for business accounts)
 */
export async function assignTask(taskId: string, staffId: string): Promise<boolean> {
  try {
    // First verify if the task exists and belongs to the current user (business owner)
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error("No active session");
    }
    
    // Verify user is a business account
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    if (profileError) {
      throw new Error("Failed to verify account type");
    }
    
    if (profileData.account_type !== 'business') {
      throw new Error("Only business accounts can assign tasks to staff");
    }
    
    // Verify staff member belongs to this business
    const { data: staffData, error: staffError } = await supabase
      .from('business_staff')
      .select('id')
      .eq('business_id', session.user.id)
      .eq('staff_id', staffId);
      
    if (staffError) {
      throw new Error("Failed to verify staff member");
    }
    
    if (!staffData || staffData.length === 0) {
      throw new Error("Staff member not found or not part of your business");
    }
    
    // Update the task with the assignee
    const { error } = await supabase
      .from('tasks')
      .update({ assignee_id: staffId })
      .eq('id', taskId)
      .eq('user_id', session.user.id);
    
    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error assigning task:", error);
    toast({
      title: "Failed to assign task",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return false;
  }
}
