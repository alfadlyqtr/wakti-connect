
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { FileDown, Copy, Download, Volume2, Pause, RefreshCcw, StopCircle, Play, Map, ExternalLink } from 'lucide-react';
import SummaryDisplay from './SummaryDisplay';
import { generateTomTomMapsUrl } from '@/config/maps';
import { supabase } from "@/integrations/supabase/client";
import { motion } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils';
// Add TTS imports
import { getOrGenerateAudio } from '@/utils/ttsCache';

interface MeetingPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: {
    title: string;
    summary: string;
    date: string;
    duration: number;
    audioUrl?: string;
    has_audio?: boolean;
    audioStoragePath?: string;
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
  const [locationName, setLocationName] = useState<string | null>(null);

  // For local playback element control
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (meeting?.detectedLocation) {
      fetchLocationName(meeting.detectedLocation);
    }
  }, [meeting?.detectedLocation]);

  // Clean up audio when dialog closes
  useEffect(() => {
    if (!isOpen) {
      handleStopSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // --- AUDIO PLAYER LOGIC using new ttsCache.ts
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handlePlaySummary = async () => {
    try {
      if (isPaused && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }

      // If already playing something else, stop first
      handleStopSummary();

      // Request TTS audio via cache util (will select best provider)
      const { audioUrl } = await getOrGenerateAudio({
        text: meeting.summary,
        // You could use meeting.language/voice here if available
      });
      setAudioUrl(audioUrl);

      // Play the audio
      const audio = new window.Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      setIsPlaying(true);
      setIsPaused(false);

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      audio.onpause = () => {
        setIsPaused(true);
        setIsPlaying(false);
      };
      audio.onerror = (err) => {
        setIsPlaying(false);
        setIsPaused(false);
        console.error('Failed to play summary:', err);
      };

    } catch (error) {
      console.error('Failed to play summary:', error);
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const handlePauseSummary = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleRestartSummary = async () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    } else if (audioUrl) {
      // If nothing is loaded, play from the URL again
      const audio = new window.Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
    } else {
      // If not loaded yet, play as if fresh
      await handlePlaySummary();
    }
  };

  const handleStopSummary = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const openInMaps = () => {
    if (locationName) {
      window.open(generateTomTomMapsUrl(locationName), '_blank');
    }
  };

  if (!meeting) {
    return null;
  }

  const displayTitle = meeting.title || extractTitleFromSummary(meeting.summary);
  const location = locationName || meeting.detectedLocation;
  const showMapButton = location && location.length > 0;
  const hasAudio = meeting?.has_audio || !!meeting?.audioUrl || !!meeting?.audioStoragePath;

  const formattedDate = meeting ? formatRelativeTime(new Date(meeting.date)) : '';

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{displayTitle}</DialogTitle>
          {showMapButton && (
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Map className="h-3.5 w-3.5 mr-1 text-green-600" />
              <span className="mr-2">{location}</span>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-green-600 flex items-center gap-1"
                onClick={openInMaps}
              >
                <span className="text-xs">View on Map</span>
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-4">
          <motion.div 
            className="flex justify-end gap-2 flex-wrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Audio controls using new TTS logic */}
            {!isPlaying && !isPaused && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlaySummary}
                className="flex items-center gap-1"
              >
                <Volume2 className="h-4 w-4" />
                <span>Play Summary</span>
              </Button>
            )}

            {isPlaying && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestartSummary}
                  className="flex items-center gap-1"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Restart</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePauseSummary}
                  className="flex items-center gap-1"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStopSummary}
                  className="flex items-center gap-1"
                >
                  <StopCircle className="h-4 w-4" />
                  <span>Stop</span>
                </Button>
              </>
            )}

            {isPaused && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRestartSummary}
                  className="flex items-center gap-1"
                >
                  <RefreshCcw className="h-4 w-4" />
                  <span>Restart</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlaySummary}
                  className="flex items-center gap-1"
                >
                  <Play className="h-4 w-4" />
                  <span>Resume</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStopSummary}
                  className="flex items-center gap-1"
                >
                  <StopCircle className="h-4 w-4" />
                  <span>Stop</span>
                </Button>
              </>
            )}
            
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
            
            {hasAudio && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownloadAudio}
                disabled={isDownloadingAudio}
                className="flex items-center gap-1 bg-blue-50 border-blue-200 hover:bg-blue-100"
              >
                <Download className="h-4 w-4" />
                <span>{isDownloadingAudio ? "Downloading..." : "Download Audio"}</span>
              </Button>
            )}
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

