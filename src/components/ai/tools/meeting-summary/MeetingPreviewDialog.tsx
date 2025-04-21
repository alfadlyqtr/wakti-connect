
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { getOrGenerateAudio, TTSCacheParams } from '@/utils/ttsCache';
import { Loader2, Volume2, Download, FileText, Copy, VolumeX, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useSpeechSynthesis } from '@/hooks/ai/useSpeechSynthesis';

export interface MeetingPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  summary?: string;
  meeting?: any; // Add meeting prop
  onExportPDF?: () => Promise<void>;
  onCopy?: () => Promise<void>;
  onDownloadAudio?: () => Promise<void>;
  isExporting?: boolean;
  isDownloadingAudio?: boolean;
}

const SPEECHIFY_VOICES = {
  english: [
    { id: "Sandra", name: "Sandra (Default)" },
    { id: "Sarah", name: "Sarah" },
    { id: "John", name: "John" },
    { id: "Mike", name: "Mike" },
    { id: "Charlie", name: "Charlie" },
    { id: "Roger", name: "Roger" },
  ],
  spanish: [
    { id: "Miguel", name: "Miguel" },
    { id: "Lucia", name: "Lucia" },
  ],
  french: [
    { id: "Pierre", name: "Pierre" },
    { id: "Marie", name: "Marie" },
  ],
  german: [
    { id: "Hans", name: "Hans" },
    { id: "Greta", name: "Greta" },
  ],
};

const VOICERSS_VOICES = {
  english: [
    { id: "John", name: "John (Default)" },
    { id: "Mary", name: "Mary" },
    { id: "Mike", name: "Mike" },
  ],
  spanish: [
    { id: "Juan", name: "Juan" },
    { id: "Esperanza", name: "Esperanza" },
  ],
  french: [
    { id: "Louis", name: "Louis" },
    { id: "Amelie", name: "Amelie" },
  ],
  german: [
    { id: "Klaus", name: "Klaus" },
    { id: "Claudia", name: "Claudia" },
  ],
};

const LANGUAGES = {
  "en-us": "English",
  "es-es": "Spanish",
  "fr-fr": "French",
  "de-de": "German",
};

