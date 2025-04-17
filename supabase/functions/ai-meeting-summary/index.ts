
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://esm.sh/openai@4.17.5";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });

    if (!Deno.env.get('OPENAI_API_KEY')) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Get request body
    const { text, duration, language = 'en' } = await req.json();
    
    if (!text) {
      throw new Error('No text provided for summarization');
    }
    
    console.log("Generating meeting summary for text of length:", text.length);
    
    // Create prompt based on language
    let prompt: string;
    
    if (language === 'ar') {
      prompt = `أنت مساعد متخصص في إنشاء ملخصات للاجتماعات.
      
      الاجتماع الذي استمر ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')} دقيقة لديه النص المكتوب التالي:
      
      ${text}
      
      لخص الاجتماع أعلاه. قم بتضمين النقاط الرئيسية، والقرارات، والمهام، والالتزامات. نظّم الملخص باستخدام عناوين فرعية (النقاط الرئيسية، القرارات، إلخ) ونقاط رئيسية. حاول الحفاظ على الملخص مختصرًا ولكن شاملًا.`;
    } else {
      prompt = `You are a professional assistant that creates meeting summaries. 
      
      The meeting that lasted ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')} minutes has the following transcript:
      
      ${text}
      
      Summarize the above meeting. Include key points, decisions, tasks, and commitments. Organize the summary using subheadings (Key Points, Decisions, etc.) and bullet points. Try to keep the summary concise but comprehensive.`;
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You create accurate, well-structured meeting summaries from transcripts." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1500,
    });

    const summary = response.choices[0].message.content;
    
    // Detect location as a bonus feature
    const detectLocation = async (transcript: string): Promise<string | null> => {
      try {
        // Simple location detection logic can be done here or on the client
        const locationMatches = transcript.match(/(?:meeting|conference|located|held|happening|taking place|will be|scheduled)\s+(?:at|in)\s+(?:the\s+)?([A-Za-z0-9\s,]+(?:Building|Office|Center|Room|Hall|Tower|Plaza|Street|Avenue|Road|Boulevard|Place|Square|Park|Campus|Floor|Suite|Theater|Arena|Stadium|Hotel|Conference|Center|Venue))/i);
        
        if (locationMatches && locationMatches[1]) {
          return locationMatches[1].trim();
        }
        
        return null;
      } catch (err) {
        console.error("Error detecting location:", err);
        return null;
      }
    };
    
    // Detect location from transcript
    const location = await detectLocation(text);

    return new Response(
      JSON.stringify({ 
        summary,
        location
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in ai-meeting-summary function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
