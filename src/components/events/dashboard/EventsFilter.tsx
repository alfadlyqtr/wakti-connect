
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Clock, Edit, Grid3X3, List } from "lucide-react";
import { EventTab } from "@/types/event.types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";

interface EventsFilterProps {
  activeTab: EventTab;
  onTabChange: (tab: EventTab) => void;
  viewType: 'grid' | 'list';
  setViewType: (type: 'grid' | 'list') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterDate: Date | null;
  setFilterDate: (date: Date | null) => void;
}

const EventsFilter: React.FC<EventsFilterProps> = ({
  activeTab,
  onTabChange,
  viewType,
  setViewType,
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterDate,
  setFilterDate
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        {/* Responsive TabsList */}
        <TabsList className="flex w-full sm:w-auto">
          <TabsTrigger 
            value="my-events" 
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 text-xs sm:text-sm flex items-center"
            onClick={() => onTabChange("my-events")}
          >
            <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
            <span className="truncate">My Events</span>
          </TabsTrigger>
          <TabsTrigger 
            value="invited-events" 
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 text-xs sm:text-sm flex items-center"
            onClick={() => onTabChange("invited-events")}
          >
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
            <span className="truncate">Invitations</span>
          </TabsTrigger>
          <TabsTrigger 
            value="draft-events" 
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-1.5 text-xs sm:text-sm flex items-center"
            onClick={() => onTabChange("draft-events")}
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" /> 
            <span className="truncate">Drafts</span>
          </TabsTrigger>
        </TabsList>
        
        {/* View type toggle buttons - moved to filter section on mobile */}
        <div className={`${isMobile ? "hidden" : "flex"} gap-2`}>
          <Button 
            variant={viewType === 'grid' ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewType('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewType === 'list' ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewType('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Responsive Filter Section */}
      <div className="my-3 sm:my-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">Search</Label>
          <Input
            id="search"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
          {/* View type toggle on mobile only */}
          {isMobile && (
            <div className="flex gap-1 mr-1">
              <Button 
                variant={viewType === 'grid' ? "default" : "outline"} 
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewType('grid')}
              >
                <Grid3X3 className="h-3 w-3" />
              </Button>
              <Button 
                variant={viewType === 'list' ? "default" : "outline"} 
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewType('list')}
              >
                <List className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <div className={isMobile ? "flex-1 min-w-[100px]" : "w-[150px]"}>
            <Label htmlFor="status" className="sr-only">Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="status" className="h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="recalled">Recalled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className={isMobile ? "flex-1 min-w-[100px]" : "w-[150px]"}>
            <DatePicker
              date={filterDate}
              setDate={setFilterDate}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsFilter;
