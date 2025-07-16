export interface Task {
  _id: string;
  title: string;
  date: string;
  description: string;
  completedTaskNotes: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
}

export interface DayTasks {
  date: string;
  tasks: Task[];
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
}