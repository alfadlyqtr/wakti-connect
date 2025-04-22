
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to generate prompts based on language
const generateSummaryPrompt = (text: string, language: string) => {
  // Detect the language if set to auto
  if (language === 'auto' || language === 'mixed') {
    // Simple check for Arabic characters
    const hasArabicChars = /[\u0600-\u06FF]/.test(text);
    const hasEnglishChars = /[a-zA-Z]/.test(text);
    
    if (hasArabicChars && hasEnglishChars) {
      // For mixed language (bilingual) content
      return `
        You are an intelligent assistant specialized in summarizing bilingual meetings with both Arabic and English content.
        Please analyze the following bilingual meeting transcript that contains both Arabic and English text.
        
        Create a well-formatted summary that respects both languages. When a section was mainly discussed in Arabic, 
        summarize that section in Arabic. When a section was mainly in English, summarize that section in English.
        
        In your summary, please include:
        - A meeting title that reflects the content (in the predominant language of the meeting)
        - A brief overview of the main discussion (3-4 sentences)
        - Key points discussed (bullet points)
        - Action items, decisions, or tasks (if any)
        - Any deadlines or important dates (if any)
        
        Meeting transcript:
        ${text}
        
        Bilingual Meeting Summary:
      `;
    } else if (hasArabicChars) {
      language = 'ar';
    } else {
      language = 'en';
    }
  }
  
  if (language === 'ar') {
    return `
      أنت مساعد ذكي متخصص في تلخيص الاجتماعات. يرجى تحليل النص التالي من اجتماع وإنشاء ملخص منظم بتنسيق مفيد.
      
      في ملخصك، يرجى تضمين:
      - عنوان الاجتماع (استنادًا إلى المحتوى)
      - ملخص موجز للمناقشة الرئيسية (3-4 جمل)
      - النقاط الرئيسية التي تمت مناقشتها (نقاط)
      - عناصر العمل أو القرارات أو المهام (إذا وُجدت)
      - أي مواعيد نهائية أو تواريخ مهمة (إذا وُجدت)
      
      الرجاء الإجابة بالعربية الفصحى.
      
      نص الاجتماع:
      ${text}
      
      ملخص الاجتماع:
    `;
  } else {
    return `
      You are an intelligent assistant specialized in meeting summarization. Please analyze the following meeting transcript and create an organized, well-formatted summary.
      
      In your summary, please include:
      - A meeting title (based on the content)
      - A brief overview of the main discussion (3-4 sentences)
      - Key points discussed (bullet points)
      - Action items, decisions, or tasks (if any)
      - Any deadlines or important dates (if any)
      
      Meeting transcript:
      ${text}
      
      Meeting Summary:
    `;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("AI meeting summary service starting");
    
    // Try DeepSeek API key first, then fall back to OpenAI
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!DEEPSEEK_API_KEY && !OPENAI_API_KEY) {
      throw new Error('No API keys available for AI services');
    }
    
    // Get request body
    const requestData = await req.json();
    const { text, language = 'auto' } = requestData;
    
    if (!text) {
      throw new Error('No transcript text provided');
    }
    
    console.log(`Processing summary with language: ${language}`);
    const prompt = generateSummaryPrompt(text, language);
    let summary = '';
    
    // Try DeepSeek first if available
    if (DEEPSEEK_API_KEY) {
      try {
        console.log("Attempting DeepSeek summary generation");
        
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: 'You are a multilingual meeting summarization assistant skilled in both Arabic and English.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1024,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`DeepSeek API error (${response.status}):`, errorText);
          throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        summary = result.choices[0].message.content;
        console.log("Summary generated by DeepSeek");
      } catch (error) {
        console.error("DeepSeek summary failed, falling back to OpenAI:", error);
        // Fall through to OpenAI fallback
      }
    }
    
    // Fallback to OpenAI if DeepSeek fails or isn't available
    if (!summary && OPENAI_API_KEY) {
      try {
        console.log("Attempting OpenAI summary generation");
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'You are a multilingual meeting summarization assistant skilled in both Arabic and English.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1024,
          }),
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`OpenAI API error (${response.status}):`, errorText);
          throw new Error(`OpenAI API error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        summary = result.choices[0].message.content;
        console.log("Summary generated by OpenAI");
      } catch (error) {
        console.error("OpenAI summary failed:", error);
        throw error; // No more fallbacks, propagate the error
      }
    }
    
    if (!summary) {
      throw new Error('Failed to generate summary with any available service');
    }
    
    // Detect if the summary is in Arabic for front-end display purposes
    const isArabic = /[\u0600-\u06FF]/.test(summary);
    
    return new Response(
      JSON.stringify({ 
        summary, 
        source: DEEPSEEK_API_KEY ? 'deepseek' : 'openai',
        isRTL: isArabic
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in AI meeting summary function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
