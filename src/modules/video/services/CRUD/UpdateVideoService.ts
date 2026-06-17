import AppError from "../../../../shared/errors/AppError";
import Video from "../../entities/Video";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class UpdateVideoService {
    constructor(
        private videoRepository: IVideoRepository,
    ) { }

    public async execute(id: string, data: Partial<Video>): Promise<Video> {
        const video = await this.videoRepository.update(id, data);
        return video;
    }
}