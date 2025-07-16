"use client";

import { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { checkTwoDate, getDaysInMonth } from '@/lib/monthutil';
import  { cn } from "@/lib/utils"
import { Task, TaskStats } from '@/types';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  data: Task[];
}

export function Calendar({ selectedDate, onDateSelect, data }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = getDaysInMonth(currentMonth).days;
  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentMonth(newMonth);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };
  
  const getTaskStatsForDate = (date: Date): TaskStats => {
  
    if ((Array.isArray(data) && data.length === 0)) {
      return { total: 0, completed: 0, pending: 0, completionRate: 0 };
    }
  
    let dayTask: any[] = [];
  
    if (Array.isArray(data)) {
      dayTask = data.filter(dt=> checkTwoDate(date, dt.date))
    }
  
    const total = dayTask.length;
    const completed = dayTask.filter(task => task.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? (completed / total) * 100 : 0;
  
    return { total, completed, pending, completionRate };
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Calendar</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthYear}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {
          days.map((day, index) => {
            const stats = getTaskStatsForDate(day);
            const hasTasksToday = stats.total > 0;
            return (
              <button
                key={index}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "relative aspect-square p-2 text-sm rounded-md transition-all duration-200",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  {
                    "text-muted-foreground": !isCurrentMonth(day),
                    "bg-primary text-primary-foreground": isSelected(day),
                    "ring-2 ring-primary ring-offset-2": isToday(day) && !isSelected(day),
                    "font-semibold": isToday(day),
                  }
                )}
              >
                <span className="relative z-10">{new Date(day.toISOString()).getDate()}</span>
                {hasTasksToday && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    <div 
                      className={cn(
                        "w-1 h-1 rounded-full",
                        stats.completionRate === 100 ? "bg-green-500" : 
                        stats.completionRate > 0 ? "bg-yellow-500" : "bg-red-500"
                      )}
                    />
                    {stats.total > 1 && (
                      <div className="w-1 h-1 rounded-full bg-current opacity-50" />
                    )}
                  </div>
                )}
              </button>
            );
          })
          }
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Pending</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}