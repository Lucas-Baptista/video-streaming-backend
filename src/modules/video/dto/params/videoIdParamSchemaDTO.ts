import z from "zod";

export const videoIdParamSchema = z.object({
    id: z.uuid(),
});
