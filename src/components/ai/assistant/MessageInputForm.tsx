
import React from 'react';
import { Mic, Send, AlertCircle, Paperclip, Camera, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { AIAssistantUpgradeCard } from '../AIAssistantUpgradeCard';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useWaktiAIBrowserSpeech } from "@/hooks/ai/useWaktiAIBrowserSpeech";

interface MessageInputFormProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  showSuggestions?: boolean;
  onPromptClick?: (prompt: string) => void;
  onFileUpload?: (file: File) => void;
  onCameraCapture?: () => void;
  onStartVoiceInput?: () => void;
  onStopVoiceInput?: () => void;
  isListening?: boolean;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  showSuggestions,
  onPromptClick,
  onFileUpload,
  onCameraCapture,
  onStartVoiceInput,
  onStopVoiceInput,
  isListening = false
}) => {
  const isMobile = useIsMobile();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Replace all other voice interaction for WAKTI AI with only the browser mic logic
  const {
    isListening: browserIsListening,
    transcript: browserTranscript,
    supportsVoice: browserSupportsVoice,
    startListening: browserStartListening,
    stopListening: browserStopListening
  } = useWaktiAIBrowserSpeech((text) => {
    if (text) {
      const updatedText =
        inputMessage +
        (inputMessage && !inputMessage.endsWith(" ") && !text.startsWith(" ") ? " " : "") +
        text;
      setInputMessage(updatedText);
    }
  });

  // Use the transcript directly from browser if needed (might be unnecessary due to callback above)
  React.useEffect(() => {
    if (browserTranscript) {
      const updatedText =
        inputMessage +
        (inputMessage && !inputMessage.endsWith(" ") && !browserTranscript.startsWith(" ") ? " " : "") +
        browserTranscript;
      setInputMessage(updatedText);
    }
    // eslint-disable-next-line
  }, [browserTranscript]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onFileUpload) return;
    
    onFileUpload(files[0]);
    e.target.value = ''; // Reset the input
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!canAccess) {
    return <AIAssistantUpgradeCard compact={true} />;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
      e.preventDefault();
      if (inputMessage.trim() && !isLoading) {
        handleSendMessage(e);
      }
    }
  };

  const handleVoiceClick = () => {
    if (browserIsListening) {
      browserStopListening();
    } else {
      browserStartListening();
    }
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        if (inputMessage.trim() && !isLoading) {
          handleSendMessage(e);
        }
      }}
      className="border-t p-3 sm:p-4"
    >
      <div className="flex flex-col gap-3">
        <div className="relative w-full">
          <Textarea
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isMobile) {
                e.preventDefault();
                if (inputMessage.trim() && !isLoading) {
                  handleSendMessage(e as unknown as React.FormEvent);
                }
              }
            }}
            className={cn(
              "min-h-[60px] sm:min-h-[80px] max-h-[150px] sm:max-h-[200px] resize-none py-3 px-4 text-sm md:text-base",
              browserIsListening && "bg-primary/5 border-primary/20"
            )}
            disabled={isLoading || browserIsListening}
          />
          <div className="absolute bottom-3 right-3 flex gap-1.5">
            {browserSupportsVoice && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 sm:h-9 sm:w-9 rounded-full",
                  browserIsListening && "bg-primary text-white hover:bg-primary hover:text-white"
                )}
                onClick={handleVoiceClick}
                disabled={isLoading}
              >
                {browserIsListening ? (
                  <MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span className="sr-only">{browserIsListening ? "Stop recording" : "Start recording"}</span>
              </Button>
            )}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* File Upload */}
            {onFileUpload && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">Attach file</span>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0 || !onFileUpload) return;
                    onFileUpload(files[0]);
                    e.target.value = "";
                  }}
                  accept=".pdf,.doc,.docx,.txt,.md"
                />
              </>
            )}
            {/* Camera */}
            {onCameraCapture && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full"
                onClick={onCameraCapture}
                disabled={isLoading}
              >
                <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Take photo</span>
              </Button>
            )}
          </div>
          <Button
            type="submit"
            size="default"
            disabled={!inputMessage.trim() || isLoading}
            className="h-9 px-4 sm:h-10 sm:px-5 rounded-full w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-primary border-opacity-50 border-t-primary rounded-full mr-1" />
            ) : (
              <Send className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
            )}
            <span>Send</span>
          </Button>
        </div>
      </div>
      {isMobile && (
        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Tap send button to submit your message
        </p>
      )}
      {!isMobile && (
        <p className="text-xs text-muted-foreground mt-2 hidden sm:flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Press Enter to send, Shift+Enter for new line
        </p>
      )}
    </form>
  );
};

export default MessageInputForm;
