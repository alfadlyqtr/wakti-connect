
import React from 'react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { formatTime } from '@/utils/audio/audioProcessing';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SavedMeeting {
  id: string;
  date: string;
  duration: number;
  location: string | null;
  summary: string;
  language?: string;
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
        <p>{t('ai.tools.meeting.loadingHistory')}</p>
      </div>
    );
  }

  if (savedMeetings.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">
        {t('ai.tools.meeting.noSavedMeetings')}
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-3">{t('ai.tools.meeting.recentSummaries')}</h3>
      <Accordion type="single" collapsible className="w-full">
        {savedMeetings.map((meeting) => {
          const meetingDate = new Date(meeting.date).toLocaleDateString();
          // Detect if the summary is in Arabic
          const isArabicSummary = meeting.language === 'ar' || /[\u0600-\u06FF]/.test(meeting.summary);
          
          return (
            <AccordionItem key={meeting.id} value={meeting.id}>
              <AccordionTrigger className={`text-left ${isArabicSummary ? 'flex-row-reverse text-right' : ''}`}>
                <div className={isArabicSummary ? 'text-right' : 'text-left'}>
                  <p className="font-medium">{meetingDate}</p>
                  <p className="text-sm text-gray-500">
                    {t('ai.tools.meeting.duration')}: {formatTime(meeting.duration)}
                    {meeting.location && ` • ${t('ai.tools.meeting.location')}: ${meeting.location}`}
                  </p>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div 
                  className={`prose dark:prose-invert max-w-none text-sm ${isArabicSummary ? 'text-right' : ''}`}
                  dir={isArabicSummary ? 'rtl' : 'ltr'}
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
