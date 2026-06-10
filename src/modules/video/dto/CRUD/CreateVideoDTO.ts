import z from "zod";
import { videoSchema } from "../VideoSchema";

export const createVideoSchema = videoSchema.pick({
  title: true,
  description: true,
  size: true,
  mimeType: true,
});

export type CreateVideoDTO = z.infer<
  typeof createVideoSchema
>;