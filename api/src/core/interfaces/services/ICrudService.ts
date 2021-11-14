export interface ICrudService {
  list: (limit: number, page: number) => Promise<any>;
  create: (resource: any) => Promise<any>;
  update: (id: string, resource: any) => Promise<void>;
  get: (id: string) => Promise<any>;
  delete: (id: string) => Promise<void>;
}
