import { Meme } from '@/core/entities/Meme';
import { IMemeRepository } from '@/core/interfaces/repositories/IMemeRepository';
import { Like } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { DatabaseService } from '../DatabaseService';
import { MemeMapping } from '../mappings/MemeMapping';

export class MemeRepository implements IMemeRepository {
  private _database: DatabaseService;

  constructor(_database: DatabaseService) {
    this._database = _database;
  }

  async getByCode(code: string): Promise<Meme> {
    const memes = await this.getCurrentRepository();
    return await memes.findOne({ code: code }, { relations: ['content'] });
  }

  async query(searchOptions: any): Promise<Meme[]> {
    let options: any = {
      relations: ['content'],
      take: searchOptions.take || 10,
      skip: searchOptions.skip || 0,
      order: {
        lastUpdateDate: 'DESC',
      },
    };

    if (searchOptions.where) {
      //const operatorAndValue = searchOptions.where.operator === 'like' ?? Like(searchOptions.where.value);
      //const column =  searchOptions.where.column;
      options = {
        ...options,
        where: { text: Like(`%${searchOptions.where.value}%`) }, // TODO: make more dynamic
      };
    }
    const memes = await this.getCurrentRepository();
    return await memes.find(options);
  }

  async getAll(): Promise<Meme[]> {
    const memes = await this.getCurrentRepository();
    return await memes.find({ relations: ['content'] });
  }

  async getById(id: string): Promise<Meme> {
    const memes = await this.getCurrentRepository();
    return await memes.findOne(id, { relations: ['content'] });
  }

  async add(entity: Meme): Promise<Meme> {
    const memes = await this.getCurrentRepository();
    return await memes.save(entity);
  }

  async update(entity: Meme): Promise<boolean> {
    const memes = await this.getCurrentRepository();
    const result = await memes.save(entity);
    return result !== undefined;
  }

  async delete(entity: Meme): Promise<boolean> {
    const memes = await this.getCurrentRepository();
    const result = await memes.delete(entity);
    return result.affected !== 0;
  }

  private async getCurrentRepository(): Promise<Repository<Meme>> {
    return await this._database.getRepository<Meme>(MemeMapping);
  }
}
