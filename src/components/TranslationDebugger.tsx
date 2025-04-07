
import React, { useState } from "react";
import { useTranslationContext } from "@/contexts/TranslationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  checkMissingTranslations,
  hasTranslation
} from "@/services/translationService";
import i18n from '@/i18n/i18n';

/**
 * A component for debugging translations - can be added to the Settings page
 * or anywhere needed during development
 */
export const TranslationDebugger: React.FC = () => {
  const { t, currentLanguage } = useTranslationContext();
  const [testKey, setTestKey] = useState<string>('common.loading');
  const [testResult, setTestResult] = useState<string>('');
  const [missingKeys, setMissingKeys] = useState<Record<string, string>>({});
  
  const handleTestTranslation = () => {
    if (!testKey) return;
    
    const result = t(testKey);
    const exists = hasTranslation(testKey);
    
    setTestResult(
      `Key: "${testKey}"\n` +
      `Translation: "${result}"\n` +
      `Exists: ${exists ? 'Yes' : 'No'}\n` +
      `Current language: ${currentLanguage}`
    );
  };
  
  const checkCommonKeys = () => {
    const keysToCheck = [
      'common.loading', 
      'common.save', 
      'common.cancel',
      'common.error',
      'dashboard.welcome.morning',
      'settings.title'
    ];
    
    const missing = checkMissingTranslations(keysToCheck);
    setMissingKeys(missing);
  };
  
  const dumpTranslationResources = () => {
    const resources = i18n.getResourceBundle(currentLanguage, 'translation');
    console.log(`Translation resources for ${currentLanguage}:`, resources);
    
    // Also calculate stats
    const flattened = flattenObject(resources);
    const keyCount = Object.keys(flattened).length;
    console.log(`Total translation keys: ${keyCount}`);
  };
  
  // Helper to flatten nested objects
  const flattenObject = (obj: Record<string, any>, prefix = '') => {
    return Object.keys(obj).reduce((acc: Record<string, any>, k: string) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[k] === 'object' && obj[k] !== null) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Translation Debugger</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-key">Test Translation Key</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="test-key" 
              value={testKey} 
              onChange={(e) => setTestKey(e.target.value)}
              placeholder="Enter translation key to test"
            />
            <Button onClick={handleTestTranslation}>Test</Button>
          </div>
          
          {testResult && (
            <pre className="p-3 bg-muted rounded-md text-xs whitespace-pre-wrap">
              {testResult}
            </pre>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Button variant="outline" onClick={checkCommonKeys}>Check Common Keys</Button>
            <Button variant="outline" onClick={dumpTranslationResources}>Dump Resources</Button>
          </div>
          
          {Object.keys(missingKeys).length > 0 && (
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium text-sm mb-2">
                Missing translations in {currentLanguage}:
              </p>
              <ul className="text-xs space-y-1">
                {Object.keys(missingKeys).map(key => (
                  <li key={key} className="text-warning">• {key}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Current language: <strong>{currentLanguage}</strong> 
            <span className="ml-2">
              {currentLanguage === 'ar' ? '(Arabic/RTL)' : '(English/LTR)'}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationDebugger;
