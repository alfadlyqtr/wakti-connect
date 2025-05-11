
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useJobCards } from '@/hooks/useJobCards';
import { Loader2, PlusCircle, Filter, ArrowUpDown } from 'lucide-react';
import ActiveJobCard from './ActiveJobCard';
import CompletedJobsSection from './CompletedJobsSection';
import EmptyJobCards from './EmptyJobCards';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface JobCardsListProps {
  staffRelationId: string;
  onCreateJobCard: () => void;
  canCreateCard: boolean;
  isBusinessAccount?: boolean;
}

type SortOption = 'newest' | 'oldest' | 'highest-amount' | 'lowest-amount';
type FilterPeriod = 'all' | 'today' | 'thisWeek' | 'thisMonth';
type PaymentFilter = 'all' | 'cash' | 'pos' | 'none';

const JobCardsList: React.FC<JobCardsListProps> = ({ 
  staffRelationId, 
  onCreateJobCard,
  canCreateCard,
  isBusinessAccount = false
}) => {
  // Filtering and sorting state
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  
  const { 
    activeJobCards, 
    completedJobCards, 
    isLoading, 
    error, 
    completeJobCard 
  } = useJobCards(staffRelationId);
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading job cards...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <div className="text-sm font-medium text-destructive">
          Error loading job cards: {error.message}
        </div>
      </div>
    );
  }
  
  if (activeJobCards.length === 0 && completedJobCards.length === 0) {
    return <EmptyJobCards onCreateJobCard={onCreateJobCard} canCreateCard={canCreateCard} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button 
          onClick={onCreateJobCard}
          disabled={!canCreateCard}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Job Card
        </Button>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Time period filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterPeriod} onValueChange={(value) => setFilterPeriod(value as FilterPeriod)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This week</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Payment method filter */}
          <Select value={paymentFilter} onValueChange={(value) => setPaymentFilter(value as PaymentFilter)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Payment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              <SelectItem value="cash">Cash only</SelectItem>
              <SelectItem value="pos">POS only</SelectItem>
              <SelectItem value="none">No payment</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sorting options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption('newest')}>
                Newest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('oldest')}>
                Oldest first
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('highest-amount')}>
                Highest amount
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption('lowest-amount')}>
                Lowest amount
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {activeJobCards.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Jobs</h3>
          {activeJobCards.map(jobCard => (
            <ActiveJobCard
              key={jobCard.id}
              jobCard={jobCard}
              onComplete={() => completeJobCard.mutate(jobCard.id)}
              isCompleting={completeJobCard.isPending}
            />
          ))}
        </div>
      )}
      
      {completedJobCards.length > 0 && (
        <CompletedJobsSection 
          completedJobs={completedJobCards} 
          filterPeriod={filterPeriod}
          setFilterPeriod={setFilterPeriod}
          paymentFilter={paymentFilter}
          sortOption={sortOption}
          isBusinessView={isBusinessAccount}
        />
      )}
    </div>
  );
};

export default JobCardsList;
