
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Clock } from 'lucide-react';

interface ActiveWorkSessionProps {
  isClocked: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
  isLoading: boolean;
}

const ActiveWorkSession: React.FC<ActiveWorkSessionProps> = ({ 
  isClocked, 
  onClockIn, 
  onClockOut, 
  isLoading 
}) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Work Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div className="text-sm mb-4">
            You are currently <span className={`font-medium ${isClocked ? 'text-green-600' : 'text-amber-600'}`}>
              {isClocked ? 'clocked in' : 'clocked out'}
            </span>
          </div>
          
          <Button
            variant={isClocked ? "destructive" : "default"}
            className="w-full"
            onClick={isClocked ? onClockOut : onClockIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isClocked ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isClocked ? 'Clock Out' : 'Clock In'}
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveWorkSession;
