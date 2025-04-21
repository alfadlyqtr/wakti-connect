
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { 
  FileDown, Copy, Download, Volume2, Pause, 
  RefreshCcw, StopCircle, Play, Map, ExternalLink, 
  Settings, VolumeX
} from 'lucide-react';
import SummaryDisplay from './SummaryDisplay';
import { generateTomTomMapsUrl } from '@/config/maps';
import { supabase } from "@/integrations/supabase/client";
import { motion } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils';
import { 
  getOrGenerateAudio, 
  SpeechifyApiKeyStore, 
  TTSCacheParams,
  SPEECHIFY_VOICES, 
  VOICERSS_VOICES,
  TTS_LANGUAGES 
} from '@/utils/ttsCache';
import SpeechifyApiKeyInput from '@/components/settings/ai/SpeechifyApiKeyInput';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState<"speechify" | "voicerss" | null>(null);
  
  // TTS settings
  const [selectedVoice, setSelectedVoice] = useState<string>("Sandra");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-us");
  const [speakingRate, setSpeakingRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(0);
  const [preferProvider, setPreferProvider] = useState<"speechify" | "voicerss">("speechify");
  const [showTTSSettings, setShowTTSSettings] = useState(false);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (meeting?.detectedLocation) {
      fetchLocationName(meeting.detectedLocation);
    }
  }, [meeting?.detectedLocation]);

  useEffect(() => {
    if (!isOpen) {
      handleStopSummary();
      setAudioUrl(null);
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

  const handlePlaySummary = async () => {
    try {
      if (isPaused && audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        setIsPaused(false);
        return;
      }

      handleStopSummary();

      const ttsParams: TTSCacheParams = {
        text: meeting.summary,
        voice: selectedVoice,
        language: selectedLanguage.replace('-', '_'), // Convert en-us to en_us for Speechify
        speakingRate: speakingRate,
        pitch: pitch,
        preferProvider: preferProvider,
      };

      const ttsResult = await getOrGenerateAudio(ttsParams);
      
      if (ttsResult.error) {
        toast({
          title: `${ttsResult.provider === 'speechify' ? 'Speechify' : 'VoiceRSS'} Error`,
          description: ttsResult.error,
          variant: "destructive"
        });
        
        // If Speechify failed and we weren't already trying VoiceRSS, try VoiceRSS
        if (ttsResult.provider === 'speechify' && preferProvider !== 'voicerss') {
          toast({
            title: "Falling back to VoiceRSS",
            description: "Speechify failed, trying VoiceRSS instead",
          });
          
          // Try with VoiceRSS
          const rssParams = { 
            ...ttsParams, 
            preferProvider: 'voicerss',
            voice: selectedLanguage.startsWith('en') ? 'John' : 'Hareth', // Use default voices
          };
          
          const rssResult = await getOrGenerateAudio(rssParams);
          setAudioUrl(rssResult.audioUrl);
          setCurrentProvider(rssResult.provider);
          
          const audio = new window.Audio(rssResult.audioUrl);
          audioRef.current = audio;
          audio.play();
          setIsPlaying(true);
          setIsPaused(false);
          
          setupAudioEventListeners(audio);
          return;
        }
      } else {
        setAudioUrl(ttsResult.audioUrl);
        setCurrentProvider(ttsResult.provider);
        
        const audio = new window.Audio(ttsResult.audioUrl);
        audioRef.current = audio;
        audio.play();
        setIsPlaying(true);
        setIsPaused(false);
        
        // If we requested Speechify but got VoiceRSS, show toast
        if (preferProvider === 'speechify' && ttsResult.provider === 'voicerss') {
          toast({
            title: "Using VoiceRSS",
            description: "Speechify API unavailable, using VoiceRSS instead",
          });
        }
        
        setupAudioEventListeners(audio);
      }
    } catch (error) {
      console.error('Failed to play summary:', error);
      toast({
        title: "Error playing summary",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const setupAudioEventListeners = (audio: HTMLAudioElement) => {
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
      toast({
        title: "Audio playback failed",
        description: "There was an error playing the audio",
        variant: "destructive"
      });
    };
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
      const audio = new window.Audio(audioUrl);
      audioRef.current = audio;
      audio.play();
      setIsPlaying(true);
      setIsPaused(false);
      
      setupAudioEventListeners(audio);
    } else {
      await handlePlaySummary();
    }
  };

  const handleStopSummary = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const openInMaps = () => {
    if (locationName) {
      window.open(generateTomTomMapsUrl(locationName), '_blank');
    }
  };

  const getVoiceOptions = () => {
    // Return appropriate voice options based on selected language and provider
    if (preferProvider === 'speechify') {
      if (selectedLanguage.startsWith('en')) {
        return SPEECHIFY_VOICES.english;
      } else if (selectedLanguage.startsWith('es')) {
        return SPEECHIFY_VOICES.spanish;
      } else if (selectedLanguage.startsWith('fr')) {
        return SPEECHIFY_VOICES.french;
      } else if (selectedLanguage.startsWith('de')) {
        return SPEECHIFY_VOICES.german;
      }
      // Default to English if language not supported
      return SPEECHIFY_VOICES.english;
    } else {
      // VoiceRSS
      if (selectedLanguage.startsWith('en')) {
        return VOICERSS_VOICES.english;
      } else if (selectedLanguage.startsWith('es')) {
        return VOICERSS_VOICES.spanish;
      } else if (selectedLanguage.startsWith('fr')) {
        return VOICERSS_VOICES.french;
      } else if (selectedLanguage.startsWith('de')) {
        return VOICERSS_VOICES.german;
      } else if (selectedLanguage.startsWith('ar')) {
        return VOICERSS_VOICES.arabic;
      }
      // Default to English if language not supported
      return VOICERSS_VOICES.english;
    }
  };

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    
    // Reset voice to default for the selected language
    const voices = preferProvider === 'speechify' ? SPEECHIFY_VOICES : VOICERSS_VOICES;
    
    if (value.startsWith('en')) {
      setSelectedVoice(preferProvider === 'speechify' ? 'Sandra' : 'John');
    } else if (value.startsWith('es')) {
      setSelectedVoice(preferProvider === 'speechify' ? 'Miguel' : 'Juan');
    } else if (value.startsWith('fr')) {
      setSelectedVoice(preferProvider === 'speechify' ? 'Pierre' : 'Louis');
    } else if (value.startsWith('de')) {
      setSelectedVoice(preferProvider === 'speechify' ? 'Hans' : 'Klaus');
    } else if (value.startsWith('ar')) {
      setSelectedVoice('Hareth'); // Only one Arabic voice
    }
  };

  const handleProviderChange = (value: "speechify" | "voicerss") => {
    setPreferProvider(value);
    
    // Reset voice to default for the selected provider and language
    if (value === 'speechify') {
      if (selectedLanguage.startsWith('en')) setSelectedVoice('Sandra');
      else if (selectedLanguage.startsWith('es')) setSelectedVoice('Miguel');
      else if (selectedLanguage.startsWith('fr')) setSelectedVoice('Pierre');
      else if (selectedLanguage.startsWith('de')) setSelectedVoice('Hans');
    } else {
      if (selectedLanguage.startsWith('en')) setSelectedVoice('John');
      else if (selectedLanguage.startsWith('es')) setSelectedVoice('Juan');
      else if (selectedLanguage.startsWith('fr')) setSelectedVoice('Louis');
      else if (selectedLanguage.startsWith('de')) setSelectedVoice('Klaus');
      else if (selectedLanguage.startsWith('ar')) setSelectedVoice('Hareth');
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
        <div className="flex flex-col gap-2">
          <SpeechifyApiKeyInput className="mb-2 self-end" />
        </div>
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
            className="flex flex-col gap-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* TTS settings */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Popover open={showTTSSettings} onOpenChange={setShowTTSSettings}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 h-8"
                    >
                      <Settings className="h-3.5 w-3.5" />
                      <span className="text-xs">Voice Settings</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm mb-2">Text-to-Speech Settings</h4>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">Provider</label>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={preferProvider === "speechify" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleProviderChange("speechify")}
                            className="text-xs h-7 px-2 flex-1"
                          >
                            Speechify
                          </Button>
                          <Button
                            variant={preferProvider === "voicerss" ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleProviderChange("voicerss")}
                            className="text-xs h-7 px-2 flex-1"
                          >
                            VoiceRSS
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">Language</label>
                        <Select 
                          value={selectedLanguage} 
                          onValueChange={handleLanguageChange}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TTS_LANGUAGES).map(([code, name]) => (
                              <SelectItem key={code} value={code} className="text-xs">
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs text-muted-foreground">Voice</label>
                        <Select 
                          value={selectedVoice} 
                          onValueChange={handleVoiceChange}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select voice" />
                          </SelectTrigger>
                          <SelectContent>
                            {getVoiceOptions().map((voice) => (
                              <SelectItem key={voice.id} value={voice.id} className="text-xs">
                                {voice.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-muted-foreground">Speed</label>
                          <span className="text-xs">{speakingRate.toFixed(1)}x</span>
                        </div>
                        <Slider 
                          value={[speakingRate]} 
                          min={0.5} 
                          max={1.5} 
                          step={0.1} 
                          onValueChange={(vals) => setSpeakingRate(vals[0])}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <label className="text-xs text-muted-foreground">Pitch</label>
                          <span className="text-xs">{pitch > 0 ? `+${pitch}` : pitch}</span>
                        </div>
                        <Slider 
                          value={[pitch]} 
                          min={-10} 
                          max={10} 
                          step={1} 
                          onValueChange={(vals) => setPitch(vals[0])}
                        />
                      </div>
                      
                      <div className="mt-4 text-xs text-muted-foreground">
                        {currentProvider && (
                          <div className="flex items-center mt-2">
                            <span>Last used: </span>
                            <span className={`ml-1 font-medium ${currentProvider === 'speechify' ? 'text-blue-500' : 'text-green-500'}`}>
                              {currentProvider === 'speechify' ? 'Speechify' : 'VoiceRSS'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex justify-end gap-2 flex-wrap">
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
              </div>
            </div>
            
            <div className="flex justify-end gap-2 flex-wrap">
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
            </div>
          </motion.div>

          {/* Provider status indicator */}
          {currentProvider && (
            <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${
              currentProvider === 'speechify' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`} style={{ width: 'fit-content' }}>
              <Volume2 className="h-3 w-3 mr-1" />
              <span>Using {currentProvider === 'speechify' ? 'Speechify' : 'VoiceRSS'}</span>
            </div>
          )}

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
