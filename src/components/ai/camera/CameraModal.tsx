
import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw, X, CheckCircle, Loader2, ZapIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { generateUUID } from '@/lib/utils/uuid';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageFile: File, imagePreview: string) => void;
}

export const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // Start camera when modal opens
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setIsCaptured(false);
    }
    // Clean up on unmount
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (streamRef.current) {
        stopCamera();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode, 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(err instanceof Error ? err.message : 'Could not access camera');
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isStreaming) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Match canvas dimensions to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw the current video frame to the canvas
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to file and data URL
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `camera-capture-${generateUUID()}.jpg`, { type: 'image/jpeg' });
          const imageUrl = URL.createObjectURL(blob);
          setIsCaptured(true);
          onCapture(file, imageUrl);
        }
      }, 'image/jpeg', 0.85);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleRetake = () => {
    setIsCaptured(false);
    startCamera();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Camera Capture</DialogTitle>
        </DialogHeader>
        
        <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-20 p-4">
              <X className="h-12 w-12 text-red-500 mb-2" />
              <p className="text-white text-center">{error}</p>
              <Button onClick={startCamera} variant="outline" className="mt-4">
                Try Again
              </Button>
            </div>
          )}
          
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted
            className={cn(
              "w-full h-full object-cover transition-opacity",
              isCaptured ? "opacity-0" : "opacity-100"
            )}
            onCanPlay={() => setIsLoading(false)}
          />
          
          {/* Hidden canvas for capturing */}
          <canvas ref={canvasRef} className="hidden" />
          
          {isCaptured && canvasRef.current && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={canvasRef.current.toDataURL('image/jpeg')} 
                alt="Captured" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-row justify-between sm:justify-between space-x-2">
          {!isCaptured ? (
            <>
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClose}
              >
                Cancel
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={switchCamera}
                  className="rounded-full h-12 w-12"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
                
                <motion.button
                  type="button"
                  className="bg-primary text-primary-foreground h-14 w-14 rounded-full flex items-center justify-center shadow-lg border-4 border-background"
                  whileTap={{ scale: 0.9 }}
                  onClick={captureImage}
                  disabled={!isStreaming || isLoading}
                >
                  <Camera className="h-6 w-6" />
                </motion.button>
              </div>
            </>
          ) : (
            <>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleRetake}
              >
                Retake
              </Button>
              
              <Button 
                type="button" 
                onClick={handleClose}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Use Photo
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
