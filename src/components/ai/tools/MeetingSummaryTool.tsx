
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoiceInteraction } from '@/hooks/ai/useVoiceInteraction';
import { AlertCircle, FileText, Mic, MicOff, Save } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import RecordingControls from './meeting-summary/RecordingControls';
import { TranscriptionPanel } from './meeting-summary/TranscriptionPanel';
import { SummaryDisplay } from './meeting-summary/SummaryDisplay';
import { Separator } from '@/components/ui/separator';
import { SavedMeetingsList } from './meeting-summary/SavedMeetingsList';

export const MeetingSummaryTool = () => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening,
    error,
    isProcessing,
    apiKeyStatus,
    apiKeyErrorDetails
  } = useVoiceInteraction();

  const [summary, setSummary] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [actionItems, setActionItems] = useState<string[]>([]);
  const [savedMeetings, setSavedMeetings] = useState<any[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [recordingError, setRecordingError] = useState<string | null>(null);
  
  useEffect(() => {
    let timer: number | null = null;
    if (isListening) {
      timer = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isListening]);
  
  // For demo purposes only, this would typically be saved to a database
  const saveMeeting = () => {
    if (!transcript) return;
    
    const meeting = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title: `Meeting ${savedMeetings.length + 1}`,
      transcript,
      summary,
      keyPoints,
      actionItems
    };
    
    setSavedMeetings([...savedMeetings, meeting]);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Meeting Summary Generator
          </CardTitle>
          <CardDescription>
            Record your meeting and get an AI-generated summary with key points and action items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKeyStatus === "invalid" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>OpenAI API Key Invalid</AlertTitle>
              <AlertDescription>
                {apiKeyErrorDetails || "Your OpenAI API key is invalid or not configured properly. Please check your settings."}
              </AlertDescription>
            </Alert>
          )}
          
          <RecordingControls 
            isRecording={isListening}
            recordingTime={recordingTime}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            startRecording={startListening}
            stopRecording={stopListening}
            recordingError={recordingError}
          />
          
          <TranscriptionPanel 
            transcript={transcript} 
            isProcessing={isProcessing}
          />
          
          {transcript && !isListening && (
            <>
              <Separator />
              <SummaryDisplay 
                summary={summary || "Your meeting summary will appear here once generated."}
                keyPoints={keyPoints}
                actionItems={actionItems}
              />
            </>
          )}
        </CardContent>
        {transcript && !isListening && (
          <CardFooter className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                // For demo purposes - in a real app this would clear the state
                // and reset the recording
              }}
            >
              New Recording
            </Button>
            <Button onClick={saveMeeting}>
              <Save className="h-4 w-4 mr-2" />
              Save Meeting Notes
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {savedMeetings.length > 0 && (
        <SavedMeetingsList meetings={savedMeetings} />
      )}
    </div>
  );
};
