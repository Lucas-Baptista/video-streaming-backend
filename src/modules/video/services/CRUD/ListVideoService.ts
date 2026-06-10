import AppError from "../../../../shared/errors/AppError";
import Video from "../../entities/Video";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class ListVideoService {
    constructor(
        private videoRepository: IVideoRepository,
    ) { }

    public async execute(id: string): Promise<Video> {
        const video = await this.videoRepository.findById(id);

        if (!video) {
            throw new AppError('Video not found', 404);
        }

        return video;
    }
}