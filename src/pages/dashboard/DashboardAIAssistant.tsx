import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CleanChatInterface } from "@/components/ai/assistant/CleanChatInterface";
import { EnhancedToolsTab } from "@/components/ai/tools/EnhancedToolsTab";
import { RoleSpecificKnowledge } from "@/components/ai/tools/RoleSpecificKnowledge";
import { MeetingSummaryTool } from "@/components/ai/tools/MeetingSummaryTool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIRoleSelector } from "@/components/ai/assistant/AIRoleSelector";
import { useVoiceInteraction } from "@/hooks/ai/useVoiceInteraction";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Wrench, 
  BookCopy,
  Bot,
  Camera
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { VoiceInteractionToolCard } from "@/components/ai/tools/VoiceInteractionToolCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EnhancedToolsTabProps {
  selectedRole: AIAssistantRole;
  onUseContent: (content: string) => void;
  canAccess: boolean;
  compact?: boolean;
}

declare global {
  class ImageCapture {
    constructor(track: MediaStreamTrack);
    grabFrame(): Promise<ImageBitmap>;
    takePhoto(): Promise<Blob>;
  }
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
  const [showToolbar, setShowToolbar] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [imageCapture, setImageCapture] = useState<ImageCapture | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const breakpoint = useBreakpoint();
  const isMobile = !breakpoint.includes("md");
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const { toast } = useToast();
  
  const {
    isListening,
    startListening,
    stopListening,
    lastTranscript,
    supportsVoice
  } = useVoiceInteraction({
    continuousListening: false,
    autoResumeListening: false,
    onTranscriptComplete: (transcript) => {
      if (transcript) {
        sendVoiceMessage(transcript);
      } else {
        setInputMessage(transcript);
      }
    }
  });

  useEffect(() => {
    if (aiSettings?.role) {
      if (aiSettings.role === "writer") {
        setSelectedRole("work");
      } else {
        setSelectedRole(aiSettings.role);
      }
    }
  }, [aiSettings]);

  const handleRoleChange = async (role: AIAssistantRole) => {
    const effectiveRole = role === "writer" ? "work" : role;
    setSelectedRole(effectiveRole);
    
    if (aiSettings) {
      try {
        const updatedSettings = { ...aiSettings, role: effectiveRole };
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

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      console.log("Uploading file:", file.name);
      toast({
        title: "File Uploaded",
        description: `File "${file.name}" has been uploaded.`,
      });
      
      setInputMessage(`I've uploaded a file named "${file.name}". Can you help me with it?`);
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload the file. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleCameraCapture = useCallback(async () => {
    try {
      setShowCamera(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        const track = stream.getVideoTracks()[0];
        setImageCapture(new ImageCapture(track));
      }
    } catch (error) {
      console.error("Camera access error:", error);
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check your permissions.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const takePicture = useCallback(async () => {
    if (!imageCapture || !canvasRef.current) return;
    
    try {
      const bitmap = await imageCapture.grabFrame();
      const canvas = canvasRef.current;
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d');
      context?.drawImage(bitmap, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(dataUrl);
      
      setInputMessage("I've just taken a photo. Can you help me analyze it?");
      
      setShowCamera(false);
      
      if (videoRef.current?.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      
      toast({
        title: "Photo Taken",
        description: "Your photo has been captured and is ready to use.",
      });
    } catch (error) {
      console.error("Error taking picture:", error);
      toast({
        title: "Camera Error",
        description: "Failed to take picture. Please try again.",
        variant: "destructive"
      });
    }
  }, [imageCapture, toast]);

  const closeCamera = useCallback(() => {
    if (videoRef.current?.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  }, []);

  const sendVoiceMessage = async (text: string) => {
    if (!text.trim() || isLoading || !canAccess) {
      return;
    }
    
    console.log("Sending voice message:", text);
    await sendMessage(text);
  };

  useEffect(() => {
    const checkUserAccess = async () => {
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
    
    checkUserAccess();
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
    setInputMessage(content);
    setActiveTab("chat");
  };

  if (isChecking) {
    console.log("Still checking access, showing loader");
    return <AIAssistantLoader />;
  }

  const getRoleColor = () => {
    switch (selectedRole) {
      case "student": return "from-blue-600 to-blue-500";
      case "work": return "from-purple-600 to-purple-500";
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
          {!canAccess ? (
            <AIAssistantUpgradeCard />
          ) : (
            <div className="mx-auto max-w-5xl">
              <Card className="mb-4">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center`}>
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center">
                        WAKTI AI Assistant
                        <Badge variant="outline" className="ml-2 text-xs px-2">v2.0</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Your intelligent productivity partner</p>
                    </div>
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
                      canAccess={canAccess}
                      onFileUpload={handleFileUpload}
                      onCameraCapture={handleCameraCapture}
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
        
        <Dialog open={showCamera} onOpenChange={setShowCamera}>
          <DialogContent className="max-w-md" onInteractOutside={closeCamera}>
            <DialogHeader>
              <DialogTitle>Take a Picture</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden w-full aspect-video">
                <video 
                  ref={videoRef} 
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={closeCamera}>Cancel</Button>
                <Button onClick={takePicture}>Take Picture</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AISettingsProvider>
    </StaffRoleGuard>
  );
};

export default DashboardAIAssistant;
