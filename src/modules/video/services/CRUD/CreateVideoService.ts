import { CreateVideoDTO } from "../../dto/CreateVideoDTO";
import Video from "../../entities/Video";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class CreateVideoService {
    constructor(
        private videoRepository: IVideoRepository,
    ) { }

    async execute(data: CreateVideoDTO): Promise<Video> {
        const video = await this.videoRepository.create(data);
        return video;
    }
}