import path from "node:path";
import fs from "node:fs";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import { config } from "./config";
import type TransportStream from "winston-transport";

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

const transportsList: TransportStream[] = [infoFileRotate, errorFileRotate];

// Console logging
// Development: colorized, human-readable
// Production: JSON format for Docker logs aggregation
if (config.server.nodeEnv === "production") {
  // In production (Docker Swarm), also log to stdout
  // Docker captures this via `docker service logs`
  transportsList.push(
    new transports.Console({
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
    })
  );
} else {
  // Development: colorized console output
  transportsList.push(
    new transports.Console({
      level: "debug",
      format: consoleFormat,
      handleExceptions: true,
    })
  );
}

const logger = createLogger({
  level: logLevel,
  format: fileFormat,
  transports: transportsList,
  exceptionHandlers: [errorFileRotate],
  rejectionHandlers: [errorFileRotate],
  exitOnError: false,
});

export default logger;
