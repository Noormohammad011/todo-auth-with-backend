import express from 'express';
import { AuthRoute } from '../modules/auth/auth.route';
import { TasksRoute } from '../modules/tasks/tasks.route';

const router = express.Router();
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/tasks',
    route: TasksRoute,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
