import { mkdir } from "fs/promises";
import { videoRepository } from "../../../../shared/container";
import VideoStatus from "../../entities/VideoStatus";
import IVideoRepository from "../../repositories/IVideoRepository";
import IStorageProvider from "../../../../shared/container/providers/StorageProvider/models/IStorageProvider";
import IVideoProcessingProvider from "../../../../shared/container/providers/VideoProcessingProvider/models/IVideoProcessingProvider ";
import path from "path";

export default class ProcessVideoService {
    
    constructor(
        private videoRepository: IVideoRepository,
        private storageProvider: IStorageProvider,
        private videoProcessingProvider: IVideoProcessingProvider
    ) { }

    async execute(videoId: string) {
        const video = await this.videoRepository.findById(videoId);

        if (!video) {
            throw new Error('Video not found');
        }

        const tempDir = path.resolve('tmp', videoId);

        await mkdir(tempDir, { recursive: true });

        const signedUrl = await this.storageProvider.generateDownloadUrl(video.storageKey as string);

        await this.videoProcessingProvider.generateHLS(signedUrl, tempDir)

        await videoRepository.update(video.id, { status: VideoStatus.READY });
    }
}