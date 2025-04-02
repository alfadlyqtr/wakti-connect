
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bot, Trash2, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIMessage } from '@/types/ai-assistant.types';
import { AIAssistantChat } from './AIAssistantChat';
import { useAISettings } from '@/components/settings/ai/context/AISettingsContext';
import { MessageInputForm } from './MessageInputForm';
import { EmptyStateView } from './EmptyStateView';
import { PoweredByTMW } from './PoweredByTMW';
import { AISetupWizard } from '../setup/AISetupWizard';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AIDocumentManager } from '../documents/AIDocumentManager';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/components/ui/use-toast';

interface AIAssistantChatCardProps {
  messages: AIMessage[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  clearMessages: () => void;
}

export const AIAssistantChatCard: React.FC<AIAssistantChatCardProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  clearMessages
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [activeDocument, setActiveDocument] = useState<any>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const { settings } = useAISettings();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  // Check if setup is needed (by checking enabled_features or missing settings)
  useEffect(() => {
    if (canAccess && user && settings) {
      // Try to check for specialized settings
      const hasUserRole = settings.enabled_features && 
        (settings.enabled_features._userRole || settings.user_role);
      
      if (!hasUserRole) {
        setShowSetupWizard(true);
      }
    }
  }, [canAccess, settings, user]);
  
  // Always use WAKTI AI as the assistant name regardless of settings
  const assistantName = "WAKTI AI";
  
  // Get personalized mode label if available
  const getModeLabel = () => {
    if (!settings) return "";
    
    // Try to get from new fields first, then fallback to enabled_features
    const assistantMode = settings.assistant_mode || 
      (settings.enabled_features && settings.enabled_features._assistantMode) || "";
    
    switch (assistantMode) {
      case "tutor":
        return " • Tutor Mode";
      case "content_creator":
        return " • Content Creator";
      case "project_manager":
        return " • Project Manager";
      case "business_manager":
        return " • Business Manager";
      case "personal_assistant":
        return " • Personal Assistant";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
    setShowSuggestions(false);
  };
  
  const handleDocumentProcessed = (document: any) => {
    setActiveDocument(document);
  };
  
  // Handle setup completion
  const handleSetupComplete = () => {
    setShowSetupWizard(false);
    setSetupError(null);
    // Reload the page or fetch settings again
    window.location.reload();
  };
  
  // Handle setup error
  const handleSetupError = (error: string) => {
    setSetupError(error);
    toast({
      title: "Setup Error",
      description: error,
      variant: "destructive"
    });
  };

  if (showSetupWizard) {
    return (
      <Card className="w-full h-[calc(80vh)] flex flex-col">
        <CardHeader className="py-2 px-3 sm:py-3 sm:px-4 border-b flex-row justify-between items-center">
          <div className="flex items-center">
            <Bot className="w-5 h-5 mr-2 text-wakti-blue" />
            <h3 className="font-medium text-sm md:text-base">
              AI Assistant Setup
            </h3>
          </div>
          {setupError && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowSetupWizard(false)}
            >
              Cancel
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto">
          <AISetupWizard 
            onComplete={handleSetupComplete} 
            onError={handleSetupError}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[calc(80vh)] flex flex-col">
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4 border-b flex-row justify-between items-center">
        <div className="flex items-center">
          <Bot className="w-5 h-5 mr-2 text-wakti-blue" />
          <h3 className="font-medium text-sm md:text-base">
            Chat with {assistantName}
            <span className="text-xs text-muted-foreground ml-1">
              {getModeLabel()}
            </span>
          </h3>
        </div>
        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 sm:h-8 sm:w-8"
                aria-label="Document Manager"
                title="Document Manager"
              >
                <FileText className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md w-[90vw]">
              <AIDocumentManager />
            </SheetContent>
          </Sheet>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 sm:h-8 sm:w-8"
                aria-label="AI Settings"
                title="AI Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="sm:max-w-md w-[90vw]">
              <div className="space-y-4 pt-4">
                <h2 className="text-xl font-semibold">AI Assistant Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Customize your AI experience
                </p>
                
                <Button 
                  onClick={() => setShowSetupWizard(true)}
                  variant="outline"
                  className="w-full"
                >
                  Reconfigure AI Assistant
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearMessages}
              className="h-7 w-7 sm:h-8 sm:w-8"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {messages.length === 0 && showSuggestions ? (
            <EmptyStateView onPromptClick={handlePromptClick} />
          ) : (
            <AIAssistantChat 
              messages={messages} 
              isLoading={isLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              canAccess={canAccess}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <MessageInputForm
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isLoading={isLoading}
          canAccess={canAccess}
          onDocumentProcessed={handleDocumentProcessed}
        />
        
        <PoweredByTMW />
      </CardContent>
    </Card>
  );
};
