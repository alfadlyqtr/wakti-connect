
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voice: string) => void;
  label?: string;
  disabled?: boolean;
}

export function VoiceSelector({
  selectedVoice,
  onVoiceChange,
  label = 'Select Voice',
  disabled = false
}: VoiceSelectorProps) {
  // Since we're removing text-to-speech functionality, this component is simplified
  // It can still be used as a placeholder in the UI
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select
        value={selectedVoice}
        onValueChange={onVoiceChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Default voice" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Text-to-speech functionality has been disabled
      </p>
    </div>
  );
}
