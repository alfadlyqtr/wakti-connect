
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, X } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { AIVoiceVisualizer } from '../animation/AIVoiceVisualizer';
import { AIAssistantMouthAnimation } from '../animation/AIAssistantMouthAnimation';

interface FullscreenVoiceConversationProps {
  onClose: () => void;
  onSendMessage: (text: string) => Promise<void>;
  isChatLoading: boolean;
  lastAssistantMessage: string;
}

export function FullscreenVoiceConversation({
  onClose,
  onSendMessage,
  isChatLoading,
  lastAssistantMessage
}: FullscreenVoiceConversationProps) {
  // Since we've removed text-to-speech, this is now a simpler component
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <Button 
        onClick={onClose} 
        className="absolute right-4 top-4" 
        variant="ghost" 
        size="icon"
      >
        <X className="h-5 w-5" />
      </Button>
      
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center gap-4">
            <AIAssistantMouthAnimation isActive={true} size="large" />
            <h3 className="text-xl font-medium">Voice Conversation</h3>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="p-4 border rounded-lg bg-muted/50 min-h-24 flex items-center justify-center">
            <p className="text-muted-foreground">
              {lastAssistantMessage || "How can I help you today?"}
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-3">
            <Button size="lg" className="gap-2 rounded-full h-16 w-16 bg-red-500 hover:bg-red-600">
              <Mic className="h-6 w-6" />
            </Button>
            <AIVoiceVisualizer isActive={true} />
            <p className="text-sm text-muted-foreground">
              Tap the microphone and speak
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={onClose}>
            Return to Chat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
