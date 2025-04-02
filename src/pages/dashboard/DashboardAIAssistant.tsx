
import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Bot } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistantLoader } from "@/components/ai/assistant";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AISettingsProvider } from "@/components/settings/ai";
import StaffRoleGuard from "@/components/auth/StaffRoleGuard";
import { 
  AIAssistantDashboard, 
  AIChat, 
  AIDocumentLibrary, 
  AIConversationHistory 
} from "@/components/ai";
import { AISettingsPage } from "@/components/ai/settings/AISettingsPage";

const DashboardAIAssistant = () => {
  const { user } = useAuth();
  const { canUseAI: hookCanUseAI } = useAIAssistant();
  const [isChecking, setIsChecking] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const isMobile = !useBreakpoint().includes("md");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        console.log("No authenticated user, no AI access");
        setCanAccess(false);
        setIsChecking(false);
        return;
      }

      try {
        console.log("Checking AI access for user:", user.id);
        
        const { data: canUse, error: rpcError } = await supabase.rpc("can_use_ai_assistant");
        
        if (!rpcError && canUse !== null) {
          console.log("RPC check result:", canUse);
          setCanAccess(canUse);
          setIsChecking(false);
          return;
        }
        
        console.log("RPC check failed with error:", rpcError?.message);
        console.log("Falling back to direct profile check");
        
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error checking access:", profileError);
          toast({
            title: "Error checking access",
            description: "Could not verify your account type. Please try again.",
            variant: "destructive",
          });
          setCanAccess(false);
        } else {
          const hasAccess = profile?.account_type === "business" || profile?.account_type === "individual";
          setCanAccess(hasAccess);
          
          console.log("Account type:", profile?.account_type, "Has access:", hasAccess);
        }
      } catch (error) {
        console.error("Error checking AI access:", error);
        setCanAccess(false);
      }
      
      setIsChecking(false);
    };

    checkAccess();
  }, [user]);

  useEffect(() => {
    if (hookCanUseAI !== undefined && !isChecking) {
      console.log("Hook canUseAI value:", hookCanUseAI);
      if (!canAccess && hookCanUseAI) {
        console.log("Using hook's canUseAI value as backup");
        setCanAccess(hookCanUseAI);
      }
    }
  }, [hookCanUseAI, isChecking, canAccess]);

  // Redirect to index if at the root path for nested routes
  useEffect(() => {
    if (location.pathname === "/dashboard/ai-assistant" && canAccess && !isChecking) {
      const isRoot = location.pathname === "/dashboard/ai-assistant";
      if (isRoot) {
        // Don't redirect, we want to show the dashboard
      }
    }
  }, [location.pathname, canAccess, isChecking, navigate]);

  if (isChecking) {
    console.log("Still checking access, showing loader");
    return <AIAssistantLoader />;
  }

  return (
    <StaffRoleGuard 
      disallowStaff={true}
      messageTitle="AI Assistant Not Available"
      messageDescription="AI assistant features are not available for staff accounts."
    >
      <AISettingsProvider>
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">WAKTI AI Assistant</h1>
              <Bot className="h-5 w-5 md:h-6 md:w-6 text-wakti-blue" />
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Your AI-powered productivity assistant for tasks, events, and business management
            </p>
          </div>

          <Routes>
            <Route path="/" element={<AIAssistantDashboard />} />
            <Route path="/chat" element={<AIChat />} />
            <Route path="/documents" element={<AIDocumentLibrary />} />
            <Route path="/history" element={<AIConversationHistory />} />
            <Route path="/settings" element={<AISettingsPage />} />
          </Routes>
        </div>
      </AISettingsProvider>
    </StaffRoleGuard>
  );
};

export default DashboardAIAssistant;
