
import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = 'https://sqdjqehcxpzsudhzjwbu.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runCreateSuperAdmin() {
  if (!supabaseServiceKey) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
    return;
  }

  // Create Supabase admin client with service role key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  
  const email = "alfadly@me.com";
  const password = "Ohcanada@00974";
  
  try {
    console.log("Creating super admin account with service role key...");
    
    // Step 1: Create the user or update existing user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "System Administrator",
        account_type: "super-admin",
        display_name: "System Administrator"
      }
    });
    
    if (userError || !user) {
      throw new Error(`Error creating user: ${userError?.message || "Unknown error"}`);
    }
    
    console.log(`User created/updated with ID: ${user.id}`);
    
    // Step 2: Add user to super_admins table
    const { error: superAdminError } = await supabaseAdmin
      .from('super_admins')
      .upsert({ id: user.id })
      .select();
      
    if (superAdminError) {
      throw new Error(`Error adding to super_admins table: ${superAdminError.message}`);
    }
    
    // Step 3: Update profile table to ensure account_type is super-admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        account_type: "super-admin",
        full_name: "System Administrator",
        display_name: "System Administrator",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (profileError) {
      console.warn(`Warning: Failed to update profile: ${profileError.message}`);
    }
    
    console.log("Super admin account created successfully!");
    
    // Log to audit logs
    const { error: auditError } = await supabaseAdmin
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action_type: 'super_admin_creation',
        metadata: { email: user.email }
      });
      
    if (auditError) {
      console.warn(`Warning: Failed to create audit log: ${auditError.message}`);
    }
    
  } catch (error) {
    console.error("Error in super admin creation process:", error);
  }
}

runCreateSuperAdmin().catch(console.error);
