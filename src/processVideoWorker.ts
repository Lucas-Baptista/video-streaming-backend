import 'dotenv/config';
import { queueProvider, storageProvider, videoProcessingProvider, videoRepository } from './shared/container';
import { QUEUES } from './shared/container/providers/QueueProvider/constants/queues';
import ProcessVideoService from './modules/video/services/processing/ProcessVideoService';
import AppDataSource from './shared/infra/typeorm/data-source';

(async () => {
  await AppDataSource.initialize();
  await queueProvider.connect();

  const processVideoService = new ProcessVideoService(
    videoRepository, 
    storageProvider, 
    videoProcessingProvider,
    queueProvider
  );

  const processVideoWorker = async () => {
    await queueProvider.consume(
      QUEUES.PROCESS_VIDEO,
      async (message) => {
        await processVideoService.execute(message.videoId);
      },
    );
  };

  await processVideoWorker();

  console.log('Process Video Worker iniciado 🚀');
})();
