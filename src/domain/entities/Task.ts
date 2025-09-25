import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Category } from './Category';
import { Tag } from './Tag';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    title!: string;

    @Column({ nullable: true })
    description!: string;

    @Column({ default: false })
    complete!: boolean;

    @Column({ type: 'timestamp', nullable: true })
    expiration_date!: Date;

    @Column({ default: 'media' })
    priority!: string;

    @CreateDateColumn()
    created_in!: Date;

    @UpdateDateColumn()
    updated_in!: Date;

    @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
    user!: User;

    @ManyToOne(() => Category, (category) => category.tasks, { nullable: true, onDelete: 'SET NULL' })
    category!: Category;

    @ManyToMany(() => Tag, (tag) => tag.tasks)
    @JoinTable({
        name: 'task_tags',
        joinColumn: {
            name: 'task_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'tag_id',
            referencedColumnName: 'id',
        },
    })
    tags!: Tag[];
}