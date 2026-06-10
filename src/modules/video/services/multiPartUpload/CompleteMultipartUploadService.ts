import IStorageProvider from "../../../../shared/container/providers/StorageProvider/models/IStorageProvider";
import AppError from "../../../../shared/errors/AppError";
import { CompleteMultipartUploadDTO } from "../../dto/multipartUpload/CompleteMultipartUploadDTO";
import VideoStatus from "../../entities/VideoStatus";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class CompleteMultipartUploadService {
    constructor(
        private videoRepository: IVideoRepository,
        private storageProvider: IStorageProvider
    ) { }

    async execute(
        videoId: string,
        data: CompleteMultipartUploadDTO
    ): Promise<void> {
        const video = await this.videoRepository.findById(videoId);

        if (!video) {
            throw new AppError(
                'video not found',
                404
            )
        }

        if (!video.uploadId) {
            throw new AppError(
                'Upload not initialized',
                404
            )
        }

        await this.storageProvider.completeMultipartUpload(
            video.storageKey as string,
            video.uploadId,
            data.parts
        )

        await this.videoRepository.update(video.id, { status: VideoStatus.PROCESSING });
    }
}