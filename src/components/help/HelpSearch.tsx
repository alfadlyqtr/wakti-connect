
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface HelpSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export const HelpSearch = ({ value, onChange, onClear }: HelpSearchProps) => {
  return (
    <div className="relative max-w-xl mx-auto w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search for help topics..."
        className="pl-10 pr-10"
        value={value}
        onChange={onChange}
      />
      {value && (
        <button 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 hover:text-primary focus:outline-none"
          onClick={onClear}
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
