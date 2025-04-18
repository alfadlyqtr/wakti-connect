
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Clock, Download, Edit2, Check, X } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';

export interface SavedMeeting {
  id: string;
  title: string;
  summary: string;
  date: string;
  duration: number;
  has_audio?: boolean;
  expiresAt: string;
}

interface SavedMeetingsListProps {
  savedMeetings: SavedMeeting[];
  isLoadingHistory: boolean;
  onDelete?: (id: string) => void;
  onUpdateTitle?: (id: string, newTitle: string) => void;
  onSelect?: (meeting: SavedMeeting) => void;
  onDownload?: (meetingId: string) => void;
}

const SavedMeetingsList: React.FC<SavedMeetingsListProps> = ({
  savedMeetings,
  isLoadingHistory,
  onDelete,
  onUpdateTitle,
  onSelect,
  onDownload
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  if (isLoadingHistory) {
    return (
      <div className="py-4 text-center">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full inline-block mr-2"></div>
        <span>Loading saved meetings...</span>
      </div>
    );
  }

  if (savedMeetings.length === 0) {
    return null;
  }

  const handleEditStart = (meeting: SavedMeeting) => {
    setEditingId(meeting.id);
    setEditingTitle(meeting.title);
  };

  const handleEditSave = async (id: string) => {
    if (onUpdateTitle) {
      await onUpdateTitle(id, editingTitle);
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const getDaysRemaining = (expiresAt: string) => {
    const daysLeft = differenceInDays(new Date(expiresAt), new Date());
    return Math.max(0, daysLeft);
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Saved Meetings</h3>
      <div className="space-y-3">
        {savedMeetings.map((meeting) => {
          const daysRemaining = getDaysRemaining(meeting.expiresAt);
          
          return (
            <div 
              key={meeting.id} 
              className="p-3 border rounded-md flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex-1 cursor-pointer" onClick={() => onSelect && onSelect(meeting)}>
                <div className="flex items-center gap-2">
                  {editingId === meeting.id ? (
                    <div className="flex items-center gap-2 w-full">
                      <Input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1"
                        placeholder="Enter title"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditSave(meeting.id)}
                        title="Save"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleEditCancel}
                        title="Cancel"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-medium flex-1">{meeting.title}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(meeting);
                        }}
                        title="Edit title"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDistanceToNow(new Date(meeting.date), { addSuffix: true })}</span>
                  <span className="mx-1">•</span>
                  <span>{Math.floor(meeting.duration / 60)}:{(meeting.duration % 60).toString().padStart(2, '0')}</span>
                  <span className="mx-1">•</span>
                  <span className={`${daysRemaining <= 2 ? 'text-red-500' : ''}`}>
                    {daysRemaining} days left
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {meeting.has_audio && onDownload && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(meeting.id);
                    }}
                    title="Download audio"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
                
                {onDelete && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(meeting.id);
                    }}
                    title="Delete meeting"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedMeetingsList;
