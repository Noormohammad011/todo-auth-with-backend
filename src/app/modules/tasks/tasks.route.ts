import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TaskController } from './tasks.controller';
import { tasksSchemaValidator } from './tasks.validation';

const router = express.Router();

router.get('/', auth(), TaskController.getAllTasks);
router.post(
  '/',
  auth(),
  validateRequest(tasksSchemaValidator.createTaskZodSchema),
  TaskController.createTask,
);
router
  .route('/:id')
  .get(auth(), TaskController.getSingleTask)
  .delete(auth(), TaskController.deleteTask);

router.patch(
  '/:id',
  auth(),
  validateRequest(tasksSchemaValidator.updateTaskZodSchema),
  TaskController.updateTask,
);
export const TasksRoute = router;
