
import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/user";

interface SearchButtonProps {
  onClick: () => void;
  userRole?: UserRole | null;
}

const SearchButton: React.FC<SearchButtonProps> = ({ onClick, userRole }) => {
  // Don't render the search button for staff users
  if (userRole === 'staff') {
    return null;
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="relative w-full justify-start text-sm text-muted-foreground px-3"
      onClick={onClick}
    >
      <Search className="mr-2 h-4 w-4" />
      <span>Search...</span>
      <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
};

export default SearchButton;
