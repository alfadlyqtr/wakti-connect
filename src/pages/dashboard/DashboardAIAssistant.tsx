
import React, { useState, useEffect, useRef, FormEvent } from "react";
import { useAuth } from "@/hooks/auth";
import { useProfile } from "@/hooks/useProfile";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { AIMessage, AIAssistantRole, RoleContexts } from "@/types/ai-assistant.types";
import { CleanChatInterface } from "@/components/ai/assistant/CleanChatInterface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIAssistantToolsPanel } from "@/components/ai/assistant/AIAssistantToolsPanel";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIAssistantHistoryCard } from "@/components/ai/AIAssistantHistoryCard";
import { AIAssistantDocumentsCard } from "@/components/ai/AIAssistantDocumentsCard";
import { useToast } from "@/components/ui/use-toast";
import { useVoiceInteraction } from "@/hooks/useVoiceInteraction";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Mic, Bot, MessagesSquare, BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoleProfileDialog } from "@/components/ai/tools/RoleProfileDialog";
import { Badge } from "@/components/ui/badge";

// Mock component for VoiceVisualization to be implemented later
const VoiceVisualization = ({ audioLevel = 0 }: { audioLevel?: number }) => {
  const bars = 5;
  return (
    <div className="flex items-center justify-center gap-1 h-6">
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className={`h-${Math.min(Math.max(1, Math.round(audioLevel * 6)), 6)} w-1 rounded-full ${
            i < audioLevel * bars ? "bg-primary" : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
};

const DashboardAIAssistant = () => {
  const { user } = useAuth();
  const { profile } = useProfile(user?.id);
  const { toast } = useToast();
  const [inputMessage, setInputMessage] = useState("");
  const [processingFile, setProcessingFile] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole>("general");
  const [roleProfileOpen, setRoleProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("chat");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const MOBILE_TAB_HEIGHT = "650px"; // Height for mobile tabs
  
  const {
    // Chat features
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    
    // Task detection features
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    
    // AI access check
    canUseAI
  } = useAIAssistant();

  // Voice interaction
  const {
    isListening,
    transcript,
    supportsVoice,
    startListening,
    stopListening
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text.trim()) {
        setInputMessage(text);
      }
    }
  });
  
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;
    
    const message = inputMessage;
    setInputMessage("");
    
    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleFileUpload = (file: File) => {
    setProcessingFile(true);
    
    // For this example, we'll just set a timeout to simulate processing
    setTimeout(() => {
      setProcessingFile(false);
      // In a real implementation, you'd process the file and add its content to chat
      setInputMessage(`I've uploaded a file called ${file.name}. Can you help me analyze it?`);
    }, 1000);
  };
  
  const handleDocumentContent = (content: string) => {
    setInputMessage(`I've provided this content for analysis:\n\n${content.substring(0, 100)}...`);
  };
  
  const handleStartVoiceInput = () => {
    if (supportsVoice) {
      startListening();
    } else {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Please try using Chrome or Edge.",
      });
    }
  };
  
  const handleStopVoiceInput = () => {
    stopListening();
  };
  
  const handleConfirmTask = (task: any) => {
    confirmCreateTask(task);
  };
  
  const handleCancelTask = () => {
    cancelCreateTask();
  };
  
  const clearAllMessages = () => {
    clearMessages();
  };
  
  if (!user) {
    return (
      <div className="mx-auto p-4 text-center">
        <p>Please sign in to access the AI Assistant.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:px-6 space-y-4 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">WAKTI AI Assistant</h1>
          <p className="text-muted-foreground">
            Your intelligent assistant for managing tasks, events, and more
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedRole !== "general" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRoleProfileOpen(true)}
              className="hidden md:flex"
            >
              <Settings className="h-4 w-4 mr-1" />
              {selectedRole === "business_owner" ? "Business" : selectedRole} Profile
            </Button>
          )}
          {selectedRole !== "general" && (
            <Badge variant="outline" className="hidden md:flex capitalize">
              {selectedRole === "business_owner" ? "Business" : selectedRole} Mode
            </Badge>
          )}
        </div>
      </div>
      
      {canUseAI ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="col-span-1 lg:col-span-3">
            {isMobile ? (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-4">
                  <TabsTrigger value="chat" className="flex items-center gap-1.5">
                    <MessagesSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-1.5">
                    <Bot className="h-4 w-4" />
                    <span>Assistant</span>
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>Documents</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="mt-0">
                  <CleanChatInterface
                    messages={messages}
                    isLoading={isLoading}
                    inputMessage={inputMessage}
                    setInputMessage={setInputMessage}
                    handleSendMessage={handleSendMessage}
                    selectedRole={selectedRole}
                    userName={profile?.full_name || ''}
                    canAccess={canUseAI}
                    onFileUpload={handleFileUpload}
                    detectedTask={detectedTask}
                    onConfirmTask={handleConfirmTask}
                    onCancelTask={handleCancelTask}
                    isCreatingTask={isCreatingTask}
                    pendingTaskConfirmation={pendingTaskConfirmation}
                    isListening={isListening}
                    audioLevel={0.5} // Placeholder value
                    onStartVoiceInput={handleStartVoiceInput}
                    onStopVoiceInput={handleStopVoiceInput}
                    clearMessages={clearAllMessages}
                  />
                </TabsContent>
                
                <TabsContent value="tools" className="mt-0">
                  <div className="h-[650px] overflow-y-auto bg-card border rounded-md p-4">
                    <AIAssistantToolsPanel
                      selectedRole={selectedRole}
                      onSelectRole={setSelectedRole}
                      onOpenRoleProfile={() => setRoleProfileOpen(true)}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="mt-0">
                  <div className="h-[650px] overflow-y-auto bg-card border rounded-md p-4">
                    <AIAssistantDocumentsCard
                      canAccess={canUseAI}
                      onUseDocumentContent={handleDocumentContent}
                      selectedRole={selectedRole}
                    />
                    
                    <Separator className="my-6" />
                    
                    <AIAssistantHistoryCard canAccess={canUseAI} />
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <CleanChatInterface
                messages={messages}
                isLoading={isLoading || processingFile}
                inputMessage={inputMessage}
                setInputMessage={setInputMessage}
                handleSendMessage={handleSendMessage}
                selectedRole={selectedRole}
                userName={profile?.full_name || ''}
                canAccess={canUseAI}
                onFileUpload={handleFileUpload}
                detectedTask={detectedTask}
                onConfirmTask={handleConfirmTask}
                onCancelTask={handleCancelTask}
                isCreatingTask={isCreatingTask}
                pendingTaskConfirmation={pendingTaskConfirmation}
                isListening={isListening}
                audioLevel={0.5} // Placeholder value
                onStartVoiceInput={handleStartVoiceInput}
                onStopVoiceInput={handleStopVoiceInput}
                clearMessages={clearAllMessages}
              />
            )}
          </div>
          
          {!isMobile && (
            <div className="col-span-1 space-y-4">
              <AIAssistantToolsPanel
                selectedRole={selectedRole}
                onSelectRole={setSelectedRole}
                onOpenRoleProfile={() => setRoleProfileOpen(true)}
              />
              
              <AIAssistantDocumentsCard
                canAccess={canUseAI}
                onUseDocumentContent={handleDocumentContent}
                selectedRole={selectedRole}
                compact={true}
              />
              
              <AIAssistantHistoryCard canAccess={canUseAI} compact={true} />
            </div>
          )}
        </div>
      ) : (
        <AIAssistantUpgradeCard />
      )}
      
      {selectedRole !== "general" && (
        <RoleProfileDialog
          open={roleProfileOpen}
          onOpenChange={setRoleProfileOpen}
          role={selectedRole}
        />
      )}
    </div>
  );
};

export default DashboardAIAssistant;
