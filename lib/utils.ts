import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDaysInMonth(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push(day);
  }
  
  return { days , firstDay };
};

export function checkTwoDate(targetDay: Date, taskDay: string): boolean {
  const targetYear = targetDay.getFullYear();
  const targetMonth = targetDay.getMonth();
  const targetDate = targetDay.getDate();
  const taskDate = new Date(taskDay);
  return taskDate.getFullYear() === targetYear &&
               taskDate.getMonth() === targetMonth &&
               taskDate.getDate() === targetDate;
}