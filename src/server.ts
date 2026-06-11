import 'dotenv/config';
import 'reflect-metadata';
import app from './shared/infra/http/app';
import AppDataSource from './shared/infra/typeorm/data-source';
import { queueProvider } from './shared/container';

const PORT = 3000;

(async () => {
  await AppDataSource.initialize();
  await queueProvider.connect();
  app.listen(PORT, () => console.log('Servidor iniciado 🚀'));
})();
