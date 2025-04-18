
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown, Download, Clock, Trash2, Pencil } from 'lucide-react';
import { SavedMeeting } from '@/hooks/ai/useMeetingSummary';
import { toast } from '@/components/ui/use-toast';
import { formatDuration } from '@/utils/text/transcriptionUtils';
import { exportMeetingSummaryAsPDF } from './MeetingSummaryExporter';
import { MeetingContext } from '@/utils/text/transcriptionUtils';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface SavedMeetingsListProps {
  savedMeetings: SavedMeeting[];
  isLoadingHistory: boolean;
  onDeleteMeeting: (id: string) => Promise<void>;
  onEditMeetingTitle: (id: string, title: string) => Promise<void>;
  onDownloadAudio?: (id: string) => Promise<void>;
}

const SavedMeetingsList: React.FC<SavedMeetingsListProps> = ({
  savedMeetings,
  isLoadingHistory,
  onDeleteMeeting,
  onEditMeetingTitle,
  onDownloadAudio
}) => {
  const [actionInProgress, setActionInProgress] = useState<{
    id: string;
    type: 'pdf' | 'audio' | 'delete' | 'edit';
  } | null>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState<string | null>(null);
  
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const handleExportPDF = async (meeting: SavedMeeting) => {
    try {
      setActionInProgress({ id: meeting.id, type: 'pdf' });
      
      // Create a proper MeetingContext object if location exists
      const meetingContext: MeetingContext | null = meeting.location 
        ? { 
            location: meeting.location,
            title: meeting.title
          } 
        : meeting.title 
        ? { title: meeting.title }
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
      
      if (onDownloadAudio) {
        await onDownloadAudio(meeting.id);
      } else {
        throw new Error("Audio download not implemented");
      }
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
  
  const handleDeleteClick = (meetingId: string) => {
    setMeetingToDelete(meetingId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (meetingToDelete) {
      try {
        setActionInProgress({ id: meetingToDelete, type: 'delete' });
        await onDeleteMeeting(meetingToDelete);
        toast({
          title: "Meeting Deleted",
          description: "The meeting has been deleted successfully.",
        });
      } catch (err) {
        console.error("Error deleting meeting:", err);
        toast({
          title: "Delete Error",
          description: "Failed to delete the meeting.",
          variant: "destructive"
        });
      } finally {
        setActionInProgress(null);
        setMeetingToDelete(null);
        setDeleteDialogOpen(false);
      }
    }
  };
  
  const startEditingTitle = (meeting: SavedMeeting) => {
    setEditingMeetingId(meeting.id);
    setEditedTitle(meeting.title || '');
  };
  
  const saveEditedTitle = async (meetingId: string) => {
    try {
      setActionInProgress({ id: meetingId, type: 'edit' });
      await onEditMeetingTitle(meetingId, editedTitle);
      toast({
        title: "Title Updated",
        description: "The meeting title has been updated.",
      });
    } catch (err) {
      console.error("Error updating title:", err);
      toast({
        title: "Update Error",
        description: "Failed to update the meeting title.",
        variant: "destructive"
      });
    } finally {
      setActionInProgress(null);
      setEditingMeetingId(null);
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
              {editingMeetingId === meeting.id ? (
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveEditedTitle(meeting.id)}
                  onBlur={() => saveEditedTitle(meeting.id)}
                  autoFocus
                  className="border rounded px-2 py-1 text-sm font-medium w-full max-w-[70%] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter meeting title"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm">{meeting.title || "Untitled Meeting"}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => startEditingTitle(meeting)}
                    disabled={actionInProgress !== null}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
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
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => handleDeleteClick(meeting.id)}
                  disabled={actionInProgress !== null}
                >
                  {actionInProgress?.id === meeting.id && actionInProgress?.type === 'delete' ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Confirmation Dialog for Delete */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Meeting"
        description="Are you sure you want to delete this meeting? This action cannot be undone."
        onConfirm={confirmDelete}
        isLoading={actionInProgress?.type === 'delete'}
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </Card>
  );
};

export default SavedMeetingsList;
