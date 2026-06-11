export default interface IVideoProcessingProvider {
  generateHLS(
    inputUrl: string,
    outputDir: string,
  ): Promise<void>;
}