import 'dotenv/config';
import 'reflect-metadata';
import app from './shared/infra/http/app';
import AppDataSource from './shared/infra/typeorm/data-source';
import { queueProvider } from './shared/container';
import { QUEUES } from './shared/container/providers/QueueProvider/constants/queues';
import path from 'path';

const PORT = 3000;

(async () => {
  await AppDataSource.initialize();
  await queueProvider.connect();
  // app.listen(PORT, () => console.log('Servidor iniciado 🚀'));

  const tempDir = path.resolve('tmp');
  await queueProvider.publish(
    QUEUES.UPLOAD_HLS,
    { tempDir, videoId: "302596a1-bae6-4160-ab55-c18e742fb32f" }
  );
})();
