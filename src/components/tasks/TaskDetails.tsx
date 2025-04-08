
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById } from '@/services/taskService';
import { Task } from '@/types/task.types';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Edit, 
  Trash2, 
  CheckCircle 
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;
      
      try {
        setLoading(true);
        const taskData = await getTaskById(taskId);
        setTask(taskData);
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'normal': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-amber-500';
      case 'late': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !task) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">
              {error || t("common.notFound")}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("common.notFoundMessage")}
            </p>
            <Button onClick={() => navigate('/dashboard/tasks')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.back")}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Translate status and priority
  const translatedStatus = t(`task.status.${task.status.replace('-', '')}`, task.status);
  const translatedPriority = t(`task.priority.${task.priority}`, task.priority);

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard/tasks')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> {t("common.back")}
        </Button>
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl mb-1">{task.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={getPriorityColor(task.priority)}>
                  {translatedPriority}
                </Badge>
                <Badge className={getStatusColor(task.status)}>
                  {translatedStatus}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
              {task.status !== 'completed' && (
                <Button variant="outline" size="icon" className="text-green-500">
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {task.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">{t("task.description")}</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{t("task.due")}: {format(new Date(task.due_date || Date.now()), 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{t("time.created")}: {format(new Date(task.created_at), 'PPP')}</span>
            </div>
          </div>
          
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">{t("task.subtasks")}</h3>
              <ul className="space-y-2">
                {task.subtasks.map((subtask, index) => (
                  <li key={subtask.id || index} className="flex items-center gap-2">
                    <div className={`h-4 w-4 rounded-full ${subtask.is_completed ? 'bg-green-500' : 'border border-muted-foreground'}`} />
                    <span className={subtask.is_completed ? 'line-through text-muted-foreground' : ''}>
                      {subtask.content}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          {task.status !== 'completed' ? (
            <Button className="w-full">{t("task.status.markCompleted")}</Button>
          ) : (
            <div className="text-center w-full text-muted-foreground">
              {t("task.completedTime.at")} {format(new Date(task.completed_at || task.updated_at || ''), 'PPP')}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TaskDetails;
