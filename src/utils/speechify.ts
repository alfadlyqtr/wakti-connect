
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SpeechifyOptions {
  text: string;
  language?: 'en-US' | 'ar-AE' | string;
  voice?: string;
}

let currentAudio: HTMLAudioElement | null = null;
let currentAudioUrl: string | null = null;

// Control functions
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
    return { language: 'ar-AE', voice: 'simba-ar' };
  } else if (!hasArabic && hasEnglish) {
    // Pure English
    return { language: 'en-US', voice: 'simba-en' };
  } else if (hasArabic && hasEnglish) {
    // Mixed - use multilingual model
    const arabicCount = (text.match(/[\u0600-\u06FF]/g) || []).length;
    const englishCount = (text.match(/[a-zA-Z]/g) || []).length;
    
    if (arabicCount > englishCount) {
      return { language: 'ar-AE', voice: 'simba-ar' };
    } else {
      return { language: 'en-US', voice: 'simba-en' };
    }
  }
  // Default to English
  return { language: 'en-US', voice: 'simba-en' };
};

export const playTextWithSpeechify = async ({ 
  text, 
  language = 'en-US', 
  voice = 'simba-en'
}: SpeechifyOptions) => {
  try {
    const { data: { secrets }, error: secretsError } = await supabase.functions.invoke('get-secrets', {
      body: { keys: ['SPEECHIFY_API_KEY'] }
    });

    if (secretsError || !secrets?.SPEECHIFY_API_KEY) {
      console.error('Error getting Speechify API key:', secretsError);
      toast.error('Text-to-speech is unavailable. API key not found.');
      throw new Error('Speechify API key not found. Please add it in the project settings.');
    }

    // Split long text into chunks if needed
    if (text.length > 20000) {
      const chunks = text.match(/.{1,20000}/g) || [];
      console.log(`Text too long, split into ${chunks.length} chunks`);
      
      // Process first chunk
      const firstChunkResult = await processChunk(chunks[0], language, voice, secrets.SPEECHIFY_API_KEY);
      if (!firstChunkResult) return null;
      
      // Queue remaining chunks
      if (chunks.length > 1) {
        let currentIndex = 1;
        firstChunkResult.addEventListener('ended', async () => {
          if (currentIndex < chunks.length) {
            toast.info(`Playing part ${currentIndex + 1} of ${chunks.length}`);
            await processChunk(chunks[currentIndex], language, voice, secrets.SPEECHIFY_API_KEY);
            currentIndex++;
          }
        });
      }
      
      return firstChunkResult;
    }

    return await processChunk(text, language, voice, secrets.SPEECHIFY_API_KEY);
    
  } catch (error) {
    console.error('Error playing audio:', error);
    toast.error('Failed to play audio. Please check your connection and try again.');
    throw error;
  }
};

async function processChunk(text: string, language: string, voice: string, apiKey: string): Promise<HTMLAudioElement | null> {
  try {
    const response = await fetch('https://api.speechify.com/api/v2/tts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
        language,
        format: 'mp3',
      }),
    });

    if (!response.ok) {
      throw new Error(`Speechify API error: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    // If same audio is playing, control that instead
    if (currentAudio && currentAudioUrl === url && !currentAudio.ended) {
      await currentAudio.play();
      return currentAudio;
    }

    // Create new audio instance
    const audio = new Audio(url);
    
    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      const errorMessage = language === 'ar-AE' 
        ? 'Failed to play Arabic audio. Please try again.'
        : 'Failed to play audio. Please try again.';
      toast.error(errorMessage);
    };
    
    currentAudio = audio;
    currentAudioUrl = url;
    
    await audio.play();
    return audio;
    
  } catch (error) {
    console.error('Chunk processing error:', error);
    toast.error('Failed to process audio chunk');
    return null;
  }
}

