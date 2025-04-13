
// DO NOT MODIFY UI - This component's layout is finalized and locked
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme"; // Correct import path
import { useAIAssistant } from "@/hooks/useAIAssistant";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIMessageBubble } from "@/components/ai/assistant/AIMessageBubble";
import { Textarea } from "@/components/ui/textarea";
import { AIAssistantMouthAnimation } from "@/components/ai/animation/AIAssistantMouthAnimation";
import { AIUpgradeRequired } from "@/components/ai/AIUpgradeRequired";
import { PoweredByTMW } from "@/components/ai/assistant/PoweredByTMW";
import { AIAssistantHistoryCard } from "@/components/ai/AIAssistantHistoryCard";
import { AIRoleSelector } from "@/components/ai/assistant/AIRoleSelector";
import { AIAssistantDocumentsCard } from "@/components/ai/AIAssistantDocumentsCard";
import { AIAssistantUpgradeCard } from "@/components/ai/AIAssistantUpgradeCard";
import { AIToolsTabContent } from "@/components/ai/tools/AIToolsTabContent";
import { EnhancedToolsTab } from "@/components/ai/tools/EnhancedToolsTab";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SuggestionPrompts } from "@/components/ai/assistant/SuggestionPrompts";
import { AIAssistantTabs } from "@/components/ai/navigation/AIAssistantTabs";
import { TaskConfirmationCard } from "@/components/ai/task/TaskConfirmationCard";
import { useAuth } from "@/hooks/useAuth";
import { AIVoiceVisualizer } from "@/components/ai/animation/AIVoiceVisualizer";
import { Camera, Bot, PanelTopClose, Loader2, SendHorizonal, Mic, Camera as CameraIcon, X } from "lucide-react";
import { EmptyStateView } from "@/components/ai/assistant/EmptyStateView";
import { SimplifiedVoiceRecorder } from "@/components/ai/voice/SimplifiedVoiceRecorder";
import { AISystemIntegrationPanel } from "@/components/ai/assistant/AISystemIntegrationPanel";
import { useSpeechRecognition } from "@/hooks/ai/useSpeechRecognition";
import { QuickToolsCard } from "@/components/ai/tools/QuickToolsCard";
import { ParsedTaskInfo } from "@/hooks/ai/utils/taskParser.types";
import { TaskFormData } from "@/types/task.types";
import { convertParsedTaskToFormData } from "@/hooks/ai/utils/taskParser";
import { AIAssistantRole } from "@/types/ai-assistant.types";
import { UserIntent } from "@/services/ai/aiConversationService";
import { UI_LOCKED } from "@/constants/system";

declare global {
  class ImageCapture {
    constructor(videoTrack: MediaStreamTrack);
    getPhotoCapabilities(): Promise<any>;
    takePhoto(): Promise<Blob>;
  }
}

const getRoleColor = (role: AIAssistantRole = "general") => {
  switch (role) {
    case "student":
      return "from-blue-600 to-blue-500";
    case "employee":
    case "writer":
      return "from-purple-600 to-purple-500";
    case "business_owner":
      return "from-amber-600 to-amber-500";
    default:
      return "from-wakti-blue to-wakti-blue/90";
  }
};

