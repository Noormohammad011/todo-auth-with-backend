import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { User } from '../auth/auth.model';
import { ITasks } from './tasks.interface';
import { Task } from './tasks.model';

const createTask = async (
  userID: string,
  payload: ITasks,
): Promise<ITasks | null> => {
  const isUserExist = await User.findOne({ _id: userID });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const { title, description, isCompleted } = payload;
  const result = await Task.create({
    title,
    description,
    isCompleted,
    user: isUserExist._id,
  });
  return result;
};

const getAllTasks = async (
  userID: string,
  email: string,
): Promise<ITasks[] | null> => {
  const isUserExist = await User.findOne({
    _id: userID,
    email,
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const result = await Task.find({ 
    user: {
      $in: await User.find({ _id: userID }),
    },
   }).populate('user');
  return result
};

const getSingleTask = async (
  id: string,
  userID: string,
): Promise<ITasks | null> => {
  const isUserExist = await User.findOne({ _id: userID });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const result = await Task.findById({ _id: id }).populate('user');
  return result;
};

const updateTask = async (
  id: string,
  userID: string,
  payload: ITasks,
): Promise<ITasks | null> => {
  const isUserExist = await User.findOne({ _id: userID });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const { ...taskData } = payload;
  const updateBookData: Partial<ITasks> = { ...taskData };
  const result = await Task.findOneAndUpdate({ _id: id }, updateBookData, {
    new: true,
    validateBeforeSave: true,
  });
  return result;
};

const deleteTask = async (
  userID: string,
  id: string,
): Promise<ITasks | null> => {
  const isUserExist = await User.findOne({ _id: userID });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!');
  }
  const result = await Task.findOneAndDelete({ _id: id });
  return result;
};

export const TaskService = {
  getAllTasks,
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
};
