import IStorageProvider from "../../../../shared/container/providers/StorageProvider/models/IStorageProvider";
import { CreateVideoDTO } from "../../dto/CRUD/CreateVideoDTO";
import Video from "../../entities/Video";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class CreateVideoService {
    constructor(
        private videoRepository: IVideoRepository,
        private storageProvider: IStorageProvider
    ) { }
    
    async execute(data: CreateVideoDTO): Promise<Video> {
        const video = await this.videoRepository.create(data);

        const storageKey = `videos/${video.id}/original`
        const uploadId = await this.storageProvider.createMultipartUpload({
            key: storageKey,
            contentType: video.mimeType
        })

        const updatedVideo = await this.videoRepository.update(video.id, {
            storageKey,
            uploadId
        });

        return updatedVideo;
    }
}