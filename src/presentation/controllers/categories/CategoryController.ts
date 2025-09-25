import { Request, Response } from "express";
import { CategoryService } from "../../../domain/services/categories/CategoryService";

export class CategoryController {
  private categoryService = new CategoryService();

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const categories = await this.categoryService.getAll(userId);
      if (categories.length === 0) {
        return res.status(200).json({ message: "No hay categorías disponibles" });
      }
      
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const category = await this.categoryService.create(userId, req.body);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const category = await this.categoryService.update(userId, req.params.id, req.body);
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      await this.categoryService.delete(userId, req.params.id);
      res.json({ message: "Categoría eliminada" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
