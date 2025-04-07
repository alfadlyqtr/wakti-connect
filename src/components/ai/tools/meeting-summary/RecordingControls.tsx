
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '@/utils/audio/audioProcessing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  // Language options for speech recognition
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية (Arabic)' }
  ];
  
  return (
    <div className="space-y-4">
      {/* Language selector */}
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium mb-1">
          Recognition Language:
        </label>
        <Select
          value={selectedLanguage}
          onValueChange={setSelectedLanguage}
          disabled={isRecording}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languageOptions.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Recording controls */}
      <div className="flex flex-col items-center justify-center space-y-2">
        {isRecording ? (
          <div className="flex flex-col items-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <MicOff className="h-8 w-8 text-white" />
            </motion.div>
            <div className="text-lg font-semibold">{formatTime(recordingTime)}</div>
            <Button
              variant="destructive"
              className="mt-2"
              onClick={stopRecording}
            >
              Stop Recording
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Button
              className="w-16 h-16 rounded-full flex items-center justify-center mb-2 bg-blue-600 hover:bg-blue-700"
              onClick={startRecording}
            >
              <Mic className="h-8 w-8" />
            </Button>
            <Button
              variant="outline"
              className="mt-2"
              onClick={startRecording}
            >
              Start Recording
            </Button>
          </div>
        )}
      </div>

      {/* Error display */}
      {recordingError && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mt-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <span className="text-sm">{recordingError}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
