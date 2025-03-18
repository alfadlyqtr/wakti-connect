
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Bot } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantChatCard } from "@/components/ai/assistant";
import { AIAssistantLoader } from "@/components/ai/assistant";
import { AIAssistantHistoryCard } from "@/components/ai/AIAssistantHistoryCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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

  // Check if user has access to AI
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
        
        // Try RPC function first
        const { data: canUse, error: rpcError } = await supabase.rpc("can_use_ai_assistant");
        
        if (!rpcError && canUse !== null) {
          console.log("RPC check result:", canUse);
          setCanAccess(canUse);
          setIsChecking(false);
          return;
        }
        
        console.log("RPC check failed with error:", rpcError?.message);
        console.log("Falling back to direct profile check");
        
        // Fallback to direct profile check
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("account_type")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error checking access:", profileError);
          toast({
            title: "Error checking access",
            description: "Could not verify your account type. Please try again.",
            variant: "destructive",
          });
          setCanAccess(false);
        } else {
          // Check the account type
          const hasAccess = profile?.account_type === "business" || profile?.account_type === "individual";
          setCanAccess(hasAccess);
          
          // Log the account type for debugging
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

  // Also use the hook's canUseAI value as a backup
  useEffect(() => {
    if (hookCanUseAI !== undefined && !isChecking) {
      console.log("Hook canUseAI value:", hookCanUseAI);
      // Only update if our direct check said false but hook says true
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

  // If still checking access, show loading
  if (isChecking) {
    console.log("Still checking access, showing loader");
    return <AIAssistantLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight">WAKTI AI Assistant</h1>
          <Bot className="h-6 w-6 text-wakti-blue" />
        </div>
        <p className="text-muted-foreground">
          Your AI-powered productivity assistant
        </p>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6 space-y-4">
          {!canAccess ? (
            <AIAssistantUpgradeCard />
          ) : (
            <AIAssistantChatCard
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              isLoading={isLoading}
              canAccess={canAccess}
              clearMessages={clearMessages}
            />
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <AIAssistantHistoryCard canAccess={canAccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardAIAssistant;
