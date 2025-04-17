
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { SavedMeeting } from '@/hooks/ai/useMeetingSummary';

interface SavedMeetingsListProps {
  savedMeetings: SavedMeeting[];
  isLoadingHistory: boolean;
}

const SavedMeetingsList: React.FC<SavedMeetingsListProps> = ({
  savedMeetings,
  isLoadingHistory
}) => {
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
            <div className="text-xs text-muted-foreground mb-2">
              Duration: {Math.floor(meeting.duration / 60)}m {meeting.duration % 60}s
            </div>
            <div className="text-sm line-clamp-2">
              {meeting.summary}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SavedMeetingsList;
