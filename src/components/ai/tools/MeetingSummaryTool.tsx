
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Mic, FileText, Save, List, Play, Square, Book, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SendToTaskButton from './meeting-summary/SendToTaskButton';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';
import { Meeting } from './meeting-summary/SavedMeetingsList';

interface RecordingControlsProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  startRecording,
  stopRecording
}) => (
  <div className="flex items-center justify-center space-x-4 py-6">
    {isRecording ? (
      <Button 
        variant="destructive" 
        size="lg" 
        className="h-20 w-20 rounded-full flex flex-col items-center justify-center space-y-1"
        onClick={stopRecording}
      >
        <Square className="h-8 w-8" />
        <span className="text-xs font-normal">Stop</span>
      </Button>
    ) : (
      <Button
        variant="default"
        size="lg"
        className="h-20 w-20 rounded-full flex flex-col items-center justify-center space-y-1 bg-wakti-blue hover:bg-wakti-blue/90"
        onClick={startRecording}
      >
        <Mic className="h-8 w-8" />
        <span className="text-xs font-normal">Record</span>
      </Button>
    )}
  </div>
);

interface MeetingSummaryToolProps {
  onUseSummary: (prompt: string) => void;
}

export const MeetingSummaryTool: React.FC<MeetingSummaryToolProps> = ({ onUseSummary }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('record');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [savedMeetings, setSavedMeetings] = useState<Meeting[]>([]);
  
  const { toast } = useToast();
  
  const startRecording = () => {
    setIsRecording(true);
    // In a real implementation, this would start the audio recording
    toast({
      title: "Recording started",
      description: "Speak clearly for best transcription results"
    });
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // In a real implementation, this would stop recording and process audio
    toast({
      title: "Recording stopped",
      description: "Processing your audio to text"
    });
    
    // Simulate getting transcription after processing
    setTimeout(() => {
      // This is mock data - in a real app this would come from the audio processing
      setTranscription("This is a sample meeting transcription. In an actual implementation, this would be the result of processing your audio recording with a speech-to-text service. From here, you can generate a summary of the key points discussed in your meeting.");
    }, 1500);
  };
  
  const handleTranscriptionUpdate = (text: string) => {
    setTranscription(text);
  };
  
  const generateSummary = async () => {
    if (!transcription) return;
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would call an AI service to summarize
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate getting summary from AI
      setSummary("Meeting Summary:\n\n• Discussed project timeline for Q3\n• Agreed to reschedule the client meeting to next week\n• James will prepare the presentation\n• Sarah will update the database records\n• Next meeting scheduled for Friday");
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveMeeting = () => {
    if (!summary || !meetingTitle.trim()) {
      toast({
        title: "Cannot save",
        description: "Please provide a title and generate a summary first",
        variant: "destructive"
      });
      return;
    }
    
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      title: meetingTitle.trim(),
      date: new Date(),
      summary: summary
    };
    
    setSavedMeetings([newMeeting, ...savedMeetings]);
    
    toast({
      title: "Meeting saved",
      description: "Your meeting has been saved successfully"
    });
    
    // Reset for a new recording
    setTranscription('');
    setSummary('');
    setMeetingTitle('');
  };
  
  const handleLoadMeeting = (meeting: Meeting) => {
    setMeetingTitle(meeting.title);
    setTranscription(""); // We may not store the original transcription
    setSummary(meeting.summary);
    setActiveTab('summary');
  };
  
  const handleUseInChat = () => {
    if (summary) {
      onUseSummary(`Here's a meeting summary I'd like to discuss:\n\n${summary}`);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <FileText className="h-5 w-5 mr-2 text-wakti-blue" />
          Meeting Summarizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Meeting title"
          value={meetingTitle}
          onChange={(e) => setMeetingTitle(e.target.value)}
          className="mb-2"
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="record">
              <Mic className="h-4 w-4 mr-2" />
              Record
            </TabsTrigger>
            <TabsTrigger value="summary" disabled={!transcription && !summary}>
              <Book className="h-4 w-4 mr-2" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="saved">
              <List className="h-4 w-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="space-y-4 m-0">
            <RecordingControls 
              isRecording={isRecording} 
              startRecording={startRecording} 
              stopRecording={stopRecording} 
            />
            
            <TranscriptionPanel 
              transcription={transcription}
              onGenerateSummary={generateSummary}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="summary" className="space-y-4 m-0">
            <SummaryDisplay 
              summary={summary} 
              isLoading={isLoading} 
            />
            
            <div className="flex justify-between items-center">
              <SendToTaskButton summary={summary} />
              
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUseInChat}
                  disabled={!summary}
                >
                  Use in Chat
                </Button>
                
                <Button
                  size="sm"
                  onClick={saveMeeting}
                  disabled={!summary || !meetingTitle.trim()}
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="m-0">
            <SavedMeetingsList 
              meetings={savedMeetings}
              onLoadMeeting={handleLoadMeeting}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
