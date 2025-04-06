
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
import { KnowledgeProfileToolCard } from "@/components/ai/tools/KnowledgeProfileToolCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIRoleSelector } from "@/components/ai/assistant/AIRoleSelector";
import { useSpeechRecognition } from "@/hooks/ai/useSpeechRecognition";
import { Button } from "@/components/ui/button";
import { QuickToolsCard } from "@/components/ai/tools/QuickToolsCard";
import { 
  MessageSquare, 
  Wrench, 
  BookCopy,
  Bot,
  Camera,
  Settings,
  Cpu,
  Briefcase,
  Archive
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AISystemIntegrationPanel } from "@/components/ai/assistant/AISystemIntegrationPanel";
import { useTranslation } from "react-i18next";
import { AIAssistantTabs } from "@/components/ai/navigation/AIAssistantTabs";

// Define global ImageCapture type
declare global {
  class ImageCapture {
    constructor(track: MediaStreamTrack);
    grabFrame(): Promise<ImageBitmap>;
    takePhoto(): Promise<Blob>;
  }
}

const DashboardAIAssistant = () => {
  const { t } = useTranslation();
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
  const [showCamera, setShowCamera] = useState(false);
  const [imageCapture, setImageCapture] = useState<ImageCapture | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  
  const breakpoint = useBreakpoint();
  const isMobile = !breakpoint.includes("md");
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const { toast } = useToast();
  
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    supported: recognitionSupported
  } = useSpeechRecognition({
    onResult: (result) => {
      setInputMessage(prev => prev + " " + result);
    }
  });
  
  // Check if user can access AI features
  useEffect(() => {
    const checkAccess = async () => {
      try {
        setIsChecking(true);
        
        // Check if the user is staff
        // For staff, we'll need to check a different property
        const isStaff = user?.user_metadata?.is_staff === true;
        
        if (isStaff) {
          // Staff cannot access AI features
          setCanAccess(false);
          setIsChecking(false);
          return;
        }
        
        // For normal users, we use the hook's value
        setCanAccess(hookCanUseAI);
        setIsChecking(false);
      } catch (error) {
        console.error("Error checking AI access:", error);
        toast({
          title: t("ai.accessError"),
          description: t("ai.verifyAccountError"),
          variant: "destructive"
        });
        setCanAccess(false);
        setIsChecking(false);
      }
    };
    
    if (user) {
      checkAccess();
    }
  }, [user, hookCanUseAI, toast, t]);

  // Handle role change
  const handleRoleChange = useCallback((role: AIAssistantRole) => {
    try {
      setSelectedRole(role);
      localStorage.setItem("wakti-ai-role", role);
      clearMessages();
    } catch (error) {
      console.error("Error updating AI role:", error);
      toast({
        title: t("ai.roleUpdateError"),
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    }
  }, [setSelectedRole, clearMessages, toast, t]);
  
  // Load saved role on initial render
  useEffect(() => {
    const savedRole = localStorage.getItem("wakti-ai-role") as AIAssistantRole | null;
    if (savedRole && ["student", "business_owner", "employee", "writer", "general"].includes(savedRole)) {
      setSelectedRole(savedRole);
    }
  }, []);
  
  // Handle sending a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      const messageCopy = inputMessage;
      setInputMessage("");
      try {
        await sendMessage(messageCopy);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };
  
  // Handle file upload for AI analysis
  const handleFileUpload = async (file: File) => {
    try {
      // Upload file to temporary storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `temp/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ai-uploads')
        .upload(filePath, file);
        
      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      // Get temporary URL
      const { data: urlData } = await supabase.storage
        .from('ai-uploads')
        .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
      if (!urlData?.signedUrl) {
        throw new Error("Failed to generate file URL");
      }
      
      // Create a prompt for the AI about the file
      setInputMessage(t("ai.uploadedFilePrompt", { name: file.name }));
      
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: t("ai.uploadFailed"),
        description: error instanceof Error ? error.message : t("ai.tryAgain"),
        variant: "destructive"
      });
    }
  };
  
  // Camera functionality
  const handleCameraCapture = async () => {
    try {
      if (showCamera) {
        // Take photo
        if (imageCapture) {
          const photoBlobPromise = imageCapture.takePhoto();
          photoBlobPromise.then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);
            setShowCamera(false);
            
            // Create a prompt about the captured image
            setInputMessage(t("ai.photoTakenPrompt"));
            
            // Stop the camera stream
            if (videoRef.current && videoRef.current.srcObject) {
              const stream = videoRef.current.srcObject as MediaStream;
              stream.getTracks().forEach(track => track.stop());
            }
          });
        }
      } else {
        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Wait for video to be ready
          await new Promise(resolve => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = resolve;
            }
          });
          
          // Get the video track for ImageCapture
          const track = stream.getVideoTracks()[0];
          const newImageCapture = new ImageCapture(track);
          setImageCapture(newImageCapture);
          setShowCamera(true);
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      toast({
        title: t("ai.cameraError"),
        description: t("ai.checkPermissions"),
        variant: "destructive"
      });
    }
  };
  
  const handleVoiceTranscriptUse = () => {
    if (transcript) {
      setInputMessage(prev => prev + " " + transcript);
      resetTranscript();
    }
  };
  
  if (isChecking) {
    return <AIAssistantLoader />;
  }
  
  return (
    <StaffRoleGuard
      messageTitle={t("ai.notAvailable")}
      messageDescription={t("ai.staffRestriction")}
    >
      <AISettingsProvider>
        <div className="container mx-auto py-6 space-y-6">
          <header className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{t("ai.title")}</h1>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1.5"
              >
                <Settings className="h-4 w-4" />
                <span>{t("settings.title")}</span>
              </Button>
            </div>
            <p className="text-muted-foreground">{t("ai.subtitle")}</p>
          </header>
          
          {!canAccess ? (
            <AIAssistantUpgradeCard />
          ) : (
            <AIAssistantTabs
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
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          )}
          
          {/* Camera Dialog */}
          <Dialog open={showCamera} onOpenChange={setShowCamera}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t("ai.takePhoto")}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline
                    className="w-full h-full object-cover"
                  ></video>
                </div>
                <Button onClick={handleCameraCapture}>
                  {t("ai.takePicture")}
                </Button>
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Settings Dialog */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("aiSettings.personalitySettings")}</DialogTitle>
              </DialogHeader>
              <AISystemIntegrationPanel />
            </DialogContent>
          </Dialog>
        </div>
      </AISettingsProvider>
    </StaffRoleGuard>
  );
};

export default DashboardAIAssistant;
