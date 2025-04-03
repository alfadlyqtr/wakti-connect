
import React, { useState, useEffect } from 'react';
import { AIMessage, AIAssistantRole, RoleContexts } from '@/types/ai-assistant.types';
import { AIAssistantMessage } from '../message/AIAssistantMessage';
import { Loader2, ImagePlus } from 'lucide-react';
import { getTimeBasedGreeting } from '@/lib/dateUtils';
import { QuickToolsCard } from '../tools/QuickToolsCard';
import { Button } from '@/components/ui/button';
import { useImageGeneration, ImageSize, ImageStyle } from '@/hooks/ai/useImageGeneration';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface AIAssistantChatProps {
  messages: AIMessage[];
  isLoading: boolean;
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  canAccess: boolean;
  selectedRole: AIAssistantRole;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ 
  messages, 
  isLoading,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  canAccess,
  selectedRole
}) => {
  // State to track which message is currently being "spoken"
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageStyle, setImageStyle] = useState<ImageStyle>('natural');
  const [imageSize, setImageSize] = useState<ImageSize>('1024x1024');
  
  // Hook for image generation
  const {
    generateImage,
    isGenerating
  } = useImageGeneration({
    size: imageSize,
    style: imageStyle,
    onComplete: (imageUrl, revisedPrompt) => {
      // Close the dialog after successful generation
      setImageDialogOpen(false);
      
      // Clear the form for next use
      setImagePrompt('');
      
      // Send the image to the chat
      const imageMessage = `![${revisedPrompt}](${imageUrl})`;
      setInputMessage(imageMessage);
      // Submit the form automatically
      const event = new Event('submit', { bubbles: true });
      document.querySelector('form')?.dispatchEvent(event);
    }
  });
  
  // Determine if it's the first message (welcome message)
  const isFirstMessage = messages.length <= 1;
  
  // Get welcome message with time-based greeting
  const getWelcomeMessage = () => {
    const roleContext = RoleContexts[selectedRole];
    // Check if welcomeMessage exists, otherwise use a default message
    const baseMessage = roleContext.welcomeMessage || 
      `Hello! I'm your ${roleContext.title}. I can help with a variety of tasks. How can I assist you today?`;
    
    const timeGreeting = getTimeBasedGreeting();
    
    // Check if the welcomeMessage has a comma or exclamation to split it
    if (baseMessage.includes(',') || baseMessage.includes('!')) {
      // Extract just the greeting part (before the first comma or exclamation)
      const firstPart = baseMessage.split(/[,!]/)[0];
      const restOfMessage = baseMessage.substring(firstPart.length);
      
      // Replace the initial greeting with a time-based one
      return `${timeGreeting}${restOfMessage}`;
    }
    
    // If no specific pattern, just return with time greeting
    return `${timeGreeting}! ${baseMessage}`;
  };
  
  // Effect to simulate "speaking" animation for the latest assistant message
  useEffect(() => {
    if (messages.length === 0) return;
    
    // Find the latest assistant message
    const latestAssistantMessage = [...messages]
      .reverse()
      .find(msg => msg.role === 'assistant');
    
    if (latestAssistantMessage) {
      // Set this message as the speaking message
      setSpeakingMessageId(latestAssistantMessage.id);
      
      // Simulate speaking time based on message length (1 second per 20 characters)
      const speakingTime = Math.min(
        Math.max(latestAssistantMessage.content.length / 20, 3), 
        10
      ) * 1000;
      
      // Clear the speaking state after the calculated time
      const timer = setTimeout(() => {
        setSpeakingMessageId(null);
      }, speakingTime);
      
      return () => clearTimeout(timer);
    }
  }, [messages]);
  
  // Function to handle quick tool selection
  const handleToolClick = (toolDescription: string) => {
    setInputMessage(toolDescription);
  };
  
  // Handle image generation dialog
  const handleImageDialogOpen = () => {
    setImageDialogOpen(true);
  };
  
  const handleImageGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (imagePrompt.trim()) {
      generateImage(imagePrompt);
    }
  };
  
  // If there are no messages (besides welcome), show role context welcome message
  if (isFirstMessage) {
    const welcomeMessage: AIMessage = {
      id: "role-welcome",
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
    };
    
    return (
      <div className="space-y-8 w-full flex flex-col">
        <AIAssistantMessage 
          message={welcomeMessage} 
          isActive={true}
          isSpeaking={speakingMessageId === "role-welcome"}
        />
        
        <div className="flex justify-center my-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleImageDialogOpen}
          >
            <ImagePlus className="h-4 w-4" />
            Generate an Image
          </Button>
        </div>
        
        <div className="mt-4">
          <QuickToolsCard
            selectedRole={selectedRole}
            onToolClick={handleToolClick}
          />
        </div>
        
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate an Image</DialogTitle>
              <DialogDescription>
                Describe the image you'd like to create.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleImageGenerate} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Image Description</Label>
                  <Input
                    id="prompt"
                    placeholder="A serene landscape with mountains and a lake at sunset"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Style</Label>
                  <RadioGroup 
                    value={imageStyle} 
                    onValueChange={(value) => setImageStyle(value as ImageStyle)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="natural" id="natural" />
                      <Label htmlFor="natural">Natural</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vivid" id="vivid" />
                      <Label htmlFor="vivid">Vivid</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Size</Label>
                  <RadioGroup 
                    value={imageSize} 
                    onValueChange={(value) => setImageSize(value as ImageSize)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1024x1024" id="square" />
                      <Label htmlFor="square">Square</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1024x1792" id="portrait" />
                      <Label htmlFor="portrait">Portrait</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1792x1024" id="landscape" />
                      <Label htmlFor="landscape">Landscape</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setImageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating || !imagePrompt.trim()}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 w-full flex flex-col">
      {messages.map((message) => (
        <AIAssistantMessage 
          key={message.id} 
          message={message} 
          isActive={message.role === 'assistant'}
          isSpeaking={message.id === speakingMessageId}
        />
      ))}
      
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
      
      <div className="flex justify-center my-4">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={handleImageDialogOpen}
        >
          <ImagePlus className="h-4 w-4" />
          Generate an Image
        </Button>
      </div>
      
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Generate an Image</DialogTitle>
              <DialogDescription>
                Describe the image you'd like to create.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleImageGenerate} className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Image Description</Label>
                  <Input
                    id="prompt"
                    placeholder="A serene landscape with mountains and a lake at sunset"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Style</Label>
                  <RadioGroup 
                    value={imageStyle} 
                    onValueChange={(value) => setImageStyle(value as ImageStyle)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="natural" id="natural" />
                      <Label htmlFor="natural">Natural</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vivid" id="vivid" />
                      <Label htmlFor="vivid">Vivid</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Size</Label>
                  <RadioGroup 
                    value={imageSize} 
                    onValueChange={(value) => setImageSize(value as ImageSize)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1024x1024" id="square" />
                      <Label htmlFor="square">Square</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1024x1792" id="portrait" />
                      <Label htmlFor="portrait">Portrait</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1792x1024" id="landscape" />
                      <Label htmlFor="landscape">Landscape</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setImageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating || !imagePrompt.trim()}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
    </div>
  );
};
