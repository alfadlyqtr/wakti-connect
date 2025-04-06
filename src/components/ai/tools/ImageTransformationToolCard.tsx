
import React, { useState, useRef } from "react";
import { Image, Loader2, Upload, RefreshCw, X } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAIImageGeneration } from "@/hooks/ai/useAIImageGeneration";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export const ImageTransformationToolCard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [prompt, setPrompt] = useState(t("ai.tools.image.animeStyle"));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { 
    transformImage, 
    uploadImage, 
    isUploading,
    isGenerating, 
    generatedImage,
    uploadedImageUrl,
    clearUploadedImage,
    clearGeneratedImage
  } = useAIImageGeneration();
  const { toast } = useToast();

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      await uploadImage(file);
      toast({
        title: t("ai.fileUploaded"),
        description: t("ai.fileUploadSuccess", { name: file.name }),
      });
    } catch (error) {
      toast({
        title: t("ai.uploadFailed"),
        description: error instanceof Error ? error.message : t("ai.tryAgain"),
        variant: "destructive"
      });
    }
  };

  const handleTransform = async () => {
    if (!uploadedImageUrl) {
      toast({
        title: t("ai.tools.image.noImage"),
        description: t("ai.tools.image.uploadImageFirst"),
        variant: "destructive"
      });
      return;
    }

    try {
      await transformImage(prompt);
    } catch (error) {
      toast({
        title: t("ai.uploadFailed"),
        description: error instanceof Error ? error.message : t("ai.tryAgain"),
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (!generatedImage?.imageUrl) return;
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = generatedImage.imageUrl;
    link.download = `transformed-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const predefinedStyles = [
    t("ai.tools.image.animeStyle"),
    t("ai.tools.image.mangaStyle"),
    t("ai.tools.image.ghibliStyle"),
    t("ai.tools.image.cyberpunkStyle"),
    t("ai.tools.image.chibiStyle")
  ];

  return (
    <AIToolCard
      icon={RefreshCw}
      title={t("ai.tools.image.transformTitle")}
      description={t("ai.tools.image.transformDescription")}
      iconColor="text-emerald-500"
    >
      <div className="space-y-3">
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {!uploadedImageUrl && !generatedImage ? (
          <div 
            className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
            onClick={handleFileSelect}
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <div className="text-sm text-center text-gray-500">
              <span className="font-medium text-primary">{t("ai.tools.image.clickToUpload")}</span> {t("ai.tools.image.dragAndDrop")}
            </div>
            <p className="text-xs text-gray-400 mt-1">{t("ai.tools.image.imageFormats")}</p>
          </div>
        ) : (
          <>
            {uploadedImageUrl && !generatedImage && (
              <Card className="relative overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
                  onClick={clearUploadedImage}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="aspect-square relative">
                  <img 
                    src={uploadedImageUrl}
                    alt={t("ai.tools.image.uploadImage")}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
            )}
            
            {generatedImage && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Original Image */}
                  <Card className="relative overflow-hidden">
                    <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-black/20 px-2 py-1 rounded text-white text-xs`}>{t("ai.tools.image.original")}</div>
                    <div className="aspect-square relative">
                      <img 
                        src={generatedImage.originalImageUrl || ''} 
                        alt={t("ai.tools.image.original")}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Card>
                  
                  {/* Transformed Image */}
                  <Card className="relative overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
                      onClick={clearGeneratedImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-black/20 px-2 py-1 rounded text-white text-xs`}>{t("ai.tools.image.transformed")}</div>
                    <div className="aspect-square relative">
                      <img 
                        src={generatedImage.imageUrl} 
                        alt={t("ai.tools.image.transformed")}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-2 bg-muted/50">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={handleDownload}
                      >
                        <Image className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> {t("ai.tools.image.downloadImage")}
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
        
        {uploadedImageUrl && !generatedImage && (
          <>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">{t("ai.tools.image.bestResults")}</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>{t("ai.tools.image.clearImages")}</li>
                <li>{t("ai.tools.image.peopleWork")}</li>
                <li>{t("ai.tools.image.specificPrompt")}</li>
              </ul>
            </div>
            
            <Textarea
              placeholder={t("ai.tools.image.describeTransformation")}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[60px]"
              disabled={isGenerating}
            />
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">{t("ai.tools.image.suggestedStyles")}</p>
              <div className={`flex flex-wrap gap-2 ${isRTL ? 'space-x-reverse' : ''}`}>
                {predefinedStyles.map((style, index) => (
                  <Button 
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(style)}
                    className="text-xs"
                  >
                    {style.split(' ').slice(0, 3).join(' ')}...
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={handleTransform}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t("ai.tools.image.transformingImage")}
                </>
              ) : t("ai.tools.image.transformImage")}
            </Button>
          </>
        )}
        
        {(generatedImage || (!uploadedImageUrl && !generatedImage)) && (
          <Button 
            variant="outline"
            onClick={() => {
              clearGeneratedImage();
              clearUploadedImage();
              handleFileSelect();
            }}
            className="w-full"
          >
            <Upload className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} /> 
            {t("ai.tools.image.uploadNewImage")}
          </Button>
        )}
      </div>
    </AIToolCard>
  );
};
