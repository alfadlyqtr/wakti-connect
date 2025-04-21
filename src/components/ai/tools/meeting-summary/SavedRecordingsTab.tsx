
import React, { useState } from 'react';
import { useMeetingSummaryV2 } from '@/hooks/ai/meeting-summary/useMeetingSummaryV2';
import SavedMeetingsList from './SavedMeetingsList';
import { Button } from '@/components/ui/button';
import { FileDown, Trash2 } from 'lucide-react'; // Added Trash2 import for the icon
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
      const processedMeetings = loadedMeetings.map(meeting => ({
        ...meeting,
        date: meeting.date
      }));
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
    const enhancedMeeting = {
      ...meeting,
      date: meeting.date,
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

  // Improved formatting to show both date and time more clearly
  const formatDateWithTime = (isoString: string | undefined) => {
    if (!isoString) return "No date";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid date";

    // Use differenceInDays to highlight "today" or relative days if desired
    const now = new Date();
    const daysDiff = differenceInDays(now, date);

    if (daysDiff === 0) {
      return `Today • ${date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    } else if (daysDiff === 1) {
      return `Yesterday • ${date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    return (
      date.toLocaleDateString(undefined, { 
        year: "numeric",
        month: "short",
        day: "numeric"
      }) +
      " • " +
      date.toLocaleTimeString(undefined, { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: true,
      })
    );
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
            <span>All previous recordings include their actual creation date &amp; time.</span>
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

      <div className="space-y-3">
        {meetings.length === 0 && !isLoadingHistory && (
          <div className="py-6 text-center text-muted-foreground">
            No recorded meetings found.
          </div>
        )}
        {meetings.map(meeting => (
          <motion.div
            key={meeting.id}
            className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.01 }}
          >
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => handlePreview(meeting)}
            >
              <h4 className="font-medium text-blue-700">{meeting.title || "Untitled Meeting"}</h4>
              <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-2 mb-1">
                <span>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDateWithTime(meeting.date)}
                </span>
                {typeof meeting.duration === "number" && meeting.duration > 0 && (
                  <>
                    <span className="mx-1">•</span>
                    <span>
                      <span className="font-medium">Duration:</span>{" "}
                      {Math.floor(meeting.duration / 60)} min {meeting.duration % 60}s
                    </span>
                  </>
                )}
              </div>
              {meeting.location && (
                <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                  <span className="truncate max-w-[250px]">{meeting.location}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-blue-600"
                onClick={() => handlePreview(meeting)}
              >
                <span className="text-xs">View</span>
              </Button>
              {meeting.has_audio && (meeting.audioUrl || meeting.audioStoragePath) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(meeting)}
                  title="Download audio"
                  className="h-8 px-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                  disabled={isDownloadingAudio}
                >
                  <FileDown className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Audio</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(meeting.id)}
                title="Delete meeting"
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

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

