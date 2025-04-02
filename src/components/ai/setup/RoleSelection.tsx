
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Briefcase, Building2, User, FileText, Pencil } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "student" | "professional" | "business_owner" | "other";

interface RoleSelectionProps {
  onSelect: (role: UserRole) => void;
  initialAccountType?: string;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelect, initialAccountType = "individual" }) => {
  const { user } = useAuth();
  const [accountType, setAccountType] = useState<string>(initialAccountType);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch account type if not provided - always define hooks at the top level
  useEffect(() => {
    const getAccountType = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .single();
          
        if (!error && data) {
          setAccountType(data.account_type);
        }
      } catch (err) {
        console.error("Error fetching account type:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!initialAccountType || initialAccountType === "individual") {
      getAccountType();
    } else {
      setAccountType(initialAccountType);
      setIsLoading(false);
    }
  }, [user, initialAccountType]);
  
  // Handle business account selection - always define hooks at the top level
  useEffect(() => {
    // Only trigger the selection if we have a business account and we've finished loading
    if (accountType === "business" && !isLoading) {
      onSelect("business_owner");
    }
  }, [accountType, isLoading, onSelect]);
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading account information...</div>;
  }
  
  // For business accounts, show specific content
  if (accountType === "business") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Business Account Detected</h3>
        <p className="text-sm text-muted-foreground mb-6">
          We've detected you're using a business account. Your AI assistant will be specialized for business management.
        </p>
        
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="flex flex-col items-center h-auto p-4 gap-2"
            onClick={() => onSelect("business_owner")}
          >
            <Building2 className="h-8 w-8 mb-1 text-wakti-blue" />
            <span className="font-medium">Business Owner</span>
            <span className="text-xs text-muted-foreground text-center">
              Business management, staff coordination, and operations
            </span>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">What best describes you?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        We'll personalize your AI assistant based on your selection.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("student")}
        >
          <GraduationCap className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Student</span>
          <span className="text-xs text-muted-foreground text-center">
            Homework help, study guidance, and academic support
          </span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("professional")}
        >
          <Briefcase className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Professional</span>
          <span className="text-xs text-muted-foreground text-center">
            Work-related tasks, time management, and productivity
          </span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("other")}
        >
          <FileText className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Text Creator</span>
          <span className="text-xs text-muted-foreground text-center">
            Email signatures, document templates, and content creation
          </span>
        </Button>
      </div>
    </div>
  );
};
