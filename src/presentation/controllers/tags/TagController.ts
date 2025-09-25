import { Request, Response } from "express";
import { TagService } from "../../../domain/services/tags/TagService"; 

export class TagController {
  private tagService = new TagService();

  getAll = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const tags = await this.tagService.getAll(userId);

      if (tags.length === 0) {
        return res.status(200).json({ message: "No hay etiquetas disponibles" });
      }

      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const userId = req.user!.id;
      const tag = await this.tagService.create(userId, req.body);
      res.status(201).json(tag);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
