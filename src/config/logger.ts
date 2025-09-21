import path from "node:path";
import fs from "node:fs";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "./config";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logLevel = config.server.nodeEnv === "production" ? "info" : "debug";

const fileFormat = format.combine(
  format.errors({ stack: true }),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.json()
);

const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.simple()
);

const infoFileRotate = new DailyRotateFile({
  level: logLevel,
  filename: path.join(logDir, "app-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  handleExceptions: true,
  maxSize: "20m",
  maxFiles: "14d",
  format: fileFormat,
});

const errorFileRotate = new DailyRotateFile({
  level: "error",
  filename: path.join(logDir, "error-%DATE%.log"),
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  handleExceptions: true,
  maxSize: "20m",
  maxFiles: "21d",
  format: fileFormat,
});

const logger = createLogger({
  level: logLevel,
  format: fileFormat,
  transports: [
    new transports.Console({ format: consoleFormat }),
    infoFileRotate,
    errorFileRotate,
  ],
  exceptionHandlers: [errorFileRotate],
  rejectionHandlers: [errorFileRotate],
  exitOnError: false,
});

export default logger;

/*
🔹 Why errors go to both app-YYYY-MM-DD.log and error-YYYY-MM-DD.log

Single place for all logs (app.log)

If you want to see the full story of your app (info → warn → error), you open app-YYYY-MM-DD.log.

This file gives context like:

User logged in (info)

DB query took long (warn)

Query failed (error)

Without errors in app.log, you’d lose continuity.

Dedicated file for errors (error.log)

Sometimes you only care about failures (e.g., DevOps scanning logs for crashes).

Having a dedicated error file makes it faster to grep/search and integrate into alerting systems.

Example: Your monitoring agent only tails error.log to trigger alerts, not the entire app log.
*/
