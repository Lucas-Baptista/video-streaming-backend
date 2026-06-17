import { UploadedPartDTO } from "../../../../../modules/video/dto/multipartUpload/CompleteMultipartUploadDTO";
import CreateMultipartUploadDTO from "../dto/CreateMultipartUploadDTO";
import { CreateMultipartUploladPresignedURLsDTO } from "../dto/CreatePresignedURLsDTO";

export default interface IStorageProvider {
    createMultipartUpload(data: CreateMultipartUploadDTO): Promise<string>;

    createMultipartUploladPresignedURLs(data: CreateMultipartUploladPresignedURLsDTO): Promise<string>;

    completeMultipartUpload(
        key: string,
        uploadId: string,
        parts: UploadedPartDTO[],
    ): Promise<void>;

    abortMultipartUpload(
        key: string,
        uploadId: string,
    ): Promise<void>;

    deleteVideoAssets(key: string): Promise<void>;

    generateOriginalVideoDownloadUrl(key: string): Promise<string>;

    uploadHLSFile(
        localPath: string, 
        storageKey: string, 
        contentType?: string
    ): Promise<void>;
}