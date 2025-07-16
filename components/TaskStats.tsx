"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';
import { Task, TaskStats } from '@/types';
import { checkTwoDate } from '@/lib/utils';

interface TaskStatsProps {
  dayTasks: Task[];
  selectedDate: Date;
}

export function TaskStatsComponent({ dayTasks, selectedDate }: TaskStatsProps) {
  console.log("dat",dayTasks)
  const getOverallStats = (): TaskStats => {
    const total = dayTasks.length;
    const completed = dayTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, pending, completionRate };
  };

  const getTodayStats = (): TaskStats => {
    const todayTasks = dayTasks.filter(dt => checkTwoDate(new Date(), dt.date))
    const total = todayTasks.length;
    const completed = todayTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, pending, completionRate };
  };

  const getWeeklyStats = (): TaskStats => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyTasks = dayTasks.filter(dt => new Date(dt.date) >= weekAgo);
    
    const total = weeklyTasks.length;
    const completed = weeklyTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, pending, completionRate };
  };

  const getSelectedDateStats = (): TaskStats => {
    const selectedTasks = dayTasks.filter((dt) =>
      checkTwoDate(selectedDate, dt.date)
    );
    const total = selectedTasks.length;
    const completed = selectedTasks.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return { total, completed, pending, completionRate };
  };

  const overallStats = getOverallStats();
  const todayStats = getTodayStats();
  const weeklyStats = getWeeklyStats();
  const selectedStats = getSelectedDateStats();

  const statCards = [
    {
      title: "Today's Progress",
      icon: <Target className="h-5 w-5" />,
      stats: todayStats,
      color: "text-blue-600",
    },
    {
      title: "Selected Date",
      icon: <Clock className="h-5 w-5" />,
      stats: selectedStats,
      color: "text-purple-600",
    },
    {
      title: "This Week",
      icon: <TrendingUp className="h-5 w-5" />,
      stats: weeklyStats,
      color: "text-green-600",
    },
    {
      title: "Overall",
      icon: <CheckCircle2 className="h-5 w-5" />,
      stats: overallStats,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <Card key={index} className="transition-all duration-200 hover:shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <span className={card.color}>{card.icon}</span>
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{card.stats.completed}</span>
                <Badge variant="secondary" className="text-xs">
                  {card.stats.total} total
                </Badge>
              </div>
              
              <Progress value={card.stats.completionRate} className="h-2" />
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{card.stats.pending} pending</span>
                <span>{Math.round(card.stats.completionRate)}% complete</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}