import { S3Client } from "@aws-sdk/client-s3";
import { config } from "./config";

// S3 Client - created once and reused across all requests
export const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

export const S3_BUCKET_NAME = config.aws.s3BucketName;
