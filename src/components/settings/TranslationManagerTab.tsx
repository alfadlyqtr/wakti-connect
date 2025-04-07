
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TranslationStats {
  language: string;
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  completionPercentage: number;
}

export const TranslationManagerTab: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>("status");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [translationStats, setTranslationStats] = useState<TranslationStats[]>([]);
  
  const analyzeTranslations = () => {
    setIsLoading(true);
    
    // This would typically call an API to get stats
    // For now we'll simulate with some mock data
    setTimeout(() => {
      // Import translation resources from i18n
      const enResources = i18n.getResourceBundle('en', 'translation');
      const arResources = i18n.getResourceBundle('ar', 'translation');
      
      // Get all keys from English (assuming it's complete)
      const enKeys = flattenObjectKeys(enResources);
      const arKeys = flattenObjectKeys(arResources);
      
      // Find keys in English but missing in Arabic
      const missingInArabic = enKeys.filter(key => {
        const arValue = getNestedValue(key.split('.'), arResources);
        return arValue === undefined;
      });
      
      // Create stats objects
      const stats: TranslationStats[] = [
        {
          language: "English",
          totalKeys: enKeys.length,
          translatedKeys: enKeys.length,
          missingKeys: [],
          completionPercentage: 100
        },
        {
          language: "Arabic",
          totalKeys: enKeys.length,
          translatedKeys: enKeys.length - missingInArabic.length,
          missingKeys: missingInArabic,
          completionPercentage: Math.round(((enKeys.length - missingInArabic.length) / enKeys.length) * 100)
        }
      ];
      
      setTranslationStats(stats);
      setIsLoading(false);
    }, 1500);
  };
  
  useEffect(() => {
    analyzeTranslations();
  }, []);
  
  // Helper to flatten object keys into dot notation
  const flattenObjectKeys = (obj: any, prefix = ''): string[] => {
    return Object.keys(obj).reduce((acc: string[], key: string) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        acc.push(...flattenObjectKeys(obj[key], `${pre}${key}`));
      } else {
        acc.push(`${pre}${key}`);
      }
      return acc;
    }, []);
  };
  
  // Helper to get nested value using path array
  const getNestedValue = (path: string[], obj: any): any => {
    return path.reduce((prev, curr) => {
      return prev && prev[curr] !== undefined ? prev[curr] : undefined;
    }, obj);
  };
  
  const triggerApiTranslation = async () => {
    // This would call the translate function with the missing keys
    alert("Translation API integration would go here");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Translation Manager</span>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={analyzeTranslations}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {isLoading ? "Analyzing..." : "Refresh"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="status">Translation Status</TabsTrigger>
            <TabsTrigger value="missing">Missing Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {translationStats.map((stat) => (
                  <div key={stat.language} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{stat.language}</span>
                      <Badge variant={stat.completionPercentage === 100 ? "default" : "outline"}>
                        {stat.completionPercentage}% Complete
                      </Badge>
                    </div>
                    <Progress value={stat.completionPercentage} className="h-2" />
                    <div className="text-sm text-muted-foreground">
                      {stat.translatedKeys} / {stat.totalKeys} keys translated
                      {stat.missingKeys.length > 0 && (
                        <span className="flex items-center mt-2 text-amber-500">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          {stat.missingKeys.length} keys missing
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                
                {translationStats.some(stat => stat.completionPercentage < 100) && (
                  <Button 
                    onClick={triggerApiTranslation}
                    className="mt-4"
                  >
                    Translate Missing Keys with AI
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="missing">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div>
                {translationStats.map((stat) => {
                  if (stat.missingKeys.length === 0) return null;
                  
                  return (
                    <div key={`${stat.language}-missing`} className="mb-6">
                      <h3 className="text-lg font-medium mb-2">
                        Missing in {stat.language}
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {stat.missingKeys.slice(0, 50).map((key) => (
                          <div key={key} className="p-2 border rounded text-xs bg-muted/20">
                            {key}
                          </div>
                        ))}
                        
                        {stat.missingKeys.length > 50 && (
                          <div className="p-3 border rounded text-center text-muted-foreground">
                            +{stat.missingKeys.length - 50} more keys
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {!translationStats.some(stat => stat.missingKeys.length > 0) && (
                  <div className="text-center py-8">
                    <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">All translations are complete!</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TranslationManagerTab;
