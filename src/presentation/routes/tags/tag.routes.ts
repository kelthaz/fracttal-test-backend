import { Router } from "express";
import { TagController } from "../../controllers/tags/TagController";
import { authenticateJWT } from "../../middlewares/authMiddleware";

const router = Router();
const tagController = new TagController();
/**
 * @swagger
 * tags:
 *   name: Etiquetas
 *   description: Gestión de etiquetas del usuario
 */

/**
 * @swagger
 * /etiquetas:
 *   get:
 *     summary: Obtener todas las etiquetas del usuario
 *     tags: [Etiquetas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de etiquetas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get("/", authenticateJWT, tagController.getAll);

/**
 * @swagger
 * /etiquetas:
 *   post:
 *     summary: Crear una nueva etiqueta
 *     tags: [Etiquetas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Urgente
 *     responses:
 *       '201':
 *         description: Etiqueta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *       '400':
 *         description: Error al crear la etiqueta
 */
router.post("/", authenticateJWT, tagController.create);

export default router;
