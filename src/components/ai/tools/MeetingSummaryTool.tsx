
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import MeetingIntakeForm from './meeting-summary/MeetingIntakeForm';
import { MeetingIntakeDialog } from './meeting-summary/MeetingIntakeDialog';
import { IntakeData } from '@/hooks/ai/meeting-summary/types';

export const MeetingSummaryTool: React.FC = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<'record' | 'upload' | null>(null);
  
  const handleStartRecording = () => {
    setMode('record');
    setDialogOpen(true);
  };
  
  const handleUpload = () => {
    setMode('upload');
    setDialogOpen(true);
  };
  
  const handleSubmit = (data: IntakeData) => {
    console.log('Meeting data submitted:', data);
    setDialogOpen(false);
    // Process data
  };
  
  const handleSkip = () => {
    setDialogOpen(false);
  };
  
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={handleStartRecording}
              className="h-auto py-6 flex flex-col items-center justify-center"
            >
              <Mic className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Record Meeting</span>
              <span className="text-sm text-muted-foreground mt-1">
                Use your microphone to record a meeting
              </span>
            </Button>
            
            <Button 
              onClick={handleUpload}
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center"
            >
              <UploadCloud className="h-8 w-8 mb-2" />
              <span className="text-lg font-medium">Upload Audio/Text</span>
              <span className="text-sm text-muted-foreground mt-1">
                Upload an audio file or paste text
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <MeetingIntakeDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
      />
    </div>
  );
};
