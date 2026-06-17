import IStorageProvider from "../../../../shared/container/providers/StorageProvider/models/IStorageProvider";
import IVideoRepository from "../../repositories/IVideoRepository";

export default class DeleteVideoService {
    constructor(
        private videoRepository: IVideoRepository,
        private storageProvider: IStorageProvider,
    ) { }

    public async execute(id: string): Promise<void> {
        await this.videoRepository.delete(id);
        await this.storageProvider.deleteVideoAssets(id);
    }
}