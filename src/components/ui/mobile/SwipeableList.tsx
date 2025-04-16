
import React from 'react';
import { cn } from '@/lib/utils';
import { SwipeableItem } from './SwipeableItem';
import { Check, Trash2 } from 'lucide-react';

interface SwipeableListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onComplete?: (item: T, index: number) => void;
  onDelete?: (item: T, index: number) => void;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  completeLabel?: React.ReactNode;
  deleteLabel?: React.ReactNode;
  disableSwipe?: boolean;
}

export function SwipeableList<T>({
  items,
  renderItem,
  onComplete,
  onDelete,
  keyExtractor,
  className,
  completeLabel = <Check className="h-5 w-5 text-white" />,
  deleteLabel = <Trash2 className="h-5 w-5 text-white" />,
  disableSwipe = false
}: SwipeableListProps<T>) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <SwipeableItem
          key={keyExtractor(item, index)}
          onSwipeLeft={onDelete ? () => onDelete(item, index) : undefined}
          onSwipeRight={onComplete ? () => onComplete(item, index) : undefined}
          leftAction={onDelete ? deleteLabel : undefined}
          rightAction={onComplete ? completeLabel : undefined}
          disabled={disableSwipe}
        >
          {renderItem(item, index)}
        </SwipeableItem>
      ))}
    </div>
  );
}
