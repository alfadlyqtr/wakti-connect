import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mic, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import RecordingControls from './meeting-summary/RecordingControls';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SendToTaskButton from './meeting-summary/SendToTaskButton';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';
import { useToast } from '@/components/ui/use-toast';

interface MeetingSummaryToolProps {
  onUseSummary: (prompt: string) => void;
}

export const MeetingSummaryTool: React.FC<MeetingSummaryToolProps> = ({ onUseSummary }) => {
  const [activeTab, setActiveTab] = useState('record');
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const { toast } = useToast();
  
  const handleStartRecording = () => {
    setIsRecording(true);
    setTranscription('');
    setSummary('');
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
  };
  
  const handleTranscriptionUpdate = (text) => {
    setTranscription(text);
  };
  
  const handleGenerateSummary = async () => {
    setIsLoading(true);
    
    // Simulate generating a summary
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSummary('This is a sample meeting summary generated from the transcription.');
    setIsLoading(false);
    
    toast({
      title: "Summary Generated",
      description: "A brief summary of the meeting has been generated.",
    });
  };
  
  const handleSaveMeeting = () => {
    const newMeeting = {
      id: Date.now(),
      title: `Meeting ${savedMeetings.length + 1}`,
      transcription: transcription,
      summary: summary,
    };
    
    setSavedMeetings([...savedMeetings, newMeeting]);
    toast({
      title: "Meeting Saved",
      description: "The meeting has been saved to your list.",
    });
  };
  
  const handleLoadMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setTranscription(meeting.transcription);
    setSummary(meeting.summary);
    setActiveTab('display');
    toast({
      title: "Meeting Loaded",
      description: "The selected meeting has been loaded.",
    });
  };
  
  const handleUseSummary = () => {
    if (summary.trim()) {
      onUseSummary(summary);
    } else {
      toast({
        title: "No Summary",
        description: "Please generate a summary before using it.",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    // Load saved meetings from local storage or database here
    // For now, we'll use a dummy array
    setSavedMeetings([
      {
        id: 1,
        title: "Sample Meeting 1",
        transcription: "This is a sample transcription for the first meeting.",
        summary: "A brief summary of the first meeting.",
      },
      {
        id: 2,
        title: "Sample Meeting 2",
        transcription: "This is a sample transcription for the second meeting.",
        summary: "A brief summary of the second meeting.",
      },
    ]);
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-wakti-blue" />
          Meeting Summary
        </CardTitle>
        <CardDescription>Record, transcribe, and summarize your meetings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="record" disabled={isRecording}>
              <Mic className="mr-2 h-4 w-4" />
              Record
            </TabsTrigger>
            <TabsTrigger value="transcribe">
              <FileText className="mr-2 h-4 w-4" />
              Transcribe
            </TabsTrigger>
            <TabsTrigger value="display">
              <CheckCircle className="mr-2 h-4 w-4" />
              Summary
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="space-y-4">
            <RecordingControls
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onTranscriptionUpdate={handleTranscriptionUpdate}
            />
          </TabsContent>
          
          <TabsContent value="transcribe" className="space-y-4">
            <TranscriptionPanel
              transcription={transcription}
              onGenerateSummary={handleGenerateSummary}
              isLoading={isLoading}
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveMeeting} disabled={!transcription}>
                Save Meeting
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="display" className="space-y-4">
            <SummaryDisplay summary={summary} isLoading={isLoading} />
            <div className="flex justify-between">
              <Button variant="secondary" onClick={() => setActiveTab('transcribe')}>
                <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
                Edit Transcription
              </Button>
              <Button onClick={handleUseSummary} disabled={!summary}>
                Use Summary
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <SavedMeetingsList meetings={savedMeetings} onLoadMeeting={handleLoadMeeting} />
      </CardContent>
    </Card>
  );
};

export default MeetingSummaryTool;
