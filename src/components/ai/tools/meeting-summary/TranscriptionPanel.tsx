
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TranscriptionPanelProps {
  transcribedText: string;
  isSummarizing: boolean;
  generateSummary: () => Promise<void>;
  onViewSummary?: () => Promise<void>;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcribedText,
  isSummarizing,
  generateSummary,
  onViewSummary
}) => {
  if (!transcribedText) {
    return null;
  }

  return (
    <Card className="p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2">Transcribed Text</h3>
      <Textarea
        value={transcribedText}
        readOnly
        className="w-full h-40 mb-3"
      />
      <div className="flex gap-2">
        <Button 
          onClick={generateSummary}
          disabled={isSummarizing || !transcribedText}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSummarizing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Summary...
            </>
          ) : (
            "Generate Summary"
          )}
        </Button>
        
        {onViewSummary && transcribedText && !isSummarizing && (
          <Button 
            onClick={onViewSummary}
            variant="outline"
          >
            View Summary
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TranscriptionPanel;
