import { AppDataSource } from "../../../infrastructure/config/data-source";
import { Tag } from "../../../domain/entities/Tag";

export class TagService {
  private tagRepository = AppDataSource.getRepository(Tag);

  async getAll(userId: string) {
    return this.tagRepository.find({ where: { user: { id: userId } } });
  }

  async create(userId: string, data: { name: string }) {
    const tag = this.tagRepository.create({ ...data, user: { id: userId } });
    return this.tagRepository.save(tag);
  }
}
