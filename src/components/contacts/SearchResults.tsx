
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommandItem } from "@/components/ui/command";
import { Briefcase, User } from "lucide-react";
import { UserSearchResult } from "@/types/invitation.types";

interface SearchResultsProps {
  searchResults: UserSearchResult[];
  onSelectContact: (contact: UserSearchResult) => void;
}

export const SearchResults = ({ searchResults, onSelectContact }: SearchResultsProps) => {
  const getAccountTypeIcon = (accountType: string) => {
    switch (accountType) {
      case 'business':
        return <Briefcase className="h-3 w-3 mr-1" />;
      default:
        return <User className="h-3 w-3 mr-1" />;
    }
  };

  const getAccountTypeBadge = (accountType: string) => {
    switch (accountType) {
      case 'business':
        return <Badge variant="outline" className="bg-blue-50 flex items-center">
          {getAccountTypeIcon(accountType)} Business
        </Badge>;
      case 'individual':
        return <Badge variant="outline" className="bg-green-50 flex items-center">
          {getAccountTypeIcon(accountType)} Individual
        </Badge>;
      default:
        return <Badge variant="outline" className="flex items-center">
          {getAccountTypeIcon(accountType)} Free
        </Badge>;
    }
  };

  return (
    <>
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
          {getAccountTypeBadge(user.accountType || 'free')}
        </CommandItem>
      ))}
    </>
  );
};
