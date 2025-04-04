
import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export type VoiceOption = {
  id: string;
  name: string;
  label: string;
  accent?: string;
  gender?: 'male' | 'female' | 'neutral';
};

// Voice options with different accents and genders
const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'alloy', name: 'Alloy', label: 'Alloy (Neutral)', gender: 'neutral' },
  { id: 'echo', name: 'Echo', label: 'Echo (Male)', gender: 'male' },
  { id: 'fable', name: 'Fable', label: 'Fable (Male)', gender: 'male' },
  { id: 'onyx', name: 'Onyx', label: 'Onyx (Male)', gender: 'male' },
  { id: 'nova', name: 'Nova', label: 'Nova (Female)', gender: 'female' },
  { id: 'shimmer', name: 'Shimmer', label: 'Shimmer (Female)', gender: 'female' },
];

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  showLabel?: boolean;
  compact?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
  showLabel = true,
  compact = false,
}) => {
  const { toast } = useToast();
  
  const handleChange = (value: string) => {
    onVoiceChange(value);
    
    const selectedOption = VOICE_OPTIONS.find(voice => voice.id === value);
    if (selectedOption) {
      toast({
        title: "Voice Changed",
        description: `AI will now speak with ${selectedOption.name} voice`,
      });
    }
  };
  
  return (
    <div className={`space-y-2 ${compact ? 'flex items-center gap-3' : ''}`}>
      {showLabel && (
        <Label htmlFor="voice-select" className={compact ? 'text-sm m-0' : ''}>
          AI Voice
        </Label>
      )}
      
      <Select value={selectedVoice} onValueChange={handleChange}>
        <SelectTrigger id="voice-select" className={compact ? 'h-8 text-xs' : ''}>
          <SelectValue placeholder="Select voice" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Standard Voices</SelectLabel>
            {VOICE_OPTIONS.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
