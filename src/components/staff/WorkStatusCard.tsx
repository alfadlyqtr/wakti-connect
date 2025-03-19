
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlayCircle, 
  StopCircle, 
  FileCheck, 
  Clock, 
  DollarSign,
  Lock,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ActiveWorkSession {
  id: string;
  start_time: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface WorkStatusCardProps {
  activeWorkSession: ActiveWorkSession | null;
  onStartWorkDay: () => void;
  onEndWorkDay: () => void;
  onCreateJobCard: () => void;
}

const WorkStatusCard: React.FC<WorkStatusCardProps> = ({
  activeWorkSession,
  onStartWorkDay,
  onEndWorkDay,
  onCreateJobCard
}) => {
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [earnings, setEarnings] = useState('0');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get staff permissions
  const { data: staffData, isLoading: permissionsLoading } = useQuery({
    queryKey: ['staffPermissions'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('business_staff')
        .select('permissions, staff_relation_id')
        .eq('staff_id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching staff permissions:", error);
        return null;
      }
      
      return data;
    }
  });

  const canTrackHours = staffData?.permissions?.can_track_hours ?? false;
  const canCreateJobCards = staffData?.permissions?.can_create_job_cards ?? false;

  const submitEndDay = async () => {
    try {
      setIsSubmitting(true);
      
      // Update the work session with earnings and notes
      if (activeWorkSession) {
        const { error } = await supabase
          .from('staff_work_logs')
          .update({
            end_time: new Date().toISOString(),
            status: 'completed',
            earnings: parseFloat(earnings) || 0,
            notes: notes || null
          })
          .eq('id', activeWorkSession.id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Work day ended",
        description: "Your work day has been ended successfully",
      });
      
      setEndDialogOpen(false);
      onEndWorkDay();
    } catch (error) {
      console.error("Error ending work day:", error);
      toast({
        title: "Error",
        description: "Could not end your work day",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateWorkDuration = () => {
    if (!activeWorkSession) return '0h 0m';
    
    const startTime = new Date(activeWorkSession.start_time);
    const now = new Date();
    const diffMs = now.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };

  const formatStartTime = () => {
    if (!activeWorkSession) return '';
    
    const startTime = new Date(activeWorkSession.start_time);
    return startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${activeWorkSession ? 'bg-green-100' : 'bg-muted'}`}>
                <Clock className={`h-6 w-6 ${activeWorkSession ? 'text-green-500' : 'text-muted-foreground'}`} />
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {activeWorkSession ? 'Work Day in Progress' : 'Start Your Work Day'}
                </h3>
                {activeWorkSession && (
                  <div className="text-sm text-muted-foreground">
                    Started at {formatStartTime()} · Duration: {calculateWorkDuration()}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {canTrackHours ? (
                activeWorkSession ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex gap-2" 
                      onClick={() => setEndDialogOpen(true)}
                    >
                      <StopCircle className="h-4 w-4 text-destructive" />
                      End Work Day
                    </Button>
                    {canCreateJobCards && (
                      <Button 
                        variant="default" 
                        className="flex gap-2" 
                        onClick={onCreateJobCard}
                      >
                        <FileCheck className="h-4 w-4" />
                        Create Job Card
                      </Button>
                    )}
                  </>
                ) : (
                  <Button 
                    variant="default" 
                    className="flex gap-2" 
                    onClick={onStartWorkDay}
                  >
                    <PlayCircle className="h-4 w-4" />
                    Start Work Day
                  </Button>
                )
              ) : (
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Lock className="h-4 w-4" />
                  You don't have permission to track work hours
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* End Work Day Dialog */}
      <Dialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End Your Work Day</DialogTitle>
            <DialogDescription>
              Record any cash earnings and add notes about your day.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="earnings">Cash Earnings (optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="earnings"
                  type="number"
                  placeholder="0.00"
                  className="pl-9"
                  value={earnings}
                  onChange={(e) => setEarnings(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Record any cash payments received from customers
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about your work day"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEndDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitEndDay} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  End Work Day
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WorkStatusCard;
