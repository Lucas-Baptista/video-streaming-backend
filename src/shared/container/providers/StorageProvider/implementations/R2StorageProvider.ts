import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CreateMultipartUploadDTO from "../dto/CreateMultipartUploadDTO";
import IStorageProvider from "../models/IStorageProvider";
import { NodeHttpHandler } from '@smithy/node-http-handler';
import https from 'https';
import {
    AbortMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommand,
    DeleteObjectCommand, DeleteObjectsCommand, GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
    UploadPartCommand
} from '@aws-sdk/client-s3';
import { UploadedPartDTO } from "../../../../../modules/video/dto/multipartUpload/CompleteMultipartUploadDTO";
import { createReadStream } from "fs";
import { CreateMultipartUploladPresignedURLsDTO } from "../dto/CreatePresignedURLsDTO";


export default class R2StorageProvider implements IStorageProvider {
    private r2Client: S3Client;

    constructor() {
        this.r2Client = new S3Client({
            region: 'auto',
            endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID!,
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
            },
            requestHandler: new NodeHttpHandler({
                httpsAgent: new https.Agent({
                    keepAlive: true,
                    maxSockets: 100,
                    maxFreeSockets: 20,
                }),
            }),
        });
    }

    async createMultipartUpload({ contentType, key }: CreateMultipartUploadDTO): Promise<string> {
        const command = new CreateMultipartUploadCommand({
            Bucket: process.env.R2_ORIGINALS_BUCKET,
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

    async createMultipartUploladPresignedURLs({
        key,
        uploadId,
        partNumber,
    }: CreateMultipartUploladPresignedURLsDTO): Promise<string> {
        const command = new UploadPartCommand({
            Bucket: process.env.R2_ORIGINALS_BUCKET,
            Key: key,
            UploadId: uploadId,
            PartNumber: partNumber
        });

        return await getSignedUrl(
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
                Bucket: process.env.R2_ORIGINALS_BUCKET,
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
            Bucket: process.env.R2_ORIGINALS_BUCKET,
            Key: key,
            UploadId: uploadId,
        })

        await this.r2Client.send(command);
    }

    async deleteVideoAssets(videoId: string) {
        const prefix = `videos/${videoId}`;

        // Delete original file
        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_ORIGINALS_BUCKET,
            Key: `${prefix}/original`,
        });

        await this.r2Client.send(command);

        // Delete HLS files
        let continuationToken: string | undefined;
        do {
            const response = await this.r2Client.send(
                new ListObjectsV2Command({
                    Bucket: process.env.R2_HLS_BUCKET,
                    Prefix: prefix,
                    ContinuationToken: continuationToken,
                }),
            );

            const objects =
                response.Contents?.map((obj) => ({
                    Key: obj.Key!,
                })) ?? [];

            if (objects.length > 0) {
                await this.r2Client.send(
                    new DeleteObjectsCommand({
                        Bucket: process.env.R2_HLS_BUCKET,
                        Delete: {
                            Objects: objects,
                        },
                    }),
                );
            }

            continuationToken = response.NextContinuationToken;
        } while (continuationToken);

    }

    async generateOriginalVideoDownloadUrl(key: string): Promise<string> {
        const command =
            new GetObjectCommand({
                Bucket: process.env.R2_ORIGINALS_BUCKET,
                Key: key,
            });

        return await getSignedUrl(
            this.r2Client,
            command,
            { expiresIn: 3600 }
        );
    }

    async uploadHLSFile(localPath: string, storageKey: string, contentType?: string): Promise<void> {
        await this.r2Client.send(
            new PutObjectCommand({
                Bucket: process.env.R2_HLS_BUCKET,
                Key: storageKey,
                Body: createReadStream(localPath),
                ContentType: contentType
            })
        )
    }


}