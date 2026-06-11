import execAsync from "../../../../utils/execAsync";
import IVideoProcessingProvider from "../models/IVideoProcessingProvider ";

export default class FFMepegVideoProcessingProvider implements IVideoProcessingProvider {
    async generateHLS(inputUrl: string, outputDir: string): Promise<void> {
        const command = [
            "ffmpeg",
            `-i "${inputUrl}"`,
            "-codec:v libx264",
            "-codec:a aac",
            "-hls_time 10",
            "-hls_playlist_type vod",
            `-hls_segment_filename "${outputDir}/segment_%03d.ts"`,
            `"${outputDir}/master.m3u8"`
        ].join(" ");

        await execAsync(command);

    }

}