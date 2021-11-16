import { MemeService } from '../../core/services/MemeService';
import { Container, decorate, inject, injectable, named } from 'inversify';
import { StorageService } from '../../infrastructure/StorageService';
import { MemeRepository } from '../../infrastructure/typeorm/repositories/MemeRepository';
import DI_TYPES from './DependencyTypes';
import config from '../../infrastructure/AppSettings';
import { DatabaseService } from '../../infrastructure/typeorm/DatabaseService';
import { ConnectionOptions } from 'typeorm';
import { IMemeRepository } from '../../core/interfaces/repositories/IMemeRepository';
import { IStorageService } from '../../core/interfaces/services/IStorageService';
import { IMemeService } from '../../core/interfaces/services/IMemeService';
import { IBaseController } from '../controllers/IBaseController';
import { MemeController } from '../controllers/MemeController';
import { OAuthController } from '../controllers/OAuthController';
import { UserRepository } from '../../infrastructure/typeorm/repositories/UserRepository';
import { GithubService } from '../../infrastructure/oauth/GithubService';
import { IOAuthService } from '@/core/interfaces/services/IOAuthService';
import { IUserRepository } from '@/core/interfaces/repositories/IUserRepository';

// Decorate/declare as injectable classes and its dependencies
decorate(injectable(), MemeRepository);
decorate(injectable(), MemeService);
decorate(injectable(), StorageService);
decorate(injectable(), DatabaseService); // a typeorm database connection
decorate(injectable(), MemeController);

decorate(injectable(), UserRepository);
decorate(injectable(), GithubService);
decorate(injectable(), OAuthController);

// Decorate/declare with inject the dependencies of our classes
// need to maintain the order of injection in target classes based on its constructors
decorate(inject(DI_TYPES.ConnectionOptions), DatabaseService, 0);
decorate(named('DatabaseConnectionOptions'), DatabaseService, 0);

decorate(inject(DI_TYPES.DatabaseService), UserRepository, 0);
decorate(inject(DI_TYPES.DatabaseService), MemeRepository, 0);

decorate(inject(DI_TYPES.UserRepository), GithubService, 0);
decorate(inject(DI_TYPES.MemeRepository), MemeService, 0);
decorate(inject(DI_TYPES.StorageService), MemeService, 1);

decorate(inject(DI_TYPES.OAuthService), OAuthController, 0);
decorate(inject(DI_TYPES.MemeService), MemeController, 0);

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

container.bind<DatabaseService>(DI_TYPES.DatabaseService).to(DatabaseService); // self binding, only for create an instance
container.bind<IMemeRepository>(DI_TYPES.MemeRepository).to(MemeRepository);
container.bind<IUserRepository>(DI_TYPES.UserRepository).to(UserRepository);
container.bind<IStorageService>(DI_TYPES.StorageService).to(StorageService);
container.bind<IOAuthService>(DI_TYPES.OAuthService).to(GithubService);
container.bind<IMemeService>(DI_TYPES.MemeService).to(MemeService);
container.bind<IBaseController>(DI_TYPES.ApiController).to(MemeController);
container.bind<IBaseController>(DI_TYPES.ApiController).to(OAuthController);

export default container;
