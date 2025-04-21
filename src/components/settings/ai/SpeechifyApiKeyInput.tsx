
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SpeechifyApiKeyStore } from "@/utils/ttsCache";

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

  const saveKey = () => {
    if (value && value.length > 8) {
      SpeechifyApiKeyStore.set(value);
      onSave?.(value);
      alert("Speechify API key saved! You can now play TTS audio with Speechify.");
      setShow(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShow((v) => !v)}
        className="mb-2"
      >
        {show ? "Close" : "Set Speechify API Key"}
      </Button>
      {show && (
        <div className="flex flex-col gap-2 items-start border border-muted rounded p-3 w-full max-w-xs bg-white shadow">
          {label && <label className="text-sm font-medium">{label}</label>}
          <Input
            type="password"
            autoComplete="off"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Paste Speechify API Key"
            className="w-full"
          />
          <Button type="button" size="sm" onClick={saveKey} className="self-end">
            Save Key
          </Button>
        </div>
      )}
    </div>
  );
};

export default SpeechifyApiKeyInput;
