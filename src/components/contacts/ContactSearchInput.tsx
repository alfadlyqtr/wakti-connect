
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search, UserPlus, User, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserSearchResult } from "@/types/invitation.types";

interface ContactSearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: UserSearchResult[];
  isSearching: boolean;
  onSelectContact: (contact: UserSearchResult) => void;
}

export const ContactSearchInput: React.FC<ContactSearchInputProps> = ({
  searchQuery,
  onSearchChange,
  searchResults,
  isSearching,
  onSelectContact
}) => {
  const [showResults, setShowResults] = useState(false);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowResults(true);
  };

  const handleResultClick = (e: React.MouseEvent, contact: UserSearchResult) => {
    e.stopPropagation();
    onSelectContact(contact);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          placeholder="Search by name, email, or business name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onClick={handleInputClick}
          className="pr-10"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : (
            <Search className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {showResults && searchQuery.length > 1 && (
        <div className="absolute z-50 mt-1 w-full bg-popover rounded-md border border-border shadow-lg overflow-hidden">
          {isSearching ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : searchResults.length > 0 ? (
            <div className="max-h-[300px] overflow-y-auto p-1">
              {searchResults.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-3 p-2 rounded-sm hover:bg-accent cursor-pointer"
                  onClick={(e) => handleResultClick(e, contact)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={contact.avatarUrl || ""} />
                    <AvatarFallback>
                      {(contact.displayName || contact.fullName || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {contact.displayName || contact.fullName || "Unknown User"}
                      </span>
                      {contact.accountType === "business" ? (
                        <Badge variant="outline" className="bg-blue-50 flex items-center">
                          <Briefcase className="h-3 w-3 mr-1" /> Business
                        </Badge>
                      ) : contact.accountType === "individual" ? (
                        <Badge variant="outline" className="bg-green-50 flex items-center">
                          <User className="h-3 w-3 mr-1" /> Individual
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center">
                          <User className="h-3 w-3 mr-1" /> Free
                        </Badge>
                      )}
                    </div>
                    {contact.businessName && (
                      <span className="text-xs text-muted-foreground truncate">
                        {contact.businessName}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground truncate">
                      {contact.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery.length < 2 
                ? "Type at least 2 characters to search" 
                : "No users or businesses found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
