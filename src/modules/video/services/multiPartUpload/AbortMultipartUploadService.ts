import IStorageProvider from "../../../../shared/container/providers/StorageProvider/models/IStorageProvider";
import AppError from "../../../../shared/errors/AppError";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class AbortMultipartUploadService {
    constructor(
        private videoRepository: IVideoRepository,
        private storageProvider: IStorageProvider,
    ) { }

    async execute(
        storageKey: string,
        uploadId: string,
        videoId: string
    ) {
        const video = await this.videoRepository.findById(videoId);

        if (!video) {
            throw new AppError(
                'Video not found',
                404
            )
        }

        if (!video.uploadId) {
            throw new AppError(
                'Upload not initialized',
            );
        }

        await this.storageProvider.abortMultipartUpload(
            storageKey,
            uploadId,
        );

        await this.videoRepository.delete(
            video.id,
        );

    }
}