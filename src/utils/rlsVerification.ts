
import { supabase } from "@/integrations/supabase/client";

/**
 * Utility to verify Row Level Security policies are working correctly
 */
export const rlsVerification = {
  /**
   * Test if the user can access only their own tasks
   */
  async testTaskRLS(): Promise<{success: boolean; message: string}> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, message: "No active session" };
      }

      // 1. First try to fetch own tasks
      const { data: ownTasks, error: ownTasksError } = await supabase
        .from('tasks')
        .select('id, title')
        .eq('user_id', session.user.id)
        .limit(5);
        
      if (ownTasksError) {
        return { 
          success: false, 
          message: `Failed to fetch own tasks: ${ownTasksError.message}` 
        };
      }
      
      // 2. Try to access tasks with modified user_id
      const { data: otherTasks, error: otherTasksError } = await supabase
        .from('tasks')
        .select('id, title')
        .neq('user_id', session.user.id)
        .limit(5);
      
      // If we're able to get tasks from other users, RLS is failing
      if (otherTasks && otherTasks.length > 0) {
        return {
          success: false,
          message: "RLS failure: User can access tasks belonging to other users"
        };
      }
      
      // If we get an error, that's good - RLS is blocking the query
      if (otherTasksError) {
        return {
          success: true,
          message: "RLS working properly: Prevented access to other users' tasks"
        };
      }
      
      // If we get an empty array, either RLS is working or there are no other tasks
      return {
        success: true,
        message: "No other users' tasks found (RLS may be working or no data exists)"
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error testing Task RLS: ${error.message}`
      };
    }
  },
  
  /**
   * Test if RLS policies for business features are working correctly
   */
  async testBusinessFeatureRLS(): Promise<{success: boolean; message: string}> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, message: "No active session" };
      }
      
      // Get the user's account type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        return {
          success: false,
          message: `Failed to fetch profile: ${profileError.message}`
        };
      }
      
      const isBusiness = profile.account_type === 'business';
      
      // Try to access business services
      const { data: services, error: servicesError } = await supabase
        .from('business_services')
        .select('*')
        .limit(1);
      
      if (isBusiness) {
        // Business accounts should be able to access services
        if (servicesError) {
          return {
            success: false,
            message: `Business account couldn't access services: ${servicesError.message}`
          };
        }
        return {
          success: true,
          message: "Business account successfully accessed business services"
        };
      } else {
        // Non-business accounts should be blocked from accessing services
        if (servicesError) {
          return {
            success: true,
            message: "Non-business account correctly blocked from accessing business services"
          };
        }
        
        // If we get here with a non-business account and no error, RLS is not working
        return {
          success: false,
          message: "RLS failure: Non-business account accessed business services"
        };
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Error testing Business Feature RLS: ${error.message}`
      };
    }
  }
};
