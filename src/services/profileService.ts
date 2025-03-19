
import { supabase } from "@/integrations/supabase/client";

export const ensureProfileExists = async (userId: string, defaultName?: string): Promise<boolean> => {
  try {
    console.log("Checking if profile exists for user:", userId);
    
    // First, check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();
    
    if (checkError) {
      console.error("Error checking profile:", checkError);
      return false;
    }
    
    // If profile exists, we're done
    if (existingProfile) {
      console.log("Profile already exists for user");
      return true;
    }
    
    // If not, create a profile
    console.log("Creating profile for user:", userId);
    const { data: userSession } = await supabase.auth.getSession();
    const email = userSession.session?.user?.email;
    
    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .insert([{
        id: userId,
        full_name: defaultName || email?.split('@')[0] || "User",
        account_type: "free"
      }])
      .select("*")
      .single();
    
    if (createError) {
      console.error("Error creating profile:", createError);
      return false;
    }
    
    console.log("Created new profile:", newProfile);
    return true;
  } catch (error) {
    console.error("Error in ensureProfileExists:", error);
    return false;
  }
};
