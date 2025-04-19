
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptionPanelProps {
  transcribedText: string;
  isSummarizing: boolean;
  generateSummary: () => Promise<void>;
  onViewSummary?: () => Promise<void>;
  onStartNewMeeting?: () => void;
  isProcessing?: boolean;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcribedText,
  isSummarizing,
  generateSummary,
  onViewSummary,
  onStartNewMeeting,
  isProcessing
}) => {
  if (!transcribedText) {
    return (
      <Card className="p-6 mt-4 text-center">
        <PlayCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">
          Start recording to begin transcribing your meeting
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 mt-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <h3 className="text-lg font-semibold mb-2">Transcribed Text</h3>
        <Textarea
          value={transcribedText}
          readOnly
          className="w-full h-40 mb-3"
        />
        <div className="flex gap-2">
          <Button 
            onClick={generateSummary}
            disabled={isSummarizing || !transcribedText || isProcessing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSummarizing ? "Generating Summary..." : isProcessing ? "Processing..." : "Generate Summary"}
          </Button>
          
          {onViewSummary && transcribedText && !isSummarizing && !isProcessing && (
            <Button 
              onClick={onViewSummary}
              variant="outline"
            >
              View Summary
            </Button>
          )}
          
          {onStartNewMeeting && (
            <Button
              onClick={onStartNewMeeting}
              variant="outline"
              className="ml-auto"
            >
              Start New Meeting
            </Button>
          )}
        </div>
      </motion.div>
    </Card>
  );
};

export default TranscriptionPanel;
