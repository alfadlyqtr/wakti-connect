
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SwipeableItem } from '@/components/ui/mobile/SwipeableItem';
import { PullToRefresh } from '@/components/ui/mobile/PullToRefresh';
import { SwipeToAction } from '@/components/ui/mobile/SwipeToAction';
import { SwipeableList } from '@/components/ui/mobile/SwipeableList';
import { Check, Trash2, Bell, BookOpen, Calendar, User, Settings } from 'lucide-react';
import { platformHapticFeedback } from '@/utils/hapticFeedback';
import { useToast } from '@/components/ui/use-toast';
import { useSwipe } from '@/hooks/useSwipe';
import { useIsMobile } from '@/hooks/useIsMobile';

interface DemoItem {
  id: string;
  title: string;
  completed: boolean;
}

export const MobileUXDemo = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [items, setItems] = useState<DemoItem[]>([
    { id: '1', title: 'Swipe right to complete', completed: false },
    { id: '2', title: 'Swipe left to delete', completed: false },
    { id: '3', title: 'Complete this item', completed: false },
    { id: '4', title: 'Delete this item', completed: false },
    { id: '5', title: 'Check swipe actions', completed: false },
  ]);
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      toast({
        title: 'Swiped Left',
        description: 'You swiped left on the card',
      });
      platformHapticFeedback('impact');
    },
    onSwipeRight: () => {
      toast({
        title: 'Swiped Right',
        description: 'You swiped right on the card',
      });
      platformHapticFeedback('impact');
    }
  });
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate a network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update items with a new one
    const newItem = {
      id: Date.now().toString(),
      title: `New item added ${new Date().toLocaleTimeString()}`,
      completed: false
    };
    
    setItems(prev => [newItem, ...prev]);
    setIsRefreshing(false);
    
    toast({
      title: 'Refreshed!',
      description: 'The list has been refreshed with new content',
    });
  };
  
  const handleComplete = (item: DemoItem, index: number) => {
    platformHapticFeedback('success');
    setItems(prev => 
      prev.map(i => 
        i.id === item.id ? { ...i, completed: true } : i
      )
    );
    
    toast({
      title: 'Item Completed',
      description: `"${item.title}" has been marked as completed`,
    });
  };
  
  const handleDelete = (item: DemoItem, index: number) => {
    platformHapticFeedback('error');
    setItems(prev => prev.filter(i => i.id !== item.id));
    
    toast({
      title: 'Item Deleted',
      description: `"${item.title}" has been deleted`,
    });
  };
  
  const triggerHapticFeedback = (type: 'selection' | 'impact' | 'notification' | 'success' | 'warning' | 'error') => {
    platformHapticFeedback(type);
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Haptic`,
      description: `${type} haptic feedback triggered`,
      duration: 1000,
    });
  };
  
  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold tracking-tight">Mobile UX Enhancements</h1>
      
      {!isMobile && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <p className="text-yellow-800">
              These demos are optimized for mobile devices. For the best experience, view this page on a mobile device or use browser dev tools to enable mobile view.
            </p>
          </CardContent>
        </Card>
      )}
      
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pull to Refresh</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Pull down from the top of this screen to refresh and add a new item.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Swipeable List</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Swipe left to delete, swipe right to complete.
              </p>
              
              <SwipeableList
                items={items}
                keyExtractor={(item) => item.id}
                onComplete={handleComplete}
                onDelete={handleDelete}
                renderItem={(item) => (
                  <div className={`p-4 bg-background ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {item.title}
                  </div>
                )}
              />
            </CardContent>
          </Card>
          
          <Card {...swipeHandlers}>
            <CardHeader>
              <CardTitle>Swipe Gestures</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Swipe left or right on this card to trigger a toast notification.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Swipe to Action</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Slide the button to the right to trigger the action.
              </p>
              
              <SwipeToAction
                onComplete={() => {
                  toast({
                    title: "Action Completed",
                    description: "You completed the swipe action!",
                    variant: "default",
                  });
                }}
                completeLabel="Slide to confirm"
                onCancel={() => {
                  toast({
                    title: "Action Cancelled",
                    description: "You cancelled the swipe action",
                    variant: "destructive",
                  });
                }}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Haptic Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Tap the buttons below to test different haptic feedback patterns.
                You'll need a device that supports vibration.
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => triggerHapticFeedback('selection')}
                  className="touch-target"
                >
                  Selection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => triggerHapticFeedback('impact')}
                  className="touch-target"
                >
                  Impact
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => triggerHapticFeedback('notification')}
                  className="touch-target"
                >
                  Notification
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => triggerHapticFeedback('success')}
                  className="touch-target success-haptic"
                >
                  Success
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => triggerHapticFeedback('warning')}
                  className="touch-target"
                >
                  Warning
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => triggerHapticFeedback('error')}
                  className="touch-target"
                >
                  Error
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PullToRefresh>
    </div>
  );
};

export default MobileUXDemo;
