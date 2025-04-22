
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, Square, AlertCircle, Languages } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { formatRecordingDuration, calculateRecordingProgress } from '@/utils/audio/recordingUtils';

interface RecordingControlsV2Props {
  isRecording: boolean;
  recordingTime: number;
  selectedLanguage: string;
  startRecording: () => void;
  stopRecording: () => void;
  startNextPart: () => void;
  setSelectedLanguage: (language: string) => void;
  recordingError: string | null;
  maxRecordingDuration: number;
  warnBeforeEndSeconds: number;
}

export default function RecordingControlsV2({
  isRecording,
  recordingTime,
  selectedLanguage,
  startRecording,
  stopRecording,
  startNextPart,
  setSelectedLanguage,
  recordingError,
  maxRecordingDuration,
  warnBeforeEndSeconds
}: RecordingControlsV2Props) {
  const [isNextPartDialogOpen, setIsNextPartDialogOpen] = useState(false);
  
  const progressPercentage = calculateRecordingProgress(recordingTime, maxRecordingDuration);
  const formattedTime = formatRecordingDuration(recordingTime);
  const formattedMaxTime = formatRecordingDuration(maxRecordingDuration);
  
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
                Continue Recording
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
        <div className="flex items-center gap-4 pt-2">
          <div className="flex-1">
            <Label htmlFor="language" className="flex items-center gap-1 mb-2">
              <Languages className="h-4 w-4" /> Language
            </Label>
            <Select 
              value={selectedLanguage} 
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger id="language" className="h-10 bg-white border-wakti-navy/20">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">Arabic</SelectItem>
                <SelectItem value="mixed">Mixed (English & Arabic)</SelectItem>
              </SelectContent>
            </Select>
            
            {selectedLanguage === 'ar' && (
              <p className="text-xs text-muted-foreground mt-1">
                <span lang="ar" dir="rtl" className="block">
                  سيتم التعرف على النص باللغة العربية
                </span>
              </p>
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
            <AlertDialogTitle>Continue recording?</AlertDialogTitle>
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
              Continue Recording
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
