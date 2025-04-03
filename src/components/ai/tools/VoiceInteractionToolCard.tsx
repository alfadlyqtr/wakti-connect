
import React, { useState } from "react";
import { Mic, Volume2, VolumeX, Play, Square } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { useVoiceInteraction } from "@/hooks/ai/useVoiceInteraction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VoiceInteractionToolCardProps {
  onSpeechRecognized?: (text: string) => void;
}

export const VoiceInteractionToolCard: React.FC<VoiceInteractionToolCardProps> = ({ 
  onSpeechRecognized 
}) => {
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [sampleText, setSampleText] = useState("Hello, I'm your WAKTI AI assistant. How can I help you today?");
  const { 
    isListening, 
    isProcessing, 
    isSpeaking,
    supportsVoice, 
    startListening, 
    stopListening,
    speakText,
    stopSpeaking
  } = useVoiceInteraction();

  const handleStartListening = async () => {
    if (isListening) {
      const text = await stopListening();
      if (text && onSpeechRecognized) {
        onSpeechRecognized(text);
      }
    } else {
      startListening();
    }
  };

  const handlePlaySample = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakText(sampleText, { voice: selectedVoice });
    }
  };

  const voices = [
    { id: "alloy", name: "Alloy (Neutral)" },
    { id: "echo", name: "Echo (Male)" },
    { id: "fable", name: "Fable (Male)" },
    { id: "onyx", name: "Onyx (Male)" },
    { id: "nova", name: "Nova (Female)" },
    { id: "shimmer", name: "Shimmer (Female)" }
  ];

  return (
    <AIToolCard
      icon={Mic}
      title="Voice Interaction"
      description="Use your voice to interact with the AI assistant"
      iconColor="text-purple-500"
    >
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Voice Selection</label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {voices.map(voice => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handlePlaySample}
            disabled={isListening || isProcessing}
          >
            {isSpeaking ? (
              <>
                <Square className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Test Voice
              </>
            )}
          </Button>
          
          <Button 
            variant="default" 
            className={`flex-1 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
            onClick={handleStartListening}
            disabled={!supportsVoice || isProcessing}
          >
            {isListening ? (
              <>
                <VolumeX className="h-4 w-4 mr-2 animate-pulse" />
                Stop Listening
              </>
            ) : (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Start Listening'}
              </>
            )}
          </Button>
        </div>
        
        {!supportsVoice && (
          <p className="text-sm text-red-500">
            Voice recognition is not supported by your browser. Try using Chrome or Edge.
          </p>
        )}
      </div>
    </AIToolCard>
  );
};
