
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
  
  // Fetch account type if not provided
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
  
  // Auto-select role based on account type
  useEffect(() => {
    if (!isLoading) {
      if (accountType === "business") {
        onSelect("business_owner");
      }
    }
  }, [accountType, isLoading, onSelect]);
  
  if (isLoading) {
    return <div className="p-4 text-center">Loading account information...</div>;
  }
  
  // For business accounts, show simplified business content
  if (accountType === "business") {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-4">Business Account Detected</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Your AI assistant will be optimized for business management.
        </p>
        
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="flex flex-col items-center h-auto p-4 gap-2"
            onClick={() => onSelect("business_owner")}
          >
            <Building2 className="h-8 w-8 mb-1 text-wakti-blue" />
            <span className="font-medium">Get Started</span>
            <span className="text-xs text-muted-foreground text-center">
              Optimize WAKTI AI for your business needs
            </span>
          </Button>
        </div>
      </div>
    );
  }
  
  // For individual accounts, show simplified options
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-4">Personalize Your AI Assistant</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Choose how you want to use WAKTI AI
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("professional")}
        >
          <Briefcase className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Work & Productivity</span>
          <span className="text-xs text-muted-foreground text-center">
            Optimize for tasks, reminders, and productivity
          </span>
        </Button>
        
        <Button
          variant="outline"
          className="flex flex-col items-center h-auto p-4 gap-2"
          onClick={() => onSelect("other")}
        >
          <FileText className="h-8 w-8 mb-1 text-wakti-blue" />
          <span className="font-medium">Text Creation</span>
          <span className="text-xs text-muted-foreground text-center">
            Help with writing emails, messages, and content
          </span>
        </Button>
      </div>
    </div>
  );
};
