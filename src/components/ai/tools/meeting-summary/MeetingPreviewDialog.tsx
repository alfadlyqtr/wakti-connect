import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileDown, Copy, Download, Volume2, Pause, Play } from 'lucide-react';
import SummaryDisplay from './SummaryDisplay';
import { playTextWithVoiceRSS, pauseCurrentAudio, resumeCurrentAudio } from '@/utils/voiceRSS';

interface MeetingPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: {
    title: string;
    summary: string;
    date: string;
    duration: number;
    audioUrl?: string;
    detectedLocation?: string | null;
    detectedAttendees?: string[] | null;
  } | null;
  onExportPDF: () => Promise<void>;
  onCopy: () => void;
  onDownloadAudio: () => void;
  isExporting: boolean;
  isDownloadingAudio: boolean;
}

const MeetingPreviewDialog: React.FC<MeetingPreviewDialogProps> = ({
  isOpen,
  onClose,
  meeting,
  onExportPDF,
  onCopy,
  onDownloadAudio,
  isExporting,
  isDownloadingAudio,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (!meeting) return null;

  const handlePlaySummary = async () => {
    if (isPlaying) {
      pauseCurrentAudio();
      setIsPaused(true);
      setIsPlaying(false);
      return;
    }
    
    try {
      if (isPaused) {
        await resumeCurrentAudio();
      } else {
        const audio = await playTextWithVoiceRSS({ text: meeting.summary });
        audio.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };
      }
      setIsPlaying(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to play summary:', error);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{meeting.title || 'Untitled Meeting'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlaySummary}
              className="flex items-center gap-1"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              ) : isPaused ? (
                <>
                  <Play className="h-4 w-4" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4" />
                  <span>Play Summary</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onCopy}
              className="flex items-center gap-1"
            >
              <Copy className="h-4 w-4" />
              <span>Copy</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1"
            >
              <FileDown className="h-4 w-4" />
              <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
            </Button>
            
            {meeting.audioUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadAudio}
                disabled={isDownloadingAudio}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span>{isDownloadingAudio ? "Downloading..." : "Download Audio"}</span>
              </Button>
            )}
          </div>

          <div className="bg-white rounded-lg border">
            <SummaryDisplay
              summary={meeting.summary}
              detectedLocation={meeting.detectedLocation}
              detectedAttendees={meeting.detectedAttendees}
              copied={false}
              copySummary={onCopy}
              exportAsPDF={onExportPDF}
              downloadAudio={onDownloadAudio}
              isExporting={isExporting}
              isDownloadingAudio={isDownloadingAudio}
              audioData={null}
              summaryRef={null}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingPreviewDialog;
