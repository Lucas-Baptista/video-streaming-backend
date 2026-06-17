import {
    access,
    readFile,
    writeFile,
} from 'fs/promises';

interface ManifestData {
    version: number;
    uploaded: Record<string, boolean>;
}

export default class UploadManifest {

    private data: ManifestData = {
        version: 1,
        uploaded: {},
    };

    constructor(
        private manifestPath: string,
    ) { }

    async load(): Promise<void> {

        try {

            await access(
                this.manifestPath,
            );

            const content =
                await readFile(
                    this.manifestPath,
                    'utf8',
                );

            this.data =
                JSON.parse(
                    content,
                );

        } catch {

            await this.save();
        }
    }

    isUploaded(
        relativePath: string,
    ): boolean {

        return Boolean(
            this.data.uploaded[
                relativePath
            ],
        );
    }

    markUploaded(
        relativePath: string,
    ): void {

        this.data.uploaded[
            relativePath
        ] = true;
    }

    getUploadedCount(): number {

        return Object.keys(
            this.data.uploaded,
        ).length;
    }

    async save(): Promise<void> {

        await writeFile(
            this.manifestPath,
            JSON.stringify(
                this.data,
                null,
                2,
            ),
        );
    }
}