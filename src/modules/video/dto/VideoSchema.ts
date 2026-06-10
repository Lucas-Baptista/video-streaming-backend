import { z } from 'zod';
import VideoMimeType from '../entities/VideoMimeType';
import VideoStatus from '../entities/VideoStatus';


export const videoSchema = z.object({
  title: z.string(),

  description: z.string().optional(),

  size: z.string(),

  mimeType: z.enum(VideoMimeType),

  status: z.enum(VideoStatus),

  uploadId: z.string().optional(),

  storageKey: z.string().optional(),

  processedStorageKey: z.string().optional(),

  manifestUrl: z.string().optional(),
});