import { Router } from 'express';
import { AuthController } from '../../controllers/auth/AuthController';
import { registerValidation, loginValidation } from '../../middlewares/authValidation';
import { authenticateJWT } from '../../middlewares/authMiddleware';
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /auth/registro:
 *   post:
 *     summary: Registro de un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente.
 *       '400':
 *         description: El correo electrónico ya está en uso o faltan datos.
 */
router.post('/registro', registerValidation, validateRequest, authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicio de sesión de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: test1@gmail.com
 *               password:
 *                 type: string
 *                 example: 123
 *     responses:
 *       '200':
 *         description: Login exitoso, retorna token JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       '401':
 *         description: Credenciales inválidas.
 */

router.post('/login', loginValidation, validateRequest, authController.login);

/**
 * @swagger
 * /auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario actual
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Retorna los datos del usuario autenticado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 123456
 *                     name:
 *                       type: string
 *                       example: Juan Pérez
 *                     email:
 *                       type: string
 *                       example: test@gmail.com
 *       '401':
 *         description: No autenticado o token inválido
 */

router.get('/perfil', authenticateJWT, validateRequest, authController.getProfile);

export default router;