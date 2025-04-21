
/**
 * TTS helper - VoiceRSS only (no cache, no Speechify)
 * Always returns a direct VoiceRSS audio URL for the requested text!
 */

const VOICERSS_API_KEY = "ae8ae044c49f4afcbda7ac115f24c1c5";
const VOICERSS_URL = "https://api.voicerss.org/";

export interface TTSCacheParams {
  text: string;
  voice?: string;
  language?: string;
  preferProvider?: "voicerss";
}

export interface TTSCacheResult {
  audioUrl: string;
  provider: "voicerss";
  cacheHit: boolean;
}

/**
 * Always generate the VoiceRSS playback URL for the text.
 */
export async function getOrGenerateAudio(params: TTSCacheParams): Promise<TTSCacheResult> {
  const { text, voice = "John", language = "en-us" } = params;

  const url =
    `${VOICERSS_URL}?key=${VOICERSS_API_KEY}&hl=${language}&v=${voice}&src=${encodeURIComponent(
      text
    )}&c=MP3&f=16khz_16bit_stereo`;

  // We just return the download/playback URL (browser/audio element will fetch it directly)
  return {
    audioUrl: url,
    provider: "voicerss",
    cacheHit: false,
  };
}
