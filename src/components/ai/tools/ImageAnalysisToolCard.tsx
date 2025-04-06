
import React, { useState } from "react";
import { Image, Upload, X, Loader2, Search } from "lucide-react";
import { AIToolCard } from "./AIToolCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

export const ImageAnalysisToolCard: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t("ai.fileTooLarge"),
        description: t("ai.fileSizeLimit"),
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate analysis (in a real app, this would call an AI API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setResult("Image analysis would show results here. This is a placeholder for the actual AI analysis functionality.");
    } catch (error) {
      toast({
        title: t("ai.uploadFailed"),
        description: error instanceof Error ? error.message : t("ai.tryAgain"),
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <AIToolCard
      icon={Image}
      title={t("ai.tools.image.title")}
      description={t("ai.tools.image.uploadDescription")}
      iconColor="text-green-500"
    >
      <div className="space-y-3">
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        {!selectedImage ? (
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
          <div className="space-y-4">
            <Card className="relative overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/20 hover:bg-black/40 text-white rounded-full z-10"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="aspect-square relative">
                <img 
                  src={selectedImage}
                  alt={t("ai.tools.image.uploadImage")}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
            
            <Button 
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t("common.loading")}
                </>
              ) : (
                <>
                  <Search className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {t("ai.tools.document.analyze")}
                </>
              )}
            </Button>
            
            {result && (
              <div className="p-3 border rounded-md bg-muted/50">
                <p className="text-sm">{result}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AIToolCard>
  );
};
