import { Router } from "express";
import { TaskController } from "../../controllers/tasks/TaskController";
import { authenticateJWT } from "../../middlewares/authMiddleware";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();
const taskController = new TaskController();

/**
 * @swagger
 * /tareas:
 *   get:
 *     summary: Obtener todas las tareas del usuario
 *     tags: [Tareas]
 *     parameters:
 *       - in: query
 *         name: completada
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: Filtrar por estado de completado
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Filtrar por ID de categoría
 *       - in: query
 *         name: prioridad
 *         schema:
 *           type: string
 *           enum: [baja, media, alta]
 *         description: Filtrar por nivel de prioridad
 *       - in: query
 *         name: fecha_vencimiento
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha de vencimiento (YYYY-MM-DD)
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Buscar en título y descripción
 *       - in: query
 *         name: etiquetas
 *         schema:
 *           type: string
 *         description: Filtrar por nombres de etiquetas separados por coma
 *       - in: query
 *         name: ordenar
 *         schema:
 *           type: string
 *           enum: [created_in, expiration_date, priority, title]
 *         description: Ordenar por campo
 *       - in: query
 *         name: direccion
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Dirección de ordenamiento
 *     responses:
 *       '200':
 *         description: Lista de tareas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   complete:
 *                     type: boolean
 *                   expiration_date:
 *                     type: string
 *                     format: date-time
 *                   priority:
 *                     type: string
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 */
router.get("/", authenticateJWT,taskController.getAll);

/**
 * @swagger
 * /tareas:
 *   post:
 *     summary: Crear nueva tarea
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Terminar prueba técnica
 *               description:
 *                 type: string
 *                 example: Hacer CRUD de tareas
 *     responses:
 *       '201':
 *         description: Tarea creada
 */
router.post("/", authenticateJWT, taskController.create);

/**
 * @swagger
 * /tareas/{id}:
 *   put:
 *     summary: Actualiza una tarea existente
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la tarea
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Comprar leche
 *               description:
 *                 type: string
 *                 example: En la tienda del barrio
 *               completar:
 *                 type: boolean
 *                 example: false
 *               priority:
 *                 type: string
 *                 example: alta
 *               expiration_date:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 example: 2025-09-25T12:00:00Z
 *               categoryId:
 *                 type: string
 *                 example: c1d2e3f4
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["t1", "t2"]
 *     responses:
 *       '200':
 *         description: Tarea actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Error de validación o tarea no encontrada
 *       '401':
 *         description: No autenticado o token inválido
 */

router.put("/:id", authenticateJWT,validateRequest, taskController.update);

/**
 * @swagger
 * /tareas/{id}:
 *   delete:
 *     summary: Eliminar tarea por ID
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tarea eliminada
 */
router.delete("/:id", authenticateJWT, taskController.delete);

/**
 * @swagger
 * /tareas/{id}/completar:
 *   patch:
 *     summary: Cambiar estado de completado
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Tarea marcada/desmarcada como completada
 */
router.patch("/:id/completar", authenticateJWT, taskController.toggleComplete);

export default router;
