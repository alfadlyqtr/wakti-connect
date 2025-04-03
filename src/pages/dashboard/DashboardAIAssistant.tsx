
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Bot, Cog, Info, MessageCircle, History, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantChatCard } from "@/components/ai/assistant";
import { AIAssistantLoader } from "@/components/ai/assistant";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AISettingsProvider } from "@/components/settings/ai";
import StaffRoleGuard from "@/components/auth/StaffRoleGuard";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Button } from "@/components/ui/button";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

const DashboardAIAssistant = () => {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    aiSettings,
    updateSettings,
    canUseAI: hookCanUseAI, 
    clearMessages 
  } = useAIAssistant();
  const [inputMessage, setInputMessage] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole>("general");
  const breakpoint = useBreakpoint();
  const isMobile = !breakpoint.includes("md");
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;

  // Initialize role from settings
  useEffect(() => {
    if (aiSettings?.role) {
      setSelectedRole(aiSettings.role);
    }
  }, [aiSettings]);

  // Handle role change
  const handleRoleChange = async (role: AIAssistantRole) => {
    setSelectedRole(role);
    
    // Update settings in the database
    if (aiSettings) {
      try {
        const updatedSettings = { ...aiSettings, role };
        await updateSettings.mutateAsync(updatedSettings);
      } catch (error) {
        console.error("Failed to update AI role:", error);
        toast({
          title: "Error",
          description: "Failed to update assistant role",
          variant: "destructive",
        });
      }
    }
    
    // Clear messages when role changes
    clearMessages();
  };

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !canAccess) {
      console.log("Cannot send message:", {
        emptyMessage: !inputMessage.trim(), 
        isLoading, 
        noAccess: !canAccess
      });
      return;
    }
    
    console.log("Sending message:", inputMessage);
    await sendMessage.mutateAsync(inputMessage);
    setInputMessage("");
  };

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-primary">Intelligent AI Assistant</h1>
                <Bot className="h-5 w-5 md:h-6 md:w-6 text-wakti-blue" />
              </div>
              <p className="text-sm text-muted-foreground">
                Your personal AI helper for tasks, planning, and assistance
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Info className="mr-1 h-3.5 w-3.5" />
                      <span className="hidden sm:inline">AI Capabilities</span>
                      <span className="sm:hidden">Info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-sm">
                    <p>WAKTI AI can help with scheduling, task management, planning, and more</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button variant="outline" size="sm" className="h-8" asChild>
                <a href="/dashboard/settings?tab=ai-assistant">
                  <Cog className="mr-1 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Customize AI</span>
                  <span className="sm:hidden">Settings</span>
                </a>
              </Button>
            </div>
          </div>

          {!canAccess ? (
            <AIAssistantUpgradeCard />
          ) : (
            <div className="mx-auto max-w-6xl">
              <AIAssistantChatCard
                messages={messages}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                isLoading={isLoading}
                canAccess={canAccess}
                clearMessages={clearMessages}
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
                userName={userName}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <h3 className="font-medium">Smart Conversations</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI remembers your preferences and adapts to your communication style.
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="font-medium">Personalized Assistance</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get recommendations and insights tailored to your business needs.
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                      <History className="h-4 w-4 text-green-600" />
                    </div>
                    <h3 className="font-medium">Continuous Learning</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    AI gets better with each interaction to serve you more effectively.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </AISettingsProvider>
    </StaffRoleGuard>
  );
};

export default DashboardAIAssistant;
