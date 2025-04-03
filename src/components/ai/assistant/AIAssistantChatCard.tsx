
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bot, Trash2, Settings, Image, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIMessage, AIAssistantRole } from '@/types/ai-assistant.types';
import { AIAssistantChat } from './AIAssistantChat';
import { MessageInputForm } from './MessageInputForm';
import { EmptyStateView } from './EmptyStateView';
import { PoweredByTMW } from './PoweredByTMW';
import { AIRoleSelector } from './AIRoleSelector';

interface AIAssistantChatCardProps {
  messages: AIMessage[];
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  clearMessages: () => void;
  selectedRole: AIAssistantRole;
  onRoleChange: (role: AIAssistantRole) => void;
}

export const AIAssistantChatCard: React.FC<AIAssistantChatCardProps> = ({
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  clearMessages,
  selectedRole,
  onRoleChange
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Get role-specific title and styles
  const getRoleTitle = () => {
    switch (selectedRole) {
      case 'student': return 'WAKTI Study Assistant';
      case 'professional': return 'WAKTI Work Assistant';
      case 'creator': return 'WAKTI Creator Assistant';
      case 'business_owner': return 'WAKTI Business Assistant';
      default: return 'WAKTI AI Assistant';
    }
  };
  
  const getRoleColor = () => {
    switch (selectedRole) {
      case 'student': return 'from-blue-600 to-blue-500';
      case 'professional': return 'from-purple-600 to-purple-500';
      case 'creator': return 'from-green-600 to-green-500';
      case 'business_owner': return 'from-amber-600 to-amber-500';
      default: return 'from-wakti-blue to-wakti-blue/90';
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

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Handle file upload logic - for now just add a message about it
      setInputMessage(prev => `${prev ? prev + '\n\n' : ''}I've uploaded an image/document. Can you help me analyze it?`);
      
      // Reset the input
      e.target.value = '';
    }
  };

  const handleCameraCapture = () => {
    // In a real implementation, this would trigger device camera
    alert("Camera functionality would be implemented here");
  };

  return (
    <Card className="w-full h-[calc(75vh)] flex flex-col shadow-md border-wakti-blue/10 overflow-hidden rounded-xl">
      <CardHeader className="py-2 px-3 sm:py-3 sm:px-4 border-b flex-row justify-between items-center bg-gradient-to-r from-white to-gray-50">
        <div className="flex items-center">
          <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${getRoleColor()} flex items-center justify-center flex-shrink-0 mr-2 shadow-sm`}>
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-sm md:text-base">{getRoleTitle()}</h3>
            <p className="text-xs text-muted-foreground">Personalized AI for your needs</p>
          </div>
        </div>
        <div className="flex gap-2">
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearMessages}
              className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-blue-50 hover:text-blue-500 transition-colors"
            aria-label="Settings"
            title="Assistant Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-gray-50/50 to-white">
        {/* Role Selector Bar */}
        <div className="p-3 border-b bg-white">
          <AIRoleSelector selectedRole={selectedRole} onRoleChange={onRoleChange} />
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {messages.length === 0 && showSuggestions ? (
            <EmptyStateView onPromptClick={handlePromptClick} selectedRole={selectedRole} />
          ) : (
            <AIAssistantChat 
              messages={messages} 
              isLoading={isLoading}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              canAccess={canAccess}
              selectedRole={selectedRole}
            />
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* File Input Hidden Element */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept="image/*,.pdf,.doc,.docx"
        />
        
        {/* Enhanced Message Input Form with Upload Buttons */}
        <div className="border-t">
          <div className="px-3 py-2 flex items-center gap-1 bg-gray-50/80">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleFileUpload}
              title="Upload file or image"
            >
              <Image className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleCameraCapture}
              title="Take a photo"
            >
              <Camera className="h-4 w-4 text-muted-foreground" />
            </Button>
            <span className="text-xs text-muted-foreground ml-1">Upload or capture for analysis</span>
          </div>
          <MessageInputForm
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            handleSendMessage={handleSendMessage}
            isLoading={isLoading}
            canAccess={canAccess}
          />
        </div>
        
        <PoweredByTMW />
      </CardContent>
    </Card>
  );
};