const MeetingPreviewDialog: React.FC<MeetingPreviewDialogProps> = ({
  isOpen,
  onClose,
  title,
  summary,
  meeting,
  onExportPDF,
  onCopy,
  onDownloadAudio,
  isExporting = false,
  isDownloadingAudio = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [provider, setProvider] = useState<"speechify" | "voicerss" | null>(null);
  const [selectedVoice, setSelectedVoice] = useState("Sandra");
  const [selectedLanguage, setSelectedLanguage] = useState("en-us");
  const [speakingRate, setSpeakingRate] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [preferProvider, setPreferProvider] = useState<"speechify" | "voicerss">("speechify");
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const contentToRead = summary || (meeting?.summary || "");
  const displayTitle = title || (meeting?.title || "Meeting Summary");
  
  const { speak, cancel, speaking, supported: browserSpeechSupported } = useSpeechSynthesis();
  
  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioUrl]);
  
  // Reset audio state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      handleStop();
      setAudioUrl(null);
      setProvider(null);
    }
  }, [isOpen]);
  
  const handlePlay = async () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
    
    if (!contentToRead) {
      toast.error("No content to read");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Configure TTS parameters
      const ttsParams: TTSCacheParams = {
        text: contentToRead,
        voice: selectedVoice,
        language: selectedLanguage,
        preferProvider: preferProvider,
        speakingRate: speakingRate,
        pitch: pitch,
        emotion: "neutral",
        model: "standard"
      };
      
      // Get audio from TTS service
      const result = await getOrGenerateAudio(ttsParams);
      
      if (result.error) {
        toast.error(`Error generating audio: ${result.error}`);
        return;
      }
      
      setAudioUrl(result.audioUrl);
      setProvider(result.provider);
      
      // Play audio
      if (audioRef.current) {
        audioRef.current.src = result.audioUrl;
        audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      toast.error("Failed to generate speech. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };
  
  // For voice selection dropdown
  const getVoiceOptions = () => {
    const voices = preferProvider === "speechify" ? SPEECHIFY_VOICES : VOICERSS_VOICES;
    
    // Map language code to language group
    const languageGroup = selectedLanguage.startsWith("en") ? "english" :
                         selectedLanguage.startsWith("es") ? "spanish" :
                         selectedLanguage.startsWith("fr") ? "french" :
                         selectedLanguage.startsWith("de") ? "german" : "english";
    
    return voices[languageGroup] || voices.english;
  };
  
  // Format date if available
  const formattedDate = meeting?.date ? 
    formatDistance(new Date(meeting.date), new Date(), { addSuffix: true }) : "";
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{displayTitle}</DialogTitle>
          {formattedDate && (
            <div className="text-sm text-muted-foreground">
              Created {formattedDate}
            </div>
          )}
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          {/* Summary content */}
          <Card className="p-1">
            <CardContent className="p-4 prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">
              {contentToRead}
            </CardContent>
          </Card>
          
          {/* TTS Controls */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Text-to-Speech</div>
              
              {/* Provider status indicator */}
              {provider && (
                <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  {provider === "speechify" ? "Speechify TTS" : "VoiceRSS TTS"}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Language selection */}
              <div>
                <label htmlFor="language" className="text-xs text-muted-foreground">
                  Language
                </label>
                <select 
                  id="language"
                  className="w-full mt-1 p-2 text-sm border rounded-md"
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    // Reset voice when language changes
                    const defaultVoice = preferProvider === "speechify" ? "Sandra" : "John";
                    setSelectedVoice(defaultVoice);
                  }}
                >
                  {Object.entries(LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
              
              {/* Voice selection */}
              <div>
                <label htmlFor="voice" className="text-xs text-muted-foreground">
                  Voice
                </label>
                <select 
                  id="voice"
                  className="w-full mt-1 p-2 text-sm border rounded-md"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                >
                  {getVoiceOptions().map((voice) => (
                    <option key={voice.id} value={voice.id}>{voice.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Speed control */}
              <div>
                <label htmlFor="speed" className="text-xs text-muted-foreground flex justify-between">
                  <span>Speed</span>
                  <span>{speakingRate.toFixed(1)}x</span>
                </label>
                <input 
                  id="speed"
                  type="range" 
                  min="0.5" 
                  max="1.5" 
                  step="0.1"
                  value={speakingRate}
                  onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              {/* Pitch control */}
              <div>
                <label htmlFor="pitch" className="text-xs text-muted-foreground flex justify-between">
                  <span>Pitch</span>
                  <span>{pitch > 0 ? `+${pitch}` : pitch}</span>
                </label>
                <input 
                  id="pitch"
                  type="range" 
                  min="-10" 
                  max="10" 
                  step="1"
                  value={pitch}
                  onChange={(e) => setPitch(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              
              {/* Provider selection */}
              <div className="col-span-1 sm:col-span-2">
                <div className="flex items-center gap-4">
                  <label className="text-xs text-muted-foreground mr-3">TTS Provider</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        value="speechify"
                        checked={preferProvider === "speechify"}
                        onChange={() => setPreferProvider("speechify")}
                        className="accent-blue-600"
                      />
                      <span className="text-sm">Speechify</span>
                    </label>
                    
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        value="voicerss"
                        checked={preferProvider === "voicerss"}
                        onChange={() => setPreferProvider("voicerss")}
                        className="accent-blue-600"
                      />
                      <span className="text-sm">VoiceRSS</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Play/stop button */}
            <div className="flex justify-center">
              <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
              
              {!isPlaying ? (
                <Button
                  onClick={handlePlay}
                  disabled={isLoading || !contentToRead}
                  className="w-32"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Volume2 className="mr-2 h-4 w-4" />
                      Play
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleStop}
                  variant="secondary"
                  className="w-32"
                >
                  <VolumeX className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-wrap gap-2 sm:gap-0">
          {onCopy && (
            <Button onClick={onCopy} variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copy Text
            </Button>
          )}
          
          {onDownloadAudio && (
            <Button 
              onClick={onDownloadAudio} 
              variant="outline" 
              size="sm"
              disabled={isDownloadingAudio}
            >
              <Download className="mr-2 h-4 w-4" />
              {isDownloadingAudio ? 'Downloading...' : 'Download Audio'}
            </Button>
          )}
          
          {onExportPDF && (
            <Button 
              onClick={onExportPDF} 
              variant="outline" 
              size="sm"
              disabled={isExporting}
            >
              <FileText className="mr-2 h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export PDF'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingPreviewDialog;
