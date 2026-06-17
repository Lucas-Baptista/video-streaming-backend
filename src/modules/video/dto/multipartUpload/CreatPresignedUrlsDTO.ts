import { z } from 'zod';

export const creatPresignedUrlschema = z.object({
  parts: z.number().min(1).max(10000),
});

export type CreatPresignedUrlsDTO = z.infer<
  typeof creatPresignedUrlschema
>;