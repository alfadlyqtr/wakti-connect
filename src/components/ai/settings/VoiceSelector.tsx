
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  label?: string;
  className?: string;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
  label = "Voice",
  className = "",
}) => {
  const voices = [
    { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
    { id: 'echo', name: 'Echo', description: 'Mature and serious' },
    { id: 'fable', name: 'Fable', description: 'Engaging storyteller' },
    { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative' },
    { id: 'nova', name: 'Nova', description: 'Soft and friendly' },
    { id: 'shimmer', name: 'Shimmer', description: 'Clear and expressive' },
  ];
  
  return (
    <div className={className}>
      {label && <Label className="mb-2">{label}</Label>}
      <Select value={selectedVoice} onValueChange={onVoiceChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={voice.id} value={voice.id}>
              <div className="flex flex-col">
                <span>{voice.name}</span>
                <span className="text-xs text-muted-foreground">{voice.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
