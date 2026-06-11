import 'dotenv/config';
import { queueProvider, videoRepository } from './shared/container';
import { QUEUES } from './shared/container/providers/QueueProvider/queues';
import ProcessVideoService from './modules/video/services/processing/ProcessVideoService';
import AppDataSource from './shared/infra/typeorm/data-source';

(async () => {
  await AppDataSource.initialize();
  await queueProvider.connect();

  const processVideoService = new ProcessVideoService(videoRepository);

  const worker = async () => {
    await queueProvider.consume(
      QUEUES.PROCESS_VIDEO,
      async (message) => {
        await processVideoService.execute(message.videoId);
      },
    );
  };

  await worker();

  console.log('Worker iniciado 🚀');
})();
