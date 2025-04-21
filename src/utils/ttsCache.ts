/**
 * TTS helper - Speechify API first (w/ cache), fallback to direct VoiceRSS (no cache)
 */

// API Keys
const VOICERSS_API_KEY = "ae8ae044c49f4afcbda7ac115f24c1c5";
const VOICERSS_URL = "https://api.voicerss.org/";
const SPEECHIFY_API_URL = "https://api.speechify.com/v2/tts/stream";
const CACHE_NAMESPACE = "speechify_tts_cache";

export interface TTSCacheParams {
  text: string;
  voice?: string;
  language?: string;
  emotion?: string;
  model?: string;
  preferProvider?: "speechify" | "voicerss";
  speakingRate?: number;
  pitch?: number;
}

export interface TTSCacheResult {
  audioUrl: string;
  provider: "speechify" | "voicerss";
  cacheHit: boolean;
  error?: string;
}

// Available voices for reference
export const SPEECHIFY_VOICES = {
  english: [
    { id: "Sandra", name: "Sandra (Default)" },
    { id: "Sarah", name: "Sarah" },
    { id: "John", name: "John" },
    { id: "Mike", name: "Mike" },
    { id: "Charlie", name: "Charlie" },
    { id: "Roger", name: "Roger" },
    { id: "Aria", name: "Aria" },
    { id: "Jessica", name: "Jessica" },
  ],
  spanish: [
    { id: "Miguel", name: "Miguel" },
    { id: "Lucia", name: "Lucia" },
    { id: "Isabel", name: "Isabel" },
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

export const VOICERSS_VOICES = {
  english: [
    { id: "John", name: "John (Default)" },
    { id: "Mary", name: "Mary" },
    { id: "Mike", name: "Mike" },
    { id: "Linda", name: "Linda" },
    { id: "James", name: "James" },
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
  arabic: [
    { id: "Hareth", name: "Hareth" },
  ],
};

export const TTS_LANGUAGES = {
  "en-us": "English (US)",
  "ar-sa": "Arabic",
  "es-es": "Spanish",
  "fr-fr": "French",
  "de-de": "German"
};

function getSpeechifyApiKey(): string | null {
  // Check localStorage (UI can set this), fallback to env if needed
  try {
    if (typeof window !== "undefined") {
      const key = window.localStorage.getItem("SPEECHIFY_API_KEY");
      return key || null;
    }
    return null;
  } catch {
    return null;
  }
}

function setSpeechifyApiKey(key: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("SPEECHIFY_API_KEY", key);
  }
}

async function fetchSpeechifyApiKey(): Promise<string | null> {
  try {
    // Try to get the API key from the Supabase edge function
    const { data, error } = await fetch('/api/get-speechify-api-key').then(res => res.json());
    if (error || !data?.apiKey) {
      console.warn('Failed to fetch Speechify API key from server:', error);
      return null;
    }
    return data.apiKey;
  } catch (e) {
    console.warn('Error fetching Speechify API key:', e);
    return null;
  }
}

async function withSpeechifyTTS(params: TTSCacheParams): Promise<TTSCacheResult | null> {
  const { 
    text, 
    voice = "Sandra", 
    language = "en_us",
    model = "basic", // basic, standard, premium
    emotion = "neutral", // neutral, happy, sad, angry, excited
    speakingRate = 1,
    pitch = 0
  } = params;
  
  // Get API key - first check localStorage, then try to fetch from server
  let apiKey = getSpeechifyApiKey();
  if (!apiKey) {
    apiKey = await fetchSpeechifyApiKey();
    // If we got a key from the server, save it to localStorage for future use
    if (apiKey) {
      setSpeechifyApiKey(apiKey);
    } else {
      console.warn("No Speechify API key available");
      return null;
    }
  }

  // Use text+voice+lang+model+emotion+rate+pitch hash as a cache key
  const cacheKey = `${CACHE_NAMESPACE}:${btoa(unescape(encodeURIComponent(
    [text, voice, language, model, emotion, speakingRate, pitch].join(':')
  )))}`;
  
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const cached = window.localStorage.getItem(cacheKey);
      if (cached) {
        console.log("Using cached Speechify TTS audio");
        return {
          audioUrl: cached,
          provider: "speechify",
          cacheHit: true,
        };
      }
    }

    console.log("Requesting Speechify TTS with params:", {
      voice, text, model, emotion, speakingRate, pitch 
    });

    // Send request to Speechify TTS API
    const resp = await fetch(SPEECHIFY_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        voice: voice,
        text: text,
        output_format: "mp3",
        speaking_rate: speakingRate,
        pitch: pitch,
        ...(model && { model }),
        ...(emotion && { emotion }),
      }),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error("Speechify TTS error:", resp.status, errorText);
      throw new Error(`Speechify API error: ${resp.status} - ${errorText}`);
    }

    // The API returns audio/mp3, so create a Blob/URL
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    console.log("Generated Speechify TTS audio successfully");

    // Cache the URL (expires with browser session, better than nothing)
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(cacheKey, url);
    }

    return {
      audioUrl: url,
      provider: "speechify",
      cacheHit: false,
    };
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.warn("Speechify TTS failed or errored:", errorMessage);
    return {
      audioUrl: "",
      provider: "speechify",
      cacheHit: false,
      error: errorMessage
    };
  }
}

/**
 * Get VoiceRSS TTS audio URL
 */
function getVoiceRssUrl(params: TTSCacheParams): string {
  const { 
    text, 
    voice = "John", 
    language = "en-us",
    speakingRate = 1
  } = params;
  
  // Map speaking rate to VoiceRSS format (they use -10 to +10)
  // Convert from 0.5-1.5 range to -10 to +10 range
  const rssRate = speakingRate ? Math.round((speakingRate - 1) * 20) : 0;
  
  return `${VOICERSS_URL}?key=${VOICERSS_API_KEY}&hl=${language}&v=${voice}&src=${encodeURIComponent(
    text
  )}&c=MP3&f=16khz_16bit_stereo&r=${rssRate}`;
}

/**
 * Always generate TTS. Use Speechify and cache result; fallback to direct VoiceRSS (not cached).
 */
export async function getOrGenerateAudio(params: TTSCacheParams): Promise<TTSCacheResult> {
  console.log("TTS requested with params:", params);
  
  // If user explicitly wants VoiceRSS, use it directly
  if (params.preferProvider === "voicerss") {
    const url = getVoiceRssUrl(params);
    return {
      audioUrl: url,
      provider: "voicerss",
      cacheHit: false,
    };
  }
  
  // Try Speechify first, only fall back to RSS if this fails
  try {
    const speechify = await withSpeechifyTTS(params);
    if (speechify && !speechify.error) {
      return speechify;
    }
    
    // If we got an error from Speechify, log it and fall back
    if (speechify?.error) {
      console.warn(`Falling back to VoiceRSS because Speechify failed: ${speechify.error}`);
    } else {
      console.warn("Falling back to VoiceRSS because Speechify returned null");
    }
  } catch (err) {
    console.warn("Falling back to VoiceRSS due to Speechify error:", err);
  }

  // If Speechify fails, fallback: plain VoiceRSS
  const url = getVoiceRssUrl(params);
  return {
    audioUrl: url,
    provider: "voicerss",
    cacheHit: false,
  };
}

// Expose key setter/getter for UI use:
export const SpeechifyApiKeyStore = { get: getSpeechifyApiKey, set: setSpeechifyApiKey };
