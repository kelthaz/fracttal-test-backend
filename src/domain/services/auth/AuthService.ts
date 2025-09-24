import { AppDataSource } from '../../../config/data-source';
import { User } from '../../entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

export class AuthService {
    private userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }

    async register(email: string, password: string, name: string) {
        // 1. Validar que el usuario no exista
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('El correo electrónico ya está en uso');
        }

        // 2. Hashear la contraseña de forma segura
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Crear y guardar el nuevo usuario en la DB
        const user = this.userRepository.create({ email, password: hashedPassword, name });
        await this.userRepository.save(user);

        return user;
    }

    async login(email: string, password: string): Promise<string> {
        // 1. Buscar el usuario por email
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        // 2. Comparar la contraseña ingresada con la hasheada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }

        // 3. Generar un JWT y devolverlo
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET! , { expiresIn: '2h' });
        return token;
    }

    async getUserById(id: string) {
        // lógica para obtener el usuario de la base de datos
        return await this.userRepository.findOneBy({ id });
    }
}