import IVideoRepository from "../../repositories/IVideoRepository";

export default class DeleteVideoService {
    constructor(
        private videoRepository: IVideoRepository,
    ) { }

    public async execute(id: string): Promise<void> {
        await this.videoRepository.delete(id);
    }
}