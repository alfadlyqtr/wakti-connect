
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Download, Pen, MoreVertical, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface SavedLecture {
  id: string;
  date: string;
  summary: string;
  duration: number;
  title: string;
  course?: string;
}

interface SavedLecturesListProps {
  savedLectures: SavedLecture[];
  isLoadingHistory: boolean;
  onDeleteLecture: (lectureId: string) => void;
  onEditLectureTitle: (lectureId: string, newTitle: string) => void;
}

const SavedLecturesList: React.FC<SavedLecturesListProps> = ({
  savedLectures,
  isLoadingHistory,
  onDeleteLecture,
  onEditLectureTitle
}) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<SavedLecture | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const handleOpenEdit = (lecture: SavedLecture) => {
    setSelectedLecture(lecture);
    setNewTitle(lecture.title);
    setIsEditDialogOpen(true);
  };

  const handleSaveTitle = () => {
    if (selectedLecture && newTitle.trim()) {
      onEditLectureTitle(selectedLecture.id, newTitle.trim());
      setIsEditDialogOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${formatDistanceToNow(date, { addSuffix: true })}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Saved Lecture Notes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingHistory ? (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              ))}
            </>
          ) : savedLectures.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <p>No saved lecture notes found.</p>
              <p className="text-sm mt-1">Record your first lecture to get started!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {savedLectures.map((lecture) => (
                <div
                  key={lecture.id}
                  className="p-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-sm">{lecture.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(lecture.date)}
                      </span>
                      {lecture.course && (
                        <span className="flex items-center">
                          <span className="mx-1">•</span>
                          {lecture.course}
                        </span>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenEdit(lecture)}>
                        <Pen className="h-4 w-4 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteLecture(lecture.id)}>
                        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-red-500">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lecture Title</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTitle}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavedLecturesList;
