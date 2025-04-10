
import { supabase } from "@/integrations/supabase/client";
import { createAuditLog } from "@/types/auditLogs";

/**
 * Script to create a super admin user account
 * This should be executed once to set up the initial admin account
 */
async function createSuperAdmin() {
  const email = "alfadly@me.com";
  const password = "Ohcanada@00974";
  
  console.log("Starting super admin account creation process...");
  
  try {
    // Step 1: Check if user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id, account_type")
      .eq("email", email)
      .single();
    
    if (existingUser) {
      console.log("User already exists, checking super admin status...");
      
      // Check if already a super admin
      const { data: existingSuperAdmin } = await supabase
        .from("super_admins")
        .select("id")
        .eq("id", existingUser.id)
        .single();
        
      if (existingSuperAdmin) {
        console.log("User is already a super admin.");
        return;
      }
      
      // If user exists but is not a super admin, update their role
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ account_type: "super-admin" })
        .eq("id", existingUser.id);
        
      if (updateError) {
        throw new Error(`Failed to update user role: ${updateError.message}`);
      }
      
      // Add to super_admins table
      const { error: insertError } = await supabase
        .from("super_admins")
        .insert({ id: existingUser.id });
        
      if (insertError) {
        throw new Error(`Failed to add to super_admins table: ${insertError.message}`);
      }
      
      console.log("Existing user updated to super admin successfully!");
      return;
    }
    
    // Step 2: Create new user
    console.log("Creating new super admin user...");
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: "System Administrator",
          account_type: "super-admin",
          display_name: "System Administrator"
        }
      }
    });
    
    if (signUpError || !authData.user) {
      throw new Error(`Failed to create user: ${signUpError?.message || "Unknown error"}`);
    }
    
    const userId = authData.user.id;
    console.log(`User created with ID: ${userId}`);
    
    // Step 3: Ensure profile is set to super-admin (should be handled by trigger)
    const { error: profileCheckError } = await supabase
      .from("profiles")
      .update({ account_type: "super-admin" })
      .eq("id", userId);
      
    if (profileCheckError) {
      console.warn(`Note: Could not update profile: ${profileCheckError.message}`);
    }
    
    // Step 4: Add to super_admins table
    const { error: superAdminError } = await supabase
      .from("super_admins")
      .insert({ id: userId });
      
    if (superAdminError) {
      throw new Error(`Failed to add to super_admins table: ${superAdminError.message}`);
    }
    
    // Step 5: Log the creation for audit purposes
    try {
      await createAuditLog(
        supabase,
        userId,
        "super_admin_access",
        { action: "account_created", role: "super-admin" }
      );
    } catch (auditError) {
      console.warn("Could not create audit log:", auditError);
    }
    
    console.log("Super admin account created successfully!");
    
  } catch (error) {
    console.error("Error creating super admin account:", error);
  }
}

// Run the function
createSuperAdmin().catch(console.error);
