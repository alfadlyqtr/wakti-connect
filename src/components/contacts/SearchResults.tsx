
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommandItem, CommandEmpty, CommandGroup } from "@/components/ui/command";
import { Briefcase, User } from "lucide-react";
import { UserSearchResult } from "@/types/invitation.types";

interface SearchResultsProps {
  searchResults: UserSearchResult[];
  onSelectContact: (contact: UserSearchResult) => void;
}

// This component is being deprecated in favor of ContactSearchInput
// It's kept here for backward compatibility
export const SearchResults = ({ searchResults, onSelectContact }: SearchResultsProps) => {
  console.log("[SearchResults] Received results:", searchResults);

  // If searchResults is null, undefined, or empty, show empty state
  if (!searchResults || searchResults.length === 0) {
    return (
      <CommandGroup>
        <CommandEmpty>No users or businesses found</CommandEmpty>
      </CommandGroup>
    );
  }

  return (
    <CommandGroup>
      {searchResults.map((user) => (
        <CommandItem 
          key={user.id}
          onSelect={() => onSelectContact(user)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatarUrl || ''} />
            <AvatarFallback>
              {(user.displayName || user.fullName || 'U').charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium">
              {user.displayName || user.fullName || 'Unknown User'}
            </span>
            {user.businessName && (
              <span className="text-xs text-slate-600">{user.businessName}</span>
            )}
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
          {user.accountType === 'business' ? (
            <Badge variant="outline" className="bg-blue-50 flex items-center">
              <Briefcase className="h-3 w-3 mr-1" /> Business
            </Badge>
          ) : user.accountType === 'individual' ? (
            <Badge variant="outline" className="bg-green-50 flex items-center">
              <User className="h-3 w-3 mr-1" /> Individual
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center">
              <User className="h-3 w-3 mr-1" /> Free
            </Badge>
          )}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};
