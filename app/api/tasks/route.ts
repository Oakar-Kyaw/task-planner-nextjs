import connectMongo from "@/lib/connectDB";
import Task from "@/model/task";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connectMongo();
  const tasks = await Task.find({});
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  await connectMongo();
  const data = await request.json();

  // Validate data here if needed

  const newTask = new Task(data);
  await newTask.save();

  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: NextRequest) {
  await connectMongo();
  const data = await request.json();

  if (!data._id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const updatedTask = await Task.findByIdAndUpdate(data._id, data, { new: true });

  if (!updatedTask) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(updatedTask);
}

export async function DELETE(request: NextRequest) {
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }

  const deleted = await Task.findByIdAndDelete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Task deleted successfully" });
}
