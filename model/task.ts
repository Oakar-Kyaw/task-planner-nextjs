import mongoose, { Schema, models, model } from "mongoose";

const TaskSchema = new Schema({
      date: { type: Date, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      completedTaskNotes: { type: String },
      completed: { type: Boolean, required: true, default: false },
      priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
      category: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      completedAt: { type: Date },
      dueDate: { type: Date }
});

const Tasks = models.Task || model("Task", TaskSchema);
export default Tasks;
