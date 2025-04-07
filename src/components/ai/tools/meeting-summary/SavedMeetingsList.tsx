
import React from 'react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatTime } from '@/utils/audio/audioProcessing';
import { Loader2 } from 'lucide-react';
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  if (isLoadingHistory) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <p>{t("meetingTools.loadingHistory")}</p>
      </div>
    );
  }

  if (savedMeetings.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">
        {t("meetingTools.noMeetings")}
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">{t("meetingTools.recentSummaries")}</h3>
      <Accordion type="single" collapsible className="w-full">
        {savedMeetings.map((meeting) => {
          const meetingDate = new Date(meeting.date).toLocaleDateString();
          return (
            <AccordionItem key={meeting.id} value={meeting.id}>
              <AccordionTrigger className="text-left">
                <div>
                  <p className="font-medium">{meetingDate}</p>
                  <p className="text-sm text-gray-500">
                    {t("meetingTools.duration")} {formatTime(meeting.duration)}
                    {meeting.location && ` • ${t("meetingTools.location")} ${meeting.location}`}
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
