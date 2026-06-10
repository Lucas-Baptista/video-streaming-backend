import CreateMultipartUploadDTO from "../dto/CreateMultipartUploadDTO";
import { CreatePresignedURLsDTO } from "../dto/CreatePresignedURLsDTO";

export default interface IStorageProvider {
    createMultipartUpload(
        data: CreateMultipartUploadDTO,
    ): Promise<string>;

    createPresignedURLs(
        data: CreatePresignedURLsDTO,
    ): Promise<string>;
}