
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { AIVoiceVisualizer } from '../animation/AIVoiceVisualizer';

interface VoiceToTextToolProps {
  onTextCapture: (text: string) => void;
  autoSubmit?: boolean;
  compact?: boolean;
}

export const VoiceToTextTool: React.FC<VoiceToTextToolProps> = ({
  onTextCapture,
  autoSubmit = false,
  compact = false,
}) => {
  const [capturedText, setCapturedText] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    supportsVoice,
    isProcessing,
    error
  } = useVoiceInteraction({
    onTranscriptComplete: (text) => {
      if (text) {
        setCapturedText(text);
        if (autoSubmit) {
          onTextCapture(text);
        } else {
          setShowTranscript(true);
        }
      }
    }
  });
  
  const handleSubmitTranscript = () => {
    onTextCapture(capturedText);
    setCapturedText('');
    setShowTranscript(false);
  };
  
  const handleCancelTranscript = () => {
    setCapturedText('');
    setShowTranscript(false);
  };
  
  if (!supportsVoice) {
    return compact ? null : (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">
          Voice recognition is not supported in your browser.
        </p>
      </div>
    );
  }
  
  // Show a simplified button if in compact mode
  if (compact) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 h-8 w-8 rounded-full ${isListening ? 'bg-red-100 text-red-600' : ''}`}
        onClick={isListening ? stopListening : startListening}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
    );
  }
  
  return (
    <div className="space-y-3">
      {showTranscript ? (
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-md text-sm">
            {capturedText}
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1"
              onClick={handleSubmitTranscript}
            >
              Use Text
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCancelTranscript}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          {isListening && (
            <div className="min-h-[60px] flex items-center justify-center">
              <AIVoiceVisualizer isActive={true} audioLevel={50} />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="sm"
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isListening ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Voice Input
                </>
              )}
            </Button>
          </div>
          
          {isListening && (
            <div className="mt-2 text-sm text-center text-muted-foreground animate-pulse">
              Listening...
            </div>
          )}
          
          {transcript && isListening && (
            <div className="mt-2 text-sm text-muted-foreground p-2 bg-muted/50 rounded w-full">
              {transcript}
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-500 mt-2">
              Error: {error.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
