
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlayCircle, PauseCircle, XCircle, SpeakerHigh, Sparkles, AlertCircle } from "lucide-react";
import { getOrGenerateAudio, TTSCacheResult, SPEECHIFY_VOICES, VOICERSS_VOICES, TTS_LANGUAGES } from "@/utils/ttsCache";

interface MeetingPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  summary?: string;
}

const MeetingPreviewDialog: React.FC<MeetingPreviewDialogProps> = ({
  isOpen,
  onClose,
  title = "Meeting Summary",
  summary = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [selectedVoice, setSelectedVoice] = useState("Sandra"); // Default Speechify voice
  const [selectedLanguage, setSelectedLanguage] = useState("en-us");
  const [preferredProvider, setPreferredProvider] = useState<"speechify" | "voicerss">("speechify");
  const [activeProvider, setActiveProvider] = useState<"speechify" | "voicerss" | null>(null);
  const [speakingRate, setSpeakingRate] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Combine voices from both providers
  const allVoices = {
    speechify: SPEECHIFY_VOICES,
    voicerss: VOICERSS_VOICES
  };
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);
  
  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!summary) return;
    
    if (isPlaying && currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
      return;
    }
    
    if (currentAudio && audioStatus === 'ready') {
      currentAudio.play();
      setIsPlaying(true);
      return;
    }
    
    // Need to generate new audio
    playAudio();
  };
  
  const playAudio = async () => {
    try {
      setAudioStatus('loading');
      setError(null);
      
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
      
      // Generate audio using TTS
      const result = await getOrGenerateAudio({
        text: summary,
        voice: selectedVoice,
        language: selectedLanguage,
        preferProvider: preferredProvider,
        speakingRate: speakingRate,
        pitch: pitch,
        model: "standard",
        emotion: "neutral"
      });
      
      const audio = new Audio(result.audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.oncanplaythrough = () => {
        setAudioStatus('ready');
        audio.play();
        setIsPlaying(true);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setAudioStatus('error');
        setError("Failed to play audio. Please try again or try a different voice.");
        setIsPlaying(false);
      };
      
      setCurrentAudio(audio);
      setActiveProvider(result.provider);
      
    } catch (error) {
      console.error('Error generating audio:', error);
      setAudioStatus('error');
      setError("Failed to generate audio. Please check your internet connection and try again.");
      setIsPlaying(false);
    }
  };
  
  const handleVoiceChange = (value: string) => {
    stopAudio();
    setSelectedVoice(value);
    setAudioStatus('idle');
  };
  
  const handleLanguageChange = (value: string) => {
    stopAudio();
    setSelectedLanguage(value);
    
    // Auto-select a voice for the selected language
    if (value === 'ar-sa') {
      setSelectedVoice('Hareth');
      setPreferredProvider('voicerss');
    } else if (value.startsWith('es')) {
      setSelectedVoice(preferredProvider === 'speechify' ? 'Miguel' : 'Juan');
    } else if (value.startsWith('fr')) {
      setSelectedVoice(preferredProvider === 'speechify' ? 'Pierre' : 'Louis');
    } else if (value.startsWith('de')) {
      setSelectedVoice(preferredProvider === 'speechify' ? 'Hans' : 'Klaus');
    } else {
      // Default to English
      setSelectedVoice(preferredProvider === 'speechify' ? 'Sandra' : 'John');
    }
    setAudioStatus('idle');
  };
  
  const handleProviderChange = (value: "speechify" | "voicerss") => {
    stopAudio();
    setPreferredProvider(value);
    
    // Auto-select a voice for the selected provider
    if (value === 'speechify') {
      if (selectedLanguage === 'ar-sa') {
        // Speechify doesn't support Arabic, stay with VoiceRSS
        setPreferredProvider('voicerss');
        setSelectedVoice('Hareth');
      } else if (selectedLanguage.startsWith('es')) {
        setSelectedVoice('Miguel');
      } else if (selectedLanguage.startsWith('fr')) {
        setSelectedVoice('Pierre');
      } else if (selectedLanguage.startsWith('de')) {
        setSelectedVoice('Hans');
      } else {
        setSelectedVoice('Sandra');
      }
    } else {
      // VoiceRSS
      if (selectedLanguage === 'ar-sa') {
        setSelectedVoice('Hareth');
      } else if (selectedLanguage.startsWith('es')) {
        setSelectedVoice('Juan');
      } else if (selectedLanguage.startsWith('fr')) {
        setSelectedVoice('Louis');
      } else if (selectedLanguage.startsWith('de')) {
        setSelectedVoice('Klaus');
      } else {
        setSelectedVoice('John');
      }
    }
    setAudioStatus('idle');
  };
  
  const handleClose = () => {
    stopAudio();
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md max-h-60 overflow-y-auto text-sm">
            {summary || "No summary available"}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tts-language">Language</Label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger id="tts-language">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TTS_LANGUAGES).map(([code, name]) => (
                    <SelectItem key={code} value={code}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tts-provider">Provider</Label>
              <Select 
                value={preferredProvider} 
                onValueChange={(val: "speechify" | "voicerss") => handleProviderChange(val)}
              >
                <SelectTrigger id="tts-provider">
                  <SelectValue placeholder="Select Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="speechify">Speechify (High Quality)</SelectItem>
                  <SelectItem value="voicerss">VoiceRSS (Fast)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tts-voice">Voice</Label>
            <Select value={selectedVoice} onValueChange={handleVoiceChange}>
              <SelectTrigger id="tts-voice">
                <SelectValue placeholder="Select Voice" />
              </SelectTrigger>
              <SelectContent>
                {preferredProvider === 'speechify' ? (
                  Object.entries(SPEECHIFY_VOICES).map(([langGroup, voices]) => (
                    <React.Fragment key={langGroup}>
                      {voices.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>{voice.name}</SelectItem>
                      ))}
                    </React.Fragment>
                  ))
                ) : (
                  Object.entries(VOICERSS_VOICES).map(([langGroup, voices]) => (
                    <React.Fragment key={langGroup}>
                      {voices.map(voice => (
                        <SelectItem key={voice.id} value={voice.id}>{voice.name}</SelectItem>
                      ))}
                    </React.Fragment>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="speaking-rate">Speaking Rate</Label>
              <span className="text-sm text-muted-foreground">{speakingRate.toFixed(1)}x</span>
            </div>
            <Slider
              id="speaking-rate"
              min={0.5}
              max={1.5}
              step={0.1}
              value={[speakingRate]}
              onValueChange={(values) => {
                setSpeakingRate(values[0]);
                if (audioStatus === 'ready') setAudioStatus('idle');
              }}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="pitch">Pitch</Label>
              <span className="text-sm text-muted-foreground">{pitch > 0 ? `+${pitch}` : pitch}</span>
            </div>
            <Slider
              id="pitch"
              min={-10}
              max={10}
              step={1}
              value={[pitch]}
              onValueChange={(values) => {
                setPitch(values[0]);
                if (audioStatus === 'ready') setAudioStatus('idle');
              }}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-md flex items-center text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
          
          {activeProvider && (
            <div className="flex items-center text-xs text-muted-foreground">
              <span>Using {activeProvider === 'speechify' ? 'Speechify' : 'VoiceRSS'} TTS</span>
              {activeProvider === 'speechify' && <Sparkles className="h-3 w-3 ml-1 text-blue-500" />}
            </div>
          )}
          
          <div className="flex justify-between pt-2">
            <Button 
              type="button" 
              onClick={togglePlayPause}
              disabled={!summary || audioStatus === 'loading'} 
              className="flex items-center"
              variant="default"
            >
              {audioStatus === 'loading' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : isPlaying ? (
                <>
                  <PauseCircle className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5 mr-2" />
                  Play
                </>
              )}
            </Button>
            
            <Button 
              type="button" 
              onClick={handleClose} 
              variant="outline"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingPreviewDialog;
