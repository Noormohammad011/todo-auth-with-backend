import { ITasks } from "./tasks.interface";

export const tasksSearchableFields: (keyof ITasks)[] = ['title'];
export const tasksFilterableFields = [
  'searchTerm',
  'isCompleted',
];
