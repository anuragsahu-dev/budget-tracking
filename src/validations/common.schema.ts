import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Enter a valid email address")
  .trim()
  .toLowerCase();

export const fullNameSchema = z
  .string()
  .trim()
  .min(4, "Full name must be at least 4 characters long")
  .max(60, "Full name must not exceed 60 characters");

export const ulidSchema = z.string().ulid("Invalid ULID format").trim();
