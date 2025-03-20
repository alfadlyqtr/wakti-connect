
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, Grid, List, CheckCircle, LayoutList } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { EventTab } from "@/types/event.types";

interface EventsFilterProps {
  activeTab: EventTab;
  onTabChange: (tab: EventTab) => void;
  viewType: 'grid' | 'list';
  onViewTypeChange: (type: 'grid' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSort: (value: string) => void;
  activeSort: string;
  filterStatus: string;
  onFilterStatus: (status: string) => void;
}

const EventsFilter: React.FC<EventsFilterProps> = ({
  activeTab,
  onTabChange,
  viewType,
  onViewTypeChange,
  searchQuery,
  onSearchChange,
  onSort,
  activeSort,
  filterStatus,
  onFilterStatus
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-4 space-y-4">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as EventTab)}>
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-auto sm:h-10">
          <TabsTrigger value="my-events" className="py-2 sm:py-0 text-xs sm:text-sm">
            My Events
          </TabsTrigger>
          <TabsTrigger value="invited-events" className="py-2 sm:py-0 text-xs sm:text-sm">
            Invitations
          </TabsTrigger>
          <TabsTrigger value="drafts" className="py-2 sm:py-0 text-xs sm:text-sm">
            Drafts
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-full h-9"
          />
        </div>
        
        <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-between sm:justify-start">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewTypeChange('grid')}
            className={viewType === 'grid' ? 'bg-secondary' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewTypeChange('list')}
            className={viewType === 'list' ? 'bg-secondary' : ''}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          
          <Select value={activeSort} onValueChange={onSort}>
            <SelectTrigger className="w-[110px] h-9 text-xs">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-1" />
                <span className="text-xs">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="p-2 flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`justify-start text-xs ${filterStatus === 'all' ? 'bg-secondary' : ''}`}
                  onClick={() => onFilterStatus('all')}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`justify-start text-xs ${filterStatus === 'upcoming' ? 'bg-secondary' : ''}`}
                  onClick={() => onFilterStatus('upcoming')}
                >
                  Upcoming
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`justify-start text-xs ${filterStatus === 'past' ? 'bg-secondary' : ''}`}
                  onClick={() => onFilterStatus('past')}
                >
                  Past
                </Button>
                {activeTab === 'invited-events' && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`justify-start text-xs ${filterStatus === 'accepted' ? 'bg-secondary' : ''}`}
                    onClick={() => onFilterStatus('accepted')}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" /> Accepted
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default EventsFilter;
