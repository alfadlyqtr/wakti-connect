
import React, { useState } from 'react';
import { useMeetingSummaryV2 } from '@/hooks/ai/meeting-summary/useMeetingSummaryV2';
import SavedMeetingsList from './SavedMeetingsList';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import MeetingPreviewDialog from './MeetingPreviewDialog';

const SavedRecordingsTab = () => {
  const { loadSavedMeetings, deleteMeeting } = useMeetingSummaryV2();
  const [meetings, setMeetings] = React.useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = React.useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState(false);

  React.useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    setIsLoadingHistory(true);
    try {
      const loadedMeetings = await loadSavedMeetings();
      setMeetings(loadedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Failed to load saved recordings');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteMeeting(id);
    if (success) {
      setMeetings(meetings.filter(meeting => meeting.id !== id));
      if (selectedMeeting?.id === id) {
        setIsPreviewOpen(false);
      }
    }
  };

  const handleDownload = async (meeting: any) => {
    setIsDownloadingAudio(true);
    try {
      if (!meeting.audioUrl) {
        throw new Error('No audio available');
      }
      const response = await fetch(meeting.audioUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${meeting.title || 'recording'}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Audio downloaded successfully');
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast.error('Failed to download audio');
    } finally {
      setIsDownloadingAudio(false);
    }
  };

  const handlePreview = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsPreviewOpen(true);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    // Implementation would go here using the existing PDF export functionality
    setIsExporting(false);
  };

  const handleCopy = async () => {
    if (!selectedMeeting?.summary) return;
    
    try {
      await navigator.clipboard.writeText(selectedMeeting.summary);
      toast.success("Summary copied to clipboard");
    } catch (error) {
      console.error("Error copying text:", error);
      toast.error("Failed to copy. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Previous Recordings</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadMeetings}
          disabled={isLoadingHistory}
        >
          <FileDown className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <SavedMeetingsList
        savedMeetings={meetings}
        isLoadingHistory={isLoadingHistory}
        onDelete={handleDelete}
        onSelect={handlePreview}
        onDownload={handleDownload}
      />

      <MeetingPreviewDialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        meeting={selectedMeeting}
        onExportPDF={handleExportPDF}
        onCopy={handleCopy}
        onDownloadAudio={() => selectedMeeting && handleDownload(selectedMeeting)}
        isExporting={isExporting}
        isDownloadingAudio={isDownloadingAudio}
      />
    </div>
  );
};

export default SavedRecordingsTab;
