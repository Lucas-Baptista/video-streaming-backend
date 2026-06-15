import path from "path";
import IStorageProvider from "../../../../shared/container/providers/StorageProvider/models/IStorageProvider";
import listFilesRecursively from "../../../../shared/utils/listFilesRecursively";
import getContentType from "../../../../shared/utils/getContentType";
import pLimit from 'p-limit';

export default class UploadHLSService {
    constructor(
        private storageProvider: IStorageProvider
    ) { }

    async execute(
        localDir: string,
        videoId: string
    ) {
        const files = await listFilesRecursively(localDir)

        const limit = pLimit(5);
        
        let uploaded = 0;

        console.time(`Tempo-upload`);

        await Promise.all(
            files.map((file) =>
                limit(async () => {
                    const relativePath =
                        path.relative(
                            localDir,
                            file,
                        );

                    const storageKey =
                        path.posix.join(
                            'videos',
                            videoId,
                            'hls',
                            relativePath.replaceAll(
                                '\\',
                                '/',
                            ),
                        );

                    await this.storageProvider.uploadFile(
                        file,
                        storageKey,
                        getContentType(file),
                    );

                    uploaded++;

                    console.log(
                        `[UPLOAD] ${uploaded}/${files.length}`,
                    );
                }),
            ),
        );

        console.timeEnd(`Tempo-upload`);
    }
}