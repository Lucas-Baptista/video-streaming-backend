import { videoRepository } from "../../../../shared/container";
import VideoStatus from "../../entities/VideoStatus";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class ProcessVideoService {
    
    constructor(
        private videoRepository: IVideoRepository,
    ) { }

    async execute(videoId: string) {
        const video = await this.videoRepository.findById(videoId);

        if (!video) {
            throw new Error('Video not found');
        }

        console.log('INICIANDO O PROCESSAMENTO DO VIDEO')

        await new Promise(resolve =>
            setTimeout(resolve, 5000),
        );

        console.log('PROCESSAMENTO DO VIDEO FINALIZADO')

        await videoRepository.update(video.id, { status: VideoStatus.READY });
    }
}