
import { supabase } from "@/integrations/supabase/client";
import md5 from "md5"; // We'll use md5 for fast hash
import { v4 as uuidv4 } from "uuid";

// ElevenLabs and VoiceRSS endpoints
const ELEVENLABS_API_KEY = ""; // Will be injected from server-side secret
const VOICERSS_API_KEY = "ae8ae044c49f4afcbda7ac115f24c1c5";
const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech";
const VOICERSS_URL = "https://api.voicerss.org/";

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
  for (const provider of [preferProvider, preferProvider === "elevenlabs" ? "voicerss" : "elevenlabs"]) {
    triedProviders.push(provider as Provider);
    const textHash = getTextHash(text, voice, provider as Provider);

    // Step 1: Check Cache
    const { data: cacheItems, error: cacheError } = await supabase
      .from("audio_cache")
      .select("*")
      .eq("text_hash", textHash)
      .maybeSingle();

    if (cacheItems && cacheItems.audio_url) {
      // Update hit_count and last_accessed
      await supabase
        .from("audio_cache")
        .update({
          hit_count: (cacheItems.hit_count || 0) + 1,
          last_accessed: new Date().toISOString(),
        })
        .eq("id", cacheItems.id);

      return {
        audioUrl: cacheItems.audio_url,
        provider,
        cacheHit: true,
      };
    }

    // Step 2: Try to Generate
    try {
      let audioBlob: Blob | null = null;
      let fileExtension = ".mp3";
      if (provider === "elevenlabs") {
        audioBlob = await generateWithElevenLabs(text, voice, language);
        fileExtension = ".mp3";
      } else if (provider === "voicerss") {
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
        await supabase.from("audio_cache").insert({
          text_hash: textHash,
          text,
          voice,
          tts_provider: provider,
          audio_url: publicUrl,
          created_at: new Date().toISOString(),
          last_accessed: new Date().toISOString(),
          hit_count: 1,
        });

        return {
          audioUrl: publicUrl,
          provider: provider as Provider,
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
  if (apiKeyResp.error || !apiKeyResp.data?.apiKey)
    throw new Error("ElevenLabs API key missing");

  const apiKey = apiKeyResp.data.apiKey;
  const voiceId = voice || "9BWtsMINqrJLrRacOk9x"; // Default: Aria
  const body = {
    text,
    voice_id: voiceId,
    model_id: "eleven_multilingual_v2", // Or let user pick
    output_format: "mp3",
  };
  const response = await fetch(`${ELEVENLABS_URL}/${voiceId}/stream`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2"
    }),
  });
  if (!response.ok) throw new Error("Failed to fetch ElevenLabs audio");
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

