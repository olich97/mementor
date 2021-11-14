import 'reflect-metadata'; // We need this in order to use @Decorators
//import config from './config';
import express from 'express';
import { createConnection } from 'typeorm';
import { MemeService } from './core/services/MemeService';
import config from './infrastructure/AppSettings';
import Logger from './infrastructure/Logger';
import { StorageService } from './infrastructure/StorageService';
import { ContentMapping } from './infrastructure/typeorm/mappings/ContentMapping';
import { MemeMapping } from './infrastructure/typeorm/mappings/MemeMapping';
import { MemeRepository } from './infrastructure/typeorm/repositories/MemeRepository';

async function startServer() {
  // Only for testing
  Logger.info(config.database.mappingsPath);
  const connection = await createConnection({
    type: 'postgres',
    url: config.database.url,
    entities: [MemeMapping, ContentMapping],
  }); //`${__dirname}/infrastructure/typeorm/mappings/*`

  const memeRepository = new MemeRepository(connection);
  const storageService = new StorageService();
  const memeService = new MemeService(memeRepository, storageService);

  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.get('/', async (req, res) => {
    try {
      //const result = await memeService.list(5, 100);
      const skip = req.query.skip || 0;
      const take = req.query.take || 100;
      const keyword = req.query.search || '';
      const result = await memeService.searchByText(
        parseInt(skip.toString()),
        parseInt(take.toString()),
        keyword.toString(),
      );
      Logger.info(result.length);
      res.send(result.map(item => item.text));
    } catch (error) {
      Logger.error(error);
    }
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
