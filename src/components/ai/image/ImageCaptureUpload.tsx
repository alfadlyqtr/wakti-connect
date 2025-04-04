
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, RefreshCw, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIImageGeneration } from '@/hooks/ai/useAIImageGeneration';

interface ImageCaptureUploadProps {
  onImageCaptured?: (image: string) => void;
  allowRegenerations?: boolean;
}

const ImageCaptureUpload: React.FC<ImageCaptureUploadProps> = ({ 
  onImageCaptured,
  allowRegenerations = true
}) => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { generateImage, isGenerating, generatedImage, clearGeneratedImage } = useAIImageGeneration();

  // Start camera
  const startCamera = async () => {
    try {
      setShowCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
      setShowCamera(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  // Take picture
  const takePicture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context) {
        toast({
          title: "Error",
          description: "Could not get canvas context",
          variant: "destructive"
        });
        return;
      }
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      // Call the callback if provided
      if (onImageCaptured) {
        onImageCaptured(imageDataUrl);
      }
      
      // Stop camera
      stopCamera();
    } catch (error) {
      console.error("Error capturing image:", error);
      toast({
        title: "Capture Error",
        description: "Failed to capture image",
        variant: "destructive"
      });
    } finally {
      setIsCapturing(false);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setCapturedImage(imageDataUrl);
      
      // Call the callback if provided
      if (onImageCaptured) {
        onImageCaptured(imageDataUrl);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read file",
        variant: "destructive"
      });
    };
    
    reader.readAsDataURL(file);
  };

  // Clear image
  const clearImage = () => {
    setCapturedImage(null);
    clearGeneratedImage();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle regeneration
  const handleRegenerate = async () => {
    if (!capturedImage) return;
    
    try {
      await generateImage.mutateAsync("Recreate this image with artistic improvements, more details and better quality");
    } catch (error) {
      console.error("Error regenerating image:", error);
      toast({
        title: "Regeneration Failed",
        description: "Could not regenerate the image",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-primary" />
          <span>Image Capture</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {showCamera ? (
          <div className="flex flex-col gap-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video 
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={stopCamera}>
                Cancel
              </Button>
              <Button onClick={takePicture} disabled={isCapturing}>
                {isCapturing ? "Capturing..." : "Take Photo"}
              </Button>
            </div>
          </div>
        ) : capturedImage || generatedImage ? (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
              <img 
                src={generatedImage?.imageUrl || capturedImage || ''}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            </div>
            
            {generatedImage && (
              <div className="p-2 bg-muted/20 rounded-lg border border-dashed">
                <h4 className="text-sm font-medium flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  AI Enhanced
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {generatedImage.prompt}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <Button 
                variant="outline" 
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={startCamera}
              >
                <Camera className="h-8 w-8" />
                <span className="text-xs">Take Photo</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col h-24 items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8" />
                <span className="text-xs">Upload Image</span>
              </Button>
            </div>
            
            <input 
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
      
      {(capturedImage || generatedImage) && (
        <CardFooter className="flex justify-between border-t pt-4 pb-4">
          <Button variant="outline" size="sm" onClick={clearImage}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear
          </Button>
          
          {allowRegenerations && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleRegenerate}
              disabled={isGenerating}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? "Regenerating..." : "Regenerate"}
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ImageCaptureUpload;
