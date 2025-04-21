
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Download, MapPin, File, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDateTime } from '@/utils/dateUtils';

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

// Simple duration formatter: seconds -> MM:SS
function formatDuration(durationSeconds: number): string {
  if (isNaN(durationSeconds)) return '';
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// TomTom static map image for preview (center on given text string, fallback to marker on text location)
const getTomTomMapThumbnailUrl = (location: string) => {
  const encodedLocation = encodeURIComponent(location);
  // Note: center is location string; this may not be as accurate as coordinates, but typical for simple preview
  return `https://api.tomtom.com/map/1/staticimage?key=${import.meta.env.VITE_TOMTOM_API_KEY || ''}&center=${encodedLocation}&zoom=14&width=320&height=120&format=png&layer=basic&style=main&markers=color:red%7C${encodedLocation}`;
};

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
    const titleMatch = meeting.summary.match(/Meeting Title:\s*([^\n]+)/i) || 
                      meeting.summary.match(/Title:\s*([^\n]+)/i) ||
                      meeting.summary.match(/^# ([^\n]+)/m) ||
                      meeting.summary.match(/^## ([^\n]+)/m);
    return titleMatch ? titleMatch[1].trim() : 'Untitled Meeting';
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
              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-2 mb-1">
                <span>
                  <span className="font-medium">Created:</span>{' '}
                  {formatDateTime(meeting.date)}
                </span>
                {typeof meeting.duration === 'number' && meeting.duration > 0 && (
                  <>
                    <span className="mx-1">•</span>
                    <span>
                      <span className="font-medium">Duration:</span>{' '}
                      {formatDuration(meeting.duration)}
                    </span>
                  </>
                )}
              </div>
              {meeting.location && (
                <div className="flex items-center text-xs text-gray-500 mt-1 gap-2">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="truncate max-w-[250px]">{meeting.location}</span>
                </div>
              )}
              {/* Map preview, if location */}
              {meeting.location && import.meta.env.VITE_TOMTOM_API_KEY && (
                <div className="mt-2 w-full md:max-w-xs rounded overflow-hidden border border-green-200 shadow-sm bg-white cursor-pointer"
                  onClick={e => {
                    e.stopPropagation();
                    window.open(`https://www.tomtom.com/en_gb/maps/search/${encodeURIComponent(meeting.location)}/`, '_blank');
                  }}
                  title="View location on TomTom Maps"
                  style={{ maxWidth: 360 }}
                >
                  <div className="flex items-center bg-green-50 px-2 py-1 gap-2 border-b border-green-100">
                    <Map className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 text-xs font-semibold">Map Preview</span>
                  </div>
                  <img
                    src={getTomTomMapThumbnailUrl(meeting.location)}
                    alt="Map preview"
                    style={{
                      width: "100%",
                      height: "80px",
                      objectFit: "cover",
                      transition: "transform 0.2s"
                    }}
                    className="hover:scale-105"
                  />
                </div>
              )}
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
