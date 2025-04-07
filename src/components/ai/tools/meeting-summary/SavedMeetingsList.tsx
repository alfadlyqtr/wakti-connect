
import React from 'react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatTime } from '@/utils/audio/audioProcessing';
import { Loader2 } from 'lucide-react';

interface SavedMeeting {
  id: string;
  date: string;
  duration: number;
  location: string | null;
  summary: string;
}

interface SavedMeetingsListProps {
  savedMeetings: SavedMeeting[];
  isLoadingHistory: boolean;
}

const SavedMeetingsList: React.FC<SavedMeetingsListProps> = ({
  savedMeetings,
  isLoadingHistory,
}) => {
  if (isLoadingHistory) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>Loading meeting history...</p>
      </div>
    );
  }

  if (savedMeetings.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">
        No saved meetings found. Record and summarize a meeting to see it here.
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">Recent Meeting Summaries</h3>
      <Accordion type="single" collapsible className="w-full">
        {savedMeetings.map((meeting) => {
          const meetingDate = new Date(meeting.date).toLocaleDateString();
          return (
            <AccordionItem key={meeting.id} value={meeting.id}>
              <AccordionTrigger className="text-left">
                <div>
                  <p className="font-medium">{meetingDate}</p>
                  <p className="text-sm text-gray-500">
                    Duration: {formatTime(meeting.duration)}
                    {meeting.location && ` • Location: ${meeting.location}`}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div 
                  className="prose dark:prose-invert max-w-none text-sm"
                  dangerouslySetInnerHTML={{ 
                    __html: meeting.summary.replace(/\n/g, '<br />') 
                  }} 
                />
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Card>
  );
};

export default SavedMeetingsList;
