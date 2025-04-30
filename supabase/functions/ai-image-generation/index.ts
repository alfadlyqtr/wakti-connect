
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

    console.log("Processing image generation request with prompt:", prompt);

    // Get API key from Supabase secrets
    const RUNWARE_API_KEY = Deno.env.get("RUNWARE_API_KEY");

    if (!RUNWARE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Runware API key is not configured" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
    
    // Use Runware API for image generation
    try {
      console.log("Using Runware API for image generation");
      
      // Check if the imageUrl is a data URL and extract the base64 content
      let base64Image = undefined;
      if (imageUrl && imageUrl.startsWith('data:image')) {
        base64Image = imageUrl.split(',')[1];
      }
      
      // Create a simplified version of the prompt for better Runware compatibility
      const simplifiedPrompt = `${prompt} Digital invitation card design, 5.78" × 2.82", with space for text.`;
      
      // Prepare the payload for Runware API with optimized parameters
      const runwarePayload = [
        {
          "taskType": "authentication",
          "apiKey": RUNWARE_API_KEY
        },
        {
          "taskType": base64Image ? "imageToImage" : "imageInference",
          "taskUUID": crypto.randomUUID(),
          "positivePrompt": simplifiedPrompt,
          "model": "runware:100@1",
          "width": 1024,
          "height": 512, // Adjusted to match aspect ratio closer to 5.78" × 2.82"
          "numberResults": 1,
          "outputFormat": "WEBP",
          "CFGScale": 12.0,
          "scheduler": "FlowMatchEulerDiscreteScheduler",
          "strength": 0.9,
        }
      ];
      
      // Add inputImage for image-to-image transformation
      if (base64Image) {
        runwarePayload[1].inputImage = base64Image;
      }
      
      // Call Runware API
      console.log("Making Runware API request with prompt:", simplifiedPrompt);
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
      
      if (!runwareData || !runwareData.data) {
        console.error("Invalid Runware API response:", runwareData);
        throw new Error("Invalid response from Runware API");
      }
      
      const imageResult = runwareData.data.find(item => 
        item.taskType === "imageInference" || item.taskType === "imageToImage"
      );
      
      if (!imageResult || !imageResult.imageURL) {
        console.error("No image URL in Runware response:", runwareData);
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
      return new Response(
        JSON.stringify({ error: `Image generation failed: ${runwareError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error: any) {
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
