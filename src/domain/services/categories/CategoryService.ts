import { AppDataSource } from "../../../infrastructure/config/data-source";
import { Category } from "../../../domain/entities/Category";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);

  async getAll(userId: string) {
    return this.categoryRepository.find({ where: { user: { id: userId } } });
  }

  async create(userId: string, data: { name: string }) {
    if (!data.name || data.name.trim() === "") {
      throw new Error("El nombre de la categoría es obligatorio");
    }
    const category = this.categoryRepository.create({ ...data, user: { id: userId } });
    return this.categoryRepository.save(category);
  }

  async update(userId: string, id: string, data: { name: string }) {
    await this.categoryRepository.update({ id, user: { id: userId } }, data);
    return this.categoryRepository.findOne({ where: { id, user: { id: userId } } });
  }

  async delete(userId: string, id: string) {
    await this.categoryRepository.delete({ id, user: { id: userId } });
  }
}
