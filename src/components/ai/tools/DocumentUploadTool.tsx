
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { AIUpgradeRequired } from "@/components/ai/AIUpgradeRequired";
import { useTranslation } from "react-i18next";

interface DocumentUploadToolProps {
  canAccess: boolean;
  onUseDocumentContent: (content: string) => void;
}

export const DocumentUploadTool: React.FC<DocumentUploadToolProps> = ({
  canAccess,
  onUseDocumentContent
}) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [documentSummary, setDocumentSummary] = useState("");
  
  if (!canAccess) {
    return <AIUpgradeRequired />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAnalyze = () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    
    // Simulate document analysis
    setTimeout(() => {
      const summary = `Document Analysis: ${selectedFile.name} - This is a sample document analysis that would be generated from the AI model. In a real implementation, this would be the result of processing the document contents through an NLP model.`;
      setDocumentSummary(summary);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleUseContent = () => {
    if (documentSummary) {
      onUseDocumentContent(documentSummary);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setDocumentSummary("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-wakti-blue" />
          {t("ai.tools.document.upload")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documentSummary ? (
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-secondary/30 h-32 overflow-y-auto">
              <p className="text-sm">{documentSummary}</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUseContent} className="flex-1">
                {t("ai.tools.document.useThis")}
              </Button>
              <Button variant="outline" onClick={handleReset}>
                {t("ai.tools.voice.tryAgain")}
              </Button>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-secondary/30">
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round(selectedFile.size / 1024)} KB
              </p>
            </div>
            <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
              {isAnalyzing ? (
                <>
                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-t-transparent animate-spin" />
                  {t("ai.tools.document.generating")}
                </>
              ) : (
                t("ai.tools.document.analyze")
              )}
            </Button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/20 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">{t("ai.tools.document.dragDrop")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("ai.tools.document.supportedFormats")}
            </p>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
