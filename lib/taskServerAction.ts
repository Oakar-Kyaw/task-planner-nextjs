"use server"

import connectMongo from '@/lib/connectDB';
import Tasks from '@/model/task';
import {  Task } from '@/types'; // Assuming Task type is defined

export interface ServerActionResult {
  success: boolean;
  data?: Task | Task[] | null;
  error?: string;
}

function serializeTask(task: any) {
    return {
      _id: task._id?.toString?.(),
      date: task.date?.toISOString?.() ?? null,
      title: task.title,
      description: task.description,
      completedTaskNotes: task.completedTaskNotes ?? '',
      completed: task.completed,
      priority: task.priority,
      category: task.category,
      createdAt: task.createdAt?.toISOString?.() ?? null,
      completedAt: task.completedAt?.toISOString?.() ?? null,
      dueDate: task.dueDate?.toISOString?.() ?? null,
    };
  }

export async function createTaskAction(taskData:Partial<Task>): Promise<ServerActionResult> {
  try {
    await connectMongo();
    console.log("Creating task with data:", taskData);
      const newTask = await Tasks.create(taskData);
      const plainObject = serializeTask(newTask);
      return { success: true, data: plainObject };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task." };
  }
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
} 

export async function getTasksAction({
  firstDate,
  endDate,
  selectedDate,
}: {
  firstDate?: Date,
  endDate?: Date,
  selectedDate?: Date
}): Promise<ServerActionResult> {
  try {
    await connectMongo();

    let query: Record<string, any> = {};

    if (firstDate && endDate) {
      query.date = {
        $gte: startOfDay(firstDate),
        $lt: startOfDay(endDate),
      };
    } else if (firstDate) {
      query.date = {
        $gte: startOfDay(firstDate),
        $lte: new Date(),
      };
    } else if (selectedDate) {
      const nextDay = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate() + 1
      );
      query.date = {
        $gte: startOfDay(selectedDate),
        $lt: nextDay,
      };
    } else {
      query.date = { $exists: true };
    }

    console.log("Fetching tasks with query:", query);

    const tasks = await Tasks.find(query).sort({ createdAt: -1 });

    if (tasks.length === 0) {
      return { success: false, error: "No tasks found." };
    }

    const serializedTasks = tasks.map((task: Task) => serializeTask(task));
    return { success: true, data: serializedTasks };
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return { success: false, error: "Failed to fetch tasks." };
  }
}

export async function updateTaskCompletionAction(taskId: string, completedStatus: boolean, completedTaskNotes: string): Promise<ServerActionResult> {
  try {
    await connectMongo();
    const update = {
      completed: completedStatus,
      completedAt: completedStatus ? new Date() : undefined,
      completedTaskNotes: completedStatus ? completedTaskNotes : undefined,
    };
    const updatedTaskDoc = await Tasks.findByIdAndUpdate(taskId , update, { new: true });

    if (!updatedTaskDoc) {
      return { success: false, error: "Task not found." };
    }
    const plainTask: Task = serializeTask(updatedTaskDoc);
    return { success: true, data: plainTask };
  } catch (error) {
    console.error("Error updating task completion:", error);
    return { success: false, error: "Failed to update task completion." };
  }
}

export async function deleteTaskAction(taskId: string): Promise<ServerActionResult> {
  try {
    await connectMongo();
    const deletedTask = await Tasks.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return { success: false, error: "Task not found." };
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task." };
  }
}