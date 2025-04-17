
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Book, GraduationCap, CalendarIcon, User } from 'lucide-react';

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
  const [course, setCourse] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [university, setUniversity] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const contextData: LectureContextData = {};
    
    if (course.trim()) contextData.course = course.trim();
    if (lecturer.trim()) contextData.lecturer = lecturer.trim();
    if (university.trim()) contextData.university = university.trim();
    if (date.trim()) contextData.date = date.trim();
    
    onClose(contextData);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Lecture Details</DialogTitle>
          <DialogDescription>
            Add context to help generate better lecture notes. All fields are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="course" className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              Course Name
            </Label>
            <Input
              id="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Introduction to Psychology"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lecturer" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Lecturer Name
            </Label>
            <Input
              id="lecturer"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
              placeholder="e.g. Dr. Jane Smith"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="university" className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              University/School
            </Label>
            <Input
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="e.g. Stanford University"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-1">
              <CalendarIcon className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. April 17, 2025"
            />
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
