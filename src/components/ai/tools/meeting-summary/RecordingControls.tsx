
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '@/utils/audio/audioProcessing';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RecordingControlsProps {
  isRecording: boolean;
  recordingTime: number;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  autoSilenceDetection: boolean;
  toggleAutoSilenceDetection: () => void;
  visualFeedback: boolean;
  toggleVisualFeedback: () => void;
  silenceThreshold: number;
  setSilenceThreshold: (threshold: number) => void;
  startRecording: () => void;
  stopRecording: () => void;
  recordingError: string | null;
  maxRecordingDuration: number;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  recordingTime,
  selectedLanguage,
  setSelectedLanguage,
  autoSilenceDetection,
  toggleAutoSilenceDetection,
  visualFeedback,
  toggleVisualFeedback,
  silenceThreshold,
  setSilenceThreshold,
  startRecording,
  stopRecording,
  recordingError,
  maxRecordingDuration
}) => {
  // Language options for speech recognition
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية (Arabic)' },
    { value: 'auto', label: 'Auto-detect' }
  ];
  
  // Calculate progress percentage for recording time
  const recordingProgress = (recordingTime / maxRecordingDuration) * 100;
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="block text-sm font-medium">
            Recognition Language:
          </label>
          <Select
            value={selectedLanguage}
            onValueChange={setSelectedLanguage}
            disabled={isRecording}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Language" />
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
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={isRecording}
              className="flex items-center gap-1"
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">Recording Settings</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-silence">Auto silence detection</Label>
                <Switch 
                  id="auto-silence" 
                  checked={autoSilenceDetection} 
                  onCheckedChange={toggleAutoSilenceDetection}
                  disabled={isRecording} 
                />
              </div>
              
              {autoSilenceDetection && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="silence-threshold">Silence threshold</Label>
                    <span className="text-xs text-muted-foreground">{(silenceThreshold * 100).toFixed(0)}%</span>
                  </div>
                  <Slider 
                    id="silence-threshold"
                    min={0.01} 
                    max={0.2} 
                    step={0.01}
                    value={[silenceThreshold]} 
                    onValueChange={([value]) => setSilenceThreshold(value)}
                    disabled={isRecording} 
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower values mean more sensitivity to silence
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Label htmlFor="visual-feedback">Visual feedback</Label>
                <Switch 
                  id="visual-feedback" 
                  checked={visualFeedback} 
                  onCheckedChange={toggleVisualFeedback}
                  disabled={isRecording} 
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Recording controls */}
      <div className="flex flex-col items-center justify-center space-y-4">
        {isRecording ? (
          <div className="flex flex-col items-center w-full">
            <motion.div
              className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="text-white text-xl font-bold">{formatTime(recordingTime)}</div>
            </motion.div>
            
            {/* Recording progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2 mb-1 overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  recordingProgress > 80 ? 'bg-red-500' : 'bg-blue-600'
                }`} 
                style={{ width: `${recordingProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between w-full text-xs text-muted-foreground">
              <span>{formatTime(recordingTime)}</span>
              <span>{formatTime(maxRecordingDuration)}</span>
            </div>
            
            <Button
              variant="destructive"
              className="mt-4"
              onClick={stopRecording}
            >
              <MicOff className="h-5 w-5 mr-2" />
              Stop Recording
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Button
              className="w-20 h-20 rounded-full flex items-center justify-center mb-2 bg-blue-600 hover:bg-blue-700"
              onClick={startRecording}
            >
              <Mic className="h-10 w-10" />
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
