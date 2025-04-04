
import React, { useState, useRef, useEffect } from "react";
import { ImageIcon, Loader2, X, Mic, Camera, Upload, MicOff, SwitchCamera } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIImageGeneration } from "@/hooks/ai/useAIImageGeneration";
import { Card } from "@/components/ui/card";
import { useSpeechRecognition } from "@/hooks/ai/useSpeechRecognition";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ImageGenerationToolCardProps {
  onPromptUse?: (prompt: string) => void;
  onImageGenerate?: (imageUrl: string, prompt: string) => void;
}

export const ImageGenerationToolCard: React.FC<ImageGenerationToolCardProps> = ({
  onPromptUse,
  onImageGenerate
}) => {
  const [prompt, setPrompt] = useState("");
  const { 
    generateImage, 
    isGenerating, 
    generatedImage,
    clearGeneratedImage,
    referenceImage,
    setUploadedReferenceImage,
    setCapturedReferenceImage,
    clearReferenceImage
  } = useAIImageGeneration();
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const { toast } = useToast();

  // Speech recognition for voice input
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    supported: speechSupported
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true
  });

  // Update prompt when transcript changes
  useEffect(() => {
    if (transcript) {
      setPrompt(transcript);
    }
  }, [transcript]);

  // Check for multiple cameras
  useEffect(() => {
    const checkCameras = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
          return;
        }
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      } catch (error) {
        console.error("Error checking cameras:", error);
      }
    };
    
    checkCameras();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    const result = await generateImage.mutateAsync(prompt);
    
    // If the parent component needs to know about the generated image
    if (onImageGenerate && result) {
      onImageGenerate(result.imageUrl, result.prompt);
    }
  };

  const handleUsePrompt = () => {
    if (onPromptUse && prompt) {
      onPromptUse(prompt);
    }
  };

  const handleToggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      setPrompt("");
      startListening();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Use the selected image as a reference
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Set the reference image
        setUploadedReferenceImage(reader.result, file.name);
        
        // Set a default prompt for the uploaded image
        setPrompt(`Enhance this image and apply an artistic style`);
        
        toast({
          title: "Image uploaded",
          description: "You can now describe what you want to do with this image",
        });
      }
    };
    reader.readAsDataURL(file);
    
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openCamera = async () => {
    try {
      setShowCamera(true);
      await startCameraStream();
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const startCameraStream = async () => {
    try {
      if (streamActive && videoRef.current?.srcObject) {
        // Stop the current stream first
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreamActive(true);
      }
    } catch (error) {
      console.error("Error starting camera stream:", error);
      throw error;
    }
  };

  const switchCamera = async () => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    
    try {
      await startCameraStream();
    } catch (error) {
      console.error("Error switching camera:", error);
      toast({
        title: "Camera Switch Failed",
        description: "Could not switch cameras. This device might only have one camera.",
        variant: "destructive"
      });
    }
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedReferenceImage(imageDataUrl);
        
        // Set a default prompt for the captured image
        setPrompt("Enhance this photo and apply an artistic style");
        
        // Close camera
        closeCamera();
        
        toast({
          title: "Image captured",
          description: "You can now describe what you want to do with this image",
        });
      }
    }
  };

  const closeCamera = () => {
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setStreamActive(false);
    }
    setShowCamera(false);
  };

  return (
    <AIToolCard
      icon={ImageIcon}
      title="Image Generation"
      description="Generate images using AI based on your descriptions"
      iconColor="text-purple-500"
    >
      <div className="space-y-3">
        {/* Reference image display (if any) */}
        {referenceImage && (
          <Card className="relative overflow-hidden mt-3 border-dashed">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
              onClick={clearReferenceImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="aspect-square relative">
              <img 
                src={referenceImage.dataUrl} 
                alt={referenceImage.type === 'upload' ? referenceImage.fileName || 'Uploaded image' : 'Captured image'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 text-xs text-muted-foreground bg-muted/50">
              {referenceImage.type === 'upload' ? 'Uploaded image' : 'Captured image'}
            </div>
          </Card>
        )}
        
        <Textarea
          placeholder={isListening ? "Listening..." : "Describe the image you want to generate..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px]"
          disabled={isGenerating || isListening}
        />
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Generate Image"}
          </Button>
          
          {onPromptUse && (
            <Button 
              variant="secondary"
              onClick={handleUsePrompt}
              disabled={!prompt.trim() || isGenerating}
              className="flex-shrink-0"
            >
              Use Prompt
            </Button>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          {/* Voice input */}
          {speechSupported && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleToggleMicrophone}
              className={isListening ? "bg-red-100 border-red-300" : ""}
              title={isListening ? "Stop listening" : "Speak your prompt"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
          
          {/* File upload */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleFileUpload}
            title="Upload an image"
          >
            <Upload className="h-4 w-4" />
          </Button>
          
          {/* Camera capture */}
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={openCamera}
            title="Take a picture"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        {generatedImage && (
          <Card className="relative overflow-hidden mt-3 border-dashed">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
              onClick={clearGeneratedImage}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="aspect-square relative">
              <img 
                src={generatedImage.imageUrl} 
                alt={generatedImage.prompt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-2 text-xs text-muted-foreground bg-muted/50">
              {generatedImage.prompt}
            </div>
          </Card>
        )}
      </div>
      
      {/* Camera Dialog */}
      <Dialog open={showCamera} onOpenChange={setShowCamera}>
        <DialogContent onInteractOutside={closeCamera}>
          <DialogHeader>
            <DialogTitle>Take a Picture</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4">
            <div className="bg-black rounded-lg overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-auto"
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={closeCamera}>Cancel</Button>
                {hasMultipleCameras && (
                  <Button 
                    variant="outline" 
                    onClick={switchCamera}
                    title={facingMode === "user" ? "Switch to back camera" : "Switch to front camera"}
                  >
                    <SwitchCamera className="h-4 w-4 mr-2" />
                    {facingMode === "user" ? "Back Camera" : "Front Camera"}
                  </Button>
                )}
              </div>
              <Button onClick={takePicture}>Take Picture</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </AIToolCard>
  );
};
