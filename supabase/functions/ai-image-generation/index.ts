
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Add CORS headers
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request data
    const requestData = await req.json();
    const { prompt, imageUrl } = requestData;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get API keys from Supabase secrets
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const RUNWARE_API_KEY = Deno.env.get("RUNWARE_API_KEY");

    if (!OPENAI_API_KEY && !RUNWARE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "No image generation API keys configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Processing image generation request");
    
    // Try Runware first if API key is available
    if (RUNWARE_API_KEY) {
      try {
        console.log("Attempting to use Runware API for image generation");
        
        // Check if the imageUrl is a data URL and extract the base64 content for image-to-image
        let base64Image = undefined;
        if (imageUrl && imageUrl.startsWith('data:image')) {
          base64Image = imageUrl.split(',')[1];
        }
        
        // Prepare the payload for Runware API
        const runwarePayload = [
          {
            "taskType": "authentication",
            "apiKey": RUNWARE_API_KEY
          },
          {
            "taskType": base64Image ? "imageToImage" : "imageInference",
            "taskUUID": crypto.randomUUID(),
            "positivePrompt": prompt,
            "model": "runware:100@1",
            "width": 1024,
            "height": 1024,
            "numberResults": 1,
            "outputFormat": "WEBP",
            "CFGScale": 7.5,
            "scheduler": "DPMSolverMultistepScheduler",
            "strength": 0.75
          }
        ];
        
        // Add inputImage for image-to-image transformation
        if (base64Image) {
          runwarePayload[1].inputImage = base64Image;
        }
        
        // Call Runware API
        console.log("Making Runware API request");
        const runwareResponse = await fetch('https://api.runware.ai/v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(runwarePayload)
        });
        
        if (!runwareResponse.ok) {
          const errorText = await runwareResponse.text();
          console.error("Runware API error:", errorText);
          throw new Error(`Runware API error: ${errorText}`);
        }
        
        const runwareData = await runwareResponse.json();
        console.log("Runware API response received");
        
        const imageResult = runwareData.data.find(item => 
          item.taskType === "imageInference" || item.taskType === "imageToImage"
        );
        
        if (!imageResult || !imageResult.imageURL) {
          throw new Error("No image URL in Runware response");
        }
        
        // Return the image URL and metadata
        return new Response(
          JSON.stringify({ 
            id: crypto.randomUUID(),
            imageUrl: imageResult.imageURL,
            originalImageUrl: imageUrl || null,
            prompt,
            seed: imageResult.seed || 0,
            NSFWContent: imageResult.NSFWContent || false,
            provider: "runware",
            isTransformation: !!imageUrl
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      } catch (runwareError) {
        console.error("Runware API processing error:", runwareError);
        console.log("Falling back to OpenAI for image generation");
        // Fall through to OpenAI fallback
      }
    }
    
    // Use OpenAI as default or fallback if Runware fails
    if (OPENAI_API_KEY) {
      console.log("Using OpenAI for image generation");
      
      // Set up OpenAI API options
      const apiUrl = 'https://api.openai.com/v1/images/generations';
      const openaiRequestBody = {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      };
      
      if (imageUrl) {
        // If this was an image transformation request, enhance the prompt
        openaiRequestBody.prompt = `Transform the following scene into a new style: ${prompt}. 
        Maintain the exact same composition, subjects, and scene but render it in a 
        different artistic style.`;
        
        openaiRequestBody.quality = "hd";
        openaiRequestBody.style = "vivid";
      }
      
      console.log("Making OpenAI API request with model:", openaiRequestBody.model);
      
      // Call OpenAI API to generate image
      const openaiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(openaiRequestBody)
      });

      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error("OpenAI API error:", errorText);
        
        return new Response(
          JSON.stringify({ error: `OpenAI API error: ${errorText}` }),
          { 
            status: openaiResponse.status, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }

      const data = await openaiResponse.json();
      const generatedImageUrl = data.data[0].url;
      
      console.log("Image generated successfully with OpenAI");

      // Return the image URL and related info
      return new Response(
        JSON.stringify({ 
          id: crypto.randomUUID(),
          imageUrl: generatedImageUrl,
          originalImageUrl: imageUrl || null,
          prompt,
          provider: "openai",
          isTransformation: !!imageUrl
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // If we get here, both Runware and OpenAI have failed
    return new Response(
      JSON.stringify({ error: "All image generation services failed" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error in image generation:", error);
    
    return new Response(
      JSON.stringify({ error: `Image generation failed: ${error.message}` }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
