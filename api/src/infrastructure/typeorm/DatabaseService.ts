import { Connection, ConnectionOptions, createConnection, EntitySchema, ObjectType, Repository } from 'typeorm';
import Logger from '../Logger';

export class DatabaseService {
  private static connection: Connection;
  private _configuration: ConnectionOptions;

  public constructor(config: ConnectionOptions) {
    this._configuration = config;
  }

  public async getConnection(): Promise<Connection> {
    if (DatabaseService.connection instanceof Connection) {
      return DatabaseService.connection;
    }

    try {
      DatabaseService.connection = await createConnection(this._configuration);
      Logger.info(`Database connection established`);
      return DatabaseService.connection;
    } catch (e) {
      Logger.error(`Cannot establish database connection: ${e.message}`);
      process.exit(1);
    }
  }

  public async getRepository<T>(repository: EntitySchema<T>): Promise<Repository<T>> {
    const connection = await this.getConnection();
    return await connection.getRepository<T>(repository);
  }
}
