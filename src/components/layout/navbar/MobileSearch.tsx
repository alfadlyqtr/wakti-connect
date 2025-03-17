
import React from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface MobileSearchProps {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
}

const MobileSearch = ({ searchOpen, setSearchOpen }: MobileSearchProps) => {
  const { t } = useTranslation();
  
  return (
    <div className={`absolute left-0 top-full w-full bg-background/95 backdrop-blur-md p-4 border-b border-border transition-all duration-300 ease-in-out lg:relative lg:top-auto lg:left-auto lg:w-auto lg:bg-transparent lg:p-0 lg:border-0 ${
      searchOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none lg:translate-y-0 lg:opacity-100 lg:pointer-events-auto"
    }`}>
      <div className="relative max-w-xl mx-auto lg:w-[400px]">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input 
          type="text"
          placeholder={t('common.search')}
          className="w-full h-10 pl-10 pr-4 rounded-md border border-input bg-background focus:ring-2 focus:ring-ring focus:outline-none transition-all"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1 lg:hidden"
          onClick={() => setSearchOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileSearch;
