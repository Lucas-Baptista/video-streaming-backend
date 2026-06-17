import { mkdir, rm } from "fs/promises";
import IVideoRepository from "../../repositories/IVideoRepository";
import IStorageProvider from "../../../../shared/container/providers/StorageProvider/models/IStorageProvider";
import IQueueProvider from "../../../../shared/container/providers/QueueProvider/models/IQueueProvider";
import IVideoProcessingProvider from "../../../../shared/container/providers/VideoProcessingProvider/models/IVideoProcessingProvider ";
import path from "path";
import { QUEUES } from "../../../../shared/container/providers/QueueProvider/constants/queues";

export default class ProcessVideoService {
    constructor(
        private videoRepository: IVideoRepository,
        private storageProvider: IStorageProvider,
        private videoProcessingProvider: IVideoProcessingProvider,
        private queueProvider: IQueueProvider
    ) { }

    async execute(videoId: string) {
        const video = await this.videoRepository.findById(videoId);

        if (!video) {
            throw new Error('Video not found');
        }

        const tempDir = path.resolve('tmp', videoId);

        await mkdir(tempDir, { recursive: true });

        const signedUrl = await this.storageProvider.generateOriginalVideoDownloadUrl(video.storageKey as string);

        await this.videoProcessingProvider.generateHLS(signedUrl, tempDir);

        await this.queueProvider.publish(
            QUEUES.UPLOAD_HLS,
            { tempDir, videoId }
        )
    }
}