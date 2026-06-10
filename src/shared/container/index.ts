import VideoRepository from "../../modules/video/infra/typeorm/repositories/VideoRepository";
import IVideoRepository from "../../modules/video/repositories/IVideoRepository";

export const videoRepository: IVideoRepository = new VideoRepository();