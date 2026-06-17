import AppError from "../../../../shared/errors/AppError";
import Video from "../../entities/Video";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class ListAllVideoService {
    constructor(
        private videoRepository: IVideoRepository,
    ) { }

    public async execute(): Promise<Video[]> {
        const videos = await this.videoRepository.findAll();

        return videos;
    }
}