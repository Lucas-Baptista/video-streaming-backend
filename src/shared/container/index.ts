import VideoRepository from "../../modules/video/infra/typeorm/repositories/VideoRepository";
import IVideoRepository from "../../modules/video/repositories/IVideoRepository";
import RabbitMQProvider from "./providers/QueueProvider/implementations/RabbitMQProvider";
import IQueueProvider from "./providers/QueueProvider/models/IQueueProvider";
import R2StorageProvider from "./providers/StorageProvider/implementations/R2StorageProvider";
import IStorageProvider from "./providers/StorageProvider/models/IStorageProvider";
import FFMepegVideoProcessingProvider from "./providers/VideoProcessingProvider/implementations/FFMepegVideoProcessingProvider";
import IVideoProcessingProvider from "./providers/VideoProcessingProvider/models/IVideoProcessingProvider ";

export const videoRepository: IVideoRepository = new VideoRepository();
export const storageProvider: IStorageProvider = new R2StorageProvider();
export const queueProvider: IQueueProvider = new RabbitMQProvider();
export const videoProcessingProvider: IVideoProcessingProvider = new FFMepegVideoProcessingProvider();
