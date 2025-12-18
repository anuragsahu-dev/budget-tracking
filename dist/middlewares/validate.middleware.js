"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const error_middleware_1 = require("./error.middleware");
const validate = (schemas) => (req, _res, next) => {
    try {
        if (schemas.body) {
            const parsed = schemas.body.safeParse(req.body);
            if (!parsed.success) {
                throw new error_middleware_1.ApiError(400, "Invalid request body", parsed.error.issues.map((i) => i.message));
            }
            req.validatedBody = parsed.data;
        }
        if (schemas.params) {
            const parsed = schemas.params.safeParse(req.params);
            if (!parsed.success) {
                throw new error_middleware_1.ApiError(400, "Invalid URL parameters", parsed.error.issues.map((i) => i.message));
            }
            req.validatedParams = parsed.data;
        }
        if (schemas.query) {
            const parsed = schemas.query.safeParse(req.query);
            if (!parsed.success) {
                throw new error_middleware_1.ApiError(400, "Invalid query parameters", parsed.error.issues.map((i) => i.message));
            }
            req.validatedQuery = parsed.data;
        }
        return next();
    }
    catch (err) {
        return next(err);
    }
};
exports.validate = validate;
