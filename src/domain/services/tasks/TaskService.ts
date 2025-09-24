import { AppDataSource } from '../../../config/data-source';
import { Task } from '../../entities/Task';
import { Tag } from "../../../domain/entities/Tag";
import { Category } from "../../../domain/entities/Category";

export class TasksService {
  private taskRepository = AppDataSource.getRepository(Task);
  private tagRepository = AppDataSource.getRepository(Tag);
  private categoryRepository = AppDataSource.getRepository(Category);

  async getAll(userId: string, filters: any) {
    const query = this.taskRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.tags', 'tag')
      .leftJoinAndSelect('task.category', 'category')
      .where('task.userId = :userId', { userId });

    // Filtro por completada
    if (filters.completada !== undefined) {
      query.andWhere('task.complete = :complete', { complete: filters.completada === 'true' });
    }

    // Filtro por categoría
    if (filters.categoria) {
      query.andWhere('category.id = :catId', { catId: filters.categoria });
    }

    // Filtro por prioridad
    if (filters.prioridad) {
      query.andWhere('task.priority = :priority', { priority: filters.prioridad });
    }

    // Filtro por rango de fecha de vencimiento
    if (filters.fecha_vencimiento) {
      const [startStr, endStr] = filters.fecha_vencimiento.split(',');

      let start: Date | undefined;
      let end: Date | undefined;

      if (startStr) {
        start = new Date(startStr);
        start.setHours(0, 0, 0, 0); // inicio del día
      }

      if (endStr) {
        end = new Date(endStr);
        end.setHours(23, 59, 59, 999); // fin del día
      } else if (start) {
        end = new Date(start);
        end.setHours(23, 59, 59, 999); // si solo hay inicio, fin = mismo día
      }

      if (start && end) {
        query.andWhere('task.expiration_date BETWEEN :start AND :end', { start, end });
      }
    }

    // Búsqueda por título y descripción
    if (filters.busqueda) {
      query.andWhere('(task.title ILIKE :search OR task.description ILIKE :search)', { search: `%${filters.busqueda}%` });
    }

    // Filtrar por nombres de etiquetas
    if (filters.etiquetas) {
      const tagsArray = Array.isArray(filters.etiquetas) ? filters.etiquetas : filters.etiquetas.split(',');
      query.andWhere('tag.name IN (:...tags)', { tags: tagsArray });
    }

    // Ordenar
    // Ordenar
    if (filters.ordenar) {
      const dir = filters.direccion?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

      // Mapear valores de filtro a columnas reales
      const columnMap: Record<string, string> = {
        created_in: 'task.created_in',
        expiration_date: 'task.expiration_date',
        priority: 'task.priority',
        title: 'task.title',
      };

      const column = columnMap[filters.ordenar] || 'task.created_in';
      query.orderBy(column, dir as 'ASC' | 'DESC');
    } else {
      query.orderBy('task.created_in', 'DESC'); // Default
    }


    const tasks = await query.getMany();

    // Mapear tags y category para que solo tengan id y name
    return tasks.map(task => ({
      ...task,
      tags: task.tags.map(tag => ({ id: tag.id, name: tag.name })),
      category: task.category ? { id: task.category.id, name: task.category.name } : null,
    }));
  }


  async create(userId: string, data: any) {
    const tarea = this.taskRepository.create({
      ...data,
      user: { id: userId }, // relaciona con el usuario
      complete: false,      // por defecto incompleta
    });
    return this.taskRepository.save(tarea);
  }

  async update(userId: string, taskId: string, data: any) {
    const task = await this.taskRepository.findOne({
      where: { id: taskId, user: { id: userId } },
      relations: ['tags', 'category'],
    });

    if (!task) throw new Error("Tarea no encontrada");

    const { tags, categoryId, ...rest } = data;
    Object.assign(task, rest);

    // Manejar categoría
    if (categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: categoryId, user: { id: userId } },
      });
      if (!category) throw new Error("Categoría no encontrada");
      task.category = category;
    }

    // Manejar tags
    if (tags && tags.length > 0) {
      const tagEntities = await this.tagRepository.findByIds(tags);
      task.tags = tagEntities;
    }

    return this.taskRepository.save(task);
  }

  async delete(userId: string, id: string) {
    const result = await this.taskRepository.delete({ id, user: { id: userId } });
    return result; // Por ejemplo, devuelve { affected: number }
  }


  async toggleComplete(userId: string, id: string) {
    const tarea = await this.taskRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!tarea) throw new Error("Tarea no encontrada");

    tarea.complete = !tarea.complete;
    return this.taskRepository.save(tarea);
  }

}
