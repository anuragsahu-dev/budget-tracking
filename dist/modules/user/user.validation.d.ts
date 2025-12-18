import { z } from "zod";
export declare const updateProfileSchema: z.ZodObject<{
    fullName: z.ZodString;
}, z.core.$strip>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
