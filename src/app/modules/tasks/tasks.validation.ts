import { z } from 'zod';

const createTaskZodSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(255),
    description: z.string().min(5).max(255),
    user: z.string().optional(),
    isCompleted: z.boolean(),
  }),
});

const updateTaskZodSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(255).optional(),
    description: z.string().min(5).max(255).optional(),
    user: z.string().optional(),
    isCompleted: z.boolean().optional(),
  }),
});

export const tasksSchemaValidator = {
  createTaskZodSchema,
  updateTaskZodSchema,
};
