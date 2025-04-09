
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

const TaskDetails: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          <div className="text-center">
            <p className="text-destructive">Error: {error || "Task not found"}</p>
            <Button 
              variant="secondary"
              onClick={() => navigate('/dashboard/tasks')}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tasks
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async () => {
    // Implementation for delete functionality
    navigate('/dashboard/tasks');
  };

  const handleEdit = () => {
    navigate(`/dashboard/tasks/edit/${taskId}`);
  };

  const handleComplete = async () => {
    // Implementation for mark as complete functionality
    navigate('/dashboard/tasks');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/tasks')}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>
        
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{task.title}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge className={`${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
                <Badge className={`${getStatusColor(task.status)}`}>
                  {task.status === 'in-progress' 
                    ? 'In Progress' 
                    : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={handleEdit}
              >
                <Edit className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-8"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="whitespace-pre-wrap">
                {task.description || "No description provided."}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  Due Date: {task.due_date 
                    ? format(new Date(task.due_date), "MMMM d, yyyy") 
                    : "No due date"}
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  Created: {format(new Date(task.created_at), "MMMM d, yyyy")}
                </span>
              </div>
            </div>
            
            {task.subtasks && task.subtasks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Subtasks</h3>
                <ul className="space-y-2">
                  {task.subtasks.map((subTask, index) => (
                    <li key={index} className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-2 ${subTask.completed ? 'bg-green-500' : 'bg-amber-500'}`} />
                      <span className={subTask.completed ? 'line-through text-muted-foreground' : ''}>
                        {subTask.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            {task.status !== 'completed' && (
              <Button 
                className="w-full" 
                onClick={handleComplete}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Complete
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetails;
