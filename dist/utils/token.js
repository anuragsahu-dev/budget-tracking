"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTemporaryToken = generateTemporaryToken;
const node_crypto_1 = __importDefault(require("node:crypto"));
function generateTemporaryToken() {
    const unHashedToken = node_crypto_1.default.randomBytes(32).toString("hex");
    const hashedToken = node_crypto_1.default
        .createHash("sha256")
        .update(unHashedToken)
        .digest("hex");
    const tokenExpiry = new Date(Date.now() + 20 * 60 * 1000);
    return { unHashedToken, hashedToken, tokenExpiry };
}
