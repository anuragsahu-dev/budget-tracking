import { z } from "zod";
import { fullNameSchema } from "../../validations/common.schema";

export const updateProfileSchema = z.object({
  fullName: fullNameSchema,
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
