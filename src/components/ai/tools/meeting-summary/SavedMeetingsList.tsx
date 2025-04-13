
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export interface Meeting {
  id: string;
  title: string;
  date: string | Date;
  summary: string;
}

export interface SavedMeetingsListProps {
  meetings: Meeting[];
  onLoadMeeting: (meeting: Meeting) => void;
  onDeleteMeeting?: (id: string) => void;
}

const SavedMeetingsList: React.FC<SavedMeetingsListProps> = ({
  meetings,
  onLoadMeeting,
  onDeleteMeeting
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Saved Meetings</CardTitle>
      </CardHeader>
      <CardContent>
        {meetings.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No saved meetings</p>
            <p className="text-xs">Save meeting summaries to access them here</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="truncate flex-1">
                  <h4 className="font-medium text-sm truncate">{meeting.title}</h4>
                  <p className="text-xs text-muted-foreground flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(meeting.date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div className="flex gap-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onLoadMeeting(meeting)}
                    className="h-7 px-2"
                  >
                    Load
                  </Button>
                  {onDeleteMeeting && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteMeeting(meeting.id)}
                      className="h-7 w-7 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedMeetingsList;
