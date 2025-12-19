"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullNameSchemaOnly = exports.verifySchema = exports.emailSchemaOnly = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("../../validations/common.schema");
const email = common_schema_1.emailSchema;
const fullName = common_schema_1.fullNameSchema;
exports.emailSchemaOnly = zod_1.z.object({
    email,
});
const otp = zod_1.z.string().regex(/^\d{6}$/, "OTP must be exactly 6 digits");
exports.verifySchema = zod_1.z.object({
    email,
    otp,
});
exports.fullNameSchemaOnly = zod_1.z.object({
    fullName,
});
