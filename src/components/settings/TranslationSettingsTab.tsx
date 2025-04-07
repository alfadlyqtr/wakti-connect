
import React, { useState } from "react";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TranslationDebugger from "@/components/TranslationDebugger";
import { TranslationManagerTab } from "@/components/settings/TranslationManagerTab";

export const TranslationSettingsTab: React.FC = () => {
  const { t, changeLanguage, currentLanguage } = useTranslationContext();
  const [activeTab, setActiveTab] = useState<string>("language");
  
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("settings.language")}</CardTitle>
          <CardDescription>
            {t("settings.languageDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">
                {t("settings.selectLanguage")}
              </h3>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  variant={currentLanguage === 'en' ? "default" : "outline"}
                  onClick={() => changeLanguage('en')}
                  className="flex-1 sm:flex-none"
                >
                  <span className="mr-2">🇬🇧</span> English
                </Button>
                
                <Button
                  variant={currentLanguage === 'ar' ? "default" : "outline"}
                  onClick={() => changeLanguage('ar')}
                  className="flex-1 sm:flex-none"
                >
                  <span className="mr-2">🇶🇦</span> العربية
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium mb-3">
                {t("settings.languagePreferences")}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-4">
                {t("settings.languagePreferencesDescription")}
              </p>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {t("settings.currentLanguage")}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentLanguage === 'ar' ? 'العربية' : 'English'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {t("settings.direction")}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {currentLanguage === 'ar' ? t("settings.rtl") : t("settings.ltr")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="language">{t("settings.languageSettings")}</TabsTrigger>
          <TabsTrigger value="translation">{t("settings.translationManagement")}</TabsTrigger>
          <TabsTrigger value="debug">{t("settings.debug")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="language" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.advancedLanguageSettings")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("settings.defaultLanguageDescription")}
              </p>
              
              <Button variant="outline" onClick={() => {
                localStorage.removeItem('wakti-language');
                window.location.reload();
              }}>
                {t("settings.resetLanguagePreference")}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="translation" className="mt-4">
          <TranslationManagerTab />
        </TabsContent>
        
        <TabsContent value="debug" className="mt-4">
          <TranslationDebugger />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TranslationSettingsTab;