const DashboardAIAssistant = () => {
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false);
  const [speechRecognitionError, setSpeechRecognitionError] = useState<string | null>(null);
  const [speechRecognitionDenied, setSpeechRecognitionDenied] = useState(false);
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(false);
  
  const navigate = useNavigate();
  const { theme } = useTheme();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const {
    messages,
    sendMessage,
    isLoading,
    clearMessages,
    aiSettings,
    isLoadingSettings,
    updateSettings,
    canUseAI,
    detectedTask,
    confirmCreateTask,
    cancelCreateTask,
    isCreatingTask,
    pendingTaskConfirmation,
    getRecentContext,
    storeCurrentRole,
    currentRole,
    lastDetectedIntent
  } = useAIAssistant();
  
  const {
    transcript,
    resetTranscript,
    isRecording: listening,
    startRecording: startListening,
    stopRecording: stopListening,
    supported: browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  useEffect(() => {
    if (transcript) {
      setMessageText(transcript);
    }
  }, [transcript]);
  
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [messageText]);
  
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  useEffect(() => {
    const storedRole = localStorage.getItem('ai_settings')
      ? JSON.parse(localStorage.getItem('ai_settings') || '{}').role
      : 'general';
    
    if (storedRole) {
      storeCurrentRole(storedRole);
    }
  }, [storeCurrentRole]);
  
  useEffect(() => {
    if (isLoading) {
      setIsAIThinking(true);
    } else {
      setTimeout(() => {
        setIsAIThinking(false);
      }, 500);
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (messages.length > 0) {
      setIsFirstMessage(false);
    }
  }, [messages]);
  
  useEffect(() => {
    setSpeechRecognitionSupported(browserSupportsSpeechRecognition);
    
    if (browserSupportsSpeechRecognition) {
      setSpeechRecognitionAvailable(true);
    }
  }, [browserSupportsSpeechRecognition]);
  
  const handleSpeechToggle = async () => {
    if (!speechRecognitionAvailable) {
      setSpeechRecognitionError("Speech recognition is not available in your browser.");
      return;
    }
    
    if (!speechRecognitionSupported) {
      setSpeechRecognitionError("Speech recognition is not supported in your browser.");
      return;
    }
    
    if (speechRecognitionDenied) {
      setSpeechRecognitionError("Speech recognition is blocked. Please check your browser settings.");
      return;
    }
    
    setIsSpeechEnabled(prev => !prev);
    
    if (!isSpeechEnabled) {
      try {
        await startListening();
        setIsVoiceActive(true);
      } catch (error: any) {
        if (error.message && error.message.includes("denied")) {
          setSpeechRecognitionDenied(true);
          setSpeechRecognitionError("Microphone access denied. Please allow microphone access in your browser settings.");
        } else {
          setSpeechRecognitionError(`Error starting speech recognition: ${error.message}`);
        }
        setIsSpeechEnabled(false);
      }
    } else {
      stopListening();
      setIsVoiceActive(false);
    }
  };
  
  const handleClear = () => {
    clearMessages();
    setIsFirstMessage(true);
  };
  
  const handleSendMessage = async () => {
    if (messageText.trim() === "") return;
    
    setIsVoiceActive(false);
    setIsVoiceRecording(false);
    
    try {
      await sendMessage(messageText);
      setMessageText("");
      resetTranscript();
      
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleCaptureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      const imageUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageUrl);
      setIsCameraOpen(false);
      setMessageText(prev => prev + `\n\n[Image: ${imageUrl}]`);
    }
  };
  
  const handleCancelTask = () => {
    cancelCreateTask();
  };

  const handleConfirmTask = () => {
    if (confirmCreateTask && detectedTask) {
      // Fix for TypeScript errors around date handling
      const formattedTask: TaskFormData = {
        ...detectedTask,
        // Handle the due_date type safely without instanceof check
        due_date: detectedTask.due_date ? 
          (typeof detectedTask.due_date === 'string') ? 
            detectedTask.due_date : 
            (detectedTask.due_date && typeof detectedTask.due_date === 'object' && 'toISOString' in detectedTask.due_date) ? 
              detectedTask.due_date.toISOString().split('T')[0] : 
              String(detectedTask.due_date)
          : null,
        priority: detectedTask.priority || 'normal' // Ensure priority is not undefined
      };
      
      confirmCreateTask(formattedTask);
    }
  };
  
  const handleRoleChange = (role: AIAssistantRole) => {
    storeCurrentRole(role);
  };
  
  return (
    <div className="container mx-auto p-4">
      {/* We'll implement a minimal version of AIAssistantTabs since the imported component has different props */}
      <div className="mb-4">
        <h2 className="text-xl font-bold">WAKTI AI Assistant</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left Panel */}
        <div className="md:col-span-1 space-y-4">
          {/* Add the required selectedRole prop */}
          <AIRoleSelector 
            onRoleChange={handleRoleChange} 
            selectedRole={currentRole}
          />
          
          <AIAssistantHistoryCard canAccess={!!canUseAI} />
          
          <AIAssistantDocumentsCard 
            canAccess={!!canUseAI} 
            onUseDocumentContent={(content) => setMessageText(content)}
            selectedRole={currentRole}
          />
          
          <AIAssistantUpgradeCard />
          
          <QuickToolsCard selectedRole={currentRole} />
        </div>
        
        {/* Main Chat Interface */}
        <div className="md:col-span-3 flex flex-col h-[calc(100vh-10rem)]">
          <Card className="flex-grow flex flex-col">
            <CardHeader className="py-2">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bot className="mr-2 h-5 w-5" />
                WAKTI AI Assistant
                {isAIThinking && (
                  <AIAssistantMouthAnimation 
                    isActive={true}
                    isSpeaking={isAIThinking}
                  />
                )}
              </CardTitle>
              <CardDescription>
                {isFirstMessage
                  ? "How can I assist you today?"
                  : "Ask me anything..."}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-wakti-light-gray scrollbar-thumb-wakti-gray dark:scrollbar-track-wakti-dark-gray dark:scrollbar-thumb-wakti-light-gray">
              <ScrollArea ref={chatContainerRef} className="h-full">
                <div className="flex flex-col space-y-4 p-4">
                  {isFirstMessage && (
                    <EmptyStateView 
                      onPromptClick={setMessageText} 
                      selectedRole={currentRole}
                    />
                  )}
                  
                  {messages.map((message) => (
                    <AIMessageBubble
                      key={message.id}
                      message={message}
                    />
                  ))}
                  
                  {isLoading && (
                    <AIMessageBubble
                      message={{
                        id: "loading",
                        role: "assistant",
                        content: "Thinking...",
                        timestamp: new Date(),
                      }}
                    />
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            
            <CardFooter className="border-t py-2">
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  placeholder={speechRecognitionDenied
                    ? "Microphone access blocked. Check browser settings."
                    : speechRecognitionError
                      ? speechRecognitionError
                      : "Type your message here..."}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  rows={1}
                  className="resize-none pr-12"
                  disabled={isLoading || speechRecognitionDenied || speechRecognitionError !== null}
                />
                
                <div className="absolute right-2 bottom-2 flex items-center space-x-2">
                  {isVoiceActive && (
                    <AIVoiceVisualizer isActive={isVoiceActive} />
                  )}
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleSpeechToggle}
                    disabled={isLoading}
                  >
                    {isSpeechEnabled ? (
                      <Mic className="h-5 w-5 text-green-500" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="ghost"
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendHorizonal className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
          
          <SuggestionPrompts 
            onPromptClick={setMessageText} 
            selectedRole={currentRole} 
          />
        </div>
      </div>
      
      {/* Task confirmation */}
      {pendingTaskConfirmation && detectedTask && (
        <div className="fixed bottom-24 md:bottom-32 left-0 right-0 mx-auto max-w-md px-4 z-20">
          <TaskConfirmationCard
            taskInfo={{
              title: detectedTask.title,
              description: detectedTask.description,
              priority: detectedTask.priority || 'normal',
              subtasks: detectedTask.subtasks || [],
              due_date: detectedTask.due_date,
              dueTime: detectedTask.due_time,
              location: detectedTask.location
            }}
            onConfirm={handleConfirmTask}
            onCancel={handleCancelTask}
            isLoading={isCreatingTask}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardAIAssistant;
