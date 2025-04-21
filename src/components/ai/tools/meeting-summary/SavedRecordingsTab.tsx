
import React, { useState } from 'react';
import { useMeetingSummaryV2 } from '@/hooks/ai/meeting-summary/useMeetingSummaryV2';
import SavedMeetingsList from './SavedMeetingsList';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { toast } from 'sonner';
import MeetingPreviewDialog from './MeetingPreviewDialog';
import { exportMeetingSummaryAsPDF } from './MeetingSummaryExporter';
import { motion } from 'framer-motion';
import { differenceInDays } from 'date-fns';

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
      // Ensure meetings have valid dates
      const processedMeetings = loadedMeetings.map(meeting => ({
        ...meeting,
        date: meeting.date || new Date().toISOString() // Provide fallback if date is missing
      }));
      
      // Add console logs to debug data
      console.log("Loaded meetings data:", processedMeetings);
      setMeetings(processedMeetings);
    } catch (error) {
      console.error('Error loading meetings:', error);
      toast.error('Failed to load saved recordings');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await deleteMeeting(id);
      if (success) {
        setMeetings(meetings.filter(meeting => meeting.id !== id));
        if (selectedMeeting?.id === id) {
          setIsPreviewOpen(false);
        }
        toast.success('Recording deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error('Failed to delete recording');
    }
  };

  const handleDownload = async (meeting: any) => {
    setIsDownloadingAudio(true);
    try {
      if (!meeting.audioUrl && !meeting.audioStoragePath) {
        throw new Error('No audio available');
      }
      
      const audioUrl = meeting.audioUrl || meeting.audioStoragePath;
      const response = await fetch(audioUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Extract title from summary for better filename
      const titleMatch = meeting.summary.match(/Meeting Title:\s*([^\n]+)/i) || 
                       meeting.summary.match(/Title:\s*([^\n]+)/i) ||
                       meeting.summary.match(/^# ([^\n]+)/m) ||
                       meeting.summary.match(/^## ([^\n]+)/m);
                       
      const safeTitle = titleMatch 
        ? titleMatch[1].trim().replace(/[^a-z0-9]/gi, '_').toLowerCase()
        : 'recording';
        
      const filename = `${safeTitle}_${new Date(meeting.date).toISOString().split('T')[0]}.webm`;
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
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
    if (!meeting) return;
    
    // Process meeting data to ensure it has all required properties
    const enhancedMeeting = {
      ...meeting,
      date: meeting.date || new Date().toISOString(), // Ensure date exists
      detectedLocation: meeting.location || meeting.detectedLocation || null,
      detectedAttendees: meeting.attendees || meeting.detectedAttendees || extractAttendeesFromSummary(meeting.summary),
      has_audio: meeting.has_audio || !!meeting.audioUrl || !!meeting.audioStoragePath
    };
    
    setSelectedMeeting(enhancedMeeting);
    setIsPreviewOpen(true);
  };

  const extractAttendeesFromSummary = (summary: string): string[] | null => {
    if (!summary) return null;
    
    const attendeesMatch = summary.match(/Attendees:([^#]*?)(?=##|$)/i);
    if (!attendeesMatch) return null;
    
    const attendeesList = attendeesMatch[1]
      .split('\n')
      .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
      .map(line => line.trim().replace(/^[-*]\s*/, ''))
      .filter(Boolean);
      
    return attendeesList.length > 0 ? attendeesList : null;
  };

  const handleExportPDF = async () => {
    if (!selectedMeeting?.summary) {
      toast.error("No summary to export");
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Calculate duration - if it's a number, use it directly
      const duration = typeof selectedMeeting.duration === 'number' 
        ? selectedMeeting.duration 
        : 0;
      
      await exportMeetingSummaryAsPDF(
        selectedMeeting.summary,
        duration,
        selectedMeeting.location || selectedMeeting.detectedLocation || null,
        selectedMeeting.attendees || selectedMeeting.detectedAttendees || extractAttendeesFromSummary(selectedMeeting.summary),
        {
          title: selectedMeeting.title || extractTitleFromSummary(selectedMeeting.summary) || 'Meeting Summary',
          companyLogo: '/lovable-uploads/9b7d0693-89eb-4cc5-b90b-7834bfabda0e.png'
        }
      );
      
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const extractTitleFromSummary = (summary: string): string => {
    if (!summary) return '';
    
    const titleMatch = summary.match(/Meeting Title:\s*([^\n]+)/i) || 
                       summary.match(/Title:\s*([^\n]+)/i) ||
                       summary.match(/^# ([^\n]+)/m) ||
                       summary.match(/^## ([^\n]+)/m);
                       
    return titleMatch ? titleMatch[1].trim() : '';
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
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <div>
          <h2 className="text-xl font-semibold">Previous Recordings</h2>
          <div className="text-xs text-muted-foreground mt-1">
            <span>All previous recordings are available for 10 days from creation and then deleted.</span>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadMeetings}
          disabled={isLoadingHistory}
          className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 hover:border-blue-300 hover:from-blue-100 hover:to-purple-100"
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
    </motion.div>
  );
};

export default SavedRecordingsTab;
