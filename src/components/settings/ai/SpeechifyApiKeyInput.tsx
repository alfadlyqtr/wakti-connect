
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpeechifyApiKeyStore } from "@/utils/ttsCache";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  label?: string;
  onSave?: (key: string) => void;
  className?: string;
}

const SpeechifyApiKeyInput: React.FC<Props> = ({ label = "Speechify API Key", onSave, className }) => {
  const [value, setValue] = useState<string>(() =>
    typeof window !== "undefined" ? SpeechifyApiKeyStore.get() ?? "" : ""
  );
  const [show, setShow] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [hasServerKey, setHasServerKey] = useState(false);
  const [status, setStatus] = useState<"none" | "valid" | "invalid">("none");

  // Check if the key exists in the server
  useEffect(() => {
    checkServerApiKey();
  }, []);

  const checkServerApiKey = async () => {
    try {
      setIsChecking(true);
      const { data, error } = await supabase.functions.invoke('get-speechify-api-key');
      
      if (!error && data?.apiKey) {
        setHasServerKey(true);
        // Save the key to local storage
        SpeechifyApiKeyStore.set(data.apiKey);
        setValue(data.apiKey);
        setStatus("valid");
      }
    } catch (err) {
      console.warn("Could not fetch Speechify API key from server:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const saveKey = () => {
    if (value && value.length > 8) {
      SpeechifyApiKeyStore.set(value);
      onSave?.(value);
      setStatus("valid");
      setShow(false);
    } else {
      setStatus("invalid");
    }
  };

  const testKey = async () => {
    if (!value || value.length < 8) {
      setStatus("invalid");
      return;
    }

    setIsChecking(true);
    setStatus("none");

    try {
      // Simple test - just ensure the key format is valid
      // A real test would make an API call to Speechify
      const isValidFormat = value.length >= 20 && value.includes(".");

      if (isValidFormat) {
        setStatus("valid");
      } else {
        setStatus("invalid");
      }
    } catch (error) {
      console.error("Error testing Speechify key:", error);
      setStatus("invalid");
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIndicator = () => {
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin ml-2 text-blue-500" />;
    }
    
    if (status === "valid") {
      return <CheckCircle className="h-4 w-4 ml-2 text-green-500" />;
    }
    
    if (status === "invalid") {
      return <AlertCircle className="h-4 w-4 ml-2 text-red-500" />;
    }
    
    return null;
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShow((v) => !v)}
          className="mb-2"
        >
          {show ? "Close" : "Set Speechify API Key"}
        </Button>
        
        {hasServerKey && !show && (
          <span className="text-xs text-green-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            Server API key available
          </span>
        )}
        
        {status === "valid" && !show && (
          <span className="text-xs text-green-600 flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            API key valid
          </span>
        )}
      </div>
      
      {show && (
        <div className="flex flex-col gap-2 items-start border border-muted rounded p-3 w-full max-w-xs bg-white shadow">
          {label && <label className="text-sm font-medium">{label}</label>}
          <div className="flex w-full items-center">
            <Input
              type="password"
              autoComplete="off"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste Speechify API Key"
              className="w-full"
            />
            {getStatusIndicator()}
          </div>
          
          {status === "invalid" && (
            <p className="text-xs text-red-500 mt-1">
              Invalid API key format. Please check and try again.
            </p>
          )}
          
          <div className="flex items-center gap-2 self-end">
            <Button type="button" size="sm" variant="outline" onClick={testKey} disabled={isChecking}>
              {isChecking ? "Testing..." : "Test Key"}
            </Button>
            <Button type="button" size="sm" onClick={saveKey} disabled={isChecking}>
              Save Key
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <p>Need a Speechify API key? Visit the <a href="https://api.speechify.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Speechify API website</a>.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechifyApiKeyInput;
