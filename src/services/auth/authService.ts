
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth.types";
import { toast } from "@/components/ui/use-toast";

export async function loginUser(email: string, password: string): Promise<void> {
  try {
    console.log("Attempting login for:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    console.log("Login successful for", email);
    
    toast({
      title: "Login successful",
      description: "Welcome back!",
    });
    
  } catch (error: any) {
    console.error("Login error:", error);
    toast({
      title: "Login failed",
      description: error.message || "An error occurred during login",
      variant: "destructive",
    });
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    console.log("Attempting logout");
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    console.log("Logout successful");
    
  } catch (error: any) {
    console.error("Logout error:", error);
    toast({
      title: "Logout failed",
      description: error.message || "An error occurred during logout",
      variant: "destructive",
    });
    throw error;
  }
}

export async function registerUser(email: string, password: string, name: string): Promise<void> {
  try {
    console.log("Attempting registration for:", email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });
    
    if (error) throw error;
    
    console.log("Registration successful");
    
    toast({
      title: "Registration successful",
      description: "Please check your email for verification",
    });
    
  } catch (error: any) {
    console.error("Registration error:", error);
    toast({
      title: "Registration failed",
      description: error.message || "An error occurred during registration",
      variant: "destructive",
    });
    throw error;
  }
}

export async function getUserRole(userId: string): Promise<string | undefined> {
  try {
    // Use our security definer function to get user role
    const { data: userRole, error: roleError } = await supabase.rpc('get_user_role');
    
    if (roleError) {
      console.error("Error getting user role:", roleError);
      // Fallback to profile query
      const { data, error } = await supabase
        .from('profiles')
        .select('account_type')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching user data for sidebar:", error);
        return undefined;
      } else if (data) {
        return data.account_type;
      }
    } else {
      // Use the role from our security definer function
      return userRole;
    }
  } catch (error) {
    console.error("Error in role fetch process:", error);
    return undefined;
  }
}

export async function getBusinessId(userId: string, userRole: string): Promise<string | undefined> {
  if (userRole === 'staff' || userRole === 'admin' || userRole === 'co-admin') {
    const { data: staffData } = await supabase
      .from("business_staff")
      .select("business_id")
      .eq("staff_id", userId)
      .eq("status", "active")
      .single();
      
    if (staffData) {
      console.log("Staff member of business:", staffData.business_id);
      return staffData.business_id;
    }
  } else if (userRole === 'business') {
    return userId;
  }
  
  return undefined;
}

export async function getUserProfile(userId: string): Promise<{ full_name?: string, display_name?: string } | null> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, display_name")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      if (profileError.code === "PGRST116") {
        console.log("Profile not found for user");
        return null;
      } else {
        console.error("Error fetching profile:", profileError);
        return null;
      }
    }
    
    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function createDefaultProfile(userId: string, email?: string, userRole?: string): Promise<{ full_name?: string, display_name?: string } | null> {
  try {
    const { data: newProfile, error: createError } = await supabase
      .from("profiles")
      .insert([{ 
        id: userId,
        full_name: email?.split('@')[0],
        account_type: userRole === 'business' ? 'business' : 'free'
      }])
      .select('full_name, display_name')
      .single();
    
    if (createError) {
      console.error("Error creating profile:", createError);
      return null;
    } else {
      console.log("Created new profile for user:", newProfile);
      return newProfile;
    }
  } catch (error) {
    console.error("Error in profile creation process:", error);
    return null;
  }
}
