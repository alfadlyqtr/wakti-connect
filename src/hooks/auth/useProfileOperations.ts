
import { supabase } from "@/integrations/supabase/client";
import { User } from "./types";
import { toast } from "@/components/ui/use-toast";

export function useProfileOperations() {
  // Function to map profile data to User object - simplified
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

  // Create a basic user when profile fetch fails or is pending
  const createBasicUser = (userId: string, userEmail: string): User => {
    return {
      id: userId,
      email: userEmail || "",
      name: userEmail?.split('@')[0] || "",
      displayName: userEmail?.split('@')[0] || "",
      plan: "free"
    };
  };

  // Handle profile creation with simplified approach
  const createProfile = async (userId: string, userEmail: string) => {
    try {
      // Get user metadata directly
      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user data:", userError);
        throw userError;
      }
      
      const metadata = authUser?.user_metadata || {};
      
      // Create profile
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
        console.error("Error creating profile:", createError);
        throw createError;
      }
      
      console.log("Profile created successfully:", newProfile);
      return newProfile;
    } catch (error) {
      console.error("Failed to create profile:", error);
      throw error;
    }
  };

  return {
    createUserFromProfile,
    createBasicUser,
    createProfile
  };
}
