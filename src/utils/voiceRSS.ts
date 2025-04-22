import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VoiceRSSOptions {
  text: string;
  language?: 'en-us' | 'ar-sa' | string;
  voice?: 'John' | 'Linda' | 'Mike' | 'Mary' | 'Hamza' | string;
  speed?: number;
  quality?: number;
}

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;

export const stopCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
};

export const pauseCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.pause();
  }
};

export const resumeCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.play();
  }
};

export const restartCurrentAudio = () => {
  if (currentAudio) {
    currentAudio.currentTime = 0;
    currentAudio.play();
  }
};

export const getVoiceSettings = (text: string): { language: string, voice: string } => {
  // Check if text contains Arabic characters
  const hasArabic = /[\u0600-\u06FF]/.test(text);
  const hasEnglish = /[a-zA-Z]/.test(text);
  
  if (hasArabic && !hasEnglish) {
    // Pure Arabic
    return { language: 'ar-sa', voice: 'Hamza' };
  } else if (!hasArabic && hasEnglish) {
    // Pure English
    return { language: 'en-us', voice: 'John' };
  } else if (hasArabic && hasEnglish) {
    // Mixed - determine dominant language
    const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const englishCount = (text.match(/[a-zA-Z]/g) || []).length;
    
    if (arabicCount > englishCount) {
      return { language: 'ar-sa', voice: 'Hamza' };
    } else {
      return { language: 'en-us', voice: 'John' };
    }
  } else {
    // Default to English
    return { language: 'en-us', voice: 'John' };
  }
};

export const playTextWithVoiceRSS = async ({ 
  text, 
  language = 'en-us', 
  voice = 'John',
  speed = 0,
  quality = 8 
}: VoiceRSSOptions) => {
  try {
    // Check if text contains Arabic characters
    const hasArabic = /[\u0600-\u06FF]/.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);
    
    // If text is Arabic or mixed, show "Coming Soon" toast and prevent playback
    if (hasArabic) {
      toast.info('Arabic Text-to-Speech is Coming Soon!');
      return null;
    }

    const { data: { secrets }, error: secretsError } = await supabase.functions.invoke('get-secrets', {
      body: { keys: ['VOICERSS_API_KEY'] }
    });

    if (secretsError || !secrets?.VOICERSS_API_KEY) {
      console.error('Error getting VoiceRSS API key:', secretsError);
      toast.error('Text-to-speech is unavailable. API key not found or invalid.');
      throw new Error('VoiceRSS API key not found. Please add it in the project settings.');
    }

    const API_KEY = secrets.VOICERSS_API_KEY;
    
    // Properly encode text for Arabic and English
    const encodedText = encodeURIComponent(text);
    
    // Debug logging for Arabic text
    if (language === 'ar-sa') {
      console.log('Processing Arabic text:', {
        originalText: text,
        encodedText,
        language,
        voice
      });
    }
    
    // Handle mixed language content by splitting and processing separately
    if (text.length > 5000) {
      console.log("Text is too long, splitting into chunks");
      // Split text into chunks of 5000 characters
      const chunks = [];
      for (let i = 0; i < text.length; i += 5000) {
        chunks.push(text.substring(i, i + 5000));
      }
      
      // Play the first chunk and queue the rest
      const firstChunk = chunks.shift();
      if (!firstChunk) {
        toast.error("Could not process text for speech");
        return null;
      }
      
      toast.info("Playing long text in chunks. Please wait for all parts to complete.");
      
      const audio = await playTextWithVoiceRSS({
        text: firstChunk,
        language,
        voice,
        speed,
        quality
      });
      
      if (audio && chunks.length > 0) {
        // Queue the next chunks
        let currentChunkIndex = 0;
        
        audio.addEventListener('ended', async () => {
          if (currentChunkIndex < chunks.length) {
            const nextChunk = chunks[currentChunkIndex];
            currentChunkIndex++;
            
            try {
              toast.info(`Playing part ${currentChunkIndex + 1} of ${chunks.length + 1}`);
              await playTextWithVoiceRSS({
                text: nextChunk,
                language,
                voice,
                speed,
                quality
              });
            } catch (error) {
              console.error("Error playing next chunk:", error);
              toast.error("Failed to play next part of text");
            }
          } else {
            toast.success("Finished playing all parts");
          }
        });
      }
      
      return audio;
    }
    
    const url = `https://api.voicerss.org/?key=${API_KEY}&hl=${language}&v=${voice}&src=${encodedText}&r=${speed}&c=MP3&f=16khz_16bit_stereo`;

    // If there's already an audio playing and it's the same URL, just control that
    if (currentAudio && currentAudioUrl === url && !currentAudio.ended) {
      await currentAudio.play();
      return currentAudio;
    }

    // Otherwise create a new audio instance
    const audio = new Audio(url);
    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      const errorMessage = language === 'ar-sa' 
        ? 'Failed to play Arabic audio. Please check your VoiceRSS subscription supports Arabic.'
        : 'Failed to play audio. Please try again.';
      toast.error(errorMessage);
    };
    
    currentAudio = audio;
    currentAudioUrl = url;
    
    // Add small delay before playing to ensure audio is properly loaded
    setTimeout(async () => {
      try {
        await audio.play();
      } catch (err) {
        console.error("Play error:", err);
        toast.error("Could not play audio. Please try again.");
      }
    }, 100);
    
    return audio;
  } catch (error) {
    console.error('Error playing audio:', error);
    toast.error('Failed to play audio. Please check your connection and try again.');
    throw error;
  }
};
