import { Request, Response } from "express";
import { TasksService } from "../../../domain/services/tasks/TaskService";

export class TaskController {
  private taskService: TasksService;

  constructor() {
    this.taskService = new TasksService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
  
      const {
        completada,
        categoria,
        prioridad,
        fecha_vencimiento,
        busqueda,
        etiquetas,
        ordenar,
        direccion,
      } = req.query;
  
      const filters = {
        completada,
        categoria,
        prioridad,
        fecha_vencimiento,
        busqueda,
        etiquetas,
        ordenar,
        direccion,
      };
  
      const tasks = await this.taskService.getAll(userId, filters);
  
      if (tasks.length === 0) {
        return res.status(200).json({ message: "No hay tareas disponibles" });
      }
  
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
  

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const task = await this.taskService.create(userId, req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const { title, description, complete, priority, expiration_date, categoryId, tags } = req.body;
  
      const task = await this.taskService.update(userId, req.params.id, {
        title,
        description,
        complete,
        priority,
        expiration_date,
        categoryId,
        tags,
      });
  
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
  

  delete = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const result = await this.taskService.delete(userId, req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: "Tarea no encontrada" });
      }
      res.json({ message: `Tarea eliminada` });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  toggleComplete = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const task = await this.taskService.toggleComplete(userId, req.params.id);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
