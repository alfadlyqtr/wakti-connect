
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Trash2, 
  BookOpenText, 
  CalendarClock, 
  Timer, 
  MapPin, 
  Loader2, 
  PenLine, 
  CheckCircle 
} from 'lucide-react';
import { formatDuration } from '@/utils/text/transcriptionUtils';
import { SavedMeeting } from '@/hooks/ai/meeting/useMeetingStorage';

interface SavedLectureProps {
  savedLectures: SavedMeeting[];
  isLoadingHistory: boolean;
  onDeleteLecture: (id: string) => Promise<void>;
  onEditLectureTitle: (id: string, newTitle: string) => Promise<void>;
}

const SavedLecturesList: React.FC<SavedLectureProps> = ({
  savedLectures,
  isLoadingHistory,
  onDeleteLecture,
  onEditLectureTitle
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartEdit = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onEditLectureTitle(id, editTitle);
      setEditingId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  if (savedLectures.length === 0 && !isLoadingHistory) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <BookOpenText className="h-4 w-4 mr-2 text-indigo-500" />
          <h3 className="text-sm font-medium">Saved Lectures</h3>
        </div>
        
        {isLoadingHistory ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <div className="rounded border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Duration</TableHead>
                  <TableHead className="hidden lg:table-cell">Location</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {savedLectures.map((lecture) => (
                  <TableRow key={lecture.id}>
                    <TableCell>
                      {editingId === lecture.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="h-8 text-sm"
                            placeholder="Enter lecture title"
                          />
                          <div className="flex items-center gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={() => handleSaveEdit(lecture.id)}
                              disabled={isSubmitting}
                              className="h-7 w-7"
                            >
                              {isSubmitting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                              )}
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost"
                              onClick={handleCancelEdit}
                              disabled={isSubmitting}
                              className="h-7 w-7"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="truncate">{lecture.title}</span>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleStartEdit(lecture.id, lecture.title)}
                            className="h-6 w-6 opacity-50 hover:opacity-100"
                          >
                            <PenLine className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarClock className="h-3 w-3 mr-1 flex-shrink-0" />
                        {new Date(lecture.date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Timer className="h-3 w-3 mr-1 flex-shrink-0" />
                        {formatDuration(lecture.duration)}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                      {lecture.location ? (
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                          {lecture.location}
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteLecture(lecture.id)}
                        className="h-8 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedLecturesList;
