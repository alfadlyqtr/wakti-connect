
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

/**
 * Utility for verifying account type access controls and data isolation
 */
export const accountTypeVerification = {
  /**
   * Verify user account type matches what's stored in the database
   * @param expectedType The expected account type ('free', 'individual', 'business')
   * @returns Promise resolving to verification result
   */
  async verifyAccountType(expectedType: 'free' | 'individual' | 'business'): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error("No active session found");
        return false;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return false;
      }
      
      if (!data) {
        console.error("No profile found for user:", session.user.id);
        return false;
      }
      
      const storedType = data?.account_type;
      console.log(`Account type verification: Expected ${expectedType}, Got ${storedType}`);
      
      // Update role in localStorage to ensure it's current
      if (storedType) {
        localStorage.setItem('userRole', storedType);
      }
      
      return storedType === expectedType;
    } catch (error) {
      console.error("Error verifying account type:", error);
      return false;
    }
  },
  
  /**
   * Test visibility of tasks across different accounts
   * @returns Promise resolving to verification result
   */
  async verifyTaskIsolation(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error("No active session found");
        return false;
      }
      
      // First, get the current user's tasks
      const { data: userTasks, error: userTasksError } = await supabase
        .from('tasks')
        .select('id, title')
        .eq('user_id', session.user.id);
        
      if (userTasksError) {
        console.error("Error fetching user tasks:", userTasksError);
        return false;
      }
      
      // Now try to fetch tasks NOT belonging to this user
      const { data: otherTasks, error: otherTasksError } = await supabase
        .from('tasks')
        .select('id, title')
        .neq('user_id', session.user.id);
        
      if (otherTasksError) {
        // This error is expected due to RLS policies
        console.log("Correctly blocked from accessing other users' tasks");
        return true;
      }
      
      // If we could get other tasks, RLS isn't working correctly
      if (otherTasks && otherTasks.length > 0) {
        console.error("RLS failure: User can see tasks belonging to other users");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error testing task isolation:", error);
      return false;
    }
  },
  
  /**
   * Verify that events are properly isolated between accounts
   * @returns Promise resolving to verification result
   */
  async verifyEventIsolation(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error("No active session found");
        return false;
      }
      
      // First, get the current user's events
      const { data: userEvents, error: userEventsError } = await supabase
        .from('events')
        .select('id, title')
        .eq('user_id', session.user.id);
        
      if (userEventsError) {
        console.error("Error fetching user events:", userEventsError);
        return false;
      }
      
      // Now try to fetch events NOT belonging to this user
      const { data: otherEvents, error: otherEventsError } = await supabase
        .from('events')
        .select('id, title')
        .neq('user_id', session.user.id);
        
      if (otherEventsError) {
        // This error is expected due to RLS policies
        console.log("Correctly blocked from accessing other users' events");
        return true;
      }
      
      // If we could get other events, RLS isn't working correctly
      if (otherEvents && otherEvents.length > 0) {
        console.error("RLS failure: User can see events belonging to other users");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Error testing event isolation:", error);
      return false;
    }
  },
  
  /**
   * Test if business features are properly restricted based on account type
   * @returns Promise resolving to verification result
   */
  async verifyBusinessFeatureAccess(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error("No active session found");
        return false;
      }
      
      // Get user account type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', session.user.id)
        .single();
        
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return false;
      }
      
      const isBusiness = profile?.account_type === 'business';
      
      // Try to access business services (should only work for business accounts)
      const { data: services, error: servicesError } = await supabase
        .from('business_services')
        .select('id, name')
        .limit(1);
      
      if (isBusiness) {
        // Business accounts should be able to access services
        if (servicesError) {
          console.error("Business account couldn't access business services:", servicesError);
          return false;
        }
        console.log("Business account successfully accessed business services");
        return true;
      } else {
        // Non-business accounts should be blocked
        if (servicesError) {
          console.log("Non-business account correctly blocked from accessing business services");
          return true;
        }
        
        console.error("RLS failure: Non-business account accessed business services");
        return false;
      }
    } catch (error) {
      console.error("Error testing business feature access:", error);
      return false;
    }
  },
  
  /**
   * Run all verification tests and report results
   */
  async runAllTests(): Promise<void> {
    const results = {
      accountType: false,
      taskIsolation: false,
      eventIsolation: false,
      businessFeatures: false
    };
    
    // Get user account type
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      toast({
        title: "Verification Failed",
        description: "No active session found. Please log in first.",
        variant: "destructive"
      });
      return;
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', session.user.id)
      .single();
      
    const accountType = profile?.account_type as 'free' | 'individual' | 'business';
    
    // Run all tests
    results.accountType = await this.verifyAccountType(accountType);
    results.taskIsolation = await this.verifyTaskIsolation();
    results.eventIsolation = await this.verifyEventIsolation();
    results.businessFeatures = await this.verifyBusinessFeatureAccess();
    
    // Log results
    console.table(results);
    
    // Show toast with results
    const allPassed = Object.values(results).every(result => result === true);
    
    if (allPassed) {
      toast({
        title: "Verification Successful",
        description: "All account access controls are working correctly.",
      });
    } else {
      toast({
        title: "Verification Failed",
        description: "Some access controls are not working correctly. Check console for details.",
        variant: "destructive"
      });
    }
  }
};
