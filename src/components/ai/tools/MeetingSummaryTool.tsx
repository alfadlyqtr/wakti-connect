
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mic, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import RecordingControls from './meeting-summary/RecordingControls';
import TranscriptionPanel from './meeting-summary/TranscriptionPanel';
import SummaryDisplay from './meeting-summary/SummaryDisplay';
import SavedMeetingsList from './meeting-summary/SavedMeetingsList';
import { useToast } from '@/components/ui/use-toast';

interface MeetingSummaryToolProps {
  onUseSummary: (prompt: string) => void;
}

export const MeetingSummaryTool: React.FC<MeetingSummaryToolProps> = ({ onUseSummary }) => {
  const [activeTab, setActiveTab] = useState('record');
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [savedMeetings, setSavedMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const [detectedLocation, setDetectedLocation] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const { toast } = useToast();
  
  // Timer for recording
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      setRecordingTime(0);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, recordingTime]);
  
  const startRecording = () => {
    setIsRecording(true);
    setTranscribedText('');
    setSummary('');
    setRecordingError(null);
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    // In a real implementation, this would trigger the transcription process
    // For now, we'll just simulate it
    setTranscribedText('This is a sample transcription of the meeting.');
    setActiveTab('transcribe');
  };
  
  const generateSummary = async () => {
    setIsSummarizing(true);
    
    // Simulate generating a summary
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setSummary('This is a sample meeting summary generated from the transcription.');
    setIsSummarizing(false);
    setActiveTab('display');
    
    toast({
      title: "Summary Generated",
      description: "A brief summary of the meeting has been generated.",
    });
  };
  
  const handleSaveMeeting = () => {
    const newMeeting = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: recordingTime,
      location: detectedLocation || 'Unknown location',
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
    setTranscribedText(meeting.transcription || '');
    setSummary(meeting.summary);
    setActiveTab('display');
    toast({
      title: "Meeting Loaded",
      description: "The selected meeting has been loaded.",
    });
  };
  
  const copySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const exportAsPDF = async () => {
    setIsExporting(true);
    // Simulate PDF export
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
    toast({
      title: "PDF Exported",
      description: "Meeting summary has been exported as PDF.",
    });
  };
  
  const downloadAudio = () => {
    setIsDownloadingAudio(true);
    // Simulate audio download
    setTimeout(() => {
      setIsDownloadingAudio(false);
      toast({
        title: "Audio Downloaded",
        description: "Meeting audio has been downloaded.",
      });
    }, 1000);
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
    setIsLoadingHistory(true);
    // Simulate loading
    setTimeout(() => {
      setSavedMeetings([
        {
          id: "1",
          date: new Date().toISOString(),
          duration: 300, // 5 minutes
          location: "Conference Room A",
          summary: "A brief summary of the first meeting.",
        },
        {
          id: "2",
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          duration: 600, // 10 minutes
          location: null,
          summary: "A brief summary of the second meeting.",
        },
      ]);
      setIsLoadingHistory(false);
    }, 1000);
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
              recordingTime={recordingTime}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              startRecording={startRecording}
              stopRecording={stopRecording}
              recordingError={recordingError}
            />
          </TabsContent>
          
          <TabsContent value="transcribe" className="space-y-4">
            <TranscriptionPanel
              transcribedText={transcribedText}
              isSummarizing={isSummarizing}
              generateSummary={generateSummary}
            />
            <div className="flex justify-end">
              <Button onClick={handleSaveMeeting} disabled={!transcribedText}>
                Save Meeting
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="display" className="space-y-4">
            <SummaryDisplay
              summary={summary}
              detectedLocation={detectedLocation}
              copied={copied}
              copySummary={copySummary}
              exportAsPDF={exportAsPDF}
              downloadAudio={downloadAudio}
              isExporting={isExporting}
              isDownloadingAudio={isDownloadingAudio}
              audioData={audioData}
              summaryRef={summaryRef}
            />
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
        
        <SavedMeetingsList
          savedMeetings={savedMeetings}
          isLoadingHistory={isLoadingHistory}
        />
      </CardContent>
    </Card>
  );
};

export default MeetingSummaryTool;
