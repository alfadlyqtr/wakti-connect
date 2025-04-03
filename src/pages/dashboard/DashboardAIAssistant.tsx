
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantLoader } from "@/components/ai/assistant";
import { supabase } from "@/integrations/supabase/client";
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
import { MeetingSummaryTool } from "@/components/ai/tools/MeetingSummaryTool";
import { QuickToolsCard } from "@/components/ai/tools/QuickToolsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIRoleSelector } from "@/components/ai/assistant/AIRoleSelector";
import { useVoiceInteraction } from "@/hooks/ai/useVoiceInteraction";
import { 
  MessageSquare, 
  Wrench, 
  BookCopy,
  Bot,
  Volume2, 
  VolumeX, 
  Mic,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { VoiceInteractionToolCard } from "@/components/ai/tools/VoiceInteractionToolCard";

interface EnhancedToolsTabProps {
  selectedRole: AIAssistantRole;
  onUseContent: (content: string) => void;
  canAccess: boolean;
  compact?: boolean;
}

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
  const [showToolbar, setShowToolbar] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const breakpoint = useBreakpoint();
  const isMobile = !breakpoint.includes("md");
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const { toast } = useToast();
  
  const {
    isListening,
    supportsVoice,
    lastTranscript,
    isProcessing,
    isSpeaking,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
    retryApiKeyValidation
  } = useVoiceInteraction();

  useEffect(() => {
    if (aiSettings?.role) {
      setSelectedRole(aiSettings.role);
    }
  }, [aiSettings]);

  const handleRoleChange = async (role: AIAssistantRole) => {
    setSelectedRole(role);
    
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
    
    clearMessages();
  };

  useEffect(() => {
    if (!isSpeechEnabled || messages.length === 0) return;
    
    const latestAssistantMessage = [...messages]
      .reverse()
      .find(msg => msg.role === "assistant");
    
    if (latestAssistantMessage) {
      speakText(latestAssistantMessage.content);
    }
  }, [messages, isSpeechEnabled, speakText]);

  useEffect(() => {
    if (lastTranscript && !isListening) {
      setInputMessage(lastTranscript);
    }
  }, [lastTranscript, isListening]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setSpeechEnabled(!isSpeechEnabled);
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
    await sendMessage(inputMessage);
    setInputMessage("");
  };

  const handleToolContent = (content: string) => {
    console.log("Using content from tool:", content.substring(0, 30) + "...");
    setInputMessage(content);
    setActiveTab("chat");
  };
  
  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
    console.log("Debug mode:", !debugMode);
    
    if (!debugMode) {
      console.log({
        canAccess,
        hookCanUseAI,
        openAIConfigStatus: "See voice interaction logs",
        selectedRole,
        activeTab,
        isSpeechEnabled
      });
    }
  };

  if (isChecking) {
    console.log("Still checking access, showing loader");
    return <AIAssistantLoader />;
  }

  const getRoleColor = () => {
    switch (selectedRole) {
      case "student": return "from-blue-600 to-blue-500";
      case "employee": return "from-purple-600 to-purple-500";
      case "writer": return "from-green-600 to-green-500";
      case "business_owner": return "from-amber-600 to-amber-500";
      default: return "from-wakti-blue to-wakti-blue/90";
    }
  };

  return (
    <StaffRoleGuard 
      disallowStaff={true}
      messageTitle="AI Assistant Not Available"
      messageDescription="AI assistant features are not available for staff accounts."
    >
      <AISettingsProvider>
        <div className="space-y-4">
          {import.meta.env.DEV && (
            <div className="bg-gray-100 p-2 text-xs border rounded-md mb-2">
              <button 
                onClick={toggleDebugMode}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                {debugMode ? "Hide Debug Info" : "Show Debug Info"}
              </button>
              
              {debugMode && (
                <div className="mt-2 space-y-1">
                  <div>Access: {canAccess ? "Yes" : "No"}</div>
                  <div>Hook Access: {hookCanUseAI ? "Yes" : "No"}</div>
                  <div>Role: {selectedRole}</div>
                  <div>Speech: {isSpeechEnabled ? "Enabled" : "Disabled"}</div>
                  <div>
                    <button 
                      onClick={() => retryApiKeyValidation()}
                      className="px-2 py-1 bg-blue-100 rounded text-blue-700 hover:bg-blue-200"
                    >
                      Retry API Key Check
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {!canAccess ? (
            <AIAssistantUpgradeCard />
          ) : (
            <div className="mx-auto max-w-5xl">
              <Card className="mb-4">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center`}>
                      {isSpeaking ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <Volume2 className="h-5 w-5 text-white" />
                        </motion.div>
                      ) : (
                        <Bot className="h-5 w-5 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="flex items-center">
                        WAKTI AI Assistant
                        <Badge variant="outline" className="ml-2 text-xs px-2">v2.0</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Your intelligent productivity partner</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {supportsVoice && (
                      <div className="flex items-center gap-2">
                        <Switch
                          id="speech-toggle"
                          checked={isSpeechEnabled}
                          onCheckedChange={handleToggleSpeech}
                          className="data-[state=checked]:bg-green-500"
                        />
                        <label htmlFor="speech-toggle" className="text-sm cursor-pointer">
                          {isSpeechEnabled ? (
                            <span className="flex items-center gap-1">
                              <Volume2 className="h-4 w-4 text-green-500" />
                              Voice On
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <VolumeX className="h-4 w-4" />
                              Voice Off
                            </span>
                          )}
                        </label>
                      </div>
                    )}
                    
                    {supportsVoice && (
                      <motion.div 
                        whileTap={{ scale: 0.95 }}
                        className={`h-8 w-8 rounded-full ${isListening ? 'bg-red-500' : 'bg-wakti-blue'} flex items-center justify-center cursor-pointer`}
                        onClick={isListening ? stopListening : startListening}
                      >
                        <Mic className="h-4 w-4 text-white" />
                        {isListening && (
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-red-500"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          />
                        )}
                      </motion.div>
                    )}
                    
                    <button
                      onClick={() => setShowToolbar(!showToolbar)}
                      className="text-muted-foreground hover:text-foreground p-1"
                    >
                      {showToolbar ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
                    </button>
                  </div>
                </CardHeader>
                {showToolbar && (
                  <CardContent className="pt-0 pb-3">
                    <AIRoleSelector 
                      selectedRole={selectedRole} 
                      onRoleChange={handleRoleChange} 
                    />
                  </CardContent>
                )}
              </Card>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mx-auto mb-4 grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                    {isListening && (
                      <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    <span>Tools</span>
                  </TabsTrigger>
                  <TabsTrigger value="knowledge" className="flex items-center gap-2">
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
                      isListening={isListening}
                      onStartListening={startListening}
                      onStopListening={stopListening}
                      recognitionSupported={supportsVoice}
                    />
                  </TabsContent>
                  
                  <TabsContent value="tools" className="space-y-6 focus-visible:outline-none">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5 text-wakti-blue" />
                          AI Assistant Tools
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <QuickToolsCard
                          selectedRole={selectedRole}
                          onToolSelect={handleToolContent}
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <VoiceInteractionToolCard
                            onSpeechRecognized={handleToolContent}
                          />
                          
                          <MeetingSummaryTool onUseSummary={handleToolContent} />
                          
                          <EnhancedToolsTab
                            selectedRole={selectedRole}
                            onUseContent={handleToolContent}
                            canAccess={canAccess}
                            compact={true}
                          />
                        </div>
                      </CardContent>
                    </Card>
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
