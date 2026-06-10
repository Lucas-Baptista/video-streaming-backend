import { z } from "zod";
import { videoSchema } from "../VideoSchema";

export const updateVideoSchema =
  videoSchema.partial();

export type UpdateVideoDTO = z.infer<
  typeof updateVideoSchema
>;