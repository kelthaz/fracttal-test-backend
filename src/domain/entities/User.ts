import { Entity, PrimaryGeneratedColumn, Column, OneToMany,CreateDateColumn } from 'typeorm';
import { Task } from './Task';
import { Category } from './Category';
import { Tag } from './Tag';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks!: Task[];

  @OneToMany(() => Category, (category) => category.user)
  categories!: Category[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags!: Tag[];

  @CreateDateColumn()
  created_in!: Date;
}