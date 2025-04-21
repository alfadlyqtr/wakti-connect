
interface VoiceRSSOptions {
  text: string;
  language?: 'en-us' | 'ar-sa';
  voice?: 'John' | 'Linda' | 'Mike' | 'Mary' | 'Hareth';
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

export const playTextWithVoiceRSS = async ({ 
  text, 
  language = 'en-us', 
  voice = 'John',
  speed = 0,
  quality = 8 
}: VoiceRSSOptions) => {
  const API_KEY = 'ae8ae044c49f4afcbda7ac115f24c1c5';
  const url = `https://api.voicerss.org/?key=${API_KEY}&hl=${language}&v=${voice}&src=${encodeURIComponent(text)}&r=${speed}&c=MP3&f=16khz_16bit_stereo`;

  try {
    // If there's already an audio playing and it's the same URL, just control that
    if (currentAudio && currentAudioUrl === url && !currentAudio.ended) {
      await currentAudio.play();
      return currentAudio;
    }

    // Otherwise create a new audio instance
    const audio = new Audio(url);
    currentAudio = audio;
    currentAudioUrl = url;
    await audio.play();
    return audio;
  } catch (error) {
    console.error('Error playing audio:', error);
    throw error;
  }
};
