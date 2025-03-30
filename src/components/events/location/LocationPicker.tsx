
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate dummy suggestions based on search term
      const dummySuggestions = [
        `${searchTerm}, Main Street`,
        `${searchTerm}, Downtown`,
        `${searchTerm} Plaza`,
        `${searchTerm} Business Center`,
        `${searchTerm} Mall`
      ];
      
      setSuggestions(dummySuggestions);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Location</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a location..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button type="button" onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-4 space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => onSelect(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
            
            {suggestions.length === 0 && !isSearching && (
              <p className="text-sm text-muted-foreground">
                Search for a location to see suggestions
              </p>
            )}
            
            {isSearching && (
              <p className="text-sm text-muted-foreground">
                Searching...
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPicker;
