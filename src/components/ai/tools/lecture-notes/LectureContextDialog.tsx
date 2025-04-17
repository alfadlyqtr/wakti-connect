
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface LectureContextData {
  course?: string;
  instructor?: string;
  institution?: string;
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
    instructor: '',
    institution: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (field: keyof LectureContextData, value: string) => {
    setContextData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onClose(contextData);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Lecture Context</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="course">Course Name</Label>
            <Input
              id="course"
              placeholder="e.g. Introduction to Physics"
              value={contextData.course}
              onChange={(e) => handleInputChange('course', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructor">Instructor Name</Label>
            <Input
              id="instructor"
              placeholder="e.g. Dr. John Smith"
              value={contextData.instructor}
              onChange={(e) => handleInputChange('instructor', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input
              id="institution"
              placeholder="e.g. Harvard University"
              value={contextData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={contextData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>Skip</Button>
          <Button onClick={handleSubmit}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
