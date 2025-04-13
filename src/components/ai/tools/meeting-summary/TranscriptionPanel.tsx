
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';

export interface TranscriptionPanelProps {
  transcription: string;
  onGenerateSummary: () => Promise<void>;
  isLoading: boolean;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcription,
  onGenerateSummary,
  isLoading
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6 space-y-4">
        <div className="relative">
          <h3 className="font-medium mb-2">Meeting Transcription</h3>
          <div className="bg-muted p-3 rounded-md max-h-[200px] overflow-y-auto text-sm whitespace-pre-wrap">
            {transcription ? transcription : "No transcription available. Record your meeting first."}
          </div>
        </div>
        
        <Button 
          onClick={onGenerateSummary} 
          disabled={!transcription || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Summary...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Summary
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TranscriptionPanel;
