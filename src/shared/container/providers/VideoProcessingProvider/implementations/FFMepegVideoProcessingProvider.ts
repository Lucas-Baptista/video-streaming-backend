import { mkdir, writeFile } from "fs/promises";
import AVAILABLE_VARIANTS from "../constants/variants";
import IVideoProcessingProvider from "../models/IVideoProcessingProvider ";
import execAsync from "../utils/execAsync";
import path from "path";
import execFFmpeg from "../utils/execAsync";

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

export default class FFMepegVideoProcessingProvider implements IVideoProcessingProvider {

    private async getMetadata(inputUrl: string): Promise<VideoMetadata> {
        const command = [
            'ffprobe',
            '-v error',
            '-select_streams v:0',
            '-show_entries stream=width,height',
            '-of csv=s=x:p=0',
            `"${inputUrl}"`
        ].join(' ');

        const { stdout } = await execAsync(command);

        const [width, height] = stdout
            .trim()
            .split('x')
            .map(Number);

        return {
            width,
            height,
        };
    }

    private getAvailableVariants(
        metadata: VideoMetadata
    ): Variant[] {

        return AVAILABLE_VARIANTS.filter(
            variant => variant.height <= metadata.height
        );
    }

    private async generateVariant(
        inputUrl: string,
        outputDir: string,
        variant: Variant
    ): Promise<void> {

        const command = [
            'ffmpeg',
            `-i "${inputUrl}"`,
            `-vf "scale=-2:${variant.height}"`,
            '-c:v libx264',
            '-preset ultrafast',
            '-c:a aac',
            '-hls_time 10',
            '-hls_playlist_type vod',
            `-hls_segment_filename "${outputDir}/segment_%03d.ts"`,
            `"${outputDir}/index.m3u8"`
        ].join(' ');

        await execFFmpeg(command);
    }

    private async generateMasterPlaylist(
        outputDir: string,
        variants: Variant[]
    ): Promise<void> {

        const lines: string[] = [
            '#EXTM3U',
            ''
        ];

        for (const variant of variants) {
            lines.push(
                `#EXT-X-STREAM-INF:BANDWIDTH=${variant.bandwidth},RESOLUTION=${variant.resolution}`
            );
            lines.push(
                `${variant.name}/index.m3u8`
            );
            lines.push('');
        }

        await writeFile(
            path.join(outputDir, 'master.m3u8'),
            lines.join('\n')
        );
    }

    async generateHLS(
        inputUrl: string,
        outputDir: string,
    ): Promise<void> {

        const metadata =
            await this.getMetadata(inputUrl);

        const variants =
            this.getAvailableVariants(metadata);

        console.log(
            '[HLS] Variants',
            variants.map(v => v.name)
        );

        for (const variant of variants) {
            const variantDir = path.join(
                outputDir,
                variant.name
            );

            await mkdir(
                variantDir,
                { recursive: true }
            );

            console.time(`variant-${variant.name}`);

            await this.generateVariant(
                inputUrl,
                variantDir,
                variant
            );

            console.timeEnd(
                `variant-${variant.name}`
            );
        }

        await this.generateMasterPlaylist(
            outputDir,
            variants
        );
    }

}