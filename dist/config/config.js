"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function getEnvVariable(key) {
    const secretFilePath = process.env[`${key}_FILE`];
    if (secretFilePath && node_fs_1.default.existsSync(secretFilePath)) {
        return node_fs_1.default.readFileSync(secretFilePath, "utf8").trim();
    }
    const value = process.env[key]?.trim();
    if (!value)
        throw new Error(`Environment variable "${key}" is not set`);
    return value;
}
const tokenExpiryRegex = /^\d+[smhd]$/;
function validateTokenExpiry(value) {
    if (tokenExpiryRegex.test(value))
        return value;
    throw new Error(`Invalid token expiry format: ${value}`);
}
exports.config = {
    server: {
        port: Number(getEnvVariable("PORT")),
        nodeEnv: getEnvVariable("NODE_ENV"),
        clientUrl: getEnvVariable("CLIENT_URL"),
    },
    database: {
        url: getEnvVariable("DATABASE_URL"),
    },
    auth: {
        accessTokenSecret: getEnvVariable("ACCESS_TOKEN_SECRET"),
        refreshTokenSecret: getEnvVariable("REFRESH_TOKEN_SECRET"),
        accessTokenExpiry: validateTokenExpiry(getEnvVariable("ACCESS_TOKEN_EXPIRY")),
        refreshTokenExpiry: validateTokenExpiry(getEnvVariable("REFRESH_TOKEN_EXPIRY")),
    },
    smtp: {
        host: getEnvVariable("SMTP_HOST"),
        port: Number(getEnvVariable("SMTP_PORT")),
        user: getEnvVariable("SMTP_USER"),
        pass: getEnvVariable("SMTP_PASS"),
    },
    redis: {
        port: Number(getEnvVariable("REDIS_PORT")),
        host: getEnvVariable("REDIS_HOST"),
    },
    bcrypt: {
        salt_rounds: Number(getEnvVariable("SALT_ROUNDS")),
    },
    url: {
        email_verification: getEnvVariable("APP_URL"),
        forget_password: getEnvVariable("FORGOT_PASSWORD_REDIRECT_URL"),
    },
    google: {
        clientId: getEnvVariable("GOOGLE_CLIENT_ID"),
        clientSecret: getEnvVariable("GOOGLE_CLIENT_SECRET"),
        callbackUrl: getEnvVariable("GOOGLE_CALLBACK_URL"),
    },
    razorpay: {
        keyId: getEnvVariable("RAZORPAY_KEY_ID"),
        keySecret: getEnvVariable("RAZORPAY_KEY_SECRET"),
        webhookSecret: getEnvVariable("RAZORPAY_WEBHOOK_SECRET"),
    },
    aws: {
        region: getEnvVariable("AWS_REGION"),
        accessKeyId: getEnvVariable("AWS_ACCESS_KEY_ID"),
        secretAccessKey: getEnvVariable("AWS_SECRET_ACCESS_KEY"),
        s3BucketName: getEnvVariable("AWS_S3_BUCKET_NAME"),
    },
};
