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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CleanChatInterface } from "@/components/ai/assistant/CleanChatInterface";
import { EnhancedToolsTab } from "@/components/ai/tools/EnhancedToolsTab";
import { RoleSpecificKnowledge } from "@/components/ai/tools/RoleSpecificKnowledge";
import { KnowledgeProfileToolCard } from "@/components/ai/tools/KnowledgeProfileToolCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIRoleSelector } from "@/components/ai/assistant/AIRoleSelector";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Wrench, 
  BookCopy,
  Bot,
  Camera,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AISystemIntegrationPanel } from "@/components/ai/assistant/AISystemIntegrationPanel";
import { useSpeechRecognition } from "@/hooks/ai/useSpeechRecognition";
import { QuickToolsCard } from "@/components/ai/tools/QuickToolsCard";
import { ParsedTaskInfo } from "@/hooks/ai/utils/taskParser.types";
import { TaskFormData } from "@/types/task.types";

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
    clearMessages,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation
  } = useAIAssistant();
  const [inputMessage, setInputMessage] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AIAssistantRole>("general");
  const [activeTab, setActiveTab] = useState<string>("chat");
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
    isRecording,
    startRecording,
    stopRecording,
    resetTranscript,
    transcript,
    temporaryTranscript,
    confirmTranscript,
    audioLevel,
    isProcessing: processingVoice,
    supported: recognitionSupported
  } = useSpeechRecognition({
    silenceThreshold: 0.02,
    silenceTimeout: 2000
  });

  useEffect(() => {
    if (transcript && !isRecording && !processingVoice) {
      setInputMessage(transcript);
    }
  }, [transcript, isRecording, processingVoice]);

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
          description: "Failed to update AI role. Please verify your account status",
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
        description: `${file.name} has been uploaded`,
      });
      
      setInputMessage(`I've uploaded ${file.name}. Can you analyze it for me?`);
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Please try again",
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
        description: "Please check your camera permissions",
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
      
      setInputMessage("I've taken a photo. Can you analyze what's in it?");
      
      setShowCamera(false);
      
      if (videoRef.current?.srcObject instanceof MediaStream) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      
      toast({
        title: "Photo Taken",
        description: "Your photo is ready for analysis",
      });
    } catch (error) {
      console.error("Error taking picture:", error);
      toast({
        title: "Camera Error",
        description: "Please try again",
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
            title: "Access Error",
            description: "Please verify your account status",
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
    resetTranscript();
  };

  const handleToolContent = (content: string) => {
    setInputMessage(content);
    setActiveTab("chat");
  };

  const handleStartVoiceInput = () => {
    resetTranscript();
    startRecording();
  };

  const handleStopVoiceInput = () => {
    stopRecording();
  };

  const handleConfirmTranscript = () => {
    if (confirmTranscript && temporaryTranscript) {
      confirmTranscript();
      setInputMessage(temporaryTranscript);
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
      case "writer": return "from-purple-600 to-purple-500";
      case "business_owner": return "from-amber-600 to-amber-500";
      default: return "from-wakti-blue to-wakti-blue/90";
    }
  };

  const shouldShowSystemIntegration = selectedRole === "business_owner";

  const convertToTaskFormData = (parsedTask: ParsedTaskInfo): TaskFormData => {
    return {
      title: parsedTask.title,
      description: parsedTask.description || '',
      priority: parsedTask.priority,
      due_date: parsedTask.due_date ? 
        (parsedTask.due_date instanceof Date ? 
          parsedTask.due_date.toISOString().split('T')[0] : 
          parsedTask.due_date) : 
        null,
      due_time: parsedTask.dueTime || null,
      subtasks: [], // Will be filled with actual subtasks
      location: parsedTask.location || null,
      originalSubtasks: parsedTask.subtasks,
      preserveNestedStructure: true
    };
  };

  return (
    <StaffRoleGuard 
      disallowStaff={true}
      messageTitle="AI Assistant Not Available"
      messageDescription="This feature is not available for staff accounts"
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
                        AI Assistant
                        <Badge variant="outline" className="ml-2 text-xs px-2">v2.0</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">Your personal productivity assistant</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-3">
                  <AIRoleSelector 
                    selectedRole={selectedRole} 
                    onRoleChange={handleRoleChange} 
                  />
                </CardContent>
              </Card>
              
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-4/5">
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
                        <div className="flex gap-4">
                          <div className="flex-1">
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
                              onStartVoiceInput={handleStartVoiceInput}
                              onStopVoiceInput={handleStopVoiceInput}
                              onConfirmTranscript={handleConfirmTranscript}
                              isListening={isRecording}
                              audioLevel={audioLevel}
                              processingVoice={processingVoice}
                              temporaryTranscript={temporaryTranscript}
                              showSuggestions={false}
                              detectedTask={detectedTask}
                              onConfirmTask={confirmCreateTask}
                              onCancelTask={cancelCreateTask}
                              isCreatingTask={isCreatingTask}
                              pendingTaskConfirmation={pendingTaskConfirmation}
                            />
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="tools" className="space-y-4 focus-visible:outline-none">
                        <EnhancedToolsTab
                          selectedRole={selectedRole}
                          onUseContent={handleToolContent}
                          canAccess={canAccess}
                        />
                      </TabsContent>
                      
                      <TabsContent value="knowledge" className="focus-visible:outline-none">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <KnowledgeProfileToolCard selectedRole={selectedRole} />
                            <RoleSpecificKnowledge
                              selectedRole={selectedRole}
                              canAccess={canAccess}
                            />
                          </div>
                        </div>
                      </TabsContent>
                    </motion.div>
                  </Tabs>
                </div>
                
                <div className="w-full lg:w-1/5">
                  {shouldShowSystemIntegration ? (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Cpu className="h-4 w-4" /> 
                          Business Tools
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <AISystemIntegrationPanel
                          selectedRole={selectedRole}
                          onExampleClick={(example) => {
                            setInputMessage(example);
                            setActiveTab("chat");
                          }}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {selectedRole === "student" ? (
                            <BookCopy className="h-4 w-4" />
                          ) : selectedRole === "employee" || selectedRole === "writer" ? (
                            <Wrench className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          {selectedRole === "employee" || selectedRole === "writer" 
                            ? "Creative Tools"
                            : selectedRole === "student"
                            ? "Student Tools"
                            : "Assistant Tools"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <QuickToolsCard
                          selectedRole={selectedRole}
                          onToolClick={(example) => {
                            setInputMessage(example);
                            setActiveTab("chat");
                          }}
                          inSidebar={true}
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Dialog open={showCamera} onOpenChange={setShowCamera}>
          <DialogContent className="max-w-md" onInteractOutside={closeCamera}>
            <DialogHeader>
              <DialogTitle>Take Picture</DialogTitle>
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
