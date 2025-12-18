"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("../../validations/common.schema");
exports.updateProfileSchema = zod_1.z.object({
    fullName: common_schema_1.fullNameSchema,
});
