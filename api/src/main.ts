import 'reflect-metadata'; // We need this in order to use @Decorators
//import config from './config';
import express from 'express';
import config from './infrastructure/AppSettings';
import Logger from './infrastructure/Logger';
import container from './api/di/DependencyConfiguration';
import DI_TYPES from './api/di/DependencyTypes';
import { IBaseController } from './api/controllers/IBaseController';
import cors from 'cors';

async function startServer() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // allow cors requests from any origin and with credentials
  app.use(cors());

  // grabs the Controller from IoC container and registers the endpoints
  const controllers: IBaseController[] = container.getAll<IBaseController>(DI_TYPES.ApiController);
  controllers.forEach(controller => {
    controller.register(app);
    Logger.info(`Registered: ${controller.constructor.name}`);
  });

  app
    .listen(config.port, () => {
      Logger.info(`
        ***********************************************
        🐝 Server listening on port: ${config.port} 🐝
        -----------------------------------------------
      `);
    })
    .on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
