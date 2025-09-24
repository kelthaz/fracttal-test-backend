import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => Task, (task) => task.category)
  tasks!: Task[];
}