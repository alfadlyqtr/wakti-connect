
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantLoader } from "@/components/ai/assistant";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AISettingsProvider } from "@/components/settings/ai";
import StaffRoleGuard from "@/components/auth/StaffRoleGuard";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { AIAssistantHeader } from "@/components/ai/navigation/AIAssistantHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CleanChatInterface } from "@/components/ai/assistant/CleanChatInterface";
import { EnhancedToolsTab } from "@/components/ai/tools/EnhancedToolsTab";
import { RoleSpecificKnowledge } from "@/components/ai/tools/RoleSpecificKnowledge";
import { useSpeechSynthesis } from "@/hooks/ai/useSpeechSynthesis";
import { 
  MessageSquare, 
  Wrench, 
  BookCopy,
  Bot,
  Volume,
  VolumeX 
} from "lucide-react";
import { motion } from "framer-motion";

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
  const [activeTab, setActiveTab] = useState<string>("chat");
  const [isSpeechEnabled, setSpeechEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = !breakpoint.includes("md");
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const { toast } = useToast();
  
  // Speech synthesis hook
  const { speak, cancel, speaking, supported: speechSupported } = useSpeechSynthesis({
    rate: 1,
    pitch: 1
  });

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
  
  // Effect for text-to-speech of new messages
  useEffect(() => {
    if (!isSpeechEnabled || !speechSupported || messages.length === 0) return;
    
    // Find the latest assistant message
    const latestAssistantMessage = [...messages]
      .reverse()
      .find(msg => msg.role === "assistant");
    
    if (latestAssistantMessage) {
      // Speak the message
      speak(latestAssistantMessage.content);
      setIsSpeaking(true);
      
      // Reset speaking state when done
      const timer = setTimeout(() => {
        setIsSpeaking(false);
      }, Math.min(latestAssistantMessage.content.length * 50, 15000));
      
      return () => {
        clearTimeout(timer);
        cancel();
      };
    }
  }, [messages, isSpeechEnabled, speechSupported, speak, cancel]);
  
  // Toggle speech
  const handleToggleSpeech = () => {
    if (speaking) {
      cancel();
    }
    setSpeechEnabled(!isSpeechEnabled);
  };
  
  // Start listening for voice input
  const handleStartListening = () => {
    setIsListening(true);
    toast({
      title: "Listening",
      description: "Speak now. Your voice will be converted to text.",
    });
    // In a real implementation, this would start speech recognition
  };
  
  // Stop listening for voice input
  const handleStopListening = () => {
    setIsListening(false);
    toast({
      title: "Stopped Listening",
      description: "Voice recognition stopped.",
    });
    // In a real implementation, this would stop speech recognition
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
  }, [user, toast]);

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
  
  // Handle content from tools
  const handleToolContent = (content: string) => {
    setInputMessage(content);
    setActiveTab("chat");
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
          {!canAccess ? (
            <AIAssistantUpgradeCard />
          ) : (
            <div className="mx-auto max-w-6xl rounded-xl shadow-sm border overflow-hidden bg-white">
              <AIAssistantHeader 
                userName={userName}
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
                isSpeechEnabled={isSpeechEnabled}
                onToggleSpeech={handleToggleSpeech}
                isListening={isListening}
                onStartListening={handleStartListening}
                onStopListening={handleStopListening}
              />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 py-4">
                <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-6">
                  <TabsTrigger value="chat" className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                    {isListening && (
                      <motion.div 
                        className="h-2 w-2 bg-red-500 rounded-full"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center space-x-2">
                    <Wrench className="h-4 w-4" />
                    <span>Tools</span>
                  </TabsTrigger>
                  <TabsTrigger value="knowledge" className="flex items-center space-x-2">
                    <BookCopy className="h-4 w-4" />
                    <span>Knowledge</span>
                  </TabsTrigger>
                </TabsList>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="chat" className="focus-visible:outline-none">
                    <CleanChatInterface
                      messages={messages}
                      isLoading={isLoading}
                      inputMessage={inputMessage}
                      setInputMessage={setInputMessage}
                      handleSendMessage={handleSendMessage}
                      selectedRole={selectedRole}
                      userName={userName}
                      isSpeaking={isSpeaking}
                      canAccess={canAccess}
                    />
                  </TabsContent>
                  
                  <TabsContent value="tools" className="focus-visible:outline-none">
                    <EnhancedToolsTab
                      selectedRole={selectedRole}
                      onUseContent={handleToolContent}
                      canAccess={canAccess}
                    />
                  </TabsContent>
                  
                  <TabsContent value="knowledge" className="focus-visible:outline-none">
                    <RoleSpecificKnowledge
                      selectedRole={selectedRole}
                      canAccess={canAccess}
                    />
                  </TabsContent>
                </motion.div>
              </Tabs>
            </div>
          )}
        </div>
      </AISettingsProvider>
    </StaffRoleGuard>
  );
};

export default DashboardAIAssistant;
