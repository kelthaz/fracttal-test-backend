import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne } from 'typeorm';
import { Task } from './Task';
import { User } from './User';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => User, (user) => user.tags, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToMany(() => Task, (task) => task.tags)
  tasks!: Task[];
}