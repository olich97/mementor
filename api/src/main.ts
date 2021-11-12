//import 'reflect-metadata'; // We need this in order to use @Decorators
//import config from './config';
import express from 'express';
import config from './infrastructure/AppSettings';
import Logger from './infrastructure/Logger';

async function startServer() {
    const app = express(); 
    
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.listen(config.port, () => {
      Logger.info(`
        ***********************************************
        🐝 Server listening on port: ${config.port} 🐝
        -----------------------------------------------
      `);
    }).on('error', err => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();