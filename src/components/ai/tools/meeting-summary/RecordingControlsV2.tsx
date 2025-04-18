
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, AlertCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { formatRecordingDuration, calculateRecordingProgress } from '@/utils/audio/recordingUtils';

interface RecordingControlsV2Props {
  isRecording: boolean;
  recordingTime: number;
  selectedLanguage: string;
  autoSilenceDetection: boolean;
  visualFeedback: boolean;
  silenceThreshold: number;
  startRecording: () => void;
  stopRecording: () => void;
  startNextPart: () => void;
  setSelectedLanguage: (language: string) => void;
  toggleAutoSilenceDetection: () => void;
  toggleVisualFeedback: () => void;
  setSilenceThreshold: (value: number) => void;
  recordingError: string | null;
  maxRecordingDuration: number;
  warnBeforeEndSeconds: number;
}

export default function RecordingControlsV2({
  isRecording,
  recordingTime,
  selectedLanguage,
  autoSilenceDetection,
  visualFeedback,
  silenceThreshold,
  startRecording,
  stopRecording,
  startNextPart,
  setSelectedLanguage,
  toggleAutoSilenceDetection,
  toggleVisualFeedback,
  setSilenceThreshold,
  recordingError,
  maxRecordingDuration,
  warnBeforeEndSeconds
}: RecordingControlsV2Props) {
  const [isNextPartDialogOpen, setIsNextPartDialogOpen] = useState(false);
  
  const progressPercentage = calculateRecordingProgress(recordingTime, maxRecordingDuration);
  const formattedTime = formatRecordingDuration(recordingTime);
  const formattedMaxTime = formatRecordingDuration(maxRecordingDuration);
  
  // Show warning if approaching max duration
  const isApproachingLimit = maxRecordingDuration - recordingTime <= warnBeforeEndSeconds;
  
  return (
    <div className="space-y-4">
      {recordingError && (
        <div className="bg-destructive/10 text-destructive flex items-start p-3 rounded-md gap-2">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Recording Error</p>
            <p className="text-sm mt-1">{recordingError}</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex justify-between text-sm">
            <span className={isApproachingLimit ? "text-red-500 font-medium" : ""}>
              {formattedTime}
            </span>
            <span>{formattedMaxTime}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${isApproachingLimit ? "bg-red-200 dark:bg-red-950" : ""}`}
            indicatorClassName={isApproachingLimit ? "bg-red-500" : undefined}
          />
          {isApproachingLimit && (
            <p className="text-xs text-red-500">
              Approaching time limit. Consider starting part 2.
            </p>
          )}
        </div>
        
        <div className="flex gap-2">
          {isRecording ? (
            <>
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Stop Recording
              </Button>
              
              <Button
                onClick={() => setIsNextPartDialogOpen(true)}
                variant="outline"
                className="whitespace-nowrap"
              >
                Start Part 2
              </Button>
            </>
          ) : (
            <Button
              onClick={startRecording}
              variant="default"
              className="gap-2"
            >
              <Mic className="h-4 w-4" />
              Start Recording
            </Button>
          )}
        </div>
      </div>
      
      {!isRecording && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="language">Transcription Language</Label>
            <Select 
              value={selectedLanguage} 
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="ru">Russian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-silence-detection">
                Auto-stop on silence
              </Label>
              <Switch
                id="auto-silence-detection"
                checked={autoSilenceDetection}
                onCheckedChange={toggleAutoSilenceDetection}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="visual-feedback">
                Audio visualization
              </Label>
              <Switch
                id="visual-feedback"
                checked={visualFeedback}
                onCheckedChange={toggleVisualFeedback}
              />
            </div>
            
            {autoSilenceDetection && (
              <div className="pt-2">
                <Label 
                  htmlFor="silence-threshold" 
                  className="flex justify-between text-sm"
                >
                  <span>Silence sensitivity</span>
                  <span>{silenceThreshold}dB</span>
                </Label>
                <Slider
                  id="silence-threshold"
                  min={-60}
                  max={-30}
                  step={1}
                  value={[silenceThreshold]}
                  onValueChange={(value) => setSilenceThreshold(value[0])}
                  className="py-4"
                />
              </div>
            )}
          </div>
        </div>
      )}
      
      <AlertDialog 
        open={isNextPartDialogOpen} 
        onOpenChange={setIsNextPartDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start new recording part?</AlertDialogTitle>
            <AlertDialogDescription>
              This will save your current recording and start a new part. All parts will be combined into a single meeting summary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              setIsNextPartDialogOpen(false);
              stopRecording();
              setTimeout(() => {
                startNextPart();
              }, 1000);
            }}>
              Start Part 2
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
