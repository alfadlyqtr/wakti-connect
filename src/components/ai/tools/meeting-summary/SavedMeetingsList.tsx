import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface SavedMeeting {
  id: string;
  title: string;
  summary: string;
  date: string;
  duration: number;
  audioUrl?: string;
  audioStoragePath?: string;
}

interface SavedMeetingsListProps {
  savedMeetings: SavedMeeting[];
  isLoadingHistory: boolean;
  onDelete?: (id: string) => void;
  onSelect?: (meeting: SavedMeeting) => void;
  onDownload?: (meeting: SavedMeeting) => void;
}

const SavedMeetingsList: React.FC<SavedMeetingsListProps> = ({
  savedMeetings,
  isLoadingHistory,
  onDelete,
  onSelect,
  onDownload
}) => {
  if (isLoadingHistory) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full inline-block mr-2"></div>
        <span>Loading saved meetings...</span>
      </div>
    );
  }

  if (savedMeetings.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Saved Meetings</h3>
      <div className="space-y-3">
        {savedMeetings.map((meeting) => (
          <div 
            key={meeting.id} 
            className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex-1 cursor-pointer" onClick={() => onSelect && onSelect(meeting)}>
              <h4 className="font-medium">{meeting.title || 'Untitled Meeting'}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDistanceToNow(new Date(meeting.date), { addSuffix: true })}</span>
                <span className="mx-1">•</span>
                <span>{Math.floor(meeting.duration / 60)}:{(meeting.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {(meeting.audioUrl || meeting.audioStoragePath) && onDownload && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDownload(meeting)}
                  title="Download audio"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(meeting.id)}
                  title="Delete meeting"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMeetingsList;
