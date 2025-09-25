import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

type TokenExpiry = `${number}${"s" | "m" | "h" | "d"}`;

function getEnvVariable(key: string): string {
  const secretFilePath = process.env[`${key}_FILE`];
  if (secretFilePath && fs.existsSync(secretFilePath)) {
    return fs.readFileSync(secretFilePath, "utf8").trim();
  }

  const value = process.env[key]?.trim();
  if (!value) throw new Error(`Environment variable "${key}" is not set`);
  return value;
}

const tokenExpiryRegex = /^\d+[smhd]$/;

function validateTokenExpiry(value: string): TokenExpiry {
  if (tokenExpiryRegex.test(value)) return value as TokenExpiry;
  throw new Error(`Invalid token expiry format: ${value}`);
}

export const config = {
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
    accessTokenExpiry: validateTokenExpiry(
      getEnvVariable("ACCESS_TOKEN_EXPIRY")
    ),
    refreshTokenExpiry: validateTokenExpiry(
      getEnvVariable("REFRESH_TOKEN_EXPIRY")
    ),
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
} as const; // this as const make this object only readonly
