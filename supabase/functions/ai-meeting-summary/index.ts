
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
    
    // Format duration properly
    const formattedDuration = `${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;
    
    // Create prompt based on language
    let prompt: string;
    let systemPrompt: string;
    
    // Check if text contains Arabic
    const containsArabic = /[\u0600-\u06FF]/.test(text);
    
    // System prompt with multilingual capabilities
    systemPrompt = "You are a meeting summary specialist creating clear, structured, and professional summaries with a focus on key points, decisions, and action items. Format using markdown with ## for headings. Support both English and Arabic languages or mixed content.";
    
    if (language === 'ar' || (language === 'mix' && containsArabic)) {
      prompt = `أنت مساعد متخصص في إنشاء ملخصات للاجتماعات عالية الجودة والاحترافية.
      
      الاجتماع الذي استمر ${formattedDuration} دقيقة لديه النص المكتوب التالي:
      
      ${text}
      
      لخص الاجتماع أعلاه بشكل احترافي واحرص على:
      1. تحديد النقاط الرئيسية والمواضيع المهمة
      2. تلخيص القرارات الأساسية التي تم اتخاذها
      3. تحديد المهام المعينة مع ذكر الأشخاص المسؤولين عنها إذا تم ذكرهم
      4. تنظيم الملخص باستخدام عناوين رئيسية واضحة مثل: "النقاط الرئيسية"، "القرارات"، "المهام"، "الخطوات التالية"
      5. استخدام نقاط رئيسية للمعلومات المهمة
      6. أبرز الكلمات المهمة مثل التواريخ والأرقام والمصطلحات التقنية والأسماء
      7. اقترح عنوانًا مناسبًا للاجتماع واجعله العنوان الرئيسي في بداية الملخص (استخدم # للعنوان)

      قدم ملخصًا احترافيًا منظمًا يمكن مشاركته مع فريق العمل. استخدم لغة رسمية ومهنية.`;
    } else if (language === 'mix') {
      // For mixed content (but primarily English)
      prompt = `You are a professional meeting summarization specialist who creates high-quality, well-structured meeting summaries. This meeting contains mixed language content that may include both English and Arabic.
      
      The meeting that lasted ${formattedDuration} minutes has the following transcript:
      
      ${text}
      
      Create a professional summary of the above meeting that:
      1. Identifies the key points and important topics discussed
      2. Summarizes essential decisions that were made
      3. Lists action items with assigned individuals if mentioned
      4. Organizes the summary using clear section headings like "Key Points", "Decisions", "Action Items", "Next Steps"
      5. Uses bullet points for important information
      6. Highlights important terms such as dates, numbers, technical terms, and names
      7. Creates an appropriate title for the meeting and makes it the main heading at the beginning of the summary (use # for the title)
      
      If there is Arabic content, maintain it in Arabic and properly format it. Respond in the primary language of the transcript, or use both languages if the meeting was conducted bilingually.

      Format the output with ## for main headings and bullet points for lists. Create a concise but comprehensive summary that would be suitable for sharing with a professional team.`;
    } else {
      // English default
      prompt = `You are a professional meeting summarization specialist who creates high-quality, well-structured meeting summaries.
      
      The meeting that lasted ${formattedDuration} minutes has the following transcript:
      
      ${text}
      
      Create a professional summary of the above meeting that:
      1. Identifies the key points and important topics discussed
      2. Summarizes essential decisions that were made
      3. Lists action items with assigned individuals if mentioned
      4. Organizes the summary using clear section headings like "Key Points", "Decisions", "Action Items", "Next Steps"
      5. Uses bullet points for important information
      6. Highlights important terms such as dates, numbers, technical terms, and names
      7. Creates an appropriate title for the meeting and makes it the main heading at the beginning of the summary (use # for the title)
      
      Format the output with ## for main headings and bullet points for lists. Create a concise but comprehensive summary that would be suitable for sharing with a professional team.`;
    }

    // Call OpenAI API with improved model and parameters
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the latest model for better results
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: 0.3, // Lower temperature for more focused responses
      max_tokens: 1500,
    });

    const summary = response.choices[0].message.content;
    
    // Enhanced location and title detection
    const detectMeetingInfo = async (transcript: string, summary: string): Promise<{location: string | null, title: string | null}> => {
      try {
        // More comprehensive location detection patterns
        const locationPatterns = [
          // Meeting locations
          /(?:meeting|conference|located|held|happening|taking place|will be|scheduled)\s+(?:at|in)\s+(?:the\s+)?([A-Za-z0-9\s,]+(?:Building|Office|Center|Room|Hall|Tower|Plaza|Street|Avenue|Road|Boulevard|Place|Square|Park|Campus|Floor|Suite|Theater|Arena|Stadium|Hotel|Conference|Center|Venue))/i,
          // Room numbers or specific locations
          /(?:room|location|place|venue)\s+(?:is|will be|at)\s+(?:the\s+)?([A-Za-z0-9\s\-]+)/i,
          // Address patterns
          /(?:address is|located at|taking place at)\s+([0-9]+\s+[A-Za-z\s]+(?:Street|Avenue|Road|Boulevard|Lane|Drive|Place|Court))/i,
          // Arabic location patterns
          /(?:مكان|قاعة|غرفة|موقع)\s+(?:هو|في|الاجتماع)\s+(.+?)(?:\.|\n|$)/i
        ];
        
        // Title detection from summary (preferred approach)
        let title: string | null = null;
        const titleMatch = summary.match(/^# (.+?)$/m);
        if (titleMatch && titleMatch[1]) {
          title = titleMatch[1].trim();
        }
        
        // Try each location pattern
        let location: string | null = null;
        for (const pattern of locationPatterns) {
          const matches = transcript.match(pattern);
          if (matches && matches[1]) {
            location = matches[1].trim();
            break;
          }
        }
        
        return { location, title };
      } catch (err) {
        console.error("Error detecting meeting info:", err);
        return { location: null, title: null };
      }
    };
    
    // Detect location and title from transcript and summary
    const { location, title } = await detectMeetingInfo(text, summary);

    return new Response(
      JSON.stringify({ 
        summary,
        location,
        title
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
