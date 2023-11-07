import { Document, Model, Types } from 'mongoose';
import { IUser } from '../auth/auth.interface';

export type ITasks = {
  title: string;
  description: string;
  user?: Types.ObjectId | IUser;
  isCompleted: boolean;
} & Document;


export const ITaskSearchableFiels = ['title'];
export type ITasksFilters = {
  searchTerm?: string;
  page?: string;
  limit?: string;
  isCompleted?: string;
};

export type TaskModel = Model<ITasks, Record<string, unknown>>;
