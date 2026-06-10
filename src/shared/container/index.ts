import VideoRepository from "../../modules/video/infra/typeorm/repositories/VideoRepository";
import IVideoRepository from "../../modules/video/repositories/IVideoRepository";
import R2StorageProvider from "./providers/StorageProvider/implementations/R2StorageProvider";
import IStorageProvider from "./providers/StorageProvider/models/IStorageProvider";

export const videoRepository: IVideoRepository = new VideoRepository();
export const storageProvider: IStorageProvider = new R2StorageProvider();
