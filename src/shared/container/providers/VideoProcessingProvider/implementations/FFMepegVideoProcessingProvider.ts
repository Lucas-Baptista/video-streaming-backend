import {
    mkdir,
    rename,
    unlink,
} from 'fs/promises';
import path from 'path';
import AVAILABLE_VARIANTS from '../constants/variants';
import IVideoProcessingProvider from '../models/IVideoProcessingProvider ';
import downloadFile from '../../../../utils/downloadFile';
import execCommand from '../../../../utils/execCommand';
import execFFmpeg from '../../../../utils/execFFmpeg';

export interface VideoMetadata {
    width: number;
    height: number;
}

export interface Variant {
    name: string;
    height: number;
    bandwidth: number;
    resolution: string;
}

export default class FFMepegVideoProcessingProvider
    implements IVideoProcessingProvider {

    private async getMetadata(inputPath: string): Promise<VideoMetadata> {
        const command = [
            'ffprobe',
            '-v error',
            '-select_streams v:0',
            '-show_entries stream=width,height',
            '-of csv=s=x:p=0',
            `"${inputPath}"`,
        ].join(' ');

        const { stdout } = await execCommand(command);

        const [width, height] = stdout
            .trim()
            .split('x')
            .map(Number);

        return {
            width,
            height,
        };
    }

    private getAvailableVariants(metadata: VideoMetadata): Variant[] {
        return AVAILABLE_VARIANTS.filter(
            variant =>
                variant.height <= metadata.height,
        );
    }

    private async generateMultiVariantHLS(
        inputPath: string,
        outputDir: string,
        variants: Variant[],
    ): Promise<void> {

        const splitOutputs = variants.map((_, index) => `[v${index}]`).join('');

        const filterParts: string[] = [];

        filterParts.push(
            `[0:v]split=${variants.length}${splitOutputs}`,
        );

        variants.forEach((variant, index,) => {
            filterParts.push(
                `[v${index}]scale=-2:${variant.height}[out${index}]`,
            );
        },
        );

        const commandParts: string[] = [
            'ffmpeg',
            '-y',
            `-i "${inputPath}"`,
            `-filter_complex "${filterParts.join(';')}"`,
        ];

        variants.forEach((variant, index) => {
            commandParts.push(`-map "[out${index}]"`);
            commandParts.push('-map 0:a:0');
            commandParts.push(`-c:v:${index} libx264`);
            commandParts.push(
                `-b:v:${index} ${Math.floor(
                    variant.bandwidth / 1000,
                )}k`,
            )
        });

        commandParts.push('-c:a aac');
        commandParts.push('-preset ultrafast');
        commandParts.push('-f hls');
        commandParts.push('-hls_time 10');
        commandParts.push('-hls_playlist_type vod');
        commandParts.push( '-master_pl_name master.m3u8');

        const varStreamMap = variants.map((_, index) =>`v:${index},a:${index}`).join(' ');

        commandParts.push(`-var_stream_map "${varStreamMap}"`);
        commandParts.push(`-hls_segment_filename "${outputDir}/%v/segment_%03d.ts"`);
        commandParts.push(`"${outputDir}/%v/index.m3u8"`);
        const command = commandParts.join(' ');

        console.log('[FFMPEG] Starting transcoding');

        const progressCommand = `${command} -progress pipe:1 -nostats`;

        await execFFmpeg(progressCommand);

        console.log('[FFMPEG] Finished transcoding');
    }

    private async renameVariantDirectories(
        outputDir: string,
        variants: Variant[],
    ): Promise<void> {

        for (let index = 0; index < variants.length; index++) {
            const oldPath = path.join(outputDir, String(index));

            const newPath = path.join(outputDir, variants[index].name);

            await rename(oldPath, newPath);
        }
    }

    async generateHLS(
        inputUrl: string,
        outputDir: string,
    ): Promise<void> {

        const startedAt = Date.now();

        console.log('[HLS] Starting processing');

        await mkdir(outputDir, { recursive: true });

        const localVideoPath = path.join(outputDir, 'original.mp4');

        console.log('[DOWNLOAD] Starting download',);

        console.time('download');

        await downloadFile(inputUrl, localVideoPath);

        console.timeEnd('download');

        console.log('[DOWNLOAD] Finished download');

        console.log('[HLS] Reading metadata');

        const metadata = await this.getMetadata(localVideoPath);

        console.log('[HLS] Metadata', metadata);

        const variants = this.getAvailableVariants(metadata);

        console.log('[HLS] Variants', variants.map(v => v.name));

        for (let index = 0; index < variants.length; index++) {

            await mkdir(path.join(outputDir, String(index)), { recursive: true });
        }

        console.time('ffmpeg');

        await this.generateMultiVariantHLS(
            localVideoPath,
            outputDir,
            variants,
        );

        console.log('[HLS] Renaming directories',);

        await this.renameVariantDirectories(outputDir, variants);

        console.log('[HLS] Removing original file');

        await unlink(localVideoPath);

        console.timeEnd('ffmpeg');

        console.log('[HLS] Completed');

        const elapsed = (Date.now() - startedAt) / 1000;

        console.log(`[HLS] Total time: ${Math.round(elapsed)}s`);
    }
}