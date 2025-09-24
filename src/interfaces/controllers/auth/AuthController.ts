import { Request, Response } from 'express';
import { AuthService } from '../../../domain/services/auth/AuthService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // Arrow function mantiene el contexto de 'this'
    register = async (req: Request, res: Response) => {
        try {
            const { email, password, name } = req.body;
            const user = await this.authService.register(email, password, name);
            res.status(201).json({ message: 'Usuario registrado exitosamente', userId: user.id });
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;
            const token = await this.authService.login(email, password);
            res.status(200).json({ token });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };

    // authController.ts
    getProfile = async (req: Request, res: Response) => {
        try {
            const userId = req.user!.id;
            if (!userId) {
                return res.status(401).json({ error: 'Usuario no autenticado' });
            }

            const user = await this.authService.getUserById(userId); // debes implementar este método
            res.status(200).json({ user });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

}
