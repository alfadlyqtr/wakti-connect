
import React, { useRef, useEffect, useState, useCallback } from "react";
import { AIMessage, AIAssistantRole } from "@/types/ai-assistant.types";
import { AIAssistantMessage } from "../message/AIAssistantMessage";
import { Loader2 } from "lucide-react";
import { getTimeBasedGreeting } from "@/lib/dateUtils";
import { Card, CardContent } from "@/components/ui/card";
import { MessageInputForm } from "./MessageInputForm";
import { AIVoiceVisualizer } from "../animation/AIVoiceVisualizer";
import { AIAssistantMouthAnimation } from "../animation/AIAssistantMouthAnimation";
import { FullscreenVoiceConversation } from "../voice/FullscreenVoiceConversation";

interface CleanChatInterfaceProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  selectedRole: AIAssistantRole;
  userName?: string;
  isSpeaking?: boolean;
  canAccess: boolean;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  recognitionSupported?: boolean;
  onSendVoiceMessage?: (text: string) => void;
  onFileUpload?: (file: File) => Promise<void>;
  onCameraCapture?: () => Promise<void>;
}

export const CleanChatInterface: React.FC<CleanChatInterfaceProps> = ({
  messages,
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  selectedRole,
  userName,
  isSpeaking = false,
  canAccess,
  isListening = false,
  onStartListening,
  onStopListening,
  recognitionSupported = false,
  onSendVoiceMessage,
  onFileUpload,
  onCameraCapture
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isFirstMessage = messages.length === 0;
  const [voiceToVoiceEnabled, setVoiceToVoiceEnabled] = useState(false);
  const [showVoiceMode, setShowVoiceMode] = useState(false);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Voice to voice toggle handler - upgraded to properly manage state
  const handleVoiceToVoiceToggle = useCallback((enabled: boolean) => {
    console.log("Voice to voice conversation toggle:", enabled);
    setVoiceToVoiceEnabled(enabled);
    
    // If enabling and we have the ability to listen
    if (enabled && onStartListening && !isListening) {
      console.log("Starting listening due to voice-to-voice toggle");
      onStartListening();
    } else if (!enabled && isListening && onStopListening) {
      console.log("Stopping listening due to voice-to-voice toggle off");
      onStopListening();
    }
  }, [onStartListening, onStopListening, isListening]);
  
  // Handle voice-to-voice conversation - improved logic for better reliability
  useEffect(() => {
    if (!voiceToVoiceEnabled || isLoading || isSpeaking) return;
    
    if (inputMessage && onSendVoiceMessage) {
      console.log("Processing voice input for voice conversation:", inputMessage);
      
      // Add a delay to ensure the input message is complete
      const handler = setTimeout(() => {
        onSendVoiceMessage(inputMessage);
        setInputMessage('');
      }, 1000); // Increased from 500ms for more reliable operation
      
      return () => clearTimeout(handler);
    }
  }, [voiceToVoiceEnabled, inputMessage, isLoading, isSpeaking, onSendVoiceMessage, setInputMessage]);

  // Function to handle entering fullscreen voice mode
  const handleEnterVoiceMode = useCallback(() => {
    console.log("Entering fullscreen voice conversation mode");
    setShowVoiceMode(true);
    
    // Stop any ongoing listening first
    if (isListening && onStopListening) {
      onStopListening();
    }
  }, [isListening, onStopListening]);
  
  // Function to handle voice message sending in voice mode
  const handleVoiceModeMessage = useCallback(async (text: string) => {
    if (onSendVoiceMessage) {
      await onSendVoiceMessage(text);
    }
  }, [onSendVoiceMessage]);
  
  // Get welcome message based on role
  const getWelcomeMessage = () => {
    const timeGreeting = getTimeBasedGreeting(userName);
    let roleSpecific = "";
    
    switch (selectedRole) {
      case "student":
        roleSpecific = "I can help with your assignments, study planning, and educational needs.";
        break;
      case "employee":
        roleSpecific = "I can help manage your work tasks, meetings, and professional commitments.";
        break;
      case "writer":
        roleSpecific = "I can assist with your creative projects, content creation, and writing challenges.";
        break;
      case "business_owner":
        roleSpecific = "I can help with business operations, staff management, and analytics insights.";
        break;
      default:
        roleSpecific = "I can help with tasks, scheduling, and general productivity.";
    }
    
    return `${timeGreeting}! I'm your WAKTI AI Assistant. ${roleSpecific} What can I help you with today?`;
  };
  
  // Welcome message as an AIMessage
  const welcomeMessage: AIMessage = {
    id: "welcome-message",
    role: "assistant",
    content: getWelcomeMessage(),
    timestamp: new Date(),
  };
  
  // Get the last assistant message for TTS in voice mode
  const getLastAssistantMessage = () => {
    if (messages.length === 0) return getWelcomeMessage();
    
    const lastAssistantMessage = [...messages]
      .reverse()
      .find(msg => msg.role === "assistant");
      
    return lastAssistantMessage ? lastAssistantMessage.content : "";
  };
  
  return (
    <>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome UI for empty state */}
            {isFirstMessage && (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <AIAssistantMouthAnimation isActive={true} isSpeaking={isSpeaking} />
                  </div>
                  <div className="flex-1">
                    <AIAssistantMessage 
                      message={welcomeMessage} 
                      isActive={true}
                      isSpeaking={isSpeaking}
                    />
                    {isSpeaking && (
                      <div className="mt-2">
                        <AIVoiceVisualizer isActive={true} isSpeaking={isSpeaking} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Messages */}
            {messages.length > 0 && (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div className="flex items-start gap-3" key={message.id}>
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <AIAssistantMouthAnimation 
                          isActive={true} 
                          isSpeaking={isSpeaking && message.id === messages[messages.length - 1].id} 
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <AIAssistantMessage
                        message={message}
                        isActive={message.role === "assistant"}
                        isSpeaking={isSpeaking && message.id === messages[messages.length - 1].id && message.role === "assistant"}
                      />
                      {isSpeaking && message.role === "assistant" && message.id === messages[messages.length - 1].id && (
                        <div className="mt-2">
                          <AIVoiceVisualizer isActive={true} isSpeaking={isSpeaking} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Listening indicator */}
            {isListening && (
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <div className="h-4 w-4 bg-white rounded-full"></div>
                </div>
                <div className="p-3 bg-muted rounded-lg max-w-[80%]">
                  <p className="text-sm text-muted-foreground">Listening...</p>
                  {inputMessage && (
                    <p className="text-sm font-medium mt-1">{inputMessage}</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-wakti-blue flex items-center justify-center flex-shrink-0">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                </div>
                <div className="p-3 bg-muted rounded-lg max-w-[80%]">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
            
            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input form - with improved voice toggle functionality */}
          <MessageInputForm
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            canAccess={canAccess}
            isListening={isListening}
            onStartListening={onStartListening}
            onStopListening={onStopListening}
            recognitionSupported={recognitionSupported}
            voiceToVoiceEnabled={voiceToVoiceEnabled}
            onToggleVoiceToVoice={handleVoiceToVoiceToggle}
            onFileUpload={onFileUpload}
            onCameraCapture={onCameraCapture}
            isSpeaking={isSpeaking}
            onEnterVoiceMode={handleEnterVoiceMode}
          />
        </CardContent>
      </Card>
      
      {/* Fullscreen Voice Conversation Mode */}
      {showVoiceMode && (
        <FullscreenVoiceConversation
          onClose={() => setShowVoiceMode(false)}
          onSendMessage={handleVoiceModeMessage}
          isChatLoading={isLoading}
          lastAssistantMessage={getLastAssistantMessage()}
        />
      )}
    </>
  );
};
