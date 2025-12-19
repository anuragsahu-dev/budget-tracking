"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3_BUCKET_NAME = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("./config");
exports.s3Client = new client_s3_1.S3Client({
    region: config_1.config.aws.region,
    credentials: {
        accessKeyId: config_1.config.aws.accessKeyId,
        secretAccessKey: config_1.config.aws.secretAccessKey,
    },
});
exports.S3_BUCKET_NAME = config_1.config.aws.s3BucketName;
