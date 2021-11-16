import { User } from '@/core/entities/User';
import { IRepository } from './IRepository';

export interface IUserRepository extends IRepository<User> {
  getByToken(token: string): Promise<User | undefined>;
  getByProviderId(providerId: string): Promise<User | undefined>;
}
