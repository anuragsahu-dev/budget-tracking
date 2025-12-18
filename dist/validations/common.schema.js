"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ulidSchema = exports.fullNameSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z
    .string()
    .email("Enter a valid email address")
    .trim()
    .toLowerCase();
exports.fullNameSchema = zod_1.z
    .string()
    .trim()
    .min(4, "Full name must be at least 4 characters long")
    .max(60, "Full name must not exceed 60 characters");
exports.ulidSchema = zod_1.z.string().ulid("Invalid ULID format").trim();
