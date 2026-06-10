import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CreateMultipartUploadDTO from "../dto/CreateMultipartUploadDTO";
import { CreatePresignedURLsDTO } from "../dto/CreatePresignedURLsDTO";
import IStorageProvider from "../models/IStorageProvider";
import { CreateMultipartUploadCommand, S3Client, UploadPartCommand } from '@aws-sdk/client-s3';


export default class R2StorageProvider implements IStorageProvider {
    private r2Client: S3Client;

    constructor() {
        this.r2Client = new S3Client({
            region: "auto",

            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,

            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
        });
    }

    async createMultipartUpload({ contentType, key }: CreateMultipartUploadDTO): Promise<string> {
        const command = new CreateMultipartUploadCommand({
            Bucket: process.env.R2_BUCKET,
            Key: key,
            ContentType: contentType
        });

        const { UploadId } = await this.r2Client.send(command);

        if (!UploadId) {
            throw new Error(
                'Failed to create multipart upload',
            );
        }

        return UploadId;
    }

    createPresignedURLs({
        key,
        uploadId,
        partNumber,
    }: CreatePresignedURLsDTO): Promise<string> {
        const command = new UploadPartCommand({
            Bucket: process.env.R2_BUCKET,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber
        });

        return getSignedUrl(
            this.r2Client,
            command,
            {
                expiresIn: 3600,
            }
        )
    }

}