
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Bot, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantChatCard } from "@/components/ai/assistant";
import { AIAssistantLoader } from "@/components/ai/assistant";
import { AIAssistantHistoryCard } from "@/components/ai/AIAssistantHistoryCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AISettingsProvider } from "@/components/settings/ai";
import StaffRoleGuard from "@/components/auth/StaffRoleGuard";
import { TMWAIChatbotPromotion } from "@/components/ai/assistant/TMWAIChatbotPromotion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DashboardAIAssistant = () => {
  const { user } = useAuth();
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    canUseAI: hookCanUseAI, 
    clearMessages 
  } = useAIAssistant();
  const [inputMessage, setInputMessage] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const isMobile = !useBreakpoint().includes("md");

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
          <div className="flex flex-col gap-1 md:gap-2">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">WAKTI AI Assistant</h1>
              <Bot className="h-5 w-5 md:h-6 md:w-6 text-wakti-blue" />
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              Your AI-powered productivity assistant for tasks, events, and business management
            </p>
          </div>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">Using DeepSeek AI Only</AlertTitle>
            <AlertDescription className="text-blue-700">
              This AI assistant uses DeepSeek for text responses. Voice input feature is currently limited - your voice will be recorded but transcription is not fully implemented. Please type your messages for the best experience.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 overflow-x-auto">
              <TabsTrigger value="chat" className="text-sm md:text-base py-1 md:py-1.5">Chat</TabsTrigger>
              <TabsTrigger value="history" className="text-sm md:text-base py-1 md:py-1.5">History</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="mt-4 md:mt-6 space-y-4">
              {!canAccess ? (
                <AIAssistantUpgradeCard />
              ) : (
                <>
                  <AIAssistantChatCard
                    messages={messages}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    handleSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    canAccess={canAccess}
                    clearMessages={clearMessages}
                  />
                  <TMWAIChatbotPromotion />
                </>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4 md:mt-6">
              <AIAssistantHistoryCard canAccess={canAccess} />
              <TMWAIChatbotPromotion />
            </TabsContent>
          </Tabs>
        </div>
      </AISettingsProvider>
    </StaffRoleGuard>
  );
};

export default DashboardAIAssistant;
