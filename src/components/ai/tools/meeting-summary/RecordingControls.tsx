
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VoiceButton } from '../../chat/VoiceButton';
import { formatDuration } from '@/utils/text/transcriptionUtils';

interface RecordingControlsProps {
  isRecording: boolean;
  recordingTime: number;
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  startRecording: () => void;
  stopRecording: () => void;
  recordingError: string | null;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  recordingTime,
  selectedLanguage,
  setSelectedLanguage,
  startRecording,
  stopRecording,
  recordingError
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <VoiceButton
            isListening={isRecording}
            onPress={() => isRecording ? stopRecording() : startRecording()}
            recordingDuration={recordingTime}
          />
          <span className="text-sm">
            {isRecording ? (
              <span className="text-red-500 font-medium">Recording: {formatDuration(recordingTime)}</span>
            ) : (
              "Click to start recording"
            )}
          </span>
        </div>
        
        <Select
          value={selectedLanguage}
          onValueChange={setSelectedLanguage}
          disabled={isRecording}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">Arabic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {recordingError && (
        <div className="text-destructive text-sm p-3 bg-destructive/10 rounded-md">
          {recordingError}
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
