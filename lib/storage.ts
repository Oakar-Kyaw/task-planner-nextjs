import { Task, DayTasks } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import connectMongo from './connectDB';
import task from '@/model/task';

const STORAGE_KEY = 'taskPlanner_data';


export const saveTasksToStorage = (dayTasks: DayTasks[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dayTasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};
// export async function POST(req: NextRequest) {  
//   try {  
//       await connectMongo();  
//       const body = await req.json(); 
//       console.log("bod",body) 
//       // if (body.name) {  
//           const tasks = await task.create(body);  
//           return NextResponse.json(  
//               { tasks, message: 'Your task has been created' },  
//               { status: 200 },  
//           );  
//       // }  
//     //  return NextResponse.json({ message: 'Product name is missing' }, { status: HttpStatusCode.BadRequest });  
//   } catch (error) {  
//       return NextResponse.json({ message: error }, { status: 500 });  
//   }  
// }  

export async function GET(req: NextRequest) {
  try {
    await connectMongo();
    // const tasks = await task.find({});
    // return NextResponse.json(
    //   { tasks, message: 'Tasks retrieved successfully' },
    //   { status: 200 }
    // );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
export const loadTasksFromStorage = (): DayTasks[] => {
  try {

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((dayTask: any) => ({
      ...dayTask,
      tasks: dayTask.tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }))
    }));
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

export const getTasksForDate = (dayTasks: DayTasks[], date: Date): Task[] => {
  const dateString = date.toISOString().split('T')[0];
  const dayTask = dayTasks.find(dt => dt.date === dateString);
  return dayTask ? dayTask.tasks : [];
};

export const updateTasksForDate = (dayTasks: DayTasks[], date: Date, tasks: Task[]): DayTasks[] => {
  const dateString = date.toISOString().split('T')[0];
  const existingIndex = dayTasks.findIndex(dt => dt.date === dateString);
  
  if (existingIndex >= 0) {
    return dayTasks.map(dt => 
      dt.date === dateString ? { ...dt, tasks } : dt
    );
  } else {
    return [...dayTasks, { date: dateString, tasks }];
  }
};


