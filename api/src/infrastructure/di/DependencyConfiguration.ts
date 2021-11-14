import { MemeService } from '../../core/services/MemeService';
import { Container, decorate, inject, injectable, named } from 'inversify';
import { StorageService } from '../StorageService';
import { MemeRepository } from '../typeorm/repositories/MemeRepository';
import DI_TYPES from './DependencyTypes';
import config from '../AppSettings';
import { DatabaseService } from '../typeorm/DatabaseService';
import { ConnectionOptions } from 'typeorm';
import { IMemeRepository } from '../../core/interfaces/repositories/IMemeRepository';
import { IStorageService } from '../../core/interfaces/services/IStorageService';
import { IMemeService } from '../../core/interfaces/services/IMemeService';

// Decorate/declare as injectable classes and its dependencies
decorate(injectable(), MemeRepository);
decorate(injectable(), MemeService);
decorate(injectable(), StorageService);
decorate(injectable(), DatabaseService); // a typeorm database connection

// Decorate/declare with inject the dependencies of our classes
// need to maintain the order of injection in target classes based on its constructors
decorate(inject(DI_TYPES.ConnectionOptions), DatabaseService, 0);
decorate(named('DatabaseConnectionOptions'), DatabaseService, 0);

decorate(inject(DI_TYPES.DatabaseService), MemeRepository, 0);

decorate(inject(DI_TYPES.MemeRepository), MemeService, 0);
decorate(inject(DI_TYPES.StorageService), MemeService, 1);

// Creating a container
//https://doc.inversify.cloud/en/inheritance.html
const container: Container = new Container({ skipBaseClassChecks: true });

container
  .bind<ConnectionOptions>(DI_TYPES.ConnectionOptions)
  .toConstantValue({
    type: 'postgres',
    url: config.database.url,
    entities: [config.database.mappingsPath],
  })
  .whenTargetNamed('DatabaseConnectionOptions');
// self binding, only for create an instance
container.bind<DatabaseService>(DI_TYPES.DatabaseService).to(DatabaseService);

container.bind<IMemeRepository>(DI_TYPES.MemeRepository).to(MemeRepository);
container.bind<IStorageService>(DI_TYPES.StorageService).to(StorageService);
container.bind<IMemeService>(DI_TYPES.MemeService).to(MemeService);

export default container;
