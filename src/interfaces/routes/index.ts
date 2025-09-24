import { Router } from 'express';
import authRoutes from './auth/auth.routes';
import taskRoutes from './tasks/task.routes';
import categoryRoutes from './categories/category.routes';
import tagsRoutes from './tags/tag.routes';

const router = Router();

router.use('/api/auth', authRoutes);
router.use('/api/tareas', taskRoutes);
router.use('/api/etiquetas', tagsRoutes);
router.use('/api/categorias', categoryRoutes);

export default router;