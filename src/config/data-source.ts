import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../domain/entities/User';
import { Category } from '../domain/entities/Category'; 
import { Task } from '../domain/entities/Task'; 
import { Tag } from '../domain/entities/Tag'; 
import * as dotenv from 'dotenv';

// Carga las variables de entorno desde el archivo .env
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // ¡ATENCIÓN! Usar solo en desarrollo, no en producción
  logging: true,
  entities: [User, Task, Category, Tag],
  migrations: [
    'src/infrastructure/migrations/*.ts',
  ], // Si decides usar migraciones
  subscribers: [],
});