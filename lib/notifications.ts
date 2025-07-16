

import { toast } from 'sonner';

export const showTaskNotification = (type: 'success' | 'error' | 'info', message: string) => {
  switch (type) {
    case 'success':
      toast.success(message, {
        duration: 3000,
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
      });
      break;
    case 'error':
      toast.error(message, {
        duration: 4000,
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--destructive))',
        },
      });
      break;
    case 'info':
      toast.info(message, {
        duration: 3000,
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
      });
      break;
  }
};

export const scheduleDailyReminders = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);
  
  const timeUntilReminder = tomorrow.getTime() - now.getTime();
  
  setTimeout(() => {
    showTaskNotification('info', '🌅 Hello Mee Mee! Don\'t forget to plan your tasks for today.');
    scheduleDailyReminders();
  }, timeUntilReminder);
};