
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { createAuditLog } from "@/types/auditLogs";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";

const CreateSuperAdmin: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<"success" | "error" | null>(null);
  const [message, setMessage] = useState("");

  const createSuperAdmin = async () => {
    setIsLoading(true);
    setResult(null);
    setMessage("");
    
    try {
      const email = "admin@tmw.qa";
      const password = "Ohcanada@00974";

      // Step 1: Create the user account
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
      
      if (signUpError) {
        // Check if user already exists error
        if (signUpError.message.includes("already registered")) {
          setMessage("User already exists. Proceeding to update role...");
          
          // Try to sign in with the credentials to get the user ID
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInError || !signInData.user) {
            throw new Error(`Could not authenticate as the existing user. Please check credentials or use a different email.`);
          }
          
          const userId = signInData.user.id;
          
          // Update the profile to super-admin
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ account_type: "super-admin" })
            .eq("id", userId);
            
          if (updateError) {
            throw new Error(`Failed to update profile: ${updateError.message}`);
          }
          
          // Add to super_admins table
          const { error: superAdminError } = await supabase
            .from("super_admins")
            .upsert({ id: userId })
            .select();
            
          if (superAdminError) {
            throw new Error(`Failed to add to super_admins table: ${superAdminError.message}`);
          }
          
          // Log the update
          await createAuditLog(
            supabase,
            userId,
            "super_admin_access",
            { action: "account_updated", role: "super-admin" }
          );
          
          setResult("success");
          setMessage("Existing user updated to super admin successfully!");
          return;
        } else {
          throw new Error(`Failed to create user: ${signUpError.message}`);
        }
      }
      
      if (!authData.user) {
        throw new Error("No user data returned from signup");
      }
      
      const userId = authData.user.id;
      
      // Step 2: Add to super_admins table
      const { error: superAdminError } = await supabase
        .from("super_admins")
        .insert({ id: userId });
        
      if (superAdminError) {
        throw new Error(`Failed to add to super_admins table: ${superAdminError.message}`);
      }
      
      // Step 3: Log the creation
      await createAuditLog(
        supabase,
        userId,
        "super_admin_access",
        { action: "account_created", role: "super-admin" }
      );
      
      setResult("success");
      setMessage("Super admin account created successfully! The account is now fully active and can access all super admin features.");
      
    } catch (error: any) {
      console.error("Error creating super admin:", error);
      setResult("error");
      setMessage(`Failed to create super admin: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-500" />
          <CardTitle>Create Super Admin Account</CardTitle>
        </div>
        <CardDescription>
          This will create a super admin account with the credentials:
          <br />
          Email: admin@tmw.qa
          <br />
          Password: Ohcanada@00974
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result === "success" && (
          <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-md flex items-start gap-2 text-green-800 dark:text-green-300">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{message}</p>
          </div>
        )}
        {result === "error" && (
          <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-md flex items-start gap-2 text-red-800 dark:text-red-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p>{message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="destructive" 
          onClick={createSuperAdmin} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Creating..." : "Create Super Admin Account"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateSuperAdmin;
