
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    // Get the API key from environment variables
    const RUNWARE_API_KEY = Deno.env.get('RUNWARE_API_KEY');
    
    if (!RUNWARE_API_KEY) {
      throw new Error('Runware API key not configured');
    }

    // Parse request body to get the actual request parameters
    const requestData = await req.json();
    
    if (!requestData || !requestData.positivePrompt) {
      throw new Error('Missing required parameters. At minimum, positivePrompt is required.');
    }
    
    console.log("Received image generation request:", JSON.stringify(requestData));
    
    // Prepare the Runware API request
    const runwarePayload = [
      {
        taskType: "authentication",
        apiKey: RUNWARE_API_KEY
      },
      {
        taskType: "imageInference",
        taskUUID: crypto.randomUUID(),
        positivePrompt: requestData.positivePrompt,
        model: requestData.model || "runware:100@1",
        width: requestData.width || 1024,
        height: requestData.height || 1024,
        numberResults: requestData.numberResults || 1,
        outputFormat: requestData.outputFormat || "WEBP",
        CFGScale: requestData.CFGScale || 1,
        scheduler: requestData.scheduler || "FlowMatchEulerDiscreteScheduler",
        strength: requestData.strength || 0.8,
        lora: requestData.lora || [],
      }
    ];
    
    // Add image transformation if inputImage is provided
    if (requestData.inputImage) {
      runwarePayload[1].taskType = "imageToImage";
      runwarePayload[1].inputImage = requestData.inputImage;
    }
    
    console.log("Calling Runware API...");
    
    // Make the request to Runware API
    const response = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(runwarePayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Runware API error:", errorData);
      throw new Error(errorData.message || 'Failed to generate image');
    }

    const data = await response.json();
    
    if (data.error || data.errors) {
      console.error("Runware API returned errors:", data.errors || data.error);
      throw new Error(data.error || data.errors[0]?.message || 'An error occurred');
    }

    const generatedImage = data.data.find((item) => 
      item.taskType === 'imageInference' || item.taskType === 'imageToImage'
    );
    
    if (!generatedImage) {
      throw new Error('No image was generated');
    }

    return new Response(
      JSON.stringify({
        imageURL: generatedImage.imageURL,
        positivePrompt: generatedImage.positivePrompt,
        seed: generatedImage.seed,
        NSFWContent: generatedImage.NSFWContent || false
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error("Error in Runware image generation function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message, 
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
