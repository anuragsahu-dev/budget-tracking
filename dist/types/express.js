"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidatedBody = getValidatedBody;
exports.getValidatedParams = getValidatedParams;
exports.getValidatedQuery = getValidatedQuery;
function getValidatedBody(req) {
    return (req.validatedBody ?? {});
}
function getValidatedParams(req) {
    return (req.validatedParams ?? {});
}
function getValidatedQuery(req) {
    return (req.validatedQuery ?? {});
}
