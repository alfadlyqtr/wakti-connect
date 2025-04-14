import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { WAKTIAIMode } from '@/types/ai-assistant.types';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { cn } from '@/lib/utils';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  Camera, 
  Loader2
} from 'lucide-react';

interface AIAssistantToolbarProps {
  activeMode: WAKTIAIMode;
}

export const AIAssistantToolbar = ({ activeMode }: AIAssistantToolbarProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isLoading } = useAIAssistant();
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    supportsVoice
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        // Append to existing text rather than replacing
        setInputMessage(prev => {
          const separator = prev && !prev.endsWith(' ') && !text.startsWith(' ') ? ' ' : '';
          return prev + separator + text;
        });
        setShowVoiceInput(false);
      }
    }
  });
  
  // Update input field with transcript in real-time
  useEffect(() => {
    if (transcript && isListening) {
      setInputMessage(prev => {
        const separator = prev && !prev.endsWith(' ') && !transcript.startsWith(' ') ? ' ' : '';
        return prev + separator + transcript;
      });
    }
  }, [transcript, isListening]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const messageCopy = inputMessage.trim();

    const { success } = await sendMessage(messageCopy);

    if (success) {
      setInputMessage(''); // ✅ Only clear after confirmed success
    } else {
      console.warn('Message failed to send. Input preserved.');
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real implementation, you'd process the file and send it to the AI
    console.log('File to process:', files[0]);
    
    // Reset the input
    e.target.value = '';
  };
  
  const handleCameraCapture = () => {
    // This would open the camera in a real implementation
    console.log('Opening camera');
  };
  
  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
      setShowVoiceInput(false);
    } else {
      startListening();
      setShowVoiceInput(true);
    }
  };
  
  // Get mode-specific button styling
  const getModeButtonStyle = () => {
    switch (activeMode) {
      case 'general':
        return 'bg-wakti-blue hover:bg-wakti-blue/90';
      case 'productivity':
        return 'bg-purple-600 hover:bg-purple-700';
      case 'student':
        return 'bg-green-600 hover:bg-green-700';
      case 'creative':
        return 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };

  return (
    <div className="p-3">
      <form onSubmit={handleSendMessage} className="space-y-2">
        <div className="relative">
          <Textarea
            placeholder={isListening ? "Listening..." : "Type a message..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className={cn(
              "min-h-10 pr-24 resize-none",
              isListening && "bg-pink-50"
            )}
            disabled={isLoading || isListening}
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {/* Camera button */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={handleCameraCapture}
              disabled={isLoading || isListening}
              className="h-8 w-8 rounded-full"
            >
              <Camera className="h-4 w-4" />
              <span className="sr-only">Take a photo</span>
            </Button>
            
            {/* File upload button */}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isListening}
              className="h-8 w-8 rounded-full"
            >
              <Paperclip className="h-4 w-4" />
              <span className="sr-only">Upload a file</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            
            {/* Voice input button */}
            {supportsVoice && (
              <Button
                type="button"
                size="icon"
                variant={isListening ? "destructive" : "ghost"}
                onClick={handleVoiceToggle}
                className="h-8 w-8 rounded-full"
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {isListening ? "Stop recording" : "Start recording"}
                </span>
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {showVoiceInput && isListening && (
              <span className="text-pink-600 font-medium animate-pulse">
                Listening... {transcript ? `"${transcript}"` : ""}
              </span>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || isLoading} 
            className={cn("px-4", getModeButtonStyle())}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Send className="h-4 w-4 mr-1" />
            )}
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
