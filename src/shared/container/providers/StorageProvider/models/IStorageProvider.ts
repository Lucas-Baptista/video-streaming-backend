import { UploadedPartDTO } from "../../../../../modules/video/dto/multipartUpload/CompleteMultipartUploadDTO";
import CreateMultipartUploadDTO from "../dto/CreateMultipartUploadDTO";
import { CreatePresignedURLsDTO } from "../dto/CreatePresignedURLsDTO";

export default interface IStorageProvider {
    createMultipartUpload(
        data: CreateMultipartUploadDTO,
    ): Promise<string>;

    createPresignedURLs(
        data: CreatePresignedURLsDTO,
    ): Promise<string>;

    completeMultipartUpload(
        key: string,
        uploadId: string,
        parts: UploadedPartDTO[],
    ): Promise<void>;

    abortMultipartUpload(
        key: string,
        uploadId: string,
    ): Promise<void>;
}