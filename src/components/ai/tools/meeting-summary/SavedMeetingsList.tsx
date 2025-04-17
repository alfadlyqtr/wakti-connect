
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown, Download, Clock } from 'lucide-react';
import { SavedMeeting } from '@/hooks/ai/useMeetingSummary';
import { toast } from '@/components/ui/use-toast';
import { formatDuration } from '@/utils/text/transcriptionUtils';
import { exportMeetingSummaryAsPDF } from './MeetingSummaryExporter';
import { MeetingContext } from '@/utils/text/transcriptionUtils';

interface SavedMeetingsListProps {
  savedMeetings: SavedMeeting[];
  isLoadingHistory: boolean;
}

const SavedMeetingsList: React.FC<SavedMeetingsListProps> = ({
  savedMeetings,
  isLoadingHistory
}) => {
  const [actionInProgress, setActionInProgress] = React.useState<{
    id: string;
    type: 'pdf' | 'audio';
  } | null>(null);

  const handleExportPDF = async (meeting: SavedMeeting) => {
    try {
      setActionInProgress({ id: meeting.id, type: 'pdf' });
      
      // Create a proper MeetingContext object if location exists
      const meetingContext: MeetingContext | null = meeting.location 
        ? { location: meeting.location } 
        : null;
        
      await exportMeetingSummaryAsPDF(
        meeting.summary,
        meeting.duration,
        meetingContext
      );
      
      toast({
        title: "PDF Exported",
        description: "Your meeting summary PDF has been downloaded.",
      });
    } catch (err) {
      console.error("Error exporting PDF:", err);
      toast({
        title: "Export Error",
        description: "There was a problem exporting the PDF.",
        variant: "destructive"
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleDownloadAudio = async (meeting: SavedMeeting) => {
    try {
      setActionInProgress({ id: meeting.id, type: 'audio' });
      
      if (!meeting.audioData) {
        throw new Error("Audio data not available");
      }
      
      // Create a link to download the audio - converting string to Blob
      const binaryAudio = atob(meeting.audioData);
      const bytes = new Uint8Array(binaryAudio.length);
      for (let i = 0; i < binaryAudio.length; i++) {
        bytes[i] = binaryAudio.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/webm' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(audioBlob);
      link.download = `meeting-recording-${new Date(meeting.date).toISOString().slice(0, 10)}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your audio recording is being downloaded.",
      });
    } catch (err) {
      console.error("Error downloading audio:", err);
      toast({
        title: "Download Error",
        description: err instanceof Error ? err.message : "Failed to download audio recording.",
        variant: "destructive"
      });
    } finally {
      setActionInProgress(null);
    }
  };

  if (isLoadingHistory) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (savedMeetings.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Meetings</h3>
      <div className="space-y-3">
        {savedMeetings.map((meeting) => (
          <div 
            key={meeting.id}
            className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800"
          >
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-medium text-sm">{meeting.title}</h4>
              <span className="text-xs text-muted-foreground">
                {new Date(meeting.date).toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
              <Clock className="h-3 w-3" />
              <span>Duration: {formatDuration(meeting.duration)}</span>
              {meeting.location && (
                <span className="ml-2">• Location: {meeting.location}</span>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm line-clamp-1 max-w-[70%]">
                {meeting.summary.split('\n')[0]}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => handleExportPDF(meeting)}
                  disabled={actionInProgress !== null}
                >
                  {actionInProgress?.id === meeting.id && actionInProgress?.type === 'pdf' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <FileDown className="h-3 w-3" />
                  )}
                  <span className="ml-1 text-xs">PDF</span>
                </Button>
                
                {meeting.audioData && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 px-2"
                    onClick={() => handleDownloadAudio(meeting)}
                    disabled={actionInProgress !== null}
                  >
                    {actionInProgress?.id === meeting.id && actionInProgress?.type === 'audio' ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Download className="h-3 w-3" />
                    )}
                    <span className="ml-1 text-xs">Audio</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SavedMeetingsList;
