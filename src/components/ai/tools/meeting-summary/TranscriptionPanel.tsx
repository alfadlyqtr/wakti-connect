
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, CornerDownRight, Edit2, Volume2, Download } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { containsArabic } from '@/utils/audio/recordingUtils';

interface TranscriptionPanelProps {
  transcribedText: string;
  isSummarizing: boolean;
  isProcessing: boolean;
  generateSummary: () => void;
  onViewSummary: () => Promise<void>;
  onStartNewMeeting: () => void;
  onUpdateTranscript?: (text: string) => void;
  audioBlobs?: Blob[] | null;
  onDownloadAudio?: () => void;
}

const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  transcribedText,
  isSummarizing,
  isProcessing,
  generateSummary,
  onViewSummary,
  onStartNewMeeting,
  onUpdateTranscript,
  audioBlobs,
  onDownloadAudio
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(transcribedText);

  if (!transcribedText) {
    return null;
  }

  const handleSaveEdit = () => {
    if (onUpdateTranscript) {
      onUpdateTranscript(editedText);
    }
    setIsEditing(false);
  };

  // Check for bilingual content
  const hasBilingualContent = () => {
    const hasArabic = containsArabic(transcribedText);
    const hasEnglish = /[a-zA-Z]/.test(transcribedText);
    return hasArabic && hasEnglish;
  };

  // Determine text direction for paragraphs
  const getTextDirection = (text: string) => {
    return containsArabic(text) ? "rtl" : "ltr";
  };

  return (
    <Card className="bg-white border rounded-lg overflow-hidden">
      <div className="border-b p-4 flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Transcription
          {hasBilingualContent() && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Bilingual</span>
          )}
        </h3>
        
        <div className="flex gap-2">
          {audioBlobs && onDownloadAudio && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadAudio}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download Audio
            </Button>
          )}

          {!isSummarizing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              {isEditing && (
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                >
                  Save Changes
                </Button>
              )}
              {!isEditing && (
                <Button
                  onClick={generateSummary}
                  disabled={isSummarizing || isProcessing}
                >
                  Generate Summary
                </Button>
              )}
            </>
          ) : (
            <Button disabled className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </Button>
          )}
        </div>
      </div>
      
      <div className="p-4">
        {isEditing ? (
          <Textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="min-h-[250px] font-mono text-sm"
            dir="auto"
          />
        ) : (
          <div className="max-h-[250px] overflow-y-auto prose prose-sm max-w-none p-4 bg-gray-50 rounded-md">
            {transcribedText.split('\n\n').map((paragraph, idx) => {
              // Determine if this is a section header (Part X:)
              const isPartHeader = paragraph.startsWith('Part') || paragraph.startsWith('الجزء');
              
              return (
                <React.Fragment key={idx}>
                  {isPartHeader ? (
                    <motion.h4 
                      className="font-bold text-blue-600 mt-4 mb-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      dir={getTextDirection(paragraph)}
                    >
                      {paragraph}
                    </motion.h4>
                  ) : (
                    <motion.p
                      className="mb-3 last:mb-0"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      dir={getTextDirection(paragraph)}
                      style={{ 
                        textAlign: containsArabic(paragraph) ? 'right' : 'left',
                        fontFamily: containsArabic(paragraph) ? 'var(--font-arabic)' : 'inherit'
                      }}
                    >
                      <CornerDownRight className="h-3 w-3 inline mr-2 text-gray-400" />
                      {paragraph}
                    </motion.p>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
};

export default TranscriptionPanel;
