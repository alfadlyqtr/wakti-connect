
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, StopCircle, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatDuration } from '@/utils/text/transcriptionUtils';

interface RecordingControlsProps {
  isRecording: boolean;
  recordingTime: number;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
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
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-1">Voice Recording</h3>
          <p className="text-sm text-muted-foreground">
            Record your meeting to generate an AI summary
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            disabled={isRecording}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
              <SelectItem value="auto">Auto-detect</SelectItem>
            </SelectContent>
          </Select>
          
          {isRecording ? (
            <Button 
              onClick={stopRecording} 
              variant="destructive"
              className="flex items-center gap-2"
            >
              <StopCircle className="h-4 w-4" />
              <span>Stop Recording</span>
              <span className="ml-1 font-mono">{formatDuration(recordingTime)}</span>
            </Button>
          ) : (
            <Button 
              onClick={startRecording} 
              variant="default"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Mic className="h-4 w-4" />
              <span>Start Recording</span>
            </Button>
          )}
        </div>
      </div>
      
      {recordingError && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive p-3 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <span>{recordingError}</span>
        </div>
      )}
      
      {isRecording && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-md flex items-center">
          <div className="mr-2 h-3 w-3 relative">
            <div className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-full h-full bg-red-500 rounded-full"></div>
          </div>
          <span className="text-red-700 dark:text-red-300 text-sm">
            Recording in progress...{' '}
            <span className="font-mono">{formatDuration(recordingTime)}</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
