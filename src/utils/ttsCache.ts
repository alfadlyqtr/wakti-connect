import { supabase } from "@/integrations/supabase/client";
import md5 from "md5"; // We'll use md5 for fast hash
import { v4 as uuidv4 } from "uuid";

// VoiceRSS endpoint and API Key
const VOICERSS_API_KEY = "ae8ae044c49f4afcbda7ac115f24c1c5";
const VOICERSS_URL = "https://api.voicerss.org/";

// Define the Provider type to avoid string assignment issues
type Provider = "speechify" | "voicerss";

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
  const { text, voice = "Aria", language = "en", preferProvider = "speechify" } = params;
  let triedProviders: Provider[] = [];

  // Provider order: Speechify primary, VoiceRSS fallback
  const providerPriority: Provider[] =
    preferProvider === "speechify"
      ? ["speechify", "voicerss"]
      : ["voicerss", "speechify"];

  for (const provider of providerPriority) {
    triedProviders.push(provider);
    const textHash = getTextHash(text, voice, provider);

    console.log(`[TTS] Trying provider: ${provider}, text hash: ${textHash}`);

    // Step 1: Check Cache
    // FIX: Use .maybeSingle() instead of .single() to not throw if missing
    const { data: cacheData, error: cacheError } = await supabase
      .from("audio_cache" as any)
      .select("*")
      .eq("text_hash", textHash)
      .limit(1)
      .maybeSingle() as { data: AudioCacheEntry | null, error: any };

    if (cacheData && cacheData.audio_url) {
      // Update hit_count and last_accessed
      await supabase
        .from("audio_cache" as any)
        .update({
          hit_count: (cacheData.hit_count || 0) + 1,
          last_accessed: new Date().toISOString()
        })
        .eq("id", cacheData.id);

      console.log(`[TTS] Cache hit for provider: ${provider} — returning cached audio.`);
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
      if (provider === "speechify") {
        console.log("[TTS] Attempting Speechify generation...");
        audioBlob = await generateWithSpeechify(text, language, voice);
        fileExtension = ".mp3";
      } else if (provider === "voicerss") {
        console.log("[TTS] Falling back to VoiceRSS generation...");
        audioBlob = await generateWithVoiceRSS(text, language, voice);
        fileExtension = ".mp3";
      }

      if (!audioBlob) throw new Error(provider + " returned no audio blob");
      if (audioBlob.size < 1000) {
        throw new Error(`${provider} audio blob too small (size:${audioBlob.size})`);
      }

      // Step 3: Upload to storage
      const fileName = `tts-audio/${textHash}_${uuidv4()}${fileExtension}`;
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

      console.log(`[TTS] ${provider} generation and upload succeeded.`);
      return {
        audioUrl: publicUrl,
        provider,
        cacheHit: false,
      };
    } catch (err: any) {
      // LOG THE ERROR and DO NOT cache!
      console.warn(`[TTS] ${provider} audio generation failed — expected fallback.`, err);
      continue; // try fallback in the for-loop
    }
  }

  console.error(`[TTS] All providers failed: ${triedProviders.join(", ")}.`);
  throw new Error(`Failed to generate audio via providers: ${triedProviders.join(", ")} (see console for details)`);
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

  // <<--- Enhanced Handling: Check for error
  if (!response.ok) {
    const errText = await response.text();
    console.error("Speechify response error:", errText);
    throw new Error(`Failed to fetch Speechify audio: ${response.status} - ${errText}`);
  }
  const blob = await response.blob();

  // Defensive: check if the blob is an audio/mp3
  // Sometimes Speechify may return {"error":"..."} as a blob, so look for low file size
  if (blob.size < 1000) {
    // Try to parse for readable error
    let errMsg = "";
    try {
      const textPreview = await blob.text();
      errMsg = (textPreview.length < 100) ? textPreview : textPreview.slice(0, 100);
    } catch { }
    throw new Error("Speechify returned small or empty audio: " + errMsg);
  }

  return blob;
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
  const blob = await resp.blob();

  // Defensive: check if the blob is likely audio
  if (blob.size < 1000) {
    // Try to read for text error
    let errMsg = "";
    try {
      const textPreview = await blob.text();
      errMsg = (textPreview.length < 100) ? textPreview : textPreview.slice(0, 100);
    } catch { }
    throw new Error("VoiceRSS returned small or empty audio: " + errMsg);
  }
  return blob;
}
