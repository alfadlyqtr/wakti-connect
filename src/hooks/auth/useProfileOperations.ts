
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { toast } from "@/components/ui/use-toast";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

export function useProfileOperations() {
  // Retry handler for profile operations with debounce to prevent too many retries
  const handleProfileOperation = useDebouncedCallback(async (userId: string, userEmail: string) => {
    let retries = 5; // Increased number of retries
    let delay = 1000; // Starting delay in ms, will increase with each retry
    
    while (retries > 0) {
      try {
        // First check if the profiles table exists using our custom function
        try {
          const { data: tableExists, error: checkError } = await supabase.rpc('check_profiles_table');
          
          if (checkError) {
            console.warn("Could not verify profiles table via RPC:", checkError);
            
            // Fallback to manual check
            const { error: tableCheckError } = await supabase
              .from("profiles")
              .select("count(*)", { count: "exact", head: true });
              
            if (tableCheckError) {
              if (tableCheckError.message.includes("does not exist")) {
                console.error("Profiles table does not exist:", tableCheckError);
                throw new Error("Database schema error: profiles table not found");
              }
              throw tableCheckError;
            }
          } else if (!tableExists) {
            console.error("RPC check confirms profiles table does not exist");
            throw new Error("Database schema error: profiles table not found via RPC check");
          }
        } catch (tableError: any) {
          // If the RPC function itself failed but didn't say the table doesn't exist,
          // we can try to continue
          if (!tableError.message?.includes("does not exist")) {
            console.warn("Error checking profiles table, continuing anyway:", tableError);
          } else {
            console.error("Error checking profiles table:", tableError);
            throw tableError;
          }
        }
        
        // Try to get profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .maybeSingle(); // Using maybeSingle instead of single to avoid errors
          
        if (error) {
          if (error.code === "PGRST116" || error.message.includes("does not exist")) {
            console.log("Profile not found, creating new profile");
            
            // Get user metadata directly
            const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
              console.error("Error getting user data:", userError);
              throw userError;
            }
            
            const metadata = authUser?.user_metadata || {};
            
            // Profile doesn't exist - create one with retries
            try {
              const { data: newProfile, error: createError } = await supabase
                .from("profiles")
                .insert({ 
                  id: userId,
                  full_name: metadata?.full_name || userEmail?.split('@')[0] || "",
                  account_type: metadata?.account_type || "free",
                  business_name: metadata?.business_name || null,
                  display_name: metadata?.display_name || metadata?.full_name || "",
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
                .select()
                .maybeSingle();
                
              if (createError) {
                // If table doesn't exist, this will fail
                console.error("Error creating profile:", createError);
                throw createError;
              }
              
              console.log("Profile created successfully:", newProfile);
              return newProfile;
            } catch (createError: any) {
              console.error(`Create profile attempt ${6-retries} failed:`, createError);
              
              // If we're getting a "relation does not exist" error, we're in trouble
              if (createError.message && createError.message.includes("does not exist")) {
                throw new Error("Database schema error: profiles table not found");
              }
              
              retries--;
              if (retries === 0) throw createError;
              // Wait before retrying with exponential backoff
              await new Promise(resolve => setTimeout(resolve, delay));
              delay *= 1.5; // Increase delay for next retry
            }
          } else {
            console.error("Error fetching profile:", error);
            
            // If we're getting a "relation does not exist" error, we're in trouble
            if (error.message && error.message.includes("does not exist")) {
              throw new Error("Database schema error: profiles table not found");
            }
            
            throw error;
          }
        } else {
          console.log("Profile fetched successfully:", profile);
          return profile;
        }
      } catch (error: any) {
        console.error(`Profile operation attempt ${6-retries} failed:`, error);
        
        // Handle specific database errors
        if (error.message && (error.message.includes("database") || 
            error.message.includes("does not exist"))) {
          // Database connection error
          toast({
            title: "Database Connection Issue",
            description: "We're having trouble connecting to our services. Please try again later.",
            variant: "destructive"
          });
        }
        
        retries--;
        if (retries === 0) throw error;
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5; // Increase delay for next retry
      }
    }
    
    // This should not be reached due to throw in the loop
    return null;
  }, 300);

  // Function to map profile data to User object
  const createUserFromProfile = (userId: string, userEmail: string, profile: any): User => {
    if (!profile) {
      console.warn("Creating user from empty profile data");
      return {
        id: userId,
        email: userEmail || "",
        name: userEmail?.split('@')[0] || "",
        displayName: "",
        plan: "free"
      };
    }
    
    return {
      id: userId,
      email: userEmail || "",
      name: profile?.full_name || userEmail?.split('@')[0] || "",
      displayName: profile?.display_name || profile?.full_name || "",
      plan: profile?.account_type || "free"
    };
  };

  // Create a basic user when profile fetch fails
  const createBasicUser = (userId: string, userEmail: string): User => {
    return {
      id: userId,
      email: userEmail || "",
      name: userEmail?.split('@')[0] || "",
      displayName: userEmail?.split('@')[0] || "",
      plan: "free"
    };
  };

  return {
    handleProfileOperation,
    createUserFromProfile,
    createBasicUser
  };
}
