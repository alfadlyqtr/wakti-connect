
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface StaffHeaderProps {
  onRefresh: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold">Staff Members</h2>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        data-testid="refresh-button"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
    </div>
  );
};

export default StaffHeader;
