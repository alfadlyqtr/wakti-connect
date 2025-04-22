
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Play, Pause, RefreshCcw, StopCircle } from 'lucide-react';

interface VoiceControlsProps {
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  isPlaying: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onRestart: () => void;
  onStop: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  selectedVoice,
  setSelectedVoice,
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onRestart,
  onStop,
}) => {
  return (
    <>
      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select voice" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="John">John (EN)</SelectItem>
          <SelectItem value="Linda">Linda (EN)</SelectItem>
          <SelectItem value="Mike">Mike (EN)</SelectItem>
          <SelectItem value="Mary">Mary (EN)</SelectItem>
          <SelectItem value="Hareth">Hareth (AR)</SelectItem>
        </SelectContent>
      </Select>

      {!isPlaying && !isPaused && (
        <Button
          variant="outline"
          size="sm"
          onClick={onPlay}
          className="flex items-center gap-1"
        >
          <Volume2 className="h-4 w-4" />
          <span>Play Summary</span>
        </Button>
      )}

      {isPlaying && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Restart</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPause}
            className="flex items-center gap-1"
          >
            <Pause className="h-4 w-4" />
            <span>Pause</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="flex items-center gap-1"
          >
            <StopCircle className="h-4 w-4" />
            <span>Stop</span>
          </Button>
        </>
      )}

      {isPaused && (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={onRestart}
            className="flex items-center gap-1"
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Restart</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onPlay}
            className="flex items-center gap-1"
          >
            <Play className="h-4 w-4" />
            <span>Resume</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onStop}
            className="flex items-center gap-1"
          >
            <StopCircle className="h-4 w-4" />
            <span>Stop</span>
          </Button>
        </>
      )}
    </>
  );
};
