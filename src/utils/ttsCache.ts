
/**
 * TTS helper - Speechify API first (w/ cache), fallback to direct VoiceRSS (no cache)
 */

const VOICERSS_API_KEY = "ae8ae044c49f4afcbda7ac115f24c1c5";
const VOICERSS_URL = "https://api.voicerss.org/";
const SPEECHIFY_API_URL = "https://api.speechify.com/v2/tts/stream";
const CACHE_NAMESPACE = "speechify_tts_cache";

export interface TTSCacheParams {
  text: string;
  voice?: string;
  language?: string;
  preferProvider?: "speechify" | "voicerss";
}

export interface TTSCacheResult {
  audioUrl: string;
  provider: "speechify" | "voicerss";
  cacheHit: boolean;
}

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

async function withSpeechifyTTS(params: TTSCacheParams): Promise<TTSCacheResult | null> {
  const { text, voice = "Sandra", language = "en_us" } = params;
  const apiKey = getSpeechifyApiKey();
  if (!apiKey) return null;

  // Use text+voice+lang hash as a cache key
  const cacheKey = `${CACHE_NAMESPACE}:${btoa(unescape(encodeURIComponent([text, voice, language].join(':'))))}`;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const cached = window.localStorage.getItem(cacheKey);
      if (cached) {
        return {
          audioUrl: cached,
          provider: "speechify",
          cacheHit: true,
        };
      }
    }

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
        speaking_rate: 1,
        pitch: 0,
      }),
    });

    if (!resp.ok) throw new Error("Speechify TTS error");

    // The API returns audio/mp3, so create a Blob/URL
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);

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
    console.warn("Speechify TTS failed or errored:", e);
    return null;
  }
}

/**
 * Always generate TTS. Use Speechify and cache result; fallback to direct VoiceRSS (not cached).
 */
export async function getOrGenerateAudio(params: TTSCacheParams): Promise<TTSCacheResult> {
  // Try Speechify first, only fall back to RSS if this fails
  const speechify = await withSpeechifyTTS(params);
  if (speechify) return speechify;

  // If Speechify fails, fallback: plain VoiceRSS
  const { text, voice = "John", language = "en-us" } = params;
  const url =
    `${VOICERSS_URL}?key=${VOICERSS_API_KEY}&hl=${language}&v=${voice}&src=${encodeURIComponent(
      text
    )}&c=MP3&f=16khz_16bit_stereo`;
  return {
    audioUrl: url,
    provider: "voicerss",
    cacheHit: false,
  };
}

// Expose key setter/getter for UI use:
export const SpeechifyApiKeyStore = { get: getSpeechifyApiKey, set: setSpeechifyApiKey };
