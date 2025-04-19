
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, PlayCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptionPanelProps {
  transcribedText: string;
  isSummarizing: boolean;
  isProcessing: boolean;
  generateSummary: () => Promise<void>;
  onViewSummary?: () => Promise<void>;
  onStartNewMeeting?: () => void;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcribedText,
  isSummarizing,
  isProcessing,
  generateSummary,
  onViewSummary,
  onStartNewMeeting
}) => {
  if (!transcribedText && !isProcessing) {
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
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-8"
          >
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Processing recording...</p>
          </motion.div>
        ) : (
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
        )}
      </AnimatePresence>
    </Card>
  );
};

export default TranscriptionPanel;
