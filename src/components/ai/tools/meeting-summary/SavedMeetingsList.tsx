
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Download, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';

export interface SavedMeeting {
  id: string;
  title: string;
  summary: string;
  date: string;
  duration: number;
  audioUrl?: string;
  audioStoragePath?: string;
  audio_expires_at?: string;
  has_audio?: boolean;
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

  const getAudioStatus = (meeting: SavedMeeting) => {
    if (!meeting.has_audio) return null;
    if (!meeting.audio_expires_at) return null;

    const expiresAt = new Date(meeting.audio_expires_at);
    const daysRemaining = differenceInDays(expiresAt, new Date());

    if (daysRemaining <= 0) return null;

    if (daysRemaining <= 2) {
      return (
        <div className="text-xs text-amber-500 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          <span>Expires in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</span>
        </div>
      );
    }

    return (
      <div className="text-xs text-muted-foreground">
        Audio available for {daysRemaining} days
      </div>
    );
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Saved Meetings</h3>
      <div className="space-y-3">
        {savedMeetings.map((meeting) => (
          <div 
            key={meeting.id} 
            className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div 
              className="flex-1 cursor-pointer" 
              onClick={() => onSelect && onSelect(meeting)}
            >
              <h4 className="font-medium">{meeting.title || 'Untitled Meeting'}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatDistanceToNow(new Date(meeting.date), { addSuffix: true })}</span>
                <span className="mx-1">•</span>
                <span>{Math.floor(meeting.duration / 60)}:{(meeting.duration % 60).toString().padStart(2, '0')}</span>
              </div>
              {getAudioStatus(meeting)}
            </div>
            
            <div className="flex items-center gap-2">
              {meeting.has_audio && (meeting.audioUrl || meeting.audioStoragePath) && onDownload && (
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
