import { z } from 'zod';
import { VideoMimeType } from '../../entities/VideoMimeType';

export const createVideoSchema = z.object({
  title: z.string(),

  description: z.string().optional(),

  size: z.string(),

  type: z.enum(VideoMimeType)
});

export type CreateVideoDTO = z.infer<
  typeof createVideoSchema
>;