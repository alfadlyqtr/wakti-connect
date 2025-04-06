
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

interface TranscriptionPanelProps {
  transcribedText: string;
  isSummarizing: boolean;
  generateSummary: () => Promise<void>;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcribedText,
  isSummarizing,
  generateSummary
}) => {
  const { t } = useTranslation();

  if (!transcribedText) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">{t('ai.tools.meeting.transcribedText')}</h3>
      <Textarea
        value={transcribedText}
        readOnly
        className="w-full h-40 mb-3"
      />
      <Button 
        onClick={generateSummary}
        disabled={isSummarizing || !transcribedText}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {isSummarizing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('ai.tools.meeting.generatingSummary')}
          </>
        ) : (
          t('ai.tools.meeting.generateSummary')
        )}
      </Button>
    </Card>
  );
};

export default TranscriptionPanel;
