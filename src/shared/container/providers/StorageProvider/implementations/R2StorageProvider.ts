import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CreateMultipartUploadDTO from "../dto/CreateMultipartUploadDTO";
import { CreatePresignedURLsDTO } from "../dto/CreatePresignedURLsDTO";
import IStorageProvider from "../models/IStorageProvider";
import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand, DeleteObjectCommand, GetObjectCommand, ListMultipartUploadsCommand, S3Client, UploadPartCommand } from '@aws-sdk/client-s3';
import { UploadedPartDTO } from "../../../../../modules/video/dto/multipartUpload/CompleteMultipartUploadDTO";


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

    async completeMultipartUpload(key: string, uploadId: string, parts: UploadedPartDTO[]): Promise<void> {
        const command =
            new CompleteMultipartUploadCommand({
                Bucket: process.env.R2_BUCKET,
                Key: key,
                UploadId: uploadId,
                MultipartUpload: {
                    Parts: parts.map(part => ({
                        ETag: part.etag,
                        PartNumber: part.partNumber,
                    })),
                },
            });

        await this.r2Client.send(command);
    }

    async abortMultipartUpload(key: string, uploadId: string): Promise<void> {
        const command = new AbortMultipartUploadCommand({
            Bucket: process.env.R2_BUCKET,
            Key: key,
            UploadId: uploadId,
        })

        await this.r2Client.send(command);
    }

    async deleteVideoAssets(videoId: string) {
        const keys = [
            `videos/${videoId}/original`,
        ];

        await Promise.all(
            keys.map(key =>
                this.r2Client.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.R2_BUCKET,
                        Key: key,
                    }),
                ),
            ),
        );
    }

    async generateDownloadUrl(key: string): Promise<string> {
        const command =
            new GetObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: key,
            });

        return await getSignedUrl(
            this.r2Client,
            command,
            { expiresIn: 3600 }
        );
    }


}