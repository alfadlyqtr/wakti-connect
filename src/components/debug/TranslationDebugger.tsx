
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { checkMissingTranslations, registerTranslation } from '@/services/translationService';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Common translation paths to check
const COMMON_TRANSLATION_PATHS = [
  'common.save',
  'common.cancel',
  'common.loading',
  'task.tabs.myTasks',
  'task.tabs.archived',
  'task.createTask',
  'ai.tools.title',
  'ai.tools.image.title',
  'ai.tools.document.uploadDescription'
];

export const TranslationDebugger: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [missingKeys, setMissingKeys] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState('');
  const [newTranslation, setNewTranslation] = useState('');
  const [activeTab, setActiveTab] = useState('missing');
  
  // Check for missing translations on language change
  useEffect(() => {
    const missing = checkMissingTranslations(COMMON_TRANSLATION_PATHS);
    setMissingKeys(missing);
  }, [i18n.language]);
  
  const handleCheckCustomKey = () => {
    if (!newKey) return;
    
    const result = i18n.t(newKey, { defaultValue: null });
    if (result === newKey || result === null) {
      setMissingKeys(prev => ({
        ...prev,
        [newKey]: newKey
      }));
    }
  };
  
  const handleRegisterTranslation = (key: string, translation: string) => {
    registerTranslation(key, translation);
    // Remove from missing keys
    const updated = { ...missingKeys };
    delete updated[key];
    setMissingKeys(updated);
    
    // Clear form if it's the current key
    if (key === newKey) {
      setNewKey('');
      setNewTranslation('');
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Translation Debugger</span>
          <Badge variant={Object.keys(missingKeys).length > 0 ? "destructive" : "outline"}>
            {Object.keys(missingKeys).length} missing
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="missing">Missing Keys</TabsTrigger>
            <TabsTrigger value="add">Add Translation</TabsTrigger>
            <TabsTrigger value="test">Test Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="missing">
            {Object.keys(missingKeys).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(missingKeys).map(([key, defaultValue]) => (
                  <div key={key} className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm">
                      <Badge variant="outline" className="mr-2">Key</Badge>
                      {key}
                    </div>
                    <div className="flex gap-2">
                      <Input 
                        value={defaultValue}
                        onChange={e => {
                          setMissingKeys(prev => ({
                            ...prev,
                            [key]: e.target.value
                          }));
                        }}
                        placeholder="Translation text"
                      />
                      <Button 
                        size="sm"
                        onClick={() => handleRegisterTranslation(key, missingKeys[key])}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No missing translations detected
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="add">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Translation Key</label>
                <Input
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  placeholder="e.g. common.button.submit"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Translation Value ({i18n.language})</label>
                <Input
                  value={newTranslation}
                  onChange={e => setNewTranslation(e.target.value)}
                  placeholder="Translation text"
                />
              </div>
              
              <Button 
                onClick={() => {
                  if (newKey && newTranslation) {
                    handleRegisterTranslation(newKey, newTranslation);
                  }
                }}
                disabled={!newKey || !newTranslation}
              >
                Register Translation
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="test">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newKey}
                  onChange={e => setNewKey(e.target.value)}
                  placeholder="Enter translation key to test"
                />
                <Button onClick={handleCheckCustomKey}>
                  Check
                </Button>
              </div>
              
              {newKey && (
                <div className="p-4 border rounded-md">
                  <div className="mb-2 font-medium">Result:</div>
                  <div>{i18n.t(newKey)}</div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
