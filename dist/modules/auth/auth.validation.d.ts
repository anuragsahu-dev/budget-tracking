import { z } from "zod";
export declare const emailSchemaOnly: z.ZodObject<{
    email: z.ZodString;
}, z.core.$strip>;
export type EmailInput = z.infer<typeof emailSchemaOnly>;
export declare const verifySchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, z.core.$strip>;
export type VerifyInput = z.infer<typeof verifySchema>;
export declare const fullNameSchemaOnly: z.ZodObject<{
    fullName: z.ZodString;
}, z.core.$strip>;
export type FullNameInput = z.infer<typeof fullNameSchemaOnly>;
