import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Clock, Download, AlertTriangle, MapPin, File } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils';

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
  location?: string;
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

  // Extract real title from summary if no title was provided
  const getDisplayTitle = (meeting: SavedMeeting) => {
    if (meeting.title && meeting.title !== 'Untitled Meeting') {
      return meeting.title;
    }
    
    // Extract title from summary
    const titleMatch = meeting.summary.match(/Meeting Title:\s*([^\n]+)/i) || 
                      meeting.summary.match(/Title:\s*([^\n]+)/i) ||
                      meeting.summary.match(/^# ([^\n]+)/m) ||
                      meeting.summary.match(/^## ([^\n]+)/m);
                      
    return titleMatch ? titleMatch[1].trim() : 'Untitled Meeting';
  };

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

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Saved Meetings</h3>
      <div className="space-y-3">
        {savedMeetings.map((meeting, index) => (
          <motion.div 
            key={meeting.id} 
            className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors hover:shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.01 }}
          >
            <div 
              className="flex-1 cursor-pointer" 
              onClick={() => onSelect && onSelect(meeting)}
            >
              <h4 className="font-medium text-blue-700">{getDisplayTitle(meeting)}</h4>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatRelativeTime(new Date(meeting.date))}</span>
                <span className="mx-1">•</span>
                <span>{formatDuration(meeting.duration)}</span>
              </div>
              
              {meeting.location && (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[250px]">{meeting.location}</span>
                </div>
              )}
              
              {getAudioStatus(meeting)}
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-blue-600"
                onClick={() => onSelect && onSelect(meeting)}
              >
                <File className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">View</span>
              </Button>
              
              {meeting.has_audio && (meeting.audioUrl || meeting.audioStoragePath) && onDownload && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onDownload(meeting)}
                  title="Download audio"
                  className="h-8 px-2 bg-blue-50 text-blue-600 hover:bg-blue-100"
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Audio</span>
                </Button>
              )}
              
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onDelete(meeting.id)}
                  title="Delete meeting"
                  className="h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SavedMeetingsList;
