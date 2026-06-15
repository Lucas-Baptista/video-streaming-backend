import IStorageProvider from "../../../../shared/container/providers/StorageProvider/models/IStorageProvider";
import AppError from "../../../../shared/errors/AppError";
import { CreatPresignedUrlsDTO } from "../../dto/multipartUpload/CreatPresignedUrlsDTO";
import { CreatPresignedUrlsResponseDTO } from "../../dto/multipartUpload/CreatPresignedUrlsResponseDTO";
import IVideoRepository from "../../repositories/IVideoRepository";


export default class CreateMultipartUploladPresignedURLsService {
  constructor(
    private videoRepository: IVideoRepository,
    private storageProvider: IStorageProvider,
  ) { }

  async execute(
    videoId: string,
    data: CreatPresignedUrlsDTO,
  ): Promise<CreatPresignedUrlsResponseDTO> {
    const video = await this.videoRepository.findById(
      videoId,
    );

    if (!video) {
      throw new AppError(
        'Video not found',
        404,
      );
    }

    const uploadUrls = await Promise.all(
      Array.from(
        { length: data.parts },
        async (_, index) => ({
          partNumber: index + 1,
          uploadUrl: await this.storageProvider.createMultipartUploladPresignedURLs({
            key: video.storageKey as string,
            uploadId: video.uploadId,
            partNumber: index + 1
          }),
        }),
      ),
    )

    return {
      uploadUrls,
    };
  }
}