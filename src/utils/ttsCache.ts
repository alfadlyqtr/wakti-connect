import { supabase } from "@/integrations/supabase/client";
import md5 from "md5"; // We'll use md5 for fast hash
import { v4 as uuidv4 } from "uuid";

// ElevenLabs and VoiceRSS endpoints
const ELEVENLABS_API_KEY = ""; // Will be injected from server-side secret
const VOICERSS_API_KEY = "ae8ae044c49f4afcbda7ac115f24c1c5";
const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const VOICERSS_URL = "https://api.voicerss.org/";

// Define the Provider type to avoid string assignment issues
type Provider = "elevenlabs" | "speechify" | "voicerss";

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
  const { text, voice = "Aria", language = "en", preferProvider = "elevenlabs" } = params;
  let triedProviders: Provider[] = [];

  // New provider ordering logic: elevenlabs → speechify → voicerss
  const providerPriority: Provider[] =
    preferProvider === "elevenlabs"
      ? ["elevenlabs", "speechify", "voicerss"]
      : preferProvider === "speechify"
      ? ["speechify", "elevenlabs", "voicerss"]
      : ["voicerss", "elevenlabs", "speechify"];

  for (const provider of providerPriority) {
    triedProviders.push(provider);
    const textHash = getTextHash(text, voice, provider);

    // Step 1: Check Cache
    // Use explicit type casting to handle the audio_cache table that's not in types yet
    const { data: cacheData, error: cacheError } = await supabase
      .from("audio_cache" as any)
      .select("*")
      .eq("text_hash", textHash)
      .limit(1)
      .single() as { data: AudioCacheEntry | null, error: any };

    if (cacheData) {
      // Update hit_count and last_accessed
      await supabase
        .from("audio_cache" as any)
        .update({
          hit_count: (cacheData.hit_count || 0) + 1,
          last_accessed: new Date().toISOString()
        })
        .eq("id", cacheData.id);

      return {
        audioUrl: cacheData.audio_url,
        provider,
        cacheHit: true,
      };
    }

    // Step 2: Try to Generate
    try {
      let audioBlob: Blob | null = null;
      let fileExtension = ".mp3";
      if (provider === "elevenlabs") {
        console.log("Attempting ElevenLabs generation...");
        audioBlob = await generateWithElevenLabs(text, voice, language);
        fileExtension = ".mp3";
      } else if (provider === "speechify") {
        console.log("Attempting Speechify generation...");
        audioBlob = await generateWithSpeechify(text, language, voice);
        fileExtension = ".mp3";
      } else if (provider === "voicerss") {
        console.log("Falling back to VoiceRSS generation...");
        audioBlob = await generateWithVoiceRSS(text, language, voice);
        fileExtension = ".mp3";
      }

      if (audioBlob) {
        // Step 3: Upload to storage
        const fileName = `tts-audio/${textHash}_${uuidv4()}${fileExtension}`;
        const upload = await supabase.storage
          .from("tts-audio")
          .upload(fileName, audioBlob, {
            cacheControl: "2592000", // 30 days in seconds
            upsert: true,
            contentType: "audio/mp3",
          });

        if (upload.error) throw upload.error;
        // Step 4: Store cache record
        const publicUrl = supabase.storage.from("tts-audio").getPublicUrl(fileName).data.publicUrl;
        
        // Insert the new cache entry
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
          provider,
          cacheHit: false,
        };
      }
    } catch (err) {
      console.warn(`[TTS] ${provider} audio generation failed:`, err);
      continue; // try fallback
    }
  }

  throw new Error(`Failed to generate audio via providers: ${triedProviders.join(", ")}`);
}

// --- Helper: ElevenLabs (API KEY from Supabase secret on server only!) ---
async function generateWithElevenLabs(
  text: string,
  voice: string,
  language: string = "en"
): Promise<Blob> {
  // Get the secret from Supabase Edge Function
  const apiKeyResp = await supabase.functions.invoke("get-elevenlabs-api-key", { body: {} });
  console.log("ElevenLabs API Key Response:", apiKeyResp);
  
  if (apiKeyResp.error || !apiKeyResp.data?.apiKey) {
    console.error("ElevenLabs API key missing:", apiKeyResp.error);
    throw new Error("ElevenLabs API key missing");
  }

  const apiKey = apiKeyResp.data.apiKey;
  const voiceId = voice === "Aria" ? "9BWtsMINqrJLrRacOk9x" : voice; // Map voice name to ID if needed
  
  // Fix: Changed to proper endpoint structure and added content-type header
  const response = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    }),
  });
  
  if (!response.ok) {
    console.error("ElevenLabs response error:", await response.text());
    throw new Error(`Failed to fetch ElevenLabs audio: ${response.status}`);
  }
  
  return await response.blob();
}

// --- Helper: Speechify (API KEY from Supabase secret) ---
async function generateWithSpeechify(
  text: string,
  language: string = "en",
  voice: string = "default"
): Promise<Blob> {
  // Get the secret from Supabase Edge Function
  const apiKeyResp = await supabase.functions.invoke("get-speechify-api-key", { body: {} });
  console.log("Speechify API Key Response:", apiKeyResp);

  if (apiKeyResp.error || !apiKeyResp.data?.apiKey) {
    console.error("Speechify API key missing:", apiKeyResp.error);
    throw new Error("Speechify API key missing");
  }

  const apiKey = apiKeyResp.data.apiKey;
  // Speechify API info (most Speechify endpoints are paid, so we'll use a sample endpoint as placeholder)
  // You may want to customize language/voice mapping as per your needs.
  const response = await fetch("https://api.speechify.com/tts/generate", {
    method: "POST",
    headers: {
      "apikey": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text,
      language: language,
      voice: voice,
      outputFormat: "mp3"
    }),
  });

  if (!response.ok) {
    console.error("Speechify response error:", await response.text());
    throw new Error(`Failed to fetch Speechify audio: ${response.status}`);
  }

  return await response.blob();
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
