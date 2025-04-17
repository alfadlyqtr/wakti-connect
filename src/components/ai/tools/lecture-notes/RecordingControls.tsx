
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Languages, AlertCircle } from 'lucide-react';
import { formatDuration } from '@/utils/text/transcriptionUtils';
import { VoiceRecordingVisualizer } from '@/components/ai/voice/VoiceRecordingVisualizer';

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
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Voice Recording</span>
            {isRecording && (
              <span className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={selectedLanguage} 
              onValueChange={setSelectedLanguage}
              disabled={isRecording}
            >
              <SelectTrigger className="h-8 w-[110px]">
                <Languages className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="h-8"
              size="sm"
            >
              {isRecording ? (
                <>
                  <MicOff className="h-3.5 w-3.5 mr-1.5" />
                  Stop Recording ({formatDuration(recordingTime)})
                </>
              ) : (
                <>
                  <Mic className="h-3.5 w-3.5 mr-1.5" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
        </div>
        
        {recordingError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-3 rounded-md mb-3 flex gap-2 items-center text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{recordingError}</span>
          </div>
        )}
        
        {isRecording && (
          <div className="h-24 flex items-center justify-center">
            <VoiceRecordingVisualizer isActive={isRecording} audioLevel={0.5} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordingControls;
