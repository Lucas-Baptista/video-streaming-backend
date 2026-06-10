import { z } from 'zod';

export const uploadedPartSchema = z.object({
  partNumber: z.number(),

  etag: z.string(),
});

export type UploadedPartDTO = z.infer<
  typeof uploadedPartSchema
>;

export const completeMultipartUploadSchema =
  z.object({
    parts: z.array(uploadedPartSchema),
  });

export type CompleteMultipartUploadDTO =
  z.infer<
    typeof completeMultipartUploadSchema
  >;