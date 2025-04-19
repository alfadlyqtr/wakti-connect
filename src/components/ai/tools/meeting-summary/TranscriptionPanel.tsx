
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, CornerDownRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface TranscriptionPanelProps {
  transcribedText: string;
  isSummarizing: boolean;
  isProcessing: boolean;
  generateSummary: () => void;
  onViewSummary: () => Promise<void>;
  onStartNewMeeting: () => void;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcribedText,
  isSummarizing,
  isProcessing,
  generateSummary,
  onViewSummary,
  onStartNewMeeting
}) => {
  if (!transcribedText) {
    return null;
  }

  return (
    <Card className="bg-white border rounded-lg overflow-hidden">
      <div className="border-b p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Transcription
        </h3>
        
        <div className="flex gap-2">
          {!isSummarizing ? (
            <Button
              onClick={generateSummary}
              disabled={isSummarizing || isProcessing}
            >
              Generate Summary
            </Button>
          ) : (
            <Button disabled className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="max-h-[250px] overflow-y-auto prose prose-sm max-w-none p-4 bg-gray-50 rounded-md">
          {transcribedText.split('\n\n').map((paragraph, idx) => (
            <React.Fragment key={idx}>
              {paragraph.startsWith('Part') ? (
                <motion.h4 
                  className="font-bold text-blue-600 mt-4 mb-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  {paragraph}
                </motion.h4>
              ) : (
                <motion.p
                  className="mb-3 last:mb-0"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                >
                  <CornerDownRight className="h-3 w-3 inline mr-2 text-gray-400" />
                  {paragraph}
                </motion.p>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TranscriptionPanel;
