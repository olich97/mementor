import { User } from '@/core/entities/User';
import { IUserRepository } from '@/core/interfaces/repositories/IUserRepository';
import { Repository } from 'typeorm';
import { DatabaseService } from '../DatabaseService';
import { UserMapping } from '../mappings/UserMapping';

export class UserRepository implements IUserRepository {
  private _database: DatabaseService;

  constructor(_database: DatabaseService) {
    this._database = _database;
  }
  public async getByProviderId(providerId: string): Promise<User> {
    const users = await this.getCurrentRepository();
    return await users.findOne({ providerUserId: providerId });
  }

  public async getByToken(token: string): Promise<User> {
    const users = await this.getCurrentRepository();
    return await users.findOne({ token: token });
  }
  public async getAll(): Promise<User[]> {
    const users = await this.getCurrentRepository();
    return await users.find();
  }
  public async getById(id: string): Promise<User> {
    const users = await this.getCurrentRepository();
    return await users.findOne(id);
  }
  public async add(entity: User): Promise<User> {
    const users = await this.getCurrentRepository();
    return await users.save(entity);
  }
  public async update(entity: User): Promise<boolean> {
    const users = await this.getCurrentRepository();
    const result = await users.save(entity);
    return result !== undefined;
  }
  public async delete(entity: User): Promise<boolean> {
    const users = await this.getCurrentRepository();
    const result = await users.delete(entity);
    return result.affected !== 0;
  }
  private async getCurrentRepository(): Promise<Repository<User>> {
    return await this._database.getRepository<User>(UserMapping);
  }
}
