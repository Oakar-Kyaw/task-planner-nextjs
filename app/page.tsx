"use client"

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/Calendar';
import { TaskList } from '@/components/TaskList';
import { TaskStatsComponent } from '@/components/TaskStats';
import { Toaster } from '@/components/ui/sonner';
import { showTaskNotification, scheduleDailyReminders } from '@/lib/notifications';
import { Task } from '@/types';
import Image from 'next/image';
import { getTasksAction } from '@/lib/taskServerAction';
import { useQuery } from '@tanstack/react-query';
import { getDaysInMonth } from '@/lib/utils';
export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data, refetch , error, isLoading } = useQuery({
    queryKey: ["tasks"], 
    queryFn: () =>  getTasksAction({selectedDate})
  })

  const firstDayofMonth = getDaysInMonth(new Date()).firstDay;
  const AllTasks = useQuery({
    queryKey: ["taskuntiltoday"], 
    queryFn: () =>  getTasksAction({firstDate: firstDayofMonth, endDate: new Date()})
  })
  
  useEffect(() => {
    scheduleDailyReminders();
    // Welcome message
    setTimeout(() => {
      showTaskNotification('info', "Welcome Ko Ko's Mee Mee Lay to Task Planner! 📋 Select a date to manage your tasks.");
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      refetch();
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  };

  if (isLoading || AllTasks.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-blue-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Task Planner
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Organize your tasks and track your progress with our beautiful
              calendar interface.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Image
              src="/cm.jpg"
              alt="ACM Logo"
              width={50}
              height={50}
              className="rounded-full object-cover shadow-lg"
            />
          </div>
        </div>

        <div className="my-8">
          <TaskStatsComponent dayTasks={AllTasks.data?.data as Task[] || []} selectedDate={selectedDate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              data={AllTasks.data?.data as Task[] || []}
            />
          </div>

          <div className="space-y-6">
            <TaskList
              isLoading = {isLoading}
              selectedDate={selectedDate}
              tasks={data?.data as Task[] || []}
              onShowNotification={showTaskNotification}
            />
          </div>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}