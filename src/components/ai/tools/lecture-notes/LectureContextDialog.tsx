
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Book, User, School, Calendar } from 'lucide-react';

export interface LectureContextData {
  course?: string;
  lecturer?: string;
  university?: string;
  date?: string;
}

interface LectureContextDialogProps {
  open: boolean;
  onClose: (data?: LectureContextData) => void;
}

export const LectureContextDialog: React.FC<LectureContextDialogProps> = ({
  open,
  onClose
}) => {
  const [contextData, setContextData] = useState<LectureContextData>({
    course: '',
    lecturer: '',
    university: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty fields
    const filteredData: LectureContextData = {};
    if (contextData.course && contextData.course.trim()) filteredData.course = contextData.course.trim();
    if (contextData.lecturer && contextData.lecturer.trim()) filteredData.lecturer = contextData.lecturer.trim();
    if (contextData.university && contextData.university.trim()) filteredData.university = contextData.university.trim();
    if (contextData.date) filteredData.date = contextData.date;
    
    onClose(Object.keys(filteredData).length > 0 ? filteredData : undefined);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lecture Context</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="course" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Course Name
            </Label>
            <Input
              id="course"
              placeholder="e.g. Introduction to Computer Science"
              value={contextData.course || ''}
              onChange={(e) => setContextData(prev => ({ ...prev, course: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lecturer" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Lecturer Name
            </Label>
            <Input
              id="lecturer"
              placeholder="e.g. Dr. Jane Smith"
              value={contextData.lecturer || ''}
              onChange={(e) => setContextData(prev => ({ ...prev, lecturer: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="university" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              Institution
            </Label>
            <Input
              id="university"
              placeholder="e.g. Stanford University"
              value={contextData.university || ''}
              onChange={(e) => setContextData(prev => ({ ...prev, university: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={contextData.date || ''}
              onChange={(e) => setContextData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button type="submit">Continue to Recording</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
