import { z } from "zod";

const email = z
  .string()
  .trim()
  .lowercase()
  .min(8, "Email must be at least 8 characters")
  .max(256, "Email must not exceed 60 characters")
  .email("Enter a valid email address");

const password = z
  .string()
  .trim()
  .min(6, "Password must be at least 6 characters long")
  .max(60, "Password must not exceed 60 characters");

const username = z
  .string()
  .trim()
  .lowercase()
  .min(4, "Username must be at least 4 characters long")
  .max(60, "Username must not exceed 60 characters");

const fullName = z
  .string()
  .trim()
  .min(4, "Full name must be at least 4 characters long")
  .max(60, "Full name must not exceed 60 characters");

export const registerUserSchema = z.object({
  email,
  username,
  password,
  fullName,
});

export const loginUserSchema = z.object({
  email,
  password,
});

export const resetForgetPasswordSchema = z.object({
  newPassword: password,
});

export const changeCurrentPasswordSchema = z.object({
  oldPassword: password,
  newPassword: password,
});

export const setPasswordSchema = z.object({
  newPassword: password,
});

export const updateUsernameSchema = z.object({
  username,
});

export const emailSchema = z.object({
  email,
});

export type registerUserInpurt = z.infer<typeof registerUserSchema>;
export type loginUserInput = z.infer<typeof loginUserSchema>;
export type resetForgetPasswordInput = z.infer<
  typeof resetForgetPasswordSchema
>;
export type changeCurrentPasswordInput = z.infer<
  typeof changeCurrentPasswordSchema
>;
export type setPasswordInput = z.infer<typeof setPasswordSchema>;
export type updateUsernameInput = z.infer<typeof updateUsernameSchema>;
export type emailInput = z.infer<typeof emailSchema>;
