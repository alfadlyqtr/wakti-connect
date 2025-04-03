
import React, { useState, useEffect } from "react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Bot, MessageSquare, FileText, Settings, History, Upload, PanelLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantChatCard } from "@/components/ai/assistant";
import { AIAssistantLoader } from "@/components/ai/assistant";
import { AIAssistantHistoryCard } from "@/components/ai/AIAssistantHistoryCard";
import { AIAssistantDocumentsCard } from "@/components/ai/AIAssistantDocumentsCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { AISettingsProvider } from "@/components/settings/ai";
import StaffRoleGuard from "@/components/auth/StaffRoleGuard";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTimeBasedGreeting } from "@/lib/dateUtils";
import { Button } from "@/components/ui/button";

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const breakpoint = useBreakpoint();
  const isMobile = !breakpoint.includes("md");

  // Initialize role from settings
  useEffect(() => {
    if (aiSettings?.role) {
      setSelectedRole(aiSettings.role);
    }
  }, [aiSettings]);

  // Automatically collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

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

  // Handle using document content in chat
  const handleUseDocumentContent = (content: string) => {
    // Truncate if too long and add to message input
    const truncated = content.length > 500 
      ? content.substring(0, 500) + "..." 
      : content;
      
    setInputMessage(prev => 
      (prev ? prev + "\n\n" : "") + 
      "Please help me with this document content:\n\n" + truncated
    );
    
    // Switch to chat tab if on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
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

  // Get a personalized greeting for the user
  const greeting = getTimeBasedGreeting(user?.user_metadata?.full_name);

  return (
    <StaffRoleGuard 
      disallowStaff={true}
      messageTitle="AI Assistant Not Available"
      messageDescription="AI assistant features are not available for staff accounts."
    >
      <AISettingsProvider>
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col gap-1 md:gap-2 mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">WAKTI AI Assistant</h1>
              <Bot className="h-5 w-5 md:h-6 md:w-6 text-wakti-blue" />
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              {greeting} How can I help you today?
            </p>
          </div>

          {!canAccess ? (
            <AIAssistantUpgradeCard />
          ) : (
            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
              {/* Left Sidebar / Tools Panel */}
              <div className={`${sidebarOpen ? 'block' : 'hidden md:block'} md:w-1/3 lg:w-1/4 space-y-4`}>
                {/* Role Selector Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Assistant Modes
                    </CardTitle>
                    <CardDescription>Choose the right assistant for your needs</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Tabs defaultValue="chat" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 mb-4">
                        <TabsTrigger value="chat" className="text-sm flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" /> Chat
                        </TabsTrigger>
                        <TabsTrigger value="documents" className="text-sm flex items-center gap-1">
                          <FileText className="h-4 w-4" /> Documents
                        </TabsTrigger>
                        <TabsTrigger value="history" className="text-sm flex items-center gap-1">
                          <History className="h-4 w-4" /> History
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="chat">
                        <div className="text-sm text-muted-foreground mb-2">
                          Chat with your AI assistant and get personalized help.
                        </div>
                      </TabsContent>

                      <TabsContent value="documents">
                        <AIAssistantDocumentsCard 
                          canAccess={canAccess} 
                          onUseDocumentContent={handleUseDocumentContent}
                          selectedRole={selectedRole}
                          compact={true}
                        />
                      </TabsContent>

                      <TabsContent value="history">
                        <AIAssistantHistoryCard 
                          canAccess={canAccess}
                          compact={true} 
                        />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* Main Chat Window - Central Area */}
              <div className={`${sidebarOpen ? 'md:w-2/3 lg:w-3/4' : 'w-full'} relative`}>
                {/* Mobile toggle for sidebar */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute -left-3 top-4 z-10 h-8 w-8 rounded-full border md:hidden"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <PanelLeft className="h-4 w-4" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>

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
                />
              </div>
            </div>
          )}
        </div>
      </AISettingsProvider>
    </StaffRoleGuard>
  );
};

export default DashboardAIAssistant;
