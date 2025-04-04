
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, SendHorizonal, Loader2, Camera, FileIcon, Upload, Volume2, VolumeX, Cog, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { VoiceSelector } from "../settings/VoiceSelector";
import { useVoiceSettings } from "@/store/voiceSettings";

interface MessageInputFormProps {
  inputMessage: string;
  setInputMessage: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  canAccess: boolean;
  isListening?: boolean;
  onStartListening?: () => void;
  onStopListening?: () => void;
  recognitionSupported?: boolean;
  voiceToVoiceEnabled?: boolean;
  onToggleVoiceToVoice?: (enabled: boolean) => void;
  onFileUpload?: (file: File) => Promise<void>;
  onCameraCapture?: () => Promise<void>;
  isSpeaking?: boolean;
  onEnterVoiceMode?: () => void;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  isLoading,
  canAccess,
  isListening = false,
  onStartListening,
  onStopListening,
  recognitionSupported = false,
  voiceToVoiceEnabled = false,
  onToggleVoiceToVoice,
  onFileUpload,
  onCameraCapture,
  isSpeaking = false,
  onEnterVoiceMode
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { voice, updateVoice, autoSilenceDetection, toggleAutoSilenceDetection } = useVoiceSettings();
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onFileUpload) {
      await onFileUpload(files[0]);
      // Reset file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className={cn(
      "flex flex-col mt-auto p-3 border-t border-border/50 bg-card transition-all",
      isFocused ? "bg-background" : ""
    )}>
      <div className="flex items-center justify-between mb-2">
        {/* Voice conversation button */}
        {recognitionSupported && onEnterVoiceMode && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2 bg-gradient-to-r from-indigo-100 to-purple-100"
            onClick={onEnterVoiceMode}
            disabled={!canAccess}
          >
            <Headphones className="h-3.5 w-3.5 mr-1 text-purple-600" />
            <span className="text-xs text-purple-700">Voice Conversation</span>
          </Button>
        )}
        
        {/* Voice conversation toggle (deprecated but kept for backward compatibility) */}
        {recognitionSupported && onToggleVoiceToVoice && !onEnterVoiceMode && (
          <div className="flex items-center space-x-2">
            <Switch 
              checked={voiceToVoiceEnabled}
              onCheckedChange={(checked) => {
                console.log("Voice toggle changed to:", checked);
                onToggleVoiceToVoice(checked);
              }}
              className="data-[state=checked]:bg-green-500"
            />
            <span className="text-xs text-muted-foreground">
              {voiceToVoiceEnabled ? (
                <span className="flex items-center">
                  <Volume2 className="h-3 w-3 mr-1 text-green-500" />
                  Voice conversation
                </span>
              ) : (
                <span className="flex items-center">
                  <VolumeX className="h-3 w-3 mr-1" />
                  Voice conversation
                </span>
              )}
            </span>
          </div>
        )}
        
        {/* Voice settings popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 px-2 ml-auto">
              <Cog className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Voice Settings</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Voice Settings</h4>
              
              <VoiceSelector 
                selectedVoice={voice} 
                onVoiceChange={updateVoice} 
                compact={true}
              />
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="silence-detection"
                  checked={autoSilenceDetection}
                  onCheckedChange={toggleAutoSilenceDetection}
                />
                <label htmlFor="silence-detection" className="text-sm cursor-pointer">
                  Auto silence detection
                </label>
              </div>
              
              <p className="text-xs text-muted-foreground">
                With silence detection enabled, the system will automatically stop listening when you pause speaking.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      <form 
        onSubmit={handleSendMessage}
        className="flex items-end gap-2"
      >
        <Textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={canAccess ? "Type your message..." : "Upgrade to access AI assistant"}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="min-h-[50px] max-h-[200px] p-3 focus-visible:ring-wakti-blue border-muted-foreground/20"
          rows={1}
          disabled={isLoading || !canAccess || isListening || (voiceToVoiceEnabled && (isListening || isSpeaking))}
        />
        
        <div className="flex items-center gap-1">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
          
          {/* File upload button */}
          {onFileUpload && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || !canAccess || isListening || isSpeaking}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Camera button */}
          {onCameraCapture && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="rounded-full"
                    onClick={onCameraCapture}
                    disabled={isLoading || !canAccess || isListening || isSpeaking}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Take photo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Mic button */}
          {recognitionSupported && onStartListening && onStopListening && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? "destructive" : "outline"}
                    className={cn(
                      "rounded-full transition-all",
                      isListening && "animate-pulse"
                    )}
                    onClick={isListening ? onStopListening : onStartListening}
                    disabled={isLoading || !canAccess || isSpeaking}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isListening ? <p>Stop listening</p> : <p>Start listening</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {/* Send button */}
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-wakti-blue hover:bg-wakti-blue/90"
            disabled={isLoading || !inputMessage.trim() || !canAccess || isListening || isSpeaking}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
