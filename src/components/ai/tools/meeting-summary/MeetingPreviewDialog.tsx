import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { motion } from 'framer-motion';
import SummaryDisplay from './SummaryDisplay';
import { supabase } from "@/integrations/supabase/client";
import { playTextWithVoiceRSS, stopCurrentAudio, pauseCurrentAudio, resumeCurrentAudio, restartCurrentAudio, getVoiceSettings } from '@/utils/voiceRSS';
import { VoiceControls } from './components/VoiceControls';
import { DialogHeader as CustomDialogHeader } from './components/DialogHeader';
import { ActionButtons } from './components/ActionButtons';
import { toast } from 'sonner';

interface MeetingPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: {
    title?: string;
    summary: string;
    date: string;
    duration?: number;
    audioUrl?: string;
    has_audio?: boolean;
    audioStoragePath?: string;
    detectedLocation?: string | null;
    detectedAttendees?: string[] | null;
  };
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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<string>('John');
  const [locationName, setLocationName] = useState<string | null>(null);

  useEffect(() => {
    if (meeting?.detectedLocation) {
      fetchLocationName(meeting.detectedLocation);
    }
  }, [meeting?.detectedLocation]);

  React.useEffect(() => {
    if (!isOpen) {
      handleStopSummary();
    }
  }, [isOpen]);

  const fetchLocationName = async (location: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('tomtom-geocode', {
        body: { query: location }
      });
      
      if (error || !data) {
        console.error('Error fetching location details:', error);
        setLocationName(location);
        return;
      }
      
      if (data.coordinates) {
        setLocationName(location);
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
      setLocationName(location);
    }
  };

  const extractTitleFromSummary = (summary: string) => {
    const titleMatch = summary.match(/Meeting Title:\s*([^\n]+)/i) || 
                      summary.match(/Title:\s*([^\n]+)/i) ||
                      summary.match(/^# ([^\n]+)/m) ||
                      summary.match(/^## ([^\n]+)/m);
    return titleMatch ? titleMatch[1].trim() : 'Untitled Meeting';
  };

  const handlePlaySummary = async () => {
    try {
      if (isPaused) {
        resumeCurrentAudio();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }

      setIsLoading(true);
      stopCurrentAudio();

      // Get voice settings based on text content
      const { language, voice } = getVoiceSettings(meeting.summary);

      // If language is Arabic, show a simple toast
      if (language === 'ar-sa') {
        toast.info('Arabic Text-to-Speech Coming Soon');
        setIsLoading(false);
        return;
      }
      
      const audio = await playTextWithVoiceRSS({
        text: meeting.summary,
        language,
        voice,
      });

      setIsPlaying(true);
      setIsPaused(false);
      setIsLoading(false);

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

    } catch (error) {
      console.error('Failed to play summary:', error);
      toast.error('Failed to play summary. Please try again.');
      setIsPlaying(false);
      setIsPaused(false);
      setIsLoading(false);
    }
  };

  const handlePauseSummary = () => {
    pauseCurrentAudio();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleRestartSummary = () => {
    restartCurrentAudio();
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStopSummary = () => {
    stopCurrentAudio();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!meeting) {
    return null;
  }

  const displayTitle = meeting.title || extractTitleFromSummary(meeting.summary);
  const location = locationName || meeting.detectedLocation;
  const hasAudio = meeting?.has_audio || !!meeting?.audioUrl || !!meeting?.audioStoragePath;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <CustomDialogHeader title={displayTitle} location={location} />
        </DialogHeader>

        <div className="space-y-4">
          <motion.div 
            className="flex justify-end gap-2 flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <VoiceControls
              isPlaying={isPlaying}
              isPaused={isPaused}
              isLoading={isLoading}
              onPlay={handlePlaySummary}
              onPause={handlePauseSummary}
              onRestart={handleRestartSummary}
              onStop={handleStopSummary}
            />

            <ActionButtons
              onCopy={onCopy}
              onExportPDF={onExportPDF}
              onDownloadAudio={onDownloadAudio}
              isExporting={isExporting}
              isDownloadingAudio={isDownloadingAudio}
              hasAudio={hasAudio}
            />
          </motion.div>

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
