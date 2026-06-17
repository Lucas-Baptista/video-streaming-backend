import 'dotenv/config';
import { QUEUES } from './shared/container/providers/QueueProvider/constants/queues';
import { queueProvider, storageProvider } from './shared/container';
import UploadHLSService from './modules/video/services/HLS/UploadHLSService';
import AppDataSource from './shared/infra/typeorm/data-source';

(async () => {
    await AppDataSource.initialize();
    await queueProvider.connect();

    const uploadHLSService = new UploadHLSService(storageProvider);

    const uploadHLSFilesWorker = async () => {
        await queueProvider.consume(
            QUEUES.UPLOAD_HLS,
            async (message) => {
                await uploadHLSService.execute(message.tempDir, message.videoId)
            },
        );
    };

    await uploadHLSFilesWorker();

    console.log('Upload HLS Files Worker iniciado 🚀');
})();
