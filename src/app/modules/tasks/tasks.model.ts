import { Schema, model } from 'mongoose';
import { ITasks, TaskModel } from './tasks.interface';


export const tasksSchema = new Schema<ITasks, TaskModel>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


export const Task = model<ITasks, TaskModel>('Tasks', tasksSchema);
