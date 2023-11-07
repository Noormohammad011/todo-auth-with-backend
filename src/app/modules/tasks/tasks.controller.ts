import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ITasks } from './tasks.interface';
import { TaskService } from './tasks.service';

const createTask = catchAsync(async (req: Request, res: Response) => {
  const { _id: userID } = req.user as { _id: string };
  const result = await TaskService.createTask(userID, req.body);
  sendResponse<ITasks>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Task created successfully',
    data: result,
  });
});

const getAllTasks = catchAsync(async (req: Request, res: Response) => {
  const { _id: userID, email } = req.user as { _id: string; email: string };
  const result = await TaskService.getAllTasks(userID, email);
  sendResponse<ITasks[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Tasks fetched successfully',
    data: result,
  });
});

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { _id: userID } = req.user as { _id: string };
  const result = await TaskService.getSingleTask(id, userID);
  sendResponse<ITasks>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task fetched successfully',
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { _id: userID } = req.user as { _id: string };
  const { ...taskData } = req.body;
  const result = await TaskService.updateTask(id, userID, taskData);
  sendResponse<ITasks>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task updated successfully',
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { _id: userID } = req.user as { _id: string };
  const result = await TaskService.deleteTask(userID, id);
  sendResponse<ITasks>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Task deleted successfully',
    data: result,
  });
});

export const TaskController = {
  getAllTasks,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
};
