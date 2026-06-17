import fs, { rm } from 'fs/promises';
import path from 'path';
import pLimit from 'p-limit';

import IStorageProvider from '../../../../shared/container/providers/StorageProvider/models/IStorageProvider';
import listFilesRecursively from '../../../../shared/utils/listFilesRecursively';
import getContentType from '../../../../shared/utils/getContentType';
import VideoStatus from '../../entities/VideoStatus';
import IVideoRepository from '../../repositories/IVideoRepository';

interface CheckpointDTO {
    files: string[];
}

export default class UploadHLSService {

    private readonly CONCURRENCY = 50;

    private readonly CHECKPOINT_INTERVAL = 25;

    private readonly MAX_RETRIES = 3;

    constructor(
        private storageProvider: IStorageProvider,
        private videoRepository: IVideoRepository
    ) { }

    public async execute(
        localDir: string,
        videoId: string,
    ): Promise<void> {
        console.time('[UPLOAD] TOTAL');

        const checkpointPath = path.join(
            localDir,
            'checkpoint.json',
        );

        const tmpVideoDir = path.join(
            localDir,
            videoId,
        );

        const checkpoint = await this.loadCheckpoint(checkpointPath);

        const uploadedFiles = new Set(checkpoint.files);

        const allFiles = await listFilesRecursively(tmpVideoDir);

        const files = allFiles.filter(file => {
            const relativePath = path
                .relative(tmpVideoDir, file)
                .replaceAll('\\', '/');

            return !uploadedFiles.has(relativePath);
        });

        const totalFiles = uploadedFiles.size + files.length;

        let uploaded = uploadedFiles.size;

        console.log(`${uploaded > 0 ? '[UPLOAD] Retomando upload.' : '[UPLOAD] Iniciando upload.'} ${uploaded}/${totalFiles} já enviados`);

        const limit = pLimit(this.CONCURRENCY);

        let lastCheckpointCount = uploadedFiles.size;

        const results = await Promise.allSettled(
            files.map(file => limit(
                async () => {
                    const relativePath = path
                        .relative(tmpVideoDir, file)
                        .replaceAll('\\', '/');

                    const storageKey = path.posix.join(
                        'videos',
                        videoId,
                        'hls',
                        relativePath,
                    );

                    console.time(`[FILE] ${relativePath}`);

                    await this.uploadWithRetry(file, storageKey);

                    uploadedFiles.add(relativePath,);

                    console.timeEnd(`[FILE] ${relativePath}`)

                    uploaded += 1;

                    if (uploadedFiles.size - lastCheckpointCount >= this.CHECKPOINT_INTERVAL) {
                        await this.saveCheckpoint(
                            checkpointPath,
                            uploadedFiles,
                        );

                        lastCheckpointCount = uploadedFiles.size;
                    }

                    if (uploaded % 10 === 0 || uploaded === totalFiles) {
                        console.log(`[UPLOAD] ${uploaded}/${totalFiles}`);
                    }

                }))
        );

        await this.saveCheckpoint(
            checkpointPath,
            uploadedFiles,
        );

        const failedFiles = results.filter(result => result.status === 'rejected');

        if (failedFiles.length > 0) {

            console.error(`[UPLOAD] ${failedFiles.length} arquivos falharam`);

            failedFiles.forEach(result => {
                if (result.status === 'rejected') {
                    console.error(result.reason);
                }
            });

            throw new Error(`Upload incompleto. ${failedFiles.length} arquivos falharam.`);
        }

        await fs.rm(checkpointPath, { force: true });

        await fs.rm(tmpVideoDir, {
            recursive: true,
            force: true,
        });

        await this.videoRepository.update(
            videoId,
            {
                status: VideoStatus.READY,
                processedStorageKey: `videos/${videoId}/hls/master.m3u8`,
                manifestUrl: `${process.env.R2_HLS_BUCKET_PUBLIC_URL}/videos/${videoId}/hls/master.m3u8`
            },
        );

        console.log('[UPLOAD] Finalizado com sucesso');

        console.timeEnd('[UPLOAD] TOTAL');
    }

    private async uploadWithRetry(
        file: string,
        storageKey: string,
    ): Promise<void> {

        let attempt = 0;

        while (attempt < this.MAX_RETRIES) {
            try {
                await this.storageProvider.uploadHLSFile(
                    file,
                    storageKey,
                    getContentType(file),
                );

                return;

            } catch (error: any) {

                attempt += 1;

                const retryable =
                    error?.code === 'ECONNRESET'
                    || error?.name === 'TimeoutError';

                console.error(`[UPLOAD RETRY ${attempt}/${this.MAX_RETRIES}] ${file}`);

                if (!retryable || attempt >= this.MAX_RETRIES) throw error;

                const delay = attempt * 2000;

                await new Promise(resolve => setTimeout(resolve, delay));
            }

        }

    }

    private async loadCheckpoint(
        checkpointPath: string,
    ): Promise<CheckpointDTO> {

        try {
            const content = await fs.readFile(checkpointPath, 'utf8');
            return JSON.parse(content) as CheckpointDTO;
        } catch {
            return { files: [] };
        }

    }

    private async saveCheckpoint(
        checkpointPath: string,
        uploadedFiles: Set<string>,
    ): Promise<void> {

        await fs.writeFile(
            checkpointPath,
            JSON.stringify(
                { files: [...uploadedFiles] },
                null,
                2,
            ),
        );

    }

}