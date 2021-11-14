export interface IDatabaseService {
  getConnection(): Promise<any>;
  getRepository<T>(repository: any): Promise<any>;
}
