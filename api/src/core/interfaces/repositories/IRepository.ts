import { BaseEntity } from "@/core/entities/BaseEntity";

export interface IRepository<TEntity extends BaseEntity> {
  getAll(): Promise<TEntity[] | undefined>;
  getById(id: string): Promise<TEntity | undefined>;
  add(entity: TEntity): Promise<TEntity | undefined>;
  update(entity: TEntity): Promise<boolean>;
  delete(entity: TEntity): Promise<boolean>;
}
