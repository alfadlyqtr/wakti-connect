
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Loader2 } from 'lucide-react';

interface TranscriptionPanelProps {
  transcribedText: string;
  isSummarizing: boolean;
  generateSummary: () => void;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcribedText,
  isSummarizing,
  generateSummary
}) => {
  return (
    <>
      {transcribedText && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Lecture Transcription</h3>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={generateSummary}
              disabled={isSummarizing || !transcribedText}
            >
              {isSummarizing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating Notes...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Notes</span>
                </>
              )}
            </Button>
          </div>
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardContent className="p-0">
              <ScrollArea className="h-[100px] w-full rounded-md">
                <div className="p-3 text-sm whitespace-pre-wrap">
                  {transcribedText}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default TranscriptionPanel;
