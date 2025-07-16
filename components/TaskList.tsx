"use client";

import { useState } from 'react';
import { Plus, Calendar, CheckCircle2, Circle, Clock, Flag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Task, TaskStats } from '@/types';
import { createTaskAction, deleteTaskAction, ServerActionResult, updateTaskCompletionAction } from '@/lib/taskServerAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface TaskListProps {
  selectedDate: Date;
  isLoading: boolean;
  tasks: Task[];
  onShowNotification: (type: 'success' | 'error' | 'info', message: string) => void;
}

export function TaskList({ selectedDate, tasks, isLoading, onShowNotification }: TaskListProps) {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showModalBox, setShowModalBox] = useState(false);
  const [completedTaskNoteInput, setCompletedTaskNoteInput] = useState('');
  
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high'; // 👈 constrain here
    category: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    category: 'Personal',
  });
  
  const stats: TaskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    completionRate: tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0,
  };

  const addMutationTask = useMutation({
    mutationFn: async (task: Partial<Task>): Promise<ServerActionResult> => {
      const result = await createTaskAction(task);
      if (!result.success) throw new Error(result.error || 'Failed to add task');
      return result;
    },
    onSuccess: () => {
      setNewTask({ title: '', description: '', priority: 'medium', category: 'Personal' });
      setShowAddForm(false);
      onShowNotification('success', 'Task added successfully!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskuntiltoday'] });
    },
    onError: (error: any) => {
      onShowNotification('error', 'Error adding task');
      console.error('Error adding task:', error);
    },
  });

  const updateMutationTask = useMutation({
    mutationFn: async (task: Task) => {
      return await updateTaskCompletionAction(task._id, task.completed, task.completedTaskNotes);
    },
    onSuccess: (data) => {
      if (!data.success) {
        onShowNotification('error', 'Failed to update task');
        return;
      }
      onShowNotification('success', 'Task updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskuntiltoday'] });
    },
    onError: (error: any) => {
      onShowNotification('error', 'Error updating task');
     // console.error('Error updating task:', error);
    },
  });

  const deleteMutationTask = useMutation({
    mutationFn: async (id: string) => await deleteTaskAction(id),
    onSuccess: (data) => {
      if (!data.success) {
        onShowNotification('error', 'Failed to delete task');
        return;
      }
      onShowNotification('success', 'Task deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['taskuntiltoday'] });
    },
    onError: (error: any) => {
      onShowNotification('error', 'Error deleting task');
     // console.error('Error deleting task:', error);
    },
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      onShowNotification('error', 'Please enter a task title');
      return;
    }

    const task: Partial<Task> = {
      date: new Date(selectedDate).toISOString(),
      title: newTask.title,
      description: newTask.description,
      completedTaskNotes: "",
      completed: false,
      priority: newTask.priority,
      category: newTask.category,
      createdAt: new Date(),
      dueDate: new Date(selectedDate),
    };

    addMutationTask.mutate(task);
  };

  const handleToggleTask = (task: Task) => {
    if (task.completed) return; // Prevent re-completion
    setSelectedTask(task);
    setCompletedTaskNoteInput('');
    setShowModalBox(true);
  };

  const handleConfirmComplete = () => {
    if (!selectedTask) return;

    const updatedTask = {
      ...selectedTask,
      completed: true,
      completedTaskNotes: completedTaskNoteInput,
    };

    updateMutationTask.mutate(updatedTask);
    setShowModalBox(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteMutationTask.mutate(taskId);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };


  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 md:gap-2">
            <Calendar className="h-4.5 w-4.5 md:h-5 md:w-5" /> {/* Note: Tailwind doesn't have 4.5, so we'll use 5 */}
            <span className="text-[15px] md:text-base">
              Tasks for {formatDate(selectedDate)}
            </span>
          </div>
          <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="gap-1.5 md:gap-2 text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2"
            >
              <Plus className="h-4 w-4 md:h-5 md:w-5" />
              Add Task
          </Button>
          </CardTitle>
          {tasks.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{stats.completed}/{stats.total} tasks completed</span>
              </div>
              <Progress value={stats.completionRate} className="w-full" />
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <Card className="p-4 border-2 border-dashed border-muted-foreground/25">
              <div className="space-y-4">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <Textarea
                  placeholder="Task description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    value={newTask.priority}
                    onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Priority</SelectItem>
                      <SelectItem value="medium">Medium Priority</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Category"
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddTask} className="flex-1">Add Task</Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">Cancel</Button>
                </div>
              </div>
            </Card>
          )}

          {tasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No tasks for this day</p>
              <p className="text-sm">Add a task to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card
                  key={task._id}
                  className={cn("transition-all duration-200 hover:shadow-md", task.completed && "opacity-75 bg-muted/50")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task)}
                        className="mt-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        {task.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className={cn("font-medium", task.completed && "line-through text-muted-foreground")}>
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <div className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))} />
                            <Badge variant="secondary" className="text-xs">
                              {task.category}
                            </Badge>
                          </div>
                        </div>
                        {task.description && (
                          <p className={cn("text-sm text-muted-foreground mb-2", task.completed && "line-through")}>
                            {task.description.split(/(https?:\/\/[^\s]+|www\.[^\s]+)/g).map((part, idx) => {
                              if (/^(https?:\/\/|www\.)/.test(part)) {
                                const href = part.startsWith('http') ? part : `https://${part}`;
                                return (
                                  <a
                                    key={idx}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline break-all"
                                  >
                                    {part}
                                  </a>
                                );
                              }
                              return <span key={idx}>{part}</span>;
                            })}
                          </p>
                        )}
                        {
                          task.completedTaskNotes && (
                            <p className='text-md py-2 text-red-500'>{task.completedTaskNotes}</p>
                          )
                        }
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Flag className="h-3 w-3" />
                            {task.priority}
                          </span>
                          <span>Created: {new Date(task.date).toLocaleDateString()}</span>
                          {task.completedAt && (
                            <span className="text-green-600">
                              ✓ Completed: {new Date(task.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModalBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Write what you want</h2>
            <Textarea
              rows={4}
              placeholder="Enter completion note..."
              value={completedTaskNoteInput}
              onChange={(e) => setCompletedTaskNoteInput(e.target.value)}
              className="w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModalBox(false)}>Cancel</Button>
              <Button onClick={handleConfirmComplete}>Update & Complete</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
