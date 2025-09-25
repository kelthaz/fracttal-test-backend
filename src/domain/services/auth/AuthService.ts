import { AppDataSource } from '../../../infrastructure/config/data-source';
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
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('El correo electrónico ya está en uso');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({ email, password: hashedPassword, name });
        await this.userRepository.save(user);

        return user;
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('Credenciales inválidas');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Credenciales inválidas');
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '2h' });
        return token;
    }

    async getUserById(id: string) {
        return await this.userRepository.findOneBy({ id });
    }
}