import { supabase } from "@/integrations/supabase/client";
import md5 from "md5"; // We'll use md5 for fast hash
import { v4 as uuidv4 } from "uuid";

// ElevenLabs and VoiceRSS endpoints
const ELEVENLABS_API_KEY = ""; // Will be injected from server-side secret
const VOICERSS_API_KEY = "ae8ae044c49f4afcbda7ac115f24c1c5";
const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const VOICERSS_URL = "https://api.voicerss.org/";

// Define the Provider type to avoid string assignment issues
type Provider = "elevenlabs" | "voicerss";

export interface TTSCacheParams {
  text: string;
  voice?: string;
  language?: string;
  preferProvider?: Provider;
}

export interface TTSCacheResult {
  audioUrl: string;
  provider: Provider;
  cacheHit: boolean;
}

// Define the type for cache entry
interface AudioCacheEntry {
  id: string;
  text_hash: string;
  text: string;
  voice: string;
  tts_provider: string;
  audio_url: string;
  created_at: string; 
  last_accessed: string;
  hit_count: number;
}

/**
 * Generate a hash for the given text and voice params, for cache lookup.
 */
const getTextHash = (text: string, voice: string, provider: Provider) =>
  md5(`${text}|${voice || ""}|${provider}`);

/**
 * Checks for a cached audio clip in Supabase for this text/voice/provider.
 * If not found, generates the audio and caches it.
 */
export async function getOrGenerateAudio(params: TTSCacheParams): Promise<TTSCacheResult> {
  const { text, voice = "Aria", language = "en", preferProvider = "voicerss" } = params;
  const provider: Provider = "voicerss";
  const textHash = getTextHash(text, voice, provider);

  // Step 1: Check Cache
  const { data: cacheData, error: cacheError } = await supabase
    .from("audio_cache" as any)
    .select("*")
    .eq("text_hash", textHash)
    .limit(1)
    .single() as { data: AudioCacheEntry | null, error: any };

  if (cacheData) {
    await supabase
      .from("audio_cache" as any)
      .update({
        hit_count: (cacheData.hit_count || 0) + 1,
        last_accessed: new Date().toISOString()
      })
      .eq("id", cacheData.id);

    return {
      audioUrl: cacheData.audio_url,
      provider: provider,
      cacheHit: true,
    };
  }

  // Only use VoiceRSS to generate audio now
  try {
    const audioBlob = await generateWithVoiceRSS(text, language, voice);
    const fileName = `tts-audio/${textHash}_${uuidv4()}.mp3`;
    const upload = await supabase.storage
      .from("tts-audio")
      .upload(fileName, audioBlob, {
        cacheControl: "2592000",
        upsert: true,
        contentType: "audio/mp3",
      });

    if (upload.error) throw upload.error;
    const publicUrl = supabase.storage.from("tts-audio").getPublicUrl(fileName).data.publicUrl;
    await supabase
      .from("audio_cache" as any)
      .insert({
        text_hash: textHash,
        text: text,
        voice: voice,
        tts_provider: provider,
        audio_url: publicUrl,
        created_at: new Date().toISOString(),
        last_accessed: new Date().toISOString(),
        hit_count: 1
      });

    return {
      audioUrl: publicUrl,
      provider: provider,
      cacheHit: false,
    };
  } catch (err) {
    throw new Error(`Failed to generate audio: ${err}`);
  }
}

// --- Helper: VoiceRSS (free/public) ---
async function generateWithVoiceRSS(
  text: string,
  language: string = "en-us",
  voice: string = "John"
): Promise<Blob> {
  const url =
    `${VOICERSS_URL}?key=${VOICERSS_API_KEY}&hl=${language}&v=${voice}&src=${encodeURIComponent(
      text
    )}&c=MP3&f=16khz_16bit_stereo`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error("VoiceRSS failed");
  return await resp.blob();
}
