
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VoiceTranscriptionControl } from '@/components/ai/voice/VoiceTranscriptionControl';
import { formatDuration } from '@/utils/text/transcriptionUtils';
import { AlertCircle } from 'lucide-react';

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
    <div className="bg-gray-50 dark:bg-gray-800/50 border rounded-lg p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <VoiceTranscriptionControl
            isRecording={isRecording}
            isProcessing={false}
            startRecording={startRecording}
            stopRecording={stopRecording}
            size="md"
          />
          
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {isRecording ? 'Recording lecture...' : 'Ready to record'}
            </span>
            {isRecording && (
              <span className="text-xs text-muted-foreground">
                Duration: {formatDuration(recordingTime)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            disabled={isRecording}
          >
            <SelectTrigger className="h-9 w-full sm:w-[120px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {recordingError && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-start text-red-800 dark:text-red-200">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{recordingError}</p>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
