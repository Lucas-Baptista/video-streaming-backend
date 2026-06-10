import CreateMultipartUploadDTO from "../dto/CreateMultipartUploadDTO";

export default interface IStorageProvider {
    createMultipartUpload(
        data: CreateMultipartUploadDTO,
    ): Promise<string>;
}