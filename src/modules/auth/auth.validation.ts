import { z } from "zod";

import { emailSchema, fullNameSchema } from "../../validations/common.schema";

const email = emailSchema;
const fullName = fullNameSchema;

export const emailSchemaOnly = z.object({
  email,
});

export type EmailInput = z.infer<typeof emailSchemaOnly>;

const otp = z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits");

export const verifySchema = z.object({
  email,
  otp,
});

export type VerifyInput = z.infer<typeof verifySchema>;

export const fullNameSchemaOnly = z.object({
  fullName,
});

export type FullNameInput = z.infer<typeof fullNameSchemaOnly>;
