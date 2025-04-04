
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import ImageCaptureUpload from '@/components/ai/image/ImageCaptureUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Camera, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ImageCapturePage = () => {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const handleImageCaptured = (image: string) => {
    setCapturedImage(image);
    console.log("Image captured:", image.substring(0, 50) + "...");
  };

  return (
    <Container className="py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Image Capture Demo</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Photo Capture and Enhancement
          </CardTitle>
          <CardDescription>
            Take a photo with your camera or upload an image, then use AI to enhance it
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="capture">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="capture">Image Capture</TabsTrigger>
              <TabsTrigger value="info">How It Works</TabsTrigger>
            </TabsList>
            
            <TabsContent value="capture">
              <div className="max-w-md mx-auto">
                <ImageCaptureUpload onImageCaptured={handleImageCaptured} />
              </div>
            </TabsContent>
            
            <TabsContent value="info">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4 text-primary" />
                    Capture Function
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The capture function uses your device's camera to take photos. You can also upload existing images from your device.
                  </p>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-primary" />
                    AI Enhancement
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    The regenerate function uses AI to enhance your image. It adds details, improves quality, and can apply artistic improvements.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ImageCapturePage;
